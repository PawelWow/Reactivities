using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class RefreshToken
    {
        public class Command : IRequest<User> 
        {
            public string RefreshToken { get; set; }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<AppUser> m_userManager;
            private readonly IJwtGenerator m_jwtGenerator;
            private readonly IUserAccessor m_userAccesor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccesor)
            {
                m_userManager = userManager;
                m_jwtGenerator = jwtGenerator;
                m_userAccesor = userAccesor;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await m_userManager.FindByNameAsync(m_userAccesor.GetCurrentUsername());

                var oldToken = user.RefreshTokens.SingleOrDefault(t => t.Token == request.RefreshToken);

                if (oldToken != null && !oldToken.IsActive)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                // oldToken.IsActive == true
                if(oldToken != null)
                {
                    oldToken.Revoked = DateTime.UtcNow;
                }

                var newRefreshToken = m_jwtGenerator.GenerateRefreshtoken();
                user.RefreshTokens.Add(newRefreshToken);

                await m_userManager.UpdateAsync(user);

                return new User(user, m_jwtGenerator, newRefreshToken.Token);
            }
        }
    }
}
