import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __privateWrapper,
  __publicField
} from "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-GQ6KD2XI.js
var writeAlgDebugField = false;
var Comparable = class {
  is(c) {
    return this instanceof c;
  }
  as(c) {
    return this instanceof c ? this : null;
  }
};
var AlgCommon = class extends Comparable {
  constructor() {
    super();
    if (writeAlgDebugField) {
      Object.defineProperty(this, "_debugStr", {
        get: () => {
          return this.toString();
        }
      });
    }
  }
  get log() {
    return console.log.bind(console, this, this.toString());
  }
};
function toggleDirection(iterationDirection, flip = true) {
  if (!flip) {
    return iterationDirection;
  }
  switch (iterationDirection) {
    case 1:
      return -1;
    case -1:
      return 1;
  }
}
function direct(g, iterDir) {
  return iterDir === -1 ? Array.from(g).reverse() : g;
}
function reverse(g) {
  return Array.from(g).reverse();
}
function* directedGenerator(g, direction) {
  direction === -1 ? yield* reverseGenerator(g) : yield* g;
}
function* reverseGenerator(g) {
  for (const t of Array.from(g).reverse()) {
    yield t;
  }
}
var MAX_INT = 2147483647;
var MAX_INT_DESCRIPTION = "2^31 - 1";
var MIN_INT = -2147483648;
var _algNodes, _a;
var AlgBuilder = (_a = class {
  constructor() {
    __privateAdd(this, _algNodes, []);
  }
  push(u) {
    __privateGet(this, _algNodes).push(u);
  }
  // TODO: Allow FlexibleAlgSource?
  /** @deprecated */
  experimentalPushAlg(alg) {
    for (const u of alg.childAlgNodes()) {
      this.push(u);
    }
  }
  // TODO: can we guarantee this to be fast in the permanent API?
  experimentalNumAlgNodes() {
    return __privateGet(this, _algNodes).length;
  }
  // can be called multiple times, even if you push alg nodes inbetween.
  toAlg() {
    return new Alg(__privateGet(this, _algNodes));
  }
  reset() {
    __privateSet(this, _algNodes, []);
  }
}, _algNodes = new WeakMap(), _a);
var algDebugGlobals = {
  caretNISSNotationEnabled: true
};
var _A, _B, _a2;
var Commutator = (_a2 = class extends AlgCommon {
  constructor(aSource, bSource) {
    super();
    __privateAdd(this, _A, void 0);
    __privateAdd(this, _B, void 0);
    __privateSet(this, _A, experimentalEnsureAlg(aSource));
    __privateSet(this, _B, experimentalEnsureAlg(bSource));
  }
  get A() {
    return __privateGet(this, _A);
  }
  get B() {
    return __privateGet(this, _B);
  }
  isIdentical(other) {
    const otherAsCommutator = other.as(_a2);
    return !!(otherAsCommutator?.A.isIdentical(this.A) && otherAsCommutator?.B.isIdentical(this.B));
  }
  invert() {
    return new _a2(__privateGet(this, _B), __privateGet(this, _A));
  }
  *experimentalExpand(iterDir = 1, depth) {
    depth ?? (depth = Infinity);
    if (depth === 0) {
      yield iterDir === 1 ? this : this.invert();
    } else {
      if (iterDir === 1) {
        yield* this.A.experimentalExpand(
          1,
          depth - 1
        );
        yield* this.B.experimentalExpand(
          1,
          depth - 1
        );
        yield* this.A.experimentalExpand(
          -1,
          depth - 1
        );
        yield* this.B.experimentalExpand(
          -1,
          depth - 1
        );
      } else {
        yield* this.B.experimentalExpand(
          1,
          depth - 1
        );
        yield* this.A.experimentalExpand(
          1,
          depth - 1
        );
        yield* this.B.experimentalExpand(
          -1,
          depth - 1
        );
        yield* this.A.experimentalExpand(
          -1,
          depth - 1
        );
      }
    }
  }
  toString() {
    return `[${__privateGet(this, _A).toString()}, ${__privateGet(this, _B).toString()}]`;
  }
}, _A = new WeakMap(), _B = new WeakMap(), _a2);
var _A2, _B2, _a3;
var Conjugate = (_a3 = class extends AlgCommon {
  constructor(aSource, bSource) {
    super();
    __privateAdd(this, _A2, void 0);
    __privateAdd(this, _B2, void 0);
    __privateSet(this, _A2, experimentalEnsureAlg(aSource));
    __privateSet(this, _B2, experimentalEnsureAlg(bSource));
  }
  get A() {
    return __privateGet(this, _A2);
  }
  get B() {
    return __privateGet(this, _B2);
  }
  isIdentical(other) {
    const otherAsConjugate = other.as(_a3);
    return !!(otherAsConjugate?.A.isIdentical(this.A) && otherAsConjugate?.B.isIdentical(this.B));
  }
  invert() {
    return new _a3(__privateGet(this, _A2), __privateGet(this, _B2).invert());
  }
  *experimentalExpand(iterDir, depth) {
    depth ?? (depth = Infinity);
    if (depth === 0) {
      yield iterDir === 1 ? this : this.invert();
    } else {
      yield* this.A.experimentalExpand(1, depth - 1);
      yield* this.B.experimentalExpand(iterDir, depth - 1);
      yield* this.A.experimentalExpand(-1, depth - 1);
    }
  }
  toString() {
    return `[${this.A}: ${this.B}]`;
  }
}, _A2 = new WeakMap(), _B2 = new WeakMap(), _a3);
var _text, _a4;
var LineComment = (_a4 = class extends AlgCommon {
  constructor(commentText) {
    super();
    __privateAdd(this, _text, void 0);
    if (commentText.includes("\n") || commentText.includes("\r")) {
      throw new Error("LineComment cannot contain newline");
    }
    __privateSet(this, _text, commentText);
  }
  get text() {
    return __privateGet(this, _text);
  }
  isIdentical(other) {
    const otherAsLineComment = other;
    return other.is(_a4) && __privateGet(this, _text) === __privateGet(otherAsLineComment, _text);
  }
  invert() {
    return this;
  }
  *experimentalExpand(_iterDir = 1, _depth = Infinity) {
    yield this;
  }
  toString() {
    return `//${__privateGet(this, _text)}`;
  }
  // toJSON(): LineCommentJSON {
  //   return {
  //     type: "comment",
  //     text: this.#text,
  //   };
  // }
}, _text = new WeakMap(), _a4);
var Newline = class _Newline extends AlgCommon {
  toString() {
    return "\n";
  }
  isIdentical(other) {
    return other.is(_Newline);
  }
  invert() {
    return this;
  }
  *experimentalExpand(_iterDir = 1, _depth = Infinity) {
    yield this;
  }
};
var Pause = class _Pause extends AlgCommon {
  constructor() {
    super(...arguments);
    __publicField(this, "experimentalNISSGrouping");
  }
  // TODO: tie this to the alg
  toString() {
    return ".";
  }
  isIdentical(other) {
    return other.is(_Pause);
  }
  invert() {
    return this;
  }
  *experimentalExpand(_iterDir = 1, _depth = Infinity) {
    yield this;
  }
};
function parseIntWithEmptyFallback(n, emptyFallback) {
  return n ? parseInt(n) : emptyFallback;
}
var AMOUNT_REGEX = /^(\d+)?('?)/;
var MOVE_START_REGEX = /^[_\dA-Za-z]/;
var QUANTUM_MOVE_REGEX = /^((([1-9]\d*)-)?([1-9]\d*))?([_A-Za-z]+)/;
var COMMENT_TEXT_REGEX = /^[^\n]*/;
var SQUARE1_PAIR_START_REGEX = /^(-?\d+), ?/;
var SQUARE1_PAIR_END_REGEX = /^(-?\d+)\)/;
function parseAlg(s) {
  return new AlgParser().parseAlg(s);
}
function parseMove(s) {
  return new AlgParser().parseMove(s);
}
function parseQuantumMove(s) {
  return new AlgParser().parseQuantumMove(s);
}
function addCharIndices(t, startCharIndex, endCharIndex) {
  const parsedT = t;
  parsedT.startCharIndex = startCharIndex;
  parsedT.endCharIndex = endCharIndex;
  return parsedT;
}
function transferCharIndex(from, to) {
  if ("startCharIndex" in from) {
    to.startCharIndex = from.startCharIndex;
  }
  if ("endCharIndex" in from) {
    to.endCharIndex = from.endCharIndex;
  }
  return to;
}
var _input, _idx, _nissQueue, _a5;
var AlgParser = (_a5 = class {
  constructor() {
    __privateAdd(this, _input, "");
    __privateAdd(this, _idx, 0);
    __privateAdd(this, _nissQueue, []);
  }
  parseAlg(input) {
    __privateSet(this, _input, input);
    __privateSet(this, _idx, 0);
    const alg = this.parseAlgWithStopping([]);
    this.mustBeAtEndOfInput();
    const algNodes = Array.from(alg.childAlgNodes());
    if (__privateGet(this, _nissQueue).length > 0) {
      for (const nissGrouping of __privateGet(this, _nissQueue).reverse()) {
        algNodes.push(nissGrouping);
      }
    }
    const newAlg = new Alg(algNodes);
    const { startCharIndex, endCharIndex } = alg;
    addCharIndices(newAlg, startCharIndex, endCharIndex);
    return newAlg;
  }
  parseMove(input) {
    __privateSet(this, _input, input);
    __privateSet(this, _idx, 0);
    const move = this.parseMoveImpl();
    this.mustBeAtEndOfInput();
    return move;
  }
  parseQuantumMove(input) {
    __privateSet(this, _input, input);
    __privateSet(this, _idx, 0);
    const quantumMove = this.parseQuantumMoveImpl();
    this.mustBeAtEndOfInput();
    return quantumMove;
  }
  mustBeAtEndOfInput() {
    if (__privateGet(this, _idx) !== __privateGet(this, _input).length) {
      throw new Error("parsing unexpectedly ended early");
    }
  }
  parseAlgWithStopping(stopBefore) {
    let algStartIdx = __privateGet(this, _idx);
    let algEndIdx = __privateGet(this, _idx);
    const algBuilder = new AlgBuilder();
    let crowded = false;
    const mustNotBeCrowded = (idx) => {
      if (crowded) {
        throw new Error(
          `Unexpected character at index ${idx}. Are you missing a space?`
        );
      }
    };
    mainLoop:
      while (__privateGet(this, _idx) < __privateGet(this, _input).length) {
        const savedCharIndex = __privateGet(this, _idx);
        if (stopBefore.includes(__privateGet(this, _input)[__privateGet(this, _idx)])) {
          return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
        }
        if (this.tryConsumeNext(" ")) {
          crowded = false;
          if (algBuilder.experimentalNumAlgNodes() === 0) {
            algStartIdx = __privateGet(this, _idx);
          }
          continue mainLoop;
        } else if (MOVE_START_REGEX.test(__privateGet(this, _input)[__privateGet(this, _idx)])) {
          mustNotBeCrowded(savedCharIndex);
          const move = this.parseMoveImpl();
          algBuilder.push(move);
          crowded = true;
          algEndIdx = __privateGet(this, _idx);
          continue mainLoop;
        } else if (this.tryConsumeNext("(")) {
          mustNotBeCrowded(savedCharIndex);
          const sq1PairStartMatch = this.tryRegex(SQUARE1_PAIR_START_REGEX);
          if (sq1PairStartMatch) {
            const topAmountString = sq1PairStartMatch[1];
            const savedCharIndexD = __privateGet(this, _idx);
            const sq1PairEndMatch = this.parseRegex(SQUARE1_PAIR_END_REGEX);
            const uMove = addCharIndices(
              new Move(new QuantumMove("U_SQ_"), parseInt(topAmountString)),
              savedCharIndex + 1,
              savedCharIndex + 1 + topAmountString.length
            );
            const dMove = addCharIndices(
              new Move(new QuantumMove("D_SQ_"), parseInt(sq1PairEndMatch[1])),
              savedCharIndexD,
              __privateGet(this, _idx) - 1
            );
            const alg = addCharIndices(
              new Alg([uMove, dMove]),
              savedCharIndex + 1,
              __privateGet(this, _idx) - 1
            );
            algBuilder.push(
              addCharIndices(new Grouping(alg), savedCharIndex, __privateGet(this, _idx))
            );
            crowded = true;
            algEndIdx = __privateGet(this, _idx);
            continue mainLoop;
          } else {
            const alg = this.parseAlgWithStopping([")"]);
            this.mustConsumeNext(")");
            const amount = this.parseAmount();
            algBuilder.push(
              addCharIndices(
                new Grouping(alg, amount),
                savedCharIndex,
                __privateGet(this, _idx)
              )
            );
            crowded = true;
            algEndIdx = __privateGet(this, _idx);
            continue mainLoop;
          }
        } else if (this.tryConsumeNext("^")) {
          if (!algDebugGlobals.caretNISSNotationEnabled) {
            throw new Error(
              "Alg contained a caret but caret NISS notation is not enabled."
            );
          }
          this.mustConsumeNext("(");
          const alg = this.parseAlgWithStopping([")"]);
          this.popNext();
          const grouping = new Grouping(alg, -1);
          const placeholder = new Pause();
          grouping.experimentalNISSPlaceholder = placeholder;
          placeholder.experimentalNISSGrouping = grouping;
          __privateGet(this, _nissQueue).push(grouping);
          algBuilder.push(placeholder);
        } else if (this.tryConsumeNext("[")) {
          mustNotBeCrowded(savedCharIndex);
          const A = this.parseAlgWithStopping([",", ":"]);
          const separator = this.popNext();
          const B = this.parseAlgWithStopping(["]"]);
          this.mustConsumeNext("]");
          let unrepeated;
          switch (separator) {
            case ":": {
              unrepeated = addCharIndices(
                new Conjugate(A, B),
                savedCharIndex,
                __privateGet(this, _idx)
              );
              crowded = true;
              algEndIdx = __privateGet(this, _idx);
              break;
            }
            case ",": {
              unrepeated = addCharIndices(
                new Commutator(A, B),
                savedCharIndex,
                __privateGet(this, _idx)
              );
              crowded = true;
              algEndIdx = __privateGet(this, _idx);
              break;
            }
            default:
              throw new Error("unexpected parsing error");
          }
          const afterClosingBracketIdx = __privateGet(this, _idx);
          const amount = this.parseAmount();
          if (amount === 1) {
            algBuilder.push(unrepeated);
          } else {
            const unrepeatedAlg = addCharIndices(
              new Alg([unrepeated]),
              savedCharIndex,
              afterClosingBracketIdx
            );
            const grouping = addCharIndices(
              new Grouping(unrepeatedAlg, amount),
              savedCharIndex,
              __privateGet(this, _idx)
            );
            algBuilder.push(grouping);
          }
          crowded = true;
          algEndIdx = __privateGet(this, _idx);
          continue mainLoop;
        } else if (this.tryConsumeNext("\n")) {
          algBuilder.push(
            addCharIndices(new Newline(), savedCharIndex, __privateGet(this, _idx))
          );
          crowded = false;
          algEndIdx = __privateGet(this, _idx);
          continue mainLoop;
        } else if (this.tryConsumeNext("/")) {
          if (this.tryConsumeNext("/")) {
            mustNotBeCrowded(savedCharIndex);
            const [text] = this.parseRegex(COMMENT_TEXT_REGEX);
            algBuilder.push(
              addCharIndices(new LineComment(text), savedCharIndex, __privateGet(this, _idx))
            );
            crowded = false;
            algEndIdx = __privateGet(this, _idx);
            continue mainLoop;
          } else {
            algBuilder.push(
              addCharIndices(new Move("_SLASH_"), savedCharIndex, __privateGet(this, _idx))
            );
            crowded = true;
            algEndIdx = __privateGet(this, _idx);
            continue mainLoop;
          }
        } else if (this.tryConsumeNext(".")) {
          mustNotBeCrowded(savedCharIndex);
          algBuilder.push(addCharIndices(new Pause(), savedCharIndex, __privateGet(this, _idx)));
          crowded = true;
          algEndIdx = __privateGet(this, _idx);
          continue mainLoop;
        } else {
          throw new Error(`Unexpected character: ${this.popNext()}`);
        }
      }
    if (__privateGet(this, _idx) !== __privateGet(this, _input).length) {
      throw new Error("did not finish parsing?");
    }
    if (stopBefore.length > 0) {
      throw new Error("expected stopping");
    }
    return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
  }
  parseQuantumMoveImpl() {
    const [, , , outerLayerStr, innerLayerStr, family] = this.parseRegex(QUANTUM_MOVE_REGEX);
    return new QuantumMove(
      family,
      parseIntWithEmptyFallback(innerLayerStr, void 0),
      parseIntWithEmptyFallback(outerLayerStr, void 0)
    );
  }
  parseMoveImpl() {
    const savedCharIndex = __privateGet(this, _idx);
    if (this.tryConsumeNext("/")) {
      return addCharIndices(new Move("_SLASH_"), savedCharIndex, __privateGet(this, _idx));
    }
    let quantumMove = this.parseQuantumMoveImpl();
    let [amount, hadEmptyAbsAmount] = this.parseAmountAndTrackEmptyAbsAmount();
    const suffix = this.parseMoveSuffix();
    if (suffix) {
      if (amount < 0) {
        throw new Error("uh-oh");
      }
      if ((suffix === "++" || suffix === "--") && amount !== 1) {
        throw new Error(
          "Pochmann ++ or -- moves cannot have an amount other than 1."
        );
      }
      if ((suffix === "++" || suffix === "--") && !hadEmptyAbsAmount) {
        throw new Error(
          "Pochmann ++ or -- moves cannot have an amount written as a number."
        );
      }
      if ((suffix === "+" || suffix === "-") && hadEmptyAbsAmount) {
        throw new Error(
          "Clock dial moves must have an amount written as a natural number followed by + or -."
        );
      }
      if (suffix.startsWith("+")) {
        quantumMove = quantumMove.modified({
          family: `${quantumMove.family}_${suffix === "+" ? "PLUS" : "PLUSPLUS"}_`
          // TODO
        });
      }
      if (suffix.startsWith("-")) {
        quantumMove = quantumMove.modified({
          family: `${quantumMove.family}_${suffix === "-" ? "PLUS" : "PLUSPLUS"}_`
          // TODO
        });
        amount *= -1;
      }
    }
    const move = addCharIndices(
      new Move(quantumMove, amount),
      savedCharIndex,
      __privateGet(this, _idx)
    );
    return move;
  }
  parseMoveSuffix() {
    if (this.tryConsumeNext("+")) {
      if (this.tryConsumeNext("+")) {
        return "++";
      }
      return "+";
    }
    if (this.tryConsumeNext("-")) {
      if (this.tryConsumeNext("-")) {
        return "--";
      }
      return "-";
    }
    return null;
  }
  parseAmountAndTrackEmptyAbsAmount() {
    const savedIdx = __privateGet(this, _idx);
    const [, absAmountStr, primeStr] = this.parseRegex(AMOUNT_REGEX);
    if (absAmountStr?.startsWith("0") && absAmountStr !== "0") {
      throw new Error(
        `Error at char index ${savedIdx}: An amount can only start with 0 if it's exactly the digit 0.`
      );
    }
    return [
      parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1),
      !absAmountStr
    ];
  }
  parseAmount() {
    const savedIdx = __privateGet(this, _idx);
    const [, absAmountStr, primeStr] = this.parseRegex(AMOUNT_REGEX);
    if (absAmountStr?.startsWith("0") && absAmountStr !== "0") {
      throw new Error(
        `Error at char index ${savedIdx}: An amount number can only start with 0 if it's exactly the digit 0.`
      );
    }
    return parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1);
  }
  parseRegex(regex) {
    const arr = regex.exec(this.remaining());
    if (arr === null) {
      throw new Error("internal parsing error");
    }
    __privateSet(this, _idx, __privateGet(this, _idx) + arr[0].length);
    return arr;
  }
  // TOD: can we avoid this?
  tryRegex(regex) {
    const arr = regex.exec(this.remaining());
    if (arr === null) {
      return null;
    }
    __privateSet(this, _idx, __privateGet(this, _idx) + arr[0].length);
    return arr;
  }
  remaining() {
    return __privateGet(this, _input).slice(__privateGet(this, _idx));
  }
  popNext() {
    const next = __privateGet(this, _input)[__privateGet(this, _idx)];
    __privateWrapper(this, _idx)._++;
    return next;
  }
  tryConsumeNext(expected) {
    if (__privateGet(this, _input)[__privateGet(this, _idx)] === expected) {
      __privateWrapper(this, _idx)._++;
      return true;
    }
    return false;
  }
  mustConsumeNext(expected) {
    const next = this.popNext();
    if (next !== expected) {
      throw new Error(
        `expected \`${expected}\` while parsing, encountered ${next}`
      );
    }
    return next;
  }
}, _input = new WeakMap(), _idx = new WeakMap(), _nissQueue = new WeakMap(), _a5);
var warned = /* @__PURE__ */ new Set();
function warnOnce(s) {
  if (!warned.has(s)) {
    console.warn(s);
    warned.add(s);
  }
}
var QuantumWithAmount = class {
  constructor(quantum, amount = 1) {
    __publicField(this, "quantum");
    __publicField(this, "amount");
    this.quantum = quantum;
    this.amount = amount;
    if (!Number.isInteger(this.amount) || this.amount < MIN_INT || this.amount > MAX_INT) {
      throw new Error(
        `AlgNode amount absolute value must be a non-negative integer below ${MAX_INT_DESCRIPTION}.`
      );
    }
  }
  suffix() {
    let s = "";
    const absAmount = Math.abs(this.amount);
    if (absAmount !== 1) {
      s += absAmount;
    }
    if (this.amount < 0) {
      s += "'";
    }
    return s;
  }
  isIdentical(other) {
    return this.quantum.isIdentical(other.quantum) && this.amount === other.amount;
  }
  // TODO: `Conjugate` and `Commutator` decrement `depth` inside the quantum, `Grouping` has to do it outside the quantum.
  *experimentalExpand(iterDir, depth) {
    const absAmount = Math.abs(this.amount);
    const newIterDir = toggleDirection(iterDir, this.amount < 0);
    for (let i = 0; i < absAmount; i++) {
      yield* this.quantum.experimentalExpand(newIterDir, depth);
    }
  }
};
var _family, _innerLayer, _outerLayer, _a6;
var QuantumMove = (_a6 = class extends Comparable {
  constructor(family, innerLayer, outerLayer) {
    super();
    __privateAdd(this, _family, void 0);
    __privateAdd(this, _innerLayer, void 0);
    __privateAdd(this, _outerLayer, void 0);
    __privateSet(this, _family, family);
    __privateSet(this, _innerLayer, innerLayer ?? null);
    __privateSet(this, _outerLayer, outerLayer ?? null);
    Object.freeze(this);
    if (__privateGet(this, _innerLayer) !== null && (!Number.isInteger(__privateGet(this, _innerLayer)) || __privateGet(this, _innerLayer) < 1 || __privateGet(this, _innerLayer) > MAX_INT)) {
      throw new Error(
        `QuantumMove inner layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`
      );
    }
    if (__privateGet(this, _outerLayer) !== null && (!Number.isInteger(__privateGet(this, _outerLayer)) || __privateGet(this, _outerLayer) < 1 || __privateGet(this, _outerLayer) > MAX_INT)) {
      throw new Error(
        `QuantumMove outer layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`
      );
    }
    if (__privateGet(this, _outerLayer) !== null && __privateGet(this, _innerLayer) !== null && __privateGet(this, _innerLayer) <= __privateGet(this, _outerLayer)) {
      throw new Error(
        "QuantumMove outer layer must be smaller than inner layer."
      );
    }
    if (__privateGet(this, _outerLayer) !== null && __privateGet(this, _innerLayer) === null) {
      throw new Error(
        "QuantumMove with an outer layer must have an inner layer"
      );
    }
  }
  static fromString(s) {
    return parseQuantumMove(s);
  }
  // TODO: `modify`?
  modified(modifications) {
    return new _a6(
      modifications.family ?? __privateGet(this, _family),
      modifications.innerLayer ?? __privateGet(this, _innerLayer),
      modifications.outerLayer ?? __privateGet(this, _outerLayer)
    );
  }
  isIdentical(other) {
    const otherAsQuantumMove = other;
    return other.is(_a6) && __privateGet(this, _family) === __privateGet(otherAsQuantumMove, _family) && __privateGet(this, _innerLayer) === __privateGet(otherAsQuantumMove, _innerLayer) && __privateGet(this, _outerLayer) === __privateGet(otherAsQuantumMove, _outerLayer);
  }
  // TODO: provide something more useful on average.
  /** @deprecated */
  get family() {
    return __privateGet(this, _family);
  }
  // TODO: provide something more useful on average.
  /** @deprecated */
  get outerLayer() {
    return __privateGet(this, _outerLayer);
  }
  // TODO: provide something more useful on average.
  /** @deprecated */
  get innerLayer() {
    return __privateGet(this, _innerLayer);
  }
  experimentalExpand() {
    throw new Error(
      "experimentalExpand() cannot be called on a `QuantumMove` directly."
    );
  }
  toString() {
    let s = __privateGet(this, _family);
    if (__privateGet(this, _innerLayer) !== null) {
      s = String(__privateGet(this, _innerLayer)) + s;
      if (__privateGet(this, _outerLayer) !== null) {
        s = `${String(__privateGet(this, _outerLayer))}-${s}`;
      }
    }
    return s;
  }
}, _family = new WeakMap(), _innerLayer = new WeakMap(), _outerLayer = new WeakMap(), _a6);
var _quantumWithAmount, _a7;
var Move = (_a7 = class extends AlgCommon {
  constructor(...args) {
    super();
    __privateAdd(this, _quantumWithAmount, void 0);
    if (typeof args[0] === "string") {
      if (args[1] ?? null) {
        __privateSet(this, _quantumWithAmount, new QuantumWithAmount(
          QuantumMove.fromString(args[0]),
          args[1]
        ));
        return;
      } else {
        return _a7.fromString(args[0]);
      }
    }
    __privateSet(this, _quantumWithAmount, new QuantumWithAmount(
      args[0],
      args[1]
    ));
  }
  isIdentical(other) {
    const otherAsMove = other.as(_a7);
    return !!otherAsMove && __privateGet(this, _quantumWithAmount).isIdentical(__privateGet(otherAsMove, _quantumWithAmount));
  }
  invert() {
    return transferCharIndex(
      this,
      new _a7(__privateGet(this, _quantumWithAmount).quantum, -this.amount)
    );
  }
  *experimentalExpand(iterDir = 1) {
    if (iterDir === 1) {
      yield this;
    } else {
      yield this.modified({
        amount: -this.amount
      });
    }
  }
  get quantum() {
    return __privateGet(this, _quantumWithAmount).quantum;
  }
  // TODO: `modify`?
  modified(modifications) {
    return new _a7(
      __privateGet(this, _quantumWithAmount).quantum.modified(modifications),
      modifications.amount ?? this.amount
    );
  }
  static fromString(s) {
    return parseMove(s);
  }
  get amount() {
    return __privateGet(this, _quantumWithAmount).amount;
  }
  /** @deprecated */
  get type() {
    warnOnce("deprecated: type");
    return "blockMove";
  }
  /** @deprecated */
  get family() {
    return __privateGet(this, _quantumWithAmount).quantum.family ?? void 0;
  }
  /** @deprecated */
  get outerLayer() {
    return __privateGet(this, _quantumWithAmount).quantum.outerLayer ?? void 0;
  }
  /** @deprecated */
  get innerLayer() {
    return __privateGet(this, _quantumWithAmount).quantum.innerLayer ?? void 0;
  }
  toString() {
    if (this.family === "_SLASH_") {
      return "/";
    }
    if (this.family.endsWith("_PLUS_")) {
      return __privateGet(this, _quantumWithAmount).quantum.toString().slice(0, -6) + Math.abs(this.amount) + (this.amount < 0 ? "-" : "+");
    }
    if (this.family.endsWith("_PLUSPLUS_")) {
      const absAmount = Math.abs(this.amount);
      return __privateGet(this, _quantumWithAmount).quantum.toString().slice(0, -10) + (absAmount === 1 ? "" : absAmount) + (this.amount < 0 ? "--" : "++");
    }
    return __privateGet(this, _quantumWithAmount).quantum.toString() + __privateGet(this, _quantumWithAmount).suffix();
  }
  // // TODO: Serialize as a string?
  // toJSON(): MoveJSON {
  //   return {
  //     type: "move",
  //     family: this.family,
  //     innerLayer: this.innerLayer,
  //     outerLayer: this.outerLayer,
  //   };
  // }
}, _quantumWithAmount = new WeakMap(), _a7);
var Square1TupleFormatter = class {
  constructor() {
    __publicField(this, "quantumU_SQ_", null);
    __publicField(this, "quantumD_SQ_", null);
  }
  format(grouping) {
    if (grouping.amount !== 1) {
      return null;
    }
    const amounts = this.tuple(grouping);
    if (!amounts) {
      return null;
    }
    return `(${amounts.map((move) => move.amount).join(", ")})`;
  }
  tuple(grouping) {
    if (grouping.amount !== 1) {
      return null;
    }
    this.quantumU_SQ_ || (this.quantumU_SQ_ = new QuantumMove("U_SQ_"));
    this.quantumD_SQ_ || (this.quantumD_SQ_ = new QuantumMove("D_SQ_"));
    const quantumAlg = grouping.alg;
    if (quantumAlg.experimentalNumChildAlgNodes() === 2) {
      const [U, D] = quantumAlg.childAlgNodes();
      if (U.as(Move)?.quantum.isIdentical(this.quantumU_SQ_) && D.as(Move)?.quantum.isIdentical(this.quantumD_SQ_)) {
        return [U, D];
      }
    }
    return null;
  }
};
var square1TupleFormatterInstance = new Square1TupleFormatter();
var _quantumWithAmount2, _unrepeatedString, unrepeatedString_fn, _a8;
var Grouping = (_a8 = class extends AlgCommon {
  // TODO: tie this to the alg
  constructor(algSource, amount) {
    super();
    __privateAdd(this, _unrepeatedString);
    __privateAdd(this, _quantumWithAmount2, void 0);
    __publicField(this, "experimentalNISSPlaceholder");
    const alg = experimentalEnsureAlg(algSource);
    __privateSet(this, _quantumWithAmount2, new QuantumWithAmount(alg, amount));
  }
  isIdentical(other) {
    const otherAsGrouping = other;
    return other.is(_a8) && __privateGet(this, _quantumWithAmount2).isIdentical(__privateGet(otherAsGrouping, _quantumWithAmount2));
  }
  get alg() {
    return __privateGet(this, _quantumWithAmount2).quantum;
  }
  get amount() {
    return __privateGet(this, _quantumWithAmount2).amount;
  }
  /** @deprecated */
  get experimentalRepetitionSuffix() {
    return __privateGet(this, _quantumWithAmount2).suffix();
  }
  invert() {
    const amounts = square1TupleFormatterInstance.tuple(this);
    if (amounts) {
      const [moveU, moveD] = amounts;
      return new _a8(new Alg([moveU.invert(), moveD.invert()]));
    }
    return new _a8(
      __privateGet(this, _quantumWithAmount2).quantum,
      -__privateGet(this, _quantumWithAmount2).amount
    );
  }
  *experimentalExpand(iterDir = 1, depth) {
    depth ?? (depth = Infinity);
    if (depth === 0) {
      yield iterDir === 1 ? this : this.invert();
    } else {
      yield* __privateGet(this, _quantumWithAmount2).experimentalExpand(iterDir, depth - 1);
    }
  }
  static fromString() {
    throw new Error("unimplemented");
  }
  toString() {
    return square1TupleFormatterInstance.format(this) ?? `${__privateMethod(this, _unrepeatedString, unrepeatedString_fn).call(this)}${__privateGet(this, _quantumWithAmount2).suffix()}`;
  }
  experimentalAsSquare1Tuple() {
    return square1TupleFormatterInstance.tuple(this);
  }
  // toJSON(): GroupingJSON {
  //   return {
  //     type: "grouping",
  //     alg: this.#quanta.quantum.toJSON(),
  //   };
  // }
}, _quantumWithAmount2 = new WeakMap(), _unrepeatedString = new WeakSet(), unrepeatedString_fn = function() {
  const insideString = __privateGet(this, _quantumWithAmount2).quantum.toString();
  const iter = this.alg.childAlgNodes();
  const { value } = iter.next();
  if (iter.next().done && (value?.is(Commutator) || value?.is(Conjugate))) {
    return insideString;
  }
  return `(${insideString})`;
}, _a8);
function experimentalIs(v, c) {
  return v instanceof c;
}
function experimentalIsAlgNode(v) {
  return experimentalIs(v, Grouping) || experimentalIs(v, LineComment) || experimentalIs(v, Commutator) || experimentalIs(v, Conjugate) || experimentalIs(v, Move) || experimentalIs(v, Newline) || experimentalIs(v, Pause);
}
function dispatch(t, algNode, dataDown) {
  if (algNode.is(Grouping)) {
    return t.traverseGrouping(algNode, dataDown);
  }
  if (algNode.is(Move)) {
    return t.traverseMove(algNode, dataDown);
  }
  if (algNode.is(Commutator)) {
    return t.traverseCommutator(algNode, dataDown);
  }
  if (algNode.is(Conjugate)) {
    return t.traverseConjugate(algNode, dataDown);
  }
  if (algNode.is(Pause)) {
    return t.traversePause(algNode, dataDown);
  }
  if (algNode.is(Newline)) {
    return t.traverseNewline(algNode, dataDown);
  }
  if (algNode.is(LineComment)) {
    return t.traverseLineComment(algNode, dataDown);
  }
  throw new Error("unknown AlgNode");
}
function mustBeAlgNode(t) {
  if (t.is(Grouping) || t.is(Move) || t.is(Commutator) || t.is(Conjugate) || t.is(Pause) || t.is(Newline) || t.is(LineComment)) {
    return t;
  }
  throw new Error("internal error: expected AlgNode");
}
var TraversalDownUp = class {
  // Immediate subclasses should overwrite this.
  traverseAlgNode(algNode, dataDown) {
    return dispatch(this, algNode, dataDown);
  }
  traverseIntoAlgNode(algNode, dataDown) {
    return mustBeAlgNode(this.traverseAlgNode(algNode, dataDown));
  }
};
var TraversalUp = class extends TraversalDownUp {
  traverseAlgNode(algNode) {
    return dispatch(
      this,
      algNode,
      void 0
    );
  }
  traverseIntoAlgNode(algNode) {
    return mustBeAlgNode(this.traverseAlgNode(algNode));
  }
};
function functionFromTraversal(traversalConstructor, constructorArgs) {
  const instance = new traversalConstructor(
    ...constructorArgs ?? []
  );
  return instance.traverseAlg.bind(instance);
}
var DEFAULT_DIRECTIONAL = "any-direction";
var AppendOptionsHelper = class {
  constructor(config = {}) {
    this.config = config;
  }
  cancelQuantum() {
    const { cancel } = this.config;
    if (cancel === true) {
      return DEFAULT_DIRECTIONAL;
    }
    if (cancel === false) {
      return "none";
    }
    return cancel?.directional ?? "none";
  }
  cancelAny() {
    return this.config.cancel && this.cancelQuantum() !== "none";
  }
  cancelPuzzleSpecificModWrap() {
    const { cancel } = this.config;
    if (cancel === true || cancel === false) {
      return "canonical-centered";
    }
    if (cancel?.puzzleSpecificModWrap) {
      return cancel?.puzzleSpecificModWrap;
    }
    return cancel?.directional === "same-direction" ? "preserve-sign" : "canonical-centered";
  }
  puzzleSpecificSimplifyOptions() {
    return this.config.puzzleLoader?.puzzleSpecificSimplifyOptions ?? this.config.puzzleSpecificSimplifyOptions;
  }
};
function areSameDirection(direction, move2) {
  return direction * Math.sign(move2.amount) >= 0;
}
function offsetMod(x, positiveMod, offset = 0) {
  return ((x - offset) % positiveMod + positiveMod) % positiveMod + offset;
}
function experimentalAppendMove(alg, addedMove, options) {
  const optionsHelper = new AppendOptionsHelper(options);
  const outputPrefix = Array.from(alg.childAlgNodes());
  let outputSuffix = [addedMove];
  function output() {
    return new Alg([...outputPrefix, ...outputSuffix]);
  }
  function modMove(move) {
    if (optionsHelper.cancelPuzzleSpecificModWrap() === "none") {
      return move;
    }
    const quantumMoveOrder = optionsHelper.puzzleSpecificSimplifyOptions()?.quantumMoveOrder;
    if (!quantumMoveOrder) {
      return move;
    }
    const mod = quantumMoveOrder(addedMove.quantum);
    let offset;
    switch (optionsHelper.cancelPuzzleSpecificModWrap()) {
      case "gravity": {
        offset = -Math.floor((mod - (move.amount < 0 ? 0 : 1)) / 2);
        break;
      }
      case "canonical-centered": {
        offset = -Math.floor((mod - 1) / 2);
        break;
      }
      case "canonical-positive": {
        offset = 0;
        break;
      }
      case "preserve-sign": {
        offset = move.amount < 0 ? 1 - mod : 0;
        break;
      }
      default: {
        throw new Error("Unknown mod wrap");
      }
    }
    const offsetAmount = offsetMod(move.amount, mod, offset);
    return move.modified({ amount: offsetAmount });
  }
  if (optionsHelper.cancelAny()) {
    let canCancelMoveBasedOnQuantum;
    const axis = optionsHelper.puzzleSpecificSimplifyOptions()?.axis;
    if (axis) {
      canCancelMoveBasedOnQuantum = (move) => axis.areQuantumMovesSameAxis(addedMove.quantum, move.quantum);
    } else {
      const newMoveQuantumString = addedMove.quantum.toString();
      canCancelMoveBasedOnQuantum = (move) => move.quantum.toString() === newMoveQuantumString;
    }
    const sameDirectionOnly = optionsHelper.cancelQuantum() === "same-direction";
    const quantumDirections = /* @__PURE__ */ new Map();
    quantumDirections.set(
      addedMove.quantum.toString(),
      Math.sign(addedMove.amount)
    );
    let i;
    for (i = outputPrefix.length - 1; i >= 0; i--) {
      const move = outputPrefix[i].as(Move);
      if (!move) {
        break;
      }
      if (!canCancelMoveBasedOnQuantum(move)) {
        break;
      }
      const quantumKey = move.quantum.toString();
      if (sameDirectionOnly) {
        const existingQuantumDirectionOnAxis = quantumDirections.get(quantumKey);
        if (existingQuantumDirectionOnAxis && // Short-circuits, but that's actually okay here.
        !areSameDirection(existingQuantumDirectionOnAxis, move)) {
          break;
        }
        quantumDirections.set(quantumKey, Math.sign(move.amount));
      }
    }
    const suffix = [...outputPrefix.splice(i + 1), addedMove];
    if (axis) {
      outputSuffix = axis.simplifySameAxisMoves(
        suffix,
        optionsHelper.cancelPuzzleSpecificModWrap() !== "none"
      );
    } else {
      const amount = suffix.reduce(
        (sum, move) => sum + move.amount,
        0
      );
      if (quantumDirections.size !== 1) {
        throw new Error(
          "Internal error: multiple quantums when one was expected"
        );
      }
      outputSuffix = [new Move(addedMove.quantum, amount)];
    }
  }
  outputSuffix = outputSuffix.map((m) => modMove(m)).filter((move) => move.amount !== 0);
  return output();
}
function experimentalAppendNode(alg, leaf, options) {
  const maybeMove = leaf.as(Move);
  if (maybeMove) {
    return experimentalAppendMove(alg, maybeMove, options);
  } else {
    return new Alg([...alg.childAlgNodes(), leaf]);
  }
}
var _newPlaceholderAssociationsMap, _newPlaceholderAssociations, newPlaceholderAssociations_fn, _descendOptions, descendOptions_fn, _doChildrenCommute, doChildrenCommute_fn, _a9;
var Simplify = (_a9 = class extends TraversalDownUp {
  constructor() {
    super(...arguments);
    __privateAdd(this, _newPlaceholderAssociations);
    // TODO: avoid allocations?
    __privateAdd(this, _descendOptions);
    __privateAdd(this, _doChildrenCommute);
    __privateAdd(this, _newPlaceholderAssociationsMap, void 0);
  }
  // TODO: Handle
  *traverseAlg(alg, options) {
    if (options.depth === 0) {
      yield* alg.childAlgNodes();
      return;
    }
    let output = [];
    const newOptions = __privateMethod(this, _descendOptions, descendOptions_fn).call(this, options);
    for (const algNode of alg.childAlgNodes()) {
      for (const traversedNode of this.traverseAlgNode(algNode, newOptions)) {
        output = Array.from(
          experimentalAppendNode(
            new Alg(output),
            traversedNode,
            newOptions
          ).childAlgNodes()
        );
      }
    }
    for (const newAlgNode of output) {
      yield newAlgNode;
    }
  }
  *traverseGrouping(grouping, options) {
    if (options.depth === 0) {
      yield grouping;
      return;
    }
    if (grouping.amount === 0) {
      return;
    }
    const newGrouping = new Grouping(
      this.traverseAlg(grouping.alg, __privateMethod(this, _descendOptions, descendOptions_fn).call(this, options)),
      grouping.amount
    );
    if (newGrouping.alg.experimentalIsEmpty()) {
      return;
    }
    const newPlaceholder = __privateMethod(this, _newPlaceholderAssociations, newPlaceholderAssociations_fn).call(this).get(grouping);
    if (newPlaceholder) {
      newGrouping.experimentalNISSPlaceholder = newPlaceholder;
      newPlaceholder.experimentalNISSGrouping = newGrouping;
    }
    yield newGrouping;
  }
  *traverseMove(move, _options) {
    yield move;
  }
  *traverseCommutator(commutator, options) {
    if (options.depth === 0) {
      yield commutator;
      return;
    }
    const newOptions = __privateMethod(this, _descendOptions, descendOptions_fn).call(this, options);
    const newCommutator = new Commutator(
      this.traverseAlg(commutator.A, newOptions),
      this.traverseAlg(commutator.B, newOptions)
    );
    if (newCommutator.A.experimentalIsEmpty() || newCommutator.B.experimentalIsEmpty() || newCommutator.A.isIdentical(newCommutator.B) || newCommutator.A.isIdentical(newCommutator.B.invert()) || __privateMethod(this, _doChildrenCommute, doChildrenCommute_fn).call(this, newCommutator.A, newCommutator.B, options)) {
      return;
    }
    yield newCommutator;
  }
  *traverseConjugate(conjugate, options) {
    if (options.depth === 0) {
      yield conjugate;
      return;
    }
    const newOptions = __privateMethod(this, _descendOptions, descendOptions_fn).call(this, options);
    const newConjugate = new Conjugate(
      this.traverseAlg(conjugate.A, newOptions),
      this.traverseAlg(conjugate.B, newOptions)
    );
    if (newConjugate.B.experimentalIsEmpty()) {
      return;
    }
    if (newConjugate.A.experimentalIsEmpty() || newConjugate.A.isIdentical(newConjugate.B) || newConjugate.A.isIdentical(newConjugate.B.invert()) || __privateMethod(this, _doChildrenCommute, doChildrenCommute_fn).call(this, newConjugate.A, newConjugate.B, options)) {
      yield* conjugate.B.childAlgNodes();
      return;
    }
    yield newConjugate;
  }
  *traversePause(pause, _options) {
    if (pause.experimentalNISSGrouping) {
      const newPause = new Pause();
      __privateMethod(this, _newPlaceholderAssociations, newPlaceholderAssociations_fn).call(this).set(
        pause.experimentalNISSGrouping,
        newPause
      );
      yield newPause;
    } else {
      yield pause;
    }
  }
  *traverseNewline(newline, _options) {
    yield newline;
  }
  *traverseLineComment(comment, _options) {
    yield comment;
  }
}, _newPlaceholderAssociationsMap = new WeakMap(), _newPlaceholderAssociations = new WeakSet(), newPlaceholderAssociations_fn = function() {
  return __privateGet(this, _newPlaceholderAssociationsMap) ?? __privateSet(this, _newPlaceholderAssociationsMap, /* @__PURE__ */ new Map());
}, _descendOptions = new WeakSet(), descendOptions_fn = function(options) {
  return {
    ...options,
    depth: options.depth ? options.depth - 1 : null
  };
}, _doChildrenCommute = new WeakSet(), doChildrenCommute_fn = function(A, B, options) {
  if (A.experimentalNumChildAlgNodes() === 1 && B.experimentalNumChildAlgNodes() === 1) {
    const aMove = Array.from(A.childAlgNodes())[0]?.as(Move);
    const bMove = Array.from(B.childAlgNodes())[0]?.as(Move);
    if (!(aMove && bMove)) {
      return false;
    }
    if (bMove.quantum.isIdentical(aMove.quantum)) {
      return true;
    }
    const appendOptionsHelper = new AppendOptionsHelper(options);
    if (appendOptionsHelper.puzzleSpecificSimplifyOptions()?.axis?.areQuantumMovesSameAxis(aMove.quantum, bMove.quantum)) {
      return true;
    }
  }
  return false;
}, _a9);
var simplify = functionFromTraversal(Simplify);
function toIterable(input) {
  if (!input) {
    return [];
  }
  if (experimentalIs(input, Alg)) {
    return input.childAlgNodes();
  }
  if (typeof input === "string") {
    return parseAlg(input).childAlgNodes();
  }
  const iter = input;
  if (typeof iter[Symbol.iterator] === "function") {
    return iter;
  }
  throw new Error("Invalid AlgNode");
}
function experimentalEnsureAlg(alg) {
  if (experimentalIs(alg, Alg)) {
    return alg;
  }
  return new Alg(alg);
}
var _algNodes2, _a10;
var Alg = (_a10 = class extends AlgCommon {
  // TODO: freeze?
  constructor(alg) {
    super();
    // #debugString: string;
    __privateAdd(this, _algNodes2, void 0);
    __privateSet(this, _algNodes2, Array.from(toIterable(alg)));
    for (const algNode of __privateGet(this, _algNodes2)) {
      if (!experimentalIsAlgNode(algNode)) {
        throw new Error("An alg can only contain alg nodes.");
      }
    }
  }
  /**
   * Checks whether this Alg is structurally identical to another Alg. This
   * essentially means that they are written identically apart from whitespace.
   *
   *     const alg1 = new Alg("R U L'");
   *     const alg2 = new Alg("L U' R'").invert();
   *     // true
   *     alg1.isIdentical(alg2);
   *
   *     // false
   *     new Alg("[R, U]").isIdentical(new Alg("R U R' U'"));
   *     // true
   *     new Alg("[R, U]").expand().isIdentical(new Alg("R U R' U'"));
   *
   * Note that .isIdentical() efficiently compares algorithms, but mainly exists
   * to help optimize code when the structure of an algorithm hasn't changed.
   * There are many ways to write the "same" alg on most puzzles, but is
   * *highly* recommended to avoid expanding two Alg instances to compare them,
   * since that can easily slow your program to a crawl if someone inputs an alg
   * containing a large repetition. In general, you should use `cubing/kpuzzle`
   * to compare if two algs have the same effect on a puzzle.
   *
   * Also note that parser annotations are not taken into account while comparing
   * algs:
   *
   *     const alg = new Alg([new Move("R"), new Move("U2")]);
   *     // true, even though one of the algs has parser annotations
   *     alg.isIdentical(new Alg("R U2"))
   *
   */
  isIdentical(other) {
    const otherAsAlg = other;
    if (!other.is(_a10)) {
      return false;
    }
    const l1 = Array.from(__privateGet(this, _algNodes2));
    const l2 = Array.from(__privateGet(otherAsAlg, _algNodes2));
    if (l1.length !== l2.length) {
      return false;
    }
    for (let i = 0; i < l1.length; i++) {
      if (!l1[i].isIdentical(l2[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Returns the inverse of the given alg.
   *
   * Note that that this does not make any assumptions about what puzzle the alg
   * is for. For example, U2 is its own inverse on a cube, but U2' has the same
   * effect U3 (and not U2) on Megaminx:
   *
   *     // Outputs: R U2' L'
   *     new Alg("L U2 R'").invert().log();
   */
  invert() {
    return new _a10(reverse(Array.from(__privateGet(this, _algNodes2)).map((u) => u.invert())));
  }
  /** @deprecated Use {@link Alg.expand} instead. */
  *experimentalExpand(iterDir = 1, depth) {
    depth ?? (depth = Infinity);
    for (const algNode of direct(__privateGet(this, _algNodes2), iterDir)) {
      yield* algNode.experimentalExpand(iterDir, depth);
    }
  }
  /**
   * Expands all Grouping, Commutator, and Conjugate parts nested inside the
   * alg.
   *
   *     // F R U R' U' F'
   *     new Alg("[F: [R, U]]").expand().log();
   *
   *     // F [R, U] F'
   *     new Alg("[F: [R, U]]").expand(({ depth: 1 }).log();
   *
   * Avoid calling this on a user-provided alg unless the user explicitly asks
   * to see the expanded alg. Otherwise, it's easy to make your program freeze
   * when someone passes in an alg like: (R U)10000000
   *
   * Generally, if you want to perform an operation on an entire alg, you'll
   * want to use something based on the `Traversal` mechanism, like countMoves()
   * from `cubing/notation`.
   */
  expand(options) {
    return new _a10(
      this.experimentalExpand(
        1,
        options?.depth ?? Infinity
      )
    );
  }
  /** @deprecated */
  *experimentalLeafMoves() {
    for (const leaf of this.experimentalExpand()) {
      if (leaf.is(Move)) {
        yield leaf;
      }
    }
  }
  concat(input) {
    return new _a10(
      Array.from(__privateGet(this, _algNodes2)).concat(Array.from(toIterable(input)))
    );
  }
  /** @deprecated */
  experimentalIsEmpty() {
    for (const _ of __privateGet(this, _algNodes2)) {
      return false;
    }
    return true;
  }
  static fromString(s) {
    return parseAlg(s);
  }
  /** @deprecated */
  units() {
    return this.childAlgNodes();
  }
  *childAlgNodes() {
    for (const algNode of __privateGet(this, _algNodes2)) {
      yield algNode;
    }
  }
  /** @deprecated */
  experimentalNumUnits() {
    return this.experimentalNumChildAlgNodes();
  }
  experimentalNumChildAlgNodes() {
    return Array.from(__privateGet(this, _algNodes2)).length;
  }
  /** @deprecated */
  get type() {
    warnOnce("deprecated: type");
    return "sequence";
  }
  /**
   * Converts the Alg to a string:
   *
   *     const alg = new Alg([new Move("R"), new Move("U2"), new Move("L")])
   *     // R U2 L
   *     console.log(alg.toString())
   */
  toString() {
    let output = "";
    let previousVisibleAlgNode = null;
    for (const algNode of __privateGet(this, _algNodes2)) {
      if (previousVisibleAlgNode) {
        output += spaceBetween(previousVisibleAlgNode, algNode);
      }
      const nissGrouping = algNode.as(Pause)?.experimentalNISSGrouping;
      if (nissGrouping) {
        if (nissGrouping.amount !== -1) {
          throw new Error("Invalid NISS Grouping amount!");
        }
        output += `^(${nissGrouping.alg.toString()})`;
      } else if (algNode.as(Grouping)?.experimentalNISSPlaceholder) {
      } else {
        output += algNode.toString();
      }
      previousVisibleAlgNode = algNode;
    }
    return output;
  }
  /**
   * `experimentalSimplify` can perform several mostly-syntactic simplifications on an alg:
   *
   *     // Logs: R' U3
   *     import { Alg } from "cubing/alg";
   *     new Alg("R R2' U U2").experimentalSimplify({ cancel: true }).log()
   *
   * You can pass in a `PuzzleLoader` (currently only for 3x3x3) for puzzle-specific simplifications:
   *
   *     // Logs: R' U'
   *     import { Alg } from "cubing/alg";
   *     import { cube3x3x3 } from "cubing/puzzles";
   *     new Alg("R R2' U U2").experimentalSimplify({ cancel: true, puzzleLoader: cube3x3x3 }).log()
   *
   * You can also cancel only moves that are in the same direction:
   *
   *     // Logs: R R2' U'
   *     import { Alg } from "cubing/alg";
   *     import { cube3x3x3 } from "cubing/puzzles";
   *     new Alg("R R2' U U2").experimentalSimplify({
   *       cancel: { directional: "same-direction" },
   *       puzzleLoader: cube3x3x3
   *     }).log()
   *
   * Additionally, you can specify how moves are "wrapped":
   *
   *     import { Alg } from "cubing/alg";
   *     import { cube3x3x3 } from "cubing/puzzles";
   *
   *     function example(puzzleSpecificModWrap) {
   *       alg.experimentalSimplify({
   *         cancel: { puzzleSpecificModWrap },
   *         puzzleLoader: cube3x3x3
   *       }).log()
   *     }
   *
   *     const alg = new Alg("R7' . R6' . R5' . R6")
   *     example("none")               // R7' . R6' . R5' . R6
   *     example("gravity")            // R . R2' . R' . R2
   *     example("canonical-centered") // R . R2 . R' . R2
   *     example("canonical-positive") // R . R2 . R3 . R2
   *     example("preserve-sign")      // R3' . R2' . R' . R2
   *
   * Same-axis and simultaneous move canonicalization is not implemented yet:
   *
   *     // Logs: R L R
   *     import { Alg } from "cubing/alg";
   *     import { cube3x3x3 } from "cubing/puzzles";
   *     new Alg("R L R").experimentalSimplify({ cancel: true, puzzleLoader: cube3x3x3 }).log()
   */
  experimentalSimplify(options) {
    return new _a10(simplify(this, options ?? {}));
  }
  /** @deprecated See {@link experimentalSimplify} */
  simplify(options) {
    return this.experimentalSimplify(options);
  }
}, _algNodes2 = new WeakMap(), _a10);
function spaceBetween(u1, u2) {
  if (u1.is(Newline) || u2.is(Newline)) {
    return "";
  }
  if (u2.as(Grouping)?.experimentalNISSPlaceholder) {
    return "";
  }
  if (u1.is(LineComment) && !u2.is(Newline)) {
    return "\n";
  }
  return " ";
}
var Example = {
  Sune: new Alg([
    new Move("R", 1),
    new Move("U", 1),
    new Move("R", -1),
    new Move("U", 1),
    new Move("R", 1),
    new Move("U", -2),
    new Move("R", -1)
  ]),
  AntiSune: new Alg([
    new Move("R", 1),
    new Move("U", 2),
    new Move("R", -1),
    new Move("U", -1),
    new Move("R", 1),
    new Move("U", -1),
    new Move("R", -1)
  ]),
  SuneCommutator: new Alg([
    new Commutator(
      new Alg([new Move("R", 1), new Move("U", 1), new Move("R", -2)]),
      new Alg([
        new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
      ])
    )
  ]),
  Niklas: new Alg([
    new Move("R", 1),
    new Move("U", -1),
    new Move("L", -1),
    new Move("U", 1),
    new Move("R", -1),
    new Move("U", -1),
    new Move("L", 1),
    new Move("U", 1)
  ]),
  EPerm: new Alg([
    new Move("x", -1),
    new Commutator(
      new Alg([
        new Conjugate(
          new Alg([new Move("R", 1)]),
          new Alg([new Move("U", -1)])
        )
      ]),
      new Alg([new Move("D", 1)])
    ),
    new Commutator(
      new Alg([
        new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
      ]),
      new Alg([new Move("D", 1)])
    ),
    new Move("x", 1)
  ]),
  FURURFCompact: new Alg([
    new Conjugate(
      new Alg([new Move("F", 1)]),
      new Alg([
        new Commutator(
          new Alg([new Move("U", 1)]),
          new Alg([new Move("R", 1)])
        )
      ])
    )
  ]),
  APermCompact: new Alg([
    new Conjugate(
      new Alg([new Move("R", 2)]),
      new Alg([
        new Commutator(
          new Alg([new Move("F", 2)]),
          new Alg([new Move("R", -1), new Move("B", -1), new Move("R", 1)])
        )
      ])
    )
  ]),
  FURURFMoves: new Alg([
    new Move("F", 1),
    new Move("U", 1),
    new Move("R", 1),
    new Move("U", -1),
    new Move("R", -1),
    new Move("F", -1)
  ]),
  TPerm: new Alg([
    new Move("R", 1),
    new Move("U", 1),
    new Move("R", -1),
    new Move("U", -1),
    new Move("R", -1),
    new Move("F", 1),
    new Move("R", 2),
    new Move("U", -1),
    new Move("R", -1),
    new Move("U", -1),
    new Move("R", 1),
    new Move("U", 1),
    new Move("R", -1),
    new Move("F", -1)
  ]),
  HeadlightSwaps: new Alg([
    new Conjugate(
      new Alg([new Move("F", 1)]),
      new Alg([
        new Grouping(
          new Alg([
            new Commutator(
              new Alg([new Move("R", 1)]),
              new Alg([new Move("U", 1)])
            )
          ]),
          3
        )
      ])
    )
  ]),
  TriplePause: new Alg([new Pause(), new Pause(), new Pause()])
  // AllAlgParts: [
  //   new Alg([new Move("R", 1), new Move("U", -1)]),
  //   new Grouping(new Alg([new Move("F", 1)]), 2),
  //   // new Rotation("y", -1),
  //   new Move("R", 2),
  //   new Commutator(new Alg([new Move("R", 2)]), new Alg([new Move("U", 2)]), 2),
  //   new Conjugate(new Alg([new Move("L", 2)]), new Alg([new Move("D", -1)]), 2),
  //   new Pause(),
  //   new Newline(),
  //   new LineComment("line comment"),
  // ],
};
var cubeKeyMapping = {
  73: new Move("R"),
  75: new Move("R'"),
  87: new Move("B"),
  79: new Move("B'"),
  83: new Move("D"),
  76: new Move("D'"),
  68: new Move("L"),
  69: new Move("L'"),
  74: new Move("U"),
  70: new Move("U'"),
  72: new Move("F"),
  71: new Move("F'"),
  78: new Move("x'"),
  67: new Move("l"),
  82: new Move("l'"),
  85: new Move("r"),
  77: new Move("r'"),
  88: new Move("d"),
  188: new Move("d'"),
  84: new Move("x"),
  89: new Move("x"),
  66: new Move("x'"),
  186: new Move("y"),
  59: new Move("y"),
  65: new Move("y'"),
  // 186 is WebKit, 59 is Mozilla; see http://unixpapa.com/js/key.html
  80: new Move("z"),
  81: new Move("z'"),
  90: new Move("M'"),
  190: new Move("M'"),
  192: new Pause()
};

export {
  direct,
  directedGenerator,
  AlgBuilder,
  Conjugate,
  Pause,
  QuantumMove,
  Move,
  Grouping,
  TraversalDownUp,
  TraversalUp,
  functionFromTraversal,
  offsetMod,
  experimentalAppendMove,
  Alg
};
//# sourceMappingURL=chunk-LLF73NS3.js.map
