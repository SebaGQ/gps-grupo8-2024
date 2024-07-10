import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: OrderDTO[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOwnedOrders().subscribe(
      (data: OrderDTO[]) => this.orders = data,
      error => console.error('Error fetching orders', error)
    );
  }
}
