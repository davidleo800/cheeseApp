import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  userID: string;
  userService: any;
  idUsuario: any;
  typeUser: any;
  constructor(
    private menuCtrl: MenuController,
    public authService: AuthenticationService) {

     }

  ngOnInit() {}

  openCustom() {
    this.menuCtrl.enable(true, 'custom');
    this.menuCtrl.open('custom');
    this.menuCtrl.toggle();
  }


}
