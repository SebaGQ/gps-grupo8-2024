import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  order: OrderDTO = {
    departmentNumber: 0,
    recipientFirstName: '',
    recipientLastName: '',
    deliveryTime: new Date(),
    deliveryPersonName: '',
  };

  constructor(private orderService: OrderService) {}

  createOrder() {
    this.orderService.createOrder(this.order).subscribe(
      (data: OrderDTO) => {
        console.log('Order created successfully', data);
      },
      error => console.error('Error creating order', error)
    );
  }
}
