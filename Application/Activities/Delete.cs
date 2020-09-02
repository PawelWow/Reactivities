using MediatR;
using Persistance;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext m_context;

            public Handler(DataContext context)
            {
                m_context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await m_context.Activities.FindAsync(request.Id);

                if (activity == null)
                {
                    throw new Exception("Could not find activity");
                }

                m_context.Remove(activity);

                var success = await m_context.SaveChangesAsync() > 0;

                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");

            }
        }
    }
}
