import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { auth } from 'firebase';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;
  authState: any = null;
  uidUsuarios: any;
  idUsuario: any;
  userID: any;

  constructor(public afStore: AngularFirestore,
              public ngFireAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router,
              public ngZone: NgZone,
              public userService: UserService) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.userID = user.uid;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        }
    });
  }

      // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  // Email verification when new user register
  async SendVerificationMail() {
    try{
      return (await this.ngFireAuth.currentUser).sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email']);
    });
    }catch ( error) {
      console.log( error );
    }
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
         // Funcion que extrae el uid
        this.ngFireAuth.authState.subscribe(user => {
          if (user) {
            this.userID = user.uid;
            // Funcion que comprueba que exista el usuario en dabase realtime
            this.userService.getUserbyUid().subscribe(
              (data: any) => {
                data = Object.keys(data).map(
                  e => data[e]);
                this.idUsuario = data;
                this.uidUsuarios = this.idUsuario.find((x: { uid: string; }) => x.uid === this.userID);
                if (this.uidUsuarios !== undefined){
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
        //  this.router.navigate(['main']);
        });
       this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Store user in localStorage
   SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['main']);
    });
  }

}
