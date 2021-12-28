import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/constants/constants';
import {
  FileSystemItem,
  FileSystemModel,
} from 'src/app/models/fileSystemModel';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  templateUrl: './folderSelector-dialog.component.html',
  styleUrls: ['./folderSelector-dialog.component.scss'],
})
export class FolderSelectorDialog {
  dataSource: FileSystemItem[] = [];
  showProgressBar: boolean = false;
  oneUpPath: string;
  currentDirName: string = Constants.RootPath;
  currentPath: string = Constants.RootPath;
  constants: any;
  displayedColumns: string[] = ['name'];
  folderSelected: FileSystemItem = null;

  constructor(
    public dialogRef: MatDialogRef<FolderSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private folderService: FolderService
  ) {
    this.constants = Constants;
  }

  ngOnInit() {
    this.getFoldersList('');
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
