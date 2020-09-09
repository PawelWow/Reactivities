using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).NotEmpty();// .Password(); TODO bo password brakuje
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext m_context;
            private readonly UserManager<AppUser> m_userManager;
            private readonly IJwtGenerator m_jwtGenerator;

            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                m_context = context;
                m_userManager = userManager;
                m_jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellation)
            {
                if(await m_context.Users.Where(x => x.Email == request.Email).AnyAsync())
                {
                    throw CreateBadRequestException(new { Email = "Email already exists!" });
                }

                if(await m_context.Users.Where(x => x.UserName == request.Username).AnyAsync())
                {
                    throw CreateBadRequestException(new { Username = "Username already exists" });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await m_userManager.CreateAsync(user, request.Password);

                if(result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = m_jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new Exception("Problem creating user!");
            }
            /// <summary>
            /// Upraszcza rzucanie errorów rózniących się tylko treścią błedów
            /// </summary>
            /// <param name="errors">Obiekt opisujący bład</param>
            /// <returns></returns>
            private RestException CreateBadRequestException(object errors)
            {
                return new RestException(HttpStatusCode.BadRequest, errors);
            }
        }



    }
}
