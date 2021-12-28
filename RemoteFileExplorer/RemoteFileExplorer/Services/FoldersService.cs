using Microsoft.Extensions.Configuration;
using RemoteFileExplorer.Contracts;
using RemoteFileExplorer.Helpers;
using RemoteFileExplorer.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;

namespace RemoteFileExplorer.Services
{
    public class FoldersService: IFoldersService
    {
        private readonly string _rootDir;
        public FoldersService(IConfiguration configuration)
        {
            _rootDir = configuration["root"];
        }

        public FileSystemModel GetAllDirectoriesInDir(string path, bool includeHidden)
        {
            var dirInfo = new DirectoryInfo(path);
            var list = (includeHidden) ?
                            dirInfo.GetDirectories() :
                            dirInfo.GetDirectories("*", new EnumerationOptions());

            var result = new FileSystemModel
            {
                OneUpPath = (path.Equals(_rootDir)) ? string.Empty : dirInfo.Parent.FullName.MaskPathForUI(),
                CurrentPath = path.MaskPathForUI(),
                CurrentDirName = (path.Equals(_rootDir)) ? Constants.MaskRootName : dirInfo.Name,
                Items = new List<FileSystemItem>()
            };

            foreach (var item in list)
                result.Items.Add(GetFileSystemEntry(item));

            return result;
        }

        public FileSystemModel GetFileSystemEntriesInDir(string path, bool includeHidden)
        {
            var dirInfo = new DirectoryInfo(path);
            var list = (includeHidden) ? 
                            dirInfo.GetFileSystemInfos() :
                            dirInfo.GetFileSystemInfos("*", new EnumerationOptions());

            var result = new FileSystemModel
            {
                OneUpPath = (path.Equals(_rootDir)) ? string.Empty : dirInfo.Parent.FullName.MaskPathForUI(),
                CurrentPath = path.MaskPathForUI(),
                CurrentDirName = (path.Equals(_rootDir)) ? Constants.MaskRootName : dirInfo.Name,
                Items = new List<FileSystemItem>()
            };

            foreach (var item in list)
                result.Items.Add(GetFileSystemEntry(item));

            return result;
        }

        public bool DeleteFolder(string path)
        {
            try
            {
                Directory.Delete(path, true);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool MoveFolder(FromToPath fromToPath)
        {
            try
            {
                Directory.Move(fromToPath.From, fromToPath.To);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool CreateFolder(string path)
        {
            try
            {
                Directory.CreateDirectory(path);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public bool CopyFolder(FromToPath fromToPath)
        {
            var from = fromToPath.From;
            var to = fromToPath.To;
            try
            {
                if (from.Equals(to))
                {
                    var dir = new DirectoryInfo(from);
                    to = dir.FullName.Replace(dir.Name, $"{dir.Name.RenameItemForDuplication()}");
                }
                CopyFilesRecursively(from, to);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public (byte[] bytes, string dirName) DownloadFolder(string path)
        {
            var result = ZipFolder(path);
            var response = File.ReadAllBytes(result.zipPath);
            File.Delete(result.zipPath);
            return (response, result.dirName);
        }


        #region privates

        private (string zipPath, string dirName) ZipFolder(string path)
        {
            var dir = new DirectoryInfo(path);
            var tempPath = Path.Combine(Path.GetTempPath(), $"{dir.Name}.zip");
            ZipFile.CreateFromDirectory(path, tempPath);
            return (tempPath,dir.Name);
        }

        private void CopyFilesRecursively(string fromPath, string toPath)
        {
            foreach (string dirPath in Directory.GetDirectories(fromPath, "*", SearchOption.AllDirectories))
            {
                Directory.CreateDirectory(dirPath.Replace(fromPath, toPath));
            }

            foreach (string newPath in Directory.GetFiles(fromPath, "*.*", SearchOption.AllDirectories))
            {
                File.Copy(newPath, newPath.Replace(fromPath, toPath), true);
            }
        }

        private FileSystemItem GetFileSystemEntry(FileSystemInfo f) => new FileSystemItem
        {
            Name = (f.Attributes.HasFlag(FileAttributes.Directory)) ? 
                        f.Name : Path.GetFileNameWithoutExtension(f.FullName),
            NameWithExtension = f.Name,
            AbsPath = f.FullName.MaskPathForUI(),
            DateModified = f.LastWriteTime,
            Size = f.Attributes.HasFlag(FileAttributes.Archive) ?
                            sizeToString((f as FileInfo).Length) : string.Empty,
            Type = f.Attributes.HasFlag(FileAttributes.Directory) ? Constants.FolderType : $"{f.Extension.Replace(".", "")} file",
            IsHidden = f.Attributes.HasFlag(FileAttributes.Hidden),
            IsReadOnly = f.Attributes.HasFlag(FileAttributes.ReadOnly),
            CreationTime = f.CreationTime,
            LastAccessTime = f.LastAccessTime
        };

        private string sizeToString(long size)
        {
            if (size >= Constants.OneGB)
                return $"{(size / Constants.OneGB).ToString("#.##")} GB";
            else if (size >= Constants.OneMB)
                return $"{(size / Constants.OneMB).ToString("#.##")} MB";
            else if (size >= Constants.OneKB)
                return $"{(size / Constants.OneKB).ToString("#.##")} KB";
            return $"{size} Bytes";
        }


        #endregion
    }
}
