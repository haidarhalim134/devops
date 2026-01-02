ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;