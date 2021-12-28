import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      {{data.description}}
    </div>
    <div mat-dialog-actions class="footer">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Ok
      </button>
    </div>
  `,
  styles: [
      `
        div.footer {
            display : flex;
            justify-content: flex-end;
        }
      `
  ]
})
export class AlertDialog {
  constructor(
    public dialogRef: MatDialogRef<AlertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
