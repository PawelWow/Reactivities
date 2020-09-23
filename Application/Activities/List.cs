using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
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

            public Query(int? limit, int? offset)
            {
                this.Limit = limit;
                this.Offset = offset;
            }


        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext m_context;

            private readonly IMapper m_mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                m_context = context;
                m_mapper = mapper;
            }

            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var querable = m_context.Activities.AsQueryable();

                var activities = await querable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = m_mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivitiesCount = querable.Count()
                };
            }
        }
    }
}
