import { UserDTO } from "./user.dto";

export interface DepartmentDTO {
    _id: string;
    departmentNumber: number;
    residentId: UserDTO;
}