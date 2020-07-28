import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userID: any;
  idUsuario: any;
  uidUsuarios: any;

  constructor(public authService: AuthenticationService,
              public router: Router,
              public userService: UserService) { }

  ngOnInit() {
  }

  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        if (this.authService.isEmailVerified) {
          // Funcion que extrae el uid
          this.authService.ngFireAuth.authState.subscribe(user => {
            if (user) {
              this.userID = user.uid;
              // Funcion que comprueba que exista el usuario en dabase realtime
              this.userService.getUserbyUid().subscribe(
                (data: any) => {
                  data = Object.keys(data).map(
                    e => data[e]);
                  this.idUsuario = data;
                  this.uidUsuarios = this.idUsuario.find((x: { uid: string; }) => x.uid == this.userID);
                  if(this.uidUsuarios !== undefined){
                    // si el uid existe en database realtime se envia a formulario main
                    this.router.navigate(['main']);
                  }else{
                    // si el uid NO existe en database realtime se envia a formulario de registro slides-welcome
                    this.router.navigate(['slides-registro']);
                  }
                },
                error => {
                  console.log(error as any);
                }
              );
            }
          });

        } else {
          console.log('Email is not verified');
          return false;
        }
      }).catch((error) => {
        console.log(error.message);
      });
  }
  pageRegister(){
    this.router.navigate(['registration']);
  }

}
