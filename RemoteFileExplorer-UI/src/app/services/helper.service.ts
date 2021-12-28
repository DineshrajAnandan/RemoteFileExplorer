import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { FileSystemItem, FileSystemModel } from "../models/fileSystemModel";

@Injectable({providedIn:'root'})
export class HelperService {
    private _showGlobalProgressBar$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _selectedItems$: BehaviorSubject<FileSystemItem[]> = new BehaviorSubject([]);
    // private _selectedDestinationFolder$: BehaviorSubject<FileSystemItem> = new BehaviorSubject(null);
    private _currentOpenFolder$: BehaviorSubject<FileSystemModel> = new BehaviorSubject(null);
    private _requestFolderRefresh$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    get showGlobalProgressBar$(): Observable<boolean>{
        return this._showGlobalProgressBar$.asObservable();
    }

    get selectedItems$(): Observable<FileSystemItem[]> {
        return this._selectedItems$.asObservable();
    }

    // get selectedDestinationFolder$(): Observable<FileSystemItem> {
    //     return this._selectedDestinationFolder$.asObservable();
    // }
    get currentOpenFolder$(): Observable<FileSystemModel> {
        return this._currentOpenFolder$.asObservable();
    }

    get requestFolderRefresh$(): Observable<boolean> {
        return this._requestFolderRefresh$.asObservable();
    }

    toggleGlobalProgressBar(val: boolean) {
        this._showGlobalProgressBar$.next(val);
    }

    setSelectedItem(val:FileSystemItem) {
        if(val)
            this._selectedItems$.next([val]);
        else
            this._selectedItems$.next([]);
    }

    clearSelectedItems() {
        this._selectedItems$.next([]);
    }

    // setSelectedDestinationFolder(val: FileSystemItem) {
    //     this._selectedDestinationFolder$.next(val);
    // }
    // clearSelectedDestinationFolder() {
    //     this._selectedDestinationFolder$.next(null);
    // }
    setCurrentOpenFolder(val: FileSystemModel) {
        this._currentOpenFolder$.next(val);
    }

    folderRefresh() {
        this._requestFolderRefresh$.next(true);
    }
}