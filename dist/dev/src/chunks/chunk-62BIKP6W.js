import {
  Alg,
  Move,
  QuantumMove,
  TraversalDownUp,
  functionFromTraversal
} from "./chunk-LLF73NS3.js";
import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField
} from "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-YB6VZREV.js
function combineTransformationData(definition, transformationData1, transformationData2) {
  const newTransformationData = {};
  for (const orbitDefinition of definition.orbits) {
    const orbit1 = transformationData1[orbitDefinition.orbitName];
    const orbit2 = transformationData2[orbitDefinition.orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbit2
    )) {
      newTransformationData[orbitDefinition.orbitName] = orbit1;
    } else if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbit1
    )) {
      newTransformationData[orbitDefinition.orbitName] = orbit2;
    } else {
      const newPerm = new Array(orbitDefinition.numPieces);
      if (orbitDefinition.numOrientations === 1) {
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newPerm[idx] = orbit1.permutation[orbit2.permutation[idx]];
        }
        newTransformationData[orbitDefinition.orbitName] = {
          permutation: newPerm,
          orientationDelta: orbit1.orientationDelta
        };
      } else {
        const newOri = new Array(orbitDefinition.numPieces);
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newOri[idx] = (orbit1.orientationDelta[orbit2.permutation[idx]] + orbit2.orientationDelta[idx]) % orbitDefinition.numOrientations;
          newPerm[idx] = orbit1.permutation[orbit2.permutation[idx]];
        }
        newTransformationData[orbitDefinition.orbitName] = {
          permutation: newPerm,
          orientationDelta: newOri
        };
      }
    }
  }
  return newTransformationData;
}
function applyTransformationDataToKPatternData(definition, patternData, transformationData) {
  const newPatternData = {};
  for (const orbitDefinition of definition.orbits) {
    const patternOrbit = patternData[orbitDefinition.orbitName];
    const transformationOrbit = transformationData[orbitDefinition.orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      transformationOrbit
    )) {
      newPatternData[orbitDefinition.orbitName] = patternOrbit;
    } else {
      const newPieces = new Array(orbitDefinition.numPieces);
      if (orbitDefinition.numOrientations === 1) {
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newPieces[idx] = patternOrbit.pieces[transformationOrbit.permutation[idx]];
        }
        const newOrbitData = {
          pieces: newPieces,
          orientation: patternOrbit.orientation
          // copy all 0
        };
        newPatternData[orbitDefinition.orbitName] = newOrbitData;
      } else {
        const newOrientation = new Array(orbitDefinition.numPieces);
        const newOrientationMod = patternOrbit.orientationMod ? new Array(orbitDefinition.numPieces) : void 0;
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          const transformationIdx = transformationOrbit.permutation[idx];
          let mod = orbitDefinition.numOrientations;
          if (patternOrbit.orientationMod) {
            const orientationMod = patternOrbit.orientationMod[transformationIdx];
            newOrientationMod[idx] = orientationMod;
            mod = orientationMod || orbitDefinition.numOrientations;
          }
          newOrientation[idx] = (patternOrbit.orientation[transformationIdx] + transformationOrbit.orientationDelta[idx]) % mod;
          newPieces[idx] = patternOrbit.pieces[transformationIdx];
        }
        const newOrbitData = {
          pieces: newPieces,
          orientation: newOrientation
        };
        if (newOrientationMod) {
          newOrbitData.orientationMod = newOrientationMod;
        }
        newPatternData[orbitDefinition.orbitName] = newOrbitData;
      }
    }
  }
  return newPatternData;
}
var FREEZE = false;
var identityOrbitCache = /* @__PURE__ */ new Map();
function constructIdentityOrbitTransformation(numPieces) {
  const cached = identityOrbitCache.get(numPieces);
  if (cached) {
    return cached;
  }
  const newPermutation = new Array(numPieces);
  const newOrientation = new Array(numPieces);
  for (let i = 0; i < numPieces; i++) {
    newPermutation[i] = i;
    newOrientation[i] = 0;
  }
  const orbitTransformation = {
    permutation: newPermutation,
    orientationDelta: newOrientation
  };
  if (FREEZE) {
    Object.freeze(newPermutation);
    Object.freeze(newOrientation);
    Object.freeze(orbitTransformation);
  }
  identityOrbitCache.set(numPieces, orbitTransformation);
  return orbitTransformation;
}
function constructIdentityTransformationDataUncached(definition) {
  const transformation = {};
  for (const orbitDefinition of definition.orbits) {
    transformation[orbitDefinition.orbitName] = constructIdentityOrbitTransformation(orbitDefinition.numPieces);
  }
  if (FREEZE) {
    Object.freeze(transformation);
  }
  return transformation;
}
function moveToTransformationUncached(kpuzzle, move) {
  function getTransformationData(key, multiplyAmount) {
    const s = key.toString();
    const movesDef = kpuzzle.definition.moves[s];
    if (movesDef) {
      return repeatTransformationUncached(kpuzzle, movesDef, multiplyAmount);
    }
    const derivedDef = kpuzzle.definition.derivedMoves?.[s];
    if (derivedDef) {
      return repeatTransformationUncached(
        kpuzzle,
        kpuzzle.algToTransformation(derivedDef).transformationData,
        multiplyAmount
      );
    }
    return void 0;
  }
  const data = getTransformationData(move.quantum, move.amount) ?? // Handle e.g. `y2` if `y2` is defined.
  // Note: this doesn't handle multiples.
  getTransformationData(move, 1) ?? // Handle e.g. `y2'` if `y2` is defined.
  // Note: this doesn't handle multiples.
  getTransformationData(move.invert, -1);
  if (data) {
    return data;
  }
  throw new Error(`Invalid move for KPuzzle (${kpuzzle.name()}): ${move}`);
}
var KPattern = class _KPattern {
  constructor(kpuzzle, patternData) {
    this.kpuzzle = kpuzzle;
    this.patternData = patternData;
  }
  toJSON() {
    return {
      experimentalPuzzleName: this.kpuzzle.name(),
      patternData: this.patternData
    };
  }
  static fromTransformation(transformation) {
    const newPatternData = applyTransformationDataToKPatternData(
      transformation.kpuzzle.definition,
      transformation.kpuzzle.definition.defaultPattern,
      transformation.transformationData
    );
    return new _KPattern(transformation.kpuzzle, newPatternData);
  }
  // Convenience function
  /** @deprecated */
  apply(source) {
    return this.applyTransformation(this.kpuzzle.toTransformation(source));
  }
  applyTransformation(transformation) {
    if (transformation.isIdentityTransformation()) {
      return new _KPattern(this.kpuzzle, this.patternData);
    }
    const newPatternData = applyTransformationDataToKPatternData(
      this.kpuzzle.definition,
      this.patternData,
      transformation.transformationData
    );
    return new _KPattern(this.kpuzzle, newPatternData);
  }
  applyMove(move) {
    return this.applyTransformation(this.kpuzzle.moveToTransformation(move));
  }
  applyAlg(alg) {
    return this.applyTransformation(this.kpuzzle.algToTransformation(alg));
  }
  isIdentical(other) {
    return isPatternDataIdentical(
      this.kpuzzle,
      this.patternData,
      other.patternData
    );
  }
  /** @deprecated */
  experimentalToTransformation() {
    if (!this.kpuzzle.canConvertDefaultPatternToUniqueTransformation()) {
      return null;
    }
    const transformationData = {};
    for (const [orbitName, patternOrbitData] of Object.entries(
      this.patternData
    )) {
      const transformationOrbit = {
        permutation: patternOrbitData.pieces,
        orientationDelta: patternOrbitData.orientation
      };
      transformationData[orbitName] = transformationOrbit;
    }
    return new KTransformation(this.kpuzzle, transformationData);
  }
  experimentalIsSolved(options) {
    if (!this.kpuzzle.definition.experimentalIsPatternSolved) {
      throw new Error(
        "`KPattern.experimentalIsPatternSolved()` is not supported for this puzzle at the moment."
      );
    }
    return this.kpuzzle.definition.experimentalIsPatternSolved(this, options);
  }
};
var _cachedIsIdentity, _a;
var KTransformation = (_a = class {
  constructor(kpuzzle, transformationData) {
    // For optimizations, we want to make it cheap to rely on optimizations when a
    // transformation is an identity. Here, we try to make it cheaper by:
    // - only calculating when needed, and
    // - caching the result.
    __privateAdd(this, _cachedIsIdentity, void 0);
    this.kpuzzle = kpuzzle;
    this.transformationData = transformationData;
  }
  toJSON() {
    return {
      experimentalPuzzleName: this.kpuzzle.name(),
      transformationData: this.transformationData
    };
  }
  invert() {
    return new _a(
      this.kpuzzle,
      invertTransformation(this.kpuzzle, this.transformationData)
    );
  }
  // TODO: is `null` worse here?
  isIdentityTransformation() {
    return __privateGet(this, _cachedIsIdentity) ?? __privateSet(this, _cachedIsIdentity, this.isIdentical(
      this.kpuzzle.identityTransformation()
    ));
  }
  /** @deprecated */
  static experimentalConstructIdentity(kpuzzle) {
    const transformation = new _a(
      kpuzzle,
      constructIdentityTransformationDataUncached(kpuzzle.definition)
    );
    __privateSet(transformation, _cachedIsIdentity, true);
    return transformation;
  }
  isIdentical(t2) {
    return isTransformationDataIdentical(
      this.kpuzzle,
      this.transformationData,
      t2.transformationData
    );
  }
  // Convenience function
  /** @deprecated */
  apply(source) {
    return this.applyTransformation(this.kpuzzle.toTransformation(source));
  }
  applyTransformation(t2) {
    if (this.kpuzzle !== t2.kpuzzle) {
      throw new Error(
        `Tried to apply a transformation for a KPuzzle (${t2.kpuzzle.name()}) to a different KPuzzle (${this.kpuzzle.name()}).`
      );
    }
    if (__privateGet(this, _cachedIsIdentity)) {
      return new _a(this.kpuzzle, t2.transformationData);
    }
    if (__privateGet(t2, _cachedIsIdentity)) {
      return new _a(this.kpuzzle, this.transformationData);
    }
    return new _a(
      this.kpuzzle,
      combineTransformationData(
        this.kpuzzle.definition,
        this.transformationData,
        t2.transformationData
      )
    );
  }
  applyMove(move) {
    return this.applyTransformation(this.kpuzzle.moveToTransformation(move));
  }
  applyAlg(alg) {
    return this.applyTransformation(this.kpuzzle.algToTransformation(alg));
  }
  // Convenience. Useful for chaining.
  toKPattern() {
    return KPattern.fromTransformation(this);
  }
  // TODO: support calculating this for a given start state. (For `R U R' U` on 3x3x3, should this default to 5 or 10?)
  repetitionOrder() {
    return transformationRepetitionOrder(this.kpuzzle.definition, this);
  }
  selfMultiply(amount) {
    return new _a(
      this.kpuzzle,
      repeatTransformationUncached(
        this.kpuzzle,
        this.transformationData,
        amount
      )
    );
  }
}, _cachedIsIdentity = new WeakMap(), _a);
function isOrbitTransformationDataIdentityUncached(numOrientations, orbitTransformationData) {
  if (!orbitTransformationData.permutation) {
    console.log(orbitTransformationData);
  }
  const { permutation } = orbitTransformationData;
  const numPieces = permutation.length;
  for (let idx = 0; idx < numPieces; idx++) {
    if (permutation[idx] !== idx) {
      return false;
    }
  }
  if (numOrientations > 1) {
    const { orientationDelta: orientation } = orbitTransformationData;
    for (let idx = 0; idx < numPieces; idx++) {
      if (orientation[idx] !== 0) {
        return false;
      }
    }
  }
  return true;
}
function isOrbitTransformationDataIdentical(orbitDefinition, orbitTransformationData1, orbitTransformationData2, options = {}) {
  for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
    if (!options?.ignorePieceOrientations && orbitTransformationData1.orientationDelta[idx] !== orbitTransformationData2.orientationDelta[idx]) {
      return false;
    }
    if (!options?.ignorePiecePermutation && orbitTransformationData1.permutation[idx] !== orbitTransformationData2.permutation[idx]) {
      return false;
    }
  }
  return true;
}
function isTransformationDataIdentical(kpuzzle, transformationData1, transformationData2) {
  for (const orbitDefinition of kpuzzle.definition.orbits) {
    if (!isOrbitTransformationDataIdentical(
      orbitDefinition,
      transformationData1[orbitDefinition.orbitName],
      transformationData2[orbitDefinition.orbitName]
    )) {
      return false;
    }
  }
  return true;
}
function isOrbitPatternDataIdentical(orbitDefinition, orbitPatternData1, orbitPatternData2, options = {}) {
  for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
    if (!options?.ignorePieceOrientations && (orbitPatternData1.orientation[idx] !== orbitPatternData2.orientation[idx] || (orbitPatternData1.orientationMod?.[idx] ?? 0) !== (orbitPatternData2.orientationMod?.[idx] ?? 0))) {
      return false;
    }
    if (!options?.ignorePieceIndices && orbitPatternData1.pieces[idx] !== orbitPatternData2.pieces[idx]) {
      return false;
    }
  }
  return true;
}
function isPatternDataIdentical(kpuzzle, patternData1, patternData2) {
  for (const orbitDefinition of kpuzzle.definition.orbits) {
    if (!isOrbitPatternDataIdentical(
      orbitDefinition,
      patternData1[orbitDefinition.orbitName],
      patternData2[orbitDefinition.orbitName]
    )) {
      return false;
    }
  }
  return true;
}
function invertTransformation(kpuzzle, transformationData) {
  const newTransformationData = {};
  for (const orbitDefinition of kpuzzle.definition.orbits) {
    const orbitTransformationData = transformationData[orbitDefinition.orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbitTransformationData
    )) {
      newTransformationData[orbitDefinition.orbitName] = orbitTransformationData;
    } else if (orbitDefinition.numOrientations === 1) {
      const newPerm = new Array(orbitDefinition.numPieces);
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        newPerm[orbitTransformationData.permutation[idx]] = idx;
      }
      newTransformationData[orbitDefinition.orbitName] = {
        permutation: newPerm,
        orientationDelta: orbitTransformationData.orientationDelta
      };
    } else {
      const newPerm = new Array(orbitDefinition.numPieces);
      const newOri = new Array(orbitDefinition.numPieces);
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        const fromIdx = orbitTransformationData.permutation[idx];
        newPerm[fromIdx] = idx;
        newOri[fromIdx] = (orbitDefinition.numOrientations - orbitTransformationData.orientationDelta[idx] + orbitDefinition.numOrientations) % orbitDefinition.numOrientations;
      }
      newTransformationData[orbitDefinition.orbitName] = {
        permutation: newPerm,
        orientationDelta: newOri
      };
    }
  }
  return newTransformationData;
}
function repeatTransformationUncached(kpuzzle, transformationData, amount) {
  if (amount === 1) {
    return transformationData;
  }
  if (amount < 0) {
    return repeatTransformationUncached(
      kpuzzle,
      invertTransformation(kpuzzle, transformationData),
      -amount
    );
  }
  if (amount === 0) {
    const { transformationData: transformationData2 } = kpuzzle.identityTransformation();
    return transformationData2;
  }
  let halfish = transformationData;
  if (amount !== 2) {
    halfish = repeatTransformationUncached(
      kpuzzle,
      transformationData,
      Math.floor(amount / 2)
    );
  }
  const twiceHalfish = combineTransformationData(
    kpuzzle.definition,
    halfish,
    halfish
  );
  if (amount % 2 === 0) {
    return twiceHalfish;
  } else {
    return combineTransformationData(
      kpuzzle.definition,
      transformationData,
      twiceHalfish
    );
  }
}
var AlgToTransformationTraversal = class extends TraversalDownUp {
  traverseAlg(alg, kpuzzle) {
    let transformation = null;
    for (const algNode of alg.childAlgNodes()) {
      if (transformation) {
        transformation = transformation.applyTransformation(
          this.traverseAlgNode(algNode, kpuzzle)
        );
      } else {
        transformation = this.traverseAlgNode(algNode, kpuzzle);
      }
    }
    return transformation ?? kpuzzle.identityTransformation();
  }
  traverseGrouping(grouping, kpuzzle) {
    const algTransformation = this.traverseAlg(grouping.alg, kpuzzle);
    return new KTransformation(
      kpuzzle,
      repeatTransformationUncached(
        kpuzzle,
        algTransformation.transformationData,
        grouping.amount
      )
    );
  }
  traverseMove(move, kpuzzle) {
    return kpuzzle.moveToTransformation(move);
  }
  traverseCommutator(commutator, kpuzzle) {
    const aTransformation = this.traverseAlg(commutator.A, kpuzzle);
    const bTransformation = this.traverseAlg(commutator.B, kpuzzle);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert()).applyTransformation(bTransformation.invert());
  }
  traverseConjugate(conjugate, kpuzzle) {
    const aTransformation = this.traverseAlg(conjugate.A, kpuzzle);
    const bTransformation = this.traverseAlg(conjugate.B, kpuzzle);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert());
  }
  traversePause(_, kpuzzle) {
    return kpuzzle.identityTransformation();
  }
  traverseNewline(_, kpuzzle) {
    return kpuzzle.identityTransformation();
  }
  traverseLineComment(_, kpuzzle) {
    return kpuzzle.identityTransformation();
  }
};
var algToTransformation = functionFromTraversal(
  AlgToTransformationTraversal
);
function gcd(a, b) {
  if (b) {
    return gcd(b, a % b);
  }
  return a;
}
function transformationRepetitionOrder(definition, transformation) {
  let order = 1;
  for (const orbitDefinition of definition.orbits) {
    const transformationOrbit = transformation.transformationData[orbitDefinition.orbitName];
    const orbitPieces = new Array(orbitDefinition.numPieces);
    for (let startIdx = 0; startIdx < orbitDefinition.numPieces; startIdx++) {
      if (!orbitPieces[startIdx]) {
        let currentIdx = startIdx;
        let orientationSum = 0;
        let cycleLength = 0;
        for (; ; ) {
          orbitPieces[currentIdx] = true;
          orientationSum = orientationSum + transformationOrbit.orientationDelta[currentIdx];
          cycleLength = cycleLength + 1;
          currentIdx = transformationOrbit.permutation[currentIdx];
          if (currentIdx === startIdx) {
            break;
          }
        }
        if (orientationSum !== 0) {
          cycleLength = cycleLength * orbitDefinition.numOrientations / gcd(orbitDefinition.numOrientations, Math.abs(orientationSum));
        }
        order = order * cycleLength / gcd(order, cycleLength);
      }
    }
  }
  return order;
}
var _indexedOrbits, _moveToTransformationDataCache, _cachedCanConvertDefaultPatternToUniqueTransformation, _a2;
var KPuzzle = (_a2 = class {
  constructor(definition, options) {
    __publicField(this, "experimentalPGNotation");
    __privateAdd(this, _indexedOrbits, void 0);
    __privateAdd(this, _moveToTransformationDataCache, /* @__PURE__ */ new Map());
    __privateAdd(this, _cachedCanConvertDefaultPatternToUniqueTransformation, void 0);
    this.definition = definition;
    this.experimentalPGNotation = options?.experimentalPGNotation;
  }
  // Note: this function is needed much more rarely than you might think. Most
  // operations related to orbits require iterating through all of them, for
  // which the following is better:
  //
  //    for (const orbitDefinition of kpuzzle.definition.orbits) { // …
  //    }
  lookupOrbitDefinition(orbitName) {
    __privateGet(this, _indexedOrbits) || __privateSet(this, _indexedOrbits, (() => {
      const indexedOrbits = {};
      for (const orbitDefinition of this.definition.orbits) {
        indexedOrbits[orbitDefinition.orbitName] = orbitDefinition;
      }
      return indexedOrbits;
    })());
    return __privateGet(this, _indexedOrbits)[orbitName];
  }
  name() {
    return this.definition.name;
  }
  identityTransformation() {
    return KTransformation.experimentalConstructIdentity(this);
  }
  moveToTransformation(move) {
    if (typeof move === "string") {
      move = new Move(move);
    }
    const cacheKey = move.toString();
    const cachedTransformationData = __privateGet(this, _moveToTransformationDataCache).get(cacheKey);
    if (cachedTransformationData) {
      return new KTransformation(this, cachedTransformationData);
    }
    if (this.experimentalPGNotation) {
      const transformationData2 = this.experimentalPGNotation.lookupMove(move);
      if (!transformationData2) {
        throw new Error(`could not map to internal move: ${move}`);
      }
      __privateGet(this, _moveToTransformationDataCache).set(cacheKey, transformationData2);
      return new KTransformation(this, transformationData2);
    }
    const transformationData = moveToTransformationUncached(this, move);
    __privateGet(this, _moveToTransformationDataCache).set(cacheKey, transformationData);
    return new KTransformation(this, transformationData);
  }
  algToTransformation(alg) {
    if (typeof alg === "string") {
      alg = new Alg(alg);
    }
    return algToTransformation(alg, this);
  }
  /** @deprecated */
  toTransformation(source) {
    if (typeof source === "string") {
      return this.algToTransformation(source);
    } else if (source?.is?.(Alg)) {
      return this.algToTransformation(source);
    } else if (source?.is?.(Move)) {
      return this.moveToTransformation(source);
    } else {
      return source;
    }
  }
  defaultPattern() {
    return new KPattern(this, this.definition.defaultPattern);
  }
  // TODO: Handle incomplete default pattern data
  canConvertDefaultPatternToUniqueTransformation() {
    return __privateGet(this, _cachedCanConvertDefaultPatternToUniqueTransformation) ?? __privateSet(this, _cachedCanConvertDefaultPatternToUniqueTransformation, (() => {
      for (const orbitDefinition of this.definition.orbits) {
        const pieces = new Array(orbitDefinition.numPieces).fill(false);
        for (const piece of this.definition.defaultPattern[orbitDefinition.orbitName].pieces) {
          pieces[piece] = true;
        }
        for (const piece of pieces) {
          if (!piece) {
            return false;
          }
        }
      }
      return true;
    })());
  }
}, _indexedOrbits = new WeakMap(), _moveToTransformationDataCache = new WeakMap(), _cachedCanConvertDefaultPatternToUniqueTransformation = new WeakMap(), _a2);

