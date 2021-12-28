using RemoteFileExplorer.Contracts;
using RemoteFileExplorer.Helpers;
using RemoteFileExplorer.Models;
using System.IO;
using System.Text;
using System;
using System.Web;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Http;

namespace RemoteFileExplorer.Services
{
    public class FileService : IFileService
    {

        public bool DeleteFile(string path)
        {
            try
            {
                File.Delete(path);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool MoveFile(FromToPath fromToPath)
        {
            var from = fromToPath.From;
            var to = fromToPath.To;
            try
            {
                File.Move(from, to);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool CreateTextFile(string path, string content)
        {
            //if (File.Exists(path)) return false;
            if (content == null) content = string.Empty;
            try
            {
                using (var fs = File.Create(path))
                {
                    fs.Write(Encoding.ASCII.GetBytes(content));
                }
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool CopyFile(FromToPath fromToPath)
        {
            var from = fromToPath.From;
            var to = fromToPath.To;
            try
            {
                if (from.Equals(to))
                {
                    var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(from);
                    var file = new FileInfo(from);
                    to = file.FullName.Replace(fileNameWithoutExtension, $"{file.Name.RenameItemForDuplication()}");
                }
                File.Copy(from, to);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public (byte[] bytes, string fileName, string mimeType) DownloadFile(string path)
        {
            var fileInfo = new FileInfo(path);
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(path, out contentType);
            var response = File.ReadAllBytes(path);
            return (response, fileInfo.Name, contentType);
        }

        public string ReadTextFile(string path)
        {
            return File.ReadAllText(path);
        }

        public void UploadFile(IFormFile file, string folderPath)
        {
            var fileName = file.FileName;
            var filePath = Path.Combine(folderPath, fileName);
            if (System.IO.File.Exists(filePath))
            {
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(filePath);
                var ext = Path.GetExtension(filePath);
                fileName = $"{fileNameWithoutExtension}-{Guid.NewGuid().ToString()}{ext}";
                filePath = Path.Combine(folderPath, fileName);
            }

            using (var fileStream = file.OpenReadStream())
            {
                var bytes = new byte[file.Length];
                fileStream.Read(bytes, 0, bytes.Length);
                File.WriteAllBytes(filePath, bytes);
            }
        }
    }
}
