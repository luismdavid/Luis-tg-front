import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';

const components = [
  ImagePickerComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [...components]
})
export class ComponentsModule { }
