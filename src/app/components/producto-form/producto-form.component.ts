import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { ToastModule } from 'primeng/toast';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent implements OnInit {
  formProducto: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public router: Router
  ) {
    this.formProducto = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      precio: [1000, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && id !== 'crear') {
      this.edit = true;
      this.getProductoById(+id);
    }
  }

  getProductoById(id: number): void {
    this.productoService.getProducto(id).pipe(
      catchError(error => {
        this.handleError('Error al cargar el producto', error);
        this.router.navigateByUrl('/');
        return of(null);
      })
    ).subscribe(producto => {
      if (producto) {
        this.formProducto.patchValue(producto);
      }
    });
  }

  crearProducto(): void {
    if (this.formProducto.invalid) {
      this.markFormGroupTouched(this.formProducto);
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, complete todos los campos requeridos correctamente'
      });
      return;
    }

    this.isSaveInProgress = true;
    const formData = new FormData();
    formData.append('producto', JSON.stringify(this.formProducto.value));

    this.productoService.crearProducto(this.formProducto.value).pipe(
      finalize(() => this.isSaveInProgress = false)
    ).subscribe({
      next: () => this.handleSuccess('Producto creado correctamente'),
      error: (error) => this.handleError('Error al crear el producto', error)
    });
  }

  actualizarProducto(): void {
    if (this.formProducto.invalid) {
      this.markFormGroupTouched(this.formProducto);
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, complete todos los campos requeridos correctamente'
      });
      return;
    }

    this.isSaveInProgress = true;
    this.productoService.actualizarProducto(this.formProducto.value).pipe(
      finalize(() => this.isSaveInProgress = false)
    ).subscribe({
      next: () => this.handleSuccess('Producto actualizado correctamente'),
      error: (error) => this.handleError('Error al actualizar el producto', error)
    });
  }

  private handleSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message
    });
    this.router.navigateByUrl('/');
  }

  private handleError(message: string, error: any): void {
    console.error(error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
