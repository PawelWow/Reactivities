
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator m_mediator;
        public ActivitiesController(IMediator mediator)
        {
            m_mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List()
        {
            // mo¿na z tokenem: return await m_mediator.Send(new List.Query(), cancellation);

            return await m_mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            return await m_mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            //W aparametrze mo¿na daæ [FromBody]Create.Command command - ¿eby by³o wiadomo, gdzie szukaæ
            return await m_mediator.Send(command);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await m_mediator.Send(command);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await m_mediator.Send(new Delete.Command { Id = id });
        }
    }

}

