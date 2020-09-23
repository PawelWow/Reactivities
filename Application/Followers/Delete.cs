using Application.Errors;
using Application.interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
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
                var observer = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername());


                var target = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);

                if (target == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { User = "There is no such user." });
                }

                var following = await m_context.Followings
                            .SingleOrDefaultAsync(f => f.ObserverId == observer.Id && f.TargetId == target.Id);

                if (following == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You were not observing that user." });
                }

                m_context.Followings.Remove(following);

                bool isSuccess = await m_context.SaveChangesAsync() > 0;
                if (isSuccess)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes...");
            }
        }
    }
}
