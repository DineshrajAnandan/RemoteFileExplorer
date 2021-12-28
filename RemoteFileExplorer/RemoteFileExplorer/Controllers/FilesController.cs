using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RemoteFileExplorer.Contracts;
using RemoteFileExplorer.Helpers;
using RemoteFileExplorer.Models;
using System;
using System.IO;
using System.Threading;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RemoteFileExplorer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpDelete]
        public IActionResult Delete(string path)
        {
            path = path?.UnMaskPath().Trim();
            if (!System.IO.File.Exists(path)) return BadRequest();
            var response = _fileService.DeleteFile(path);
            if (response)
                return Ok();
            else
                return StatusCode(500);

        }

        [HttpPut("Create")]
        public IActionResult Create([FromBody] CreateFileRequest request)
        {
            request.Path = request.Path.UnMaskPath();

            if (Directory.Exists(request.Path))
                return BadRequest();

            var response = _fileService.CreateTextFile(request.Path, request.Content);
            if (response)
                return Ok();
            return StatusCode(500);

        }

        [HttpPut("MoveOrRename")]
        public IActionResult MoveOrRename([FromBody] FromToPath fromToPath)
        {
            fromToPath.From = fromToPath.From.UnMaskPath();
            fromToPath.To = fromToPath.To.UnMaskPath();

            if (!System.IO.File.Exists(fromToPath.From))
                return BadRequest();

            if (fromToPath.From.Equals(fromToPath.To)) return Ok();
            var response = _fileService.MoveFile(fromToPath);
            if (response)
                return Ok();
            return StatusCode(500);

        }

        [HttpPut("Copy")]
        public IActionResult Copy([FromBody] FromToPath fromToPath)
        {
            fromToPath.From = fromToPath.From.UnMaskPath();
            fromToPath.To = fromToPath.To.UnMaskPath();

            if (!System.IO.File.Exists(fromToPath.From))
                return BadRequest();

            var response = _fileService.CopyFile(fromToPath);
            if (response)
                return Ok();
            return StatusCode(500);

        }

        [HttpGet("Download")]
        public IActionResult Download(string path)
        {
            path = path?.UnMaskPath().Trim();
            if (!System.IO.File.Exists(path)) return BadRequest();
            var response = _fileService.DownloadFile(path);

            HttpContext.Response.ContentType = response.mimeType;
            var result = new FileContentResult(response.bytes, response.mimeType)
            {
                FileDownloadName = $"{response.fileName}"
            };

            return result;
        }

        [HttpPost("Upload")]
        public IActionResult Upload([FromForm] IFormFile file, string folderPath)
        {
            folderPath = folderPath?.UnMaskPath().Trim();
            if (file == null)
                return BadRequest();
            
            _fileService.UploadFile(file, folderPath);
            return Ok(true);
        }

        [HttpGet("ReadTextFile")]
        public IActionResult ReadTextFile(string path)
        {
            path = path?.UnMaskPath().Trim();
            return Ok(_fileService.ReadTextFile(path));
        }
    }
}
