import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController, ModalController, NavParams, NavController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { map } from 'rxjs/operators';
import { Quesos } from '../../interfaces/queso';
import { MisproductosPage } from '../misproductos/misproductos.page';
import { ModalinfoproductoPage } from '../modalinfoproducto/modalinfoproducto.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  productosQuesos: Observable<Quesos[]>;
  userID: any;
  idUsuario: any;
  typeUser: any;
  productos: any;
  router: any;
  datosUser: any;
  datosUsuarios: any;
  datosAutenticacion: any;


  constructor(public userService: UserService,
              public authService: AuthenticationService,
              private menuCtrl: MenuController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public navCtrl: NavController) {
    this.authService.ngFireAuth.authState.subscribe(user => {
    if (user) {
      this.userID = user.uid;

    }
    });

  }

  ionViewWillEnter(){
  // lista de usuarios con key
  this.datosUsuarios = this.userService.getUsersList().snapshotChanges().pipe(map(changes => {
    return changes.map (c => ({
      key: c.payload.key, ...c.payload.val()
    }));
  })).subscribe((data: any) => {
    data = Object.keys(data).map(
      e => data[e]);
    //  obtiene el objeto completo de usuario
    this.datosUser = data.find((x: { uid: string; }) => x.uid == this.userID);
    console.log(this.datosUser);
    this.idUsuario = data;
    this.typeUser = this.idUsuario.find((x: { uid: string; }) => x.uid == this.userID);
    // Busca en usuario el tipo de usuario y l oconvierte en string


    if (this.typeUser !== undefined){
      let device = JSON.stringify(this.typeUser.typeuser);
      device = device.replace('"', '');
      this.typeUser = device.replace('"', '');
      console.log(this.typeUser);
    }else{
    // si el uid NO existe en database realtime se envia a formulario de registro slides-welcome
    }
  },
  error => {
    console.log(error as any);
  });
  }

  ngOnInit() {
    this.productosQuesos = this.userService.getQuesoList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
    this.productosQuesos.subscribe((product: any) => {
      product = Object.keys(product).map(
        e => product[e]);
      this.productos = product.reverse();
      console.log(this.productos);
    },
    error => {
      console.log(error as any);
    });

    /*
    this.userService.getProductos()
      .subscribe((product: any) => {
          product = Object.keys(product).map(
            e => product[e]);
          this.productos = product.reverse();
          // console.log(this.productos);
        },
        error => {
          console.log(error as any);
        });
*/
  }

  async abrirModal() {

    const modal = await this.modalCtrl.create({
      component: ModalInfoPage,
        componentProps: {
        nombre: 'David',
        pais: 'Colombia'
    }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    // console.log('Retorno del modal: ', data);
  }

  async informacionModal() {

      const modal = await this.modalCtrl.create({
        component: ModalinfoproductoPage,
          componentProps: {
          datos: this.datosUser.nombre
      }
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      // console.log('Retorno del modal: ', data);
  }


  openCustom() {
    this.menuCtrl.enable(true, 'custom');
    this.menuCtrl.open('custom');
    this.menuCtrl.toggle();
  }


}
