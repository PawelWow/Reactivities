using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
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

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                var photoUploadResult = m_photoAccessor.AddPhoto(request.File);

                var user = await m_context.Users.SingleOrDefaultAsync(x => x.UserName == m_userAccessor.GetCurrentUsername());

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if(!user.Photos.Any(p => p.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var success = await m_context.SaveChangesAsync() > 0;

                if (success)
                {
                    return photo;
                }

                throw new Exception("Problem saving photo");
            }
        }
    }
}
