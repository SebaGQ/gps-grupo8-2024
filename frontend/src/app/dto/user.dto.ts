export interface UserDTO {
    _id : string;
    firstName: string;
    lastName: string;
    departmentNumber?: number;
    rut: string;
    password: string;
    email: string;
    roles?: string[];
  }
  