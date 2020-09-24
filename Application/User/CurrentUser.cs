using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class CurrentUser
    {

        public class Query : IRequest<User> {  }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> m_userManager;
            private readonly IJwtGenerator m_jwtGenerator;
            private readonly IUserAccessor m_userAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                m_userManager = userManager;
                m_jwtGenerator = jwtGenerator;
                m_userAccessor = userAccessor;

            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await m_userManager.FindByNameAsync(m_userAccessor.GetCurrentUsername());

                var refreshToken = m_jwtGenerator.GenerateRefreshtoken();
                user.RefreshTokens.Add(refreshToken);

                await m_userManager.UpdateAsync(user);

                return new User(user, m_jwtGenerator, refreshToken.Token);

            }
        }
    }
}
