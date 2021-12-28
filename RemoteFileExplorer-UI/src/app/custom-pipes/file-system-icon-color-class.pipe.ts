import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants/constants';

@Pipe({
  name: 'fileSystemIconColorClass'
})
export class FileSystemIconColorClassPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if(value === Constants.FolderType) 
      return 'yellow';
    else if (value.includes('txt'))
      return 'blue'
    return 'grey' 
  }

}
