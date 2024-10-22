DO $$ BEGIN
 CREATE TYPE "public"."purchase_order_status" AS ENUM('draft', 'pending', 'approved', 'rejected', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "purchase_order_item" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "order_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "order_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "status" SET DATA TYPE purchase_order_status;--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "session_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order_item" ADD COLUMN "is_cart" boolean DEFAULT true NOT NULL;