import { useContext } from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UIContext, UIProvider } from "./UIContext";

function renderUI() {
  return renderHook(() => useContext(UIContext), { wrapper: UIProvider });
}

describe("UIContext — toasts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a toast with the given message and action", () => {
    const { result } = renderUI();
    const onAction = vi.fn();

    act(() => {
      result.current.addToast({ message: "Note archived", actionLabel: "Undo", onAction });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      message: "Note archived",
      actionLabel: "Undo",
      onAction,
    });
  });

  it("auto-dismisses a toast after the default duration", () => {
    const { result } = renderUI();

    act(() => {
      result.current.addToast({ message: "Note archived" });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("respects a custom duration", () => {
    const { result } = renderUI();

    act(() => {
      result.current.addToast({ message: "Note archived", duration: 1000 });
    });

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("removeToast dismisses a toast immediately and cancels its auto-dismiss timer", () => {
    const { result } = renderUI();

    let id;
    act(() => {
      id = result.current.addToast({ message: "Note archived" });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(id);
    });
    expect(result.current.toasts).toHaveLength(0);

    // The cancelled timer should not throw or resurrect the toast.
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("supports multiple toasts stacking independently", () => {
    const { result } = renderUI();

    act(() => {
      result.current.addToast({ message: "First" });
      result.current.addToast({ message: "Second" });
    });

    expect(result.current.toasts.map((t) => t.message)).toEqual(["First", "Second"]);
  });
});
