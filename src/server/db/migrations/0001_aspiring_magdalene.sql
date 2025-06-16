CREATE TABLE "acme_todo_table" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL,
	"completed" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "acme_posts" CASCADE;--> statement-breakpoint
CREATE INDEX "text_idx" ON "acme_todo_table" USING btree ("text");