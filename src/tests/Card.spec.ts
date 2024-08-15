import { render } from "@testing-library/vue";
import CardComponent from "../components/Card.vue";
import { expect, describe, it } from "vitest";

describe("CardComponent.vue", () => {
  it("renders the header, content, and footer slots correctly", () => {
    const { getByText, container } = render(CardComponent, {
      slots: {
        header: "<div>Header Content</div>",
        default: "<div>Main Content</div>",
        footer: "<div>Footer Content</div>",
      },
    });

    expect(getByText("Header Content")).toBeInTheDocument();
    expect(getByText("Main Content")).toBeInTheDocument();
    expect(getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders without header and footer slots", () => {
    const { getByText, container } = render(CardComponent, {
      slots: {
        default: "<div>Main Content</div>",
      },
    });

    expect(getByText("Main Content")).toBeInTheDocument();

    // Ensure there are no header or footer elements with content
    const headerElement = container.querySelector(".header");
    const footerElement = container.querySelector(".footer");

    expect(headerElement?.textContent?.trim()).toBe("");
    expect(footerElement?.textContent?.trim()).toBe("");
  });
});
