import {
  randomChoice
} from "./chunk-WZQDTJZ3.js";
import {
  KPattern,
  KPuzzle,
  cube2x2x2,
  cube3x3x3KPuzzleDefinition,
  from,
  puzzles
} from "./chunk-62BIKP6W.js";
import {
  Alg,
  AlgBuilder,
  Move,
  TraversalUp,
  functionFromTraversal
} from "./chunk-LLF73NS3.js";
import {
  __publicField
} from "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-G3TV3PXV.js
function uncachedMoveCount(moveQuantumString) {
  if (moveQuantumString.endsWith("v") || ["x", "y", "z"].includes(moveQuantumString)) {
    return "Rotation";
  }
  if (moveQuantumString.startsWith("2") || ["M", "E", "S"].includes(moveQuantumString)) {
    return "Inner";
  }
  return "Outer";
}
var cache;
function getCache() {
  if (cache) {
    return cache;
  }
  cache = {};
  const moveQuantumStrings = [
    ...Object.keys(cube3x3x3KPuzzleDefinition.moves),
    ...Object.keys(cube3x3x3KPuzzleDefinition.derivedMoves)
  ];
  for (const moveQuantumString of moveQuantumStrings) {
    cache[moveQuantumString] = uncachedMoveCount(moveQuantumString);
  }
  return cache;
}
var costFactorsByMetric = {
  // Note: these are hardcoded for 3x3x3. They will not automatically generalize to any other puzzles.
  [
    "OBTM"
    /* OuterBlockTurnMetric */
  ]: {
    [
      "Rotation"
      /* Rotation */
    ]: { constantFactor: 0, amountFactor: 0 },
    [
      "Outer"
      /* Outer */
    ]: { constantFactor: 1, amountFactor: 0 },
    [
      "Inner"
      /* Inner */
    ]: { constantFactor: 2, amountFactor: 0 }
  },
  [
    "RBTM"
    /* RangeBlockTurnMetric */
  ]: {
    [
      "Rotation"
      /* Rotation */
    ]: { constantFactor: 0, amountFactor: 0 },
    [
      "Outer"
      /* Outer */
    ]: { constantFactor: 1, amountFactor: 0 },
    [
      "Inner"
      /* Inner */
    ]: { constantFactor: 1, amountFactor: 0 }
  },
  [
    "OBQTM"
    /* OuterBlockQuantumTurnMetric */
  ]: {
    [
      "Rotation"
      /* Rotation */
    ]: { constantFactor: 0, amountFactor: 0 },
    [
      "Outer"
      /* Outer */
    ]: { constantFactor: 0, amountFactor: 1 },
    [
      "Inner"
      /* Inner */
    ]: { constantFactor: 0, amountFactor: 2 }
  },
  [
    "RBQTM"
    /* RangeBlockQuantumTurnMetric */
  ]: {
    [
      "Rotation"
      /* Rotation */
    ]: { constantFactor: 0, amountFactor: 0 },
    [
      "Outer"
      /* Outer */
    ]: { constantFactor: 0, amountFactor: 1 },
    [
      "Inner"
      /* Inner */
    ]: { constantFactor: 0, amountFactor: 1 }
  },
  [
    "ETM"
    /* ExecutionTurnMetric */
  ]: {
    [
      "Rotation"
      /* Rotation */
    ]: { constantFactor: 1, amountFactor: 0 },
    [
      "Outer"
      /* Outer */
    ]: { constantFactor: 1, amountFactor: 0 },
    [
      "Inner"
      /* Inner */
    ]: { constantFactor: 1, amountFactor: 0 }
  }
};
function countMove3x3x3(metric, move) {
  const costFactors = costFactorsByMetric[metric];
  if (!costFactors) {
    throw new Error(`Invalid metric for 3x3x3: ${metric}`);
  }
  const cache2 = getCache();
  const moveQuantumString = move.quantum.toString();
  if (!(moveQuantumString in cache2)) {
    throw new Error(`Invalid move for 3x3x3 ${metric}: ${moveQuantumString}`);
  }
  const costType = cache2[moveQuantumString];
  const { constantFactor, amountFactor } = costFactors[costType];
  return constantFactor + amountFactor * Math.abs(move.amount);
}
var CountMoves = class extends TraversalUp {
  constructor(metric) {
    super();
    this.metric = metric;
  }
  traverseAlg(alg) {
    let r = 0;
    for (const algNode of alg.childAlgNodes()) {
      r += this.traverseAlgNode(algNode);
    }
    return r;
  }
  traverseGrouping(grouping) {
    const alg = grouping.alg;
    return this.traverseAlg(alg) * Math.abs(grouping.amount);
  }
  traverseMove(move) {
    return this.metric(move);
  }
  traverseCommutator(commutator) {
    return 2 * (this.traverseAlg(commutator.A) + this.traverseAlg(commutator.B));
  }
  traverseConjugate(conjugate) {
    return 2 * this.traverseAlg(conjugate.A) + this.traverseAlg(conjugate.B);
  }
  // TODO: Remove spaces between repeated pauses (in traverseSequence)
  traversePause(_pause) {
    return 0;
  }
  traverseNewline(_newLine) {
    return 0;
  }
  // TODO: Enforce being followed by a newline (or the end of the alg)?
  traverseLineComment(_comment) {
    return 0;
  }
};
function isCharUppercase(c) {
  return "A" <= c && c <= "Z";
}
function baseMetric(move) {
  const fam = move.family;
  if (isCharUppercase(fam[0]) && fam[fam.length - 1] === "v" || fam === "x" || fam === "y" || fam === "z" || fam === "T") {
    return 0;
  } else {
    return 1;
  }
}
function etmMetric(_move) {
  return 1;
}
function rangeBlockTurnMetric(move) {
  const fam = move.family;
  if (isCharUppercase(fam[0]) && fam[fam.length - 1] === "v" || fam === "x" || fam === "y" || fam === "z" || fam === "T") {
    return 0;
  } else {
    return 1;
  }
}
function quantumMetric(move) {
  return Math.abs(move.amount) * rangeBlockTurnMetric(move);
}
var countMoves = functionFromTraversal(CountMoves, [baseMetric]);
var countMovesETM = functionFromTraversal(CountMoves, [etmMetric]);
var countRangeBlockQuantumMovesPG = functionFromTraversal(CountMoves, [
  quantumMetric
]);
var countRangeBlockMovesPG = functionFromTraversal(CountMoves, [
  rangeBlockTurnMetric
]);
function countMetricMoves(puzzleLoader, metric, alg) {
  if (puzzleLoader.id === "3x3x3") {
    if (metric in costFactorsByMetric) {
      return functionFromTraversal(CountMoves, [
        (move) => countMove3x3x3(metric, move)
      ])(alg);
    }
  } else {
    switch (metric) {
      case "ETM":
        return countMovesETM(alg);
      case "RBTM": {
        if (puzzleLoader.pg) {
          return countRangeBlockMovesPG(alg);
        }
        break;
      }
      case "RBQTM": {
        if (puzzleLoader.pg) {
          return countRangeBlockQuantumMovesPG(alg);
        }
        break;
      }
    }
  }
  throw new Error("Unsupported puzzle or metric.");
}
var CountAnimatedLeaves = class extends TraversalUp {
  traverseAlg(alg) {
    let total = 0;
    for (const part of alg.childAlgNodes()) {
      total += this.traverseAlgNode(part);
    }
    return total;
  }
  traverseGrouping(grouping) {
    return this.traverseAlg(grouping.alg) * Math.abs(grouping.amount);
  }
  traverseMove(_move) {
    return 1;
  }
  traverseCommutator(commutator) {
    return 2 * (this.traverseAlg(commutator.A) + this.traverseAlg(commutator.B));
  }
  traverseConjugate(conjugate) {
    return 2 * this.traverseAlg(conjugate.A) + this.traverseAlg(conjugate.B);
  }
  traversePause(_pause) {
    return 1;
  }
  traverseNewline(_newline) {
    return 0;
  }
  traverseLineComment(_comment) {
    return 0;
  }
};
var countAnimatedLeaves = functionFromTraversal(CountAnimatedLeaves);

