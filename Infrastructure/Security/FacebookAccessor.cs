using Application.interfaces;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class FacebookAccessor : IFacebookAccessor
    {
        private readonly HttpClient m_httpClient;
        private readonly IOptions<FacebookAppSettings> m_config;

        public FacebookAccessor(IOptions<FacebookAppSettings> config)
        {
            m_config = config;
            m_httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://graph.facebook.com")
            };

            m_httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));        
        }

        public async Task<FacebookUserInfo> FacebookLogin(string accessToken)
        {
            // is token valid?
            var verifyToken = await m_httpClient
                .GetAsync($"debug_token?input_token={accessToken}&access_token={m_config.Value.AppId}|{m_config.Value.AppSecret}");

            if (!verifyToken.IsSuccessStatusCode)
            {
                return await Task.FromResult<FacebookUserInfo>(null);
            }

            var result = await this.GetAsync<FacebookUserInfo>(
                            accessToken,
                            "me",
                            "fields=name,email,picture.width(100).height(100)");

            return result;
        }

        /// <summary>
        /// Provides facebook user info
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="accessToken">Token</param>
        /// <param name="endpoint">Endpoint (e.g. "me")</param>
        /// <param name="args">What do we need (eg.fields=name,email,picture.width(100).height(100) ) </param>
        /// <returns>user info in type</returns>
        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args)
        {
            var response = await m_httpClient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");
            if (!response.IsSuccessStatusCode)
            {
                return await Task.FromResult<T>(default);
            }

            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(result);
        }
    }
}
