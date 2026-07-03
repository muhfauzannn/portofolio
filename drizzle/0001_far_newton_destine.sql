CREATE TABLE "canvas_doodle" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"color" text DEFAULT '#1a1a1a' NOT NULL,
	"stroke_width" integer DEFAULT 4 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
