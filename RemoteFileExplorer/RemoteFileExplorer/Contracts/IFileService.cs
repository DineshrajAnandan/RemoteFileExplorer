using Microsoft.AspNetCore.Http;
using RemoteFileExplorer.Models;

namespace RemoteFileExplorer.Contracts
{
    public interface IFileService
    {
        bool DeleteFile(string path);
        bool CopyFile(FromToPath fromToPath);
        bool MoveFile(FromToPath fromToPath);
        bool CreateTextFile(string path, string content);
        (byte[] bytes, string fileName, string mimeType) DownloadFile(string path);
        void UploadFile(IFormFile file, string folderPath); 
        string ReadTextFile(string path);
    }
}
