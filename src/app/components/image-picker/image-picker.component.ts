import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera } = Plugins;
import {
  ActionSheetController,
  Platform,
  AlertController,
} from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePicked = new EventEmitter<File | Blob>();
  @Output() urlPicked = new EventEmitter<string>();
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef;
  @Input() showPreview = false;
  @Input() selectedImage: string;
  @Input() readonly: boolean = false;
  @Input() visible: boolean = true;

  constructor(
    private sheet: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickImage() {
    if (this.readonly) {
      return;
    }
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.sheet
        .create({
          header: 'Elija una opcion',
          buttons: [
            {
              text: 'Seleccionar imagen',
              icon: 'images',
              handler: () => {
                this.filePickerRef.nativeElement.click();
              },
            },
            {
              text: 'Insert image URL',
              icon: 'globe',
              handler: () => {
                this.getImageUrl();
              },
            },
          ],
        })
        .then((sheet) => sheet.present());
    } else {
      this.sheet
        .create({
          header: 'Elija una opcion',
          buttons: [
            {
              text: 'Tomar foto',
              icon: 'camera',
              handler: () => {
                this.getPicture(CameraSource.Camera);
              },
            },
            {
              text: 'Seleccionar imagen',
              icon: 'images',
              handler: () => {
                this.getPicture(CameraSource.Photos);
              },
            },
          ],
        })
        .then((sheet) => sheet.present());
    }
  }

  private getPicture(source: CameraSource) {
    Camera.getPhoto({
      quality: 50,
      source: source,
      correctOrientation: true,
      preserveAspectRatio: true,
      height: 1000,
      width: 1000,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        const base64Img = 'data:image/jpeg;base64,' + image.base64String;
        this.selectedImage = base64Img;

        const rawData = atob(image.base64String);
        const bytes = new Array(rawData.length);
        for (var x = 0; x < rawData.length; x++) {
          bytes[x] = rawData.charCodeAt(x);
        }
        const arr = new Uint8Array(bytes);
        const blob = new Blob([arr], { type: 'image/png' });

        this.imagePicked.emit(blob);

      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };
    fr.readAsDataURL(pickedFile);
    this.imagePicked.emit(pickedFile);
  }

  getImageUrl() {
    this.alertCtrl
      .create({
        header: 'Insert image URL',
        inputs: [
          {
            placeholder: 'www.example.org/image.jpeg',
            name: 'imageUrl',
            type: 'text',
          },
        ],
        buttons: [
          { text: 'Cancel', role: 'destructive' },
          {
            text: 'Insert',
            handler: () => {
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
        return alert.onDidDismiss();
      })
      .then((alert) => {
        if (alert.role === 'destructive') {
          return;
        }
        const imageUrl = alert.data.values.imageUrl;
        this.selectedImage = imageUrl;
        this.urlPicked.emit(imageUrl);
      });
  }
}
