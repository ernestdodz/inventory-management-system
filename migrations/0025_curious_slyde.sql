ALTER TABLE "sales_order_cart_item" RENAME COLUMN "product_id" TO "inventory_item_id";--> statement-breakpoint
ALTER TABLE "sales_order_cart_item" DROP CONSTRAINT "sales_order_cart_item_product_id_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_order_cart_item" ADD CONSTRAINT "sales_order_cart_item_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
