using Application.Errors;
using Application.interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Persistence;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext m_context;
        private readonly IUserAccessor m_userAccessor;

        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            m_context = context;
            m_userAccessor = userAccessor;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (user== null)
            {
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });
            }

            var currentUser = await m_context.Users.SingleOrDefaultAsync(u => u.UserName == m_userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };

            if (currentUser.Followings.Any(f => f.TargetId == user.Id))
            {
                profile.IsFollowed = true;
            }

            return profile;
        }
    }
}
