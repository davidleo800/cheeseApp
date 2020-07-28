import { Injectable } from '@angular/core';
import { DatosTerr, Region } from '../interfaces/territorios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getTerrOpt(){
    return this.http.get<DatosTerr[]>('/assets/data/DataTerritorio.json');
  }
  getReg(){
    return this.http.get<Region[]>('/assets/data/Regiones.json');
  }
}
