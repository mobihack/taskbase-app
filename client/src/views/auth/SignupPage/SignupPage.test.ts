import { describe, expect, it } from "vitest";

import { userSignupSchema } from "./SignupPage";

describe("userSignupSchema", () => {
  it("should validate correct input", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      password_confirm: "password123",
    };

    // Use the `safeParse` method to check validation
    const result = userSignupSchema.safeParse(validData);

    // `success` should be true for valid input
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it("should invalidate incorrect email", () => {
    const invalidEmailData = {
      email: "invalid-email",
      password: "password123",
      password_confirm: "password123",
    };

    const result = userSignupSchema.safeParse(invalidEmailData);

    // `success` should be false for invalid input
    expect(result.success).toBe(false);
    if (!result.success) {
      // Check if the error is specifically for the email field
      expect(result.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["email"],
            message: "Invalid email",
          }),
        ])
      );
    }
  });

  it("should invalidate too short password", () => {
    const invalidPasswordData = {
      email: "test@example.com",
      password: "short",
      password_confirm: "short",
    };

    const result = userSignupSchema.safeParse(invalidPasswordData);

    // `success` should be false for invalid input
    expect(result.success).toBe(false);
    if (!result.success) {
      // Check if the error is specifically for the password field
      expect(result.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password"],
            message: "String must contain at least 8 character(s)",
          }),
          expect.objectContaining({
            path: ["password_confirm"],
            message: "String must contain at least 8 character(s)",
          }),
        ])
      );
    }
  });

  it("should invalidate mismatched passwords", () => {
    const mismatchedPasswordData = {
      email: "test@example.com",
      password: "password123",
      password_confirm: "differentpassword",
    };

    const result = userSignupSchema.safeParse(mismatchedPasswordData);

    // `success` should be false for invalid input
    expect(result.success).toBe(false);
    if (!result.success) {
      // Check if the error is specifically for the password_confirm field
      expect(result.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password_confirm"],
            message: "Passwords did not match",
          }),
        ])
      );
    }
  });

  it("should invalidate empty fields", () => {
    const emptyData = {
      email: "",
      password: "",
      password_confirm: "",
    };

    const result = userSignupSchema.safeParse(emptyData);

    // `success` should be false for invalid input
    expect(result.success).toBe(false);
    if (!result.success) {
      // Check if the errors are for the email, password, and password_confirm fields
      expect(result.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["email"],
            message: "Invalid email",
          }),
          expect.objectContaining({
            path: ["password"],
            message: "String must contain at least 8 character(s)",
          }),
          expect.objectContaining({
            path: ["password_confirm"],
            message: "String must contain at least 8 character(s)",
          }),
        ])
      );
    }
  });
});
