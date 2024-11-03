import { CitasService } from '../services/citas.service';
import { IonHeader, IonButton, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonHeader,
    CommonModule, RouterModule
  ]
})
export class InicioPage implements OnInit {
  cita: { frase: string; autor: string } | undefined;

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    this.mostrarCitaAleatoria();
  }

  async mostrarCitaAleatoria() {
    try {
      this.cita = await this.citasService.obtenerCitaAleatoria();
    } catch (error) {
      console.error('Error al obtener la cita:', error);
    }
  }
}
