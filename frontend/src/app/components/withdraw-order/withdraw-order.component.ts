import { Component, Input, OnInit } from '@angular/core';
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
  @Input() departmentNumber: number = 0; // Recibe el número de departamento como input
  withdrawData: any = {};
  selectedWithdrawerType: string = ''; // Variable para controlar el tipo de retirante
  residents: UserDTO[] = []; // Variable para almacenar los residentes

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

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
          // Lógica para cerrar el modal sin NgbActiveModal
          document.getElementById('withdrawOrderModal')?.remove();
        },
        error => console.error('Error withdrawing orders', error)
      );
    }
  }

  dismissModal() {
    // Lógica para cerrar el modal sin NgbActiveModal
    document.getElementById('withdrawOrderModal')?.remove();
  }
}
