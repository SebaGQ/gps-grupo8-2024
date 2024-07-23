import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';

@Component({
  selector: 'app-withdraw-order',
  templateUrl: './withdraw-order.component.html',
  styleUrls: ['./withdraw-order.component.css']
})
export class WithdrawOrderComponent implements OnInit {
  @Input() orderIds: string[] = [];
  withdrawData: any = {};
  selectedWithdrawerType: string = ''; // Variable para controlar el tipo de retirante
  residents: UserDTO[] = []; // Variable para almacenar los residentes
  departmentNumber: number;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    public dialogRef: MatDialogRef<WithdrawOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.orderIds = data.orderIds;
    this.departmentNumber = data.departmentNumber; // Asegúrate de pasar el número de departamento
  }

  ngOnInit() {
    this.fetchResidents();
  }

  fetchResidents() {
    this.userService.getUsersByDepartmentNumberInput(this.departmentNumber).subscribe(
      (response: any) => {
        this.residents = response.data; // Accede a la propiedad 'data' de la respuesta
      },
      error => console.error('Error fetching residents', error)
    );
  }

  withdrawOrders() {
    if (this.orderIds.length > 0) {
      if (this.selectedWithdrawerType === 'resident') {
        this.withdrawData.residentId = this.withdrawData.selectedResidentId;
      }
      this.orderService.withdrawOrders(this.orderIds, this.withdrawData).subscribe(
        () => {
          console.log('Orders withdrawn successfully');
          this.dialogRef.close();
        },
        error => console.error('Error withdrawing orders', error)
      );
    }
  }
}
