ALTER TABLE "purchase_order_cart_item" DROP CONSTRAINT "purchase_order_cart_item_product_id_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_cart_item" ADD CONSTRAINT "purchase_order_cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
