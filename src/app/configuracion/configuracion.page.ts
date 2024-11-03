import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class ConfiguracionPage implements OnInit {
  borrarCitas: boolean = false;

  constructor() {}

  async ngOnInit() {
    await this.cargarConfiguracion();
  }

  async guardarConfiguracion() {
    await Preferences.set({
      key: 'borrarCitas',
      value: JSON.stringify(this.borrarCitas)
    });
  }

  async cargarConfiguracion() {
    const { value } = await Preferences.get({ key: 'borrarCitas' });
    this.borrarCitas = value ? JSON.parse(value) : false;
  }
}
