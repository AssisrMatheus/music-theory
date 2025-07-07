import { test, expect } from "@playwright/test";

const instruments = {
  guitar: {
    strings: 6,
    notes: [
      [0, 3],
      [2, 5],
      [4, 7],
      [7, 9],
      [10, 13],
    ],
  },
  bass: {
    strings: 4,
    notes: [
      [0, 3],
      [2, 5],
      [4, 7],
      [7, 9],
      [10, 13],
    ],
  },
  ukulele: {
    strings: 4,
    notes: [
      [0, 3],
      [2, 5],
      [4, 7],
      [7, 10],
      [10, 13],
    ],
  },
};

test("generate", async ({ page }) => {
  for (const instrument in instruments) {
    const instrumentObj = instruments[instrument as keyof typeof instruments];
    for (const [firstFret, fretNumber] of instrumentObj.notes) {
      await page.goto(
        `/?numberOfFrets=5&firstFret=${firstFret}&vertical=true&instrument=${instrument}`
      );

      for (let i = 0; i < instrumentObj.strings; i++) {
        const note = page.locator(`#note-${i + 1}-${fretNumber}`);
        await note.click();
        await page.locator("#fretboard-container").screenshot({
          path: `${instrument}-${fretNumber}-${i + 1}.png`,
          omitBackground: true,
        });
        await note.click({ modifiers: ["Shift"] });
      }
    }
  }
});
