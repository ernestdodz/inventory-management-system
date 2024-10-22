CREATE TABLE IF NOT EXISTS "purchase_order_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_order_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_order" DROP CONSTRAINT "purchase_order_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase_order" ADD COLUMN "order_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ADD COLUMN "status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ADD COLUMN "session_id" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_item" ADD CONSTRAINT "purchase_order_item_purchase_order_id_purchase_order_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_item" ADD CONSTRAINT "purchase_order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "purchase_order" DROP COLUMN IF EXISTS "product_id";--> statement-breakpoint
ALTER TABLE "purchase_order" DROP COLUMN IF EXISTS "quantity";