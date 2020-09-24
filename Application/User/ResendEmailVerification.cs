using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class ResendEmailVerification
    {
        public class Query : IRequest
        {
            public string Email { get; set; }

            public string Origin { get; set; }
        }

        public class Handler : IRequestHandler<Query>
        {
            private readonly UserManager<AppUser> m_userManager;
            private readonly IEmailSender m_emailSender;

            public Handler(UserManager<AppUser> userManager, IEmailSender emailSender)
            {
                m_userManager = userManager;
                m_emailSender = emailSender;
            }

            public async Task<Unit> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await m_userManager.FindByEmailAsync(request.Email);

                var token = await m_userManager.GenerateEmailConfirmationTokenAsync(user);
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/vierifyEmail?token={token}&email={request.Email}";

                var message = $"<p>Click the link below to verify your email address:</p><p><a href='{verifyUrl}'>{verifyUrl}</a></p>";

                await m_emailSender.SendEmailAsync(request.Email, "Please verify email address", message);

                return Unit.Value;
            }
        }
    }
}
