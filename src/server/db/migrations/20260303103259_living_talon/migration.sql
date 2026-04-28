ALTER TABLE "acme_apikey" DROP CONSTRAINT "acme_apikey_user_id_acme_user_id_fk";
--> statement-breakpoint
DROP INDEX "apikey_userId_idx";--> statement-breakpoint
ALTER TABLE "acme_apikey" ADD COLUMN "config_id" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "acme_apikey" ADD COLUMN "reference_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "apikey_configId_idx" ON "acme_apikey" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "apikey_referenceId_idx" ON "acme_apikey" USING btree ("reference_id");--> statement-breakpoint
ALTER TABLE "acme_apikey" DROP COLUMN "user_id";