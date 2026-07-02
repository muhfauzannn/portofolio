"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Edits a list of strings (e.g. About paragraphs, project impact/learnings).
 * Controlled: the parent owns the array and re-renders on change.
 */
export function StringList({
  items,
  onChange,
  multiline = false,
  addLabel = "Add item",
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  function setAt(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <Textarea
              value={item}
              placeholder={placeholder}
              onChange={(e) => setAt(i, e.target.value)}
              rows={2}
            />
          ) : (
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => setAt(i, e.target.value)}
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeAt(i)}
            aria-label="Remove"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, ""])}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
