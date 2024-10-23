CREATE TABLE IF NOT EXISTS "purchase_order_cart_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchase_order_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_order_item" ALTER COLUMN "purchase_order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "order_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "order_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_cart_item" ADD CONSTRAINT "purchase_order_cart_item_cart_id_purchase_order_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."purchase_order_cart"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_cart_item" ADD CONSTRAINT "purchase_order_cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_cart" ADD CONSTRAINT "purchase_order_cart_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "purchase_order_item" DROP COLUMN IF EXISTS "is_cart";