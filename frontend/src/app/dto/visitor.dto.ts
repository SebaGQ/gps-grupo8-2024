import { UserDTO } from "./user.dto";

// visitor.dto.ts
export interface VisitorDTO {
    _id?: string;
    name: string;
    lastName: string;
    rut: string;
    departmentNumber: DepartmentDTO;
    entryDate: Date;
    exitDate: Date;
}

export interface DepartmentDTO {
    _id: string;
    departmentNumber: number;
    residentId: UserDTO;
}
