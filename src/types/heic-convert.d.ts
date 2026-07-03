declare module "heic-convert" {
  interface ConvertOptions {
    buffer: Buffer | Uint8Array;
    format: "JPEG" | "PNG";
    /** 0..1 (JPEG only). */
    quality?: number;
  }
  function convert(options: ConvertOptions): Promise<Buffer>;
  export default convert;
}
