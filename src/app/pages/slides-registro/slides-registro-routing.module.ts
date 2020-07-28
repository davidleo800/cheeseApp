import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlidesRegistroPage } from './slides-registro.page';

const routes: Routes = [
  {
    path: '',
    component: SlidesRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlidesRegistroPageRoutingModule {}
