import bcrypt from "bcryptjs";

const password = process.env.ADMIN_PASSWORD_TO_HASH;
if (!password || password.length < 10) {
  console.error("Set ADMIN_PASSWORD_TO_HASH to a password of at least 10 characters.");
  process.exitCode = 1;
} else {
  console.log(await bcrypt.hash(password, 12));
}
