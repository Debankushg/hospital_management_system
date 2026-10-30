CREATE TYPE "public"."leave_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "leave_records" ADD COLUMN "status" "leave_status" DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "leave_records" ADD COLUMN "reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "leave_records" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leave_records" ADD COLUMN "review_note" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leave_records" ADD CONSTRAINT "leave_records_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
