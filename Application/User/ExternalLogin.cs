using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
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
                if (user == null)
                {
                    user = await this.CreateUser(userInfo);
                }

                return new User
                {
                    DisplayName = user.DisplayName,
                    Token = m_jwtGenerator.CreateToken(user),
                    Username = user.UserName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };
            }

            /// <summary>
            /// Creates new user in database for facebook login
            /// </summary>
            /// <param name="userInfo">User descriptor</param>
            /// <returns>User</returns>
            private async Task<AppUser> CreateUser(FacebookUserInfo userInfo)
            {
                AppUser user = new AppUser
                {
                    DisplayName = userInfo.Name,
                    Id = userInfo.Id,
                    Email = userInfo.Email,
                    UserName = $"fb_{userInfo.Id}"
                };

                var photo = new Photo
                {
                    // to distinguish from cloudinary photo
                    Id = $"fb_{userInfo.Id}",
                    Url = userInfo.Picture.Data.Url,
                    IsMain = true
                };

                user.Photos.Add(photo);

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
