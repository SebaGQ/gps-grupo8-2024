export interface BinnacleDeliveryDTO{
    janitorID : string;
    activityType: string;
    departNumber: number;
    recipientFirstName: string;
    recipientLastName: string;
    deliveryTime: string;
    withdrawnTime?: Date;
    withdrawnResidentId?: string;
    withdrawnPersonFirstName?: string;
    withdrawnPersonLastName?: string;
    expectedWithdrawnPersonFirstName?: string;
    expectedWithdrawnPersonLastName?: string;
    deliveryPersonName?: string;
    status?: string;
    createdAt?: string;
}