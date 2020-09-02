
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
            return await m_mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            return await m_mediator.Send(new Details.Query { Id = id });
        }
    }

}

