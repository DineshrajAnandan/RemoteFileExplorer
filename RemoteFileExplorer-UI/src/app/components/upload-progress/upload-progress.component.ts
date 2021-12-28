import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constants } from 'src/app/constants/constants';
import { UploadingItem } from 'src/app/models/currentUploads';
import { FileSystemItem } from 'src/app/models/fileSystemModel';
import { FileService } from 'src/app/services/file.service';
import { FolderService } from 'src/app/services/folder.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss'],
})
export class UploadProgressComponent implements OnInit {
  data: UploadingItem[] = [];
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private helperService: HelperService,
    private fileService: FileService,
    private _snackBar: MatSnackBar
  ) {}

 ngOnInit(){
     this.fileService.currentUploads$.subscribe(data => {
         this.data = data;
     })
 }

 close() {
   this.fileService.clearCurrentUploads();
   this.closed.emit(true);
 }


}
