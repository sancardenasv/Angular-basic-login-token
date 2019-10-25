import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/users/';
  private apiKey = 'kaHUAu9873Ks9Jw1AKJse_8023';
  private userToken: string;
  // Crear usuarios
  // http://localhost:8080/users/signupNewUser?key=[API_KEI]

  // Login
  // http://localhost:8080/users/verifyPassword?key=[API_KEI]

  constructor(private http:HttpClient) {
    this.leerToken();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      name: usuario.nombre,
      password: usuario.password
    };

    return this.http.post(
      `${this.url}/verifyPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['body']['idToken'], new Date(Date.parse(resp['body']['expiresIn'])));
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      name: usuario.nombre,
      password: usuario.password
    };

    return this.http.post(
      `${this.url}/signupNewUser?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        this.guardarToken(resp['body']['idToken'], new Date(Date.parse(resp['body']['expiresIn'])));
        return resp;
      })
    );
  }

  private guardarToken(idToken: string, expiresIn: Date) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    localStorage.setItem('expiresIn', expiresIn.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
  }

  autenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expiresIn = new Date();
    expiresIn.setTime(Number(localStorage.getItem('expiresIn')));

    if (expiresIn > new Date()) {
      return true;
    } else {
      return false;
    }
    
  }
}
