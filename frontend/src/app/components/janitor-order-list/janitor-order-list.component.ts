import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { WithdrawOrderComponent } from '../withdraw-order/withdraw-order.component';

@Component({
  selector: 'app-janitor-order-list',
  templateUrl: './janitor-order-list.component.html'
})
export class JanitorOrderListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'firstName', 'lastName', 'departmentNumber', 'status', 'deliveryTime', 'action'];
  dataSource: OrderDTO[] = [];
  selectedOrderIds: string[] = [];

  filters = {
    recipientFirstName: '',
    recipientLastName: '',
    departmentNumber: null,
    status: '',
    deliveryTime: ''
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe(
      (data: OrderDTO[]) => {
        this.dataSource = data;
        this.applyFilters();
      },
      error => console.error('Error fetching orders', error)
    );
  }

  applyFilters() {
    this.dataSource = this.dataSource.filter(order => {
      return (
        (this.filters.recipientFirstName ? order.recipientFirstName?.toLowerCase().includes(this.filters.recipientFirstName.toLowerCase()) : true) &&
        (this.filters.recipientLastName ? order.recipientLastName?.toLowerCase().includes(this.filters.recipientLastName.toLowerCase()) : true) &&
        (this.filters.departmentNumber ? order.departmentNumber === this.filters.departmentNumber : true) &&
        (this.filters.status ? order.status === this.filters.status : true) &&
        (this.filters.deliveryTime ? new Date(order.deliveryTime ?? '').toLocaleDateString().includes(this.filters.deliveryTime) : true)
      );
    });
  }

  toggleOrderSelection(orderId: string | undefined) {
    if (orderId) {
      const index = this.selectedOrderIds.indexOf(orderId);
      if (index > -1) {
        this.selectedOrderIds.splice(index, 1);
      } else {
        this.selectedOrderIds.push(orderId);
      }
    } else {
      console.error('Order ID is undefined');
    }
  }

  openWithdrawOrderDialog(order: OrderDTO) {
    // Implement your custom dialog or modal logic here
    console.log('Open dialog for order:', order);
    // Logic for opening a dialog or modal goes here
  }
}
