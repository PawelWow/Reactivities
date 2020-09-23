using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            private readonly DataContext m_context;
            public Handler(DataContext context)
            {
                m_context = context;
            }

            public async Task<List<UserActivityDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await m_context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });


                List<UserActivity> activities = this.FilterActivities(user.UserActivities, request.Predicate);
                List<UserActivityDto> activitiesToReturn = new List<UserActivityDto>();

                foreach (var activity in activities)
                {
                    var userActivity = new UserActivityDto
                    {
                        Id = activity.Activity.Id,
                        Title = activity.Activity.Title,
                        Category = activity.Activity.Category,
                        Date = activity.Activity.Date
                    };

                    activitiesToReturn.Add(userActivity);
                }

                return activitiesToReturn;
            }

            /// <summary>
            /// Gives filtered list according to given conditions
            /// </summary>
            /// <param name="activities">All user activities</param>
            /// <param name="predicate">Predicate</param>
            /// <returns>Filtered actiities</returns>
            private List<UserActivity> FilterActivities(ICollection<UserActivity> activities, string predicate)
            {
                IQueryable<UserActivity> filteredActivities = activities.OrderBy(a => a.Activity.Date).AsQueryable();

                switch (predicate)
                {
                    case "past":
                        filteredActivities = filteredActivities.Where(a => a.Activity.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        filteredActivities = filteredActivities.Where(a => a.IsHost);
                        break;
                    default:
                        filteredActivities = filteredActivities.Where(a => a.Activity.Date >= DateTime.Now);
                        break;
                }

                return filteredActivities.ToList();
            }
        }
    }
}
