DO $$ BEGIN
 CREATE TYPE "public"."sales_order_status" AS ENUM('pending', 'approved', 'rejected', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_order_cart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"selling_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_order_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_order_cart_item" ADD CONSTRAINT "sales_order_cart_item_cart_id_sales_order_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."sales_order_cart"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_order_cart_item" ADD CONSTRAINT "sales_order_cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_order_cart" ADD CONSTRAINT "sales_order_cart_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
