using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class ExternalLogin
    {
        public class Query : IRequest<User>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> m_userManager;
            private readonly IFacebookAccessor m_facebookAccessor;
            private readonly IJwtGenerator m_jwtGenerator;

            public Handler(UserManager<AppUser> userManager, IFacebookAccessor facebookAccessor, IJwtGenerator jwtGenerator)
            {
                m_userManager = userManager;
                m_facebookAccessor = facebookAccessor;
                m_jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await m_facebookAccessor.FacebookLogin(request.AccessToken);
                if (userInfo == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });
                }

                var user = await m_userManager.FindByEmailAsync(userInfo.Email);

                var refreshToken = m_jwtGenerator.GenerateRefreshtoken();

                if (user != null)
                {
                    user.RefreshTokens.Add(refreshToken);
                    await m_userManager.UpdateAsync(user);

                } else
                {
                    user = await this.CreateUser(userInfo, refreshToken);
                }

                return new User(user, m_jwtGenerator, refreshToken.Token);
            }

            /// <summary>
            /// Creates new user in database for facebook login
            /// </summary>
            /// <param name="userInfo">User descriptor</param>
            /// <returns>User</returns>
            private async Task<AppUser> CreateUser(FacebookUserInfo userInfo, Domain.RefreshToken refreshToken)
            {
                AppUser user = new AppUser
                {
                    DisplayName = userInfo.Name,
                    Id = userInfo.Id,
                    Email = userInfo.Email,
                    UserName = $"fb_{userInfo.Id}",

                    //facebook confirmed
                    EmailConfirmed = true
                };

                var photo = new Photo
                {
                    // to distinguish from cloudinary photo
                    Id = $"fb_{userInfo.Id}",
                    Url = userInfo.Picture.Data.Url,
                    IsMain = true
                };

                user.Photos.Add(photo);
                user.RefreshTokens.Add(refreshToken);

                var result = await m_userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user" });
                }

                return user;

            }
        }

    }
}
