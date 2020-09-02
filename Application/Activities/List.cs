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
        public class Query : IRequest<List<Activity>> { }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext m_context;

            public Handler(DataContext context)
            {
                m_context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // tutaj można wrzucić cancellation do ToListAsync...
                var activities = await m_context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}
