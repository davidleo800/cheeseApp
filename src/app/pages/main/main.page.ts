import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController, ModalController, NavParams, NavController, AlertController } from '@ionic/angular';
import { ModalInfoPage } from '../modal-info/modal-info.page';
import { map } from 'rxjs/operators';
import { Quesos  } from '../../interfaces/queso';
import { ModalinfoproductoPage } from '../modalinfoproducto/modalinfoproducto.page';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  productosQuesos: Observable<Quesos[]>;
  prodfavView: any;
  userID: any;
  idUsuario: any;
  typeUser: any;
  productos: any;
  router: any;
  datosUser: any;
  datosUsuarios: any;
  datosAutenticacion: any;
  notificaciones: Observable<{ key: string; uidProductor: string; uidDist?: string; keyproducto: string; producto?: Quesos; }[]>;
  notifUsuario: any;
  numNotif: number;


  constructor(public userService: UserService,
              public authService: AuthenticationService,
              private menuCtrl: MenuController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public navCtrl: NavController,
              public alertController: AlertController,
              ) {
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
    this.datosUser = data.find((x: { uid: string; }) => x.uid === this.userID);
    console.log(this.datosUser);
    this.idUsuario = data;
    this.typeUser = this.idUsuario.find((x: { uid: string; }) => x.uid === this.userID);
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


  // Numero de notifaciones a mostrar
  this.notificaciones = this.userService.getNotifyList().snapshotChanges().pipe(map(changes => {
    return changes.map (c => ({
      key: c.payload.key, ...c.payload.val()
    }));
  }));
  this.notificaciones.subscribe((notif: any) => {
    notif = Object.keys(notif).map(
      e => notif[e]);
    this.notifUsuario = notif.filter((x: { uidProductor: string; }) => x.uidProductor === this.userID);
    this.numNotif = this.notifUsuario.length;
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

  async creditos() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Créditos',
      subHeader: `Ver ${environment.version}`,
      message: `Developer: ${environment.developer}, comp: ${environment.comp}`,
      buttons: ['OK']
    });

    await alert.present();
  }

}
