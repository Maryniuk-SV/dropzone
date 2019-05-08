import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dropzone';

  constructor(private http: HttpClient) {}

  handleChange(ev) {
    console.log('blob: ', ev);
    const image = blobToFile(ev.image, 'some-name.jpg');
    this.uploadToBackend(image);
  }

  uploadToBackend(image: File): void {
    const uploadData = new FormData();
    uploadData.append('myFile', image, image.name);
    // this.http.post('my-backend.com/file-upload', uploadData).subscribe();
  }
}

const blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  // Cast to a File() type
  return theBlob as File;
};
