import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../constants/constants';
import { UploadingItem } from '../models/currentUploads';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiUrl = `${environment.apiUrl}Files`;

  private _currentUploads: UploadingItem[] = [];
  private _uploadItemCounter: number = 0;

  private _currentUploads$: BehaviorSubject<UploadingItem[]> = new BehaviorSubject([]);

  get currentUploads$(): Observable<UploadingItem[]>{
      return this._currentUploads$.asObservable();
  }

  constructor(public http: HttpClient, private helperService: HelperService) {}

  deleteFile(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, {
      params: { path },
    });
  }

  moveOrRenameFile(from: string, to: string) {
    return this.http.put(`${this.apiUrl}/MoveOrRename`, { from, to });
  }

  copyFile(from: string, to: string) {
    return this.http.put(`${this.apiUrl}/Copy`, { from, to });
  }

  downloadFile(path: string) {
    window.location.href = `${this.apiUrl}/Download?path=${path}`;
    // return this.http.get(`${this.apiUrl}/Download`, {
    //   params: { path },
    //   responseType: 'blob',
    // });
  }

  uploadFile(file: any, path: string) {
    this._uploadItemCounter++;
    let data = new FormData();
    data.append('file', file);

    let itemId = this._uploadItemCounter;
    let uploadItem : UploadingItem = {
      itemId,
      itemName: file.name,
      itemLength: file.size as number,
      uploadComplete: false
    };
    this._currentUploads.push(uploadItem);
    this._currentUploads$.next([...this._currentUploads]);

    this.http
      .post(`${this.apiUrl}/Upload?folderPath=${path}`, data)
      .subscribe(() => {
        uploadItem.uploadComplete = true;

        if (!this._currentUploads.find(x => x.itemId == itemId))
          this._currentUploads.push(uploadItem);

        this._currentUploads$.next([...this._currentUploads]);
        this.helperService.folderRefresh();
      });
  }

  clearCurrentUploads(){
    this._currentUploads = [];
    this._currentUploads$.next([...this._currentUploads]);
  }

  createFile(path: string, content: string): Observable<any> {
    let body = {path,content};
    return this.http.put(`${this.apiUrl}/Create`,body);
  }

  readTextFile(path: string) {
    // let params: HttpParams = new HttpParams();
    // params.set("path", path);
    return this.http.get(`${this.apiUrl}/ReadTextFile`, {params : {path}, responseType: 'text'});
  }

  private sizeToString(size: number) {
    if (size >= Constants.OneGB)
      return `${(size / Constants.OneGB).toFixed(2)} GB`;
    else if (size >= Constants.OneMB)
      return `${(size / Constants.OneMB).toFixed(2)} MB`;
    else if (size >= Constants.OneKB)
      return `${(size / Constants.OneKB).toFixed(2)} KB`;
    return `${size} Bytes`;
  }
}
