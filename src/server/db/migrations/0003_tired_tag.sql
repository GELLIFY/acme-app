CREATE TABLE "acme_passkey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp,
	"name" text,
	"public_key" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"aaguid" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acme_passkey" ADD CONSTRAINT "acme_passkey_user_id_acme_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."acme_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "passkey_user_id_idx" ON "acme_passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "acme_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "acme_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "acme_session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "two_factor_secret_idx" ON "acme_two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "acme_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "acme_verification" USING btree ("identifier");