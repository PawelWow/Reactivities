using Application.Errors;
using Application.interfaces;
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

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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
                var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername());

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not Found..." });
                }

                var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
                currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await m_context.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes...");
            }
        }
    }
}
