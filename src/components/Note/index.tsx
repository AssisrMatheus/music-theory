"use client";

import { cn } from "@/lib/css";
import { useState } from "react";
import * as tonal from "tonal";

const states = ["name", "barre", "interval", "hidden"] as const;

type NoteProps = {
  note: tonal.Core.Note;
  state?: (typeof states)[number];
  stringIndex?: number;
  fretIndex?: number;
};

const Note: React.FC<NoteProps> = ({
  note,
  state: propsState = "hidden",
  stringIndex,
  fretIndex,
}) => {
  const [state, setState] = useState(propsState);

  const toggleState = () => {
    const nextStateIndex = (states.indexOf(state) + 1) % states.length;
    setState(states[nextStateIndex]);
  };

  const hide = () => {
    setState("hidden");
  };

  const content = () => {
    switch (state) {
      case "name":
        return note.name;
      default:
        return "";
    }
  };

  return (
    <button
      id={`note-${(stringIndex || 0) + 1}-${(fretIndex || 0) + 1}`}
      className={cn("cursor-pointer rounded-full h-6 w-6 ", {
        "bg-white flex items-center font-semibold justify-center border-2 border-[var(--fretboard-string-color)] text-xs":
          state !== "hidden",
      })}
      onClick={(e) => {
        e.stopPropagation();
        if (e.shiftKey) {
          hide();
        } else {
          toggleState();
        }
      }}
      onMouseEnter={(e) => {
        if (e.buttons === 1) {
          if (e.shiftKey) {
            hide();
          } else {
            toggleState();
          }
        }
      }}
    >
      {content()}
    </button>
  );
};

export default Note;
