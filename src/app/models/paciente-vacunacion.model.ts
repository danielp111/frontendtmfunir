import { Genero } from './paciente.model';

export interface RecomendacionDto {
  vacuna:      string;
  dosis:       string;
  enfermedad:  string;
  detalle:     string;
}

export interface EsquemaVacunacionResponse {
  totalRecomendaciones: number;
  recomendaciones:      RecomendacionDto[];
}

export interface PacienteVacunacionDTO {
  nombresApellidos:            string;
  tipoIdentificacion:          string;
  numeroIdentificacion:        string;
  genero:                      Genero;
  objEsquemaVacunacionResponse: EsquemaVacunacionResponse;
}
