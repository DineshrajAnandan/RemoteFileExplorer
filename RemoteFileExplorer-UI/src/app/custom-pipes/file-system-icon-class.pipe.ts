import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants/constants';

@Pipe({
  name: 'fileSystemIconClass'
})
export class FileSystemIconClassPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if(value === Constants.FolderType) 
      return 'folder';
    else if (value.includes('txt'))
      return 'text_snippet'
    return 'insert_drive_file' 
  }

}
