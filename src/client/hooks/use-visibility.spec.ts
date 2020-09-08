import { renderHook } from "@testing-library/react-hooks";

import { render, fireEvent } from "@/client/utils/setup-test";

import { useVisibility, useMultipleVisibility } from "./use-visibility";

describe("useVisibility", async () => {
  it("should render icon button and change input type on click", async () => {
    const { result } = renderHook(() => useVisibility());

    let props = result.current[0]();

    expect(props).toHaveProperty("type");
    expect(props.type).toBe("password");

    if (props.append) {
      const { container } = render(props.append);

      const button = container.querySelector("button") as HTMLButtonElement;

      fireEvent.click(button);

      props = result.current[0]();

      expect(props.type).toBe("text");
    }
  });
});

describe("useMultipleVisibility", () => {
  it("should render multiple icon buttons and change input type on click", async () => {
    const { result } = renderHook(() => useMultipleVisibility(["a", "b"]));

    let aProps = result.current[0]("a");
    let bProps = result.current[0]("b");

    expect(aProps).toHaveProperty("type");
    expect(aProps.type).toBe("password");

    expect(bProps).toHaveProperty("type");
    expect(bProps.type).toBe("password");

    if (aProps.append) {
      const { container } = render(aProps.append);

      const button = container.querySelector("button") as HTMLButtonElement;

      fireEvent.click(button);

      aProps = result.current[0]("a");

      expect(aProps.type).toBe("text");
    }

    if (bProps.append) {
      const { container } = render(bProps.append);

      const button = container.querySelector("button") as HTMLButtonElement;

      fireEvent.click(button);

      bProps = result.current[0]("b");

      expect(bProps.type).toBe("text");
    }
  });
});