import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;


  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      Swal.fire({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      console.log("Formulario enviado", this.usuario, form);
      this.auth.nuevoUsuario(this.usuario).subscribe(
        resp => {
        console.log("SERVER resp", resp);
        Swal.close();
        if (this.recordarUsuario) {
          localStorage.setItem('email', this.usuario.email);
        }
        this.router.navigateByUrl('/home');
      }, err => {
        console.error("ERROR creating user: ", err.error.reason);
        Swal.fire({
          type: 'error',
          title: 'Error creando usuario',
          text: err.error.reason
        });
      }); 
    }
  }


}
