"use client";

import { cn } from "@/lib/css";
import styles from "./fretboard.module.css";
import React from "react";
import { useFretboardContext } from "./Provider";

export type FretboardProps = {
  renderLeftOfNut?: (stringIndex: number) => React.ReactNode;
  renderRightOfBoard?: (stringIndex: number) => React.ReactNode;
  renderFret?: (stringIndex: number, fretIndex: number) => React.ReactNode;
};

const Fretboard: React.FC<FretboardProps> = ({
  renderLeftOfNut,
  renderFret,
  renderRightOfBoard,
}) => {
  const { numberOfStrings, numberOfFrets, firstFret, vertical } =
    useFretboardContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      id="fretboard"
      style={
        {
          "--fretboard-fret-color": "#BDAC9D", // #D5C8B1
          "--fretboard-string-color": "#585553", // #575452
          "--fretboard-string-thickness": "0.06rem",
          "--fret-size": "45px",
          "--fret-height": "2rem",
          "--number-of-strings": numberOfStrings,
          "--number-of-frets": numberOfFrets,
        } as React.CSSProperties
      }
    >
      {!vertical ? (
        <div className="flex w-full h-full select-none">
          {/* Left of nut */}
          <div className={styles.fretboardLeftOfNutHorizontal}>
            {Array.from({ length: numberOfStrings }).map((_, index) => (
              <div
                key={index}
                className="pr-1 flex items-center justify-center"
              >
                {renderLeftOfNut ? renderLeftOfNut(index) : index + 1}
              </div>
            ))}
          </div>

          {/* Nut */}
          {firstFret === 0 && (
            <div className="w-3 border-2 border-[var(--fretboard-string-color)] relative transform translate-x-0.5 bg-white">
              <div className="absolute inset-0 left-1/2 bg-stone-300"></div>
            </div>
          )}

          <div ref={contentRef} className="flex-0 relative">
            {/* Curved mask for the last fret - applies to entire column */}
            <div
              className={cn(
                "absolute top-0 bottom-0 left-full z-[0] bg-[var(--fretboard-fret-color)] w-4 transform translate-x-[-1.15rem] flex items-center justify-center",
                styles.fretboardLeftOfNutHorizontal
              )}
              style={
                {
                  WebkitMaskImage: `url(data:image/svg+xml,%3Csvg%20width%3D%2296%22%20height%3D%22409%22%20viewBox%3D%220%200%2096%20409%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M64.6485%200H0.923828L2.71889%20409H64.6485C83.7958%20375%20114.013%20292.5%2081.7016%20234.5C41.3127%20162%2042.2102%20135%2039.5176%20102C37.3636%2075.6%2055.374%2023%2064.6485%200Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E)`,
                  maskImage: `url(data:image/svg+xml,%3Csvg%20width%3D%2296%22%20height%3D%22409%22%20viewBox%3D%220%200%2096%20409%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M64.6485%200H0.923828L2.71889%20409H64.6485C83.7958%20375%20114.013%20292.5%2081.7016%20234.5C41.3127%20162%2042.2102%20135%2039.5176%20102C37.3636%2075.6%2055.374%2023%2064.6485%200Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E)`,
                  maskRepeat: "repeat-y",
                  maskSize: "62%",
                  width: "70px",
                } as React.CSSProperties
              }
            >
              {Array.from({ length: numberOfStrings }, (_, stringIndex) => (
                <div
                  key={stringIndex}
                  style={
                    {
                      "--fretboard-current-string-thickness": `max(0.0625rem, calc(var(--fretboard-string-thickness) * ${
                        stringIndex + 1
                      }))`,
                    } as React.CSSProperties
                  }
                  className="h-[var(--fretboard-current-string-thickness)] z-[-1] bg-[var(--fretboard-string-color)]"
                ></div>
              ))}
            </div>

            {/* Fretboard grid */}
            <div className={styles.fretboardGridHorizontal}>
              {Array.from({ length: numberOfStrings }, (_, stringIndex) =>
                Array.from({ length: numberOfFrets }, (_, fretIndex) => (
                  <div
                    key={`hor-${stringIndex}-${fretIndex + firstFret}`}
                    className={cn(
                      "w-full h-full relative flex items-center justify-center"
                    )}
                  >
                    {/* Fret Color */}
                    <div
                      className={cn(
                        "absolute inset-0 z-[-1] bg-[var(--fretboard-fret-color)] mx-0.5",
                        {
                          "rounded-tl-md":
                            firstFret > 0 &&
                            fretIndex === 0 &&
                            stringIndex === 0,
                          "rounded-bl-md":
                            firstFret > 0 &&
                            fretIndex === 0 &&
                            stringIndex === numberOfStrings - 1,
                        }
                      )}
                    ></div>
                    {/* String */}
                    <div
                      style={
                        {
                          "--fretboard-current-string-thickness": `max(0.0625rem, calc(var(--fretboard-string-thickness) * ${
                            stringIndex + 1
                          }))`,
                        } as React.CSSProperties
                      }
                      className="absolute left-0 right-0 h-[var(--fretboard-current-string-thickness)] z-[-1] bg-[var(--fretboard-string-color)]"
                    ></div>

                    {/* Fret Marker */}
                    {((Math.floor(numberOfStrings / stringIndex) === 2 &&
                      [2, 4, 6, 8, 14, 16, 18, 20].includes(
                        fretIndex + firstFret
                      )) ||
                      ([2, 4].includes(stringIndex) &&
                        [11].includes(fretIndex + firstFret))) && (
                      <div className="absolute -top-1.5 h-3 w-3 z-[1] rounded-full bg-white"></div>
                    )}

                    <div>&nbsp;</div>

                    {/* {stringIndex === 0 && (
                    <div className="absolute inset-0 z-[3] bg-white opacity-80 translate-x-0.5"></div>
                  )} */}

                    {renderFret && (
                      <div className="absolute inset-0 flex items-center justify-center z-[2]">
                        {renderFret(stringIndex, fretIndex + firstFret)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Under the fretboard */}
            <div
              className={cn(
                styles.fretboardUnderHorizontal,
                "absolute top-full left-0 right-0"
              )}
            >
              {Array.from({ length: numberOfFrets }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center text-sm text-stone-500",
                    {
                      "text-black font-bold": [
                        3, 5, 7, 9, 12, 15, 17, 19, 21,
                      ].includes(index + firstFret + 1),
                    }
                  )}
                >
                  {index + firstFret + 1}
                </div>
              ))}
            </div>
          </div>
          {/* right of nut */}
          {renderRightOfBoard && (
            <div
              className={cn(
                styles.fretboardLeftOfNutHorizontal,
                "z-2 transform translate-x-8"
              )}
            >
              {Array.from({ length: numberOfStrings }).map((_, index) => (
                <div
                  key={index}
                  className="pr-1 flex items-center justify-center"
                >
                  {renderRightOfBoard(index)}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-fit h-full">
          {/* Left of nut */}
          <div className={styles.fretboardLeftOfNutVertical}>
            {Array.from({ length: numberOfStrings }).map((_, index, arr) => (
              <div
                key={index}
                className="pb-1 flex items-center justify-center"
              >
                {renderLeftOfNut
                  ? renderLeftOfNut(arr.length - index - 1)
                  : arr.length - index - 1}
              </div>
            ))}
          </div>

          {/* Nut */}
          {firstFret === 0 && (
            <div className="h-3 border-2 border-[var(--fretboard-string-color)] relative transform translate-y-0.5  bg-white">
              <div className="absolute inset-0 top-1/2 bg-stone-300"></div>
            </div>
          )}

          <div ref={contentRef} className="flex-0 relative">
            {/* Curved mask for the last fret - applies to entire column */}
            <div
              className={cn(
                "absolute left-0 right-0 top-full z-[0] bg-[var(--fretboard-fret-color)] h-4 transform translate-y-[-1.15rem] flex items-center justify-center",
                styles.fretboardLeftOfNutVertical
              )}
              style={
                {
                  WebkitMaskImage: `url(data:image/svg+xml,%3Csvg%20width%3D%22409%22%20height%3D%2295%22%20viewBox%3D%220%200%20409%2095%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M409%2063.7247L409%200L-7.84646e-08%201.79504L-2.78549e-06%2063.7246C34%2082.872%20116.5%20113.089%20174.5%2080.7777C247%2040.3889%20274%2041.2864%20307%2038.5938C333.4%2036.4397%20386%2054.4502%20409%2063.7247Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E)`,
                  maskImage: `url(data:image/svg+xml,%3Csvg%20width%3D%22409%22%20height%3D%2295%22%20viewBox%3D%220%200%20409%2095%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M409%2063.7247L409%200L-7.84646e-08%201.79504L-2.78549e-06%2063.7246C34%2082.872%20116.5%20113.089%20174.5%2080.7777C247%2040.3889%20274%2041.2864%20307%2038.5938C333.4%2036.4397%20386%2054.4502%20409%2063.7247Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E)`,
                  maskRepeat: "repeat-x",
                  maskSize: "62%",
                  height: "70px",
                } as React.CSSProperties
              }
            >
              {Array.from({ length: numberOfStrings }).map(
                (_, stringIndex, strArr) => (
                  <div
                    key={stringIndex}
                    style={
                      {
                        "--fretboard-current-string-thickness": `max(0.0625rem, calc(var(--fretboard-string-thickness) * ${
                          strArr.length - stringIndex
                        }))`,
                      } as React.CSSProperties
                    }
                    className="w-[var(--fretboard-current-string-thickness)] h-full mx-auto z-[-1] bg-[var(--fretboard-string-color)]"
                  ></div>
                )
              )}
            </div>

            {/* Fretboard grid */}
            <div className={styles.fretboardGridVertical}>
              {Array.from({ length: numberOfFrets }, (_, fretIndex) =>
                Array.from({ length: numberOfStrings }).map(
                  (_, stringIndex, strArr) => (
                    <div
                      key={`vert-${fretIndex + firstFret}-${stringIndex}`}
                      className={cn(
                        "w-full h-full relative flex items-center justify-center"
                      )}
                    >
                      {/* Fret Color */}
                      <div
                        className={cn(
                          "absolute inset-0 z-[-1] bg-[var(--fretboard-fret-color)] my-0.5",
                          {
                            "rounded-tl-md":
                              firstFret > 0 &&
                              fretIndex === 0 &&
                              stringIndex === 0,
                            "rounded-tr-md":
                              firstFret > 0 &&
                              fretIndex === 0 &&
                              stringIndex === numberOfStrings - 1,
                          }
                        )}
                      ></div>

                      {/* String */}
                      <div
                        style={
                          {
                            "--fretboard-current-string-thickness": `max(0.0625rem, calc(var(--fretboard-string-thickness) * ${
                              strArr.length - stringIndex
                            }))`,
                          } as React.CSSProperties
                        }
                        className="absolute top-0 bottom-0 w-[var(--fretboard-current-string-thickness)] z-[-1] bg-[var(--fretboard-string-color)]"
                      ></div>

                      {/* Fret Marker */}
                      {((Math.floor(numberOfStrings / stringIndex) === 2 &&
                        [2, 4, 6, 8, 14, 16, 18, 20].includes(
                          fretIndex + firstFret
                        )) ||
                        ([2, 4].includes(stringIndex) &&
                          [11].includes(fretIndex + firstFret))) && (
                        <div className="absolute -left-1.5 h-3 w-3 z-[1] rounded-full bg-white"></div>
                      )}

                      <div>&nbsp;</div>

                      {renderFret && (
                        <div className="absolute inset-0 flex items-center justify-center z-[2]">
                          {renderFret(stringIndex, fretIndex + firstFret)}
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>

            {/* Under the fretboard */}
            <div
              className={cn(
                styles.fretboardUnderVertical,
                "absolute right-full top-0 bottom-0 mr-1"
              )}
            >
              {Array.from({ length: numberOfFrets }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center text-sm text-stone-500",
                    {
                      "text-black font-bold": [
                        3, 5, 7, 9, 12, 15, 17, 19, 21,
                      ].includes(index + firstFret + 1),
                    }
                  )}
                >
                  {index + firstFret + 1}
                </div>
              ))}
            </div>
          </div>

          {/* right of nut */}
          {renderRightOfBoard && (
            <div
              className={cn(
                styles.fretboardLeftOfNutVertical,
                "z-2 transform translate-y-6"
              )}
            >
              {Array.from({ length: numberOfStrings }).map((_, index) => (
                <div
                  key={index}
                  className="pb-1 flex items-center justify-center"
                >
                  {renderRightOfBoard(index)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fretboard;
