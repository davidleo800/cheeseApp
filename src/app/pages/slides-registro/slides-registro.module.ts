import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlidesRegistroPageRoutingModule } from './slides-registro-routing.module';

import { SlidesRegistroPage } from './slides-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlidesRegistroPageRoutingModule
  ],
  declarations: [SlidesRegistroPage]
})
export class SlidesRegistroPageModule {}
