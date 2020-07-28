import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaleditproductPageRoutingModule } from './modaleditproduct-routing.module';

import { ModaleditproductPage } from './modaleditproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaleditproductPageRoutingModule
  ],
  declarations: [ModaleditproductPage]
})
export class ModaleditproductPageModule {}
