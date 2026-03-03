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
    public class ArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ArticlesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Articles
                .OrderByDescending(a => a.PublishedAt ?? a.CreatedAt)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _db.Articles.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        public class CreateArticleRequest
        {
            public string Slug { get; set; } = string.Empty;
            public string TitleEn { get; set; } = string.Empty;
            public string TitleAr { get; set; } = string.Empty;
            public string? DescriptionEn { get; set; }
            public string? DescriptionAr { get; set; }
            public string? CoverUrl { get; set; }
            public string? BodyEn { get; set; }
            public string? BodyAr { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Create([FromBody] CreateArticleRequest req)
        {
            var entity = new Article
            {
                Id = Guid.NewGuid(),
                Slug = req.Slug,
                TitleEn = req.TitleEn,
                TitleAr = req.TitleAr,
                DescriptionEn = req.DescriptionEn,
                DescriptionAr = req.DescriptionAr,
                CoverUrl = req.CoverUrl,
                BodyEn = req.BodyEn,
                BodyAr = req.BodyAr,
                PublishedAt = DateTime.UtcNow
            };
            _db.Articles.Add(entity);
            await _db.SaveChangesAsync();
            return Created($"api/articles/{entity.Id}", entity);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateArticleRequest req)
        {
            var entity = await _db.Articles.FindAsync(id);
            if (entity == null) return NotFound();

            entity.Slug = req.Slug;
            entity.TitleEn = req.TitleEn;
            entity.TitleAr = req.TitleAr;
            entity.DescriptionEn = req.DescriptionEn;
            entity.DescriptionAr = req.DescriptionAr;
            entity.CoverUrl = req.CoverUrl;
            entity.BodyEn = req.BodyEn;
            entity.BodyAr = req.BodyAr;

            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _db.Articles.FindAsync(id);
            if (entity == null) return NotFound();

            _db.Articles.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}


