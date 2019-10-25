import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarUsuario = true;
    }
  }

  login(form: NgForm) {
    if (form.valid) {
      Swal.fire({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      console.log("Form submitted valid", form);
      this.auth.login(this.usuario).subscribe(
        resp => {
          console.log("SERVER resp", resp);
          Swal.close();
          if (this.recordarUsuario) {
            localStorage.setItem('email', this.usuario.email);
          }
          this.router.navigateByUrl('/home');
        }, err => {
          console.error("ERROR in login: ", err.error.reason);
          Swal.fire({
            type: 'error',
            title: 'Error de autenticación',
            text: err.error.reason
          });
        })
    }
  }

}
