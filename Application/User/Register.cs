using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext m_context;
            private readonly UserManager<AppUser> m_userManager;
            private readonly IEmailSender m_emailSender;

            public Handler(DataContext context, UserManager<AppUser> userManager,  IEmailSender emailSender)
            {
                m_context = context;
                m_userManager = userManager;
                m_emailSender = emailSender;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellation)
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
                if(!result.Succeeded)
                {
                    throw new Exception("Problem creating user!");
                }

                var token = await m_userManager.GenerateEmailConfirmationTokenAsync(user);
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var verifyUrl = $"{request.Origin}/user/vierifyEmail?token={token}&email={request.Email}";

                var message = $"<p>Click the link below to verify your email address:</p><p><a href='{verifyUrl}'>{verifyUrl}</a></p>";

                await m_emailSender.SendEmailAsync(request.Email, "Please verify email address", message);

                return Unit.Value;


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
