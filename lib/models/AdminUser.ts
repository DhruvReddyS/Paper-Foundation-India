import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["owner", "editor", "analyst"], default: "editor", index: true },
  active: { type: Boolean, default: true, index: true },
  failedAttempts: { type: Number, default: 0, select: false },
  lockedUntil: { type: Date, default: null, select: false },
  lastLoginAt: { type: Date, default: null },
  createdBy: { type: String, default: "bootstrap" },
}, { timestamps: true, collection: "admin_users" });

AdminUserSchema.set("toJSON", {
  transform(_document, value) {
    const safe = value as Record<string, unknown>;
    delete safe.passwordHash;
    delete safe.failedAttempts;
    delete safe.lockedUntil;
    return value;
  },
});

export const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
