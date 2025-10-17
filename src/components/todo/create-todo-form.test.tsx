import { describe, expect, test } from "bun:test";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@/tests/test-utils";
import { CreateTodoForm } from "./create-todo-form";

describe("CreateTodoForm component", () => {
  test("should prompt for invalid todo text", async () => {
    // 1. Arrange
    await act(async () => {
      render(<CreateTodoForm />);
    });

    // 2. Act
    await userEvent.click(screen.getByRole("button"));

    // 3. Assert
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Too small: expected string to have >=3 characters",
    );
  });
});
