// DashboardHeader.test.tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DashboardHeader } from "./DashboardHeader";

// Mock props for the DashboardHeader component
const mockProps = {
  onCreateClicked: vi.fn(),
  onLogOutClicked: vi.fn(),
};

describe("DashboardHeader Component", () => {
  it("should render the header with the logo and buttons", () => {
    render(<DashboardHeader {...mockProps} />);

    // Check for the logo
    const logo = screen.getByAltText("TaskBase Logo");
    expect(logo).toBeInTheDocument();

    // Check for the Add Task button
    const addButton = screen.getByRole("button", { name: /add task/i });
    expect(addButton).toBeInTheDocument();

    // Check for the Logout button
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("should call onCreateClicked when Add Task button is clicked", async () => {
    render(<DashboardHeader {...mockProps} />);

    const addButton = screen.getByRole("button", { name: /add task/i });
    await userEvent.click(addButton);

    expect(mockProps.onCreateClicked).toHaveBeenCalledTimes(1);
  });

  it("should call onLogOutClicked when Logout button is clicked", async () => {
    render(<DashboardHeader {...mockProps} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(mockProps.onLogOutClicked).toHaveBeenCalledTimes(1);
  });

  it("should have accessible labels for the buttons", () => {
    render(<DashboardHeader {...mockProps} />);

    const addButton = screen.getByRole("button", { name: /add task/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });

    // Check if the buttons have accessible labels
    expect(addButton).toHaveAccessibleName("Add Task");
    expect(logoutButton).toHaveAccessibleName("Logout");
  });
});
