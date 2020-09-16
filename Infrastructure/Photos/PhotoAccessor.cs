using Application.interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary m_cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);

            m_cloudinary = new Cloudinary(account);

        }


        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploadResults = new ImageUploadResult();

            if(file.Length > 0)
            {
                uploadResults = this.UploadImage(file);
            }

            if (uploadResults.Error != null)
            {
                throw new Exception(uploadResults.Error.Message);
            }

            return new PhotoUploadResult
            {
                PublicId = uploadResults.PublicId,
                Url = uploadResults.SecureUrl.AbsoluteUri
            };
        }

        public string DeletePhoto(string publicId)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Wrzuca obrazek na serwer.
        /// </summary>
        /// <param name="file"><inheritdoc cref="IFormFile"/></param>
        /// <returns><inheritdoc cref="ImageUploadResult"/></returns>
        private ImageUploadResult UploadImage(IFormFile file)
        {
            var uploadParams = new ImageUploadParams
            {
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
            };

            using (var stream = file.OpenReadStream())
            {
                uploadParams.File = new FileDescription(file.FileName, stream);
                return m_cloudinary.Upload(uploadParams);
            }
        }
    }
}
