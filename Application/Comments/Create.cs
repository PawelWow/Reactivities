using Application.Errors;
using AutoMapper;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }

            public Guid ActivityId { get; set; }

            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext m_context;
            private readonly IMapper m_mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                m_context = context;
                m_mapper = mapper;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await m_context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not found" });
                }

                var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);

                Comment comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreateAt = DateTime.Now
                };


                bool isSuccess = await m_context.SaveChangesAsync() > 0;
                if (isSuccess)
                {
                    return m_mapper.Map<CommentDto>(comment);
                }

                throw new Exception("Problem saving changes...");
            }
        }
    }
}
