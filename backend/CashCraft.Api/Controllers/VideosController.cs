using System;
using System.Linq;
using System.Threading.Tasks;
using CashCraft.Api.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public VideosController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Videos
                .OrderByDescending(v => v.PublishedAt ?? v.CreatedAt)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _db.Videos.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        public class CreateVideoRequest
        {
            public string Slug { get; set; } = string.Empty;
            public string TitleEn { get; set; } = string.Empty;
            public string TitleAr { get; set; } = string.Empty;
            public string? DescriptionEn { get; set; }
            public string? DescriptionAr { get; set; }
            public string? CoverUrl { get; set; }
            public string? Url { get; set; }
            public string? ThumbnailUrl { get; set; }
            public int? DurationSec { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Create([FromBody] CreateVideoRequest req)
        {
            var entity = new Video
            {
                Id = Guid.NewGuid(),
                Slug = req.Slug,
                TitleEn = req.TitleEn,
                TitleAr = req.TitleAr,
                DescriptionEn = req.DescriptionEn,
                DescriptionAr = req.DescriptionAr,
                CoverUrl = req.CoverUrl,
                Url = req.Url ?? string.Empty,
                ThumbnailUrl = req.ThumbnailUrl,
                DurationSec = req.DurationSec,
                PublishedAt = DateTime.UtcNow
            };
            _db.Videos.Add(entity);
            await _db.SaveChangesAsync();
            return Created($"api/videos/{entity.Id}", entity);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateVideoRequest req)
        {
            var entity = await _db.Videos.FindAsync(id);
            if (entity == null) return NotFound();

            entity.Slug = req.Slug;
            entity.TitleEn = req.TitleEn;
            entity.TitleAr = req.TitleAr;
            entity.DescriptionEn = req.DescriptionEn;
            entity.DescriptionAr = req.DescriptionAr;
            entity.CoverUrl = req.CoverUrl;
            entity.Url = req.Url ?? string.Empty;
            entity.ThumbnailUrl = req.ThumbnailUrl;
            entity.DurationSec = req.DurationSec;

            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _db.Videos.FindAsync(id);
            if (entity == null) return NotFound();

            _db.Videos.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}


