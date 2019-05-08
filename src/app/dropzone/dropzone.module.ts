import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropzoneComponent } from './dropzone.component';
import {
  DropzoneModule as DZModule,
  DropzoneConfigInterface,
  DROPZONE_CONFIG,
} from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'null',
  maxFiles: 1,
  thumbnailMethod: 'contain',
  thumbnailWidth: null,
  thumbnailHeight: null,
};

@NgModule({
  imports: [CommonModule, DZModule],
  exports: [DropzoneComponent],
  declarations: [DropzoneComponent],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
})
export class CustomDropzoneModule {}
