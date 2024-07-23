import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dto/order.dto';
import { SelectWithdrawerComponent } from '../select-withdrawer/select-withdrawer.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'recipientFirstName', 'recipientLastName', 'status', 'deliveryTime', 'action'];
  dataSource: MatTableDataSource<OrderDTO> = new MatTableDataSource();
  selectedOrderIds: string[] = [];

  filters = {
    recipientFirstName: '',
    recipientLastName: '',
    status: '',
    deliveryTime: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOwnedOrders().subscribe(
      (data: OrderDTO[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    this.dataSource.filterPredicate = (order: OrderDTO, filters: string) => {
      const matchFilter = [];
      const filterArray = filters.split('$');
      const columns = Object.keys(this.filters) as (keyof OrderDTO)[];

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

  openSelectWithdrawerDialog(orderId: string) {
    const dialogRef = this.dialog.open(SelectWithdrawerComponent, {
      width: '400px',
      data: { orderId: orderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
