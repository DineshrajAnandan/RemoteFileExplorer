import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileSystemModel } from '../models/fileSystemModel';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  apiUrl = `${environment.apiUrl}Folders`;

  constructor(public http: HttpClient) {}

  GetMyFolderContents(
    path: string = '',
    includeHidden: boolean = false
  ): Observable<FileSystemModel> {
    return this.http.get<FileSystemModel>(`${this.apiUrl}`, {
      params: {
        path,
        includeHidden,
      },
    });
  }

  GetAllDirectoriesInMyFolder(
    path: string = '',
    includeHidden: boolean = false
  ): Observable<FileSystemModel> {
    return this.http.get<FileSystemModel>(`${this.apiUrl}/Directories`, {
      params: {
        path,
        includeHidden,
      },
    });
  }

  createFolder(path: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Create`, null, {
      params: { path },
    });
  }

  deleteFolder(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, {
      params: { path },
    });
  }

  moveOrRenameFolder(from: string, to: string) {
    return this.http.put(`${this.apiUrl}/MoveOrRename`, { from, to });
  }

  copyFolder(from: string, to: string) {
    return this.http.put(`${this.apiUrl}/Copy`, { from, to });
  }

  downloadFolder(path: string) {
    window.location.href = `${this.apiUrl}/Download?path=${path}`
    // return this.http.get(`${this.apiUrl}/Download`, {
    //   params: { path },
    //   responseType: 'blob',
    // });
  }
}
