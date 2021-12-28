export class FileSystemModel {
  currentPath: string;
  currentDirName: string;
  oneUpPath: string;
  items: FileSystemItem[];
}

export class FileSystemItem {
  name: string;
  nameWithExtension: string;
  type: string;
  dateModified: string;
  lastAccessTime: string;
  creationTime: string;
  size: string;
  absPath: string;
  isHidden: boolean;
  isReadOnly: boolean;
}
