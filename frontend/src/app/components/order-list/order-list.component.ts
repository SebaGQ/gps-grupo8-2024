import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'recipientFirstName', 'recipientLastName', 'status', 'deliveryTime', 'action'];
  dataSource: OrderDTO[] = [];
  selectedOrderIds: string[] = [];

  filters = {
    recipientFirstName: '',
    recipientLastName: '',
    status: '',
    deliveryTime: ''
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOwnedOrders().subscribe(
      (data: OrderDTO[]) => {
        this.dataSource = data;
        this.applyFilters();
      },
      error => console.error('Error fetching orders', error)
    );
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

  applyFilters() {
    this.dataSource = this.dataSource.filter(order => {
      return (
        (this.filters.recipientFirstName ? order.recipientFirstName?.toLowerCase().includes(this.filters.recipientFirstName.toLowerCase()) : true) &&
        (this.filters.recipientLastName ? order.recipientLastName?.toLowerCase().includes(this.filters.recipientLastName.toLowerCase()) : true) &&
        (this.filters.status ? order.status === this.filters.status : true) &&
        (this.filters.deliveryTime ? new Date(order.deliveryTime ?? '').toLocaleDateString().includes(this.filters.deliveryTime) : true)
      );
    });
  }

  openSelectWithdrawerDialog(orderId: string) {
    // Implement your custom dialog or modal logic here
    console.log('Open dialog for order ID:', orderId);
  }
}
