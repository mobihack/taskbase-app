import { describe, expect, it } from "vitest";

import { userLoginSchema } from "./LoginPage";

describe("userLoginSchema", () => {
  it("should validate correct input", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };

    // Use the `safeParse` method to check validation
    const result = userLoginSchema.safeParse(validData);

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
    };

    const result = userLoginSchema.safeParse(invalidEmailData);

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
    };

    const result = userLoginSchema.safeParse(invalidPasswordData);

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
        ])
      );
    }
  });

  it("should invalidate empty fields", () => {
    const emptyData = {
      email: "",
      password: "",
    };

    const result = userLoginSchema.safeParse(emptyData);

    // `success` should be false for invalid input
    expect(result.success).toBe(false);
    if (!result.success) {
      // Check if the errors are for both the email and password fields
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
        ])
      );
    }
  });
});
