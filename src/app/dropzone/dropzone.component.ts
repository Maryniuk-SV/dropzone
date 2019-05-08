import {
  Component,
  ViewChild,
  AfterContentInit,
  Input,
  ViewEncapsulation,
  forwardRef,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {
  DropzoneConfigInterface,
  DropzoneDirective,
} from 'ngx-dropzone-wrapper';

const noop = () => {};

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropzoneComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropzoneComponent implements AfterContentInit {
  private readonly DEFAULT_WIDTH = '100%';
  private readonly DEFAULT_HEIGHT = '100%';
  private readonly DEFAULT_PREVIEW_HEIGHT = '40px';
  private readonly DEFAULT_MAX_FILE_SIZE = 10; // Mb
  private readonly DEFAULT_EXTENTIONS = '.jpeg, .jpg, .bmp, .png';

  config: DropzoneConfigInterface = {};

  private _value: any;

  imagePreview: SafeUrl;
  id: string;
  showError: boolean;
  isEmpty: boolean = true;

  @Input() height: string = this.DEFAULT_HEIGHT;
  @Input() width: string = this.DEFAULT_WIDTH;
  @Input() privewHeight: string = this.DEFAULT_PREVIEW_HEIGHT;
  @Input() maxFilesize: number = this.DEFAULT_MAX_FILE_SIZE;
  @Input() extentions: string = this.DEFAULT_EXTENTIONS;

  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild('Dropzone') dropzoneEl: DropzoneDirective;

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
    this.change.emit(val);
    this.onChangeCallback(val);

    if (val && val.image) {
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          this.setPreview(reader.result as string);
          this.swichToPreview();
        },
        false,
      );

      reader.readAsDataURL(val.image);
    }
  }

  constructor(private sanitizer: DomSanitizer) {
    this.id = this.ID();
  }

  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  ngAfterContentInit() {
    this.config = {
      maxFiles: 1,
      autoReset: 1,
      errorReset: 1,
      cancelReset: 1,
      maxFilesize: this.maxFilesize,
      acceptedFiles: this.extentions,
      autoProcessQueue: false,
      clickable: `.image-dropzone`,
      previewTemplate: `<span></span>`,
      dictDefaultMessage: '',
    };
  }

  onError(event) {
    this.showError = true;
    this.swichToEmpty();
  }

  onAddedFile(file: any) {
    // Replase already existed file
    if (
      this.dropzoneEl.dropzone() &&
      this.dropzoneEl.dropzone().files[1] != null
    ) {
      this.dropzoneEl
        .dropzone()
        .removeFile(this.dropzoneEl.dropzone().files[0]);
    }

    // Hide error message
    this.showError = false;

    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        // Stop process if file invalid
        if (file.status === 'error') {
          return;
        }

        // Convert dropzonejs file to blob
        fetch(reader.result as string)
          .then((res) => res.blob())
          .then((blob) => (this.value = { image: blob }));

        // Convert unsafe dataUrl to SafeUrl
        this.setPreview(reader.result as string);

        this.swichToPreview();
      },
      false,
    );

    reader.readAsDataURL(file);
  }

  onReset() {
    this.value = null;
    this.swichToEmpty();
  }

  private setPreview(value: string): SafeUrl {
    // Convert unsafe dataUrl to SafeUrl
    return (this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(value));
  }

  private swichToPreview(): boolean {
    return (this.isEmpty = false);
  }

  private swichToEmpty(): boolean {
    return (this.isEmpty = true);
  }

  private ID(): string {
    return (
      'd_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    this.value = value;
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
