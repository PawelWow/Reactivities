using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext m_context;

            private readonly IMapper m_mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                m_context = context;
                m_mapper = mapper;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // tutaj można wrzucić cancellation do ToListAsync...
                var activities = await m_context.Activities.Include(x => x.UserActivities).ThenInclude(x => x.AppUser).ToListAsync();
                return m_mapper.Map<List<Activity>, List<ActivityDto>>(activities);
            }
        }
    }
}
