import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants/constants';
import { FileSystemItem } from '../models/fileSystemModel';

@Pipe({
  name: 'fileGridSelectedItems'
})
export class FileGridSelectedItemsPipe implements PipeTransform {

  transform(value: FileSystemItem, selectedItems: FileSystemItem[]): string {
    if(selectedItems.map(i => i.absPath).includes(value.absPath))
      return 'highlightRow';
    return ''; 
  }

}
