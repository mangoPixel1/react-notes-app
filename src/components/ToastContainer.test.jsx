import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ToastContainer from "./ToastContainer";
import { UIContext } from "../contexts/UIContext";

function renderToasts(toasts, removeToast = vi.fn()) {
  return {
    removeToast,
    ...render(
      <UIContext.Provider value={{ toasts, removeToast }}>
        <ToastContainer />
      </UIContext.Provider>
    ),
  };
}

describe("ToastContainer", () => {
  it("renders nothing when there are no toasts", () => {
    const { container } = renderToasts([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a toast message", () => {
    renderToasts([{ id: "1", message: "Note archived" }]);
    expect(screen.getByText("Note archived")).toBeInTheDocument();
  });

  it("renders an Undo button only when actionLabel is provided", () => {
    renderToasts([{ id: "1", message: "Note deleted forever" }]);
    expect(screen.queryByRole("button", { name: /undo/i })).not.toBeInTheDocument();
  });

  it("clicking the action button calls onAction and dismisses the toast", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const removeToast = vi.fn();
    renderToasts([{ id: "1", message: "Note archived", actionLabel: "Undo", onAction }], removeToast);

    await user.click(screen.getByRole("button", { name: /undo/i }));

    expect(onAction).toHaveBeenCalled();
    expect(removeToast).toHaveBeenCalledWith("1");
  });

  it("clicking dismiss removes the toast without calling onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const removeToast = vi.fn();
    renderToasts([{ id: "1", message: "Note archived", actionLabel: "Undo", onAction }], removeToast);

    await user.click(screen.getByTitle("Dismiss"));

    expect(onAction).not.toHaveBeenCalled();
    expect(removeToast).toHaveBeenCalledWith("1");
  });

  it("renders multiple toasts", () => {
    renderToasts([
      { id: "1", message: "First" },
      { id: "2", message: "Second" },
    ]);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
