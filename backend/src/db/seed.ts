import { env } from "../config/env";
import { userRepository } from "../repositories";
import { hashPassword } from "../utils/password.util";
import { pool } from "./index";

async function main() {
  if (!env.SUPER_ADMIN_EMAIL || !env.SUPER_ADMIN_PASSWORD) {
    throw new Error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env");
  }
  if (await userRepository.findByEmail(env.SUPER_ADMIN_EMAIL)) {
    console.log("Super admin already exists:", env.SUPER_ADMIN_EMAIL);
    return;
  }
  await userRepository.create({
    email: env.SUPER_ADMIN_EMAIL,
    fullName: env.SUPER_ADMIN_NAME,
    passwordHash: await hashPassword(env.SUPER_ADMIN_PASSWORD),
    role: "super_admin",
  });
  console.log("Super admin created:", env.SUPER_ADMIN_EMAIL, "(MFA setup is required on first login)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
