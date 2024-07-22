import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { OrderDTO } from '../dto/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = 'orders'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  getOrders(): Observable<OrderDTO[]> {
    return this.httpService.get<OrderDTO[]>(`${this.orderUrl}/`);
  }

  getOrderById(id: string): Observable<OrderDTO> {
    return this.httpService.get<OrderDTO>(`${this.orderUrl}/${id}`);
  }

  getOwnedOrders(): Observable<OrderDTO[]> {
    return this.httpService.get<OrderDTO[]>(`${this.orderUrl}/owned`);
  }

  getOrdersByDepartmentNumber(departmentNumber: number): Observable<OrderDTO[]> {
    return this.httpService.get<OrderDTO[]>(`${this.orderUrl}/by-department/${departmentNumber}`);
  }

  createOrder(order: OrderDTO): Observable<OrderDTO> {
    return this.httpService.post<OrderDTO>(`${this.orderUrl}/`, order);
  }

  updateOrder(id: string, order: OrderDTO): Observable<OrderDTO> {
    return this.httpService.put<OrderDTO>(`${this.orderUrl}/${id}`, order);
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
