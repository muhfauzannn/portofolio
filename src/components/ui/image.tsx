"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Status = "loading" | "loaded" | "error";

type BaseImgProps = Omit<
  React.ComponentProps<"img">,
  "width" | "height" | "loading" | "ref"
>;

export interface ImageProps extends BaseImgProps {
  /** Source URL of the image. */
  src: string;
  /** Required for accessibility (like next/image). */
  alt: string;
  /**
   * Stretch to cover the nearest positioned ancestor, like next/image `fill`.
   * The parent element MUST be `relative`/`absolute`/`fixed`.
   */
  fill?: boolean;
  /** Intrinsic width in px. Ignored when `fill`. */
  width?: number;
  /** Intrinsic height in px. Ignored when `fill`. */
  height?: number;
  /**
   * Load eagerly with high priority — use for above-the-fold/LCP images.
   * Everything else lazy-loads by default.
   */
  priority?: boolean;
  /** Show an animated skeleton until the image loads. Default: true. */
  showSkeleton?: boolean;
  /** Fade the image in once it decodes. Default: true. */
  fadeIn?: boolean;
  /** Class applied to the wrapper (intrinsic mode only). */
  wrapperClassName?: string;
  /** Rendered in place of the image when it fails to load. */
  fallback?: React.ReactNode;
}

/**
 * Reusable image primitive that mirrors the ergonomics of next/image
 * (`fill`, `sizes`, `priority`, native lazy-loading) while rendering a plain
 * `<img>` — no image-optimization pipeline required. Adds a loading skeleton,
 * a fade-in on decode, and an error fallback.
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(
    {
      src,
      alt,
      fill = false,
      width,
      height,
      priority = false,
      showSkeleton = true,
      fadeIn = true,
      wrapperClassName,
      fallback,
      className,
      style,
      sizes,
      onLoad,
      onError,
      ...props
    },
    forwardedRef,
  ) {
    const [status, setStatus] = React.useState<Status>("loading");
    const innerRef = React.useRef<HTMLImageElement>(null);

    // Merge the forwarded ref with our internal one.
    const setRefs = React.useCallback(
      (node: HTMLImageElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    // Reset on src change; if the image is already cached the browser won't
    // fire `onLoad`, so read `complete` synchronously after commit.
    React.useEffect(() => {
      const img = innerRef.current;
      if (img?.complete) {
        setStatus(img.naturalWidth > 0 ? "loaded" : "error");
      } else {
        setStatus("loading");
      }
    }, [src]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      onError?.(e);
    };

    const img = (
      <img
        ref={setRefs}
        src={src}
        alt={alt}
        sizes={sizes}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={style}
        className={cn(
          fill && "absolute inset-0 h-full w-full object-cover",
          fadeIn && "transition-opacity duration-500 ease-out",
          fadeIn && status !== "loaded" ? "opacity-0" : "opacity-100",
          className,
        )}
        {...props}
      />
    );

    const skeleton =
      showSkeleton && status === "loading" ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      ) : null;

    const errorState =
      status === "error" && fallback ? (
        <span className="absolute inset-0 grid place-items-center text-muted-foreground">
          {fallback}
        </span>
      ) : null;

    // Fill mode relies on the caller's positioned ancestor (like next/image).
    if (fill) {
      return (
        <>
          {skeleton}
          {img}
          {errorState}
        </>
      );
    }

    // Intrinsic mode: provide our own positioned wrapper for the overlays.
    return (
      <span
        className={cn(
          "relative inline-block overflow-hidden",
          wrapperClassName,
        )}
      >
        {skeleton}
        {img}
        {errorState}
      </span>
    );
  },
);
