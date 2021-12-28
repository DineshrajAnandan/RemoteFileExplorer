using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RemoteFileExplorer.Contracts;
using RemoteFileExplorer.Helpers;
using RemoteFileExplorer.Models;
using System;
using System.IO;
using System.IO.Compression;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RemoteFileExplorer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoldersController : ControllerBase
    {
        private readonly IFoldersService _foldersService;
        private readonly IConfiguration Configuration;
        public FoldersController(IFoldersService foldersService,
            IConfiguration configuration)
        {
            _foldersService = foldersService;
            Configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get(string path = "", bool includeHidden = false)
        {
            path = path?.UnMaskPath().Trim();
            if (string.IsNullOrEmpty(path))
                path = Configuration["root"];
            
            try
            {
                if (!Directory.Exists(path.UnMaskPath()))
                    return BadRequest();
                return Ok(_foldersService.GetFileSystemEntriesInDir(path, includeHidden));
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
            
        }

        [HttpGet("Directories")]
        public IActionResult GetDirectories(string path = "", bool includeHidden = false)
        {
            path = path?.UnMaskPath().Trim();
            if (string.IsNullOrEmpty(path))
                path = Configuration["root"];

            try
            {
                if (!Directory.Exists(path.UnMaskPath()))
                    return BadRequest();
                return Ok(_foldersService.GetAllDirectoriesInDir(path, includeHidden));
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

        }

        [HttpPut("Create")]
        public IActionResult Create(string path)
        {
            path = path.UnMaskPath();
            if (Directory.Exists(path))
                return BadRequest();

            var response = _foldersService.CreateFolder(path);
            if (response)
                return Ok();
            return StatusCode(500);

        }

        [HttpPut("MoveOrRename")]
        public IActionResult MoveOrRename([FromBody] FromToPath fromToPath)
        {
            fromToPath.From = fromToPath.From.UnMaskPath();
            fromToPath.To = fromToPath.To.UnMaskPath();

            if (!Directory.Exists(fromToPath.From))
                return BadRequest();

            if (fromToPath.From.Equals(fromToPath.To)) return Ok();
            var response = _foldersService.MoveFolder(fromToPath);
            if (response)
                return Ok();
            return StatusCode(500);            

        }

        [HttpPut("Copy")]
        public IActionResult Copy([FromBody] FromToPath fromToPath)
        {
            fromToPath.From = fromToPath.From.UnMaskPath();
            fromToPath.To = fromToPath.To.UnMaskPath();

            if (!Directory.Exists(fromToPath.From))
                return BadRequest();

            var response = _foldersService.CopyFolder(fromToPath);
            if (response)
                return Ok();
            return StatusCode(500);

        }

        [HttpDelete]
        public IActionResult Delete(string path)
        {
            path = path?.UnMaskPath().Trim();
            if (!Directory.Exists(path)) return BadRequest();
            var response = _foldersService.DeleteFolder(path);

            if (response)
                return Ok();
            return StatusCode(500);
        }

        [HttpGet("Download")]
        public IActionResult Download(string path)
        {
            path = path?.UnMaskPath().Trim();
            if (!Directory.Exists(path)) return BadRequest();
            var response = _foldersService.DownloadFolder(path);

            const string contentType = "application/zip";
            HttpContext.Response.ContentType = contentType;
            var result = new FileContentResult(response.bytes, contentType)
            {
                FileDownloadName = $"{response.dirName}.zip"
            };

            return result;
        }
    }
}
