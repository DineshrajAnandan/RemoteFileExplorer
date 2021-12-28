import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import { FileSystemIconClassPipe } from './custom-pipes/file-system-icon-class.pipe';
import { FileGridComponent } from './components/file-grid/file-grid.component';
import { FileGridSelectedItemsPipe } from './custom-pipes/fileGrid-selected-items.pipe';
import { FormsModule } from '@angular/forms';
import { GetNameDialog } from './sharedComponents/get-name-dialog/getName-dialog.component';
import { AlertDialog } from './sharedComponents/alert-dialog/alert-dialog.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FolderSelectorDialog } from './sharedComponents/folderSelector-dialog/folderSelector-dialog.component';
import { UploadProgressComponent } from './components/upload-progress/upload-progress.component';
import { FileSizeConversionPipe } from './custom-pipes/fileSize-conversion.pipe';
import { PropertiesPaneComponent } from './components/properties-pane/properties-pane.component';
import { PathDisplayPipe } from './custom-pipes/path-display.pipe';
import { TextFileDialog } from './sharedComponents/text-file-dialog/text-file-dialog.component';
import { FileSystemIconColorClassPipe } from './custom-pipes/file-system-icon-color-class.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    FileSystemIconClassPipe,
    FileGridComponent,
    FileGridSelectedItemsPipe,
    GetNameDialog,
    AlertDialog,
    MainLayoutComponent,
    SideMenuComponent,
    FolderSelectorDialog,
    UploadProgressComponent,
    FileSizeConversionPipe,
    PropertiesPaneComponent,
    PathDisplayPipe,
    TextFileDialog,
    FileSystemIconColorClassPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatRippleModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
