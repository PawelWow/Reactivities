using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext m_context;

            public Handler(DataContext context)
            {
                m_context = context;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);

                return new Profile
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Image = user.Photos.FirstOrDefault(i => i.IsMain)?.Url,
                    Photos = user.Photos,
                    Bio = user.Bio
                };
            }
        }
    }
}
