import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['recipientFirstName', 'recipientLastName', 'status', 'deliveryTime', 'action'];
  dataSource: OrderDTO[] = [];
  showModal: boolean = false;
  currentOrder: OrderDTO | null = null;
  withdrawMethod: string = 'self';
  withdrawData: any = {};
  residents: UserDTO[] = [];
  filters = { recipientFirstName: '', recipientLastName: '', status: '', deliveryTime: '' };
  paginatedData: OrderDTO[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit() {
    this.fetchOrders();
    this.fetchResidents();
  }

  fetchOrders() {
    this.orderService.getOwnedOrders().subscribe((data: OrderDTO[]) => {
      this.dataSource = data;
      this.applyFilters();
    }, error => console.error('Error fetching orders', error));
  }

  fetchResidents() {
    this.userService.getUsersByDepartment().subscribe((data: UserDTO[]) => {
      this.residents = data;
    }, error => console.error('Error fetching residents', error));
  }

  applyFilters() {
    const filteredOrders = this.dataSource.filter(order => {
      return (
        (this.filters.recipientFirstName ? order.recipientFirstName?.toLowerCase().includes(this.filters.recipientFirstName.toLowerCase()) : true) &&
        (this.filters.recipientLastName ? order.recipientLastName?.toLowerCase().includes(this.filters.recipientLastName.toLowerCase()) : true) &&
        (this.filters.status ? order.status === this.filters.status : true) &&
        (this.filters.deliveryTime ? new Date(order.deliveryTime ?? '').toLocaleDateString().includes(this.filters.deliveryTime) : true)
      );
    });

    this.totalPages = Math.ceil(filteredOrders.length / this.itemsPerPage);
    this.paginatedData = filteredOrders.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  openWithdrawOrderDialog(order: OrderDTO) {
    this.currentOrder = order;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentOrder = null;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }
}
