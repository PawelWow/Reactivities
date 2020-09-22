using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            base.CreateMap<Comment, CommentDto>()
                .ForMember(destination => destination.Username, options => options.MapFrom(source => source.Author.UserName))
                .ForMember(destination => destination.DisplayName, options => options.MapFrom(source => source.Author.DisplayName))
                .ForMember(destination => destination.Image, options => options.MapFrom(
                    source => source.Author.Photos.FirstOrDefault( photo => photo.IsMain ).Url ));
        }
    }
}
