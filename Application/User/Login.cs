﻿using Application.Errors;
using Application.interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class Login
    { 
        public class Query : IRequest<User> 
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> m_userManager;
            private readonly SignInManager<AppUser> m_signInManager;
            private readonly IJwtGenerator m_jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                m_userManager = userManager;
                m_signInManager = signInManager;
                m_jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await m_userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                if (!user.EmailConfirmed)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email is not confirmed " });
                }

                var result = await m_signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (!result.Succeeded)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                var refreshToken = m_jwtGenerator.GenerateRefreshtoken();
                user.RefreshTokens.Add(refreshToken);

                await m_userManager.UpdateAsync(user);

                return new User(user, m_jwtGenerator, refreshToken.Token);
            }
        }
    
    }
}
