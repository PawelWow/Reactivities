using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public string Bio { get; set; }


        public virtual ICollection<UserActivity> UserActivities { get; set; }

        /// <summary>
        /// Photos collection
        /// </summary>
        public virtual ICollection<Photo> Photos { get; set; }

        public virtual ICollection<UserFollowing> Followings { get; set; }

        public virtual ICollection<UserFollowing> Followers { get; set; }

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }

        /// <summary>
        /// Initializes <see cref="Photos"/>
        /// </summary>
        public AppUser()
        {
            this.Photos = new Collection<Photo>();
        }
    }
}
