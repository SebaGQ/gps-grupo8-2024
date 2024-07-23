import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<SelectWithdrawerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
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
    const orderId = this.data.orderId;
    if (this.withdrawMethod === 'self') {
      // If 'self' is selected, clear all other withdraw data
      this.withdrawData.withdrawnResidentId = null;
      this.withdrawData.expectedWithdrawnPersonFirstName = null;
      this.withdrawData.expectedWithdrawnPersonLastName = null;
    } else if (this.withdrawMethod === 'resident') {
      // If resident is selected, clear other withdraw data
      this.withdrawData.expectedWithdrawnPersonFirstName = null;
      this.withdrawData.expectedWithdrawnPersonLastName = null;
    } else if (this.withdrawMethod === 'other') {
      // If other is selected, clear resident withdraw data
      this.withdrawData.withdrawnResidentId = null;
    }
    this.orderService.markOrderAsReadyToWithdraw(orderId, this.withdrawData).subscribe(
      () => {
        console.log('Order marked as ready to withdraw');
        this.dialogRef.close();
      },
      error => console.error('Error marking order as ready to withdraw', error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
