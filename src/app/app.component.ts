import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  public isWeb: boolean;
  public load: boolean;

  constructor(private platform: Platform, private sqlite: SqliteService) {
    this.isWeb = false;
    this.load = false;
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    const info = await Device.getInfo();
    this.isWeb = info.platform === 'web';

    if (this.isWeb) {
      await this.sqlite.init();
    }

    this.sqlite.dbReady.subscribe((ready) => {
      this.load = ready;
      if (ready) {
        console.log('Base de datos lista.');
      } else {
        console.error('Base de datos no lista.');
      }
    });
  }
}