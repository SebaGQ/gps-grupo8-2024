import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['recipientFirstName', 'recipientLastName', 'status', 'timestamp', 'action'];
  dataSource: OrderDTO[] = [];
  filteredOrders: OrderDTO[] = [];
  paginatedData: OrderDTO[] = [];
  residents: UserDTO[] = [];
  showModal: boolean = false;
  currentOrder: OrderDTO | null = null;
  filtersForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Paginación por defecto de 5 elementos
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar // Añadido
  ) {
    this.filtersForm = this.fb.group({
      recipientFirstName: [''],
      recipientLastName: [''],
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
    this.orderService.getOwnedOrders().subscribe(
      (data: OrderDTO[]) => {
        this.dataSource = data;
        this.applyFilters();
      },
      error => {
        console.error('Error fetching orders', error);
        this.snackBar.open('Error al cargar los pedidos', 'Cerrar', { duration: 3000 });
      }
    );
  }

  fetchResidents() {
    this.userService.getUsersByDepartment().subscribe(
      (data: UserDTO[]) => {
        this.residents = data;
      },
      error => {
        console.error('Error fetching residents', error);
        this.snackBar.open('Error al cargar los residentes', 'Cerrar', { duration: 3000 });
      }
    );
  }

  applyFilters() {
    const filters = this.filtersForm.value;
    const filtered = this.dataSource.filter(order => {
      return (
        (!filters.recipientFirstName || order.recipientFirstName?.toLowerCase().includes(filters.recipientFirstName.toLowerCase())) &&
        (!filters.recipientLastName || order.recipientLastName?.toLowerCase().includes(filters.recipientLastName.toLowerCase())) &&
        (!filters.status || order.status === filters.status) &&
        (!filters.deliveryTime || this.compareDates(order.timestamp, filters.deliveryTime))
      );
    });

    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.updatePage();
  }

  compareDates(orderTimestamp: Date | undefined, filterDate: string): boolean {
    if (!orderTimestamp) return false;
    const orderDate = new Date(orderTimestamp);
    const filterDateObj = new Date(filterDate);

    // Ajustar la fecha del filtro para evitar problemas de zona horaria
    filterDateObj.setMinutes(filterDateObj.getMinutes() + filterDateObj.getTimezoneOffset());

    // Compara solo la fecha, sin la hora
    const sameDate = (
      orderDate.getFullYear() === filterDateObj.getFullYear() &&
      orderDate.getMonth() === filterDateObj.getMonth() &&
      orderDate.getDate() === filterDateObj.getDate()
    );

    return sameDate;
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredOrders.slice(startIndex, endIndex);
  }

  changeItemsPerPage(count: string) {
    this.itemsPerPage = Number(count);
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePage();
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
    if (!this.currentOrder?._id) return;
    this.orderService.markOrderAsReadyToWithdraw(this.currentOrder._id, {}).subscribe(
      () => {
        this.snackBar.open('Pedido marcado como listo para retirar', 'Cerrar', { duration: 3000 });
        this.fetchOrders(); // Actualiza la lista de pedidos
        this.closeModal();
      },
      error => {
        console.error('Error marking order as ready to withdraw', error);
        this.snackBar.open('Error al marcar el pedido como listo para retirar', 'Cerrar', { duration: 3000 });
      }
    );
  }

  deleteOrder(orderId: string | undefined) {
    if (!orderId) {
      console.error('Order ID is undefined');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.orderService.deleteOrder(orderId).subscribe(
        () => {
          this.snackBar.open('Pedido eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.fetchOrders(); // Vuelve a cargar la lista de pedidos
        },
        error => {
          console.error('Error deleting order', error);
          this.snackBar.open('Error al eliminar el pedido', 'Cerrar', { duration: 3000 });
        }
      );
    }
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

  getStatusChipClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'chip chip-pending';
      case 'READY':
        return 'chip chip-ready';
      case 'DELIVERED':
        return 'chip chip-delivered';
      default:
        return 'chip';
    }
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'READY':
        return 'Listo para Retirar';
      case 'DELIVERED':
        return 'Retirado';
      default:
        return status ?? '';
    }
  }
}
