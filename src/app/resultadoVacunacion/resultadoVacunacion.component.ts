import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteVacunacionDTO } from '../models/paciente-vacunacion.model';

@Component({
  selector: 'app-resultado-vacunacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultadoVacunacion.component.html',
  styleUrls: ['./resultadoVacunacion.component.css']
})
export class ResultadoVacunacionComponent {
  @Input() resultado!: PacienteVacunacionDTO;
}
