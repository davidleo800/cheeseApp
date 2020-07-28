import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertController, LoadingController, IonSlides } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuarios } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { DatosTerr, Region } from 'src/app/interfaces/territorios';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-slides-registro',
  templateUrl: './slides-registro.page.html',
  styleUrls: ['./slides-registro.page.scss'],
})
export class SlidesRegistroPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false,
    type: 'ios'
  };
  @ViewChild('mySlider')  slides: IonSlides;

  datosTerr: Observable<DatosTerr[]>;
  datosRegion: Observable<Region[]>;

  userID: any;
  user: Usuarios = {
    uid: this.userID,
    nombre: '',
    apellido: '',
    telefono_fijo: '',
    celular: '',
    region: '',
    departamento: '',
    ciudad: '',
    typeuser: ''
  };
  loading: any;

  onSubmit(f) {
    console.log(f.value);
  }
  constructor(
    public router: Router,
    public userService: UserService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public authService: AuthenticationService,
    private dataService: DataService) {

  this.authService.ngFireAuth.authState.subscribe(user => {
    if (user) {
      this.userID = user.uid;
      this.user.uid = this.userID;
       // console.log(this.userID);
    }
  });

 }

  ngOnInit() {
    this.datosTerr = this.dataService.getTerrOpt();
    this.datosRegion = this.dataService.getReg();
  }

  addUser(user: Usuarios){
    this.userService.addUser(user).then(ref => {
      this.swipeNext();
    });
}

async presentAlertConfirm(message: string) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Registrado',
    message,
    buttons: [ {
        text: 'Continuar',
        handler: () => {
          console.log('Confirm Okay');
        }
      }
    ]
  });

  await alert.present();
}

async presentLoading( message: string) {
  this.loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message
  });
  return this.loading.present();
}

  swipeNext(){
    this.slides.slideNext();
  }

  comenzar(){
    this.router.navigate(['main']);
  }

}
