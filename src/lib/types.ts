interface IPurchaseOrderItemCookie {
	id: number;
	supplierId: number;
}

export type PurchaseOrderItemCookie = IPurchaseOrderItemCookie | undefined;

export interface IReceiveOrderItemCookie {
	poCode: string;
}

export type ReceiveOrderItemCookie = IReceiveOrderItemCookie | undefined;
