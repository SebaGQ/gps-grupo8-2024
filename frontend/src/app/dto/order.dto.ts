export interface OrderDTO {
    _id? : string;
    departmentNumber?: number;
    janitorId?: string;
    recipientFirstName?: string;
    recipientLastName?: string;
    deliveryTime?: Date;
    withdrawnTime?: Date;
    withdrawnResidentId?: string;
    withdrawnPersonFirstName?: string;
    withdrawnPersonLastName?: string;
    expectedWithdrawnPersonFirstName?: string;
    expectedWithdrawnPersonLastName?: string;
    deliveryPersonName?: string;
    status?: string;
    timestamp?: Date;
  }
  