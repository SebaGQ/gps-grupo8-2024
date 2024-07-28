import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';

export interface DialogData {
  orderId: string;
}

@Component({
  selector: 'app-select-withdrawer',
  templateUrl: './select-withdrawer.component.html',
  styleUrls: ['./select-withdrawer.component.css']
})
export class SelectWithdrawerComponent implements OnInit {
  withdrawData: any = {};
  residents: UserDTO[] = [];
  withdrawMethod: string = 'self'; // Default to 'self'

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchResidents();
  }

  fetchResidents() {
    this.userService.getUsersByDepartment().subscribe(
      (data: UserDTO[]) => {
        this.residents = data;
      },
      error => console.error('Error fetching residents', error)
    );
  }

  markAsReadyToWithdraw() {
    const orderId = this.withdrawData.orderId;
    if (this.withdrawMethod === 'self') {
      this.withdrawData.withdrawnResidentId = null;
      this.withdrawData.expectedWithdrawnPersonFirstName = null;
      this.withdrawData.expectedWithdrawnPersonLastName = null;
    } else if (this.withdrawMethod === 'resident') {
      this.withdrawData.expectedWithdrawnPersonFirstName = null;
      this.withdrawData.expectedWithdrawnPersonLastName = null;
    } else if (this.withdrawMethod === 'other') {
      this.withdrawData.withdrawnResidentId = null;
    }
    this.orderService.markOrderAsReadyToWithdraw(orderId, this.withdrawData).subscribe(
      () => {
        console.log('Order marked as ready to withdraw');
        // Lógica para cerrar el modal sin NgbActiveModal
        document.getElementById('selectWithdrawerModal')?.remove();
      },
      error => console.error('Error marking order as ready to withdraw', error)
    );
  }

  onNoClick(): void {
    // Lógica para cerrar el modal sin NgbActiveModal
    document.getElementById('selectWithdrawerModal')?.remove();
  }
}
