import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [];
  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal) { }

  configuracionInicial(){
    this.oneSignal.startInit('2cf70818-df4a-4abb-894a-6fe3ff637994', '14486066621');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
    console.log('notificación recibida', noti);
    this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe( async (noti) => {
      // do something when a notification is opened
      console.log('notificación abierta', noti);
      await this.notificacionRecibida(noti.notification);
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida( noti: OSNotification ){

    const payload = noti.payload;

    // evitar que la notificacion se duplique
    const exitePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID );

    if(exitePush){
      return;
    }

    this.mensajes.unshift( payload );
    this.pushListener.emit(payload);
  }

}
