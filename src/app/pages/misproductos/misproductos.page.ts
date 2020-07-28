import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Quesos } from '../../interfaces/queso';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModaleditproductPage } from '../modaleditproduct/modaleditproduct.page';

@Component({
  selector: 'app-misproductos',
  templateUrl: './misproductos.page.html',
  styleUrls: ['./misproductos.page.scss'],
})
export class MisproductosPage implements OnInit {

  productos: Observable<Quesos[]>;
  userID: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userService: UserService,
              private authService: AuthenticationService,
              public modalCtrl: ModalController) {
    this.authService.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
      }
    });
    this.productos = this.userService.getQuesoList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));

  }

  ngOnInit() {
  }

  listarProducto(){
    this.productos = this.userService.getQuesoList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
  }



}
