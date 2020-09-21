using Application.interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    /// <summary>
    /// Updateuje display name i bio aktualnie zalogowanego użytkownika
    /// </summary>
    public class Update
    {
        public class Command : IRequest
        {

            public string DisplayName { get; set; }

            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(prop => prop.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext m_context;
            private readonly IUserAccessor m_userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                m_context = context;
                m_userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername());

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio ?? request.Bio;

                var success = await m_context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes...");
            }
        }
    }
}
