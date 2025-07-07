import { test, expect } from "@playwright/test";

test("generate", async ({ page }) => {
  for (const [firstFret, fretNumber] of [
    [0, 3],
    [2, 5],
    [4, 7],
    [7, 9],
    [10, 13],
  ]) {
    await page.goto(
      `/?numberOfStrings=6&numberOfFrets=5&firstFret=${firstFret}&vertical=true`
    );

    for (let i = 0; i < 6; i++) {
      const note = page.locator(`#note-${i + 1}-${fretNumber}`);
      await note.click();
      await page.locator("#fretboard-container").screenshot({
        path: `${i + 1}-${fretNumber}.png`,
        omitBackground: true,
      });
      await note.click({ modifiers: ["Shift"] });
    }
  }
});
