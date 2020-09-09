using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator m_mediator;

        protected IMediator Mediator => m_mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    }

}

