using System;
using System.Collections.Generic;

namespace RemoteFileExplorer.Models
{
    public class FileSystemModel
    {
        public string OneUpPath { get; set; }
        public string CurrentPath { get; set; }
        public string CurrentDirName { get; set; }
        public List<FileSystemItem> Items { get; set; }

    }

    public class FileSystemItem
    {
        public string Name { get; set; }
        public string NameWithExtension { get; set; }
        public string Type { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime LastAccessTime { get; set; }
        public string Size { get; set; }
        public string AbsPath { get; set; }
        public bool IsHidden { get; set; }
        public bool IsReadOnly { get; set; }


    }
}
