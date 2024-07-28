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
    displayedColumns: string[] = ['select', 'recipientFirstName', 'recipientLastName', 'status', 'deliveryTime', 'action'];
    dataSource: OrderDTO[] = [];
    selectedOrderIds: string[] = [];
    showModal: boolean = false;
    showWithdrawModal: boolean = false; // Controla la visibilidad del modal de retiro
    currentOrderId: string | undefined;
    withdrawMethod: string = 'self';
    withdrawData: any = {};
    residents: UserDTO[] = [];
    filters = { recipientFirstName: '', recipientLastName: '', status: '', deliveryTime: '' };
    paginatedData: OrderDTO[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    departmentNumber: number = 0; // Suponiendo que tienes un número de departamento

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

    openWithdrawOrderModal(order: OrderDTO) {
        this.selectedOrderIds = [order._id!]; // Asignar el ID de la orden seleccionada
        this.departmentNumber = order.departmentNumber!; // Suponiendo que tienes el número de departamento en la orden
        this.showWithdrawModal = true; // Mostrar el modal de retiro
    }

    closeWithdrawModal() {
        this.showWithdrawModal = false; // Cerrar el modal de retiro
        this.selectedOrderIds = []; // Reiniciar la selección de órdenes
    }

    openWithdrawOrderDialog(order: OrderDTO) {
        this.currentOrderId = order._id;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.currentOrderId = undefined;
        this.withdrawMethod = 'self'; // Reiniciar el método de retiro
        this.withdrawData = {}; // Reiniciar los datos de retiro
    }

    markAsReadyToWithdraw() {
        const withdrawData = {
            method: this.withdrawMethod,
            ...this.withdrawMethod === 'resident' ? { residentId: this.withdrawData.withdrawnResidentId } : this.withdrawData
        };

        this.orderService.markOrderAsReadyToWithdraw(this.currentOrderId!, withdrawData).subscribe(
            () => {
                console.log('Orden marcada como lista para retirar:', this.currentOrderId);
                this.closeModal();
                this.fetchOrders(); // Refrescar la lista de órdenes después de la actualización
            },
            error => console.error('Error al marcar la orden como lista para retirar', error)
        );
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