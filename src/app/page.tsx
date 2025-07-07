"use client";

import Fretboard from "@/components/Fretboard";
import { useFretboardContext } from "@/components/Fretboard/Provider";
import Note from "@/components/Note";
import { getNextNote } from "@/lib/music";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import * as tonal from "tonal";

const instruments = {
  guitar: {
    strings: 6,
    tuning: [
      tonal.Note.get("E"),
      tonal.Note.get("B"),
      tonal.Note.get("G"),
      tonal.Note.get("D"),
      tonal.Note.get("A"),
      tonal.Note.get("E"),
    ],
  },
  bass: {
    strings: 4,
    tuning: [
      tonal.Note.get("G"),
      tonal.Note.get("D"),
      tonal.Note.get("A"),
      tonal.Note.get("E"),
    ],
  },
  ukulele: {
    strings: 4,
    tuning: [
      tonal.Note.get("A"),
      tonal.Note.get("E"),
      tonal.Note.get("C"),
      tonal.Note.get("G"),
    ],
  },
};

export default function Home() {
  const searchParams = useSearchParams();
  const { instrument, numberOfFrets, firstFret, vertical } =
    useFretboardContext();

  const instrumentObj = instruments[instrument as keyof typeof instruments];

  const instrumentStrings = instrumentObj?.tuning.map((note) =>
    Array.from({
      length: numberOfFrets + firstFret,
    }).reduce<tonal.Core.Note[]>(
      (prev) => [
        ...prev,
        tonal.Note.get(getNextNote(prev[prev.length - 1].name)),
      ],
      [tonal.Note.get(note.name)]
    )
  );

  if (!instrumentStrings) {
    return null;
  }

  return (
    <div className="font-sans">
      <nav className="bg-low-black text-white">
        <div className="container mx-auto py-8 flex items-center justify-between">
          <h1 className="text-5xl font-bold">Chord Visualizer</h1>
          <a
            href="https://github.com/AssisrMatheus/music-theory"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="w-6 h-6" />
          </a>
        </div>
      </nav>
      <main className="container mx-auto space-y-8 mt-8">
        <form
          className="flex space-y-4 space-x-4"
          onChange={(e) => {
            const urlSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            const formData = new FormData(e.currentTarget);
            const numberOfFrets = formData.get("numberOfFrets");
            const firstFret = formData.get("firstFret");
            const vertical = formData.get("vertical") === "on";
            urlSearchParams.set(
              "numberOfFrets",
              numberOfFrets ? String(numberOfFrets) : ""
            );
            urlSearchParams.set(
              "firstFret",
              firstFret ? String(firstFret) : ""
            );
            urlSearchParams.set("vertical", vertical ? "true" : "false");

            window.history.pushState(
              null,
              "",
              `?${urlSearchParams.toString()}`
            );
          }}
        >
          <label className="block">
            <span className="text-lg font-semibold">Number of frets:</span>
            <input
              type="number"
              defaultValue={numberOfFrets ? numberOfFrets : 13}
              min={1}
              max={24}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
              name="numberOfFrets"
            />
          </label>

          <label className="block">
            <span className="text-lg font-semibold">First fret:</span>
            <input
              type="number"
              defaultValue={firstFret ? firstFret : 0}
              min={0}
              max={23}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
              name="firstFret"
            />
          </label>

          <label className="block">
            <span className="text-lg font-semibold">Vertical:</span>
            <input
              type="checkbox"
              className="ml-2 border border-gray-300 rounded px-2 py-1"
              name="vertical"
              defaultChecked={vertical}
            />
          </label>
        </form>
        <div id="fretboard-container" className="p-6 pb-8 pt-2 w-fit mx-auto">
          <Fretboard
            numberOfStrings={instrumentObj.strings}
            renderLeftOfNut={(stringIndex) => (
              <div className="text-sm text-stone-500">
                {instrumentStrings[stringIndex][0].name}
              </div>
            )}
            renderFret={(stringIndex, fretIndex) => {
              const note =
                instrumentStrings[instrumentObj.strings - stringIndex - 1][
                  fretIndex + 1
                ];

              return (
                <Note
                  stringIndex={stringIndex}
                  fretIndex={fretIndex}
                  note={note}
                />
              );
            }}
            // renderRightOfBoard={(stringIndex) => <div>{stringIndex}</div>}
          />
        </div>
      </main>
    </div>
  );
}
