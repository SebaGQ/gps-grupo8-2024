import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderDTO } from '../dto/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = 'orders'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  getOrders(): Observable<OrderDTO[]> {
    return this.httpService.get<{ state: string, data: OrderDTO[] }>(`${this.orderUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getOrderById(id: string): Observable<OrderDTO> {
    return this.httpService.get<{ state: string, data: OrderDTO }>(`${this.orderUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getOwnedOrders(): Observable<OrderDTO[]> {
    return this.httpService.get<{ state: string, data: OrderDTO[] }>(`${this.orderUrl}/owned`).pipe(
      map(response => response.data)
    );
  }

  getOrdersByDepartmentNumber(departmentNumber: number): Observable<OrderDTO[]> {
    return this.httpService.get<{ state: string, data: OrderDTO[] }>(`${this.orderUrl}/by-department/${departmentNumber}`).pipe(
      map(response => response.data)
    );
  }

  createOrder(order: OrderDTO): Observable<OrderDTO> {
    return this.httpService.post<{ state: string, data: OrderDTO }>(`${this.orderUrl}/`, order).pipe(
      map(response => response.data)
    );
  }

  updateOrder(id: string, order: OrderDTO): Observable<OrderDTO> {
    return this.httpService.put<{ state: string, data: OrderDTO }>(`${this.orderUrl}/${id}`, order).pipe(
      map(response => response.data)
    );
  }

  deleteOrder(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.orderUrl}/${id}`);
  }

  markOrderAsReadyToWithdraw(orderId: string, withdrawData: any): Observable<void> {
    return this.httpService.post<void>(`${this.orderUrl}/${orderId}/ready-to-withdraw`, withdrawData);
  }

  withdrawOrders(orderIds: string[], withdrawData: any): Observable<void> {
    return this.httpService.post<void>(`${this.orderUrl}/withdraw`, { orderIds, ...withdrawData });
  }
}
