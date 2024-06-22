// TaskFormDialog.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskFormDialog } from "./TaskFormDialog";

// Mock API functions
vi.mock("@/api/task/patchTaskAPI", () => ({
  patchTaskAPI: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/api/task/postTaskAPI", () => ({
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
    const { postTaskAPI } = await import("@/api/task/postTaskAPI");

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
    const { patchTaskAPI } = await import("@/api/task/patchTaskAPI");

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
});
