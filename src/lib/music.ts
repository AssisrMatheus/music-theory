export const notes = [
  "A",
  "Bb",
  "B",
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
];

export const getNextNote = (note: string) => {
  const index = notes.indexOf(note);
  if (index === -1) {
    throw new Error(`Note ${note} not found`);
  }

  return notes[(index + 1) % notes.length];
};
