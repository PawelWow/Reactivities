
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset)
        {
            // mo¿na z tokenem: return await m_mediator.Send(new List.Query(), cancellation);

            return await base.Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await base.Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            //W aparametrze mo¿na daæ [FromBody]Create.Command command - ¿eby by³o wiadomo, gdzie szukaæ
            return await base.Mediator.Send(command);

        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await base.Mediator.Send(command);

        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await base.Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command { Id = id });
        }

        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command { Id = id });
        }
    }

}

