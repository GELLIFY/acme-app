DROP INDEX "text_idx";--> statement-breakpoint
ALTER TABLE "acme_todo_table" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_todo_table" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "acme_todo_table" USING btree ("user_id");