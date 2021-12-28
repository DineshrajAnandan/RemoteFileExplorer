import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constants } from 'src/app/constants/constants';
import { FileSystemItem, FileSystemModel } from 'src/app/models/fileSystemModel';
import { FileService } from 'src/app/services/file.service';
import { FolderService } from 'src/app/services/folder.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  downloadDisabled: boolean = true;
  selectedItems: FileSystemItem[];
  currentOpenFolder: FileSystemModel;
  showUploadProgress: boolean = false;

  constructor(
    private helperService: HelperService,
    private folderService: FolderService,
    private fileService: FileService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.helperService.selectedItems$.subscribe((res) => {
      this.downloadDisabled = !(res.length > 0);
      this.selectedItems = res;
    });

    this.helperService.currentOpenFolder$.subscribe(res => {
      this.currentOpenFolder = res;
    })
  }

  downloadItem() {
    let item = this.selectedItems[0];
    if (item.type == Constants.FolderType) {
      this.downloadFolder(item.absPath);
    }
    else {
      this.downloadFile(item.absPath);
    }

    this._snackBar.open("Download will start shortly.", "ok", {
      duration: 3000
    })
  }

  downloadFile(path: string) {
    this.fileService.downloadFile(path);
  }

  downloadFolder(path: string) {
    this.folderService.downloadFolder(path)
    // this.folderService.downloadFolder(path).subscribe((res) => {
    //   this.downloadProcess(res);
    // });
  }

  downloadProcess(data: any) {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  uploadFile(evt: any) {
    let file = evt.target.files[0];
    if(!!file) this.showUploadProgress = true;
    // this.helperService.selectedDestinationFolder$.subscribe(val => {
      this.fileService.uploadFile(file,this.currentOpenFolder.currentPath);
    // })
  }
}
