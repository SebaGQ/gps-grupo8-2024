// SelectWithdrawerComponent

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../dto/user.dto';

@Component({
  selector: 'app-select-withdrawer',
  templateUrl: './select-withdrawer.component.html',
  styleUrls: ['./select-withdrawer.component.css']
})
export class SelectWithdrawerComponent implements OnInit {
  @Input() orderId: string = ''; // Declarar orderId como input
  @Input() departmentNumber: number = 0; // Declarar departmentNumber como input
  @Output() closeModal = new EventEmitter<void>();
  withdrawData: any = {};
  withdrawMethod: string = 'self'; // Default to 'self'
  residents: UserDTO[] = [];
  userRole: string | null = null;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.fetchResidents();
  }

  fetchResidents() {
    if (this.authService.isAdminOrJanitor() && this.departmentNumber > 0) {
      this.userService.getUsersByDepartmentNumberInput(this.departmentNumber).subscribe(
        (data: UserDTO[]) => {
          this.residents = data;
        },
        error => console.error('Error fetching residents', error)
      );
    } else {
      this.userService.getUsersByDepartment().subscribe(
        (data: UserDTO[]) => {
          this.residents = data;
        },
        error => console.error('Error fetching residents', error)
      );
    }
  }

  markAsReadyToWithdraw() {
    if (!this.orderId) {
      console.error('Order ID is missing');
      return;
    }

    const withdrawData = {
      method: this.withdrawMethod,
      ...this.withdrawMethod === 'resident' ? { residentId: this.withdrawData.withdrawnResidentId } : this.withdrawData
    };

    this.orderService.markOrderAsReadyToWithdraw(this.orderId, withdrawData).subscribe(
      () => {
        console.log('Order marked as ready to withdraw');
        this.closeModal.emit(); // Emitir evento para cerrar el modal
      },
      error => console.error('Error marking order as ready to withdraw', error)
    );
  }

  onNoClick(): void {
    this.closeModal.emit(); // Emitir evento para cerrar el modal
  }
}
