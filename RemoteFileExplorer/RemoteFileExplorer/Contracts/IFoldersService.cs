using RemoteFileExplorer.Models;
using System.Collections.Generic;

namespace RemoteFileExplorer.Contracts
{
    public interface IFoldersService
    {
        FileSystemModel GetAllDirectoriesInDir(string path, bool includeHidden);
        FileSystemModel GetFileSystemEntriesInDir(string path, bool includeHidden);
        bool DeleteFolder(string path);
        bool MoveFolder(FromToPath fromToPath);
        bool CreateFolder(string path);
        bool CopyFolder(FromToPath fromToPath);
        (byte[] bytes, string dirName) DownloadFolder(string path);
    }
}
