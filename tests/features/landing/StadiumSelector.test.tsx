import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StadiumSelector } from "@/features/landing/StadiumSelector";
import { useAppStore } from "@/stores/app.store";

describe("StadiumSelector landing feature component", () => {
  it("renders list of stadiums and updates store on stadium change clicks", () => {
    useAppStore.setState({ selectedStadiumId: "metlife" });

    render(<StadiumSelector />);

    // Verification of list elements
    expect(screen.getByText("SoFi Stadium")).toBeDefined();
    expect(screen.getByText("Estadio Azteca")).toBeDefined();

    // Click Stadium to change
    const sofiCard = screen.getByText("SoFi Stadium");
    fireEvent.click(sofiCard);

    // Verify store update trigger
    expect(useAppStore.getState().selectedStadiumId).toBe("sofi");
  });
});
