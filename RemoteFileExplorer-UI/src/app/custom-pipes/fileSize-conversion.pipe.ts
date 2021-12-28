import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../constants/constants';

@Pipe({
  name: 'fileSizeToString',
})
export class FileSizeConversionPipe implements PipeTransform {
  transform(value: number): string {
      return this.sizeToString(value);
  }

  private sizeToString(size: number) {
    if (size == 0) return '0 Byte';
    
    if (size >= Constants.OneGB)
      return `${(size / Constants.OneGB).toFixed(2)} GB`;
    else if (size >= Constants.OneMB)
      return `${(size / Constants.OneMB).toFixed(2)} MB`;
    else if (size >= Constants.OneKB)
      return `${(size / Constants.OneKB).toFixed(2)} KB`;
    return `${size} Bytes`;
  }
}
