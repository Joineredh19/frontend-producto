import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoMockService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 10 },
    { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 20 },
    { id: 3, nombre: 'Producto 3', precio: 300, cantidad: 30 },
  ];

  constructor() { }

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  getProducto(id: number): Observable<Producto | undefined> {
    return of(this.productos.find(p => p.id === id));
  }

  crearProducto(producto: Producto): Observable<Producto> {
    const newProducto = { ...producto, id: this.productos.length + 1 };
    this.productos.push(newProducto);
    return of(newProducto);
  }

  actualizarProducto(producto: Producto): Observable<Producto | undefined> {
    const index = this.productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.productos[index] = producto;
      return of(producto);
    }
    return of(undefined);
  }

  eliminarProducto(id: number): Observable<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
