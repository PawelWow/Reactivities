using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext m_context;

            private readonly IMapper m_mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                m_context = context;
                m_mapper = mapper;
            }
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await m_context.Activities
                    .Include(x => x.UserActivities)
                    .ThenInclude(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);


                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not found" });
                }

                var activityToReturn = m_mapper.Map<Activity, ActivityDto>(activity);

                return activityToReturn;
            }
        }
    }
}
