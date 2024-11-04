import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private dbConnection: any;

  constructor(private sqliteService: SqliteService) {}

  async inicializarBaseDeDatos() {
    console.log('Inicializando Base de Datos...');
    try {
      await this.sqliteService.init();
      console.log('Base de datos inicializada en CitasService.');

      this.dbConnection = this.sqliteService["dbConnection"];

      if (!this.dbConnection) {
        throw new Error('La conexión a la base de datos no se pudo establecer');
      }
    } catch (error) {
      console.error('Error inicializando la base de datos en CitasService:', error);
      throw error;
    }
  }

  isConnectionInitialized(): boolean {
    return !!this.dbConnection;
  }

  async obtenerTodasCitas(): Promise<{ frase: string; autor: string }[]> {
    try {
      if (!this.dbConnection) {
        throw new Error('La conexión a la base de datos no está inicializada');
      }
      const result = await this.dbConnection.query('SELECT * FROM citas');
      return result.values ?? [];
    } catch (error) {
      console.error('Error al obtener todas las citas:', error);
      throw error;
    }
  }

  async agregarCita(frase: string, autor: string) {
    try {
      if (!this.dbConnection) {
        throw new Error('La conexión a la base de datos no está inicializada');
      }
      await this.dbConnection.run('INSERT INTO citas (frase, autor) VALUES (?, ?)', [frase, autor]);
      console.log('Cita agregada correctamente.');
      const result = await this.dbConnection.query('SELECT * FROM citas');
      console.log(result);
    } catch (error) {
      console.error('Error al agregar la cita:', error);
      throw error;
    }
  }

  async eliminarCita(id: number) {
    try {
      if (!this.dbConnection) {
        throw new Error('La conexión a la base de datos no está inicializada');
      }
      await this.dbConnection.run('DELETE FROM citas WHERE id = ?', [id]);
      console.log('Cita eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      throw error;
    }
  }

  async obtenerCitaAleatoria(): Promise<{ frase: string; autor: string } | undefined> {
    try {
      const citas = await this.obtenerTodasCitas();
      if (citas.length === 0) {
        return undefined;
      }
      const indiceAleatorio = Math.floor(Math.random() * citas.length);
      return citas[indiceAleatorio];
    } catch (error) {
      console.error('Error al obtener una cita aleatoria:', error);
      throw error;
    }
  }
}