// node_modules/cubing/dist/lib/cubing/chunks/chunk-ENBJKAVC.js
function getFaceletStickeringMask(stickeringMask, orbitName, pieceIdx, faceletIdx, hint) {
  const orbitStickeringMask = stickeringMask.orbits[orbitName];
  const pieceStickeringMask = orbitStickeringMask.pieces[pieceIdx];
  if (pieceStickeringMask === null) {
    return regular;
  }
  const faceletStickeringMask = pieceStickeringMask.facelets?.[faceletIdx];
  if (faceletStickeringMask === null) {
    return regular;
  }
  if (typeof faceletStickeringMask === "string") {
    return faceletStickeringMask;
  }
  if (hint) {
    return faceletStickeringMask.hintMask ?? faceletStickeringMask.mask;
  }
  console.log(faceletStickeringMask);
  return faceletStickeringMask.mask;
}
var PieceAnnotation = class {
  constructor(kpuzzle, defaultValue) {
    __publicField(this, "stickerings", /* @__PURE__ */ new Map());
    for (const orbitDefinition of kpuzzle.definition.orbits) {
      this.stickerings.set(
        orbitDefinition.orbitName,
        new Array(orbitDefinition.numPieces).fill(defaultValue)
      );
    }
  }
};
var regular = "regular";
var ignored = "ignored";
var oriented = "oriented";
var experimentalOriented2 = "experimentalOriented2";
var invisible = "invisible";
var dim = "dim";
var pieceStickerings = {
  // regular
  [
    "Regular"
    /* Regular */
  ]: {
    // r
    facelets: [regular, regular, regular, regular, regular]
  },
  // ignored
  [
    "Ignored"
    /* Ignored */
  ]: {
    // i
    facelets: [ignored, ignored, ignored, ignored, ignored]
  },
  // oriented stickers
  [
    "OrientationStickers"
    /* OrientationStickers */
  ]: {
    // o
    facelets: [oriented, oriented, oriented, oriented, oriented]
  },
  // "OLL"
  [
    "IgnoreNonPrimary"
    /* IgnoreNonPrimary */
  ]: {
    // riiii
    facelets: [regular, ignored, ignored, ignored, ignored]
  },
  // invisible
  [
    "Invisible"
    /* Invisible */
  ]: {
    // invisiblePiece
    facelets: [invisible, invisible, invisible, invisible, invisible]
  },
  // "PLL"
  [
    "PermuteNonPrimary"
    /* PermuteNonPrimary */
  ]: {
    // drrrr
    facelets: [dim, regular, regular, regular, regular]
  },
  // ignored
  [
    "Dim"
    /* Dim */
  ]: {
    // d
    facelets: [dim, dim, dim, dim, dim]
  },
  // "OLL"
  [
    "Ignoriented"
    /* Ignoriented */
  ]: {
    // diiii
    facelets: [dim, ignored, ignored, ignored, ignored]
  },
  [
    "OrientationWithoutPermutation"
    /* OrientationWithoutPermutation */
  ]: {
    // oiiii
    facelets: [oriented, ignored, ignored, ignored, ignored]
  },
  [
    "ExperimentalOrientationWithoutPermutation2"
    /* ExperimentalOrientationWithoutPermutation2 */
  ]: {
    // oiiii
    facelets: [experimentalOriented2, ignored, ignored, ignored, ignored]
  }
};
function getPieceStickeringMask(pieceStickering) {
  return pieceStickerings[pieceStickering];
}
var PuzzleStickering = class extends PieceAnnotation {
  constructor(kpuzzle) {
    super(
      kpuzzle,
      "Regular"
      /* Regular */
    );
  }
  set(pieceSet, pieceStickering) {
    for (const [orbitName, pieces] of this.stickerings.entries()) {
      for (let i = 0; i < pieces.length; i++) {
        if (pieceSet.stickerings.get(orbitName)[i]) {
          pieces[i] = pieceStickering;
        }
      }
    }
    return this;
  }
  toStickeringMask() {
    const stickeringMask = { orbits: {} };
    for (const [orbitName, pieceStickerings2] of this.stickerings.entries()) {
      const pieces = [];
      const orbitStickeringMask = {
        pieces
      };
      stickeringMask.orbits[orbitName] = orbitStickeringMask;
      for (const pieceStickering of pieceStickerings2) {
        pieces.push(getPieceStickeringMask(pieceStickering));
      }
    }
    return stickeringMask;
  }
};
var StickeringManager = class {
  constructor(kpuzzle) {
    this.kpuzzle = kpuzzle;
  }
  and(pieceSets) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitDefinition of this.kpuzzle.definition.orbits) {
      pieceLoop:
        for (let i = 0; i < orbitDefinition.numPieces; i++) {
          newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = true;
          for (const pieceSet of pieceSets) {
            if (!pieceSet.stickerings.get(orbitDefinition.orbitName)[i]) {
              newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = false;
              continue pieceLoop;
            }
          }
        }
    }
    return newPieceSet;
  }
  or(pieceSets) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitDefinition of this.kpuzzle.definition.orbits) {
      pieceLoop:
        for (let i = 0; i < orbitDefinition.numPieces; i++) {
          newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = false;
          for (const pieceSet of pieceSets) {
            if (pieceSet.stickerings.get(orbitDefinition.orbitName)[i]) {
              newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = true;
              continue pieceLoop;
            }
          }
        }
    }
    return newPieceSet;
  }
  not(pieceSet) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitDefinition of this.kpuzzle.definition.orbits) {
      for (let i = 0; i < orbitDefinition.numPieces; i++) {
        newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = !pieceSet.stickerings.get(orbitDefinition.orbitName)[i];
      }
    }
    return newPieceSet;
  }
  all() {
    return this.and(this.moves([]));
  }
  move(moveSource) {
    const transformation = this.kpuzzle.moveToTransformation(moveSource);
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitDefinition of this.kpuzzle.definition.orbits) {
      for (let i = 0; i < orbitDefinition.numPieces; i++) {
        if (transformation.transformationData[orbitDefinition.orbitName].permutation[i] !== i || transformation.transformationData[orbitDefinition.orbitName].orientationDelta[i] !== 0) {
          newPieceSet.stickerings.get(orbitDefinition.orbitName)[i] = true;
        }
      }
    }
    return newPieceSet;
  }
  moves(moveSources) {
    return moveSources.map((moveSource) => this.move(moveSource));
  }
  orbits(orbitNames) {
    const pieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitName of orbitNames) {
      pieceSet.stickerings.get(orbitName).fill(true);
    }
    return pieceSet;
  }
  orbitPrefix(orbitPrefix) {
    const pieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitDefinition of this.kpuzzle.definition.orbits) {
      if (orbitDefinition.orbitName.startsWith(orbitPrefix)) {
        pieceSet.stickerings.get(orbitDefinition.orbitName).fill(true);
      }
    }
    return pieceSet;
  }
  // trueCounts(pieceSet: PieceSet): Record<string, number> {
  //   const counts: Record<string, number> = {};
  //   for (const orbitDefinition of this.def.orbits) {
  //     let count = 0;
  //     for (let i = 0; i < orbitDefinition.numPieces; i++) {
  //       if (pieceSet.stickerings.get(orbitDefinition.orbitName)![i]) {
  //         count++;
  //       }
  //     }
  //     counts[orbitName] = count;
  //   }
  //   return counts;
  // }
};
var LL = "Last Layer";
var LS = "Last Slot";
var megaAnd3x3x3LL = {
  "3x3x3": LL,
  megaminx: LL
};
var megaAnd3x3x3LS = {
  "3x3x3": LS,
  megaminx: LS
};
var experimentalStickerings = {
  full: { groups: { "3x3x3": "Stickering", megaminx: "Stickering" } },
  // default
  OLL: { groups: megaAnd3x3x3LL },
  PLL: { groups: megaAnd3x3x3LL },
  LL: { groups: megaAnd3x3x3LL },
  EOLL: { groups: megaAnd3x3x3LL },
  COLL: { groups: megaAnd3x3x3LL },
  OCLL: { groups: megaAnd3x3x3LL },
  CPLL: { groups: megaAnd3x3x3LL },
  CLL: { groups: megaAnd3x3x3LL },
  EPLL: { groups: megaAnd3x3x3LL },
  ELL: { groups: megaAnd3x3x3LL },
  ZBLL: { groups: megaAnd3x3x3LL },
  LS: { groups: megaAnd3x3x3LS },
  ELS: { groups: megaAnd3x3x3LS },
  CLS: { groups: megaAnd3x3x3LS },
  ZBLS: { groups: megaAnd3x3x3LS },
  VLS: { groups: megaAnd3x3x3LS },
  WVLS: { groups: megaAnd3x3x3LS },
  F2L: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  Daisy: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  Cross: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  EO: { groups: { "3x3x3": "ZZ" } },
  EOline: { groups: { "3x3x3": "ZZ" } },
  EOcross: { groups: { "3x3x3": "ZZ" } },
  CMLL: { groups: { "3x3x3": "Roux" } },
  L10P: { groups: { "3x3x3": "Roux" } },
  L6E: { groups: { "3x3x3": "Roux" } },
  L6EO: { groups: { "3x3x3": "Roux" } },
  "2x2x2": { groups: { "3x3x3": "Petrus" } },
  "2x2x3": { groups: { "3x3x3": "Petrus" } },
  G1: { groups: { "3x3x3": "FMC" } },
  L2C: {
    groups: {
      "4x4x4": "Reduction",
      "5x5x5": "Reduction",
      "6x6x6": "Reduction"
    }
  },
  PBL: {
    groups: {
      "2x2x2": "Ortega"
    }
  },
  "Void Cube": { groups: { "3x3x3": "Miscellaneous" } },
  invisible: { groups: { "3x3x3": "Miscellaneous" } },
  picture: { groups: { "3x3x3": "Miscellaneous" } },
  "centers-only": { groups: { "3x3x3": "Miscellaneous" } },
  // TODO
  "experimental-centers-U": {},
  "experimental-centers-U-D": {},
  "experimental-centers-U-L-D": {},
  "experimental-centers-U-L-B-D": {},
  "experimental-centers": {},
  "experimental-fto-fc": { groups: { fto: "Bencisco" } },
  "experimental-fto-f2t": { groups: { fto: "Bencisco" } },
  "experimental-fto-sc": { groups: { fto: "Bencisco" } },
  "experimental-fto-l2c": { groups: { fto: "Bencisco" } },
  "experimental-fto-lbt": { groups: { fto: "Bencisco" } },
  "experimental-fto-l3t": { groups: { fto: "Bencisco" } }
};
async function cubeLikeStickeringMask(puzzleLoader, stickering) {
  const kpuzzle = await puzzleLoader.kpuzzle();
  const puzzleStickering = new PuzzleStickering(kpuzzle);
  const m = new StickeringManager(kpuzzle);
  const LL2 = () => m.move("U");
  const orUD = () => m.or(m.moves(["U", "D"]));
  const orLR = () => m.or(m.moves(["L", "R"]));
  const M = () => m.not(orLR());
  const F2L = () => m.not(LL2());
  const CENTERS = () => m.orbitPrefix("CENTER");
  const EDGES = () => m.orbitPrefix("EDGE");
  const CORNERS = () => m.or([
    m.orbitPrefix("CORNER"),
    m.orbitPrefix("C4RNER"),
    m.orbitPrefix("C5RNER")
  ]);
  const L6E = () => m.or([M(), m.and([LL2(), EDGES()])]);
  const centerLL = () => m.and([LL2(), CENTERS()]);
  const edgeFR = () => m.and([m.and(m.moves(["F", "R"])), EDGES()]);
  const cornerDFR = () => m.and([m.and(m.moves(["F", "R"])), CORNERS(), m.not(LL2())]);
  const slotFR = () => m.or([cornerDFR(), edgeFR()]);
  function dimF2L() {
    puzzleStickering.set(
      F2L(),
      "Dim"
      /* Dim */
    );
  }
  function setPLL() {
    puzzleStickering.set(
      LL2(),
      "PermuteNonPrimary"
      /* PermuteNonPrimary */
    );
    puzzleStickering.set(
      centerLL(),
      "Dim"
      /* Dim */
    );
  }
  function setOLL() {
    puzzleStickering.set(
      LL2(),
      "IgnoreNonPrimary"
      /* IgnoreNonPrimary */
    );
    puzzleStickering.set(
      centerLL(),
      "Regular"
      /* Regular */
    );
  }
  function dimOLL() {
    puzzleStickering.set(
      LL2(),
      "Ignoriented"
      /* Ignoriented */
    );
    puzzleStickering.set(
      centerLL(),
      "Dim"
      /* Dim */
    );
  }
  switch (stickering) {
    case "full":
      break;
    case "PLL": {
      dimF2L();
      setPLL();
      break;
    }
    case "CLS": {
      dimF2L();
      puzzleStickering.set(
        cornerDFR(),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        LL2(),
        "Ignoriented"
        /* Ignoriented */
      );
      puzzleStickering.set(
        m.and([LL2(), CENTERS()]),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary"
        /* IgnoreNonPrimary */
      );
      break;
    }
    case "OLL": {
      dimF2L();
      setOLL();
      break;
    }
    case "EOLL": {
      dimF2L();
      setOLL();
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "COLL": {
      dimF2L();
      puzzleStickering.set(
        m.and([LL2(), EDGES()]),
        "Ignoriented"
        /* Ignoriented */
      );
      puzzleStickering.set(
        m.and([LL2(), CENTERS()]),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "OCLL": {
      dimF2L();
      dimOLL();
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary"
        /* IgnoreNonPrimary */
      );
      break;
    }
    case "CPLL": {
      dimF2L();
      puzzleStickering.set(
        m.and([CORNERS(), LL2()]),
        "PermuteNonPrimary"
        /* PermuteNonPrimary */
      );
      puzzleStickering.set(
        m.and([m.not(CORNERS()), LL2()]),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "CLL": {
      dimF2L();
      puzzleStickering.set(
        m.not(m.and([CORNERS(), LL2()])),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "EPLL": {
      dimF2L();
      puzzleStickering.set(
        LL2(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), EDGES()]),
        "PermuteNonPrimary"
        /* PermuteNonPrimary */
      );
      break;
    }
    case "ELL": {
      dimF2L();
      puzzleStickering.set(
        LL2(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), EDGES()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "ELS": {
      dimF2L();
      setOLL();
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        edgeFR(),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        cornerDFR(),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "LL": {
      dimF2L();
      break;
    }
    case "F2L": {
      puzzleStickering.set(
        LL2(),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "ZBLL": {
      dimF2L();
      puzzleStickering.set(
        LL2(),
        "PermuteNonPrimary"
        /* PermuteNonPrimary */
      );
      puzzleStickering.set(
        centerLL(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "ZBLS": {
      dimF2L();
      puzzleStickering.set(
        slotFR(),
        "Regular"
        /* Regular */
      );
      setOLL();
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "VLS": {
      dimF2L();
      puzzleStickering.set(
        slotFR(),
        "Regular"
        /* Regular */
      );
      setOLL();
      break;
    }
    case "WVLS": {
      dimF2L();
      puzzleStickering.set(
        slotFR(),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        m.and([LL2(), EDGES()]),
        "Ignoriented"
        /* Ignoriented */
      );
      puzzleStickering.set(
        m.and([LL2(), CENTERS()]),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary"
        /* IgnoreNonPrimary */
      );
      break;
    }
    case "LS": {
      dimF2L();
      puzzleStickering.set(
        slotFR(),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        LL2(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        centerLL(),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "EO": {
      puzzleStickering.set(
        CORNERS(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation"
        /* OrientationWithoutPermutation */
      );
      break;
    }
    case "EOline": {
      puzzleStickering.set(
        CORNERS(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation"
        /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(
        m.and(m.moves(["D", "M"])),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "EOcross": {
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation"
        /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(
        m.move("D"),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        CORNERS(),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "CMLL": {
      puzzleStickering.set(
        F2L(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        L6E(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "L10P": {
      puzzleStickering.set(
        m.not(L6E()),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([CORNERS(), LL2()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "L6E": {
      puzzleStickering.set(
        m.not(L6E()),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "L6EO": {
      puzzleStickering.set(
        m.not(L6E()),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        L6E(),
        "OrientationWithoutPermutation"
        /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(
        m.and([CENTERS(), orUD()]),
        "OrientationStickers"
        /* OrientationStickers */
      );
      break;
    }
    case "Daisy": {
      puzzleStickering.set(
        m.all(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        CENTERS(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([m.move("D"), CENTERS()]),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        m.and([m.move("U"), EDGES()]),
        "IgnoreNonPrimary"
        /* IgnoreNonPrimary */
      );
      break;
    }
    case "Cross": {
      puzzleStickering.set(
        m.all(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        CENTERS(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([m.move("D"), CENTERS()]),
        "Regular"
        /* Regular */
      );
      puzzleStickering.set(
        m.and([m.move("D"), EDGES()]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "2x2x2": {
      puzzleStickering.set(
        m.or(m.moves(["U", "F", "R"])),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "2x2x3": {
      puzzleStickering.set(
        m.all(),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.or(m.moves(["U", "F", "R"])),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.and([m.move("F"), m.not(m.or(m.moves(["U", "R"])))]),
        "Regular"
        /* Regular */
      );
      break;
    }
    case "G1": {
      puzzleStickering.set(
        m.all(),
        "ExperimentalOrientationWithoutPermutation2"
        /* ExperimentalOrientationWithoutPermutation2 */
      );
      puzzleStickering.set(
        m.or(m.moves(["E"])),
        "OrientationWithoutPermutation"
        /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(
        m.and(m.moves(["E", "S"])),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "L2C": {
      puzzleStickering.set(
        m.or(m.moves(["L", "R", "B", "D"])),
        "Dim"
        /* Dim */
      );
      puzzleStickering.set(
        m.not(CENTERS()),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "PBL": {
      puzzleStickering.set(
        m.all(),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        m.or(m.moves(["U", "D"])),
        "PermuteNonPrimary"
        /* PermuteNonPrimary */
      );
      break;
    }
    case "Void Cube": {
      puzzleStickering.set(
        CENTERS(),
        "Invisible"
        /* Invisible */
      );
      break;
    }
    case "picture":
    case "invisible": {
      puzzleStickering.set(
        m.all(),
        "Invisible"
        /* Invisible */
      );
      break;
    }
    case "centers-only": {
      puzzleStickering.set(
        m.not(CENTERS()),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
      );
      puzzleStickering.set(
        m.and(m.moves([])),
        "Dim"
        /* Dim */
      );
  }
  return puzzleStickering.toStickeringMask();
}
async function cubeLikeStickeringList(puzzleID, options) {
  const stickerings = [];
  const stickeringsFallback = [];
  for (const [name, info] of Object.entries(experimentalStickerings)) {
    if (info.groups) {
      if (puzzleID in info.groups) {
        stickerings.push(name);
      } else if (options?.use3x3x3Fallbacks && "3x3x3" in info.groups) {
        stickeringsFallback.push(name);
      }
    }
  }
  return stickerings.concat(stickeringsFallback);
}
function getCached(getValue) {
  let cachedPromise = null;
  return () => {
    return cachedPromise ?? (cachedPromise = getValue());
  };
}
var PLazy = class _PLazy extends Promise {
  constructor(executor) {
    super((resolve) => {
      resolve();
    });
    this._executor = executor;
  }
  static from(function_) {
    return new _PLazy((resolve) => {
      resolve(function_());
    });
  }
  static resolve(value) {
    return new _PLazy((resolve) => {
      resolve(value);
    });
  }
  static reject(error) {
    return new _PLazy((_resolve, reject) => {
      reject(error);
    });
  }
  then(onFulfilled, onRejected) {
    this._promise = this._promise || new Promise(this._executor);
    return this._promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    this._promise = this._promise || new Promise(this._executor);
    return this._promise.catch(onRejected);
  }
};
function from(function_) {
  return new PLazy((resolve) => {
    resolve(function_());
  });
}
async function asyncGetPuzzleGeometry(puzzleName) {
  const puzzleGeometry = await import("./puzzle-geometry-3DZHDFOQ.js");
  return puzzleGeometry.getPuzzleGeometryByName(puzzleName, {
    allMoves: true,
    orientCenters: true,
    addRotations: true
  });
}
async function asyncGetKPuzzle(pgPromise, puzzleName) {
  const pg = await pgPromise;
  const kpuzzleDefinition = pg.getKPuzzleDefinition(true);
  kpuzzleDefinition.name = puzzleName;
  const puzzleGeometry = await import("./puzzle-geometry-3DZHDFOQ.js");
  const pgNotation = new puzzleGeometry.ExperimentalPGNotation(
    pg,
    pg.getOrbitsDef(true)
  );
  return new KPuzzle(pgNotation.remapKPuzzleDefinition(kpuzzleDefinition), {
    experimentalPGNotation: pgNotation
  });
}
var _cachedPG, _cachedKPuzzle, _cachedSVG, _a3;
var PGPuzzleLoader = (_a3 = class {
  constructor(info) {
    __publicField(this, "pgId");
    __publicField(this, "id");
    __publicField(this, "fullName");
    __publicField(this, "inventedBy");
    __publicField(this, "inventionYear");
    __privateAdd(this, _cachedPG, void 0);
    __privateAdd(this, _cachedKPuzzle, void 0);
    __privateAdd(this, _cachedSVG, void 0);
    __publicField(this, "puzzleSpecificSimplifyOptionsPromise", puzzleSpecificSimplifyOptionsPromise(
      this.kpuzzle.bind(this)
    ));
    this.pgId = info.pgID;
    this.id = info.id;
    this.fullName = info.fullName;
    this.inventedBy = info.inventedBy;
    this.inventionYear = info.inventionYear;
  }
  pg() {
    return __privateGet(this, _cachedPG) ?? __privateSet(this, _cachedPG, asyncGetPuzzleGeometry(this.pgId ?? this.id));
  }
  kpuzzle() {
    return __privateGet(this, _cachedKPuzzle) ?? __privateSet(this, _cachedKPuzzle, asyncGetKPuzzle(this.pg(), this.id));
  }
  svg() {
    return __privateGet(this, _cachedSVG) ?? __privateSet(this, _cachedSVG, (async () => (await this.pg()).generatesvg())());
  }
}, _cachedPG = new WeakMap(), _cachedKPuzzle = new WeakMap(), _cachedSVG = new WeakMap(), _a3);
var CubePGPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super(...arguments);
    __publicField(this, "stickerings", () => cubeLikeStickeringList(this.id, { use3x3x3Fallbacks: true }));
  }
  stickeringMask(stickering) {
    return cubeLikeStickeringMask(this, stickering);
  }
};
function puzzleSpecificSimplifyOptionsPromise(kpuzzlePromiseFn) {
  return new PLazy(
    async (resolve) => {
      const kpuzzle = await kpuzzlePromiseFn();
      resolve({
        quantumMoveOrder: (m) => {
          return kpuzzle.moveToTransformation(new Move(m)).repetitionOrder();
        }
      });
    }
  );
}
var cube3x3x3KPuzzleDefinition = {
  name: "3x3x3",
  orbits: [
    { orbitName: "EDGES", numPieces: 12, numOrientations: 2 },
    { orbitName: "CORNERS", numPieces: 8, numOrientations: 3 },
    { orbitName: "CENTERS", numPieces: 6, numOrientations: 4 }
  ],
  defaultPattern: {
    EDGES: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    CORNERS: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0]
    },
    CENTERS: {
      pieces: [0, 1, 2, 3, 4, 5],
      orientation: [0, 0, 0, 0, 0, 0],
      orientationMod: [1, 1, 1, 1, 1, 1]
    }
  },
  moves: {
    U: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [1, 0, 0, 0, 0, 0]
      }
    },
    y: {
      EDGES: {
        permutation: [1, 2, 3, 0, 5, 6, 7, 4, 10, 8, 11, 9],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 7, 4, 5, 6],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientationDelta: [1, 0, 0, 0, 0, 3]
      }
    },
    x: {
      EDGES: {
        permutation: [4, 8, 0, 9, 6, 10, 2, 11, 5, 7, 1, 3],
        orientationDelta: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 3, 5, 7, 6, 2, 1],
        orientationDelta: [2, 1, 2, 1, 1, 2, 1, 2]
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientationDelta: [0, 3, 0, 1, 2, 2]
      }
    },
    L: {
      EDGES: {
        permutation: [0, 1, 2, 11, 4, 5, 6, 9, 8, 3, 10, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientationDelta: [0, 0, 2, 1, 0, 2, 1, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [0, 1, 0, 0, 0, 0]
      }
    },
    F: {
      EDGES: {
        permutation: [9, 1, 2, 3, 8, 5, 6, 7, 0, 4, 10, 11],
        orientationDelta: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0]
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientationDelta: [1, 0, 0, 2, 2, 1, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [0, 0, 1, 0, 0, 0]
      }
    },
    R: {
      EDGES: {
        permutation: [0, 8, 2, 3, 4, 10, 6, 7, 5, 9, 1, 11],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientationDelta: [2, 1, 0, 0, 1, 0, 0, 2]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [0, 0, 0, 1, 0, 0]
      }
    },
    B: {
      EDGES: {
        permutation: [0, 1, 10, 3, 4, 5, 11, 7, 8, 9, 6, 2],
        orientationDelta: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1]
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientationDelta: [0, 2, 1, 0, 0, 0, 2, 1]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [0, 0, 0, 0, 1, 0]
      }
    },
    D: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientationDelta: [0, 0, 0, 0, 0, 1]
      }
    },
    z: {
      EDGES: {
        permutation: [9, 3, 11, 7, 8, 1, 10, 5, 0, 4, 2, 6],
        orientationDelta: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [3, 2, 6, 5, 0, 4, 7, 1],
        orientationDelta: [1, 2, 1, 2, 2, 1, 2, 1]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientationDelta: [1, 1, 1, 1, 3, 1]
      }
    },
    M: {
      EDGES: {
        permutation: [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11],
        orientationDelta: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientationDelta: [2, 0, 0, 0, 2, 0]
      }
    },
    E: {
      EDGES: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 8, 10],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientationDelta: [0, 0, 0, 0, 0, 0]
      }
    },
    S: {
      EDGES: {
        permutation: [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11],
        orientationDelta: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientationDelta: [1, 1, 0, 1, 0, 1]
      }
    },
    u: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 10, 8, 11, 9],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientationDelta: [1, 0, 0, 0, 0, 0]
      }
    },
    l: {
      EDGES: {
        permutation: [2, 1, 6, 11, 0, 5, 4, 9, 8, 3, 10, 7],
        orientationDelta: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientationDelta: [0, 0, 2, 1, 0, 2, 1, 0]
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientationDelta: [2, 1, 0, 0, 2, 0]
      }
    },
    f: {
      EDGES: {
        permutation: [9, 3, 2, 7, 8, 1, 6, 5, 0, 4, 10, 11],
        orientationDelta: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0]
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientationDelta: [1, 0, 0, 2, 2, 1, 0, 0]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientationDelta: [1, 1, 1, 1, 0, 1]
      }
    },
    r: {
      EDGES: {
        permutation: [4, 8, 0, 3, 6, 10, 2, 7, 5, 9, 1, 11],
        orientationDelta: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientationDelta: [2, 1, 0, 0, 1, 0, 0, 2]
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientationDelta: [0, 0, 0, 1, 2, 2]
      }
    },
    b: {
      EDGES: {
        permutation: [0, 5, 10, 1, 4, 7, 11, 3, 8, 9, 6, 2],
        orientationDelta: [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1]
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientationDelta: [0, 2, 1, 0, 0, 0, 2, 1]
      },
      CENTERS: {
        permutation: [3, 0, 2, 5, 4, 1],
        orientationDelta: [3, 3, 0, 3, 1, 3]
      }
    },
    d: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 9, 11, 8, 10],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientationDelta: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientationDelta: [0, 0, 0, 0, 0, 1]
      }
    }
  },
  derivedMoves: {
    Uw: "u",
    Lw: "l",
    Fw: "f",
    Rw: "r",
    Bw: "b",
    Dw: "d",
    Uv: "y",
    Lv: "x'",
    Fv: "z",
    Rv: "x",
    Bv: "z'",
    Dv: "y'",
    "2U": "u U'",
    "2L": "l L'",
    "2F": "f F'",
    "2R": "r R'",
    "2B": "b B'",
    "2D": "d D'"
  }
};
async function getPartialAppendOptionsForPuzzleSpecificSimplifyOptions(puzzleLoader) {
  const puzzleSpecificSimplifyOptions = await (puzzleLoader.puzzleSpecificSimplifyOptions ?? puzzleLoader.puzzleSpecificSimplifyOptionsPromise);
  if (!puzzleSpecificSimplifyOptions) {
    return {};
  }
  return { puzzleLoader: { puzzleSpecificSimplifyOptions } };
}
var puzzleOrientationCacheRaw = new Array(24);
async function descAsyncGetPuzzleGeometry(desc, options) {
  const puzzleGeometry = await import("./puzzle-geometry-3DZHDFOQ.js");
  return puzzleGeometry.getPuzzleGeometryByDesc(desc, {
    allMoves: true,
    orientCenters: true,
    addRotations: true,
    ...options
  });
}
async function asyncGetKPuzzleByDesc(desc, options) {
  const pgPromise = descAsyncGetPuzzleGeometry(desc, options);
  return asyncGetKPuzzle(pgPromise, `description: ${desc}`);
}
var nextCustomID = 1;
function customPGPuzzleLoader(desc, info) {
  const customID = nextCustomID++;
  let cachedKPuzzle = null;
  const kpuzzlePromiseFn = async () => {
    return cachedKPuzzle ?? (cachedKPuzzle = asyncGetKPuzzleByDesc(desc));
  };
  const puzzleLoader = {
    id: `custom-${customID}`,
    fullName: info?.fullName ?? `Custom Puzzle (instance #${customID})`,
    kpuzzle: kpuzzlePromiseFn,
    svg: async () => {
      const pg = await descAsyncGetPuzzleGeometry(desc);
      return pg.generatesvg();
    },
    pg: async () => {
      return descAsyncGetPuzzleGeometry(desc);
    },
    puzzleSpecificSimplifyOptionsPromise: puzzleSpecificSimplifyOptionsPromise(kpuzzlePromiseFn)
  };
  if (info?.inventedBy) {
    puzzleLoader.inventedBy = info.inventedBy;
  }
  if (info?.inventionYear) {
    puzzleLoader.inventionYear = info.inventionYear;
  }
  return puzzleLoader;
}
var experimental3x3x3KPuzzle = new KPuzzle(
  cube3x3x3KPuzzleDefinition
);
cube3x3x3KPuzzleDefinition.experimentalIsPatternSolved = experimentalIs3x3x3Solved;
function puzzleOrientation3x3x3Idx(pattern) {
  const idxU = pattern.patternData["CENTERS"].pieces[0];
  const idxD = pattern.patternData["CENTERS"].pieces[5];
  const unadjustedIdxL = pattern.patternData["CENTERS"].pieces[1];
  let idxL = unadjustedIdxL;
  if (idxU < unadjustedIdxL) {
    idxL--;
  }
  if (idxD < unadjustedIdxL) {
    idxL--;
  }
  return [idxU, idxL];
}
var puzzleOrientationCacheRaw2 = new Array(6).fill(0).map(() => {
  return new Array(6);
});
var puzzleOrientationCacheInitialized = false;
function puzzleOrientation3x3x3Cache() {
  if (!puzzleOrientationCacheInitialized) {
    {
      const uAlgs = ["", "z", "x", "z'", "x'", "x2"].map(
        (s) => Alg.fromString(s)
      );
      const yAlg = new Alg("y");
      for (const uAlg of uAlgs) {
        let transformation = experimental3x3x3KPuzzle.algToTransformation(uAlg);
        for (let i = 0; i < 4; i++) {
          transformation = transformation.applyAlg(yAlg);
          const [idxU, idxL] = puzzleOrientation3x3x3Idx(
            transformation.toKPattern()
          );
          puzzleOrientationCacheRaw2[idxU][idxL] = transformation.invert();
        }
      }
    }
  }
  return puzzleOrientationCacheRaw2;
}
function normalize3x3x3Orientation(pattern) {
  const [idxU, idxL] = puzzleOrientation3x3x3Idx(pattern);
  const orientationTransformation = puzzleOrientation3x3x3Cache()[idxU][idxL];
  return pattern.applyTransformation(orientationTransformation);
}
function experimentalIs3x3x3Solved(pattern, options) {
  if (options.ignorePuzzleOrientation) {
    pattern = normalize3x3x3Orientation(pattern);
  }
  if (options.ignoreCenterOrientation) {
    pattern = new KPattern(pattern.kpuzzle, {
      EDGES: pattern.patternData.EDGES,
      CORNERS: pattern.patternData.CORNERS,
      CENTERS: {
        pieces: pattern.patternData.CENTERS.pieces,
        orientation: new Array(6).fill(0)
      }
    });
  }
  return !!pattern.experimentalToTransformation()?.isIdentityTransformation();
}

// node_modules/cubing/dist/lib/cubing/chunks/chunk-HRKC4GVV.js
var wcaEvents = {
  "333": { puzzleID: "3x3x3", eventName: "3x3x3 Cube" },
  "222": { puzzleID: "2x2x2", eventName: "2x2x2 Cube" },
  "444": { puzzleID: "4x4x4", eventName: "4x4x4 Cube" },
  "555": { puzzleID: "5x5x5", eventName: "5x5x5 Cube" },
  "666": { puzzleID: "6x6x6", eventName: "6x6x6 Cube" },
  "777": { puzzleID: "7x7x7", eventName: "7x7x7 Cube" },
  "333bf": { puzzleID: "3x3x3", eventName: "3x3x3 Blindfolded" },
  "333fm": { puzzleID: "3x3x3", eventName: "3x3x3 Fewest Moves" },
  "333oh": { puzzleID: "3x3x3", eventName: "3x3x3 One-Handed" },
  clock: { puzzleID: "clock", eventName: "Clock" },
  minx: { puzzleID: "megaminx", eventName: "Megaminx" },
  pyram: { puzzleID: "pyraminx", eventName: "Pyraminx" },
  skewb: { puzzleID: "skewb", eventName: "Skewb" },
  sq1: { puzzleID: "square1", eventName: "Square-1" },
  "444bf": { puzzleID: "4x4x4", eventName: "4x4x4 Blindfolded" },
  "555bf": { puzzleID: "5x5x5", eventName: "5x5x5 Blindfolded" },
  "333mbf": { puzzleID: "3x3x3", eventName: "3x3x3 Multi-Blind" }
};
var twizzleEvents = {
  ...wcaEvents,
  fto: { puzzleID: "fto", eventName: "Face-Turning Octahedron" },
  master_tetraminx: {
    puzzleID: "master_tetraminx",
    eventName: "Master Tetraminx"
  },
  kilominx: {
    puzzleID: "kilominx",
    eventName: "Kilominx"
  },
  redi_cube: {
    puzzleID: "redi_cube",
    eventName: "Redi Cube"
  },
  loopover: {
    puzzleID: "loopover",
    eventName: "Loopover"
  }
};
var cube2x2x2 = {
  id: "2x2x2",
  fullName: "2\xD72\xD72 Cube",
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).cube2x2x2JSON
    )
  ),
  svg: async () => (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).cube2x2x2SVG,
  llSVG: getCached(
    async () => (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).cube2x2x2LLSVG
  ),
  pg: getCached(async () => {
    return asyncGetPuzzleGeometry("2x2x2");
  }),
  stickeringMask: (stickering) => cubeLikeStickeringMask(cube2x2x2, stickering),
  stickerings: () => cubeLikeStickeringList("2x2x2", { use3x3x3Fallbacks: true })
};
function makeSourceInfo(moveStrings, type, from2, to) {
  const output = [];
  for (const moveString of moveStrings) {
    const move = Move.fromString(moveString);
    const { family, amount: direction } = move;
    if (![-1, 1].includes(direction)) {
      throw new Error("Invalid config move");
    }
    output.push({ family, direction, type, from: from2, to });
  }
  return output;
}
var axisInfos = {
  [
    "x axis"
    /* X */
  ]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["R"], 0, 0, 3),
      ...makeSourceInfo(["L'"], 1, 0, 3),
      ...makeSourceInfo(["r", "Rw"], 2, 0, 2),
      ...makeSourceInfo(["l'", "Lw'"], 3, 0, 2),
      ...makeSourceInfo(["M'"], 4, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["x", "Uv", "Dv'"], 5, 0, 3)
      // TODO: remove some indices?
    ]
  },
  [
    "y axis"
    /* Y */
  ]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["U"], 0, 0, 3),
      ...makeSourceInfo(["D'"], 1, 0, 3),
      ...makeSourceInfo(["u", "Uw"], 2, 0, 2),
      ...makeSourceInfo(["d'", "Dw'"], 3, 0, 2),
      ...makeSourceInfo(["E'"], 4, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["y", "Uv", "Dv'"], 5, 0, 3)
      // TODO: remove some indices?
    ]
  },
  [
    "z axis"
    /* Z */
  ]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["F"], 0, 0, 3),
      ...makeSourceInfo(["B'"], 1, 0, 3),
      ...makeSourceInfo(["f", "Fw"], 2, 0, 3),
      ...makeSourceInfo(["b'", "Bw'"], 3, 0, 3),
      ...makeSourceInfo(["S"], 4, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["z", "Fv", "Bv'"], 5, 0, 3)
      // TODO: remove some indices?
    ]
  }
};
var byFamily = {};
for (const [axis, info] of Object.entries(axisInfos)) {
  for (const moveSourceInfo of info.moveSourceInfos) {
    byFamily[moveSourceInfo.family] = { axis, moveSourceInfo };
  }
}
var byAxisThenType = {};
var _a4;
for (const axis of Object.keys(axisInfos)) {
  const entry = {};
  byAxisThenType[axis] = entry;
  for (const moveSourceInfo of axisInfos[axis].moveSourceInfos) {
    (entry[_a4 = moveSourceInfo.type] ?? (entry[_a4] = [])).push(moveSourceInfo);
  }
}
var byAxisThenSpecificSlices = {};
for (const axis of Object.keys(axisInfos)) {
  const entry = /* @__PURE__ */ new Map();
  byAxisThenSpecificSlices[axis] = entry;
  for (const moveSourceInfo of axisInfos[axis].moveSourceInfos) {
    if (!entry.get(moveSourceInfo.from)) {
      entry.set(moveSourceInfo.from, moveSourceInfo);
    }
  }
}
function firstOfType(axis, moveSourceType) {
  const entry = byAxisThenType[axis][moveSourceType]?.[0];
  if (!entry) {
    throw new Error(
      `Could not find a reference move (axis: ${axis}, move source type: ${moveSourceType})`
    );
  }
  return entry;
}
var areQuantumMovesSameAxis = (quantumMove1, quantumMove2) => {
  return byFamily[quantumMove1.family].axis === byFamily[quantumMove2.family].axis;
};
function simplestMove(axis, from2, to, directedAmount) {
  if (from2 + 1 === to) {
    const sliceSpecificInfo = byAxisThenSpecificSlices[axis].get(from2);
    if (sliceSpecificInfo) {
      return new Move(
        new QuantumMove(sliceSpecificInfo.family),
        directedAmount * sliceSpecificInfo.direction
      );
    }
  }
  const axisInfo = axisInfos[axis];
  const { sliceDiameter } = axisInfo;
  if (from2 === 0 && to === sliceDiameter) {
    const moveSourceInfo2 = firstOfType(
      axis,
      5
      /* ROTATION */
    );
    return new Move(
      new QuantumMove(moveSourceInfo2.family),
      directedAmount * moveSourceInfo2.direction
    );
  }
  const far = from2 + to > sliceDiameter;
  if (far) {
    [from2, to] = [sliceDiameter - to, sliceDiameter - from2];
  }
  let outerLayer = from2 + 1;
  let innerLayer = to;
  const slice = outerLayer === innerLayer;
  if (slice) {
    innerLayer = null;
  }
  if (outerLayer === 1) {
    outerLayer = null;
  }
  if (slice && outerLayer === 1) {
    innerLayer = null;
  }
  if (!slice && innerLayer === 2) {
    innerLayer = null;
  }
  const moveSourceType = slice ? far ? 1 : 0 : far ? 3 : 2;
  const moveSourceInfo = firstOfType(axis, moveSourceType);
  return new Move(
    new QuantumMove(moveSourceInfo.family, innerLayer, outerLayer),
    directedAmount * moveSourceInfo.direction
  );
}
function simplifySameAxisMoves(moves, quantumMod = true) {
  if (moves.length === 0) {
    return [];
  }
  const axis = byFamily[moves[0].family].axis;
  const axisInfo = axisInfos[axis];
  const { sliceDiameter } = axisInfo;
  const sliceDeltas = /* @__PURE__ */ new Map();
  let lastCandidateRange = null;
  function adjustValue(idx, relativeDelta) {
    let newDelta = (sliceDeltas.get(idx) ?? 0) + relativeDelta;
    if (quantumMod) {
      newDelta = newDelta % 4 + 5 % 4 - 1;
    }
    if (newDelta === 0) {
      sliceDeltas.delete(idx);
    } else {
      sliceDeltas.set(idx, newDelta);
    }
  }
  let suffixLength = 0;
  for (const move of Array.from(moves).reverse()) {
    suffixLength++;
    const { moveSourceInfo } = byFamily[move.family];
    const directedAmount2 = move.amount * moveSourceInfo.direction;
    switch (moveSourceInfo.type) {
      case 0: {
        const idx = (move.innerLayer ?? 1) - 1;
        adjustValue(idx, directedAmount2);
        adjustValue(idx + 1, -directedAmount2);
        break;
      }
      case 1: {
        const idx = sliceDiameter - (move.innerLayer ?? 1);
        adjustValue(idx, directedAmount2);
        adjustValue(idx + 1, -directedAmount2);
        break;
      }
      case 2: {
        adjustValue((move.outerLayer ?? 1) - 1, directedAmount2);
        adjustValue(move.innerLayer ?? 2, -directedAmount2);
        break;
      }
      case 3: {
        adjustValue(sliceDiameter - (move.innerLayer ?? 2), directedAmount2);
        adjustValue(
          sliceDiameter - ((move.outerLayer ?? 1) - 1),
          -directedAmount2
        );
        break;
      }
      case 4: {
        adjustValue(moveSourceInfo.from, directedAmount2);
        adjustValue(moveSourceInfo.to, -directedAmount2);
        break;
      }
      case 5: {
        adjustValue(0, directedAmount2);
        adjustValue(sliceDiameter, -directedAmount2);
        break;
      }
    }
    if ([0, 2].includes(sliceDeltas.size)) {
      lastCandidateRange = { suffixLength, sliceDeltas: new Map(sliceDeltas) };
    }
  }
  if (sliceDeltas.size === 0) {
    return [];
  }
  if (!lastCandidateRange) {
    return moves;
  }
  let [from2, to] = lastCandidateRange.sliceDeltas.keys();
  if (from2 > to) {
    [from2, to] = [to, from2];
  }
  const directedAmount = lastCandidateRange.sliceDeltas.get(from2);
  return [
    ...moves.slice(0, -lastCandidateRange.suffixLength),
    ...directedAmount !== 0 ? [simplestMove(axis, from2, to, directedAmount)] : []
  ];
}
var puzzleSpecificSimplifyOptions333 = {
  quantumMoveOrder: () => 4,
  // doQuantumMovesCommute: areQuantumMovesSameAxis,
  axis: { areQuantumMovesSameAxis, simplifySameAxisMoves }
};
var cube3x3x3 = {
  id: "3x3x3",
  fullName: "3\xD73\xD73 Cube",
  inventedBy: ["Ern\u0151 Rubik"],
  inventionYear: 1974,
  // https://en.wikipedia.org/wiki/Rubik%27s_Cube#Conception_and_development
  kpuzzle: getCached(async () => {
    return experimental3x3x3KPuzzle;
  }),
  svg: getCached(async () => {
    return (await import("./puzzles-dynamic-3x3x3-JWIWLLZA-HDLCRDZH.js")).cube3x3x3SVG;
  }),
  llSVG: getCached(async () => {
    return (await import("./puzzles-dynamic-3x3x3-JWIWLLZA-HDLCRDZH.js")).cube3x3x3LLSVG;
  }),
  llFaceSVG: getCached(async () => {
    return (await import("./puzzles-dynamic-3x3x3-JWIWLLZA-HDLCRDZH.js")).cube3x3x3LLFaceSVG;
  }),
  pg: getCached(async () => {
    return asyncGetPuzzleGeometry("3x3x3");
  }),
  stickeringMask: (stickering) => cubeLikeStickeringMask(cube3x3x3, stickering),
  stickerings: () => cubeLikeStickeringList("3x3x3"),
  puzzleSpecificSimplifyOptions: puzzleSpecificSimplifyOptions333
};
var clock = {
  id: "clock",
  fullName: "Clock",
  inventedBy: ["Christopher C. Wiggs", "Christopher J. Taylor"],
  inventionYear: 1988,
  // Patent application year: https://www.jaapsch.net/puzzles/patents/us4869506.pdf
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).clockJSON
    )
  ),
  svg: getCached(async () => {
    return (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).clockSVG;
  })
};
async function ftoStickering(puzzleLoader, stickering) {
  const kpuzzle = await puzzleLoader.kpuzzle();
  const puzzleStickering = new PuzzleStickering(kpuzzle);
  const m = new StickeringManager(kpuzzle);
  const experimentalFTO_FC = () => m.and([m.move("U"), m.not(m.or(m.moves(["F", "BL", "BR"])))]);
  const experimentalFTO_F2T = () => m.and([m.move("U"), m.not(m.move("F"))]);
  const experimentalFTO_SC = () => m.or([
    experimentalFTO_F2T(),
    m.and([m.move("F"), m.not(m.or(m.moves(["U", "BL", "BR"])))])
  ]);
  const experimentalFTO_L2C = () => m.not(
    m.or([
      m.and([m.move("U"), m.move("F")]),
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ])
  );
  const experimentalFTO_LBT = () => m.not(
    m.or([
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ])
  );
  switch (stickering) {
    case "full":
      break;
    case "experimental-fto-fc": {
      puzzleStickering.set(
        m.not(experimentalFTO_FC()),
        "Ignored"
        /* Ignored */
      );
      break;
    }
    case "experimental-fto-f2t": {
      puzzleStickering.set(
        m.not(experimentalFTO_F2T()),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        experimentalFTO_FC(),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "experimental-fto-sc": {
      puzzleStickering.set(
        m.not(experimentalFTO_SC()),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        experimentalFTO_F2T(),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "experimental-fto-l2c": {
      puzzleStickering.set(
        m.not(experimentalFTO_L2C()),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        experimentalFTO_SC(),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "experimental-fto-lbt": {
      puzzleStickering.set(
        m.not(experimentalFTO_LBT()),
        "Ignored"
        /* Ignored */
      );
      puzzleStickering.set(
        experimentalFTO_L2C(),
        "Dim"
        /* Dim */
      );
      break;
    }
    case "experimental-fto-l3t": {
      puzzleStickering.set(
        experimentalFTO_LBT(),
        "Dim"
        /* Dim */
      );
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
      );
      puzzleStickering.set(
        m.and(m.moves([])),
        "Dim"
        /* Dim */
      );
  }
  return puzzleStickering.toStickeringMask();
}
async function ftoStickerings() {
  return [
    "full",
    "experimental-fto-fc",
    "experimental-fto-f2t",
    "experimental-fto-sc",
    "experimental-fto-l2c",
    "experimental-fto-lbt",
    "experimental-fto-l3t"
  ];
}
var FTOPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      pgID: "FTO",
      id: "fto",
      fullName: "Face-Turning Octahedron",
      inventedBy: ["Karl Rohrbach", "David Pitcher"],
      // http://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1663
      inventionYear: 1983
      // http://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1663
    });
    __publicField(this, "stickerings", ftoStickerings);
    __publicField(this, "svg", getCached(async () => {
      return (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).ftoSVG;
    }));
  }
  stickeringMask(stickering) {
    return ftoStickering(this, stickering);
  }
};
var fto = new FTOPuzzleLoader();
async function megaminxStickeringMask(puzzleLoader, stickering) {
  if ((await megaminxStickerings()).includes(stickering)) {
    return cubeLikeStickeringMask(puzzleLoader, stickering);
  }
  console.warn(
    `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
  );
  return cubeLikeStickeringMask(puzzleLoader, "full");
}
var megaminxStickeringListPromise = from(
  () => cubeLikeStickeringList("megaminx")
);
function megaminxStickerings() {
  return megaminxStickeringListPromise;
}
var MegaminxPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      id: "megaminx",
      fullName: "Megaminx",
      // Too many simultaneous inventors to name.
      inventionYear: 1981
      // Earliest date from https://www.jaapsch.net/puzzles/megaminx.htm
    });
    __publicField(this, "stickerings", megaminxStickerings);
    __publicField(this, "llSVG", getCached(async () => {
      return (await import("./puzzles-dynamic-megaminx-2LVHIDL4-RPAIK3CT.js")).megaminxLLSVG;
    }));
  }
  stickeringMask(stickering) {
    return megaminxStickeringMask(this, stickering);
  }
};
var megaminx = new MegaminxPuzzleLoader();
var PyraminxPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      id: "pyraminx",
      fullName: "Pyraminx",
      inventedBy: ["Uwe Meffert"]
    });
    __publicField(this, "svg", getCached(async () => {
      return (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).pyraminxSVG;
    }));
  }
};
var pyraminx = new PyraminxPuzzleLoader();
var square1 = {
  id: "square1",
  fullName: "Square-1",
  inventedBy: ["Karel Hr\u0161el", "Vojtech Kopsk\xFD"],
  inventionYear: 1990,
  // Czech patent application year: http://spisy.upv.cz/Patents/FullDocuments/277/277266.pdf
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).sq1HyperOrbitJSON
    )
  ),
  svg: getCached(async () => {
    return (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).sq1HyperOrbitSVG;
  })
};
var KILOMINX_PUZZLE_DESCRIPTION = "d f 0.56";
var kilominx = {
  id: "kilominx",
  fullName: "Kilominx",
  kpuzzle: getCached(
    () => asyncGetKPuzzleByDesc(KILOMINX_PUZZLE_DESCRIPTION, {
      includeCenterOrbits: false,
      includeEdgeOrbits: false
    })
  ),
  pg: () => descAsyncGetPuzzleGeometry(KILOMINX_PUZZLE_DESCRIPTION, {
    includeCenterOrbits: false,
    includeEdgeOrbits: false
  }),
  svg: getCached(async () => {
    return (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).kilominxSVG;
  })
};
var rediCube = {
  id: "redi_cube",
  fullName: "Redi Cube",
  // Announced 2009-07-21: https://www.youtube.com/watch?v=cjfMzA1u3vM
  // https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1520
  inventedBy: ["Oskar van Deventer"],
  inventionYear: 2009,
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).rediCubeJSON
    )
  ),
  svg: async () => {
    return (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).rediCubeSVG;
  }
};
var cube4x4x4 = new CubePGPuzzleLoader({
  id: "4x4x4",
  fullName: "4\xD74\xD74 Cube"
});
cube4x4x4.llSVG = getCached(async () => {
  return (await import("./puzzles-dynamic-4x4x4-REUXFQJ4-EEW27S55.js")).cube4x4x4LLSVG;
});
var melindas2x2x2x2 = {
  id: "melindas2x2x2x2",
  fullName: "Melinda's 2\xD72\xD72\xD72",
  inventedBy: ["Melinda Green"],
  // inventionYear: 20__, // TODO
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).melindas2x2x2x2OrbitJSON
    )
  ),
  svg: getCached(async () => {
    return (await import("./puzzles-dynamic-side-events-FJHPJOLC-5N6CFNPE.js")).melindas2x2x2x2OrbitSVG;
  })
};
var loopover = {
  id: "loopover",
  fullName: "Loopover",
  inventedBy: ["Cary Huang"],
  inventionYear: 2018,
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).loopoverJSON
    )
  ),
  svg: async () => {
    return (await import("./puzzles-dynamic-unofficial-EE5FDJ3S-4PFU3PC5.js")).loopoverSVG;
  }
};
var puzzles = {
  /******** Start of WCA Puzzles *******/
  "3x3x3": cube3x3x3,
  "2x2x2": cube2x2x2,
  "4x4x4": cube4x4x4,
  "5x5x5": new CubePGPuzzleLoader({ id: "5x5x5", fullName: "5\xD75\xD75 Cube" }),
  "6x6x6": new CubePGPuzzleLoader({ id: "6x6x6", fullName: "6\xD76\xD76 Cube" }),
  "7x7x7": new CubePGPuzzleLoader({ id: "7x7x7", fullName: "7\xD77\xD77 Cube" }),
  "40x40x40": new CubePGPuzzleLoader({
    id: "40x40x40",
    fullName: "40\xD740\xD740 Cube"
  }),
  // 3x3x3 Blindfolded
  // 3x3x3 Fewest Moves
  // 3x3x3 One-Handed
  clock,
  megaminx,
  pyraminx,
  skewb: new PGPuzzleLoader({
    id: "skewb",
    fullName: "Skewb",
    inventedBy: ["Tony Durham"]
    // https://www.jaapsch.net/puzzles/skewb.htm
    // inventionYear: 1982, // 1982 is actually the year of Hofstadter's column.
  }),
  square1,
  // 4x4x4 Blindfolded
  // 5x5x5 Blindfolded
  /******** End of WCA puzzles ********/
  fto,
  gigaminx: new PGPuzzleLoader({
    id: "gigaminx",
    fullName: "Gigaminx",
    inventedBy: ["Tyler Fox"],
    inventionYear: 2006
    // Earliest date from https://www.twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1475
  }),
  master_tetraminx: new PGPuzzleLoader({
    pgID: "master tetraminx",
    id: "master_tetraminx",
    fullName: "Master Tetraminx",
    inventedBy: ["Katsuhiko Okamoto"],
    // Using master pyraminx: https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1352
    inventionYear: 2002
    // Using master pyraminx: https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1352
  }),
  kilominx,
  redi_cube: rediCube,
  melindas2x2x2x2,
  loopover
};

export {
  KPattern,
  KPuzzle,
  getFaceletStickeringMask,
  getPieceStickeringMask,
  from,
  cube3x3x3KPuzzleDefinition,
  getPartialAppendOptionsForPuzzleSpecificSimplifyOptions,
  customPGPuzzleLoader,
  cube2x2x2,
  cube3x3x3,
  puzzles
};
//# sourceMappingURL=chunk-62BIKP6W.js.map
