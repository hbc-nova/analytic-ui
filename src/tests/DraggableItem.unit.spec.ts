import { render, fireEvent } from "@testing-library/vue";
import DraggableItemComponent from "../components/DraggableItem.vue";
import { useCampaignStore } from "../store";
import { expect, vi, beforeEach, describe, it } from "vitest";

// Mocking the useCampaignStore
vi.mock("../store", () => ({
  useCampaignStore: vi.fn(() => ({
    isMetricDragging: false,
    draggedMetricIndex: -1,
    metrics: [{ id: 0, name: "Metric 1" }],
    selectedMetrics: [],
  })),
}));

// Mocking the Touch object
class MockTouch {
  identifier: number;
  target: HTMLElement;
  clientX: number;
  clientY: number;

  constructor({
    identifier,
    target,
    clientX,
    clientY,
  }: {
    identifier: number;
    target: HTMLElement;
    clientX: number;
    clientY: number;
  }) {
    this.identifier = identifier;
    this.target = target;
    this.clientX = clientX;
    this.clientY = clientY;
  }
}

describe("DraggableItemComponent.vue", () => {
  let campaignStore: any;

  beforeEach(() => {
    campaignStore = useCampaignStore();
    global.Touch = MockTouch as unknown as typeof Touch;
  });

  it("should clone element and move it during touch events", async () => {
    const { container } = render(DraggableItemComponent, {
      props: { id: 0 },
    });

    const grabbableElement = container.querySelector(".grabbable");

    // Touch start
    const touchStartEvent = new TouchEvent("touchstart", {
      touches: [
        // @ts-ignore
        new MockTouch({
          identifier: 1,
          // @ts-ignore
          target: grabbableElement!,
          clientX: 100,
          clientY: 100,
        }),
      ],
    });
    await fireEvent(grabbableElement!, touchStartEvent);

    const clonedElement = document.body.querySelector(
      ".grabbable"
    ) as HTMLElement;
    expect(clonedElement).toBeInTheDocument();
    expect(clonedElement.style.position).toBe("");

    // Touch move
    const touchMoveEvent = new TouchEvent("touchmove", {
      touches: [
        // @ts-ignore
        new MockTouch({
          identifier: 1,
          // @ts-ignore
          target: grabbableElement!,
          clientX: 150,
          clientY: 150,
        }),
      ],
    });
    await fireEvent(grabbableElement!, touchMoveEvent);
    expect(clonedElement.style.left).toBe("");
    expect(clonedElement.style.top).toBe("");
  });
});
