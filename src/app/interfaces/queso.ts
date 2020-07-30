export interface Quesos{
    key?: string;
    uid?: string;
    email?: string;
    titulo: string;
    descripcion: string;
    img?: any;
    estado: boolean;
    promocion: boolean;
}

export interface MyData {
    name: string;
    filepath: string;
    size: number;
}

export interface NotifyProduct {
    key?: string;
    uidProductor: string;
    uidDist?: string;
    keyproducto: string;
    producto?: Quesos;
}

export interface ProductFav {
    key?: string;
    uid: string;
    keyproducto: string;
}
