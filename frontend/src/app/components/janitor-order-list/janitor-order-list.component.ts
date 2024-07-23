import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { WithdrawOrderComponent } from '../withdraw-order/withdraw-order.component';

@Component({
  selector: 'app-janitor-order-list',
  templateUrl: './janitor-order-list.component.html'
})
export class JanitorOrderListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'firstName', 'lastName', 'departmentNumber', 'status', 'deliveryTime', 'action'];
  dataSource: MatTableDataSource<OrderDTO> = new MatTableDataSource();
  selectedOrderIds: string[] = [];

  filters = {
    recipientFirstName: '',
    recipientLastName: '',
    departmentNumber: null,
    status: '',
    deliveryTime: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe(
      (data: OrderDTO[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilters();
      },
      error => console.error('Error fetching orders', error)
    );
  }

  applyFilters() {
    this.dataSource.filterPredicate = (order: OrderDTO, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split('$');
      const columns = Object.keys(this.filters) as (keyof OrderDTO)[];

      // Añadir las condiciones de filtro
      const customFilter = (column: any, filter: string) => {
        if (!filter) return true;
        return column?.toString().toLowerCase().includes(filter.toLowerCase());
      };

      for (let i = 0; i < filterArray.length; i++) {
        matchFilter.push(customFilter(order[columns[i]], filterArray[i]));
      }
      return matchFilter.every(Boolean);
    };

    const filterString = Object.values(this.filters).join('$');
    this.dataSource.filter = filterString.trim().toLowerCase();
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
    const dialogRef = this.dialog.open(WithdrawOrderComponent, {
      width: '400px',
      data: { orderIds: [order._id], departmentNumber: order.departmentNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchOrders(); // Actualiza la lista de pedidos después de cerrar el diálogo
    });
  }
}
