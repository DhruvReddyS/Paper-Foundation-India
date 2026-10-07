const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": bytes => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": bytes => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value),
  "image/webp": bytes => text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 12) === "WEBP",
  "image/gif": bytes => ["GIF87a", "GIF89a"].includes(text(bytes, 0, 6)),
  "application/pdf": bytes => text(bytes, 0, 5) === "%PDF-",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": bytes => bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04,
};

function text(bytes: Uint8Array, start: number, end: number) {
  return Buffer.from(bytes.slice(start, end)).toString("ascii");
}

export async function validateUploadFile(file: File, allowedTypes: readonly string[]) {
  if (!allowedTypes.includes(file.type)) return { safe: false, error: "This file type is not allowed." };
  const bytes = new Uint8Array(await file.slice(0, Math.min(file.size, 1_048_576)).arrayBuffer());
  const matches = signatures[file.type]?.(bytes) ?? false;
  if (!matches) return { safe: false, error: "The file contents do not match its declared type." };
  if (file.type === "application/pdf") {
    const sample = Buffer.from(bytes).toString("latin1").toLowerCase();
    if (["/javascript", "/launch", "/embeddedfile", "/openaction"].some(marker => sample.includes(marker))) return { safe: false, error: "PDFs containing scripts, launch actions or embedded files are not accepted." };
  }
  return { safe: true as const };
}
