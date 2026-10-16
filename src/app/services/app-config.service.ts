import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppConfig {
  orquestadorUrl: string;
}

// Valor por defecto para desarrollo local (ng serve) o si /config.json no responde.
const DEFAULT_CONFIG: AppConfig = {
  orquestadorUrl: 'http://localhost:9092'
};

/**
 * Carga la configuración en tiempo de ejecución desde /config.json,
 * que el servidor Node (server.ts) genera a partir de las variables de entorno
 * del contenedor. Así la misma imagen sirve para cualquier entorno.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {

  private config: AppConfig = DEFAULT_CONFIG;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async load(): Promise<void> {
    // En el renderizado del servidor no se llama al orquestador, basta con el valor por defecto.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      const respuesta = await fetch('/config.json', { cache: 'no-store' });
      if (respuesta.ok) {
        this.config = { ...DEFAULT_CONFIG, ...(await respuesta.json()) };
      }
    } catch {
      console.warn('No se pudo cargar /config.json, se usa la configuración por defecto.');
    }
  }

  get orquestadorUrl(): string {
    return this.config.orquestadorUrl.replace(/\/+$/, '');
  }
}
