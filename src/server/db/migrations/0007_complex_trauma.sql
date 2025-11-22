ALTER TABLE "acme_account" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_passkey" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_session" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_two_factor" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_user" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
ALTER TABLE "acme_verification" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();--> statement-breakpoint
CREATE INDEX "passkey_credential_id_idx" ON "acme_passkey" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "twoFactor_user_id_idx" ON "acme_two_factor" USING btree ("user_id");