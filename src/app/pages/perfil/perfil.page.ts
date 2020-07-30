import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { DatosTerr } from 'src/app/interfaces/territorios';
import { Region } from '../../interfaces/territorios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  datosTerr: Observable<DatosTerr[]>;
  datosRegion: Observable<Region[]>;
  usuario: Usuarios;
  userID: string;
  userslist: any;
  user: any;
  constructor(private userService: UserService,
              public authService: AuthenticationService,
              public router: Router,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(params => {

      this.usuario = {
        key: params.key,
        nombre: params.nombre,
        apellido: params.apellido,
        telefono_fijo: params.telefono_fijo,
        celular: params.celular,
        region: params.region,
        departamento: params.departamento,
        ciudad: params.ciudad
      };
      });

    }

  ngOnInit() {
    this.datosTerr = this.dataService.getTerrOpt();
    this.datosRegion = this.dataService.getReg();
  }

  saveUser(usuario: Usuarios){

    this.userService.editUser(usuario).then(() => {
      this.router.navigate(['main']);
    });
  }

}
