import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/constants/constants';
import { FileSystemItem } from 'src/app/models/fileSystemModel';
import { TextFileDialogData } from 'src/app/models/types/text-file-dialog-data';
import { TextFileDialog } from 'src/app/sharedComponents/text-file-dialog/text-file-dialog.component';

@Component({
  selector: 'file-grid',
  templateUrl: './file-grid.component.html',
  styleUrls: ['./file-grid.component.scss']
})
export class FileGridComponent implements OnChanges{
  dataSource: MatTableDataSource<FileSystemItem>;

  @Input() set data(value: FileSystemItem[]){
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  @Input() selectedItems: FileSystemItem[];

  @Output() folderOpen: EventEmitter<string> = new EventEmitter();
  @Output() selectedEvt: EventEmitter<FileSystemItem> = new EventEmitter();
  constants: any;
  displayedColumns: string[] = ['name', 'type', 'dateModified', 'size'];


  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private dialog: MatDialog) {
    this.constants = Constants;
  }

  ngOnChanges() {

  }

  itemDoubleClicked(item: FileSystemItem) {
    if(item.type == Constants.FolderType) {
      this.folderOpen.emit(item.absPath);
    }
    else if(this.canOpenAsText(item)) {
      this.openAsTextDoc(item);
    }
  }
  itemSelected(item: FileSystemItem) {
    this.selectedEvt.emit(item);
  }

  private canOpenAsText(item: FileSystemItem):boolean {
    return item.type.includes('txt');
  }

  private openAsTextDoc(item: FileSystemItem) {
    let data: TextFileDialogData = {
      isNew: false,
      fileName: item.nameWithExtension,
      filePath: item.absPath,
    }
    const dialogRef = this.dialog.open(TextFileDialog, {
      data,
      disableClose: true,
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe();
  }
}
