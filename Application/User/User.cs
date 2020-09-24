using Application.interfaces;
using Domain;
using System.Linq;
using System.Text.Json.Serialization;

namespace Application.User
{
    public class User
    {
        public string DisplayName { get; set; }

        public string Token { get; set; }

        public string Username { get; set; }

        public string Image { get; set; }

        // do not include refresh token when received this User object
        [JsonIgnore]
        public string RefreshToken { get; set; }

        public User(AppUser user, IJwtGenerator jwtGenerator, string refreshToken)
        {
            this.DisplayName = user.DisplayName;
            this.Token = jwtGenerator.CreateToken(user);
            this.Username = user.UserName;
            this.Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url;
            this.RefreshToken = refreshToken;
        }


    }
}
