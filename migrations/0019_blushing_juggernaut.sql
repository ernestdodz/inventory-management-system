ALTER TABLE "product" DROP CONSTRAINT "product_supplier_id_supplier_id_fk";
--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "supplier_id";