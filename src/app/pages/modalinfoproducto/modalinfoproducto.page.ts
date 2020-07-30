import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Quesos, NotifyProduct, ProductFav } from '../../interfaces/queso';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { Usuarios } from '../../interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modalinfoproducto',
  templateUrl: './modalinfoproducto.page.html',
  styleUrls: ['./modalinfoproducto.page.scss'],
})
export class ModalinfoproductoPage implements OnInit {

  productFavList: Observable<ProductFav[]>;
  notifyProduct: NotifyProduct;
  queso: Quesos;
  est: boolean;
  prom: boolean;
  datos: any;
  estado1: string;
  estado2: string;
  datosUsuarios: any;
  datosUser: any;
  ciudad: any;
  dep: any;
  region: any;
  cel: any;
  fijo: any;
  nom: any;
  userID: any;
  prodfavView: any;
  productFav: ProductFav = {
    uid: '',
    keyproducto: ''
  };
  keyProductFav: any;
  notificacion: any;
  productFavListprev: any;

  constructor(
              private activatedRoute: ActivatedRoute,
              public userService: UserService,
              public authService: AuthenticationService,
              private emailComposer: EmailComposer,
              public router: Router,
              public alertController: AlertController) {
    this.authService.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
        this.notifyProduct.uidDist = user.uid;
        this.productFav.uid = user.uid;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      this.datos = params.uid;
      console.log(this.datos);
      let est1 = JSON.stringify(params.estado);
      est1 = est1.replace('"', '');
      this.estado1 = est1.replace('"', '');
      let est2 = JSON.stringify(params.promocion);
      est2 = est2.replace('"', '');
      this.estado2 = est2.replace('"', '');
      if (this.estado1 === 'true'){
        this.est = true;
      }else{
        this.est = false;
      }
      if (this.estado2 === 'true'){
        this.prom = true;
      }else{
        this.prom = false;
      }
      this.queso = {
        key: params.key,
        uid: params.uid,
        email: params.email,
        titulo: params.titulo,
        descripcion: params.descripcion,
        img: params.img,
        estado: this.est,
        promocion: this.prom
        };
      this.notifyProduct = {
        uidProductor: params.uid,
        keyproducto: params.key
      };
      });

  }

  ngOnInit() {

    this.datosUsuarios = this.userService.getUsersList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));

    this.datosUsuarios.subscribe((data: any) => {
      data = Object.keys(data).map(
        e => data[e]);
      //  obtiene el objeto completo de usuario
      const dat = data.find((x: { uid: string; }) => x.uid === this.queso.uid);
      this.ciudad = dat.ciudad;
      this.dep = dat.departamento;
      this.region = dat.region;
      this.cel = dat.celular;
      this.fijo = dat.telefono_fijo;
      this.nom = dat.nombre;
    },
    error => {
      console.log(error as any);
    });



  }

  ionViewWillEnter(){
          // listar productos favoritos
    this.productFavList = this.userService.getproductFav().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
    this.productFavList.subscribe((productFav: any) => {
      productFav = Object.keys(productFav).map(
        e => productFav[e]);
      this.productFavList = productFav.filter((x: { uid: string; }) => x.uid === this.userID);
      this.productFavListprev = this.productFavList;
      this.prodfavView = this.productFavListprev.filter((x: { keyproducto: string; }) => x.keyproducto === this.queso.key);
      if (this.prodfavView.length === 1){
        this.keyProductFav = this.prodfavView;
        this.keyProductFav = this.keyProductFav[0].key;
      }
      this.notificacion = this.prodfavView.length;

    },
    error => {
      console.log(error as any);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Contacto',
      message: 'El mensaje fue enviado al productor',
      buttons: ['OK']
    });

    await alert.present();
  }

  addProduct(notifyProduct: NotifyProduct){
    this.presentAlert();
    this.userService.addNotify(notifyProduct).then(ref => {
      this.router.navigate(['main']);
    });

  }

  addFavorito(keyProd: string){
    this.productFav.keyproducto = keyProd;
    this.userService.addproductFav(this.productFav);
  }

  deleteFavorito(key){
    this.userService.removeFavorito(key);
  }

}
