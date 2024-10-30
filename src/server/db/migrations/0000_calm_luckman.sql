CREATE TABLE IF NOT EXISTS "acme_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" varchar(256) NOT NULL
);
