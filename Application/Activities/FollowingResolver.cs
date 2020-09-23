using Application.interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Persistence;
using System.Linq;

namespace Application.Activities
{

    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext m_context;
        private readonly IUserAccessor m_userAccessor;

        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            m_context = context;
            m_userAccessor = userAccessor;
        }

        /// <summary>
        /// Checks if currently loggged in user is following the given user  
        /// </summary>
        /// <param name="source">Needed for <see cref="UserActivity.AppUserId"/>. </param>
        /// <param name="destination">Not used</param>
        /// <param name="destMember">Not use</param>
        /// <param name="context">Not use</param>
        /// <returns></returns>
        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = m_context.Users
                .SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername())
                .Result;

            
            return currentUser.Followings.Any(f => f.TargetId == source.AppUserId);
        }
    }
}
