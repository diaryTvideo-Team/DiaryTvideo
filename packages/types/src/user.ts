import { z } from "zod";
import { NameSchema, PasswordSchema } from "./common";
import { UserErrors } from "./userErrors";

export const UpdateNameRequestSchema = z.object({
  name: NameSchema,
});

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, UserErrors.CURRENT_PASSWORD_REQUIRED),
  newPassword: PasswordSchema,
});

export const DeleteAccountRequestSchema = z.object({
  password: z.string().min(1, UserErrors.PASSWORD_REQUIRED_FOR_DELETION),
});

export type UpdateNameRequest = z.infer<typeof UpdateNameRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;
