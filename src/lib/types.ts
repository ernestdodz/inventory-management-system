interface IPurchaseOrderItemCookie {
	id: number;
	supplierId: number;
}

export type PurchaseOrderItemCookie = IPurchaseOrderItemCookie | undefined;

interface ISalesCartOrderItemCookie {
	id: number;
	customerId: number;
}

export type SalesCartOrderItemCookie = ISalesCartOrderItemCookie | undefined;
// export interface IReceiveOrderItemCookie {
// 	poCode: string;
// }

// export type ReceiveOrderItemCookie = IReceiveOrderItemCookie | undefined;