// node_modules/cubing/dist/lib/cubing/chunks/chunk-VQN233QA.js
var isInsideWorker = false;
function setIsInsideWorker(inside) {
  isInsideWorker = inside;
}
function mustBeInsideWorker() {
  if (!isInsideWorker) {
    throw new Error(
      "Must be called from inside a worker, to avoid impact on page performance. Try importing from the top level of `cubing/solve`?"
    );
  }
}
function addOrientationSuffix(alg, suffixSpec) {
  const algBuilder = new AlgBuilder();
  algBuilder.experimentalPushAlg(alg);
  for (const suffix of suffixSpec) {
    const choice = randomChoice(suffix);
    if (choice !== null) {
      algBuilder.push(Move.fromString(choice));
    }
  }
  return algBuilder.toAlg();
}
var dynamic3x3x3min2phase = from(() => import("./search-dynamic-solve-3x3x3-5UOUZX2V-DEKOITF3.js"));
var reidEdgeOrder = "UF UR UB UL DF DR DB DL FR FL BR BL".split(" ");
var reidCornerOrder = "UFR URB UBL ULF DRF DFL DLB DBR".split(" ");
var centerOrder = "U L F R B D".split(" ");
var map = [
  [1, 2, 0],
  [0, 2, 0],
  [1, 1, 0],
  [0, 3, 0],
  [2, 0, 0],
  [0, 1, 0],
  [1, 3, 0],
  [0, 0, 0],
  [1, 0, 0],
  [1, 0, 2],
  [0, 1, 1],
  [1, 1, 1],
  [0, 8, 1],
  [2, 3, 0],
  [0, 10, 1],
  [1, 4, 1],
  [0, 5, 1],
  [1, 7, 2],
  [1, 3, 2],
  [0, 0, 1],
  [1, 0, 1],
  [0, 9, 0],
  [2, 2, 0],
  [0, 8, 0],
  [1, 5, 1],
  [0, 4, 1],
  [1, 4, 2],
  [1, 5, 0],
  [0, 4, 0],
  [1, 4, 0],
  [0, 7, 0],
  [2, 5, 0],
  [0, 5, 0],
  [1, 6, 0],
  [0, 6, 0],
  [1, 7, 0],
  [1, 2, 2],
  [0, 3, 1],
  [1, 3, 1],
  [0, 11, 1],
  [2, 1, 0],
  [0, 9, 1],
  [1, 6, 1],
  [0, 7, 1],
  [1, 5, 2],
  [1, 1, 2],
  [0, 2, 1],
  [1, 2, 1],
  [0, 10, 0],
  [2, 4, 0],
  [0, 11, 0],
  [1, 7, 1],
  [0, 6, 1],
  [1, 6, 2]
];
function rotateLeft(s, i) {
  return s.slice(i) + s.slice(0, i);
}
function toReid333Struct(pattern) {
  const output = [[], []];
  for (let i = 0; i < 6; i++) {
    if (pattern.patternData["CENTERS"].pieces[i] !== i) {
      throw new Error("non-oriented puzzles are not supported");
    }
  }
  for (let i = 0; i < 12; i++) {
    output[0].push(
      rotateLeft(
        reidEdgeOrder[pattern.patternData["EDGES"].pieces[i]],
        pattern.patternData["EDGES"].orientation[i]
      )
    );
  }
  for (let i = 0; i < 8; i++) {
    output[1].push(
      rotateLeft(
        reidCornerOrder[pattern.patternData["CORNERS"].pieces[i]],
        pattern.patternData["CORNERS"].orientation[i]
      )
    );
  }
  output.push(centerOrder);
  return output;
}
function toMin2PhasePattern(pattern) {
  const reid = toReid333Struct(pattern);
  return map.map(([orbit, perm, ori]) => reid[orbit][perm][ori]).join("");
}
function isEquivalentTranformationIgnoringCENTERS(t1, t2) {
  const t1NoCenterOri = new KPattern(t1.kpuzzle, {
    EDGES: t1.patternData.EDGES,
    CORNERS: t1.patternData.CORNERS,
    CENTERS: {
      pieces: t1.patternData.CENTERS.pieces,
      orientation: new Array(6).fill(0)
    }
  }).experimentalToTransformation();
  const t2NoCenterOri = new KPattern(t2.kpuzzle, {
    EDGES: t2.patternData.EDGES,
    CORNERS: t2.patternData.CORNERS,
    CENTERS: {
      pieces: t2.patternData.CENTERS.pieces,
      orientation: new Array(6).fill(0)
    }
  }).experimentalToTransformation();
  return t1NoCenterOri.isIdentical(t2NoCenterOri);
}
function passesFilter(kpuzzle, pattern) {
  if (isEquivalentTranformationIgnoringCENTERS(kpuzzle.defaultPattern(), pattern)) {
    return false;
  }
  for (const face of "ULFRBD") {
    for (let amount = 1; amount < 4; amount++) {
      const transformation = kpuzzle.moveToTransformation(new Move(face, amount)).toKPattern();
      if (isEquivalentTranformationIgnoringCENTERS(transformation, pattern)) {
        return false;
      }
    }
  }
  return true;
}
var sgs3x3x3 = [
  [
    "R U'",
    "R2 B",
    //
    "D2 B2",
    "D' L B'",
    //
    "R' U'",
    "B",
    //
    "D B2",
    "R' B",
    //
    "L' U",
    "L2 B'",
    //
    "B2",
    "D L B'",
    //
    "L U",
    "B'",
    //
    "U'",
    "R B",
    //
    "D' B2",
    "L B'",
    //
    "U2",
    "U L' B'",
    //
    "",
    "U' L' B'",
    //
    "U",
    "L' B'"
  ],
  [
    "F2 L2",
    "F' L'",
    "R' F L2",
    //
    "D' L2",
    "F L2",
    "F2 L'",
    //
    "R' F' L'",
    "R2 F L2",
    "R2 F2 L'",
    //
    "L2",
    "F L'",
    "D' L",
    //
    "D2 L2",
    "R2 F' L'",
    "D L",
    //
    "",
    "L2 F L'",
    "L F' L2",
    //
    "L F L'",
    "F' L2",
    "L'",
    //
    "D L2",
    "D F L'",
    "L"
  ],
  [
    "R B U2 B'",
    "R2 B U' B'",
    //
    "F2 B U B'",
    "F B2 L' B2",
    //
    "B2 L B2",
    "B U' B'",
    //
    "R2 B U2 B'",
    "R' B U' B'",
    //
    "B2 L' B2",
    "F B U B'",
    //
    "B2 U' B2",
    "B' L B",
    //
    "L F' B D' B'",
    "B' U' B2 D B'",
    //
    "B U2 B'",
    "R B U' B'",
    //
    "B2 L2 B2",
    "D' B' L B",
    //
    "B U B'",
    "F' B2 L' B2",
    //
    "",
    "B2 L' B' U' B'"
  ],
  [
    "U F2 L2 U'",
    "F' U L' U'",
    //
    "F2 U L' U'",
    "U F L2 U'",
    //
    "U2 B2 U2",
    "R' U' B U",
    //
    "D2 U L U'",
    "D U2 B' U2",
    //
    "U L2 U'",
    "F U L' U'",
    //
    "D U L U'",
    "U2 B' U2",
    //
    "",
    "U2 B' U' L' U'",
    //
    "U2 L' U2",
    "U' B U",
    //
    "U L U'",
    "D' U2 B' U2",
    //
    "U L' U'",
    "U2 B U2"
  ],
  [
    "R' D' F2",
    "F'",
    //
    "F2",
    "D R F'",
    //
    "R D' F2",
    "R2 F'",
    //
    "D' F2",
    "R F'",
    //
    "F2 R' D' F2",
    "F",
    //
    "D2 F2",
    "D' R F'",
    //
    "R2 D' F2",
    "R' F'",
    //
    "D F2",
    "D2 R F'",
    //
    "",
    "F R' D' F2"
  ],
  [
    "R' D2 F' D F",
    "R F2 R2 F2",
    "R2 F' D2 F",
    //
    "F' R2 D2 F",
    "L D' L'",
    "D F' D2 F",
    //
    "F2 R2 F2",
    "R F' D2 F",
    "F' R2 D' F",
    //
    "F' R' D2 F",
    "F2 R' F2",
    "L D L'",
    //
    "F' R D' F",
    "F2 R F2",
    "F' D2 F",
    //
    "",
    "L D2 R D' L'",
    "F' D2 F' R F2",
    //
    "D2 R2 F2 R2 F2",
    "D F' D' F",
    "F' D F"
  ],
  [
    "U F2 U'",
    "R U F' U'",
    //
    "D R U F2 U'",
    "U F U'",
    //
    "R2 U F2 U'",
    "R' U F' U'",
    //
    "R U F2 U'",
    "R2 U F' U'",
    //
    "",
    "U L D L' F U'",
    //
    "F2 D' R D F2",
    "D2 U F U'",
    //
    "R' U F2 U'",
    "U F' U'",
    //
    "F2 D2 R D2 F2",
    "D U F U'"
  ],
  [
    "R2",
    "R' B' D B",
    //
    "D R'",
    "F' R2 F",
    //
    "",
    "R B' D B",
    //
    "R'",
    "B' D B",
    //
    "D' R'",
    "D2 F' R2 F",
    //
    "R",
    "R2 B' D B",
    //
    "D2 R'",
    "B' D' B"
  ],
  [
    "R2 D' R2",
    "F' R' F R",
    "R D' R2 D R'",
    //
    "D2 R2 D2 R2",
    "R' D' F' R F",
    "U F D F' U'",
    //
    "",
    "R2 D2 B R' B' R'",
    "R' F D' F2 R F",
    //
    "R2 D R2",
    "F2 U F U' F",
    "R' D F' R F",
    //
    "D R2 D2 R2",
    "U F D' F' U'",
    "D R' D2 F' R F",
    //
    "R2 D2 R2",
    "U F D2 F' U'",
    "R' D2 F' R F"
  ],
  [
    "B R B'",
    "F D F' B R2 B'",
    //
    "D B R2 B'",
    "D2 B R' B'",
    //
    "B R2 B'",
    "D B R' B'",
    //
    "D' B R2 B'",
    "B R' B'",
    //
    "",
    "B R2 B' D B R' B'",
    //
    "D2 B R2 B'",
    "D' B R' B'"
  ],
  [
    "",
    "R' D R F D2 F'",
    //
    "R' D R",
    "D F D' F'",
    //
    "R F' R' F",
    "F D' F'",
    //
    "R' D' R",
    "F D2 F'",
    //
    "R' D2 R",
    "F D F'"
  ],
  [
    "",
    "F2 D2 R F' R' D2 F' D2 F'",
    "F2 D2 F' D' F D' F' D2 F'",
    //
    "F2 D F2 D F2 D2 F2",
    "D2 F L D2 L' D2 F'",
    "D F D2 L D2 L' F'",
    //
    "R' D B' D2 B D' R",
    "R' D2 B' D2 B R",
    "F D2 F' D F D F'",
    //
    "F D' L D2 L' D F'",
    "B D' F D B' D' F'",
    "F D2 L D2 L' F'",
    //
    "F D' L D L' D F'",
    "F L D2 L' D2 F'",
    "R' B' D2 B D2 R"
  ],
  [
    "D'",
    "F L D L' D' F'",
    //
    "D2",
    "L B D B' D' L'",
    //
    "D",
    "B' L' D' L D B",
    //
    "",
    "D F L D L' D' F'"
  ],
  [
    "F' D2 F D F' D F",
    "F' D' R' D R F",
    //
    "F' R' D' R D F",
    "B D R D' R' B'",
    //
    "",
    "D B' D' L' D L B"
  ],
  [
    "D F D F' D F D2 F'",
    "F' U2 B' R' B U2 F' L F' L' F'",
    //
    "",
    "D2 L D L2 F L F2 D F"
  ],
  [
    "L B' L' F L B L' F'",
    "F2 U F' D2 F U' F' D2 F'",
    "D' F' D B D' F D B'",
    //
    "F L2 F R2 F' L2 F R2 F2",
    "D B D' F' D B' D' F",
    "R F L F' R' F L' F'",
    //
    "",
    "D2 B L' U2 L B' D2 B L' U2 L B'",
    "D2 F R' U2 R F' D2 F R' U2 R F'",
    //
    "R F L' F' R' F L F'",
    "D F D' B' D F' D' B",
    "L2 F2 L' B2 L F2 L' B2 L'"
  ],
  [
    "L B R' B' L' B R B'",
    "R' B R F' R' B' R F",
    "L D2 L U L' D2 L U' L2",
    //
    "",
    "D2 B' D2 F D' L2 F L2 F' D2 B D' F'",
    "D2 F' R' F R2 B' D2 B D2 R' F D2 F'",
    //
    "L B L' F L B' L' F'",
    "F' D2 F' U' F D2 F' U F2",
    "D' B' D F D' B D F'"
  ],
  ["", "D2 F' L U2 L' F D2 F' L U2 L' F", "D2 B' R U2 R' B D2 B' R U2 R' B"]
];
async function random333Pattern() {
  const kpuzzle = await puzzles["3x3x3"].kpuzzle();
  let pattern = kpuzzle.defaultPattern();
  for (const piece of sgs3x3x3) {
    pattern = pattern.applyAlg(Alg.fromString(randomChoice(piece)));
  }
  if (!passesFilter(kpuzzle, pattern)) {
    return random333Pattern();
  }
  return pattern;
}
async function solve333(s) {
  mustBeInsideWorker();
  return Alg.fromString(
    (await dynamic3x3x3min2phase).solvePattern(toMin2PhasePattern(s))
  );
}
async function random333Scramble() {
  return solve333(await random333Pattern());
}
async function initialize333() {
  (await dynamic3x3x3min2phase).initialize();
}
var randomSuffixes = [
  [null, "Rw", "Rw2", "Rw'", "Fw", "Fw'"],
  [null, "Dw", "Dw2", "Dw'"]
];
async function random333OrientedScramble() {
  return addOrientationSuffix(await random333Scramble(), randomSuffixes);
}
var DEFAULT_STAGE1_DEPTH_LIMIT = 2;
var DOUBLECHECK_PLACED_PIECES = true;
var DEBUG = false;
function calculateMoves(kpuzzle, moveNames) {
  const searchMoves = [];
  for (const moveName of moveNames) {
    const rootMove = new Move(moveName);
    if (rootMove.amount !== 1) {
      throw new Error(
        "SGS cannot handle def moves with an amount other than 1 yet."
      );
    }
    let transformation = kpuzzle.identityTransformation();
    for (let i = 1; ; i++) {
      transformation = transformation.applyMove(rootMove);
      if (transformation.isIdentityTransformation()) {
        break;
      }
      searchMoves.push({
        move: rootMove.modified({ amount: i }),
        transformation
      });
    }
  }
  return searchMoves;
}
var TrembleSolver = class {
  constructor(kpuzzle, sgs, trembleMoveNames) {
    __publicField(this, "searchMoves");
    this.kpuzzle = kpuzzle;
    this.sgs = sgs;
    this.searchMoves = calculateMoves(
      this.kpuzzle,
      trembleMoveNames ?? Object.keys(this.kpuzzle.definition.moves)
    );
  }
  // public badRandomMoves(): KSolvePuzzleState {
  //   return badRandomMoves(this.moves, this.ksp);
  // }
  async solve(pattern, stage1DepthLimit = DEFAULT_STAGE1_DEPTH_LIMIT, quantumMoveOrder) {
    const transformation = pattern.experimentalToTransformation();
    if (!transformation) {
      throw new Error(
        "distinguishable pieces are not supported in tremble solver yt"
      );
    }
    let bestAlg = null;
    let bestLen = 1e6;
    const recur = (recursiveTransformation, togo, sofar) => {
      if (togo === 0) {
        const sgsAlg = this.sgsPhaseSolve(recursiveTransformation, bestLen);
        if (!sgsAlg) {
          return;
        }
        const newAlg = sofar.concat(sgsAlg).experimentalSimplify({
          cancel: {
            directional: "any-direction",
            puzzleSpecificModWrap: "canonical-centered"
          },
          puzzleSpecificSimplifyOptions: { quantumMoveOrder }
        });
        const len = countMoves(newAlg);
        if (bestAlg === null || len < bestLen) {
          if (DEBUG) {
            console.log(`New best (${len} moves): ${newAlg.toString()}`);
            console.log(`Tremble moves are: ${sofar.toString()}`);
          }
          bestAlg = newAlg;
          bestLen = len;
        }
        return;
      }
      for (const searchMove of this.searchMoves) {
        recur(
          recursiveTransformation.applyTransformation(
            searchMove.transformation
          ),
          togo - 1,
          sofar.concat([searchMove.move])
        );
      }
    };
    for (let d = 0; d <= stage1DepthLimit; d++) {
      recur(transformation, d, new Alg());
    }
    if (bestAlg === null) {
      throw new Error("SGS search failed.");
    }
    return bestAlg;
  }
  sgsPhaseSolve(initialTransformation, bestLenSofar) {
    const algBuilder = new AlgBuilder();
    let transformation = initialTransformation;
    for (const step of this.sgs.ordering) {
      const cubieSeq = step.pieceOrdering;
      let key = "";
      const inverseTransformation = transformation.invert();
      for (let i = 0; i < cubieSeq.length; i++) {
        const loc = cubieSeq[i];
        const orbitName = loc.orbitName;
        const idx = loc.permutationIdx;
        key += ` ${inverseTransformation.transformationData[orbitName].permutation[idx]} ${inverseTransformation.transformationData[orbitName].orientationDelta[idx]}`;
      }
      const info = step.lookup[key];
      if (!info) {
        throw new Error("Missing algorithm in sgs or esgs?");
      }
      algBuilder.experimentalPushAlg(info.alg);
      if (algBuilder.experimentalNumAlgNodes() >= bestLenSofar) {
        return null;
      }
      transformation = transformation.applyTransformation(info.transformation);
      if (DOUBLECHECK_PLACED_PIECES) {
        for (let i = 0; i < cubieSeq.length; i++) {
          const location = cubieSeq[i];
          const orbitName = location.orbitName;
          const idx = location.permutationIdx;
          if (transformation.transformationData[orbitName].permutation[idx] !== idx || transformation.transformationData[orbitName].orientationDelta[idx] !== 0) {
            throw new Error("bad SGS :-(");
          }
        }
      }
    }
    return algBuilder.toAlg();
  }
};
function randomPatternFromSGS(kpuzzle, sgs) {
  let transformation = kpuzzle.identityTransformation();
  for (const step of sgs.ordering) {
    const sgsAction = randomChoice(Object.values(step.lookup));
    transformation = transformation.applyTransformation(
      sgsAction.transformation
    );
  }
  return transformation.toKPattern();
}
var searchDynamicSideEvents = from(() => import("./search-dynamic-sgs-side-events-OM62T2GD-OE4CRJYZ.js"));
var twsearchPromise = from(async () => import("./twsearch-QLSDT3QA-TJAZ24ZH.js"));
async function wasmTwsearch(def, pattern, options) {
  const { wasmTwsearch: wasmTwsearch2 } = await twsearchPromise;
  return wasmTwsearch2(def, pattern, options);
}
async function wasmRandomScrambleForEvent(eventID) {
  const { wasmRandomScrambleForEvent: wasmRandomScrambleForEvent2 } = await twsearchPromise;
  return wasmRandomScrambleForEvent2(eventID);
}
var cachedTrembleSolver = null;
async function getCachedTrembleSolver() {
  return cachedTrembleSolver || (cachedTrembleSolver = (async () => {
    const sgsCachedData = await (await searchDynamicSideEvents).cachedData222();
    return new TrembleSolver(
      await puzzles["2x2x2"].kpuzzle(),
      sgsCachedData,
      "URFLBD".split("")
    );
  })());
}
async function preInitialize222() {
  await getCachedTrembleSolver();
}
async function solve222HTMSubOptimal(pattern, maxDepth = 11) {
  mustBeInsideWorker();
  return await wasmTwsearch((await cube2x2x2.kpuzzle()).definition, pattern, {
    generatorMoves: "UFLR".split(""),
    // TODO: <U, F, R>
    maxDepth
  });
}
var dynamic4x4x4Solver = from(() => import("./search-dynamic-solve-4x4x4-P3FQCJIE-NARG6SG5.js"));
var randomSuffixes2 = [
  [null, "x", "x2", "x'", "z", "z'"],
  [null, "y", "y2", "y'"]
];
async function initialize444() {
  return (await dynamic4x4x4Solver).initialize();
}
async function random444Scramble() {
  mustBeInsideWorker();
  return (await dynamic4x4x4Solver).random444Scramble();
}
async function random444OrientedScramble() {
  return addOrientationSuffix(await random444Scramble(), randomSuffixes2);
}
var dynamicFTOSolver = from(() => import("./search-dynamic-solve-fto-EY5ZVAGO-3IOCO6VZ.js"));
var dynamic = from(() => import("./search-dynamic-sgs-unofficial-VUTISYSB-TMF4XP6R.js"));
async function randomFTOScramble() {
  mustBeInsideWorker();
  return new Alg(await (await dynamicFTOSolver).randomFTOScrambleString());
}
var dynamicKilominxSolver = from(() => import("./search-dynamic-solve-kilominx-F7OMJSDE-OLFNFNFC.js"));
async function randomKilominxScramble() {
  mustBeInsideWorker();
  return (await dynamicKilominxSolver).getRandomKilominxScramble();
}
var dynamicMasterTetraminxSolver = from(() => import("./search-dynamic-solve-master_tetraminx-3D4MBF3V-2VRZMK7B.js"));
async function randomMasterTetraminxScramble() {
  mustBeInsideWorker();
  return new Alg(
    await (await dynamicMasterTetraminxSolver).randomMasterTetraminxScrambleString()
  );
}
var TREMBLE_DEPTH = 2;
var cachedTrembleSolver2 = null;
async function getCachedTrembleSolver2() {
  return cachedTrembleSolver2 || (cachedTrembleSolver2 = (async () => {
    const json = await (await searchDynamicSideEvents).cachedSGSDataMegaminx();
    return new TrembleSolver(
      await (await searchDynamicSideEvents).cachedMegaminxKPuzzleWithoutMO(),
      json,
      ["U", "R", "F", "L", "BR", "BL", "FR", "FL", "DR", "DL", "B", "D"]
    );
  })());
}
async function solveMegaminx(pattern) {
  mustBeInsideWorker();
  const trembleSolver = await getCachedTrembleSolver2();
  const patternDataWithoutMO = structuredClone(
    pattern.patternData
  );
  patternDataWithoutMO.CENTERS.orientation = new Array(12).fill(0);
  const patternWithoutMO = new KPattern(
    await (await searchDynamicSideEvents).cachedMegaminxKPuzzleWithoutMO(),
    patternDataWithoutMO
  );
  const alg = await trembleSolver.solve(
    patternWithoutMO,
    TREMBLE_DEPTH,
    () => 5
    // TODO: Attach quantum move order lookup to puzzle.
  );
  return alg;
}
var TREMBLE_DEPTH2 = 3;
var cachedTrembleSolver3 = null;
async function getCachedTrembleSolver3() {
  return cachedTrembleSolver3 || (cachedTrembleSolver3 = (async () => {
    const json = await (await searchDynamicSideEvents).sgsDataPyraminx();
    return new TrembleSolver(
      await puzzles.pyraminx.kpuzzle(),
      json,
      "RLUB".split("")
    );
  })());
}
async function solvePyraminx(pattern) {
  mustBeInsideWorker();
  const trembleSolver = await getCachedTrembleSolver3();
  const alg = await trembleSolver.solve(pattern, TREMBLE_DEPTH2, () => 3);
  return alg;
}
var searchDynamicUnofficial = from(() => import("./search-dynamic-sgs-unofficial-VUTISYSB-TMF4XP6R.js"));
async function randomRediCubeScramble() {
  mustBeInsideWorker();
  return (await searchDynamicUnofficial).getRandomRediCubeScramble();
}
var TREMBLE_DEPTH3 = 3;
var cachedTrembleSolver4 = null;
async function getCachedTrembleSolver4() {
  return cachedTrembleSolver4 || (cachedTrembleSolver4 = (async () => {
    const json = await (await searchDynamicSideEvents).sgsDataSkewb();
    return new TrembleSolver(
      await (await searchDynamicSideEvents).skewbKPuzzleWithoutMOCached(),
      json,
      "RLUB".split("")
    );
  })());
}
async function resetCenterOrientation(pattern) {
  return new KPattern(
    await (await searchDynamicSideEvents).skewbKPuzzleWithoutMOCached(),
    {
      CORNERS: pattern.patternData.CORNERS,
      CENTERS: {
        pieces: pattern.patternData.CENTERS.pieces,
        orientation: new Array(6).fill(0)
      }
    }
  );
}
async function solveSkewb(pattern) {
  mustBeInsideWorker();
  const trembleSolver = await getCachedTrembleSolver4();
  const alg = await trembleSolver.solve(
    await resetCenterOrientation(pattern),
    TREMBLE_DEPTH3,
    (quantumMove) => quantumMove.family === "y" ? 4 : 3
    // TODO: Attach quantum move order lookup to puzzle.
  );
  return alg;
}
async function randomSkewbFixedCornerPattern() {
  return randomPatternFromSGS(
    await (await searchDynamicSideEvents).skewbKPuzzleWithoutMOCached(),
    await (await searchDynamicSideEvents).sgsDataSkewbFixedCorner()
  );
}
async function randomSkewbFixedCornerScramble() {
  return solveSkewb(await randomSkewbFixedCornerPattern());
}
var dynamicSq1Solver = from(() => import("./search-dynamic-solve-sq1-INOYNRSJ-676SIQV4.js"));
async function getRandomSquare1Scramble() {
  return Alg.fromString(
    await (await dynamicSq1Solver).getRandomSquare1ScrambleString()
  );
}
var IDLE_PREFETCH_TIMEOUT_MS = 1e3;
setIsInsideWorker(true);
var DEBUG_MEASURE_PERF = true;
function setDebugMeasurePerf(newDebugMeasurePerf) {
  DEBUG_MEASURE_PERF = newDebugMeasurePerf;
}
function now() {
  return (typeof performance === "undefined" ? Date : performance).now();
}
async function measurePerf(name, f, options) {
  if (!DEBUG_MEASURE_PERF) {
    return f();
  }
  const start = now();
  const result = f();
  if (result?.then) {
    await result;
  }
  const end = now();
  console.warn(
    `${name}${options?.isPrefetch ? " (prefetched)" : ""}: ${Math.round(
      end - start
    )}ms`
  );
  return result;
}
var prefetchPromises = /* @__PURE__ */ new Map();
var queuedPrefetchTimeoutID = null;
async function randomScrambleForEvent(eventID, options) {
  switch (eventID) {
    case "222":
    case "555":
    case "666":
    case "777":
    case "333fm":
    case "minx":
    case "pyram":
    case "555bf":
      return measurePerf(
        `wasmRandomScrambleForEvent(${JSON.stringify(eventID)})`,
        () => wasmRandomScrambleForEvent(eventID),
        {
          isPrefetch: options?.isPrefetch
        }
      );
    case "333":
    case "333oh":
    case "333ft":
      return measurePerf("random333Scramble", random333Scramble, {
        isPrefetch: options?.isPrefetch
      });
    case "333bf":
    case "333mbf":
      return measurePerf(
        "random333OrientedScramble",
        random333OrientedScramble
      );
    case "444":
      return measurePerf("random444Scramble", random444Scramble, {
        isPrefetch: options?.isPrefetch
      });
    case "444bf":
      return measurePerf(
        "random444OrientedScramble",
        random444OrientedScramble
      );
    case "skewb":
      return measurePerf(
        "randomSkewbFixedCornerScramble",
        randomSkewbFixedCornerScramble
      );
    case "sq1":
      return measurePerf("getRandomSquare1Scramble", getRandomSquare1Scramble, {
        isPrefetch: options?.isPrefetch
      });
    case "fto":
      return measurePerf("randomFTOScramble", randomFTOScramble, {
        isPrefetch: options?.isPrefetch
      });
    case "master_tetraminx":
      return measurePerf(
        "randomMasterTetraminxScramble",
        randomMasterTetraminxScramble
      );
    case "kilominx":
      return measurePerf("randomKilominxScramble", randomKilominxScramble, {
        isPrefetch: options?.isPrefetch
      });
    case "redi_cube":
      return measurePerf("randomRediCubeScramble", randomRediCubeScramble, {
        isPrefetch: options?.isPrefetch
      });
    default:
      throw new Error(`unsupported event: ${eventID}`);
  }
}
var currentPrefetchLevel = "auto";
var insideAPI = {
  initialize: async (eventID) => {
    switch (eventID) {
      case "222":
        return measurePerf("preInitialize222", preInitialize222);
      case "333":
      case "333oh":
      case "333ft":
        return measurePerf("initialize333", initialize333);
      case "444":
        return measurePerf("initialize444", initialize444);
      default:
        throw new Error(`unsupported event: ${eventID}`);
    }
  },
  setScramblePrefetchLevel(prefetchLevel) {
    currentPrefetchLevel = prefetchLevel;
  },
  randomScrambleForEvent: async (eventID) => {
    let promise = prefetchPromises.get(eventID);
    if (promise) {
      prefetchPromises.delete(eventID);
    } else {
      promise = randomScrambleForEvent(eventID);
    }
    if (currentPrefetchLevel !== "none") {
      promise.then(() => {
        if (queuedPrefetchTimeoutID) {
          clearTimeout(queuedPrefetchTimeoutID);
        }
        queuedPrefetchTimeoutID = setTimeout(
          () => {
            prefetchPromises.set(
              eventID,
              randomScrambleForEvent(eventID, {
                isPrefetch: true
              })
            );
          },
          currentPrefetchLevel === "immediate" ? 0 : IDLE_PREFETCH_TIMEOUT_MS
        );
      });
    }
    return promise;
  },
  randomScrambleStringForEvent: async (eventID) => {
    return (await insideAPI.randomScrambleForEvent(eventID)).toString();
  },
  solve333ToString: async (patternData) => {
    const pattern = new KPattern(await puzzles["3x3x3"].kpuzzle(), patternData);
    return (await solve333(pattern)).toString();
  },
  solve222ToString: async (patternData) => {
    const pattern = new KPattern(await puzzles["2x2x2"].kpuzzle(), patternData);
    return (await solve222HTMSubOptimal(pattern)).toString();
  },
  solveSkewbToString: async (patternData) => {
    const pattern = new KPattern(await puzzles["skewb"].kpuzzle(), patternData);
    return (await solveSkewb(pattern)).toString();
  },
  solvePyraminxToString: async (patternData) => {
    const pattern = new KPattern(
      await puzzles["pyraminx"].kpuzzle(),
      patternData
    );
    return (await solvePyraminx(pattern)).toString();
  },
  solveMegaminxToString: async (patternData) => {
    const pattern = new KPattern(
      await puzzles["megaminx"].kpuzzle(),
      patternData
    );
    return (await solveMegaminx(pattern)).toString();
  },
  setDebugMeasurePerf: async (measure) => {
    setDebugMeasurePerf(measure);
  },
  solveTwsearchToString: async (def, patternData, options) => {
    const kpuzzle = new KPuzzle(def);
    const pattern = new KPattern(kpuzzle, patternData);
    return (await wasmTwsearch(def, pattern, options)).toString();
  }
};

export {
  countMoves,
  countMetricMoves,
  countAnimatedLeaves,
  random333Scramble,
  insideAPI
};
//# sourceMappingURL=chunk-7N4DU3WZ.js.map
