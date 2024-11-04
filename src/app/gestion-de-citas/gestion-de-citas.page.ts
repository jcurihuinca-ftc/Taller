import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitasService } from '../services/citas.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-gestion-de-citas',
  templateUrl: './gestion-de-citas.page.html',
  styleUrls: ['./gestion-de-citas.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ]
})

export class GestionDeCitasPage implements OnInit {
  formularioCita: FormGroup;
  citas: { frase: string; autor: string }[] = [];
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private sqliteService: SqliteService
  ){
    this.formularioCita = this.fb.group({
      frase: ['', [Validators.required, Validators.minLength(5)]],
      autor: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  async ngOnInit() {
    console.log('ngOnInit Iniciado')
    await this.citasService.inicializarBaseDeDatos();
    try {
      await this.citasService.inicializarBaseDeDatos();
      this.citas = await this.citasService.obtenerTodasCitas();
      console.log('Conexión a la base de datos inicializada en ngOnInit');
    } catch (error) {
      const errorMessage = (error as Error).message || error;
      console.error('Error al inicializar o cargar citas:', errorMessage);
    }
  }

  async agregarCita() {
    try {
      if (!this.formularioCita.valid) {
        console.warn('El formulario no es válido. Verifica los campos antes de continuar.');
        return;
      }
      const { frase, autor } = this.formularioCita.value;

      if (!this.citasService.isConnectionInitialized()) {
        console.error('La conexión a la base de datos no está inicializada');
        this.mensajeError = 'Error: No se pudo conectar a la base de datos. Intente más tarde.';
        setTimeout(() => {
          this.mensajeError = '';
        }, 5000);
        return;
      }
      await this.citasService.agregarCita(frase, autor);
      this.citas = await this.citasService.obtenerTodasCitas();

      await this.sqliteService.persistDatabase();

      this.formularioCita.reset();
      this.mensajeExito = 'La cita se ha guardado correctamente';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);

    } catch (error) {
      console.error('Error al agregar la cita:', error);
      this.mensajeError = 'Ocurrió un error al guardar la cita. Intente nuevamente.';
      setTimeout(() => {
        this.mensajeError = '';
      }, 5000);
    }
  }

  async eliminarCita(id: number) {
    await this.citasService.eliminarCita(id);
    this.citas = await this.citasService.obtenerTodasCitas();
  }
}
