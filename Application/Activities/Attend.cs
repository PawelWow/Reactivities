using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Attend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellation)
            {
                var activity = await m_context.Activities.FindAsync(request.Id);

                if(activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity" });
                }

                var user = await m_context.Users.SingleOrDefaultAsync(x => x.UserName == m_userAccessor.GetCurrentUsername());

                var attendance = await m_context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);

                if(attendance != null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Already attending this activity" });
                }

                attendance = new UserActivity
                {
                    Activity = activity,
                    AppUser = user,
                    IsHost = false,
                    DateJoined = DateTime.Now
                };

                m_context.UserActivities.Add(attendance);

                var isSuccess = await m_context.SaveChangesAsync() > 0;
                if (isSuccess)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes...");
            }
        }
    }
}
