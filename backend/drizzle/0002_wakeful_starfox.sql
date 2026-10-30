ALTER TABLE "admin_assignments" DROP CONSTRAINT "admin_assignments_assigned_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "duty_schedules" DROP CONSTRAINT "duty_schedules_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_marked_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "leave_records" DROP CONSTRAINT "leave_records_recorded_by_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_assignments" ADD CONSTRAINT "admin_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "duty_schedules" ADD CONSTRAINT "duty_schedules_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_marked_by_users_id_fk" FOREIGN KEY ("marked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leave_records" ADD CONSTRAINT "leave_records_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
