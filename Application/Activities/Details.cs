using Domain;
using MediatR;
using Persistance;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext m_context;
            public Handler(DataContext context)
            {
                m_context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await m_context.Activities.FindAsync(request.Id);
                return activity;
            }
        }
    }
}
