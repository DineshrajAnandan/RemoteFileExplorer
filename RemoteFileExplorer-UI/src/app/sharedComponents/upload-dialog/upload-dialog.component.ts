import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/constants/constants';
import {
  FileSystemItem,
  FileSystemModel,
} from 'src/app/models/fileSystemModel';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialog {
  showProgressBar: boolean = false;
  currentDirName: string = Constants.RootPath;
  currentPath: string = Constants.RootPath;
  constants: any;

  constructor(
    public dialogRef: MatDialogRef<UploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private folderService: FolderService
  ) {
    this.constants = Constants;
  }

  ngOnInit() {
  }

  get dataOnClose(): string {
    if (!this.folderSelected) return this.currentPath;
    return this.folderSelected.absPath;
  }

  get folderSelectedForPipe(): FileSystemItem[] {
    return this.folderSelected ? [this.folderSelected] : [];
  }

  get selectedFolderToDisplay(): string {
    return this.folderSelected ? this.folderSelected.name : this.currentDirName;
  }

  getFoldersList(path: string) {
    this.dataSource = [];
    this.showProgressBar = true;
    this.folderService.GetAllDirectoriesInMyFolder(path).subscribe(
      (res: FileSystemModel) => {
        this.dataSource = res.items;
        this.oneUpPath = res.oneUpPath;
        this.currentDirName = res.currentDirName;
        this.currentPath = res.currentPath;
        this.showProgressBar = false;
        this.folderSelected = null;
      },
      () => {
        this.showProgressBar = false;
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
