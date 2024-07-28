import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';

@Component({
  selector: 'app-janitor-order-list',
  templateUrl: './janitor-order-list.component.html',
  styleUrls: ['./janitor-order-list.component.css']
})
export class JanitorOrderListComponent implements OnInit {
  displayedColumns: string[] = ['recipientFirstName', 'recipientLastName', 'departmentNumber', 'status', 'deliveryTime', 'action'];
  dataSource: OrderDTO[] = [];
  filteredOrders: OrderDTO[] = [];
  paginatedOrders: OrderDTO[] = [];
  showModal: boolean = false;
  showWithdrawModal: boolean = false;
  currentOrder: OrderDTO | null = null;
  departmentNumber: number = 0;
  residents: UserDTO[] = [];
  filtersForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Valor predeterminado
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(private orderService: OrderService, private userService: UserService, private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      recipientFirstName: [''],
      recipientLastName: [''],
      departmentNumber: [''], // Cambiado a string para comparación de contiene
      status: [''],
      deliveryTime: ['']
    });
  }

  ngOnInit() {
    this.fetchOrders();
    this.fetchResidents();
    this.filtersForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
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

  fetchResidents() {
    this.userService.getUsersByDepartment().subscribe(
      (data: UserDTO[]) => {
        this.residents = data;
      },
      error => console.error('Error fetching residents', error)
    );
  }

  applyFilters() {
    const filters = this.filtersForm.value;
    const filtered = this.dataSource.filter(order => {
      return (
        (!filters.recipientFirstName || order.recipientFirstName?.toLowerCase().includes(filters.recipientFirstName.toLowerCase())) &&
        (!filters.recipientLastName || order.recipientLastName?.toLowerCase().includes(filters.recipientLastName.toLowerCase())) &&
        (!filters.departmentNumber || order.departmentNumber?.toString().includes(filters.departmentNumber)) &&
        (!filters.status || order.status === filters.status) &&
        (!filters.deliveryTime || this.compareDates(order.deliveryTime, filters.deliveryTime))
      );
    });

    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.updatePage();
  }

  compareDates(orderDate: Date | undefined, filterDate: string): boolean {
    if (!orderDate) return false;
    const orderDateString = new Date(orderDate).toLocaleDateString();
    const filterDateString = new Date(filterDate).toLocaleDateString();
    return orderDateString === filterDateString;
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  changeItemsPerPage(count: number) {
    this.itemsPerPage = +count;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePage();
  }

  openWithdrawOrderModal(order: OrderDTO) {
    this.currentOrder = order;
    this.departmentNumber = order.departmentNumber ?? 0;
    this.showWithdrawModal = true;
  }

  closeWithdrawModal() {
    this.showWithdrawModal = false;
    this.currentOrder = null;
  }

  openWithdrawOrderDialog(order: OrderDTO) {
    this.currentOrder = order;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentOrder = null;
  }

  markAsReadyToWithdraw() {
    console.log('Marcar como listo para retirar:', this.currentOrder);
    this.closeModal();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }
}
