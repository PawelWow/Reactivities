using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator m_mediator;

        public ChatHub(IMediator mediator)
        {
            m_mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            string userName = this.GetUsername();
            command.Username = userName;

            var comment = await m_mediator.Send(command);

            await base.Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }

        public async Task AddToGroup(string groupName)
        {
            await base.Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            string userName = this.GetUsername();
            await base.Clients.Group(groupName).SendAsync("Send", $"{userName} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await base.Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            string userName = this.GetUsername();
            await base.Clients.Group(groupName).SendAsync("Send", $"{userName} has left the group");
        }

        private string GetUsername()
        {
            return base.Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
    }
}