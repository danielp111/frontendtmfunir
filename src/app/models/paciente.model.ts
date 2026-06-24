export type Genero = 'F' | 'M';

export interface Paciente {
  genero:                 Genero;
  esGestante:             boolean;
  semanasGestacion:       number | null;
  tieneComorbilidades:    boolean;
  esTalentoHumanoSalud:  boolean;
  tieneGrado4:            boolean;
  municipioDengue:        boolean;
  vacunadoCovid:          boolean;
  mesesUltimaVacunaCovid: number | null;
  mefDpt5Dosis:           boolean;
}
