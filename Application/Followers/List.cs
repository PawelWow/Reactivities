using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Username { get; set; }

            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext m_context;
            private readonly IProfileReader m_profileReader;


            public Handler(DataContext context, IProfileReader profileReader)
            {
                m_context = context;
                m_profileReader = profileReader;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = m_context.Followings.AsQueryable();

                var userFollowings = new List<UserFollowing>();

                List<Profile> profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        userFollowings = await queryable.Where(u => u.Target.UserName == request.Username).ToListAsync();

                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await m_profileReader.ReadProfile(follower.Observer.UserName));
                        }

                        break;
                    case "following":
                        userFollowings = await queryable.Where(u => u.Observer.UserName == request.Username).ToListAsync();

                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await m_profileReader.ReadProfile(follower.Target.UserName));
                        }

                        break;
                }

                return profiles;
            }
        }
    }
}
