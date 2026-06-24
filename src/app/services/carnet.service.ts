import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { PacienteVacunacionDTO } from '../models/paciente-vacunacion.model';

const API_URL = 'http://localhost:9092/api/orquestador/carnet/extraer';

@Injectable({ providedIn: 'root' })
export class CarnetService {

  constructor(private http: HttpClient) {}

  extraerCarnet(archivo: File, paciente: Paciente): Observable<PacienteVacunacionDTO> {
    const body = new FormData();
    body.append('archivo', archivo, archivo.name);
    body.append('paciente', new Blob([JSON.stringify(paciente)], { type: 'application/json' }));

    return this.http.post<PacienteVacunacionDTO>(`${API_URL}`, body);
  }
}
