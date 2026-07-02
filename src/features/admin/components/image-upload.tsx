"use client";

import * as React from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/features/admin/lib/actions";

/**
 * Uploads an image to R2 (via the `uploadImage` server action) and reports the
 * resulting public URL back through `onChange`. Shows a preview of the current
 * value. `prefix` groups objects in the bucket (e.g. "hero", "skills").
 */
export function ImageUpload({
  value,
  onChange,
  prefix,
  label = "Image",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  prefix: string;
  label?: string;
  className?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);
      const url = await uploadImage(formData);
      onChange(url);
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted">
        {value ? (
          // Uploaded URLs may be on arbitrary hosts before next.config catches
          // up, so keep this unoptimized to avoid a broken preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="size-full object-contain"
          />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {value ? "Replace" : "Upload"} {label.toLowerCase()}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              <X className="size-4" />
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
