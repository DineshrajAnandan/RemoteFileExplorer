import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileSystemModel } from './models/fileSystemModel';
import { TextFileDialogData } from './models/types/text-file-dialog-data';
import { HelperService } from './services/helper.service';
import { TextFileDialog } from './sharedComponents/text-file-dialog/text-file-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showGlobalProgressBar: boolean = false;
  currentOpenFolder: FileSystemModel;

  constructor(public helperService : HelperService,
    private dialog: MatDialog){}

  ngOnInit() {
    this.helperService.showGlobalProgressBar$.subscribe(val => {
      Promise.resolve().then(()=> this.showGlobalProgressBar = val);
    });

    this.helperService.currentOpenFolder$.subscribe(val => {
      this.currentOpenFolder = val;
    });
  }

  newTextDocument() {
    let data: TextFileDialogData = {
      isNew: true,
      folderName: this.currentOpenFolder.currentDirName,
      folderPath: this.currentOpenFolder.currentPath
    }
    const dialogRef = this.dialog.open(TextFileDialog, {
      data,
      disableClose: true,
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) 
        this.helperService.folderRefresh();
      
    });
  }
}
