CREATE TABLE "acme_two_factor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acme_user" ADD COLUMN "two_factor_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "acme_two_factor" ADD CONSTRAINT "acme_two_factor_user_id_acme_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."acme_user"("id") ON DELETE cascade ON UPDATE no action;