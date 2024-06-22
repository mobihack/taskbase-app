import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
// Mock the dayjs module to control the time
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { TaskStatus } from "@/constants";

import { TaskCard } from "./TaskCard";

vi.mock("dayjs", async () => {
  const actual = await vi.importActual("dayjs");
  return {
    ...actual,
    extend: vi.fn(),
    diff: vi.fn(() => -1),
    from: vi.fn(() => "5 days"),
  };
});

const mockProps = {
  id: "1",
  title: "Test Task",
  description: "This is a test task description.",
  status: TaskStatus.TODO,
  dueAt: dayjs().subtract(5, "days").toString(), // Simulate a due date in the past
  onClick: vi.fn(),
  onModify: vi.fn(),
  onDelete: vi.fn(),
};

describe("TaskCard Component", () => {
  it("should render the task card with given props", () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test task description.")
    ).toBeInTheDocument();
    expect(screen.getByText("Expired 5 days ago")).toBeInTheDocument(); // Due date display
  });

  it("should call onClick when the task card is clicked", async () => {
    render(<TaskCard {...mockProps} />);

    await userEvent.click(screen.getByText("Test Task"));
    expect(mockProps.onClick).toHaveBeenCalledWith("1");
  });

  it("should call onModify when the edit action is clicked", async () => {
    render(<TaskCard {...mockProps} />);

    const triggerButton = screen.getByRole("button", { name: /more actions/i });

    await userEvent.click(triggerButton);

    // Get menu and menu items
    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    // Assertions
    expect(triggerButton).toHaveAttribute("aria-expanded", "true");
    expect(menu).toBeInTheDocument();
    expect(menuItems.length).toBe(2);

    const editButton = screen.getByText("Delete");
    expect(editButton).toBeInTheDocument();

    await userEvent.click(screen.getByRole("menuitem", { name: /edit task/i }));

    expect(mockProps.onModify).toHaveBeenCalledWith("1");
  });

  it("should call onDelete when the delete action is clicked", async () => {
    render(<TaskCard {...mockProps} />);

    const triggerButton = screen.getByRole("button", { name: /more actions/i });

    await userEvent.click(triggerButton);

    // Get menu and menu items
    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    // Assertions
    expect(triggerButton).toHaveAttribute("aria-expanded", "true");
    expect(menu).toBeInTheDocument();
    expect(menuItems.length).toBe(2);

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", { name: /delete task/i })
    );

    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("should not render due date if dueAt is undefined", () => {
    const propsWithoutDueDate = { ...mockProps, dueAt: undefined };
    render(<TaskCard {...propsWithoutDueDate} />);

    // There should be no time element rendered
    expect(screen.queryByRole("time")).not.toBeInTheDocument();
  });

  it("should allow keyboard navigation for the dropdown menu", async () => {
    render(<TaskCard {...mockProps} />);

    const triggerButton = screen.getByRole("button", { name: /more actions/i });

    // Open the dropdown menu using keyboard
    triggerButton.focus();
    await userEvent.keyboard("{Enter}");

    // Ensure the dropdown menu is now visible
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    // Get all menu items
    const menuItems = screen.getAllByRole("menuitem");

    // Initially first menu item should have focus
    expect(menuItems[0]).toHaveFocus();

    // Navigate through menu items using arrow keys
    await userEvent.keyboard("{ArrowDown}");
    expect(menuItems[1]).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });
});
