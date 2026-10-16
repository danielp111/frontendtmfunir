import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { PacienteVacunacionDTO } from '../models/paciente-vacunacion.model';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class CarnetService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  extraerCarnet(archivo: File, paciente: Paciente): Observable<PacienteVacunacionDTO> {
    const body = new FormData();
    body.append('archivo', archivo, archivo.name);
    body.append('paciente', new Blob([JSON.stringify(paciente)], { type: 'application/json' }));

    const url = `${this.appConfig.orquestadorUrl}/api/orquestador/carnet/extraer`;
    return this.http.post<PacienteVacunacionDTO>(url, body);
  }
}
