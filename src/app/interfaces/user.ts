export interface User {
    key?: string;
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
 }

export interface Usuarios {
    key?: string;
    uid?: string;
    nombre: string;
    apellido: string;
    telefono_fijo: string;
    celular: string;
    region: string;
    departamento: string;
    ciudad: string;
    typeuser?: string;
}