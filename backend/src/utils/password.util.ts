import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "../config/constants";

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_ROUNDS);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

/** Used to keep login timing similar when the email does not exist. */
export const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", BCRYPT_ROUNDS);
