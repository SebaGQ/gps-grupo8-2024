// src/app/dto/common-space.dto.ts
export interface CommonSpaceDto {
    _id: string;
    name: string;
    location: string;
    capacity: number;
    allowedDays: string[];
    openingHour: string;
    closingHour: string;
    type: string;
    image?: string; // Puedes cambiar el tipo a string si solo se usa una referencia al ID de la imagen.
  }
  