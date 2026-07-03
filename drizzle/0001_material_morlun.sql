CREATE TABLE "canvas_photo" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"x" integer DEFAULT 0 NOT NULL,
	"y" integer DEFAULT 0 NOT NULL,
	"width" integer DEFAULT 240 NOT NULL,
	"rotation" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_setting" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_url" text DEFAULT '' NOT NULL
);
