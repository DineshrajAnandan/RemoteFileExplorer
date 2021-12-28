import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathDisplay',
})
export class PathDisplayPipe implements PipeTransform {
  transform(value: string): string {
      return value.replace(/\\/g, ' \\ ');
  }
}
