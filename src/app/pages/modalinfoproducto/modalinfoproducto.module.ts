import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalinfoproductoPageRoutingModule } from './modalinfoproducto-routing.module';

import { ModalinfoproductoPage } from './modalinfoproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalinfoproductoPageRoutingModule
  ],
  declarations: [ModalinfoproductoPage]
})
export class ModalinfoproductoPageModule {}
