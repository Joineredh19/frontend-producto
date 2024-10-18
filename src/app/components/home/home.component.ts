import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductoService } from '../../services/producto.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, TableModule, ToastModule, TooltipModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  producto: any[] = [];
  loading: boolean = true;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.getAllProductos().subscribe({
      next: (data) => {
        this.producto = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.mostrarError('Error al cargar los Productos');
      }
    });
  }

  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.cargarProductos();
        this.mostrarExito('Producto eliminado correctamente');
      },
      error: (error) => {
        this.mostrarError('Error al eliminar el Producto');
      }
    });
  }

  mostrarExito(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 3000
    });
  }

  mostrarError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
      life: 3000
    });
  }
}
