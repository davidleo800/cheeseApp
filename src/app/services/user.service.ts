import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Usuarios } from '../interfaces/user';
import { Quesos, NotifyProduct, ProductFav } from '../interfaces/queso';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usuariosService = this.db.list<Usuarios>('usuarios');
  private productService = this.db.list<Quesos>('productos');
  private notifyProduct = this.db.list<NotifyProduct>('notifyProduct');
  private productFavService = this.db.list<ProductFav>('ProductFav');

  constructor(public db: AngularFireDatabase,
              public storage: AngularFireStorage) { }

  addUser(user: Usuarios) {
    return this.usuariosService.push(user);
  }

  addProduct(queso: Quesos) {
    return this.productService.push(queso);
  }

  addproductFav(productFav: ProductFav) {
    return this.productFavService.push(productFav);
  }

  addNotify(notifyProduct: NotifyProduct) {
    return this.notifyProduct.push(notifyProduct);
  }


  getUsersList(){
    return this.usuariosService;
  }

  getQuesoList(){
    return this.productService;
  }


  getNotifyList(){
    return this.notifyProduct;
  }

  getproductFav(){
    return this.productFavService;
  }

  getUserbyUid() {
    // this.idGregario = this.db.list('/usuarios', ref => ref.orderByChild('iud').equalTo(id));
    return this.db.object('usuarios/').valueChanges();
  }

  getProductos() {
    // this.idGregario = this.db.list('/usuarios', ref => ref.orderByChild('iud').equalTo(id));
    return this.db.object('productos/').valueChanges();
  }


  getQuesosiobyId(id: string) {
    return this.db.object('productos/' + id).valueChanges();
  }

  editUser(user: Usuarios) {
    return this.usuariosService.update(user.key, user);
  }

  editProducts(key: string, queso: Quesos) {
    return this.productService.update(key, queso);
  }

  removeProducts(key: string){
    return this.productService.remove(key);
  }

  removeNotification(key: string){
    return this.notifyProduct.remove(key);
  }

  removeFavorito(key: string){
    return this.productFavService.remove(key);
  }

}
