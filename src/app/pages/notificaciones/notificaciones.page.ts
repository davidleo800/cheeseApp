import { Component, OnInit, ApplicationRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { NotifyProduct } from '../../interfaces/queso';
import { map } from 'rxjs/operators';
import { PushService } from '../../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  notificaciones: Observable<NotifyProduct[]>;
  notifyProducto: any;
  producto: any;
  productos: any;
  infoDistribuidor: any;
  infoDist: any;
  userID: string;

  constructor(private userService: UserService,
              private authService: AuthenticationService,
              public pushService: PushService,
              private applicationRef: ApplicationRef,
              private router: Router) {
    this.authService.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
      }
    });


   }

  ngOnInit() {
    this.pushService.pushListener.subscribe( noti => {
      this.mensajes.unshift( noti );
      this.applicationRef.tick();
    });
  }

  ionViewWillEnter(){
    this.notificaciones = this.userService.getNotifyList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
    this.notificaciones.subscribe((notif: any) => {
      notif = Object.keys(notif).map(
        e => notif[e]);
      console.log(notif);

      // busca los productos del productor que tiene la notificacion y los filtra por key
      this.producto = this.userService.getQuesoList().snapshotChanges().pipe(map(changes => {
        return changes.map (c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      }));
      this.producto.subscribe((product: any) => {
        product = Object.keys(product).map(
          e => product[e]);
        this.productos = product.filter((x: { uid: string; }) => x.uid === this.userID);
        console.log(this.productos);
      },
      error => {
        console.log(error as any);
      });

      // Busca distribuidor que envio solicitud
      this.infoDistribuidor = this.userService.getUsersList().snapshotChanges().pipe(map(changes => {
        return changes.map (c => ({
          key: c.payload.key, ...c.payload.val()
        }));
      }));

      this.infoDistribuidor.subscribe((distribuidor: any) => {
        distribuidor = Object.keys(distribuidor).map(
          e => distribuidor[e]);
        this.infoDist = distribuidor;
        // this.infoDist = distribuidor.find((x: { uid: string; }) => x.uid === noti.uidDist);
        console.log(this.infoDist);
      },
      error => {
        console.log(error as any);
      });



    },
    error => {
      console.log(error as any);
    });
  }

  deleteNotify(key: string){
    this.userService.removeProducts(key).then(() => {
      this.router.navigate(['notificaciones']);
    });
  }

}
