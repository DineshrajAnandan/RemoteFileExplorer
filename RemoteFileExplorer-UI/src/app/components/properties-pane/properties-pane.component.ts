import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Constants } from 'src/app/constants/constants';
import { FileSystemItem } from 'src/app/models/fileSystemModel';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'properties-pane',
  templateUrl: './properties-pane.component.html',
  styleUrls: ['./properties-pane.component.scss'],
})
export class PropertiesPaneComponent implements OnInit {
  currentOpenFolderName: string = Constants.RootPath;
  selectedItem: FileSystemItem;
  constants = Constants;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.currentOpenFolder$
      .pipe(filter((x) => !!x))
      .subscribe((val) => {
        this.currentOpenFolderName = val.currentDirName;
      });

    this.helperService.selectedItems$.subscribe((val) => {
      if (val && val.length > 0) {
        this.selectedItem = val[val.length - 1];
      }
    });
  }
}
