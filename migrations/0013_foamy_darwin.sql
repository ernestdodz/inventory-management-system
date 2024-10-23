ALTER TABLE "purchase_order" RENAME COLUMN "session_id" TO "po_code";--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "po_code" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "purchase_order" ALTER COLUMN "po_code" DROP NOT NULL;