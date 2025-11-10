CREATE TYPE "public"."TaskPlanningStatusEnum" AS ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."TaskPriorityEnum" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."TaskWorkflowStatusEnum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE');--> statement-breakpoint
CREATE TABLE "acme_tasks_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar(256) NOT NULL,
	"workflow_status" "TaskWorkflowStatusEnum" DEFAULT 'OPEN' NOT NULL,
	"planning_status" "TaskPlanningStatusEnum" DEFAULT 'BACKLOG' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "acme_tasks_table" ADD CONSTRAINT "acme_tasks_table_user_id_acme_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."acme_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "title_idx" ON "acme_tasks_table" USING btree ("title");