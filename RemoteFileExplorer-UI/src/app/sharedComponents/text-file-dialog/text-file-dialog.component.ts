import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TextFileDialogData } from 'src/app/models/types/text-file-dialog-data';
import { FileService } from 'src/app/services/file.service';

@Component({
  templateUrl: './text-file-dialog.component.html',
  styleUrls: ['./text-file-dialog.component.scss'],
})
export class TextFileDialog implements AfterViewInit {
  saveInProgress: boolean = false;
  isContentLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<TextFileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TextFileDialogData,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    if (!this.data.isNew) {
      this.fetchFileContent();
    }
  }

  fetchFileContent() {
    this.isContentLoading = true;
    this.fileService
      .readTextFile(this.data.filePath)
      .subscribe((res: string) => {
        this.data.content = res;
        this.isContentLoading = false;
      });
  }

  saveFile() {
    if (!this.data.fileName) {
      this.openSnackBar('Please enter proper file name', true);
      return;
    }
    this.saveInProgress = true;
    if (!this.data.fileName.endsWith('.txt')) this.data.fileName += '.txt';
    let filePath = this.data.isNew
      ? `${this.data.folderPath}\\${this.data.fileName}`
      : this.data.filePath;
    this.fileService.createFile(filePath, this.data.content).subscribe(
      () => {
        this.openSnackBar('File save successful');
        this.saveInProgress = false;
        this.dialogRef.close(true);
      },
      () => {
        this.openSnackBar('File save failed', true);
        this.saveInProgress = false;
      }
    );
  }

  private openSnackBar(msg: string, isError: boolean = false) {
    let snackBarConfig: MatSnackBarConfig<any> = {
      duration: 3000,
    };
    if (isError) snackBarConfig.panelClass = ['matSnackBarError'];

    this.snackBar.open(msg, null, snackBarConfig);
  }
}
