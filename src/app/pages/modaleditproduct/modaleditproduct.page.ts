import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quesos, MyData } from 'src/app/interfaces/queso';
import { UserService } from '../../services/user.service';
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-modaleditproduct',
  templateUrl: './modaleditproduct.page.html',
  styleUrls: ['./modaleditproduct.page.scss'],
})
export class ModaleditproductPage implements OnInit {

  image: any;
  userID: string;
  filePath: any;
  fileName: string;
  fileSize: number;
  keyProduct: string;

  estado1: any;
  estado2: any;
  est: boolean;
  prom: boolean;
  isToggled: any;
  datos: any;
  queso: Quesos;
  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              public navCtrl: NavController,
              public router: Router,
              private storage: AngularFireStorage,
              private database: AngularFirestore) {
    this.activatedRoute.params.subscribe(params => {
      this.datos = params;
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
      this.keyProduct = params.key;
      this.queso = {
        uid: params.uid,
        titulo: params.titulo,
        descripcion: params.descripcion,
        img: params.img,
        estado: this.est,
        promocion: this.prom
      };
      // Convertir el objeto en arreglo para extraer el booleano 'promocion'
      // console.log(params);
      params = Object.keys(params).map(
        e => params[e]);
      this.isToggled = params[4];

      // console.log(this.datos);
      });
  }

  ngOnInit() {
  }

  saveProducto(queso: Quesos){

    this.userService.editProducts(this.keyProduct, queso).then(() => {
      this.router.navigate(['misproductos']);
    });
  }

  deleteProducto(){
    this.userService.removeProducts(this.keyProduct).then(() => {
      this.router.navigate(['misproductos']);
    });
  }

  PromocionToggle1(){
  }
  PromocionToggle2(){
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.database.createId();
    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }
  handler(event: any): void{
    this.image = event.target.files[0];
  }

  uploadImage(image: MyData, queso: Quesos){
    if (this.image !== undefined){
    this.filePath = `image/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize (() => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          this.queso.img = urlImage;
          this.userService.editProducts(this.keyProduct, queso).then(ref => {
            this.router.navigate(['misproductos']);
          });
          console.log(urlImage);
        });
      }), tap(snap => {
        this.fileSize = snap.totalBytes;
    })
    ).subscribe();
  }else{
    this.userService.editProducts(this.keyProduct, queso).then(ref => {
      this.router.navigate(['misproductos']);
    });
  }
  }

}
