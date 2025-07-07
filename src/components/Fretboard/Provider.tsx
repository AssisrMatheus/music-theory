"use client";

import { useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useContext } from "react";

type FretboardContext = {
  /**
   * Whether or not this provider has been initialized yet
   */
  hasProvider: boolean;

  instrument: string;
  numberOfFrets: number;
  firstFret: number;
  vertical: boolean;
};

const initialState: FretboardContext = {
  hasProvider: false,
  instrument: "guitar",
  numberOfFrets: 13,
  firstFret: 0,
  vertical: false,
};

const FretboardContext = React.createContext<FretboardContext>(initialState);

const FretboardProvider: React.FC<
  PropsWithChildren<Partial<Omit<FretboardContext, "hasProvider">>>
> = ({ children }) => {
  const searchParams = useSearchParams();

  const instrument = searchParams.get("instrument") || "guitar";
  const numberOfFrets = parseInt(searchParams.get("numberOfFrets") || "13", 10);
  const firstFret = parseInt(searchParams.get("firstFret") || "0", 10);
  const vertical = searchParams.get("vertical") === "true";

  return (
    <FretboardContext.Provider
      value={{
        hasProvider: true,
        instrument,
        numberOfFrets,
        firstFret,
        vertical,
      }}
    >
      {children}
    </FretboardContext.Provider>
  );
};

export const useFretboardContext = () => useContext(FretboardContext);

export default FretboardProvider;
