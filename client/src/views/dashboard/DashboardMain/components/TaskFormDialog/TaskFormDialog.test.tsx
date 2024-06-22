// TaskFormDialog.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskFormDialog, taskFormSchema } from "./TaskFormDialog";

// Mock API functions
vi.mock("@/api/task", () => ({
  patchTaskAPI: vi.fn(() => Promise.resolve()),
  postTaskAPI: vi.fn(() => Promise.resolve()),
}));

const mockProps = {
  onClose: vi.fn(),
  onUpdate: vi.fn(),
  open: "create" as const,
  initialValue: {
    id: "1",
    title: "Test Task",
    description: "This is a test description.",
    dueAt: "",
  },
  onSubmit: vi.fn(),
};

describe("TaskFormDialog Component", () => {
  it("should render create form with no initial values", () => {
    render(<TaskFormDialog {...mockProps} />);

    // Check if the dialog content is rendered
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Check for the form fields
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  it("should render modify form with initial values", () => {
    render(<TaskFormDialog {...mockProps} open="modify" />);

    // Check if the dialog content is rendered
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Check for the form fields
    expect(screen.getByLabelText("Title")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "This is a test description."
    );
  });

  it("should display validation messages for invalid inputs", async () => {
    render(<TaskFormDialog {...mockProps} />);

    // Clear the Title field to trigger validation
    await userEvent.clear(screen.getByLabelText("Title"));
    await userEvent.click(screen.getByRole("button", { name: /add task/i }));

    // Check for validation message
    await waitFor(() =>
      expect(
        screen.getByText("Minimum 3 characters required")
      ).toBeInTheDocument()
    );

    // Clear the Description field to trigger validation
    await userEvent.clear(screen.getByLabelText("Description"));
    await userEvent.click(screen.getByRole("button", { name: /add task/i }));

    // Check for validation message
    await waitFor(() =>
      expect(
        screen.getByText("Minimum 5 characters required")
      ).toBeInTheDocument()
    );
  });

  it("should call onClose when the Cancel button is clicked", async () => {
    render(<TaskFormDialog {...mockProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should call postTaskAPI in create mode", async () => {
    const { postTaskAPI } = await import("@/api/task");

    render(<TaskFormDialog {...mockProps} open="create" />);

    await userEvent.type(screen.getByLabelText("Title"), "Test Title");
    await userEvent.type(
      screen.getByLabelText("Description"),
      "Test Description"
    );

    const addButton = screen.getByRole("button", { name: /add task/i });
    await userEvent.click(addButton);

    // Ensure the postTaskAPI is called with the correct data
    await waitFor(() => expect(postTaskAPI).toHaveBeenCalled());
    expect(postTaskAPI).toHaveBeenCalledWith({
      title: "Test Title",
      description: "Test Description",
      dueAt: "",
    });
  });

  it("should call patchTaskAPI in modify mode", async () => {
    const { patchTaskAPI } = await import("@/api/task");

    render(<TaskFormDialog {...mockProps} open="modify" />);

    const updateButton = screen.getByRole("button", { name: /update task/i });
    await userEvent.click(updateButton);

    // Ensure the patchTaskAPI is called with the correct data
    await waitFor(() =>
      expect(patchTaskAPI).toHaveBeenCalledWith("1", {
        title: "Test Task",
        description: "This is a test description.",
        dueAt: "",
      })
    );
  });

  it("should reset the form when closed", async () => {
    render(<TaskFormDialog {...mockProps} />);

    // Simulate modifying the form
    await userEvent.type(screen.getByLabelText("Title"), " Modified");
    await userEvent.type(screen.getByLabelText("Description"), " Modified");

    // Close the dialog
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Re-open the dialog
    render(<TaskFormDialog {...mockProps} open="create" />);

    // Check if the form fields are reset
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  // validation tests
  describe("taskFormSchema", () => {
    it("should validate correct input", () => {
      const validData = {
        title: "Test Task",
        description: "This is a test task description.",
        dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow's date
      };

      const result = taskFormSchema.safeParse(validData);

      // `success` should be true for valid input
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should invalidate too short title", () => {
      const invalidTitleData = {
        title: "Te",
        description: "This is a valid description.",
        dueAt: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = taskFormSchema.safeParse(invalidTitleData);

      // `success` should be false for invalid input
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["title"],
              message: "Minimum 3 characters required",
            }),
          ])
        );
      }
    });

    it("should invalidate too short description", () => {
      const invalidDescriptionData = {
        title: "Valid Title",
        description: "Desc",
        dueAt: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = taskFormSchema.safeParse(invalidDescriptionData);

      // `success` should be false for invalid input
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["description"],
              message: "Minimum 5 characters required",
            }),
          ])
        );
      }
    });

    it("should invalidate past due date", () => {
      const pastDueDateData = {
        title: "Valid Title",
        description: "This is a valid description.",
        dueAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday's date
      };

      const result = taskFormSchema.safeParse(pastDueDateData);

      // `success` should be false for invalid input
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["dueAt"],
              message: "The date must be a future date",
            }),
          ])
        );
      }
    });

    it("should validate null or empty due date", () => {
      const nullDueDateData = {
        title: "Valid Title",
        description: "This is a valid description.",
        dueAt: null,
      };

      const emptyDueDateData = {
        title: "Valid Title",
        description: "This is a valid description.",
        dueAt: "",
      };

      const resultNull = taskFormSchema.safeParse(nullDueDateData);
      const resultEmpty = taskFormSchema.safeParse(emptyDueDateData);

      // `success` should be true for valid input
      expect(resultNull.success).toBe(true);
      if (resultNull.success) {
        expect(resultNull.data).toEqual(nullDueDateData);
      }

      expect(resultEmpty.success).toBe(true);
      if (resultEmpty.success) {
        expect(resultEmpty.data).toEqual(emptyDueDateData);
      }
    });
  });
});
