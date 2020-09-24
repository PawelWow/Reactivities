using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.interfaces
{
    public interface IFacebookAccessor
    {
        Task<FacebookUserInfo> FacebookLogin(string accessToken);
    }
}
