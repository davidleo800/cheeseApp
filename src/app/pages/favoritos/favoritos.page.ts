import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Quesos, ProductFav } from 'src/app/interfaces/queso';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Usuarios } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  productos: Observable<Quesos[]>;
  productFavList: Observable<ProductFav[]>;
  productoFav: any;
  usuario: Usuarios;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {

      this.usuario = {
        key: params.key,
        uid: params.uid,
        nombre: params.nombre,
        apellido: params.apellido,
        telefono_fijo: params.telefono_fijo,
        celular: params.celular,
        region: params.region,
        departamento: params.departamento,
        ciudad: params.ciudad
      };
      });
    this.productos = this.userService.getQuesoList().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
  }

  ngOnInit() {
    this.productFavList = this.userService.getproductFav().snapshotChanges().pipe(map(changes => {
      return changes.map (c => ({
        key: c.payload.key, ...c.payload.val()
      }));
    }));
    this.productFavList.subscribe((productFav: any) => {
      productFav = Object.keys(productFav).map(
        e => productFav[e]);
      this.productFavList = productFav.filter((x: { uid: string; }) => x.uid === this.usuario.uid);
      this.productoFav = this.productFavList;
    },
    error => {
      console.log(error as any);
    });
  }

}
