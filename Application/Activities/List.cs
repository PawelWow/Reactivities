using Application.interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }

            public int ActivitiesCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelope> 
        {
            public int? Limit { get; set; }

            public int? Offset { get; set; }
            public bool IsGoing { get; }
            public bool IsHost { get; }
            public DateTime? StartDate { get; }

            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                this.Limit = limit;
                this.Offset = offset;
                this.IsGoing = isGoing;
                this.IsHost = isHost;
                this.StartDate = startDate ?? DateTime.Now;
            }


        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext m_context;

            private readonly IMapper m_mapper;
            private readonly IUserAccessor m_userAccesor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccesor)
            {
                m_context = context;
                m_mapper = mapper;
                m_userAccesor = userAccesor;
            }

            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var filteredActivities = this.FilterActivities(request);
                var activities = await filteredActivities.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = m_mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivitiesCount = filteredActivities.Count()
                };
            }

            /// <summary>
            /// Gives filtered activities according to query.
            /// </summary>
            /// <param name="request">Filter data</param>
            /// <returns>Filtered activities list</returns>
            private IQueryable<Activity> FilterActivities(Query request)
            {
                IQueryable<Activity> activitiesQuerable = m_context.Activities
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (request.IsGoing && !request.IsGoing)
                {
                    activitiesQuerable = activitiesQuerable
                        .Where(x => x.UserActivities.Any(a => a.AppUser.UserName == m_userAccesor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.IsGoing)
                {
                    activitiesQuerable = activitiesQuerable
                        .Where(x => x.UserActivities
                            .Any(a => a.AppUser.UserName == m_userAccesor.GetCurrentUsername() && a.IsHost));
                }

                return activitiesQuerable;
            }
        }
    }
}
