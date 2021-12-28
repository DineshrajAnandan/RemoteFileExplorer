import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import {
  FileSystemItem,
  FileSystemModel,
} from 'src/app/models/fileSystemModel';
import { FileService } from 'src/app/services/file.service';
import { FolderService } from 'src/app/services/folder.service';
import { HelperService } from 'src/app/services/helper.service';
import { AlertDialog } from 'src/app/sharedComponents/alert-dialog/alert-dialog.component';
import { FolderSelectorDialog } from 'src/app/sharedComponents/folderSelector-dialog/folderSelector-dialog.component';
import { GetNameDialog } from 'src/app/sharedComponents/get-name-dialog/getName-dialog.component';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
  currentPath = Constants.RootPath;
  currentDirName: string = Constants.RootPath;
  oneUpPath = '';
  displayHiddenFiles = false;
  dataSource: any;
  constants: any;
  selectedItems: FileSystemItem[] = [];

  constructor(
    private folderService: FolderService,
    private fileService: FileService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.constants = Constants;
  }

  ngOnInit() {
    this.routeListen();
    this.helperService.selectedItems$.subscribe((res) => {
      this.selectedItems = res;
    });
    this.helperService.requestFolderRefresh$.pipe(filter( val => !!val)).subscribe(() => {
      this.getFolderItems(this.currentPath);
    })
  }

  routeListen() {
    this.activatedRoute.params.subscribe((p) => {
      let folderPath = p['folderPath'];
      this.getFolderItems(!folderPath ? Constants.RootPath : folderPath);
    });
  }

  folderOpen(path: string) {
    this.router.navigate(['/folder', path]);
  }

  renameItem() {
    let item = this.selectedItems[0];
    if (item.type == Constants.FolderType) {
      this.renameFolder(item);
    } else {
      this.renameFile(item);
    }
  }

  renameFolder(item: FileSystemItem) {
    const dialogRef = this.dialog.open(GetNameDialog, {
      width: '350px',
      data: {
        name: item.nameWithExtension,
        title: 'Rename Folder',
        placeholder: 'New Folder Name',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.helperService.toggleGlobalProgressBar(true);
        this.folderService
          .moveOrRenameFolder(
            item.absPath,
            `${item.absPath.replace(item.nameWithExtension, result)}`
          )
          .subscribe(
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('Folder renamed successfully');
            },
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('Folder rename failed', true);
            }
          );
      }
    });
  }

  renameFile(item: FileSystemItem) {
    const dialogRef = this.dialog.open(GetNameDialog, {
      width: '350px',
      data: {
        name: item.nameWithExtension,
        title: 'Rename File',
        placeholder: 'New File Name',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.helperService.toggleGlobalProgressBar(true);
        this.fileService
          .moveOrRenameFile(
            item.absPath,
            `${item.absPath.replace(item.nameWithExtension, result)}`
          )
          .subscribe(
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('File renamed successfully');
            },
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('File rename failed', true);
            }
          );
      }
    });
  }

  getFolderItems(path: string) {
    this.helperService.toggleGlobalProgressBar(true);
    this.folderService
      .GetMyFolderContents(path, this.displayHiddenFiles)
      .subscribe(
        (res: FileSystemModel) => {
          this.dataSource = res.items;
          this.currentPath = res.currentPath;
          this.currentDirName = res.currentDirName;
          this.oneUpPath = res.oneUpPath;
          // this.selectedItems = [];
          this.helperService.clearSelectedItems();
          this.helperService.toggleGlobalProgressBar(false);
          this.helperService.setCurrentOpenFolder(res);
        },
        () => {
          this.helperService.toggleGlobalProgressBar(false);
          this.afterActionComplete('Failed to fetch folder', true);
        }
      );
  }

  itemSelected(item: FileSystemItem) {
    this.helperService.setSelectedItem(item);
    // this.selectedItems = [item];
  }

  createNewFolder() {
    const dialogRef = this.dialog.open(GetNameDialog, {
      width: '350px',
      data: { name: '', title: 'New Folder', placeholder: 'Enter Folder Name' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.helperService.toggleGlobalProgressBar(true);
        this.folderService
          .createFolder(`${this.currentPath}\\${result}`)
          .subscribe(
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('Folder created successfully');
            },
            () => {
              this.helperService.toggleGlobalProgressBar(false);
              this.afterActionComplete('Folder creation failed', true);
            }
          );
      }
    });
  }

  deleteItem() {
    const dialogRef = this.dialog.open(AlertDialog, {
      width: '350px',
      data: {
        title: 'Delete Item',
        description: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.processDelete();
      }
    });
  }

  moveItem() {
    const dialogRef = this.dialog.open(FolderSelectorDialog, {
      width: '450px',
      data: { title: 'Select Folder to Move item' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.processMove(result);
      }
    });
  }

  copyItem() {
    const dialogRef = this.dialog.open(FolderSelectorDialog, {
      width: '450px',
      data: { title: 'Select Folder to Copy item' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.processCopy(result);
      }
    });
  }

  private processMove(toPath: string) {
    this.selectedItems.forEach((item) => {
      let to = `${toPath}\\${item.nameWithExtension}`;
      if (item.type == Constants.FolderType) {
        this.helperService.toggleGlobalProgressBar(true);
        this.folderService.moveOrRenameFolder(item.absPath, to).subscribe(
          () => {
            this.afterActionComplete('Folder moved successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('Folder move failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      } else {
        this.helperService.toggleGlobalProgressBar(true);
        this.fileService.moveOrRenameFile(item.absPath, to).subscribe(
          () => {
            this.afterActionComplete('File moved successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('File move failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      }
    });
  }

  private processCopy(toPath: string) {
    this.selectedItems.forEach((item) => {
      let to = `${toPath}\\${item.nameWithExtension}`;
      if (item.type == Constants.FolderType) {
        this.helperService.toggleGlobalProgressBar(true);
        this.folderService.copyFolder(item.absPath, to).subscribe(
          () => {
            this.afterActionComplete('Folder moved successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('Folder move failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      } else {
        this.helperService.toggleGlobalProgressBar(true);
        this.fileService.copyFile(item.absPath, to).subscribe(
          () => {
            this.afterActionComplete('File moved successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('File move failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      }
    });
  }

  private processDelete() {
    this.selectedItems.forEach((item) => {
      if (item.type == Constants.FolderType) {
        this.helperService.toggleGlobalProgressBar(true);
        this.folderService.deleteFolder(item.absPath).subscribe(
          () => {
            this.afterActionComplete('Folder deleted successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('Folder deletion failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      } else {
        this.helperService.toggleGlobalProgressBar(true);
        this.fileService.deleteFile(item.absPath).subscribe(
          () => {
            this.afterActionComplete('File deleted successfully');
            this.helperService.toggleGlobalProgressBar(false);
          },
          () => {
            this.afterActionComplete('File deletion failed', true);
            this.helperService.toggleGlobalProgressBar(false);
          }
        );
      }
    });
  }

  private afterActionComplete(msg: string, isError: boolean = false) {
    this.getFolderItems(this.currentPath);

    let snackBarConfig: MatSnackBarConfig<any> = { duration: 3000 };
    if (isError) snackBarConfig.panelClass = ['matSnackBarError'];
    this._snackBar.open(msg, null, snackBarConfig);
  }
}
