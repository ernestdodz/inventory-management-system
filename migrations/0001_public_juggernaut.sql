ALTER TABLE "inventory_items" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "updated_at" timestamp DEFAULT now();