CREATE TABLE IF NOT EXISTS "supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "sku" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "supplier_id" integer;