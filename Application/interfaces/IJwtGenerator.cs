using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}
