DROP INDEX "account_user_id_idx";--> statement-breakpoint
DROP INDEX "api_key_user_id_idx";--> statement-breakpoint
DROP INDEX "passkey_user_id_idx";--> statement-breakpoint
DROP INDEX "passkey_credential_id_idx";--> statement-breakpoint
DROP INDEX "session_user_id_idx";--> statement-breakpoint
DROP INDEX "session_token_idx";--> statement-breakpoint
DROP INDEX "two_factor_secret_idx";--> statement-breakpoint
DROP INDEX "twoFactor_user_id_idx";--> statement-breakpoint
DROP INDEX "user_email_idx";--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "acme_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "apikey_key_idx" ON "acme_apikey" USING btree ("key");--> statement-breakpoint
CREATE INDEX "apikey_userId_idx" ON "acme_apikey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_userId_idx" ON "acme_passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_credentialID_idx" ON "acme_passkey" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "acme_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "twoFactor_secret_idx" ON "acme_two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactor_userId_idx" ON "acme_two_factor" USING btree ("user_id");