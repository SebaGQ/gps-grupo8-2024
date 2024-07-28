import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../services/visitor.service';
import { VisitorDTO } from '../dto/visitor.dto';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  visitors: VisitorDTO[] = [];

  constructor(private visitorService: VisitorService) {}

  ngOnInit() {
    this.fetchVisitors();
  }

  fetchVisitors() {
    this.visitorService.getVisitors().subscribe(
      (data: VisitorDTO[]) => {
        console.log('Datos recibidos:', data);
        this.visitors = data;
      },
      error => {
        console.error('Error fetching visitors', error);
      }
    );
  }

  openDialog(visitor?: VisitorDTO) {
    const dialogRef = window.open('', '_blank', 'width=800,height=600');
    dialogRef!.document.write(`
      <html>
        <head>
          <title>Formulario de Visitante</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; margin-bottom: 5px; }
            .form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
            .button-group { margin-top: 20px; }
            .button-group button { padding: 10px 15px; margin-right: 10px; }
          </style>
        </head>
        <body>
          <h2>Formulario de Visitante</h2>
          <form id="visitorForm">
            <div class="form-group">
              <label for="name">Nombre:</label>
              <input type="text" id="name" name="name" value="${visitor ? visitor.name : ''}">
            </div>
            <div class="form-group">
              <label for="lastName">Apellido:</label>
              <input type="text" id="lastName" name="lastName" value="${visitor ? visitor.lastName : ''}">
            </div>
            <div class="form-group">
              <label for="rut">RUT:</label>
              <input type="text" id="rut" name="rut" value="${visitor ? visitor.rut : ''}">
            </div>
            <div class="form-group">
              <label for="departmentNumber">Número de Departamento:</label>
              <input type="text" id="departmentNumber" name="departmentNumber" value="${visitor ? visitor.departmentNumber.departmentNumber : ''}">
            </div>
            <div class="form-group">
              <label for="entryDate">Fecha de Entrada:</label>
              <input type="date" id="entryDate" name="entryDate" value="${visitor ? new Date(visitor.entryDate).toISOString().substr(0, 10) : ''}">
            </div>
            <div class="form-group">
              <label for="exitDate">Fecha de Salida:</label>
              <input type="date" id="exitDate" name="exitDate" value="${visitor ? new Date(visitor.exitDate).toISOString().substr(0, 10) : ''}">
            </div>
            <div class="button-group">
              <button type="button" onclick="window.close()">Cancelar</button>
              <button type="button" onclick="submitForm()">Guardar</button>
            </div>
          </form>
          <script>
            function submitForm() {
              const form = document.getElementById('visitorForm');
              const visitorData = {
                name: form.name.value,
                lastName: form.lastName.value,
                rut: form.rut.value,
                departmentNumber: { departmentNumber: form.departmentNumber.value },
                entryDate: form.entryDate.value,
                exitDate: form.exitDate.value
              };
              // Enviar los datos del formulario al componente Angular
              window.opener.updateVisitor(visitorData);
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  }

  updateVisitor(visitorData: VisitorDTO) {
    if (visitorData) {
      // Si se está actualizando un visitante existente
      const index = this.visitors.findIndex(visitor => visitor.rut === visitorData.rut);
      if (index !== -1) {
        this.visitors[index] = visitorData;
      } else {
        // Si se está creando un nuevo visitante
        this.visitors.push(visitorData);
      }
      this.fetchVisitors();
    }
  }

  registerExit(visitorId: string) {
    this.visitorService.registerExit(visitorId).subscribe(
      () => {
        this.fetchVisitors();
      },
      error => {
        console.error('Error registering exit for visitor', error);
      }
    );
  }

  deleteVisitor(visitorId: string) {
    this.visitorService.deleteVisitor(visitorId).subscribe(
      () => {
        this.fetchVisitors();
      },
      error => {
        console.error('Error deleting visitor', error);
      }
    );
  }
}
