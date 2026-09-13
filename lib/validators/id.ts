import mongoose from "mongoose";

export function validDocumentId(value: unknown): value is string {
  return typeof value === "string" && mongoose.isObjectIdOrHexString(value);
}
