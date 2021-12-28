import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>{{ data.placeholder }}</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="footer">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.name" cdkFocusInitial>
        Ok
      </button>
    </div>
  `,
  styles: [
    `
      div.footer {
        display: flex;
        justify-content: flex-end;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class GetNameDialog {
  constructor(
    public dialogRef: MatDialogRef<GetNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }
}
