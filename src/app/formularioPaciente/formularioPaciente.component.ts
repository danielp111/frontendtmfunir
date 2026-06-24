import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from '../models/paciente.model';
import { PacienteVacunacionDTO } from '../models/paciente-vacunacion.model';
import { CarnetService } from '../services/carnet.service';
import { ResultadoVacunacionComponent } from '../resultadoVacunacion/resultadoVacunacion.component';

@Component({
  selector: 'app-formulario-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResultadoVacunacionComponent],
  templateUrl: './formularioPaciente.component.html',
  styleUrls: ['./formularioPaciente.component.css']
})
export class FormularioPacienteComponent implements OnInit {
  form!: FormGroup;
  archivoPdf: File | null = null;
  archivoError = '';
  isDragOver = false;
  enviado = false;
  resultado: PacienteVacunacionDTO | null = null;
  cargando = false;

  constructor(private fb: FormBuilder, private carnetService: CarnetService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      genero:                   ['', Validators.required],
      esGestante:               [false],
      semanasGestacion:         [null],
      tieneComorbilidades:      [false],
      esTalentoHumanoSalud:     [false],
      tieneGrado4:              [false],
      municipioDengue:          [false],
      vacunadoCovid:            [false],
      mesesUltimaVacunaCovid:   [null],
      mefDpt5Dosis:             [false]
    });

    // Semanas de gestación requeridas cuando esGestante = true
    this.form.get('esGestante')!.valueChanges.subscribe(gestante => {
      const ctrl = this.form.get('semanasGestacion')!;
      if (gestante) {
        ctrl.setValidators([Validators.required, Validators.min(1), Validators.max(42)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue(null);
      }
      ctrl.updateValueAndValidity();
    });

    // Meses desde última vacuna COVID requeridos cuando vacunadoCovid = true
    this.form.get('vacunadoCovid')!.valueChanges.subscribe(vacunado => {
      const ctrl = this.form.get('mesesUltimaVacunaCovid')!;
      if (vacunado) {
        ctrl.setValidators([Validators.required, Validators.min(0), Validators.max(120)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue(null);
      }
      ctrl.updateValueAndValidity();
    });

    // Resetear campos femeninos si cambia a masculino
    this.form.get('genero')!.valueChanges.subscribe(genero => {
      if (genero === 'M') {
        this.form.patchValue({ esGestante: false, mefDpt5Dosis: false });
      }
    });
  }

  get esFemenino(): boolean { return this.form.get('genero')!.value === 'F'; }
  get esGestante(): boolean { return this.form.get('esGestante')!.value === true; }
  get esVacunadoCovid(): boolean { return this.form.get('vacunadoCovid')!.value === true; }

  formatBytes(bytes: number): string {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.validarYAsignar(file);
  }

  onFileInput(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.validarYAsignar(file);
  }

  private validarYAsignar(file: File): void {
    if (file.type !== 'application/pdf') {
      this.archivoError = 'Solo se aceptan archivos PDF.';
      return;
    }
    this.archivoError = '';
    this.archivoPdf = file;
  }

  quitarArchivo(): void {
    this.archivoPdf = null;
    this.archivoError = '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (!this.archivoPdf) {
      this.archivoError = 'El carné PDF es obligatorio.';
    }
    if (this.form.invalid || !this.archivoPdf) return;

    const paciente: Paciente = this.form.value as Paciente;
    this.cargando = true;
    this.carnetService.extraerCarnet(this.archivoPdf, paciente).subscribe({
      next: resultado => {
        this.resultado = resultado;
        this.enviado = true;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al procesar el carné:', err);
        this.cargando = false;
      }
    });
  }

  resetear(): void {
    this.form.reset({ genero: '', esGestante: false, semanasGestacion: null,
      tieneComorbilidades: false, esTalentoHumanoSalud: false,
      tieneGrado4: false, municipioDengue: false,
      vacunadoCovid: false, mesesUltimaVacunaCovid: null,
      mefDpt5Dosis: false });
    this.archivoPdf = null;
    this.archivoError = '';
    this.enviado = false;
    this.resultado = null;
    this.cargando = false;
  }
}
