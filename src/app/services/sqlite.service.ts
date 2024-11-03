import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private dbConnection: SQLiteDBConnection | null = null;
  private sqlite: SQLiteConnection;
  public isWeb: boolean = false;
  public dbName: string = '';

  constructor(private http: HttpClient) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async init() {
    try {
      console.log('Inicializando SQLite...');
      const info = await Device.getInfo();

      if (info.platform === 'android') {
        console.log('Plataforma Android detectada, manejando permisos de forma predeterminada.');
      } else if (info.platform === 'web') {
        this.isWeb = true;
        await this.sqlite.initWebStore();
      } else if (info.platform === 'ios') {
        console.log('Plataforma iOS detectada.');
      }

      await this.setupDatabase();
    } catch (error) {
      console.error('Error al inicializar el servicio SQLite:', error);
    }
  }

  private async setupDatabase() {
    try {
      const dbSetup = await Preferences.get({ key: 'first_setup_key' });

      if (!dbSetup.value) {
        await this.downloadDatabase();
      } else {
        this.dbName = await this.getDbName();
        const connection = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);

        if (connection) {
          this.dbConnection = connection;
          await this.dbConnection.open();
          console.log('Conexión a la base de datos abierta.');
          this.dbReady.next(true);
        } else {
          throw new Error('Error al crear la conexión. No se devolvió un objeto de conexión.');
        }
      }
    } catch (error) {
      console.error('Error configurando la base de datos:', error);
    }
  }

  private async downloadDatabase() {
    this.http.get('assets/db/db.json').subscribe(async (jsonExport: any) => {
      try {
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await this.sqlite.isJsonValid(jsonstring);

        if (isValid.result) {
          this.dbName = jsonExport.database;
          await this.sqlite.importFromJson(jsonstring);
          const connection = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);

          if (connection) {
            this.dbConnection = connection;
            await this.dbConnection.open();
            await Preferences.set({ key: 'first_setup_key', value: '1' });
            await Preferences.set({ key: 'dbname', value: this.dbName });
            console.log('Base de datos importada y abierta correctamente.');
            this.dbReady.next(true);
          } else {
            throw new Error('Error al crear la conexión después de la importación.');
          }
        } else {
          throw new Error('El JSON de la base de datos no es válido.');
        }
      } catch (error) {
        console.error('Error al descargar o configurar la base de datos:', error);
      }
    });
  }

  private async getDbName() {
    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' });
      if (dbname.value) {
        this.dbName = dbname.value;
      }
    }
    return this.dbName;
  }

  getConnection(): SQLiteDBConnection | null {
    if (this.dbReady.getValue()) {
      return this.dbConnection;
    } else {
      console.error('La base de datos no está lista.');
      return null;
    }
  }
}