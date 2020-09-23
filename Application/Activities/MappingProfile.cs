using AutoMapper;
using Domain;
using System.Linq;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(destination => destination.Username, options => options.MapFrom(source => source.AppUser.UserName))
                .ForMember(destination => destination.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(destination => destination.Image, options => options.MapFrom(
                    source => source.AppUser.Photos.FirstOrDefault(photo => photo.IsMain).Url)
                ).ForMember(destination => destination.Following, options => options.MapFrom<FollowingResolver>());
        }
    }
}
