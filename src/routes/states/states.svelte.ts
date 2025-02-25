import { browser } from "$app/environment";

type Question = [number, number];

const allQuestions = {
  two: [
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
  ] as Question[],
  three: [
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
  ] as Question[],
  four: [
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ] as Question[],
  five: [
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 5],
    [5, 6],
  ] as Question[],
  six: [
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 6],
    [6, 7],
    [6, 8],
  ] as Question[],
  seven: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [7, 8],
  ] as Question[],
  eight: [
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
  ] as Question[],
  nine: [
    [9, 1],
    [9, 2],
    [9, 3],
    [9, 4],
    [9, 5],
    [9, 6],
    [9, 7],
    [9, 8],
    [9, 9],
  ] as Question[],
};

export const defaultSettings = {
  schemaVersion: 1, // if the shape of this object gets changed in the future, increment this number
  allowQuestionStartingWith: {
    two: true,
    three: true,
    four: true,
    five: true,
    six: true,
    seven: true,
    eight: true,
    nine: true,
  },
  numQuestions: 15,
  maxSum: 20,
};

const persistedUserSettings = browser
  ? JSON.parse(
      localStorage.getItem(`settings_v${defaultSettings.schemaVersion}`)! // if non existing, will return null.JSON.parse(null) is also null
    )
  : null;
console.debug("Settings used last time:", persistedUserSettings);

/**
 * s = "global states"
 */
export const s = $state({
  view: "game" as "game" | "settings",
  questionsThisGame: [[0, 0]],
  nowAt: 0, // the current index in questionsThisGame
  allDone: false, // when true, show "all done" screen. This happens after the last question is answered after nowAt has been incremented to questionsThisGame.length - 1
  currentAnswer: { a: 0, b: 0, c: 0 }, // the user input value of a b c. Starts with 0 as being empty
  settings: persistedUserSettings || defaultSettings,
});

const currentQuestion = $derived.by(() => {
  const [a, b] = s.questionsThisGame[s.nowAt];
  const c = a + b;
  return { a, b, c };
});

/**
 * The pool of questions that are allowed to be asked
 */
const questionPool = $derived.by(() => {
  let result: Question[] = [];
  Object.entries(s.settings.allowQuestionStartingWith)
    .filter(([_key, allowed]) => allowed)
    .forEach(([key, _allowed]) => {
      result.push(...allQuestions[key as keyof typeof allQuestions]);
    });
  result = result.filter(([a, b]) => a + b <= s.settings.maxSum);
  return result;
});

/**
 * d = "global derived states"
 */
export const d = {
  get questionPool() {
    return questionPool;
  },
  get currentQuestion() {
    return currentQuestion;
  },
};

export function restartGame() {
  /**
   * Stackoverflow answer of how to shuffle an array.
   * This function first makes a copy of the array, then mutates the copy, then returns it.
   */
  function shuffle(array: any[]) {
    const result = [...array];
    let currentIndex = result.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [result[currentIndex], result[randomIndex]] = [
        result[randomIndex],
        result[currentIndex],
      ];
    }
    return result;
  }
  s.currentAnswer = { a: 0, b: 0, c: 0 };
  // randomly pick x questions from derived.allowedQuestions, where x is states.settings.numQuestions, and put them in states.questionsThisGame
  s.questionsThisGame = shuffle(d.questionPool).slice(
    0,
    s.settings.numQuestions
  );
  console.debug("questionPool:", d.questionPool);
  console.debug("questionsThisGame:", $state.snapshot(s.questionsThisGame));
  s.allDone = false;
  s.nowAt = 0;
}
