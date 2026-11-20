// CP0 environment smoke test: a deterministic headless program with no dependencies.
const state = {
  game: "Dao Den Long",
  mode: "headless",
  player: "May",
  fireflies: 0,
  lanterns_lit: 0,
  status: "ready",
};

console.log(JSON.stringify(state));
