import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Quesos, MyData } from 'src/app/interfaces/queso';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  image: any;
  userID: string;
  filePath: any;
  downloadURL: Observable<string>;
  userEmail: any;
  queso: Quesos = {
    uid: this.userID,
    titulo: '',
    descripcion: '',
    img: '',
    estado: true,
    promocion: false,
  };
  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(private modalCtrl: ModalController,
              public authService: AuthenticationService,
              public userService: UserService,
              private storage: AngularFireStorage,
              private database: AngularFirestore) {
    this.authService.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
        this.queso.email = user.email;
        this.queso.uid = this.userID;
         // console.log(this.userID);
      }
    });

    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('Images');
    this.images = this.imageCollection.valueChanges();
   }

  ngOnInit() {
  }

  salirSinArgumentos() {

    this.modalCtrl.dismiss();

  }

  salirConArgumentos() {

    this.modalCtrl.dismiss({
      nombre: 'Leonardo',
      pais: 'Italia'
    });

  }

  addProduct(queso: Quesos){
    this.userService.addProduct(queso).then(ref => {
      this.salirSinArgumentos();
    });

  }

  PromocionToggle(){

    if ( !this.queso.promocion ){
      this.queso.promocion = true;
    }else{
      this.queso.promocion = false;
    }
  }
/*
  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('Archivo no soportado');
     window.alert('Archivo no soportado');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;
    // The storage path
    const path = `image/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'imageupload' };
    // File reference
    const fileRef = this.storage.ref(path);
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp => {
          this.urlDownload = resp.toString;
          
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
        
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );
  }*/
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
          this.addImagetoDB({
            name: this.image.name,
            filepath: urlImage,
            size: this.fileSize
          });
          this.userService.addProduct(queso).then(ref => {
            this.salirSinArgumentos();
          });
          console.log(urlImage);
        })
      }), tap(snap => {
        this.fileSize = snap.totalBytes;
    })
    ).subscribe();
  }else{
    this.userService.addProduct(queso).then(ref => {
      this.salirSinArgumentos();
    });
  }
  }


}
