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
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext m_context;
            private readonly IUserAccessor m_userAccessor;
            private readonly IPhotoAccessor m_photoAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                m_context = context;
                m_userAccessor = userAccessor;
                m_photoAccessor = photoAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername());

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (photo == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not found" });
                }

                if (photo.IsMain)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo" });
                }

                var result = m_photoAccessor.DeletePhoto(photo.Id);
                if(request == null)
                {
                    throw new Exception("Problem deleting photo");
                }

                user.Photos.Remove(photo);

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
