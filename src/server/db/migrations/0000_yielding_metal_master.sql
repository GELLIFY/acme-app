CREATE TABLE "acme_posts" (
	"id" varchar(128) NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
