import {
  randomScrambleForEvent
} from "./chunks/chunk-ZHGLOAAL.js";
import {
  countAnimatedLeaves,
  countMetricMoves,
  countMoves
} from "./chunks/chunk-7N4DU3WZ.js";
import "./chunks/chunk-M2B7MMQB.js";
import "./chunks/chunk-N4ZS44MS.js";
import "./chunks/chunk-WZQDTJZ3.js";
import {
  CSSSource,
  DEGREES_PER_RADIAN,
  FreshListenerManager,
  HTMLElementShim,
  HintFaceletProp,
  ManagedCustomElement,
  NO_VALUE,
  RenderScheduler,
  SimpleTwistyPropSource,
  StaleDropper,
  THREEJS,
  Twisty3DVantage,
  TwistyPropDerived,
  TwistyPropSource,
  customElementsShim,
  proxy3D,
  rawRenderPooled,
  setCameraFromOrbitCoordinates
} from "./chunks/chunk-JXHL5ECY.js";
import {
  cube3x3x3,
  customPGPuzzleLoader,
  getPartialAppendOptionsForPuzzleSpecificSimplifyOptions,
  getPieceStickeringMask,
  puzzles
} from "./chunks/chunk-62BIKP6W.js";
import {
  Alg,
  AlgBuilder,
  Conjugate,
  Grouping,
  Move,
  Pause,
  TraversalDownUp,
  TraversalUp,
  direct,
  directedGenerator,
  experimentalAppendMove,
  functionFromTraversal,
  offsetMod
} from "./chunks/chunk-LLF73NS3.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __publicField
} from "./chunks/chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/twisty/index.js
function directionScalar(direction) {
  return direction;
}
function arrayEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function arrayEqualsCompare(a, b, compare) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (!compare(a[i], b[i])) {
      return false;
    }
  }
  return true;
}
function modIntoRange(v, rangeMin, rangeMax) {
  return offsetMod(v, rangeMax - rangeMin, rangeMin);
}
var CatchUpHelper = class {
  constructor(model) {
    __publicField(this, "catchingUp", false);
    __publicField(this, "pendingFrame", false);
    __publicField(this, "tempoScale");
    __publicField(this, "scheduler", new RenderScheduler(
      this.animFrame.bind(this)
    ));
    __publicField(this, "catchUpMs", 500);
    __publicField(this, "lastTimestamp", 0);
    this.model = model;
    model.tempoScale.addFreshListener((tempoScale) => {
      this.tempoScale = tempoScale;
    });
  }
  start() {
    if (!this.catchingUp) {
      this.lastTimestamp = performance.now();
    }
    this.catchingUp = true;
    this.pendingFrame = true;
    this.scheduler.requestAnimFrame();
  }
  stop() {
    this.catchingUp = false;
    this.scheduler.cancelAnimFrame();
  }
  animFrame(timestamp) {
    this.scheduler.requestAnimFrame();
    const delta = this.tempoScale * (timestamp - this.lastTimestamp) / this.catchUpMs;
    this.lastTimestamp = timestamp;
    this.model.catchUpMove.set(
      (async () => {
        const previousCatchUpMove = await this.model.catchUpMove.get();
        if (previousCatchUpMove.move === null) {
          return previousCatchUpMove;
        }
        const amount = previousCatchUpMove.amount + delta;
        if (amount >= 1) {
          this.pendingFrame = true;
          this.stop();
          this.model.timestampRequest.set("end");
          return {
            move: null,
            amount: 0
          };
        }
        this.pendingFrame = false;
        return {
          move: previousCatchUpMove.move,
          amount
        };
      })()
    );
  }
};
var _effectiveTimestampMilliseconds, effectiveTimestampMilliseconds_fn, _animFrameEffectiveTimestampStaleDropper, _a;
var TwistyAnimationController = (_a = class {
  constructor(model, delegate) {
    __privateAdd(this, _effectiveTimestampMilliseconds);
    // TODO: #private?
    __publicField(this, "playing", false);
    __publicField(this, "direction", 1);
    __publicField(this, "catchUpHelper");
    __publicField(this, "model");
    __publicField(this, "lastDatestamp", 0);
    __publicField(this, "lastTimestampPromise");
    __publicField(this, "scheduler", new RenderScheduler(
      this.animFrame.bind(this)
    ));
    __privateAdd(this, _animFrameEffectiveTimestampStaleDropper, new StaleDropper());
    this.delegate = delegate;
    this.model = model;
    this.lastTimestampPromise = __privateMethod(this, _effectiveTimestampMilliseconds, effectiveTimestampMilliseconds_fn).call(this);
    this.model.playingInfo.addFreshListener(this.onPlayingProp.bind(this));
    this.catchUpHelper = new CatchUpHelper(this.model);
    this.model.catchUpMove.addFreshListener(this.onCatchUpMoveProp.bind(this));
  }
  // TODO: Do we need this?
  async onPlayingProp(playingInfo) {
    if (playingInfo.playing !== this.playing) {
      playingInfo.playing ? this.play(playingInfo) : this.pause();
    }
  }
  // TODO: Do we need this?
  async onCatchUpMoveProp(catchUpMove) {
    const catchingUp = catchUpMove.move !== null;
    if (catchingUp !== this.catchUpHelper.catchingUp) {
      catchingUp ? this.catchUpHelper.start() : this.catchUpHelper.stop();
    }
    this.scheduler.requestAnimFrame();
  }
  // TODO: Return the animation we've switched to.
  jumpToStart(options) {
    this.model.timestampRequest.set("start");
    this.pause();
    if (options?.flash) {
      this.delegate.flash();
    }
  }
  // TODO: Return the animation we've switched to.
  jumpToEnd(options) {
    this.model.timestampRequest.set("end");
    this.pause();
    if (options?.flash) {
      this.delegate.flash();
    }
  }
  // TODO: Return the playing info we've switched to.
  playPause() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
  // TODO: bundle playing direction, and boundary into `toggle`.
  async play(options) {
    const direction = options?.direction ?? 1;
    const coarseTimelineInfo = await this.model.coarseTimelineInfo.get();
    if (options?.autoSkipToOtherEndIfStartingAtBoundary ?? true) {
      if (direction === 1 && coarseTimelineInfo.atEnd) {
        this.model.timestampRequest.set("start");
        this.delegate.flash();
      }
      if (direction === -1 && coarseTimelineInfo.atStart) {
        this.model.timestampRequest.set("end");
        this.delegate.flash();
      }
    }
    this.model.playingInfo.set({
      playing: true,
      direction,
      untilBoundary: options?.untilBoundary ?? "entire-timeline",
      loop: options?.loop ?? false
    });
    this.playing = true;
    this.lastDatestamp = performance.now();
    this.lastTimestampPromise = __privateMethod(this, _effectiveTimestampMilliseconds, effectiveTimestampMilliseconds_fn).call(this);
    this.scheduler.requestAnimFrame();
  }
  pause() {
    this.playing = false;
    this.scheduler.cancelAnimFrame();
    this.model.playingInfo.set({
      playing: false,
      untilBoundary: "entire-timeline"
      /* EntireTimeline */
    });
  }
  async animFrame(frameDatestamp) {
    if (this.playing) {
      this.scheduler.requestAnimFrame();
    }
    const lastDatestamp = this.lastDatestamp;
    const freshenerResult = await __privateGet(this, _animFrameEffectiveTimestampStaleDropper).queue(
      Promise.all([
        this.model.playingInfo.get(),
        this.lastTimestampPromise,
        this.model.timeRange.get(),
        this.model.tempoScale.get(),
        this.model.currentMoveInfo.get()
      ])
    );
    const [playingInfo, lastTimestamp, timeRange, tempoScale, currentMoveInfo] = freshenerResult;
    if (!playingInfo.playing) {
      this.playing = false;
      return;
    }
    let end = currentMoveInfo.earliestEnd;
    if (currentMoveInfo.currentMoves.length === 0 || playingInfo.untilBoundary === "entire-timeline") {
      end = timeRange.end;
    }
    let start = currentMoveInfo.latestStart;
    if (currentMoveInfo.currentMoves.length === 0 || playingInfo.untilBoundary === "entire-timeline") {
      start = timeRange.start;
    }
    let delta = (frameDatestamp - lastDatestamp) * directionScalar(this.direction) * tempoScale;
    delta = Math.max(delta, 1);
    delta *= playingInfo.direction;
    let newTimestamp = lastTimestamp + delta;
    let newSmartTimestampRequest = null;
    if (newTimestamp >= end) {
      if (playingInfo.loop) {
        newTimestamp = modIntoRange(
          newTimestamp,
          timeRange.start,
          timeRange.end
        );
      } else {
        if (newTimestamp === timeRange.end) {
          newSmartTimestampRequest = "end";
        } else {
          newTimestamp = end;
        }
        this.playing = false;
        this.model.playingInfo.set({
          playing: false
        });
      }
    } else if (newTimestamp <= start) {
      if (playingInfo.loop) {
        newTimestamp = modIntoRange(
          newTimestamp,
          timeRange.start,
          timeRange.end
        );
      } else {
        if (newTimestamp === timeRange.start) {
          newSmartTimestampRequest = "start";
        } else {
          newTimestamp = start;
        }
        this.playing = false;
        this.model.playingInfo.set({
          playing: false
        });
      }
    }
    this.lastDatestamp = frameDatestamp;
    this.lastTimestampPromise = Promise.resolve(newTimestamp);
    this.model.timestampRequest.set(newSmartTimestampRequest ?? newTimestamp);
  }
}, _effectiveTimestampMilliseconds = new WeakSet(), effectiveTimestampMilliseconds_fn = async function() {
  return (await this.model.detailedTimelineInfo.get()).timestamp;
}, _animFrameEffectiveTimestampStaleDropper = new WeakMap(), _a);
var TwistyPlayerController = class {
  constructor(model, delegate) {
    __publicField(this, "animationController");
    this.model = model;
    this.animationController = new TwistyAnimationController(model, delegate);
  }
  jumpToStart(options) {
    this.animationController.jumpToStart(options);
  }
  jumpToEnd(options) {
    this.animationController.jumpToEnd(options);
  }
  togglePlay(play) {
    if (typeof play === "undefined") {
      this.animationController.playPause();
    }
    play ? this.animationController.play() : this.animationController.pause();
  }
  async visitTwizzleLink() {
    const a = document.createElement("a");
    a.href = await this.model.twizzleLink();
    a.target = "_blank";
    a.click();
  }
};
var controlsLocations = {
  "bottom-row": true,
  // default
  none: true
};
var ControlPanelProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var twistyViewerWrapperCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
}

.wrapper > * {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wrapper.back-view-side-by-side {
  grid-template-columns: 1fr 1fr;
}

.wrapper.back-view-top-right {
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 3fr;
}

.wrapper.back-view-top-right > :nth-child(1) {
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.wrapper.back-view-top-right > :nth-child(2) {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}
`
);
var xmlns = "http://www.w3.org/2000/svg";
var DATA_COPY_ID_ATTRIBUTE = "data-copy-id";
var svgCounter = 0;
function nextSVGID() {
  svgCounter += 1;
  return `svg${svgCounter.toString()}`;
}
var colorMaps = {
  dim: {
    white: "#dddddd",
    orange: "#884400",
    limegreen: "#008800",
    red: "#660000",
    "rgb(34, 102, 255)": "#000088",
    // TODO
    yellow: "#888800",
    "rgb(102, 0, 153)": "rgb(50, 0, 76)",
    purple: "#3f003f"
  },
  oriented: "#44ddcc",
  ignored: "#555555",
  invisible: "#00000000"
};
var TwistyAnimatedSVG = class {
  constructor(kpuzzle, svgSource, experimentalStickeringMask, showUnknownOrientations = false) {
    __publicField(this, "wrapperElement");
    __publicField(this, "svgElement");
    __publicField(this, "gradientDefs");
    __publicField(this, "originalColors", {});
    __publicField(this, "gradients", {});
    __publicField(this, "svgID");
    this.kpuzzle = kpuzzle;
    this.showUnknownOrientations = showUnknownOrientations;
    if (!svgSource) {
      throw new Error(`No SVG definition for puzzle type: ${kpuzzle.name()}`);
    }
    this.svgID = nextSVGID();
    this.wrapperElement = document.createElement("div");
    this.wrapperElement.classList.add("svg-wrapper");
    this.wrapperElement.innerHTML = svgSource;
    const svgElem = this.wrapperElement.querySelector("svg");
    if (!svgElem) {
      throw new Error("Could not get SVG element");
    }
    this.svgElement = svgElem;
    if (xmlns !== svgElem.namespaceURI) {
      throw new Error("Unexpected XML namespace");
    }
    svgElem.style.maxWidth = "100%";
    svgElem.style.maxHeight = "100%";
    this.gradientDefs = document.createElementNS(xmlns, "defs");
    svgElem.insertBefore(this.gradientDefs, svgElem.firstChild);
    for (const orbitDefinition of kpuzzle.definition.orbits) {
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        for (let orientation = 0; orientation < orbitDefinition.numOrientations; orientation++) {
          const id = this.elementID(
            orbitDefinition.orbitName,
            idx,
            orientation
          );
          const elem = this.elementByID(id);
          let originalColor = elem?.style.fill;
          if (experimentalStickeringMask) {
            (() => {
              const a = experimentalStickeringMask.orbits;
              if (!a) {
                return;
              }
              const orbitStickeringMask = a[orbitDefinition.orbitName];
              if (!orbitStickeringMask) {
                return;
              }
              const pieceStickeringMask = orbitStickeringMask.pieces[idx];
              if (!pieceStickeringMask) {
                return;
              }
              const faceletStickeringMasks = pieceStickeringMask.facelets[orientation];
              if (!faceletStickeringMasks) {
                return;
              }
              const stickeringMask = typeof faceletStickeringMasks === "string" ? faceletStickeringMasks : faceletStickeringMasks?.mask;
              const colorMap = colorMaps[stickeringMask];
              if (typeof colorMap === "string") {
                originalColor = colorMap;
              } else if (colorMap) {
                originalColor = colorMap[originalColor];
              }
            })();
          } else {
            originalColor = elem?.style.fill;
          }
          this.originalColors[id] = originalColor;
          this.gradients[id] = this.newGradient(id, originalColor);
          this.gradientDefs.appendChild(this.gradients[id]);
          elem?.setAttribute("style", `fill: url(#grad-${this.svgID}-${id})`);
        }
      }
    }
    for (const hintElem of Array.from(
      svgElem.querySelectorAll(`[${DATA_COPY_ID_ATTRIBUTE}]`)
    )) {
      const id = hintElem.getAttribute(DATA_COPY_ID_ATTRIBUTE);
      hintElem.setAttribute("style", `fill: url(#grad-${this.svgID}-${id})`);
    }
    if (this.showUnknownOrientations) {
      this.drawPattern(this.kpuzzle.defaultPattern());
    }
  }
  drawPattern(pattern, nextPattern, fraction) {
    this.draw(pattern, nextPattern, fraction);
  }
  // TODO: save definition in the constructor?
  draw(pattern, nextPattern, fraction) {
    const nextTransformation = nextPattern?.experimentalToTransformation();
    if (!pattern) {
      throw new Error("Distinguishable pieces are not handled for SVG yet!");
    }
    for (const orbitDefinition of pattern.kpuzzle.definition.orbits) {
      const currentPatternOrbit = pattern.patternData[orbitDefinition.orbitName];
      const nextTransformationOrbit = nextTransformation ? nextTransformation.transformationData[orbitDefinition.orbitName] : null;
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        for (let orientation = 0; orientation < orbitDefinition.numOrientations; orientation++) {
          const id = this.elementID(
            orbitDefinition.orbitName,
            idx,
            orientation
          );
          const fromCur = this.elementID(
            orbitDefinition.orbitName,
            currentPatternOrbit.pieces[idx],
            (orbitDefinition.numOrientations - currentPatternOrbit.orientation[idx] + orientation) % orbitDefinition.numOrientations
          );
          let singleColor = false;
          if (nextTransformationOrbit) {
            const fromNext = this.elementID(
              orbitDefinition.orbitName,
              nextTransformationOrbit.permutation[idx],
              (orbitDefinition.numOrientations - nextTransformationOrbit.orientationDelta[idx] + orientation) % orbitDefinition.numOrientations
            );
            if (fromCur === fromNext) {
              singleColor = true;
            }
            fraction = fraction || 0;
            const easedBackwardsPercent = 100 * (1 - fraction * fraction * (2 - fraction * fraction));
            this.gradients[id].children[0].setAttribute(
              "stop-color",
              this.originalColors[fromCur]
            );
            this.gradients[id].children[0].setAttribute(
              "offset",
              `${Math.max(easedBackwardsPercent - 5, 0)}%`
            );
            this.gradients[id].children[1].setAttribute(
              "offset",
              `${Math.max(easedBackwardsPercent - 5, 0)}%`
            );
            this.gradients[id].children[2].setAttribute(
              "offset",
              `${easedBackwardsPercent}%`
            );
            this.gradients[id].children[3].setAttribute(
              "offset",
              `${easedBackwardsPercent}%`
            );
            this.gradients[id].children[3].setAttribute(
              "stop-color",
              this.originalColors[fromNext]
            );
          } else {
            singleColor = true;
          }
          if (singleColor) {
            if (this.showUnknownOrientations && currentPatternOrbit.orientationMod?.[idx] === 1) {
              this.gradients[id].children[0].setAttribute("stop-color", "#000");
              this.gradients[id].children[0].setAttribute("offset", "5%");
              this.gradients[id].children[1].setAttribute("offset", "5%");
              this.gradients[id].children[2].setAttribute("offset", "20%");
              this.gradients[id].children[3].setAttribute("offset", "20%");
              this.gradients[id].children[3].setAttribute(
                "stop-color",
                this.originalColors[fromCur]
              );
            } else {
              this.gradients[id].children[0].setAttribute(
                "stop-color",
                this.originalColors[fromCur]
              );
              this.gradients[id].children[0].setAttribute("offset", "100%");
              this.gradients[id].children[1].setAttribute("offset", "100%");
              this.gradients[id].children[2].setAttribute("offset", "100%");
              this.gradients[id].children[3].setAttribute("offset", "100%");
            }
          }
        }
      }
    }
  }
  newGradient(id, originalColor) {
    const grad = document.createElementNS(
      xmlns,
      "radialGradient"
    );
    grad.setAttribute("id", `grad-${this.svgID}-${id}`);
    grad.setAttribute("r", "70.7107%");
    const stopDefs = [
      { offset: 0, color: originalColor },
      { offset: 0, color: "black" },
      { offset: 0, color: "black" },
      { offset: 0, color: originalColor }
    ];
    for (const stopDef of stopDefs) {
      const stop = document.createElementNS(xmlns, "stop");
      stop.setAttribute("offset", `${stopDef.offset}%`);
      stop.setAttribute("stop-color", stopDef.color);
      stop.setAttribute("stop-opacity", "1");
      grad.appendChild(stop);
    }
    return grad;
  }
  elementID(orbitName, idx, orientation) {
    return `${orbitName}-l${idx}-o${orientation}`;
  }
  elementByID(id) {
    return this.wrapperElement.querySelector(`#${id}`);
  }
};
var twisty2DSVGCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
}

.svg-wrapper,
twisty-2d-svg,
svg {
  width: 100%;
  height: 100%;
  display: grid;
  min-height: 0;
}

svg {
  animation: fade-in 0.25s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
`
);
var _cachedPosition, _freshListenerManager, _a2;
var Twisty2DPuzzle = (_a2 = class extends ManagedCustomElement {
  // TODO: pull when needed.
  constructor(model, kpuzzle, svgSource, options, puzzleLoader) {
    super();
    __publicField(this, "svgWrapper");
    __publicField(this, "scheduler", new RenderScheduler(this.render.bind(this)));
    __privateAdd(this, _cachedPosition, null);
    __privateAdd(this, _freshListenerManager, new FreshListenerManager());
    this.model = model;
    this.kpuzzle = kpuzzle;
    this.svgSource = svgSource;
    this.options = options;
    this.puzzleLoader = puzzleLoader;
    this.addCSS(twisty2DSVGCSS);
    this.resetSVG();
    __privateGet(this, _freshListenerManager).addListener(
      this.model.puzzleID,
      (puzzleID) => {
        if (puzzleLoader?.id !== puzzleID) {
          this.disconnect();
        }
      }
    );
    __privateGet(this, _freshListenerManager).addListener(
      this.model.legacyPosition,
      this.onPositionChange.bind(this)
    );
    if (this.options?.experimentalStickeringMask) {
      this.experimentalSetStickeringMask(
        this.options.experimentalStickeringMask
      );
    }
  }
  disconnect() {
    __privateGet(this, _freshListenerManager).disconnect();
  }
  onPositionChange(position) {
    try {
      if (position.movesInProgress.length > 0) {
        const move = position.movesInProgress[0].move;
        let partialMove = move;
        if (position.movesInProgress[0].direction === -1) {
          partialMove = move.invert();
        }
        const newPattern = position.pattern.applyMove(partialMove);
        this.svgWrapper.draw(
          position.pattern,
          newPattern,
          position.movesInProgress[0].fraction
        );
      } else {
        this.svgWrapper.draw(position.pattern);
        __privateSet(this, _cachedPosition, position);
      }
    } catch (e) {
      console.warn(
        "Bad position (this doesn't necessarily mean something is wrong). Pre-emptively disconnecting:",
        this.puzzleLoader?.id,
        e
      );
      this.disconnect();
    }
  }
  scheduleRender() {
    this.scheduler.requestAnimFrame();
  }
  experimentalSetStickeringMask(stickeringMask) {
    this.resetSVG(stickeringMask);
  }
  // TODO: do this without constructing a new SVG.
  resetSVG(stickeringMask) {
    if (this.svgWrapper) {
      this.removeElement(this.svgWrapper.wrapperElement);
    }
    if (!this.kpuzzle) {
      return;
    }
    this.svgWrapper = new TwistyAnimatedSVG(
      this.kpuzzle,
      this.svgSource,
      stickeringMask
    );
    this.addElement(this.svgWrapper.wrapperElement);
    if (__privateGet(this, _cachedPosition)) {
      this.onPositionChange(__privateGet(this, _cachedPosition));
    }
  }
  render() {
  }
}, _cachedPosition = new WeakMap(), _freshListenerManager = new WeakMap(), _a2);
customElementsShim.define("twisty-2d-puzzle", Twisty2DPuzzle);
var _freshListenerManager2, _cachedTwisty2DPuzzle, _a3;
var Twisty2DPuzzleWrapper = (_a3 = class {
  constructor(model, schedulable, puzzleLoader, effectiveVisualization) {
    __privateAdd(this, _freshListenerManager2, new FreshListenerManager());
    __privateAdd(this, _cachedTwisty2DPuzzle, null);
    this.model = model;
    this.schedulable = schedulable;
    this.puzzleLoader = puzzleLoader;
    this.effectiveVisualization = effectiveVisualization;
    this.twisty2DPuzzle();
    __privateGet(this, _freshListenerManager2).addListener(
      this.model.twistySceneModel.stickeringMask,
      async (stickeringMask) => {
        (await this.twisty2DPuzzle()).experimentalSetStickeringMask(
          stickeringMask
        );
      }
    );
  }
  disconnect() {
    __privateGet(this, _freshListenerManager2).disconnect();
  }
  // TODO: Hook this up nicely.
  scheduleRender() {
  }
  // TODO: Stale dropper?
  async twisty2DPuzzle() {
    return __privateGet(this, _cachedTwisty2DPuzzle) ?? __privateSet(this, _cachedTwisty2DPuzzle, (async () => {
      const svgPromise = this.effectiveVisualization === "experimental-2D-LL-face" ? this.puzzleLoader.llFaceSVG() : this.effectiveVisualization === "experimental-2D-LL" ? this.puzzleLoader.llSVG() : this.puzzleLoader.svg();
      return new Twisty2DPuzzle(
        this.model,
        await this.puzzleLoader.kpuzzle(),
        await svgPromise,
        {},
        this.puzzleLoader
      );
    })());
  }
}, _freshListenerManager2 = new WeakMap(), _cachedTwisty2DPuzzle = new WeakMap(), _a3);
var _freshListenerManager3, _cachedScene, _currentTwisty2DPuzzleWrapper, _a4;
var Twisty2DSceneWrapper = (_a4 = class extends ManagedCustomElement {
  constructor(model, effectiveVisualization) {
    super();
    __privateAdd(this, _freshListenerManager3, new FreshListenerManager());
    __privateAdd(this, _cachedScene, void 0);
    __privateAdd(this, _currentTwisty2DPuzzleWrapper, null);
    this.model = model;
    this.effectiveVisualization = effectiveVisualization;
  }
  disconnect() {
    __privateGet(this, _freshListenerManager3).disconnect();
  }
  async connectedCallback() {
    this.addCSS(twistyViewerWrapperCSS);
    if (this.model) {
      __privateGet(this, _freshListenerManager3).addListener(
        this.model.twistyPlayerModel.puzzleLoader,
        this.onPuzzleLoader.bind(this)
      );
    }
  }
  async scene() {
    return __privateGet(this, _cachedScene) ?? __privateSet(this, _cachedScene, (async () => new (await THREEJS).Scene())());
  }
  scheduleRender() {
    __privateGet(this, _currentTwisty2DPuzzleWrapper)?.scheduleRender();
  }
  currentTwisty2DPuzzleWrapper() {
    return __privateGet(this, _currentTwisty2DPuzzleWrapper);
  }
  // #oldTwisty3DPuzzleWrappers: Twisty3DPuzzleWrapper[] = []; // TODO: Animate these out.
  async setCurrentTwisty2DPuzzleWrapper(twisty2DPuzzleWrapper) {
    const old = __privateGet(this, _currentTwisty2DPuzzleWrapper);
    __privateSet(this, _currentTwisty2DPuzzleWrapper, twisty2DPuzzleWrapper);
    old?.disconnect();
    const twisty2DPuzzlePromise = twisty2DPuzzleWrapper.twisty2DPuzzle();
    this.contentWrapper.textContent = "";
    this.addElement(await twisty2DPuzzlePromise);
  }
  async onPuzzleLoader(puzzleLoader) {
    __privateGet(this, _currentTwisty2DPuzzleWrapper)?.disconnect();
    const twisty2DPuzzleWrapper = new Twisty2DPuzzleWrapper(
      this.model.twistyPlayerModel,
      this,
      puzzleLoader,
      this.effectiveVisualization
    );
    this.setCurrentTwisty2DPuzzleWrapper(twisty2DPuzzleWrapper);
  }
}, _freshListenerManager3 = new WeakMap(), _cachedScene = new WeakMap(), _currentTwisty2DPuzzleWrapper = new WeakMap(), _a4);
customElementsShim.define("twisty-2d-scene-wrapper", Twisty2DSceneWrapper);
var _currentClassName, _a5;
var ClassListManager = (_a5 = class {
  // The prefix should ideally end in a dash.
  constructor(elem, prefix, validSuffixes) {
    __privateAdd(this, _currentClassName, null);
    this.elem = elem;
    this.prefix = prefix;
    this.validSuffixes = validSuffixes;
  }
  // Does nothing if there was no value.
  clearValue() {
    if (__privateGet(this, _currentClassName)) {
      this.elem.contentWrapper.classList.remove(__privateGet(this, _currentClassName));
    }
    __privateSet(this, _currentClassName, null);
  }
  // Returns if the value changed
  setValue(suffix) {
    if (!this.validSuffixes.includes(suffix)) {
      throw new Error(`Invalid suffix: ${suffix}`);
    }
    const newClassName = `${this.prefix}${suffix}`;
    const changed = __privateGet(this, _currentClassName) !== newClassName;
    if (changed) {
      this.clearValue();
      this.elem.contentWrapper.classList.add(newClassName);
      __privateSet(this, _currentClassName, newClassName);
    }
    return changed;
  }
}, _currentClassName = new WeakMap(), _a5);
var _resolve, _a6;
var InitialValueTracker = (_a6 = class {
  constructor() {
    __privateAdd(this, _resolve, void 0);
    __publicField(this, "reject");
    // TODO: AbortController?
    __publicField(this, "promise", new Promise((resolve, reject) => {
      __privateSet(this, _resolve, resolve);
      this.reject = reject;
    }));
  }
  handleNewValue(t) {
    __privateGet(this, _resolve).call(this, t);
  }
}, _resolve = new WeakMap(), _a6);
var _freshListenerManager4, _cachedTwisty3DPuzzle, _a7;
var Twisty3DPuzzleWrapper = (_a7 = class extends EventTarget {
  constructor(model, schedulable, puzzleLoader, visualizationStrategy) {
    super();
    __privateAdd(this, _freshListenerManager4, new FreshListenerManager());
    __privateAdd(this, _cachedTwisty3DPuzzle, null);
    this.model = model;
    this.schedulable = schedulable;
    this.puzzleLoader = puzzleLoader;
    this.visualizationStrategy = visualizationStrategy;
    this.twisty3DPuzzle();
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.puzzleLoader,
      (puzzleLoader2) => {
        if (this.puzzleLoader.id !== puzzleLoader2.id) {
          this.disconnect();
        }
      }
    );
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.legacyPosition,
      async (position) => {
        try {
          (await this.twisty3DPuzzle()).onPositionChange(position);
          this.scheduleRender();
        } catch (e) {
          this.disconnect();
        }
      }
    );
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.twistySceneModel.hintFacelet,
      async (hintFaceletStyle) => {
        (await this.twisty3DPuzzle()).experimentalUpdateOptions({
          hintFacelets: hintFaceletStyle === "auto" ? "floating" : hintFaceletStyle
        });
        this.scheduleRender();
      }
    );
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.twistySceneModel.foundationDisplay,
      async (foundationDisplay) => {
        (await this.twisty3DPuzzle()).experimentalUpdateOptions({
          showFoundation: foundationDisplay !== "none"
        });
        this.scheduleRender();
      }
    );
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.twistySceneModel.stickeringMask,
      async (stickeringMask) => {
        const twisty3D = await this.twisty3DPuzzle();
        twisty3D.setStickeringMask(stickeringMask);
        this.scheduleRender();
      }
    );
    __privateGet(this, _freshListenerManager4).addListener(
      this.model.twistySceneModel.faceletScale,
      async (faceletScale) => {
        (await this.twisty3DPuzzle()).experimentalUpdateOptions({
          faceletScale
        });
        this.scheduleRender();
      }
    );
    __privateGet(this, _freshListenerManager4).addMultiListener3(
      [
        this.model.twistySceneModel.stickeringMask,
        this.model.twistySceneModel.foundationStickerSprite,
        this.model.twistySceneModel.hintStickerSprite
      ],
      async (inputs) => {
        if ("experimentalUpdateTexture" in await this.twisty3DPuzzle()) {
          (await this.twisty3DPuzzle()).experimentalUpdateTexture(
            inputs[0].specialBehaviour === "picture",
            inputs[1],
            inputs[2]
          );
          this.scheduleRender();
        }
      }
    );
  }
  disconnect() {
    __privateGet(this, _freshListenerManager4).disconnect();
  }
  scheduleRender() {
    this.schedulable.scheduleRender();
    this.dispatchEvent(new CustomEvent("render-scheduled"));
  }
  async twisty3DPuzzle() {
    return __privateGet(this, _cachedTwisty3DPuzzle) ?? __privateSet(this, _cachedTwisty3DPuzzle, (async () => {
      const proxyPromise = proxy3D();
      if (this.puzzleLoader.id === "3x3x3" && this.visualizationStrategy === "Cube3D") {
        const [
          foundationSprite,
          hintSprite,
          experimentalStickeringMask,
          initialHintFaceletsAnimation
        ] = await Promise.all([
          this.model.twistySceneModel.foundationStickerSprite.get(),
          this.model.twistySceneModel.hintStickerSprite.get(),
          this.model.twistySceneModel.stickeringMask.get(),
          this.model.twistySceneModel.initialHintFaceletsAnimation.get()
        ]);
        return (await proxyPromise).cube3DShim(
          () => this.schedulable.scheduleRender(),
          {
            foundationSprite,
            hintSprite,
            experimentalStickeringMask,
            initialHintFaceletsAnimation
          }
        );
      } else {
        const [hintFacelets, foundationSprite, hintSprite, faceletScale] = await Promise.all([
          this.model.twistySceneModel.hintFacelet.get(),
          this.model.twistySceneModel.foundationStickerSprite.get(),
          this.model.twistySceneModel.hintStickerSprite.get(),
          this.model.twistySceneModel.faceletScale.get()
        ]);
        const pg3d = (await proxyPromise).pg3dShim(
          () => this.schedulable.scheduleRender(),
          this.puzzleLoader,
          hintFacelets === "auto" ? "floating" : hintFacelets,
          faceletScale,
          this.puzzleLoader.id === "kilominx"
          // TODO: generalize to other puzzles
        );
        pg3d.then(
          (p) => p.experimentalUpdateTexture(
            true,
            foundationSprite ?? void 0,
            hintSprite ?? void 0
          )
        );
        return pg3d;
      }
    })());
  }
  async raycastMove(raycasterPromise, transformations) {
    const puzzle = await this.twisty3DPuzzle();
    if (!("experimentalGetControlTargets" in puzzle)) {
      console.info("not PG3D! skipping raycast");
      return;
    }
    const targets = puzzle.experimentalGetControlTargets();
    const [raycaster, movePressCancelOptions] = await Promise.all([
      raycasterPromise,
      this.model.twistySceneModel.movePressCancelOptions.get()
    ]);
    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length > 0) {
      const closestMove = puzzle.getClosestMoveToAxis(
        intersects[0].point,
        transformations
      );
      if (closestMove) {
        this.model.experimentalAddMove(closestMove.move, {
          cancel: movePressCancelOptions
        });
      } else {
        console.info("Skipping move!");
      }
    }
  }
}, _freshListenerManager4 = new WeakMap(), _cachedTwisty3DPuzzle = new WeakMap(), _a7);
var _backViewClassListManager, _freshListenerManager5, _backViewVantage, _cachedScene2, _vantages, _currentTwisty3DPuzzleWrapper, _initialWrapperTracker, _twisty3DStaleDropper, _a8;
var Twisty3DSceneWrapper = (_a8 = class extends ManagedCustomElement {
  constructor(model) {
    super();
    __privateAdd(this, _backViewClassListManager, new ClassListManager(this, "back-view-", [
      "auto",
      "none",
      "side-by-side",
      "top-right"
    ]));
    __privateAdd(this, _freshListenerManager5, new FreshListenerManager());
    __privateAdd(this, _backViewVantage, null);
    __privateAdd(this, _cachedScene2, void 0);
    __privateAdd(this, _vantages, /* @__PURE__ */ new Set());
    __privateAdd(this, _currentTwisty3DPuzzleWrapper, null);
    __privateAdd(this, _initialWrapperTracker, new InitialValueTracker());
    __privateAdd(this, _twisty3DStaleDropper, new StaleDropper());
    this.model = model;
  }
  disconnect() {
    __privateGet(this, _freshListenerManager5).disconnect();
  }
  async connectedCallback() {
    this.addCSS(twistyViewerWrapperCSS);
    const vantage = new Twisty3DVantage(this.model, this);
    this.addVantage(vantage);
    if (this.model) {
      __privateGet(this, _freshListenerManager5).addMultiListener(
        [this.model.puzzleLoader, this.model.visualizationStrategy],
        this.onPuzzle.bind(this)
      );
      __privateGet(this, _freshListenerManager5).addListener(
        this.model.backView,
        this.onBackView.bind(this)
      );
    }
    this.scheduleRender();
  }
  setBackView(backView) {
    const shouldHaveBackView = ["side-by-side", "top-right"].includes(backView);
    const hasBackView = __privateGet(this, _backViewVantage) !== null;
    __privateGet(this, _backViewClassListManager).setValue(backView);
    if (shouldHaveBackView) {
      if (!hasBackView) {
        __privateSet(this, _backViewVantage, new Twisty3DVantage(this.model, this, {
          backView: true
        }));
        this.addVantage(__privateGet(this, _backViewVantage));
        this.scheduleRender();
      }
    } else {
      if (__privateGet(this, _backViewVantage)) {
        this.removeVantage(__privateGet(this, _backViewVantage));
        __privateSet(this, _backViewVantage, null);
      }
    }
  }
  onBackView(backView) {
    this.setBackView(backView);
  }
  async onPress(e) {
    const twisty3DPuzzleWrapper = __privateGet(this, _currentTwisty3DPuzzleWrapper);
    if (!twisty3DPuzzleWrapper) {
      console.info("no wrapper; skipping scene wrapper press!");
      return;
    }
    const raycasterPromise = (async () => {
      const [camera, three] = await Promise.all([
        e.detail.cameraPromise,
        THREEJS
      ]);
      const raycaster = new three.Raycaster();
      const mouse = new (await THREEJS).Vector2(
        e.detail.pressInfo.normalizedX,
        e.detail.pressInfo.normalizedY
      );
      raycaster.setFromCamera(mouse, camera);
      return raycaster;
    })();
    twisty3DPuzzleWrapper.raycastMove(raycasterPromise, {
      invert: !e.detail.pressInfo.rightClick,
      depth: e.detail.pressInfo.keys.ctrlOrMetaKey ? "rotation" : e.detail.pressInfo.keys.shiftKey ? "secondSlice" : "none"
    });
  }
  async scene() {
    return __privateGet(this, _cachedScene2) ?? __privateSet(this, _cachedScene2, (async () => new (await THREEJS).Scene())());
  }
  addVantage(vantage) {
    vantage.addEventListener("press", this.onPress.bind(this));
    __privateGet(this, _vantages).add(vantage);
    this.contentWrapper.appendChild(vantage);
  }
  removeVantage(vantage) {
    __privateGet(this, _vantages).delete(vantage);
    vantage.remove();
    vantage.disconnect();
    __privateGet(this, _currentTwisty3DPuzzleWrapper)?.disconnect();
  }
  experimentalVantages() {
    return __privateGet(this, _vantages).values();
  }
  scheduleRender() {
    for (const vantage of __privateGet(this, _vantages)) {
      vantage.scheduleRender();
    }
  }
  // #oldTwisty3DPuzzleWrappers: Twisty3DPuzzleWrapper[] = []; // TODO: Animate these out.
  async setCurrentTwisty3DPuzzleWrapper(scene, twisty3DPuzzleWrapper) {
    const old = __privateGet(this, _currentTwisty3DPuzzleWrapper);
    try {
      __privateSet(this, _currentTwisty3DPuzzleWrapper, twisty3DPuzzleWrapper);
      old?.disconnect();
      scene.add(await twisty3DPuzzleWrapper.twisty3DPuzzle());
    } finally {
      if (old) {
        scene.remove(await old.twisty3DPuzzle());
      }
    }
    __privateGet(this, _initialWrapperTracker).handleNewValue(twisty3DPuzzleWrapper);
  }
  /** @deprecated */
  async experimentalTwisty3DPuzzleWrapper() {
    return __privateGet(this, _currentTwisty3DPuzzleWrapper) || __privateGet(this, _initialWrapperTracker).promise;
  }
  async onPuzzle(inputs) {
    if (inputs[1] === "2D") {
      return;
    }
    __privateGet(this, _currentTwisty3DPuzzleWrapper)?.disconnect();
    const [scene, twisty3DPuzzleWrapper] = await __privateGet(this, _twisty3DStaleDropper).queue(
      Promise.all([
        this.scene(),
        new Twisty3DPuzzleWrapper(this.model, this, inputs[0], inputs[1])
        // TODO
      ])
    );
    this.setCurrentTwisty3DPuzzleWrapper(scene, twisty3DPuzzleWrapper);
  }
}, _backViewClassListManager = new WeakMap(), _freshListenerManager5 = new WeakMap(), _backViewVantage = new WeakMap(), _cachedScene2 = new WeakMap(), _vantages = new WeakMap(), _currentTwisty3DPuzzleWrapper = new WeakMap(), _initialWrapperTracker = new WeakMap(), _twisty3DStaleDropper = new WeakMap(), _a8);
customElementsShim.define("twisty-3d-scene-wrapper", Twisty3DSceneWrapper);
var buttonGridCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 24px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wrapper {
  grid-auto-flow: column;
}

.viewer-link-none .twizzle-link-button {
  display: none;
}

.wrapper twisty-button,
.wrapper twisty-control-button {
  width: inherit;
  height: inherit;
}
`
);
var buttonCSS = new CSSSource(
  `
:host:not([hidden]) {
  display: grid;
}

:host {
  width: 48px;
  height: 24px;
}

.wrapper {
  width: 100%;
  height: 100%;
}

button {
  width: 100%;
  height: 100%;
  border: none;
  
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  background-color: rgba(196, 196, 196, 0.75);
}

button:enabled {
  background-color: rgba(196, 196, 196, 0.75)
}

.dark-mode button:enabled {
  background-color: #88888888;
}

button:disabled {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.25;
  pointer-events: none;
}

.dark-mode button:disabled {
  background-color: #ffffff44;
}

button:enabled:hover {
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

/* TODO: fullscreen icons have too much padding?? */
.svg-skip-to-start button,
button.svg-skip-to-start {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjQzIDEwMzdxMTktMTkgMzItMTN0MTMgMzJ2MTQ3MnEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djcxMHEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djY3OHEwIDI2LTE5IDQ1dC00NSAxOUg5NjBxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWgxMjhxMjYgMCA0NSAxOXQxOSA0NXY2NzhxNC0xMSAxMy0xOWw3MTAtNzEwcTE5LTE5IDMyLTEzdDEzIDMydjcxMHE0LTExIDEzLTE5eiIvPjwvc3ZnPg==");
}

.svg-skip-to-end button,
button.svg-skip-to-end {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik05NDEgMjU0N3EtMTkgMTktMzIgMTN0LTEzLTMyVjEwNTZxMC0yNiAxMy0zMnQzMiAxM2w3MTAgNzEwcTggOCAxMyAxOXYtNzEwcTAtMjYgMTMtMzJ0MzIgMTNsNzEwIDcxMHE4IDggMTMgMTl2LTY3OHEwLTI2IDE5LTQ1dDQ1LTE5aDEyOHEyNiAwIDQ1IDE5dDE5IDQ1djE0MDhxMCAyNi0xOSA0NXQtNDUgMTloLTEyOHEtMjYgMC00NS0xOXQtMTktNDV2LTY3OHEtNSAxMC0xMyAxOWwtNzEwIDcxMHEtMTkgMTktMzIgMTN0LTEzLTMydi03MTBxLTUgMTAtMTMgMTl6Ii8+PC9zdmc+");
}

.svg-step-forward button,
button.svg-step-forward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDE1NjhxMCAyNi0xOSA0NWwtNTEyIDUxMnEtMTkgMTktNDUgMTl0LTQ1LTE5cS0xOS0xOS0xOS00NXYtMjU2aC0yMjRxLTk4IDAtMTc1LjUgNnQtMTU0IDIxLjVxLTc2LjUgMTUuNS0xMzMgNDIuNXQtMTA1LjUgNjkuNXEtNDkgNDIuNS04MCAxMDF0LTQ4LjUgMTM4LjVxLTE3LjUgODAtMTcuNSAxODEgMCA1NSA1IDEyMyAwIDYgMi41IDIzLjV0Mi41IDI2LjVxMCAxNS04LjUgMjV0LTIzLjUgMTBxLTE2IDAtMjgtMTctNy05LTEzLTIydC0xMy41LTMwcS03LjUtMTctMTAuNS0yNC0xMjctMjg1LTEyNy00NTEgMC0xOTkgNTMtMzMzIDE2Mi00MDMgODc1LTQwM2gyMjR2LTI1NnEwLTI2IDE5LTQ1dDQ1LTE5cTI2IDAgNDUgMTlsNTEyIDUxMnExOSAxOSAxOSA0NXoiLz48L3N2Zz4=");
}

.svg-step-backward button,
button.svg-step-backward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDIwNDhxMCAxNjYtMTI3IDQ1MS0zIDctMTAuNSAyNHQtMTMuNSAzMHEtNiAxMy0xMyAyMi0xMiAxNy0yOCAxNy0xNSAwLTIzLjUtMTB0LTguNS0yNXEwLTkgMi41LTI2LjV0Mi41LTIzLjVxNS02OCA1LTEyMyAwLTEwMS0xNy41LTE4MXQtNDguNS0xMzguNXEtMzEtNTguNS04MC0xMDF0LTEwNS41LTY5LjVxLTU2LjUtMjctMTMzLTQyLjV0LTE1NC0yMS41cS03Ny41LTYtMTc1LjUtNmgtMjI0djI1NnEwIDI2LTE5IDQ1dC00NSAxOXEtMjYgMC00NS0xOWwtNTEyLTUxMnEtMTktMTktMTktNDV0MTktNDVsNTEyLTUxMnExOS0xOSA0NS0xOXQ0NSAxOXExOSAxOSAxOSA0NXYyNTZoMjI0cTcxMyAwIDg3NSA0MDMgNTMgMTM0IDUzIDMzM3oiLz48L3N2Zz4=");
}

.svg-pause button,
button.svg-pause {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNTYwIDEwODh2MTQwOHEwIDI2LTE5IDQ1dC00NSAxOWgtNTEycS0yNiAwLTQ1LTE5dC0xOS00NVYxMDg4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6bS04OTYgMHYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWg1MTJxMjYgMCA0NSAxOXQxOSA0NXoiLz48L3N2Zz4=");
}

.svg-play button,
button.svg-play {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNDcyLjUgMTgyM2wtMTMyOCA3MzhxLTIzIDEzLTM5LjUgM3QtMTYuNS0zNlYxMDU2cTAtMjYgMTYuNS0zNnQzOS41IDNsMTMyOCA3MzhxMjMgMTMgMjMgMzF0LTIzIDMxeiIvPjwvc3ZnPg==");
}

.svg-enter-fullscreen button,
button.svg-enter-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTkgMTZIN3Y1aDV2LTJIOXYtM3ptLTItNGgyVjloM1Y3SDd2NXptMTIgN2gtM3YyaDV2LTVoLTJ2M3pNMTYgN3YyaDN2M2gyVjdoLTV6Ii8+PC9zdmc+");
}

.svg-exit-fullscreen button,
button.svg-exit-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTcgMThoM3YzaDJ2LTVIN3Yyem0zLThIN3YyaDVWN2gtMnYzem02IDExaDJ2LTNoM3YtMmgtNXY1em0yLTExVjdoLTJ2NWg1di0yaC0zeiIvPjwvc3ZnPg==");
}

.svg-twizzle-tw button,
button.svg-twizzle-tw {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODY0IiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzk3LjU4MSAxNTEuMTh2NTcuMDg0aC04OS43MDN2MjQwLjM1MmgtNjYuOTU1VjIwOC4yNjRIMTUxLjIydi01Ny4wODNoMjQ2LjM2MXptNTQuMzEgNzEuNjc3bDcuNTEyIDMzLjY5MmMyLjcxOCAxMi4xNiA1LjU4IDI0LjY4IDguNTg0IDM3LjU1NWEyMTgwLjc3NSAyMTgwLjc3NSAwIDAwOS40NDIgMzguODQzIDEyNjYuMyAxMjY2LjMgMCAwMDEwLjA4NiAzNy41NTVjMy43Mi0xMi41OSA3LjM2OC0yNS40NjYgMTAuOTQ1LTM4LjYyOCAzLjU3Ni0xMy4xNjIgNy4wMS0yNi4xMSAxMC4zLTM4Ljg0M2w1Ljc2OS0yMi40NTZjMS4yNDgtNC44ODcgMi40NzItOS43MDUgMy42NzQtMTQuNDU1IDMuMDA0LTExLjg3NSA1LjY1MS0yMi45NjIgNy45NC0zMy4yNjNoNDYuMzU0bDIuMzg0IDEwLjU2M2EyMDAwLjc3IDIwMDAuNzcgMCAwMDMuOTM1IDE2LjgyOGw2LjcxMSAyNy43MWMxLjIxMyA0Ljk1NiAyLjQ1IDkuOTggMy43MDkgMTUuMDczYTMxMTkuNzc3IDMxMTkuNzc3IDAgMDA5Ljg3MSAzOC44NDMgMTI0OS4yMjcgMTI0OS4yMjcgMCAwMDEwLjczIDM4LjYyOCAxOTA3LjYwNSAxOTA3LjYwNSAwIDAwMTAuMzAxLTM3LjU1NSAxMzk3Ljk0IDEzOTcuOTQgMCAwMDkuNjU3LTM4Ljg0M2w0LjQtMTkuMDQ2Yy43MTUtMy4xMyAxLjQyMS02LjIzNiAyLjExOC05LjMyMWw5LjU3Ny00Mi44OGg2Ni41MjZhMjk4OC43MTggMjk4OC43MTggMCAwMS0xOS41MjkgNjYuMzExbC01LjcyOCAxOC40ODJhMzIzNy40NiAzMjM3LjQ2IDAgMDEtMTQuMDE1IDQzLjc1MmMtNi40MzggMTkuNi0xMi43MzMgMzcuNjk4LTE4Ljg4NSA1NC4yOTRsLTMuMzA2IDguODI1Yy00Ljg4NCAxMi44OTgtOS40MzMgMjQuMjYzLTEzLjY0NyAzNC4wOTVoLTQ5Ljc4N2E4NDE3LjI4OSA4NDE3LjI4OSAwIDAxLTIxLjAzMS02NC44MDkgMTI4OC42ODYgMTI4OC42ODYgMCAwMS0xOC44ODUtNjQuODEgMTk3Mi40NDQgMTk3Mi40NDQgMCAwMS0xOC4yNCA2NC44MSAyNTc5LjQxMiAyNTc5LjQxMiAwIDAxLTIwLjM4OCA2NC44MWgtNDkuNzg3Yy00LjY4Mi0xMC45MjYtOS43Mi0yMy43NDMtMTUuMTEtMzguNDUxbC0xLjYyOS00LjQ3Yy01LjI1OC0xNC41MjEtMTAuNjgtMzAuMTkyLTE2LjI2Ni00Ny4wMTRsLTIuNDA0LTcuMjhjLTYuNDM4LTE5LjYtMTMuMDItNDAuMzQ0LTE5Ljc0My02Mi4yMzRhMjk4OC43MDcgMjk4OC43MDcgMCAwMS0xOS41MjktNjYuMzExaDY3LjM4NXoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg==");
}
`
);
var globalSafeDocument = typeof document === "undefined" ? null : document;
var fullscreenEnabled = globalSafeDocument?.fullscreenEnabled || !!globalSafeDocument?.webkitFullscreenEnabled;
function documentExitFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else {
    return document.webkitExitFullscreen();
  }
}
function documentFullscreenElement() {
  if (document.fullscreenElement) {
    return document.fullscreenElement;
  } else {
    return document.webkitFullscreenElement ?? null;
  }
}
function requestFullscreen(element) {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else {
    return element.webkitRequestFullscreen();
  }
}
var buttonIcons = [
  "skip-to-start",
  "skip-to-end",
  "step-forward",
  "step-backward",
  "pause",
  "play",
  "enter-fullscreen",
  "exit-fullscreen",
  "twizzle-tw"
];
var ButtonAppearanceProp = class extends TwistyPropDerived {
  // TODO: This still seems to fire twice for play/pause?
  derive(inputs) {
    const buttonAppearances = {
      fullscreen: {
        // TODO: Cache?// TODO: Cache?
        enabled: fullscreenEnabled,
        icon: (
          // TODO: Check against the expected element?
          // TODO: This will *not* update when we enter/leave fullscreen. We need to work more closely with the controller.
          document.fullscreenElement === null ? "enter-fullscreen" : "exit-fullscreen"
        ),
        title: "Enter fullscreen"
      },
      "jump-to-start": {
        enabled: !inputs.coarseTimelineInfo.atStart,
        icon: "skip-to-start",
        title: "Restart"
      },
      "play-step-backwards": {
        enabled: !inputs.coarseTimelineInfo.atStart,
        icon: "step-backward",
        title: "Step backward"
      },
      "play-pause": {
        enabled: !(inputs.coarseTimelineInfo.atStart && inputs.coarseTimelineInfo.atEnd),
        icon: inputs.coarseTimelineInfo.playing ? "pause" : "play",
        title: inputs.coarseTimelineInfo.playing ? "Pause" : "Play"
      },
      "play-step": {
        enabled: !inputs.coarseTimelineInfo.atEnd,
        icon: "step-forward",
        title: "Step forward"
      },
      "jump-to-end": {
        enabled: !inputs.coarseTimelineInfo.atEnd,
        icon: "skip-to-end",
        title: "Skip to End"
      },
      "twizzle-link": {
        enabled: true,
        icon: "twizzle-tw",
        title: "View at Twizzle",
        hidden: inputs.viewerLink === "none"
      }
    };
    return buttonAppearances;
  }
};
var buttonCommands = {
  fullscreen: true,
  "jump-to-start": true,
  "play-step-backwards": true,
  "play-pause": true,
  "play-step": true,
  "jump-to-end": true,
  "twizzle-link": true
};
var _onCommand, onCommand_fn, _a9;
var TwistyButtons = (_a9 = class extends ManagedCustomElement {
  // TODO: Privacy
  constructor(model, controller, defaultFullscreenElement) {
    super();
    __privateAdd(this, _onCommand);
    __publicField(this, "buttons", null);
    this.model = model;
    this.controller = controller;
    this.defaultFullscreenElement = defaultFullscreenElement;
  }
  connectedCallback() {
    this.addCSS(buttonGridCSS);
    const buttons = {};
    for (const command in buttonCommands) {
      const button = new TwistyButton();
      buttons[command] = button;
      button.htmlButton.addEventListener(
        "click",
        () => __privateMethod(this, _onCommand, onCommand_fn).call(this, command)
      );
      this.addElement(button);
    }
    this.buttons = buttons;
    this.model?.buttonAppearance.addFreshListener(this.update.bind(this));
    this.model?.twistySceneModel.colorScheme.addFreshListener(
      this.updateColorScheme.bind(this)
    );
  }
  // TODO: Should we have a prop, or a way to query if we're fullscreen?
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
  async onFullscreenButton() {
    if (!this.defaultFullscreenElement) {
      throw new Error("Attempted to go fullscreen without an element.");
    }
    if (documentFullscreenElement() === this.defaultFullscreenElement) {
      documentExitFullscreen();
    } else {
      this.buttons?.fullscreen.setIcon("exit-fullscreen");
      requestFullscreen(
        await this.model?.twistySceneModel.fullscreenElement.get() ?? this.defaultFullscreenElement
      );
      const onFullscreen = () => {
        if (documentFullscreenElement() !== this.defaultFullscreenElement) {
          this.buttons?.fullscreen.setIcon("enter-fullscreen");
          window.removeEventListener("fullscreenchange", onFullscreen);
        }
      };
      window.addEventListener("fullscreenchange", onFullscreen);
    }
  }
  async update(buttonAppearances) {
    for (const command in buttonCommands) {
      const button = this.buttons[command];
      const info = buttonAppearances[command];
      button.htmlButton.disabled = !info.enabled;
      button.htmlButton.title = info.title;
      button.setIcon(info.icon);
      button.hidden = !!info.hidden;
    }
  }
  updateColorScheme(colorScheme) {
    for (const button of Object.values(this.buttons ?? {})) {
      button.updateColorScheme(colorScheme);
    }
  }
}, _onCommand = new WeakSet(), onCommand_fn = function(command) {
  switch (command) {
    case "fullscreen": {
      this.onFullscreenButton();
      break;
    }
    case "jump-to-start": {
      this.controller?.jumpToStart({ flash: true });
      break;
    }
    case "play-step-backwards": {
      this.controller?.animationController.play({
        direction: -1,
        untilBoundary: "move"
        /* Move */
      });
      break;
    }
    case "play-pause": {
      this.controller?.togglePlay();
      break;
    }
    case "play-step": {
      this.controller?.animationController.play({
        direction: 1,
        untilBoundary: "move"
        /* Move */
      });
      break;
    }
    case "jump-to-end": {
      this.controller?.jumpToEnd({ flash: true });
      break;
    }
    case "twizzle-link": {
      this.controller?.visitTwizzleLink();
      break;
    }
    default:
      throw new Error("Missing command");
  }
}, _a9);
customElementsShim.define("twisty-buttons", TwistyButtons);
var _iconManager, _a10;
var TwistyButton = (_a10 = class extends ManagedCustomElement {
  constructor() {
    super(...arguments);
    __publicField(this, "htmlButton", document.createElement("button"));
    __privateAdd(this, _iconManager, new ClassListManager(
      this,
      "svg-",
      buttonIcons
    ));
  }
  // TODO: async?
  updateColorScheme(colorScheme) {
    this.contentWrapper.classList.toggle("dark-mode", colorScheme === "dark");
  }
  connectedCallback() {
    this.addCSS(buttonCSS);
    this.addElement(this.htmlButton);
  }
  setIcon(iconName) {
    __privateGet(this, _iconManager).setValue(iconName);
  }
}, _iconManager = new WeakMap(), _a10);
customElementsShim.define("twisty-button", TwistyButton);
var twistyScrubberCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 16px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(196, 196, 196, 0.75);
}

input:not(:disabled) {
  cursor: ew-resize;
}

.wrapper.dark-mode {
  background: #666666;
}
`
);
var SLOW_DOWN_SCRUBBING = false;
var isMouseDown = false;
globalSafeDocument?.addEventListener(
  "mousedown",
  (event) => {
    if (event.which) {
      isMouseDown = true;
    }
  },
  true
);
globalSafeDocument?.addEventListener(
  "mouseup",
  (event) => {
    if (event.which) {
      isMouseDown = false;
    }
  },
  true
);
var y = 0;
var clickNum = 0;
globalSafeDocument?.addEventListener(
  "mousedown",
  () => {
    clickNum++;
  },
  false
);
globalSafeDocument?.addEventListener("mousemove", onMouseUpdate, false);
globalSafeDocument?.addEventListener("mouseenter", onMouseUpdate, false);
function onMouseUpdate(e) {
  y = e.pageY;
}
var lastVal = 0;
var lastPreval = 0;
var scaling = false;
var currentClickNum = 0;
var _inputElem, _a11;
var TwistyScrubber = (_a11 = class extends ManagedCustomElement {
  constructor(model, controller) {
    super();
    __privateAdd(this, _inputElem, null);
    this.model = model;
    this.controller = controller;
  }
  async onDetailedTimelineInfo(detailedTimelineInfo) {
    const inputElem = await this.inputElem();
    inputElem.min = detailedTimelineInfo.timeRange.start.toString();
    inputElem.max = detailedTimelineInfo.timeRange.end.toString();
    inputElem.disabled = inputElem.min === inputElem.max;
    inputElem.value = detailedTimelineInfo.timestamp.toString();
  }
  async connectedCallback() {
    this.addCSS(twistyScrubberCSS);
    this.addElement(await this.inputElem());
    this.model?.twistySceneModel.colorScheme.addFreshListener(
      this.updateColorScheme.bind(this)
    );
  }
  updateColorScheme(colorScheme) {
    this.contentWrapper.classList.toggle("dark-mode", colorScheme === "dark");
  }
  async inputElem() {
    return __privateGet(this, _inputElem) ?? __privateSet(this, _inputElem, (async () => {
      const elem = document.createElement("input");
      elem.type = "range";
      elem.disabled = true;
      this.model?.detailedTimelineInfo.addFreshListener(
        this.onDetailedTimelineInfo.bind(this)
      );
      elem.addEventListener("input", this.onInput.bind(this));
      elem.addEventListener("keydown", this.onKeypress.bind(this));
      return elem;
    })());
  }
  async onInput(e) {
    if (scaling) {
      return;
    }
    const inputElem = await this.inputElem();
    await this.slowDown(e, inputElem);
    const value = parseInt(inputElem.value);
    this.model?.playingInfo.set({ playing: false });
    this.model?.timestampRequest.set(value);
  }
  onKeypress(e) {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight": {
        this.controller?.animationController.play({
          direction: e.key === "ArrowLeft" ? -1 : 1,
          untilBoundary: "move"
          /* Move */
        });
        e.preventDefault();
        break;
      }
      case " ": {
        this.controller?.togglePlay();
        e.preventDefault();
        break;
      }
    }
  }
  async slowDown(e, inputElem) {
    if (!SLOW_DOWN_SCRUBBING) {
      return;
    }
    if (isMouseDown) {
      const rect = inputElem.getBoundingClientRect();
      const sliderY = rect.top + rect.height / 2;
      console.log(sliderY, e, y, isMouseDown);
      const yDist = Math.abs(sliderY - y);
      let scale = 1;
      if (yDist > 64) {
        scale = Math.max(2 ** (-(yDist - 64) / 64), 1 / 32);
      }
      const preVal = parseInt(inputElem.value);
      console.log("cl", currentClickNum, clickNum, preVal);
      if (currentClickNum === clickNum) {
        const delta = (preVal - lastPreval) * scale;
        console.log("delta", delta, yDist);
        scaling = true;
        let newVal = preVal;
        newVal = lastVal + delta * scale + (preVal - lastVal) * Math.min(1, (1 / 2) ** (yDist * yDist / 64));
        inputElem.value = newVal.toString();
        console.log(scale);
        scaling = false;
        this.contentWrapper.style.opacity = scale.toString();
      } else {
        currentClickNum = clickNum;
      }
      lastPreval = preVal;
    }
  }
}, _inputElem = new WeakMap(), _a11);
customElementsShim.define("twisty-scrubber", TwistyScrubber);
var cachedCamera = null;
async function screenshot(model, options) {
  const [
    { PerspectiveCamera, Scene },
    puzzleLoader,
    visualizationStrategy,
    _stickering,
    // TODO
    _stickeringMaskRequest,
    // TODO
    _legacyPosition,
    orbitCoordinates
  ] = await Promise.all([
    THREEJS,
    await model.puzzleLoader.get(),
    await model.visualizationStrategy.get(),
    await model.twistySceneModel.stickeringRequest.get(),
    await model.twistySceneModel.stickeringMaskRequest.get(),
    await model.legacyPosition.get(),
    await model.twistySceneModel.orbitCoordinates.get()
  ]);
  const width = options?.width ?? 2048;
  const height = options?.height ?? 2048;
  const aspectRatio = width / height;
  const camera = cachedCamera ?? (cachedCamera = await (async () => {
    return new PerspectiveCamera(20, aspectRatio, 0.1, 20);
  })());
  const scene = new Scene();
  const twisty3DWrapper = new Twisty3DPuzzleWrapper(
    model,
    { scheduleRender: () => {
    } },
    puzzleLoader,
    visualizationStrategy
  );
  scene.add(await twisty3DWrapper.twisty3DPuzzle());
  await setCameraFromOrbitCoordinates(camera, orbitCoordinates);
  const rendererCanvas = await rawRenderPooled(width, height, scene, camera);
  const dataURL = rendererCanvas.toDataURL();
  const defaultFilename = await getDefaultFilename(model);
  return {
    dataURL,
    download: async (filename) => {
      downloadURL(dataURL, filename ?? defaultFilename);
    }
  };
}
async function getDefaultFilename(model) {
  const [puzzleID, algWithIssues] = await Promise.all([
    model.puzzleID.get(),
    model.alg.get()
  ]);
  return `[${puzzleID}]${algWithIssues.alg.experimentalNumChildAlgNodes() === 0 ? "" : ` ${algWithIssues.alg.toString()}`}`;
}
function downloadURL(url, name, extension = "png") {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.${extension}`;
  a.click();
}
var twistyPlayerCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 256px;
  display: grid;

  -webkit-user-select: none;
  user-select: none;
}

.wrapper {
  display: grid;
  overflow: hidden;
  contain: size;
  grid-template-rows: 7fr minmax(1.5em, 0.5fr) minmax(2em, 1fr);
}

.wrapper > * {
  width: inherit;
  height: inherit;
  overflow: hidden;
}

.wrapper.controls-none {
  grid-template-rows: 7fr;
}

.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-control-button-panel ,
.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-buttons {
  display: none;
}

twisty-scrubber {
  background: rgba(196, 196, 196, 0.5);
}

.wrapper.checkered,
.wrapper.checkered-transparent {
  background-color: #EAEAEA;
  background-image: linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD),
    linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD);
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
}

.wrapper.checkered-transparent {
  background-color: #F4F4F4;
  background-image: linear-gradient(45deg, #DDDDDD88 25%, transparent 25%, transparent 75%, #DDDDDD88 75%, #DDDDDD88),
    linear-gradient(45deg, #DDDDDD88 25%, transparent 25%, transparent 75%, #DDDDDD88 75%, #DDDDDD88);
}

.wrapper.dark-mode {
  background-color: #444;
  background-image: linear-gradient(45deg, #DDDDDD0b 25%, transparent 25%, transparent 75%, #DDDDDD0b 75%, #DDDDDD0b),
    linear-gradient(45deg, #DDDDDD0b 25%, transparent 25%, transparent 75%, #DDDDDD0b 75%, #DDDDDD0b);
}

.visualization-wrapper > * {
  width: 100%;
  height: 100%;
}

.error-elem {
  width: 100%;
  height: 100%;
  display: none;
  place-content: center;
  font-family: sans-serif;
  box-shadow: inset 0 0 2em rgb(255, 0, 0);
  color: red;
  text-shadow: 0 0 0.2em white;
  background: rgba(255, 255, 255, 0.25);
}

.wrapper.error .visualization-wrapper {
  display: none;
}

.wrapper.error .error-elem {
  display: grid;
}
`
);
var ArbitraryStringProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return null;
  }
};
var URLProp = class extends TwistyPropSource {
  getDefaultValue() {
    return null;
  }
  derive(input) {
    if (typeof input === "string") {
      return new URL(input, location.href);
    }
    return input;
  }
};
var AlgIssues = class _AlgIssues {
  constructor(issues) {
    // TODO: (string | Error)[]
    __publicField(this, "warnings");
    __publicField(this, "errors");
    this.warnings = Object.freeze(issues?.warnings ?? []);
    this.errors = Object.freeze(issues?.errors ?? []);
    Object.freeze(this);
  }
  add(issues) {
    return new _AlgIssues({
      warnings: this.warnings.concat(issues?.warnings ?? []),
      errors: this.errors.concat(issues?.errors ?? [])
    });
  }
  /** @deprecated */
  log() {
    if (this.errors.length > 0) {
      console.error(`\u{1F6A8} ${this.errors[0]}`);
    } else if (this.warnings.length > 0) {
      console.warn(`\u26A0\uFE0F ${this.warnings[0]}`);
    } else {
      console.info("\u{1F60E} No issues!");
    }
  }
};
function algWithIssuesFromString(s) {
  try {
    const alg = Alg.fromString(s);
    const warnings = [];
    if (alg.toString() !== s) {
      warnings.push("Alg is non-canonical!");
    }
    return {
      alg,
      issues: new AlgIssues({ warnings })
    };
  } catch (e) {
    return {
      alg: new Alg(),
      issues: new AlgIssues({
        errors: [`Malformed alg: ${e.toString()}`]
      })
    };
  }
}
function algWithIssuesEquals(a1, a2) {
  return a1.alg.isIdentical(a2.alg) && arrayEquals(a1.issues.warnings, a2.issues.warnings) && arrayEquals(a1.issues.errors, a2.issues.errors);
}
var AlgProp = class extends TwistyPropSource {
  getDefaultValue() {
    return { alg: new Alg(), issues: new AlgIssues() };
  }
  canReuseValue(v1, v2) {
    return algWithIssuesEquals(v1, v2);
  }
  async derive(newAlg) {
    if (typeof newAlg === "string") {
      return algWithIssuesFromString(newAlg);
    } else {
      return {
        alg: newAlg,
        issues: new AlgIssues()
      };
    }
  }
};
var AlgTransformationProp = class extends TwistyPropDerived {
  derive(input) {
    return input.kpuzzle.algToTransformation(input.setupAlg.alg);
  }
};
var AnchorTransformationProp = class extends TwistyPropDerived {
  derive(inputs) {
    if (inputs.setupTransformation) {
      return inputs.setupTransformation;
    }
    switch (inputs.setupAnchor) {
      case "start":
        return inputs.setupAlgTransformation;
      case "end": {
        const algTransformation = inputs.indexer.transformationAtIndex(
          inputs.indexer.numAnimatedLeaves()
        );
        const inverseAlgTransformation = algTransformation.invert();
        return inputs.setupAlgTransformation.applyTransformation(
          inverseAlgTransformation
        );
      }
      default:
        throw new Error("Unimplemented!");
    }
  }
};
var CatchUpMoveProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return { move: null, amount: 0 };
  }
  canReuseValue(v1, v2) {
    return v1.move === v2.move && v1.amount === v2.amount;
  }
};
var CurrentLeavesSimplifiedProp = class extends TwistyPropDerived {
  derive(inputs) {
    return {
      patternIndex: inputs.currentMoveInfo.patternIndex,
      movesFinishing: inputs.currentMoveInfo.movesFinishing.map(
        (currentMoveInfo) => currentMoveInfo.move
      ),
      movesFinished: inputs.currentMoveInfo.movesFinished.map(
        (currentMoveInfo) => currentMoveInfo.move
      )
    };
  }
  canReuseValue(v1, v2) {
    return v1.patternIndex === v2.patternIndex && arrayEqualsCompare(
      v1.movesFinishing,
      v2.movesFinishing,
      (m1, m2) => m1.isIdentical(m2)
    ) && arrayEqualsCompare(
      v1.movesFinished,
      v2.movesFinished,
      (m1, m2) => m1.isIdentical(m2)
    );
  }
};
var CurrentMoveInfoProp = class extends TwistyPropDerived {
  derive(inputs) {
    function addCatchUpMove(currentMoveInfo) {
      if (inputs.detailedTimelineInfo.atEnd && inputs.catchUpMove.move !== null) {
        currentMoveInfo.currentMoves.push({
          move: inputs.catchUpMove.move,
          direction: -1,
          fraction: 1 - inputs.catchUpMove.amount,
          startTimestamp: -1,
          // TODO
          endTimestamp: -1
          // TODO
        });
      }
      return currentMoveInfo;
    }
    if (inputs.indexer.currentMoveInfo) {
      return addCatchUpMove(
        inputs.indexer.currentMoveInfo(inputs.detailedTimelineInfo.timestamp)
      );
    } else {
      const idx = inputs.indexer.timestampToIndex(
        inputs.detailedTimelineInfo.timestamp
      );
      const currentMoveInfo = {
        patternIndex: idx,
        currentMoves: [],
        movesFinishing: [],
        movesFinished: [],
        movesStarting: [],
        latestStart: -Infinity,
        earliestEnd: Infinity
      };
      if (inputs.indexer.numAnimatedLeaves() > 0) {
        const move = inputs.indexer.getAnimLeaf(idx)?.as(Move);
        if (!move) {
          return addCatchUpMove(currentMoveInfo);
        }
        const start = inputs.indexer.indexToMoveStartTimestamp(idx);
        const duration = inputs.indexer.moveDuration(idx);
        const fraction = duration ? (inputs.detailedTimelineInfo.timestamp - start) / duration : 0;
        const end = start + duration;
        const currentMove = {
          move,
          direction: 1,
          fraction,
          startTimestamp: start,
          endTimestamp: end
        };
        if (fraction === 0) {
          currentMoveInfo.movesStarting.push(currentMove);
        } else if (fraction === 1) {
          currentMoveInfo.movesFinishing.push(currentMove);
        } else {
          currentMoveInfo.currentMoves.push(currentMove);
          currentMoveInfo.latestStart = Math.max(
            currentMoveInfo.latestStart,
            start
          );
          currentMoveInfo.earliestEnd = Math.min(
            currentMoveInfo.earliestEnd,
            end
          );
        }
      }
      return addCatchUpMove(currentMoveInfo);
    }
  }
};
var CurrentPatternProp = class extends TwistyPropDerived {
  derive(inputs) {
    let transformation = inputs.indexer.transformationAtIndex(
      inputs.currentLeavesSimplified.patternIndex
    );
    transformation = inputs.anchoredStart.applyTransformation(transformation);
    for (const finishingMove of inputs.currentLeavesSimplified.movesFinishing) {
      transformation = transformation.applyMove(finishingMove);
    }
    for (const finishedMove of inputs.currentLeavesSimplified.movesFinished) {
      transformation = transformation.applyMove(finishedMove);
    }
    return transformation.toKPattern();
  }
};
function defaultDurationForAmount(amount) {
  switch (Math.abs(amount)) {
    case 0:
      return 0;
    case 1:
      return 1e3;
    case 2:
      return 1500;
    default:
      return 2e3;
  }
}
var AlgDuration = class extends TraversalUp {
  // TODO: Pass durationForAmount as Down type instead?
  constructor(durationForAmount = defaultDurationForAmount) {
    super();
    this.durationForAmount = durationForAmount;
  }
  traverseAlg(alg) {
    let total = 0;
    for (const algNode of alg.childAlgNodes()) {
      total += this.traverseAlgNode(algNode);
    }
    return total;
  }
  traverseGrouping(grouping) {
    return grouping.amount * this.traverseAlg(grouping.alg);
  }
  traverseMove(move) {
    return this.durationForAmount(move.amount);
  }
  traverseCommutator(commutator) {
    return 2 * (this.traverseAlg(commutator.A) + this.traverseAlg(commutator.B));
  }
  traverseConjugate(conjugate) {
    return 2 * this.traverseAlg(conjugate.A) + this.traverseAlg(conjugate.B);
  }
  traversePause(_pause) {
    return this.durationForAmount(1);
  }
  traverseNewline(_newline) {
    return this.durationForAmount(1);
  }
  traverseLineComment(_comment) {
    return this.durationForAmount(0);
  }
};
var SimpleAlgIndexer = class {
  constructor(kpuzzle, alg) {
    __publicField(this, "moves");
    // TODO: Allow custom `durationFn`.
    __publicField(this, "durationFn", new AlgDuration(
      defaultDurationForAmount
    ));
    this.kpuzzle = kpuzzle;
    this.moves = new Alg(alg.experimentalExpand());
  }
  getAnimLeaf(index) {
    return Array.from(this.moves.childAlgNodes())[index];
  }
  indexToMoveStartTimestamp(index) {
    const alg = new Alg(Array.from(this.moves.childAlgNodes()).slice(0, index));
    return this.durationFn.traverseAlg(alg);
  }
  timestampToIndex(timestamp) {
    let cumulativeTime = 0;
    let i;
    for (i = 0; i < this.numAnimatedLeaves(); i++) {
      cumulativeTime += this.durationFn.traverseMove(this.getAnimLeaf(i));
      if (cumulativeTime >= timestamp) {
        return i;
      }
    }
    return i;
  }
  patternAtIndex(index) {
    return this.kpuzzle.defaultPattern().applyTransformation(this.transformationAtIndex(index));
  }
  transformationAtIndex(index) {
    let pattern = this.kpuzzle.identityTransformation();
    for (const move of Array.from(this.moves.childAlgNodes()).slice(0, index)) {
      pattern = pattern.applyMove(move);
    }
    return pattern;
  }
  algDuration() {
    return this.durationFn.traverseAlg(this.moves);
  }
  numAnimatedLeaves() {
    return countAnimatedLeaves(this.moves);
  }
  moveDuration(index) {
    return this.durationFn.traverseMove(this.getAnimLeaf(index));
  }
};
var axisLookup = {
  u: "y",
  l: "x",
  f: "z",
  r: "x",
  b: "z",
  d: "y",
  m: "x",
  e: "y",
  s: "z",
  x: "x",
  y: "y",
  z: "z"
};
function isSameAxis(move1, move2) {
  return axisLookup[move1.family[0].toLowerCase()] === axisLookup[move2.family[0].toLowerCase()];
}
var LocalSimulMoves = class extends TraversalUp {
  traverseAlg(alg) {
    const processed = [];
    for (const childAlgNode of alg.childAlgNodes()) {
      processed.push(this.traverseAlgNode(childAlgNode));
    }
    return Array.prototype.concat(...processed);
  }
  traverseGroupingOnce(alg) {
    if (alg.experimentalIsEmpty()) {
      return [];
    }
    for (const algNode of alg.childAlgNodes()) {
      if (!algNode.is(Move)) {
        return this.traverseAlg(alg);
      }
    }
    const moves = Array.from(alg.childAlgNodes());
    let maxSimulDur = defaultDurationForAmount(moves[0].amount);
    for (let i = 0; i < moves.length - 1; i++) {
      for (let j = 1; j < moves.length; j++) {
        if (!isSameAxis(moves[i], moves[j])) {
          return this.traverseAlg(alg);
        }
      }
      maxSimulDur = Math.max(
        maxSimulDur,
        defaultDurationForAmount(moves[i].amount)
      );
    }
    const localMovesWithRange = moves.map(
      (blockMove) => {
        return {
          animLeafAlgNode: blockMove,
          msUntilNext: 0,
          duration: maxSimulDur
        };
      }
    );
    localMovesWithRange[localMovesWithRange.length - 1].msUntilNext = maxSimulDur;
    return localMovesWithRange;
  }
  traverseGrouping(grouping) {
    const processed = [];
    const segmentOnce = grouping.amount > 0 ? grouping.alg : grouping.alg.invert();
    for (let i = 0; i < Math.abs(grouping.amount); i++) {
      processed.push(this.traverseGroupingOnce(segmentOnce));
    }
    return Array.prototype.concat(...processed);
  }
  traverseMove(move) {
    const duration = defaultDurationForAmount(move.amount);
    return [
      {
        animLeafAlgNode: move,
        msUntilNext: duration,
        duration
      }
    ];
  }
  traverseCommutator(commutator) {
    const processed = [];
    const segmentsOnce = [
      commutator.A,
      commutator.B,
      commutator.A.invert(),
      commutator.B.invert()
    ];
    for (const segment of segmentsOnce) {
      processed.push(this.traverseGroupingOnce(segment));
    }
    return Array.prototype.concat(...processed);
  }
  traverseConjugate(conjugate) {
    const processed = [];
    const segmentsOnce = [
      conjugate.A,
      conjugate.B,
      conjugate.A.invert()
    ];
    for (const segment of segmentsOnce) {
      processed.push(this.traverseGroupingOnce(segment));
    }
    return Array.prototype.concat(...processed);
  }
  traversePause(pause) {
    if (pause.experimentalNISSGrouping) {
      return [];
    }
    const duration = defaultDurationForAmount(1);
    return [
      {
        animLeafAlgNode: pause,
        msUntilNext: duration,
        // TODO
        duration
      }
    ];
  }
  traverseNewline(_newline) {
    return [];
  }
  traverseLineComment(_comment) {
    return [];
  }
};
var localSimulMoves = functionFromTraversal(LocalSimulMoves);
function simulMoves(a) {
  let timestamp = 0;
  const l = localSimulMoves(a).map(
    (localSimulMove) => {
      const leafWithRange = {
        animLeaf: localSimulMove.animLeafAlgNode,
        start: timestamp,
        end: timestamp + localSimulMove.duration
      };
      timestamp += localSimulMove.msUntilNext;
      return leafWithRange;
    }
  );
  return l;
}
var demos = {
  "y' y' U' E D R2 r2 F2 B2 U E D' R2 L2' z2 S2 U U D D S2 F2' B2": [
    { animLeaf: new Move("y", -1), start: 0, end: 1e3 },
    { animLeaf: new Move("y", -1), start: 1e3, end: 2e3 },
    { animLeaf: new Move("U", -1), start: 1e3, end: 1600 },
    { animLeaf: new Move("E", 1), start: 1200, end: 1800 },
    { animLeaf: new Move("D"), start: 1400, end: 2e3 },
    { animLeaf: new Move("R", 2), start: 2e3, end: 3500 },
    { animLeaf: new Move("r", 2), start: 2e3, end: 3500 },
    { animLeaf: new Move("F", 2), start: 3500, end: 4200 },
    { animLeaf: new Move("B", 2), start: 3800, end: 4500 },
    { animLeaf: new Move("U", 1), start: 4500, end: 5500 },
    { animLeaf: new Move("E", 1), start: 4500, end: 5500 },
    { animLeaf: new Move("D", -1), start: 4500, end: 5500 },
    { animLeaf: new Move("R", 2), start: 5500, end: 6500 },
    { animLeaf: new Move("L", -2), start: 5500, end: 6500 },
    { animLeaf: new Move("z", 2), start: 5500, end: 6500 },
    { animLeaf: new Move("S", 2), start: 6500, end: 7500 },
    { animLeaf: new Move("U"), start: 7500, end: 8e3 },
    { animLeaf: new Move("D"), start: 7750, end: 8250 },
    { animLeaf: new Move("U"), start: 8e3, end: 8500 },
    { animLeaf: new Move("D"), start: 8250, end: 8750 },
    { animLeaf: new Move("S", 2), start: 8750, end: 9250 },
    { animLeaf: new Move("F", -2), start: 8750, end: 1e4 },
    { animLeaf: new Move("B", 2), start: 8750, end: 1e4 }
  ],
  "M' R' U' D' M R": [
    { animLeaf: new Move("M", -1), start: 0, end: 1e3 },
    { animLeaf: new Move("R", -1), start: 0, end: 1e3 },
    { animLeaf: new Move("U", -1), start: 1e3, end: 2e3 },
    { animLeaf: new Move("D", -1), start: 1e3, end: 2e3 },
    { animLeaf: new Move("M"), start: 2e3, end: 3e3 },
    { animLeaf: new Move("R"), start: 2e3, end: 3e3 }
  ],
  "U' E' r E r2' E r U E": [
    { animLeaf: new Move("U", -1), start: 0, end: 1e3 },
    { animLeaf: new Move("E", -1), start: 0, end: 1e3 },
    { animLeaf: new Move("r"), start: 1e3, end: 2500 },
    { animLeaf: new Move("E"), start: 2500, end: 3500 },
    { animLeaf: new Move("r", -2), start: 3500, end: 5e3 },
    { animLeaf: new Move("E"), start: 5e3, end: 6e3 },
    { animLeaf: new Move("r"), start: 6e3, end: 7e3 },
    { animLeaf: new Move("U"), start: 7e3, end: 8e3 },
    { animLeaf: new Move("E"), start: 7e3, end: 8e3 }
  ]
};
var SimultaneousMoveIndexer = class {
  // TODO: Allow custom `durationFn`.
  constructor(kpuzzle, alg) {
    __publicField(this, "animLeaves");
    this.kpuzzle = kpuzzle;
    this.animLeaves = demos[alg.toString()] ?? simulMoves(alg);
  }
  getAnimLeaf(index) {
    return this.animLeaves[Math.min(index, this.animLeaves.length - 1)]?.animLeaf ?? null;
  }
  getAnimLeafWithRange(index) {
    return this.animLeaves[Math.min(index, this.animLeaves.length - 1)];
  }
  indexToMoveStartTimestamp(index) {
    let start = 0;
    if (this.animLeaves.length > 0) {
      start = this.animLeaves[Math.min(index, this.animLeaves.length - 1)].start;
    }
    return start;
  }
  timestampToIndex(timestamp) {
    let i = 0;
    for (i = 0; i < this.animLeaves.length; i++) {
      if (this.animLeaves[i].start >= timestamp) {
        return Math.max(0, i - 1);
      }
    }
    return Math.max(0, i - 1);
  }
  timestampToPosition(timestamp, startPattern) {
    const currentMoveInfo = this.currentMoveInfo(timestamp);
    let pattern = startPattern ?? this.kpuzzle.identityTransformation().toKPattern();
    for (const leafWithRange of this.animLeaves.slice(
      0,
      currentMoveInfo.patternIndex
    )) {
      const move = leafWithRange.animLeaf.as(Move);
      if (move !== null) {
        pattern = pattern.applyMove(move);
      }
    }
    return {
      pattern,
      movesInProgress: currentMoveInfo.currentMoves
    };
  }
  // TODO: Caching
  currentMoveInfo(timestamp) {
    let windowEarliestTimestamp = Infinity;
    for (const leafWithRange of this.animLeaves) {
      if (leafWithRange.start <= timestamp && leafWithRange.end >= timestamp) {
        windowEarliestTimestamp = Math.min(
          windowEarliestTimestamp,
          leafWithRange.start
        );
      } else if (leafWithRange.start > timestamp) {
        break;
      }
    }
    const currentMoves = [];
    const movesStarting = [];
    const movesFinishing = [];
    const movesFinished = [];
    let latestStart = -Infinity;
    let earliestEnd = Infinity;
    let patternIndex = 0;
    for (const leafWithRange of this.animLeaves) {
      if (leafWithRange.end <= windowEarliestTimestamp) {
        patternIndex++;
      } else if (leafWithRange.start > timestamp) {
        break;
      } else {
        const move = leafWithRange.animLeaf.as(Move);
        if (move !== null) {
          let fraction = (timestamp - leafWithRange.start) / (leafWithRange.end - leafWithRange.start);
          let moveFinished = false;
          if (fraction > 1) {
            fraction = 1;
            moveFinished = true;
          }
          const currentMove = {
            move,
            direction: 1,
            fraction,
            startTimestamp: leafWithRange.start,
            endTimestamp: leafWithRange.end
          };
          switch (fraction) {
            case 0: {
              movesStarting.push(currentMove);
              break;
            }
            case 1: {
              if (moveFinished) {
                movesFinished.push(currentMove);
              } else {
                movesFinishing.push(currentMove);
              }
              break;
            }
            default:
              currentMoves.push(currentMove);
              latestStart = Math.max(latestStart, leafWithRange.start);
              earliestEnd = Math.min(earliestEnd, leafWithRange.end);
          }
        }
      }
    }
    return {
      patternIndex,
      currentMoves,
      latestStart,
      earliestEnd,
      movesStarting,
      movesFinishing,
      movesFinished
    };
  }
  patternAtIndex(index, startPattern) {
    let pattern = startPattern ?? this.kpuzzle.defaultPattern();
    for (let i = 0; i < this.animLeaves.length && i < index; i++) {
      const leafWithRange = this.animLeaves[i];
      const move = leafWithRange.animLeaf.as(Move);
      if (move !== null) {
        pattern = pattern.applyMove(move);
      }
    }
    return pattern;
  }
  transformationAtIndex(index) {
    let transformation = this.kpuzzle.identityTransformation();
    for (const leafWithRange of this.animLeaves.slice(0, index)) {
      const move = leafWithRange.animLeaf.as(Move);
      if (move !== null) {
        transformation = transformation.applyMove(move);
      }
    }
    return transformation;
  }
  algDuration() {
    let max = 0;
    for (const leafWithRange of this.animLeaves) {
      max = Math.max(max, leafWithRange.end);
    }
    return max;
  }
  numAnimatedLeaves() {
    return this.animLeaves.length;
  }
  moveDuration(index) {
    const move = this.getAnimLeafWithRange(index);
    return move.end - move.start;
  }
};
var AlgWalkerDecoration = class {
  constructor(moveCount, duration, forward, backward, children = []) {
    this.moveCount = moveCount;
    this.duration = duration;
    this.forward = forward;
    this.backward = backward;
    this.children = children;
  }
};
var DecoratorConstructor = class extends TraversalUp {
  constructor(kpuzzle) {
    super();
    __publicField(this, "identity");
    __publicField(this, "dummyLeaf");
    __publicField(this, "durationFn", new AlgDuration(
      defaultDurationForAmount
    ));
    __publicField(this, "cache", {});
    this.kpuzzle = kpuzzle;
    this.identity = kpuzzle.identityTransformation();
    this.dummyLeaf = new AlgWalkerDecoration(
      0,
      0,
      this.identity,
      this.identity,
      []
    );
  }
  traverseAlg(alg) {
    let moveCount = 0;
    let duration = 0;
    let transformation = this.identity;
    const child = [];
    for (const algNode of alg.childAlgNodes()) {
      const apd = this.traverseAlgNode(algNode);
      moveCount += apd.moveCount;
      duration += apd.duration;
      if (transformation === this.identity) {
        transformation = apd.forward;
      } else {
        transformation = transformation.applyTransformation(apd.forward);
      }
      child.push(apd);
    }
    return new AlgWalkerDecoration(
      moveCount,
      duration,
      transformation,
      transformation.invert(),
      child
    );
  }
  traverseGrouping(grouping) {
    const dec = this.traverseAlg(grouping.alg);
    return this.mult(dec, grouping.amount, [dec]);
  }
  traverseMove(move) {
    const key = move.toString();
    let r2 = this.cache[key];
    if (r2) {
      return r2;
    }
    const transformation = this.kpuzzle.moveToTransformation(move);
    r2 = new AlgWalkerDecoration(
      1,
      this.durationFn.traverseAlgNode(move),
      transformation,
      transformation.invert()
    );
    this.cache[key] = r2;
    return r2;
  }
  traverseCommutator(commutator) {
    const decA = this.traverseAlg(commutator.A);
    const decB = this.traverseAlg(commutator.B);
    const AB = decA.forward.applyTransformation(decB.forward);
    const ApBp = decA.backward.applyTransformation(decB.backward);
    const ABApBp = AB.applyTransformation(ApBp);
    const dec = new AlgWalkerDecoration(
      2 * (decA.moveCount + decB.moveCount),
      2 * (decA.duration + decB.duration),
      ABApBp,
      ABApBp.invert(),
      [decA, decB]
    );
    return this.mult(dec, 1, [dec, decA, decB]);
  }
  traverseConjugate(conjugate) {
    const decA = this.traverseAlg(conjugate.A);
    const decB = this.traverseAlg(conjugate.B);
    const AB = decA.forward.applyTransformation(decB.forward);
    const ABAp = AB.applyTransformation(decA.backward);
    const dec = new AlgWalkerDecoration(
      2 * decA.moveCount + decB.moveCount,
      2 * decA.duration + decB.duration,
      ABAp,
      ABAp.invert(),
      [decA, decB]
    );
    return this.mult(dec, 1, [dec, decA, decB]);
  }
  traversePause(pause) {
    if (pause.experimentalNISSGrouping) {
      return this.dummyLeaf;
    }
    return new AlgWalkerDecoration(
      1,
      this.durationFn.traverseAlgNode(pause),
      this.identity,
      this.identity
    );
  }
  traverseNewline(_newline) {
    return this.dummyLeaf;
  }
  traverseLineComment(_comment) {
    return this.dummyLeaf;
  }
  mult(apd, n, child) {
    const absn = Math.abs(n);
    const st = apd.forward.selfMultiply(n);
    return new AlgWalkerDecoration(
      apd.moveCount * absn,
      apd.duration * absn,
      st,
      st.invert(),
      child
    );
  }
};
var WalkerDown = class {
  constructor(apd, back) {
    this.apd = apd;
    this.back = back;
  }
};
var AlgWalker = class extends TraversalDownUp {
  constructor(kpuzzle, algOrAlgNode, apd) {
    super();
    __publicField(this, "move");
    __publicField(this, "moveDuration");
    __publicField(this, "back");
    __publicField(this, "st");
    __publicField(this, "root");
    __publicField(this, "i");
    __publicField(this, "dur");
    __publicField(this, "goali");
    __publicField(this, "goaldur");
    this.kpuzzle = kpuzzle;
    this.algOrAlgNode = algOrAlgNode;
    this.apd = apd;
    this.i = -1;
    this.dur = -1;
    this.goali = -1;
    this.goaldur = -1;
    this.move = void 0;
    this.back = false;
    this.moveDuration = 0;
    this.st = this.kpuzzle.identityTransformation();
    this.root = new WalkerDown(this.apd, false);
  }
  moveByIndex(loc) {
    if (this.i >= 0 && this.i === loc) {
      return this.move !== void 0;
    }
    return this.dosearch(loc, Infinity);
  }
  moveByDuration(dur) {
    if (this.dur >= 0 && this.dur < dur && this.dur + this.moveDuration >= dur) {
      return this.move !== void 0;
    }
    return this.dosearch(Infinity, dur);
  }
  dosearch(loc, dur) {
    this.goali = loc;
    this.goaldur = dur;
    this.i = 0;
    this.dur = 0;
    this.move = void 0;
    this.moveDuration = 0;
    this.back = false;
    this.st = this.kpuzzle.identityTransformation();
    const r2 = this.algOrAlgNode.is(Alg) ? this.traverseAlg(this.algOrAlgNode, this.root) : this.traverseAlgNode(this.algOrAlgNode, this.root);
    return r2;
  }
  traverseAlg(alg, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    let i = wd.back ? alg.experimentalNumChildAlgNodes() - 1 : 0;
    for (const algNode of directedGenerator(
      alg.childAlgNodes(),
      wd.back ? -1 : 1
      /* Forwards */
    )) {
      if (this.traverseAlgNode(
        algNode,
        new WalkerDown(wd.apd.children[i], wd.back)
      )) {
        return true;
      }
      i += wd.back ? -1 : 1;
    }
    return false;
  }
  traverseGrouping(grouping, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    const back = this.domult(wd, grouping.amount);
    return this.traverseAlg(
      grouping.alg,
      new WalkerDown(wd.apd.children[0], back)
    );
  }
  traverseMove(move, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    this.move = move;
    this.moveDuration = wd.apd.duration;
    this.back = wd.back;
    return true;
  }
  traverseCommutator(commutator, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    const back = this.domult(wd, 1);
    if (back) {
      return this.traverseAlg(
        commutator.B,
        new WalkerDown(wd.apd.children[2], !back)
      ) || this.traverseAlg(
        commutator.A,
        new WalkerDown(wd.apd.children[1], !back)
      ) || this.traverseAlg(
        commutator.B,
        new WalkerDown(wd.apd.children[2], back)
      ) || this.traverseAlg(commutator.A, new WalkerDown(wd.apd.children[1], back));
    } else {
      return this.traverseAlg(
        commutator.A,
        new WalkerDown(wd.apd.children[1], back)
      ) || this.traverseAlg(
        commutator.B,
        new WalkerDown(wd.apd.children[2], back)
      ) || this.traverseAlg(
        commutator.A,
        new WalkerDown(wd.apd.children[1], !back)
      ) || this.traverseAlg(
        commutator.B,
        new WalkerDown(wd.apd.children[2], !back)
      );
    }
  }
  traverseConjugate(conjugate, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    const back = this.domult(wd, 1);
    if (back) {
      return this.traverseAlg(
        conjugate.A,
        new WalkerDown(wd.apd.children[1], !back)
      ) || this.traverseAlg(
        conjugate.B,
        new WalkerDown(wd.apd.children[2], back)
      ) || this.traverseAlg(conjugate.A, new WalkerDown(wd.apd.children[1], back));
    } else {
      return this.traverseAlg(
        conjugate.A,
        new WalkerDown(wd.apd.children[1], back)
      ) || this.traverseAlg(
        conjugate.B,
        new WalkerDown(wd.apd.children[2], back)
      ) || this.traverseAlg(conjugate.A, new WalkerDown(wd.apd.children[1], !back));
    }
  }
  traversePause(pause, wd) {
    if (!this.firstcheck(wd)) {
      return false;
    }
    this.move = pause;
    this.moveDuration = wd.apd.duration;
    this.back = wd.back;
    return true;
  }
  traverseNewline(_newline, _wd) {
    return false;
  }
  traverseLineComment(_lineComment, _wd) {
    return false;
  }
  firstcheck(wd) {
    if (wd.apd.moveCount + this.i <= this.goali && wd.apd.duration + this.dur < this.goaldur) {
      return this.keepgoing(wd);
    }
    return true;
  }
  domult(wd, amount) {
    let back = wd.back;
    if (amount === 0) {
      return back;
    }
    if (amount < 0) {
      back = !back;
      amount = -amount;
    }
    const base = wd.apd.children[0];
    const full = Math.min(
      Math.floor((this.goali - this.i) / base.moveCount),
      Math.ceil((this.goaldur - this.dur) / base.duration - 1)
    );
    if (full > 0) {
      this.keepgoing(new WalkerDown(base, back), full);
    }
    return back;
  }
  keepgoing(wd, mul = 1) {
    this.i += mul * wd.apd.moveCount;
    this.dur += mul * wd.apd.duration;
    if (mul !== 1) {
      if (wd.back) {
        this.st = this.st.applyTransformation(
          wd.apd.backward.selfMultiply(mul)
        );
      } else {
        this.st = this.st.applyTransformation(wd.apd.forward.selfMultiply(mul));
      }
    } else {
      if (wd.back) {
        this.st = this.st.applyTransformation(wd.apd.backward);
      } else {
        this.st = this.st.applyTransformation(wd.apd.forward);
      }
    }
    return false;
  }
};
var MIN_CHUNKING_THRESHOLD = 16;
function chunkifyAlg(alg, chunkMaxLength) {
  const mainAlgBuilder = new AlgBuilder();
  const chunkAlgBuilder = new AlgBuilder();
  for (const algNode of alg.childAlgNodes()) {
    chunkAlgBuilder.push(algNode);
    if (chunkAlgBuilder.experimentalNumAlgNodes() >= chunkMaxLength) {
      mainAlgBuilder.push(new Grouping(chunkAlgBuilder.toAlg()));
      chunkAlgBuilder.reset();
    }
  }
  mainAlgBuilder.push(new Grouping(chunkAlgBuilder.toAlg()));
  return mainAlgBuilder.toAlg();
}
var ChunkAlgs = class extends TraversalUp {
  traverseAlg(alg) {
    const algLength = alg.experimentalNumChildAlgNodes();
    if (algLength < MIN_CHUNKING_THRESHOLD) {
      return alg;
    }
    return chunkifyAlg(alg, Math.ceil(Math.sqrt(algLength)));
  }
  traverseGrouping(grouping) {
    return new Grouping(
      this.traverseAlg(grouping.alg),
      grouping.amount
      // TODO
    );
  }
  traverseMove(move) {
    return move;
  }
  traverseCommutator(commutator) {
    return new Conjugate(
      this.traverseAlg(commutator.A),
      this.traverseAlg(commutator.B)
    );
  }
  traverseConjugate(conjugate) {
    return new Conjugate(
      this.traverseAlg(conjugate.A),
      this.traverseAlg(conjugate.B)
    );
  }
  traversePause(pause) {
    return pause;
  }
  traverseNewline(newline) {
    return newline;
  }
  traverseLineComment(comment) {
    return comment;
  }
};
var chunkAlgs = functionFromTraversal(ChunkAlgs);
var TreeAlgIndexer = class {
  constructor(kpuzzle, alg) {
    __publicField(this, "decoration");
    __publicField(this, "walker");
    this.kpuzzle = kpuzzle;
    const deccon = new DecoratorConstructor(this.kpuzzle);
    const chunkedAlg = chunkAlgs(alg);
    this.decoration = deccon.traverseAlg(chunkedAlg);
    this.walker = new AlgWalker(this.kpuzzle, chunkedAlg, this.decoration);
  }
  getAnimLeaf(index) {
    if (this.walker.moveByIndex(index)) {
      if (!this.walker.move) {
        throw new Error("`this.walker.mv` missing");
      }
      const move = this.walker.move;
      if (this.walker.back) {
        return move.invert();
      }
      return move;
    }
    return null;
  }
  indexToMoveStartTimestamp(index) {
    if (this.walker.moveByIndex(index) || this.walker.i === index) {
      return this.walker.dur;
    }
    throw new Error(`Out of algorithm: index ${index}`);
  }
  indexToMovesInProgress(index) {
    if (this.walker.moveByIndex(index) || this.walker.i === index) {
      return this.walker.dur;
    }
    throw new Error(`Out of algorithm: index ${index}`);
  }
  patternAtIndex(index, startPattern) {
    this.walker.moveByIndex(index);
    return (startPattern ?? this.kpuzzle.defaultPattern()).applyTransformation(
      this.walker.st
    );
  }
  // TransformAtIndex does not reflect the start pattern; it only reflects
  // the change from the start pattern to the current move index.  If you
  // want the actual pattern, use patternAtIndex.
  transformationAtIndex(index) {
    this.walker.moveByIndex(index);
    return this.walker.st;
  }
  numAnimatedLeaves() {
    return this.decoration.moveCount;
  }
  timestampToIndex(timestamp) {
    this.walker.moveByDuration(timestamp);
    return this.walker.i;
  }
  algDuration() {
    return this.decoration.duration;
  }
  moveDuration(index) {
    this.walker.moveByIndex(index);
    return this.walker.moveDuration;
  }
};
var IndexerConstructorProp = class extends TwistyPropDerived {
  derive(inputs) {
    switch (inputs.indexerConstructorRequest) {
      case "auto":
        if (countMoves(inputs.alg.alg) < 100 && inputs.puzzle === "3x3x3" && inputs.visualizationStrategy === "Cube3D") {
          return SimultaneousMoveIndexer;
        } else {
          return TreeAlgIndexer;
        }
      case "tree":
        return TreeAlgIndexer;
      case "simple":
        return SimpleAlgIndexer;
      case "simultaneous":
        return SimultaneousMoveIndexer;
      default:
        throw new Error("Invalid indexer request!");
    }
  }
};
var IndexerConstructorRequestProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var IndexerProp = class extends TwistyPropDerived {
  derive(input) {
    return new input.indexerConstructor(input.kpuzzle, input.algWithIssues.alg);
  }
};
var LegacyPositionProp = class extends TwistyPropDerived {
  derive(inputs) {
    return {
      pattern: inputs.currentPattern,
      movesInProgress: inputs.currentMoveInfo.currentMoves
    };
  }
};
var validate = true;
var PuzzleAlgProp = class extends TwistyPropDerived {
  async derive(inputs) {
    try {
      if (validate) {
        inputs.kpuzzle.algToTransformation(inputs.algWithIssues.alg);
      }
      return inputs.algWithIssues;
    } catch (e) {
      return {
        alg: new Alg(),
        issues: new AlgIssues({
          errors: [`Invalid alg for puzzle: ${e.toString()}`]
        })
      };
    }
  }
};
var SetupAnchorProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "start";
  }
};
var SetupTransformationProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return null;
  }
};
var KPuzzleProp = class extends TwistyPropDerived {
  async derive(inputs) {
    return inputs.puzzleLoader.kpuzzle();
  }
};
var PGPuzzleDescriptionStringProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return NO_VALUE;
  }
};
var PuzzleIDProp = class extends TwistyPropDerived {
  async derive(inputs) {
    return inputs.puzzleLoader.id;
  }
};
var PuzzleIDRequestProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return NO_VALUE;
  }
};
var PuzzleLoaderProp = class extends TwistyPropDerived {
  derive(inputs) {
    if (inputs.puzzleIDRequest && inputs.puzzleIDRequest !== NO_VALUE) {
      const puzzleLoader = puzzles[inputs.puzzleIDRequest];
      if (!puzzleLoader) {
        this.userVisibleErrorTracker.set({
          errors: [`Invalid puzzle ID: ${inputs.puzzleIDRequest}`]
        });
      }
      return puzzleLoader;
    }
    if (inputs.puzzleDescriptionRequest && inputs.puzzleDescriptionRequest !== NO_VALUE) {
      return customPGPuzzleLoader(inputs.puzzleDescriptionRequest);
    }
    return cube3x3x3;
  }
};
var CoarseTimelineInfoProp = class extends TwistyPropDerived {
  derive(inputs) {
    return {
      playing: inputs.playingInfo.playing,
      atStart: inputs.detailedTimelineInfo.atStart,
      atEnd: inputs.detailedTimelineInfo.atEnd
    };
  }
  canReuseValue(v1, v2) {
    return v1.playing === v2.playing && v1.atStart === v2.atStart && v1.atEnd === v2.atEnd;
  }
};
var _requestedTimestampToMilliseconds, requestedTimestampToMilliseconds_fn, _a12;
var DetailedTimelineInfoProp = (_a12 = class extends TwistyPropDerived {
  constructor() {
    super(...arguments);
    __privateAdd(this, _requestedTimestampToMilliseconds);
  }
  derive(inputs) {
    let timestamp = __privateMethod(this, _requestedTimestampToMilliseconds, requestedTimestampToMilliseconds_fn).call(this, inputs);
    let atStart = false;
    let atEnd = false;
    if (timestamp >= inputs.timeRange.end) {
      atEnd = true;
      timestamp = Math.min(inputs.timeRange.end, timestamp);
    }
    if (timestamp <= inputs.timeRange.start) {
      atStart = true;
      timestamp = Math.max(inputs.timeRange.start, timestamp);
    }
    return {
      timestamp,
      timeRange: inputs.timeRange,
      atStart,
      atEnd
    };
  }
  canReuseValue(v1, v2) {
    return v1.timestamp === v2.timestamp && v1.timeRange.start === v2.timeRange.start && v1.timeRange.end === v2.timeRange.end && v1.atStart === v2.atStart && v1.atEnd === v2.atEnd;
  }
}, _requestedTimestampToMilliseconds = new WeakSet(), requestedTimestampToMilliseconds_fn = function(inputs) {
  switch (inputs.timestampRequest) {
    case "auto":
      return inputs.setupAnchor === "start" && inputs.setupAlg.alg.experimentalIsEmpty() ? inputs.timeRange.end : inputs.timeRange.start;
    case "start":
      return inputs.timeRange.start;
    case "end":
      return inputs.timeRange.end;
    case "anchor":
      return inputs.setupAnchor === "start" ? inputs.timeRange.start : inputs.timeRange.end;
    case "opposite-anchor":
      return inputs.setupAnchor === "start" ? inputs.timeRange.end : inputs.timeRange.start;
    default:
      return inputs.timestampRequest;
  }
}, _a12);
var PlayingInfoProp = class extends TwistyPropSource {
  async getDefaultValue() {
    return {
      direction: 1,
      playing: false,
      untilBoundary: "entire-timeline",
      loop: false
    };
  }
  async derive(newInfo, oldValuePromise) {
    const oldValue = await oldValuePromise;
    const newValue = Object.assign({}, oldValue);
    Object.assign(newValue, newInfo);
    return newValue;
  }
  canReuseValue(v1, v2) {
    return v1.direction === v2.direction && v1.playing === v2.playing && v1.untilBoundary === v2.untilBoundary && v1.loop === v2.loop;
  }
};
var TempoScaleProp = class extends TwistyPropSource {
  getDefaultValue() {
    return 1;
  }
  derive(v) {
    return v < 0 ? 1 : v;
  }
};
var smartTimestamps = {
  auto: true,
  start: true,
  end: true,
  anchor: true,
  "opposite-anchor": true
};
var TimestampRequestProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
  set(v) {
    const currentValue = this.get();
    super.set(
      (async () => {
        if (!this.validInput(await v)) {
          return currentValue;
        }
        return v;
      })()
    );
  }
  validInput(v) {
    if (typeof v === "number") {
      return true;
    }
    if (smartTimestamps[v]) {
      return true;
    }
    return false;
  }
};
var BackViewProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var TimeRangeProp = class extends TwistyPropDerived {
  derive(inputs) {
    return {
      start: 0,
      end: inputs.indexer.algDuration()
    };
  }
};
var ViewerLinkProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var VisualizationFormatProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var VisualizationStrategyProp = class extends TwistyPropDerived {
  derive(inputs) {
    switch (inputs.puzzleID) {
      case "clock":
      case "square1":
      case "redi_cube":
      case "melindas2x2x2x2":
      case "loopover":
        return "2D";
      case "3x3x3":
        switch (inputs.visualizationRequest) {
          case "auto":
          case "3D":
            return "Cube3D";
          default:
            return inputs.visualizationRequest;
        }
      default:
        switch (inputs.visualizationRequest) {
          case "auto":
          case "3D":
            return "PG3D";
          case "experimental-2D-LL":
          case "experimental-2D-LL-face":
            if (["2x2x2", "4x4x4", "megaminx"].includes(inputs.puzzleID)) {
              return "experimental-2D-LL";
            } else {
              return "2D";
            }
          default:
            return inputs.visualizationRequest;
        }
    }
  }
};
var FaceletScaleProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var FoundationDisplayProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var InitialHintFaceletsAnimationProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var cachedLoader = null;
async function loader() {
  return cachedLoader ?? (cachedLoader = new (await THREEJS).TextureLoader());
}
var SpriteProp = class extends TwistyPropDerived {
  async derive(inputs) {
    const { spriteURL: textureURL } = inputs;
    if (textureURL === null) {
      return null;
    }
    return new Promise(async (resolve, _reject) => {
      const onLoadingError = () => {
        console.warn("Could not load sprite:", textureURL.toString());
        resolve(null);
      };
      try {
        (await loader()).load(
          textureURL.toString(),
          resolve,
          onLoadingError,
          onLoadingError
        );
      } catch (e) {
        onLoadingError();
      }
    });
  }
};
var r = {
  facelets: ["regular", "regular", "regular", "regular", "regular"]
};
async function fullStickeringMask(puzzleLoader) {
  const { definition } = await puzzleLoader.kpuzzle();
  const fullStickeringMask2 = { orbits: {} };
  for (const orbitDefinition of definition.orbits) {
    fullStickeringMask2.orbits[orbitDefinition.orbitName] = {
      pieces: new Array(orbitDefinition.numPieces).fill(r)
    };
  }
  return fullStickeringMask2;
}
var StickeringMaskProp = class extends TwistyPropDerived {
  getDefaultValue() {
    return { orbits: {} };
  }
  async derive(inputs) {
    if (inputs.stickeringMaskRequest) {
      return inputs.stickeringMaskRequest;
    }
    if (inputs.stickeringRequest === "picture") {
      return {
        specialBehaviour: "picture",
        orbits: {}
      };
    }
    return inputs.puzzleLoader.stickeringMask?.(
      inputs.stickeringRequest ?? "full"
    ) ?? fullStickeringMask(inputs.puzzleLoader);
  }
  // TODO: Implement canReuseValue?
};
var charMap = {
  "-": "Regular",
  D: "Dim",
  I: "Ignored",
  // o: ExperimentalPieceStickering.OrientationStickers, // TODO: hack for centers
  X: "Invisible",
  O: "IgnoreNonPrimary",
  // orient color known
  P: "PermuteNonPrimary",
  // Example: PLL
  o: "Ignoriented",
  // Example: LL edges during CLS
  "?": "OrientationWithoutPermutation",
  // ACube: ignore position
  "@": "Regular"
  /* Regular */
  // ACube: ignore orientation // TODO: distinguish from "regular"
};
function parseSerializedStickeringMask(serializedStickeringMask) {
  const stickeringMask = {
    orbits: {}
  };
  const serializedOrbits = serializedStickeringMask.split(",");
  for (const serializedOrbit of serializedOrbits) {
    const [orbitName, serializedOrbitPieces, ...rest] = serializedOrbit.split(":");
    if (rest.length > 0) {
      throw new Error(
        `Invalid serialized orbit stickering mask (too many colons): \`${serializedOrbit}\``
      );
    }
    const pieces = [];
    stickeringMask.orbits[orbitName] = { pieces };
    for (const char of serializedOrbitPieces) {
      const pieceStickering = charMap[char];
      pieces.push(getPieceStickeringMask(pieceStickering));
    }
  }
  return stickeringMask;
}
var StickeringMaskRequestProp = class extends TwistyPropSource {
  getDefaultValue() {
    return null;
  }
  derive(input) {
    if (input === null) {
      return null;
    } else if (typeof input === "string") {
      return parseSerializedStickeringMask(input);
    } else {
      return input;
    }
  }
};
var StickeringRequestProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return null;
  }
};
var DragInputProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var MovePressCancelOptions = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return {};
  }
};
var MovePressInputProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var BackgroundProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var ColorSchemeProp = class extends TwistyPropDerived {
  derive(inputs) {
    return inputs.colorSchemeRequest === "dark" ? "dark" : "light";
  }
};
var ColorSchemeRequestProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var DOMElementReferenceProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return null;
  }
};
var DEFAULT_LATITUDE_LIMIT = 35;
var LatitudeLimitProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return DEFAULT_LATITUDE_LIMIT;
  }
};
function orbitCoordinatesEqual(c1, c2) {
  return c1.latitude === c2.latitude && c1.longitude === c2.longitude && c1.distance === c2.distance;
}
var OrbitCoordinatesRequestProp = class extends TwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
  canReuseValue(v1, v2) {
    return v1 === v2 || orbitCoordinatesEqual(v1, v2);
  }
  async derive(newCoordinates, oldValuePromise) {
    if (newCoordinates === "auto") {
      return "auto";
    }
    let oldValue = await oldValuePromise;
    if (oldValue === "auto") {
      oldValue = {};
    }
    const newValue = Object.assign({}, oldValue);
    Object.assign(newValue, newCoordinates);
    if (typeof newValue.latitude !== "undefined") {
      newValue.latitude = Math.min(Math.max(newValue.latitude, -90), 90);
    }
    if (typeof newValue.longitude !== "undefined") {
      newValue.longitude = modIntoRange(newValue.longitude, 180, -180);
    }
    return newValue;
  }
};
var OrbitCoordinatesProp = class extends TwistyPropDerived {
  canReuseValue(v1, v2) {
    return orbitCoordinatesEqual(v1, v2);
  }
  async derive(inputs) {
    if (inputs.orbitCoordinatesRequest === "auto") {
      return defaultCameraOrbitCoordinates(inputs.puzzleID, inputs.strategy);
    }
    const req = Object.assign(
      Object.assign(
        {},
        defaultCameraOrbitCoordinates(inputs.puzzleID, inputs.strategy),
        inputs.orbitCoordinatesRequest
      )
    );
    if (Math.abs(req.latitude) <= inputs.latitudeLimit) {
      return req;
    } else {
      const { latitude, longitude, distance } = req;
      return {
        latitude: inputs.latitudeLimit * Math.sign(latitude),
        longitude,
        distance
      };
    }
  }
};
var centeredCameraOrbitCoordinates = {
  latitude: 31.717474411461005,
  longitude: 0,
  distance: 5.877852522924731
};
var cubeCube3DCameraOrbitCoordinates = {
  latitude: 35,
  longitude: 30,
  distance: 6
};
var cubePG3DCameraOrbitCoordinates = {
  latitude: 35,
  longitude: 30,
  distance: 6.25
};
var megaminxCameraOrbitCoordinates = {
  latitude: Math.atan(1 / 2) * DEGREES_PER_RADIAN,
  longitude: 0,
  distance: 6.7
};
var pyraminxCameraOrbitCoordinates = {
  latitude: 26.56505117707799,
  longitude: 0,
  distance: 6
};
function defaultCameraOrbitCoordinates(puzzleID, strategy) {
  if (puzzleID[1] === "x") {
    if (strategy === "Cube3D") {
      return cubeCube3DCameraOrbitCoordinates;
    } else {
      return cubePG3DCameraOrbitCoordinates;
    }
  } else {
    switch (puzzleID) {
      case "megaminx":
      case "gigaminx":
        return megaminxCameraOrbitCoordinates;
      case "pyraminx":
      case "master_tetraminx":
        return pyraminxCameraOrbitCoordinates;
      case "skewb":
        return cubePG3DCameraOrbitCoordinates;
      default:
        return centeredCameraOrbitCoordinates;
    }
  }
}
var TwistySceneModel = class {
  constructor(twistyPlayerModel) {
    // Depth 0
    __publicField(this, "background", new BackgroundProp());
    __publicField(this, "colorSchemeRequest", new ColorSchemeRequestProp());
    __publicField(this, "dragInput", new DragInputProp());
    __publicField(this, "foundationDisplay", new FoundationDisplayProp());
    __publicField(this, "foundationStickerSpriteURL", new URLProp());
    __publicField(this, "fullscreenElement", new DOMElementReferenceProp());
    __publicField(this, "hintFacelet", new HintFaceletProp());
    __publicField(this, "hintStickerSpriteURL", new URLProp());
    __publicField(this, "initialHintFaceletsAnimation", new InitialHintFaceletsAnimationProp());
    __publicField(this, "latitudeLimit", new LatitudeLimitProp());
    __publicField(this, "movePressInput", new MovePressInputProp());
    __publicField(this, "movePressCancelOptions", new MovePressCancelOptions());
    __publicField(this, "orbitCoordinatesRequest", new OrbitCoordinatesRequestProp());
    // `stickeringMaskRequest` takes priority over `stickeringRequest`
    __publicField(this, "stickeringMaskRequest", new StickeringMaskRequestProp());
    __publicField(this, "stickeringRequest", new StickeringRequestProp());
    __publicField(this, "faceletScale", new FaceletScaleProp());
    // Depth 1
    __publicField(this, "colorScheme", new ColorSchemeProp({
      colorSchemeRequest: this.colorSchemeRequest
    }));
    __publicField(this, "foundationStickerSprite", new SpriteProp({
      spriteURL: this.foundationStickerSpriteURL
    }));
    __publicField(this, "hintStickerSprite", new SpriteProp({
      spriteURL: this.hintStickerSpriteURL
    }));
    // Dependence on TwistyPlayerModel
    __publicField(this, "orbitCoordinates");
    __publicField(this, "stickeringMask");
    this.twistyPlayerModel = twistyPlayerModel;
    this.orbitCoordinates = new OrbitCoordinatesProp({
      orbitCoordinatesRequest: this.orbitCoordinatesRequest,
      latitudeLimit: this.latitudeLimit,
      puzzleID: twistyPlayerModel.puzzleID,
      strategy: twistyPlayerModel.visualizationStrategy
    });
    this.stickeringMask = new StickeringMaskProp({
      stickeringMaskRequest: this.stickeringMaskRequest,
      stickeringRequest: this.stickeringRequest,
      puzzleLoader: twistyPlayerModel.puzzleLoader
    });
  }
};
var EMPTY_ERRORS = { errors: [] };
var UserVisibleErrorTracker = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return EMPTY_ERRORS;
  }
  reset() {
    this.set(this.getDefaultValue());
  }
  canReuseValue(_v1, _v2) {
    return arrayEquals(_v1.errors, _v2.errors);
  }
};
var TwistyPlayerModel = class {
  constructor() {
    // TODO: incorporate error handling into the entire prop graph.
    // TODO: Make this something that can't get confused with normal props?
    __publicField(this, "userVisibleErrorTracker", new UserVisibleErrorTracker());
    // TODO: Redistribute and group props with controllers.
    // Depth 0
    __publicField(this, "alg", new AlgProp());
    __publicField(this, "backView", new BackViewProp());
    __publicField(this, "controlPanel", new ControlPanelProp());
    __publicField(this, "catchUpMove", new CatchUpMoveProp());
    __publicField(this, "indexerConstructorRequest", new IndexerConstructorRequestProp());
    __publicField(this, "playingInfo", new PlayingInfoProp());
    __publicField(this, "puzzleDescriptionRequest", new PGPuzzleDescriptionStringProp());
    __publicField(this, "puzzleIDRequest", new PuzzleIDRequestProp());
    __publicField(this, "setupAnchor", new SetupAnchorProp());
    __publicField(this, "setupAlg", new AlgProp());
    __publicField(this, "setupTransformation", new SetupTransformationProp());
    __publicField(this, "tempoScale", new TempoScaleProp());
    __publicField(this, "timestampRequest", new TimestampRequestProp());
    __publicField(this, "viewerLink", new ViewerLinkProp());
    __publicField(this, "visualizationFormat", new VisualizationFormatProp());
    // Metadata
    __publicField(this, "title", new ArbitraryStringProp());
    __publicField(this, "videoURL", new URLProp());
    __publicField(this, "competitionID", new ArbitraryStringProp());
    // Depth 1
    __publicField(this, "puzzleLoader", new PuzzleLoaderProp(
      {
        puzzleIDRequest: this.puzzleIDRequest,
        puzzleDescriptionRequest: this.puzzleDescriptionRequest
      },
      this.userVisibleErrorTracker
    ));
    // Depth 2
    __publicField(this, "kpuzzle", new KPuzzleProp({ puzzleLoader: this.puzzleLoader }));
    __publicField(this, "puzzleID", new PuzzleIDProp({ puzzleLoader: this.puzzleLoader }));
    // Depth 3
    __publicField(this, "puzzleAlg", new PuzzleAlgProp({
      algWithIssues: this.alg,
      kpuzzle: this.kpuzzle
    }));
    __publicField(this, "puzzleSetupAlg", new PuzzleAlgProp({
      algWithIssues: this.setupAlg,
      kpuzzle: this.kpuzzle
    }));
    __publicField(this, "visualizationStrategy", new VisualizationStrategyProp({
      visualizationRequest: this.visualizationFormat,
      puzzleID: this.puzzleID
    }));
    // Depth 4
    __publicField(this, "indexerConstructor", new IndexerConstructorProp({
      alg: this.alg,
      puzzle: this.puzzleID,
      visualizationStrategy: this.visualizationStrategy,
      indexerConstructorRequest: this.indexerConstructorRequest
    }));
    __publicField(this, "setupAlgTransformation", new AlgTransformationProp({
      setupAlg: this.puzzleSetupAlg,
      kpuzzle: this.kpuzzle
    }));
    // Depth 5
    __publicField(this, "indexer", new IndexerProp({
      indexerConstructor: this.indexerConstructor,
      algWithIssues: this.puzzleAlg,
      kpuzzle: this.kpuzzle
    }));
    // Depth 6
    __publicField(this, "anchorTransformation", new AnchorTransformationProp({
      setupTransformation: this.setupTransformation,
      setupAnchor: this.setupAnchor,
      setupAlgTransformation: this.setupAlgTransformation,
      indexer: this.indexer
    }));
    __publicField(this, "timeRange", new TimeRangeProp({
      indexer: this.indexer
    }));
    // Depth 7
    __publicField(this, "detailedTimelineInfo", new DetailedTimelineInfoProp(
      {
        timestampRequest: this.timestampRequest,
        timeRange: this.timeRange,
        setupAnchor: this.setupAnchor,
        setupAlg: this.setupAlg
      }
    ));
    // Depth 8
    __publicField(this, "coarseTimelineInfo", new CoarseTimelineInfoProp({
      detailedTimelineInfo: this.detailedTimelineInfo,
      playingInfo: this.playingInfo
    }));
    __publicField(this, "currentMoveInfo", new CurrentMoveInfoProp({
      indexer: this.indexer,
      detailedTimelineInfo: this.detailedTimelineInfo,
      catchUpMove: this.catchUpMove
    }));
    // Depth 9
    // TODO: Inline Twisty3D management.
    __publicField(this, "buttonAppearance", new ButtonAppearanceProp({
      coarseTimelineInfo: this.coarseTimelineInfo,
      viewerLink: this.viewerLink
    }));
    __publicField(this, "currentLeavesSimplified", new CurrentLeavesSimplifiedProp({
      currentMoveInfo: this.currentMoveInfo
    }));
    // Depth 10
    __publicField(this, "currentPattern", new CurrentPatternProp({
      anchoredStart: this.anchorTransformation,
      currentLeavesSimplified: this.currentLeavesSimplified,
      indexer: this.indexer
    }));
    // Depth 11
    __publicField(this, "legacyPosition", new LegacyPositionProp({
      currentMoveInfo: this.currentMoveInfo,
      currentPattern: this.currentPattern
    }));
    __publicField(this, "twistySceneModel", new TwistySceneModel(this));
  }
  async twizzleLink() {
    const [
      viewerLink,
      puzzleID,
      puzzleDescription,
      alg,
      setup,
      anchor,
      experimentalStickeringRequest,
      experimentalTitle
    ] = await Promise.all([
      this.viewerLink.get(),
      this.puzzleID.get(),
      this.puzzleDescriptionRequest.get(),
      this.alg.get(),
      this.setupAlg.get(),
      this.setupAnchor.get(),
      this.twistySceneModel.stickeringRequest.get(),
      this.twistySceneModel.twistyPlayerModel.title.get()
    ]);
    const isExplorer = viewerLink === "experimental-twizzle-explorer";
    const url = new URL(
      `https://alpha.twizzle.net/${isExplorer ? "explore" : "edit"}/`
    );
    if (!alg.alg.experimentalIsEmpty()) {
      url.searchParams.set("alg", alg.alg.toString());
    }
    if (!setup.alg.experimentalIsEmpty()) {
      url.searchParams.set("setup-alg", setup.alg.toString());
    }
    if (anchor !== "start") {
      url.searchParams.set("setup-anchor", anchor);
    }
    if (experimentalStickeringRequest !== "full" && experimentalStickeringRequest !== null) {
      url.searchParams.set(
        "experimental-stickering",
        experimentalStickeringRequest
      );
    }
    if (isExplorer && puzzleDescription !== NO_VALUE) {
      url.searchParams.set("puzzle-description", puzzleDescription);
    } else if (puzzleID !== "3x3x3") {
      url.searchParams.set("puzzle", puzzleID);
    }
    if (experimentalTitle) {
      url.searchParams.set("title", experimentalTitle);
    }
    return url.toString();
  }
  experimentalAddAlgLeaf(algLeaf, options) {
    const maybeMove = algLeaf.as(Move);
    if (maybeMove) {
      this.experimentalAddMove(maybeMove, options);
    } else {
      this.alg.set(
        (async () => {
          const alg = (await this.alg.get()).alg;
          const newAlg = alg.concat(new Alg([algLeaf]));
          this.timestampRequest.set("end");
          return newAlg;
        })()
      );
    }
  }
  // TODO: Animate the new move.
  experimentalAddMove(flexibleMove, options) {
    const move = typeof flexibleMove === "string" ? new Move(flexibleMove) : flexibleMove;
    this.alg.set(
      (async () => {
        const [{ alg }, puzzleLoader] = await Promise.all([
          this.alg.get(),
          this.puzzleLoader.get()
        ]);
        const newAlg = experimentalAppendMove(alg, move, {
          ...options,
          ...await getPartialAppendOptionsForPuzzleSpecificSimplifyOptions(
            puzzleLoader
          )
        });
        this.timestampRequest.set("end");
        this.catchUpMove.set({
          move,
          amount: 0
        });
        return newAlg;
      })()
    );
  }
  // TODO: allow more than 1?
  experimentalRemoveFinalChild() {
    this.alg.set(
      (async () => {
        const alg = (await this.alg.get()).alg;
        const children = Array.from(alg.childAlgNodes());
        const [finalChild] = children.splice(-1);
        if (!finalChild) {
          return alg;
        }
        this.timestampRequest.set("end");
        const finalChildMove = finalChild.as(Move);
        if (finalChildMove) {
          this.catchUpMove.set({
            move: finalChildMove.invert(),
            amount: 0
          });
        }
        return new Alg(children);
      })()
    );
  }
};
function err(propName) {
  return new Error(
    `Cannot get \`.${propName}\` directly from a \`TwistyPlayer\`.`
  );
}
var TwistyPlayerSettable = class extends ManagedCustomElement {
  constructor() {
    super(...arguments);
    __publicField(this, "experimentalModel", new TwistyPlayerModel());
    __publicField(this, "experimentalGet", new ExperimentalGetters(this.experimentalModel));
  }
  set alg(newAlg) {
    this.experimentalModel.alg.set(newAlg);
  }
  get alg() {
    throw err("alg");
  }
  set experimentalSetupAlg(newSetup) {
    this.experimentalModel.setupAlg.set(newSetup);
  }
  get experimentalSetupAlg() {
    throw err("setup");
  }
  set experimentalSetupAnchor(anchor) {
    this.experimentalModel.setupAnchor.set(anchor);
  }
  get experimentalSetupAnchor() {
    throw err("anchor");
  }
  set puzzle(puzzleID) {
    this.experimentalModel.puzzleIDRequest.set(puzzleID);
  }
  get puzzle() {
    throw err("puzzle");
  }
  set experimentalPuzzleDescription(puzzleDescription) {
    this.experimentalModel.puzzleDescriptionRequest.set(puzzleDescription);
  }
  get experimentalPuzzleDescription() {
    throw err("experimentalPuzzleDescription");
  }
  set timestamp(timestamp) {
    this.experimentalModel.timestampRequest.set(timestamp);
  }
  get timestamp() {
    throw err("timestamp");
  }
  set hintFacelets(hintFaceletStyle) {
    this.experimentalModel.twistySceneModel.hintFacelet.set(hintFaceletStyle);
  }
  get hintFacelets() {
    throw err("hintFacelets");
  }
  set experimentalStickering(stickering) {
    this.experimentalModel.twistySceneModel.stickeringRequest.set(stickering);
  }
  get experimentalStickering() {
    throw err("experimentalStickering");
  }
  set experimentalStickeringMaskOrbits(stickeringMask) {
    this.experimentalModel.twistySceneModel.stickeringMaskRequest.set(
      stickeringMask
    );
  }
  get experimentalStickeringMaskOrbits() {
    throw err("experimentalStickeringMaskOrbits");
  }
  set experimentalFaceletScale(faceletScale) {
    this.experimentalModel.twistySceneModel.faceletScale.set(faceletScale);
  }
  get experimentalFaceletScale() {
    throw err("experimentalFaceletScale");
  }
  set backView(backView) {
    this.experimentalModel.backView.set(backView);
  }
  get backView() {
    throw err("backView");
  }
  set background(backgroundTheme) {
    this.experimentalModel.twistySceneModel.background.set(backgroundTheme);
  }
  get background() {
    throw err("background");
  }
  set colorScheme(colorScheme) {
    this.experimentalModel.twistySceneModel.colorSchemeRequest.set(colorScheme);
  }
  get colorScheme() {
    throw err("colorScheme");
  }
  set controlPanel(newControlPanel) {
    this.experimentalModel.controlPanel.set(newControlPanel);
  }
  get controlPanel() {
    throw err("controlPanel");
  }
  set visualization(visualizationFormat) {
    this.experimentalModel.visualizationFormat.set(visualizationFormat);
  }
  get visualization() {
    throw err("visualization");
  }
  set experimentalTitle(title) {
    this.experimentalModel.title.set(title);
  }
  get experimentalTitle() {
    throw err("experimentalTitle");
  }
  set experimentalVideoURL(videoURL) {
    this.experimentalModel.videoURL.set(videoURL);
  }
  get experimentalVideoURL() {
    throw err("experimentalVideoURL");
  }
  set experimentalCompetitionID(competitionID) {
    this.experimentalModel.competitionID.set(competitionID);
  }
  get experimentalCompetitionID() {
    throw err("experimentalCompetitionID");
  }
  set viewerLink(viewerLinkPage) {
    this.experimentalModel.viewerLink.set(viewerLinkPage);
  }
  get viewerLink() {
    throw err("viewerLink");
  }
  set experimentalMovePressInput(movePressInput) {
    this.experimentalModel.twistySceneModel.movePressInput.set(movePressInput);
  }
  get experimentalMovePressInput() {
    throw err("experimentalMovePressInput");
  }
  set experimentalMovePressCancelOptions(movePressCancelOptions) {
    this.experimentalModel.twistySceneModel.movePressCancelOptions.set(
      movePressCancelOptions
    );
  }
  get experimentalMovePressCancelOptions() {
    throw err("experimentalMovePressCancelOptions");
  }
  set cameraLatitude(latitude) {
    this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
      latitude
    });
  }
  get cameraLatitude() {
    throw err("cameraLatitude");
  }
  set cameraLongitude(longitude) {
    this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
      longitude
    });
  }
  get cameraLongitude() {
    throw err("cameraLongitude");
  }
  set cameraDistance(distance) {
    this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({
      distance
    });
  }
  get cameraDistance() {
    throw err("cameraDistance");
  }
  set cameraLatitudeLimit(latitudeLimit) {
    this.experimentalModel.twistySceneModel.latitudeLimit.set(latitudeLimit);
  }
  get cameraLatitudeLimit() {
    throw err("cameraLatitudeLimit");
  }
  set indexer(indexer) {
    this.experimentalModel.indexerConstructorRequest.set(indexer);
  }
  get indexer() {
    throw err("indexer");
  }
  set tempoScale(newTempoScale) {
    this.experimentalModel.tempoScale.set(newTempoScale);
  }
  get tempoScale() {
    throw err("tempoScale");
  }
  set experimentalSprite(url) {
    this.experimentalModel.twistySceneModel.foundationStickerSpriteURL.set(url);
  }
  get experimentalSprite() {
    throw err("experimentalSprite");
  }
  set experimentalHintSprite(url) {
    this.experimentalModel.twistySceneModel.hintStickerSpriteURL.set(url);
  }
  get experimentalHintSprite() {
    throw err("experimentalHintSprite");
  }
  set fullscreenElement(element) {
    this.experimentalModel.twistySceneModel.fullscreenElement.set(element);
  }
  get fullscreenElement() {
    throw err("fullscreenElement");
  }
  set experimentalInitialHintFaceletsAnimation(anim) {
    this.experimentalModel.twistySceneModel.initialHintFaceletsAnimation.set(
      anim
    );
  }
  get experimentalInitialHintFaceletsAnimation() {
    throw err("experimentalInitialHintFaceletsAnimation");
  }
  set experimentalDragInput(dragInputMode) {
    this.experimentalModel.twistySceneModel.dragInput.set(dragInputMode);
  }
  get experimentalDragInput() {
    throw err("experimentalDragInput");
  }
};
var ExperimentalGetters = class {
  constructor(model) {
    this.model = model;
  }
  async alg() {
    return (await this.model.alg.get()).alg;
  }
  async setupAlg() {
    return (await this.model.setupAlg.get()).alg;
  }
  puzzleID() {
    return this.model.puzzleID.get();
  }
  async timestamp() {
    return (await this.model.detailedTimelineInfo.get()).timestamp;
  }
};
var DATA_ATTRIBUTE_PREFIX = "data-";
var twistyPlayerAttributeMap = {
  // TODO: We assume each of these can be set using a string or will be automatically converted by JS (e.g. numbers). Can we enforce
  // that with types? Do we need to add a translation mechanism for things we
  // don't want to leave settable as strings?
  // TODO: Enum validation.
  // Alg
  alg: "alg",
  "experimental-setup-alg": "experimentalSetupAlg",
  // String-based
  "experimental-setup-anchor": "experimentalSetupAnchor",
  puzzle: "puzzle",
  "experimental-puzzle-description": "experimentalPuzzleDescription",
  visualization: "visualization",
  "hint-facelets": "hintFacelets",
  "experimental-stickering": "experimentalStickering",
  "experimental-stickering-mask-orbits": "experimentalStickeringMaskOrbits",
  background: "background",
  "color-scheme": "colorScheme",
  "control-panel": "controlPanel",
  "back-view": "backView",
  "experimental-initial-hint-facelets-animation": "experimentalInitialHintFaceletsAnimation",
  // "indexer": "indexer",
  "viewer-link": "viewerLink",
  "experimental-move-press-input": "experimentalMovePressInput",
  "experimental-drag-input": "experimentalDragInput",
  // Metadata
  "experimental-title": "experimentalTitle",
  "experimental-video-url": "experimentalVideoURL",
  "experimental-competition-id": "experimentalCompetitionID",
  // Number-based
  "camera-latitude": "cameraLatitude",
  "camera-longitude": "cameraLongitude",
  "camera-distance": "cameraDistance",
  "camera-latitude-limit": "cameraLatitudeLimit",
  "tempo-scale": "tempoScale",
  // URL-based
  "experimental-sprite": "experimentalSprite",
  "experimental-hint-sprite": "experimentalHintSprite"
};
var configKeys = Object.fromEntries(
  Object.values(twistyPlayerAttributeMap).map((s) => [s, true])
);
var propOnly = {
  experimentalMovePressCancelOptions: true
};
var _controlsManager, _visualizationWrapperElem, _errorElem, _alreadyConnected, _flashLevel, _visualizationWrapper, _initial3DVisualizationWrapper, _visualizationStrategy, _setVisualizationWrapper, setVisualizationWrapper_fn, _a13;
var TwistyPlayer = (_a13 = class extends TwistyPlayerSettable {
  // #onCanvasClick() {
  // }
  constructor(config = {}) {
    super();
    __privateAdd(this, _setVisualizationWrapper);
    __publicField(this, "controller", new TwistyPlayerController(
      this.experimentalModel,
      this
    ));
    __publicField(this, "buttons");
    __publicField(this, "experimentalCanvasClickCallback", () => {
    });
    __privateAdd(this, _controlsManager, new ClassListManager(
      this,
      "controls-",
      ["auto"].concat(
        Object.keys(controlsLocations)
      )
    ));
    __privateAdd(this, _visualizationWrapperElem, document.createElement("div"));
    // TODO: Better pattern.
    __privateAdd(this, _errorElem, document.createElement("div"));
    // TODO: Better pattern.
    __privateAdd(this, _alreadyConnected, false);
    __privateAdd(this, _flashLevel, "auto");
    __privateAdd(this, _visualizationWrapper, null);
    __privateAdd(this, _initial3DVisualizationWrapper, new InitialValueTracker());
    __privateAdd(this, _visualizationStrategy, null);
    for (const [propName, value] of Object.entries(config)) {
      if (!(configKeys[propName] || propOnly[propName])) {
        console.warn(`Invalid config passed to TwistyPlayer: ${propName}`);
        break;
      }
      this[propName] = value;
    }
  }
  // TODO: support resetting
  async connectedCallback() {
    if (__privateGet(this, _alreadyConnected)) {
      return;
    }
    __privateSet(this, _alreadyConnected, true);
    this.addCSS(twistyPlayerCSS);
    this.addElement(__privateGet(this, _visualizationWrapperElem)).classList.add(
      "visualization-wrapper"
    );
    this.addElement(__privateGet(this, _errorElem)).classList.add("error-elem");
    __privateGet(this, _errorElem).textContent = "Error";
    this.experimentalModel.userVisibleErrorTracker.addFreshListener(
      (userVisibleError) => {
        const errorString = userVisibleError.errors[0] ?? null;
        this.contentWrapper.classList.toggle("error", !!errorString);
        if (errorString) {
          __privateGet(this, _errorElem).textContent = errorString;
        }
      }
    );
    const scrubber = new TwistyScrubber(
      this.experimentalModel,
      this.controller
    );
    this.contentWrapper.appendChild(scrubber);
    this.buttons = new TwistyButtons(
      this.experimentalModel,
      this.controller,
      this
    );
    this.contentWrapper.appendChild(this.buttons);
    this.experimentalModel.twistySceneModel.background.addFreshListener(
      (backgroundTheme) => {
        this.contentWrapper.classList.toggle(
          "checkered",
          ["auto", "checkered"].includes(backgroundTheme)
        );
        this.contentWrapper.classList.toggle(
          "checkered-transparent",
          backgroundTheme === "checkered-transparent"
        );
      }
    );
    this.experimentalModel.twistySceneModel.colorScheme.addFreshListener(
      (colorScheme) => {
        this.contentWrapper.classList.toggle(
          "dark-mode",
          ["dark"].includes(colorScheme)
        );
      }
    );
    this.experimentalModel.controlPanel.addFreshListener(
      (controlPanel) => {
        __privateGet(this, _controlsManager).setValue(controlPanel);
      }
    );
    this.experimentalModel.visualizationStrategy.addFreshListener(
      __privateMethod(this, _setVisualizationWrapper, setVisualizationWrapper_fn).bind(this)
    );
    this.experimentalModel.puzzleID.addFreshListener(this.flash.bind(this));
  }
  /** @deprecated */
  experimentalSetFlashLevel(newLevel) {
    __privateSet(this, _flashLevel, newLevel);
  }
  flash() {
    if (__privateGet(this, _flashLevel) === "auto") {
      __privateGet(this, _visualizationWrapper)?.animate([{ opacity: 0.25 }, { opacity: 1 }], {
        duration: 250,
        easing: "ease-out"
      });
    }
  }
  async experimentalCurrentVantages() {
    this.connectedCallback();
    const wrapper = __privateGet(this, _visualizationWrapper);
    if (wrapper instanceof Twisty3DSceneWrapper) {
      return wrapper.experimentalVantages();
    }
    return [];
  }
  async experimentalCurrentCanvases() {
    const vantages = await this.experimentalCurrentVantages();
    const canvases = [];
    for (const vantage of vantages) {
      canvases.push((await vantage.canvasInfo()).canvas);
    }
    return canvases;
  }
  /**
   * Get the first available puzzle `Object3D`. This can be inserted into
   * another `three.js` scene, essentially "adopting" it from the
   * `TwistyPlayer`'s scenes while still allowing the `TwistyPlayer` to animate
   * it. The function returns a `Promise` that returns if and when the
   * `Object3D` is available, and accepts a callback that is called whenever a
   * render is scheduled for the puzzle (essentially, if something about the
   * puzzle has changed, like its appearance or current animated state).
   *
   * Note:
   * - This may never resolve if the player never creates the relevant 3D object
   *   under the hood (e.g. if the config is set to 2D, or is not valid for
   *   rendering a puzzle)
   * - The architecture of `cubing.js` may change significantly, so it is not
   *   guaranteed that a `three.js` `Object3D` will be available from the main
   *   thread in the future.
   * - This function only returns the current `three.js` puzzle object (once one
   *   exists). If you change e.g. the `puzzle` config for the player, then the
   *   object will currently become stale. This may be replaced with more
   *   convenient behaviour in the future.
   *
   * @deprecated */
  async experimentalCurrentThreeJSPuzzleObject(puzzleRenderScheduledCallback) {
    this.connectedCallback();
    const sceneWrapper = await __privateGet(this, _initial3DVisualizationWrapper).promise;
    const puzzleWrapper = await sceneWrapper.experimentalTwisty3DPuzzleWrapper();
    const twisty3DPuzzlePromise = puzzleWrapper.twisty3DPuzzle();
    const safeToCallback = (async () => {
      await twisty3DPuzzlePromise;
      await new Promise((resolve) => setTimeout(resolve, 0));
    })();
    if (puzzleRenderScheduledCallback) {
      const scheduler = new RenderScheduler(async () => {
      });
      puzzleWrapper.addEventListener("render-scheduled", async () => {
        if (!scheduler.requestIsPending()) {
          scheduler.requestAnimFrame();
          await safeToCallback;
          puzzleRenderScheduledCallback();
        }
      });
    }
    return twisty3DPuzzlePromise;
  }
  jumpToStart(options) {
    this.controller.jumpToStart(options);
  }
  jumpToEnd(options) {
    this.controller.jumpToEnd(options);
  }
  play() {
    this.controller.togglePlay(true);
  }
  pause() {
    this.controller.togglePlay(false);
  }
  // Inspiration:
  // - https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute (`force` argument)
  // - https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle (`force` argument)
  // We still provide `play()` and `pause()` individually for convenience, though.
  togglePlay(play) {
    this.controller.togglePlay(play);
  }
  // TODO: Animate the new move.
  // TODO: Automatically handle puzzle.
  experimentalAddMove(flexibleMove, options) {
    this.experimentalModel.experimentalAddMove(flexibleMove, options);
  }
  // TODO: Animate the new move.
  // TODO: Automatically handle puzzle.
  experimentalAddAlgLeaf(algLeaf, options) {
    this.experimentalModel.experimentalAddAlgLeaf(algLeaf, options);
  }
  static get observedAttributes() {
    const observed = [];
    for (const key of Object.keys(twistyPlayerAttributeMap)) {
      observed.push(key, DATA_ATTRIBUTE_PREFIX + key);
    }
    return observed;
  }
  experimentalRemoveFinalChild() {
    this.experimentalModel.experimentalRemoveFinalChild();
  }
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName.startsWith(DATA_ATTRIBUTE_PREFIX)) {
      attributeName = attributeName.slice(DATA_ATTRIBUTE_PREFIX.length);
    }
    const setterName = twistyPlayerAttributeMap[attributeName];
    if (!setterName) {
      return;
    }
    this[setterName] = newValue;
  }
  // TODO: Make this more ergonomic and flexible.
  // TODO: dimensions.
  async experimentalScreenshot(options) {
    return (await screenshot(this.experimentalModel, options)).dataURL;
  }
  // TODO: Make this more ergonomic and flexible.
  // TODO: dimensions.
  async experimentalDownloadScreenshot(filename) {
    if (["2D", "experimental-2D-LL", "experimental-2D-LL-face"].includes(
      await this.experimentalModel.visualizationStrategy.get()
    )) {
      const wrapper2D = __privateGet(this, _visualizationWrapper);
      const twisty2DPuzzle = await wrapper2D.currentTwisty2DPuzzleWrapper().twisty2DPuzzle();
      const str = new XMLSerializer().serializeToString(
        twisty2DPuzzle.svgWrapper.svgElement
      );
      const url = URL.createObjectURL(new Blob([str]));
      downloadURL(
        url,
        filename ?? await getDefaultFilename(this.experimentalModel),
        "svg"
      );
    } else {
      await (await screenshot(this.experimentalModel)).download(filename);
    }
  }
}, _controlsManager = new WeakMap(), _visualizationWrapperElem = new WeakMap(), _errorElem = new WeakMap(), _alreadyConnected = new WeakMap(), _flashLevel = new WeakMap(), _visualizationWrapper = new WeakMap(), _initial3DVisualizationWrapper = new WeakMap(), _visualizationStrategy = new WeakMap(), _setVisualizationWrapper = new WeakSet(), setVisualizationWrapper_fn = function(strategy) {
  if (strategy !== __privateGet(this, _visualizationStrategy)) {
    __privateGet(this, _visualizationWrapper)?.remove();
    __privateGet(this, _visualizationWrapper)?.disconnect();
    let newWrapper;
    switch (strategy) {
      case "2D":
      case "experimental-2D-LL":
      case "experimental-2D-LL-face": {
        newWrapper = new Twisty2DSceneWrapper(
          this.experimentalModel.twistySceneModel,
          strategy
        );
        break;
      }
      case "Cube3D":
      case "PG3D": {
        newWrapper = new Twisty3DSceneWrapper(this.experimentalModel);
        __privateGet(this, _initial3DVisualizationWrapper).handleNewValue(newWrapper);
        break;
      }
      default:
        throw new Error("Invalid visualization");
    }
    __privateGet(this, _visualizationWrapperElem).appendChild(newWrapper);
    __privateSet(this, _visualizationWrapper, newWrapper);
    __privateSet(this, _visualizationStrategy, strategy);
  }
}, _a13);
customElementsShim.define("twisty-player", TwistyPlayer);
var twistyAlgViewerCSS = new CSSSource(
  `
:host {
  display: inline;
}

.wrapper {
  display: inline;
}

a:not(:hover) {
  color: inherit;
  text-decoration: none;
}

twisty-alg-leaf-elem.twisty-alg-comment {
  color: rgba(0, 0, 0, 0.4);
}

.wrapper.current-move {
  background: rgba(66, 133, 244, 0.3);
  margin-left: -0.1em;
  margin-right: -0.1em;
  padding-left: 0.1em;
  padding-right: 0.1em;
  border-radius: 0.1em;
}
`
);
async function firstElementWithId(id) {
  return new Promise((resolve, reject) => {
    const currentElem = document.getElementById(id);
    if (currentElem) {
      resolve(currentElem);
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "id" && mutation.target instanceof Element && mutation.target.getAttribute("id") === id) {
          resolve(mutation.target);
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, {
      attributeFilter: ["id"],
      subtree: true
    });
  });
}
var DEFAULT_OFFSET_MS = 250;
var TwistyAlgLeafElem = class extends ManagedCustomElement {
  constructor(className, text, dataDown, algOrAlgNode, offsetIntoMove, clickable) {
    super({ mode: "open" });
    this.algOrAlgNode = algOrAlgNode;
    this.classList.add(className);
    this.addCSS(twistyAlgViewerCSS);
    if (clickable) {
      const anchor = this.contentWrapper.appendChild(
        document.createElement("a")
      );
      anchor.href = "#";
      anchor.textContent = text;
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        dataDown.twistyAlgViewer.jumpToIndex(
          dataDown.earliestMoveIndex,
          offsetIntoMove
        );
      });
    } else {
      this.contentWrapper.appendChild(
        document.createElement("span")
      ).textContent = text;
    }
  }
  pathToIndex(_index) {
    return [];
  }
  setCurrentMove(current) {
    this.contentWrapper.classList.toggle("current-move", current);
  }
};
customElementsShim.define("twisty-alg-leaf-elem", TwistyAlgLeafElem);
var TwistyAlgWrapperElem = class extends HTMLElementShim {
  constructor(className, algOrAlgNode) {
    super();
    __publicField(this, "queue", []);
    this.algOrAlgNode = algOrAlgNode;
    this.classList.add(className);
  }
  addString(str) {
    this.queue.push(document.createTextNode(str));
  }
  addElem(dataUp) {
    this.queue.push(dataUp.element);
    return dataUp.moveCount;
  }
  flushQueue(direction = 1) {
    for (const node of maybeReverseList(this.queue, direction)) {
      this.append(node);
    }
    this.queue = [];
  }
  pathToIndex(_index) {
    return [];
  }
};
customElementsShim.define("twisty-alg-wrapper-elem", TwistyAlgWrapperElem);
function oppositeDirection(direction) {
  return direction === 1 ? -1 : 1;
}
function updateDirectionByAmount(currentDirection, amount) {
  return amount < 0 ? oppositeDirection(currentDirection) : currentDirection;
}
function maybeReverseList(l, direction) {
  if (direction === 1) {
    return l;
  }
  const copy = Array.from(l);
  copy.reverse();
  return copy;
}
var AlgToDOMTree = class extends TraversalDownUp {
  traverseAlg(alg, dataDown) {
    let moveCount = 0;
    const element = new TwistyAlgWrapperElem("twisty-alg-alg", alg);
    let first = true;
    for (const algNode of direct(
      alg.childAlgNodes(),
      dataDown.direction
    )) {
      if (!first) {
        element.addString(" ");
      }
      first = false;
      if (algNode.as(Pause)?.experimentalNISSGrouping) {
        element.addString("^(");
      }
      if (!algNode.as(Grouping)?.experimentalNISSPlaceholder) {
        moveCount += element.addElem(
          this.traverseAlgNode(algNode, {
            earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
            twistyAlgViewer: dataDown.twistyAlgViewer,
            direction: dataDown.direction
          })
        );
      }
      if (algNode.as(Pause)?.experimentalNISSGrouping) {
        element.addString(")");
      }
    }
    element.flushQueue(dataDown.direction);
    return {
      moveCount,
      element
    };
  }
  traverseGrouping(grouping, dataDown) {
    const square1Tuple = grouping.experimentalAsSquare1Tuple();
    const direction = updateDirectionByAmount(
      dataDown.direction,
      grouping.amount
    );
    let moveCount = 0;
    const element = new TwistyAlgWrapperElem("twisty-alg-grouping", grouping);
    element.addString("(");
    if (square1Tuple) {
      moveCount += element.addElem({
        moveCount: 1,
        element: new TwistyAlgLeafElem(
          "twisty-alg-move",
          // TODO: Mark the tuple with a special class?
          square1Tuple[0].amount.toString(),
          dataDown,
          square1Tuple[0],
          true,
          true
        )
      });
      element.addString(", ");
      moveCount += element.addElem({
        moveCount: 1,
        element: new TwistyAlgLeafElem(
          "twisty-alg-move",
          // TODO: Mark the tuple with a special class?
          square1Tuple[1].amount.toString(),
          dataDown,
          square1Tuple[1],
          true,
          true
        )
      });
    } else {
      moveCount += element.addElem(
        this.traverseAlg(grouping.alg, {
          earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
          twistyAlgViewer: dataDown.twistyAlgViewer,
          direction
        })
      );
    }
    element.addString(`)${grouping.experimentalRepetitionSuffix}`);
    element.flushQueue();
    return {
      moveCount: moveCount * Math.abs(grouping.amount),
      element
    };
  }
  traverseMove(move, dataDown) {
    const element = new TwistyAlgLeafElem(
      "twisty-alg-move",
      move.toString(),
      dataDown,
      move,
      true,
      true
    );
    dataDown.twistyAlgViewer.highlighter.addMove(
      move.startCharIndex,
      element
    );
    return {
      moveCount: 1,
      element
    };
  }
  traverseCommutator(commutator, dataDown) {
    let moveCount = 0;
    const element = new TwistyAlgWrapperElem(
      "twisty-alg-commutator",
      commutator
    );
    element.addString("[");
    element.flushQueue();
    const [first, second] = maybeReverseList(
      [commutator.A, commutator.B],
      dataDown.direction
    );
    moveCount += element.addElem(
      this.traverseAlg(first, {
        earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
        twistyAlgViewer: dataDown.twistyAlgViewer,
        direction: dataDown.direction
      })
    );
    element.addString(", ");
    moveCount += element.addElem(
      this.traverseAlg(second, {
        earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
        twistyAlgViewer: dataDown.twistyAlgViewer,
        direction: dataDown.direction
      })
    );
    element.flushQueue(dataDown.direction);
    element.addString("]");
    element.flushQueue();
    return {
      moveCount: moveCount * 2,
      element
    };
  }
  traverseConjugate(conjugate, dataDown) {
    let moveCount = 0;
    const element = new TwistyAlgWrapperElem("twisty-alg-conjugate", conjugate);
    element.addString("[");
    const aLen = element.addElem(
      this.traverseAlg(conjugate.A, {
        earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
        twistyAlgViewer: dataDown.twistyAlgViewer,
        direction: dataDown.direction
      })
    );
    moveCount += aLen;
    element.addString(": ");
    moveCount += element.addElem(
      this.traverseAlg(conjugate.B, {
        earliestMoveIndex: dataDown.earliestMoveIndex + moveCount,
        twistyAlgViewer: dataDown.twistyAlgViewer,
        direction: dataDown.direction
      })
    );
    element.addString("]");
    element.flushQueue();
    return {
      moveCount: moveCount + aLen,
      element
    };
  }
  traversePause(pause, dataDown) {
    if (pause.experimentalNISSGrouping) {
      return this.traverseAlg(pause.experimentalNISSGrouping.alg, dataDown);
    }
    return {
      moveCount: 1,
      element: new TwistyAlgLeafElem(
        "twisty-alg-pause",
        ".",
        dataDown,
        pause,
        true,
        true
      )
    };
  }
  traverseNewline(newline, _dataDown) {
    const element = new TwistyAlgWrapperElem("twisty-alg-newline", newline);
    element.append(document.createElement("br"));
    return {
      moveCount: 0,
      element
    };
  }
  traverseLineComment(lineComment, dataDown) {
    return {
      moveCount: 0,
      element: new TwistyAlgLeafElem(
        "twisty-alg-line-comment",
        `//${lineComment.text}`,
        dataDown,
        lineComment,
        false,
        false
      )
    };
  }
};
var algToDOMTree = functionFromTraversal(AlgToDOMTree);
var MoveHighlighter = class {
  constructor() {
    __publicField(this, "moveCharIndexMap", /* @__PURE__ */ new Map());
    __publicField(this, "currentElem", null);
  }
  addMove(charIndex, elem) {
    this.moveCharIndexMap.set(charIndex, elem);
  }
  set(move) {
    const newElem = move ? this.moveCharIndexMap.get(move.startCharIndex) ?? null : null;
    if (this.currentElem === newElem) {
      return;
    }
    this.currentElem?.classList.remove("twisty-alg-current-move");
    this.currentElem?.setCurrentMove(false);
    newElem?.classList.add("twisty-alg-current-move");
    newElem?.setCurrentMove(true);
    this.currentElem = newElem;
  }
};
var _domTree, _twistyPlayer, _setTwistyPlayer, setTwistyPlayer_fn, _a14;
var TwistyAlgViewer = (_a14 = class extends HTMLElementShim {
  constructor(options) {
    super();
    __privateAdd(this, _setTwistyPlayer);
    __publicField(this, "highlighter", new MoveHighlighter());
    __privateAdd(this, _domTree, void 0);
    __privateAdd(this, _twistyPlayer, null);
    __publicField(this, "lastClickTimestamp", null);
    if (options?.twistyPlayer) {
      this.twistyPlayer = options?.twistyPlayer;
    }
  }
  connectedCallback() {
  }
  setAlg(alg) {
    __privateSet(this, _domTree, algToDOMTree(alg, {
      earliestMoveIndex: 0,
      twistyAlgViewer: this,
      direction: 1
      /* Forwards */
    }).element);
    this.textContent = "";
    this.appendChild(__privateGet(this, _domTree));
  }
  get twistyPlayer() {
    return __privateGet(this, _twistyPlayer);
  }
  set twistyPlayer(twistyPlayer) {
    __privateMethod(this, _setTwistyPlayer, setTwistyPlayer_fn).call(this, twistyPlayer);
  }
  async jumpToIndex(index, offsetIntoMove) {
    const twistyPlayer = __privateGet(this, _twistyPlayer);
    if (twistyPlayer) {
      twistyPlayer.pause();
      const timestampPromise = (async () => {
        const indexer = await twistyPlayer.experimentalModel.indexer.get();
        const offset = offsetIntoMove ? DEFAULT_OFFSET_MS : 0;
        return indexer.indexToMoveStartTimestamp(index) + indexer.moveDuration(index) - offset;
      })();
      twistyPlayer.experimentalModel.timestampRequest.set(
        await timestampPromise
        // TODO
      );
      if (this.lastClickTimestamp === await timestampPromise) {
        twistyPlayer.play();
        this.lastClickTimestamp = null;
      } else {
        this.lastClickTimestamp = await timestampPromise;
      }
    }
  }
  async attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName === "for") {
      let elem = document.getElementById(newValue);
      if (!elem) {
        console.info("for= elem does not exist, waiting for one");
      }
      await customElements.whenDefined("twisty-player");
      elem = await firstElementWithId(newValue);
      if (!(elem instanceof TwistyPlayer)) {
        console.warn("for= elem is not a twisty-player");
        return;
      }
      this.twistyPlayer = elem;
    }
  }
  static get observedAttributes() {
    return ["for"];
  }
}, _domTree = new WeakMap(), _twistyPlayer = new WeakMap(), _setTwistyPlayer = new WeakSet(), setTwistyPlayer_fn = async function(twistyPlayer) {
  if (__privateGet(this, _twistyPlayer)) {
    console.warn("twisty-player reassignment is not supported");
    return;
  }
  if (twistyPlayer === null) {
    throw new Error("clearing twistyPlayer is not supported");
  }
  __privateSet(this, _twistyPlayer, twistyPlayer);
  __privateGet(this, _twistyPlayer).experimentalModel.alg.addFreshListener(
    (algWithIssues) => {
      this.setAlg(algWithIssues.alg);
    }
  );
  const sourceAlg = (await __privateGet(this, _twistyPlayer).experimentalModel.alg.get()).alg;
  const parsedAlg = "startCharIndex" in sourceAlg ? sourceAlg : Alg.fromString(sourceAlg.toString());
  this.setAlg(parsedAlg);
  twistyPlayer.experimentalModel.currentMoveInfo.addFreshListener(
    (currentMoveInfo) => {
      let moveInfo = currentMoveInfo.currentMoves[0];
      moveInfo ?? (moveInfo = currentMoveInfo.movesStarting[0]);
      moveInfo ?? (moveInfo = currentMoveInfo.movesFinishing[0]);
      if (!moveInfo) {
        this.highlighter.set(null);
      } else {
        const mainCurrentMove = moveInfo.move;
        this.highlighter.set(mainCurrentMove);
      }
    }
  );
  twistyPlayer.experimentalModel.detailedTimelineInfo.addFreshListener(
    (detailedTimelineInfo) => {
      if (detailedTimelineInfo.timestamp !== this.lastClickTimestamp) {
        this.lastClickTimestamp = null;
      }
    }
  );
}, _a14);
customElementsShim.define("twisty-alg-viewer", TwistyAlgViewer);
var LeafTokens = class extends TraversalDownUp {
  traverseAlg(alg, dataDown) {
    const algNodeArrays = [];
    let numMovesInside = 0;
    for (const algNode of alg.childAlgNodes()) {
      const dataUp = this.traverseAlgNode(algNode, {
        numMovesSofar: dataDown.numMovesSofar + numMovesInside
      });
      algNodeArrays.push(dataUp.tokens);
      numMovesInside += dataUp.numLeavesInside;
    }
    return {
      tokens: Array.prototype.concat(...algNodeArrays),
      numLeavesInside: numMovesInside
    };
  }
  traverseGrouping(grouping, dataDown) {
    const dataUp = this.traverseAlg(grouping.alg, dataDown);
    return {
      tokens: dataUp.tokens,
      numLeavesInside: dataUp.numLeavesInside * grouping.amount
    };
  }
  traverseMove(move, dataDown) {
    return {
      tokens: [{ leaf: move, idx: dataDown.numMovesSofar }],
      numLeavesInside: 1
    };
  }
  traverseCommutator(commutator, dataDown) {
    const dataUpA = this.traverseAlg(commutator.A, dataDown);
    const dataUpB = this.traverseAlg(commutator.B, {
      numMovesSofar: dataDown.numMovesSofar + dataUpA.numLeavesInside
    });
    return {
      tokens: dataUpA.tokens.concat(dataUpB.tokens),
      numLeavesInside: dataUpA.numLeavesInside * 2 + dataUpB.numLeavesInside
    };
  }
  traverseConjugate(conjugate, dataDown) {
    const dataUpA = this.traverseAlg(conjugate.A, dataDown);
    const dataUpB = this.traverseAlg(conjugate.B, {
      numMovesSofar: dataDown.numMovesSofar + dataUpA.numLeavesInside
    });
    return {
      tokens: dataUpA.tokens.concat(dataUpB.tokens),
      numLeavesInside: dataUpA.numLeavesInside * 2 + dataUpB.numLeavesInside * 2
    };
  }
  traversePause(pause, dataDown) {
    return {
      tokens: [{ leaf: pause, idx: dataDown.numMovesSofar }],
      numLeavesInside: 1
    };
  }
  traverseNewline(_newline, _dataDown) {
    return {
      tokens: [],
      numLeavesInside: 0
    };
  }
  traverseLineComment(_comment, _dataDown) {
    return {
      tokens: [],
      numLeavesInside: 0
    };
  }
};
var leafTokens = functionFromTraversal(LeafTokens);
var TwistyAlgEditorValueProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "";
  }
};
var AlgEditorAlgWithIssuesProp = class extends TwistyPropDerived {
  derive(input) {
    return algWithIssuesFromString(input.value);
  }
  // TODO: canReuse needs to take the source string into account.
};
var TwistyAlgEditorSelectionProp = class extends TwistyPropSource {
  getDefaultValue() {
    return {
      selectionStart: 0,
      selectionEnd: 0,
      endChangedMostRecently: false
    };
  }
  async derive(input, oldValue) {
    const { selectionStart, selectionEnd } = input;
    const lastResult = await oldValue;
    const endChangedMostRecently = input.selectionStart === lastResult.selectionStart && input.selectionEnd !== (await oldValue).selectionEnd;
    return {
      selectionStart,
      selectionEnd,
      endChangedMostRecently
    };
  }
};
var TargetCharProp = class extends TwistyPropDerived {
  derive(inputs) {
    return inputs.selectionInfo.endChangedMostRecently ? inputs.selectionInfo.selectionEnd : inputs.selectionInfo.selectionStart;
  }
};
var LeafTokensProp = class extends TwistyPropDerived {
  derive(inputs) {
    return leafTokens(inputs.algWithIssues.alg, {
      numMovesSofar: 0
    }).tokens;
  }
};
var LeafToHighlightProp = class extends TwistyPropDerived {
  derive(inputs) {
    function withWhere(leafInfo) {
      if (leafInfo === null) {
        return null;
      }
      let where;
      if (inputs.targetChar < leafInfo.leaf.startCharIndex) {
        where = "before";
      } else if (inputs.targetChar === leafInfo.leaf.startCharIndex) {
        where = "start";
      } else if (inputs.targetChar < leafInfo.leaf.endCharIndex) {
        where = "inside";
      } else if (inputs.targetChar === leafInfo.leaf.endCharIndex) {
        where = "end";
      } else {
        where = "after";
      }
      return {
        leafInfo,
        where
      };
    }
    let lastLeafInfo = null;
    for (const leafInfo of inputs.leafTokens) {
      if (inputs.targetChar < leafInfo.leaf.startCharIndex && lastLeafInfo !== null) {
        return withWhere(lastLeafInfo);
      }
      if (inputs.targetChar <= leafInfo.leaf.endCharIndex) {
        return withWhere(leafInfo);
      }
      lastLeafInfo = leafInfo;
    }
    return withWhere(lastLeafInfo);
  }
};
var TwistyAlgEditorModel = class {
  constructor() {
    __publicField(this, "valueProp", new TwistyAlgEditorValueProp());
    __publicField(this, "selectionProp", new TwistyAlgEditorSelectionProp());
    __publicField(this, "targetCharProp", new TargetCharProp({ selectionInfo: this.selectionProp }));
    __publicField(this, "algEditorAlgWithIssues", new AlgEditorAlgWithIssuesProp({
      value: this.valueProp
    }));
    __publicField(this, "leafTokensProp", new LeafTokensProp({
      algWithIssues: this.algEditorAlgWithIssues
    }));
    __publicField(this, "leafToHighlight", new LeafToHighlightProp({
      leafTokens: this.leafTokensProp,
      targetChar: this.targetCharProp
    }));
  }
};
var COMMENT_DELIMITER = "//";
function maybeParse(str) {
  try {
    return Alg.fromString(str);
  } catch {
    return null;
  }
}
function sliceBeforeFirstOccurrence(str, delimiter) {
  const idx = str.indexOf(delimiter);
  if (idx === -1) {
    return [str, ""];
  }
  return [str.slice(0, idx), str.slice(idx)];
}
function replaceSmartQuotesOutsideComments(str) {
  const linesOut = [];
  for (const line of str.split("\n")) {
    let [before, after] = sliceBeforeFirstOccurrence(line, COMMENT_DELIMITER);
    before = before.replaceAll("\u2019", "'");
    linesOut.push(before + after);
  }
  return linesOut.join("\n");
}
function pasteIntoTextArea(textArea, pastedText) {
  const { value: oldValue } = textArea;
  const { selectionStart, selectionEnd } = textArea;
  const textPrecedingSelection = oldValue.slice(0, selectionStart);
  const textFollowingSelection = oldValue.slice(selectionEnd);
  pastedText = pastedText.replaceAll("\r\n", "\n");
  const selectionStartsInExistingComment = textPrecedingSelection.match(/\/\/[^\n]*$/);
  const pasteCreatesStartingComment = oldValue[selectionStart - 1] === "/" && pastedText[0] === "/";
  const pasteStartsWithCommentText = selectionStartsInExistingComment || pasteCreatesStartingComment;
  const pasteEndsWithComment = pastedText.match(/\/\/[^\n]*$/);
  let replacement = pastedText;
  if (pasteStartsWithCommentText) {
    const [before, after] = sliceBeforeFirstOccurrence(pastedText, "\n");
    replacement = before + replaceSmartQuotesOutsideComments(after);
  } else {
    replacement = replaceSmartQuotesOutsideComments(pastedText);
  }
  const tryAddSpaceBefore = !pasteStartsWithCommentText && selectionStart !== 0 && // Not at text start
  !["\n", " "].includes(replacement[0]) && !["\n", " "].includes(oldValue[selectionStart - 1]);
  const tryAddSpaceAfter = !pasteEndsWithComment && selectionEnd !== oldValue.length && // Not at text end
  !["\n", " "].includes(replacement.at(-1)) && !["\n", " "].includes(oldValue[selectionEnd]);
  function adoptSpacingIfValid(prefix, suffix) {
    const candidate = prefix + replacement + suffix;
    const valid = !!maybeParse(
      textPrecedingSelection + candidate + textFollowingSelection
    );
    if (valid) {
      replacement = candidate;
    }
    return valid;
  }
  tryAddSpaceBefore && tryAddSpaceAfter && adoptSpacingIfValid(" ", " ") || // Paste "R U R' U'" over " " in "F F'" to create "F R U R' U' F'"
  tryAddSpaceBefore && adoptSpacingIfValid(" ", "") || // Paste "U" after "R'" in "R' L'" to create "R' U L'"
  tryAddSpaceAfter && adoptSpacingIfValid("", " ");
  const execCommandSuccess = globalSafeDocument?.execCommand(
    "insertText",
    false,
    replacement
  );
  if (!execCommandSuccess) {
    textArea.setRangeText(replacement, selectionStart, selectionEnd, "end");
  }
}
var twistyAlgEditorCSS = new CSSSource(
  `
:host {
  width: 384px;
  display: grid;
}

.wrapper {
  /*overflow: hidden;
  resize: horizontal;*/

  background: var(--background, none);
  display: grid;
}

textarea, .carbon-copy {
  grid-area: 1 / 1 / 2 / 2;

  width: 100%;
  font-family: sans-serif;
  line-height: 1.2em;

  font-size: var(--font-size, inherit);
  font-family: var(--font-family, sans-serif);

  box-sizing: border-box;

  padding: var(--padding, 0.5em);
  /* Prevent horizontal growth. */
  overflow-x: hidden;
}

textarea {
  resize: none;
  background: none;
  z-index: 2;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.25));
}

.carbon-copy {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
  user-select: none;
  pointer-events: none;

  z-index: 1;
}

.carbon-copy .highlight {
  background: var(--highlight-color, rgba(255, 128, 0, 0.5));
  padding: 0.1em 0.2em;
  margin: -0.1em -0.2em;
  border-radius: 0.2em;
}

.wrapper.issue-warning textarea,
.wrapper.valid-for-puzzle-warning textarea {
  outline: none;
  border: 1px solid rgba(200, 200, 0, 0.5);
  background: rgba(255, 255, 0, 0.1);
}

.wrapper.issue-error textarea,
.wrapper.valid-for-puzzle-error textarea {
  outline: none;
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
`
);
var ATTRIBUTE_FOR_TWISTY_PLAYER = "for-twisty-player";
var ATTRIBUTE_PLACEHOLDER = "placeholder";
var ATTRIBUTE_TWISTY_PLAYER_PROP = "twisty-player-prop";
var _textarea, _carbonCopy, _carbonCopyPrefix, _carbonCopyHighlight, _carbonCopySuffix, _textareaClassListValidForPuzzleManager, _twistyPlayer2, _twistyPlayerProp, _algProp, algProp_get, _onInputHasFired, _padSuffix, padSuffix_fn, _highlightedLeaf, _a15;
var TwistyAlgEditor = (_a15 = class extends ManagedCustomElement {
  constructor(options) {
    super();
    __privateAdd(this, _algProp);
    // `white-space: pre;` mostly matches the formatting of the `<textarea>`, *except* when we end with a newline.
    // So we add an space to ensure that there is a character on the final line (that is very unlikely to trigger extra line wrapping).
    __privateAdd(this, _padSuffix);
    __publicField(this, "model", new TwistyAlgEditorModel());
    // #alg: Alg = new Alg();
    __privateAdd(this, _textarea, document.createElement("textarea"));
    __privateAdd(this, _carbonCopy, document.createElement("div"));
    __privateAdd(this, _carbonCopyPrefix, document.createElement("span"));
    __privateAdd(this, _carbonCopyHighlight, document.createElement("span"));
    __privateAdd(this, _carbonCopySuffix, document.createElement("span"));
    // #textareaClassListManager: ClassListManager<"none" | "warning" | "error"> =
    //   new ClassListManager(this, "issue-", ["none", "warning", "error"]);
    __privateAdd(this, _textareaClassListValidForPuzzleManager, new ClassListManager(this, "valid-for-puzzle-", [
      "none",
      "warning",
      "error"
    ]));
    __privateAdd(this, _twistyPlayer2, null);
    __privateAdd(this, _twistyPlayerProp, void 0);
    // Temporary Workaround for Twizzle Explorer
    __publicField(this, "debugNeverRequestTimestamp", false);
    __privateAdd(this, _onInputHasFired, false);
    __privateAdd(this, _highlightedLeaf, null);
    __privateGet(this, _carbonCopy).classList.add("carbon-copy");
    this.addElement(__privateGet(this, _carbonCopy));
    __privateGet(this, _textarea).rows = 1;
    this.addElement(__privateGet(this, _textarea));
    __privateGet(this, _carbonCopyPrefix).classList.add("prefix");
    __privateGet(this, _carbonCopy).appendChild(__privateGet(this, _carbonCopyPrefix));
    __privateGet(this, _carbonCopyHighlight).classList.add("highlight");
    __privateGet(this, _carbonCopy).appendChild(__privateGet(this, _carbonCopyHighlight));
    __privateGet(this, _carbonCopySuffix).classList.add("suffix");
    __privateGet(this, _carbonCopy).appendChild(__privateGet(this, _carbonCopySuffix));
    __privateGet(this, _textarea).placeholder = "Alg";
    __privateGet(this, _textarea).setAttribute("spellcheck", "false");
    this.addCSS(twistyAlgEditorCSS);
    __privateGet(this, _textarea).addEventListener("input", () => {
      __privateSet(this, _onInputHasFired, true);
      this.onInput();
    });
    __privateGet(this, _textarea).addEventListener("blur", () => this.onBlur());
    document.addEventListener(
      "selectionchange",
      () => this.onSelectionChange()
    );
    if (options?.twistyPlayer) {
      this.twistyPlayer = options.twistyPlayer;
    }
    __privateSet(this, _twistyPlayerProp, options?.twistyPlayerProp ?? "alg");
    if (options?.twistyPlayerProp === "alg") {
      this.model.leafToHighlight.addFreshListener(
        (highlightInfo) => {
          if (highlightInfo) {
            this.highlightLeaf(highlightInfo.leafInfo.leaf);
          }
        }
      );
    }
  }
  connectedCallback() {
    __privateGet(this, _textarea).addEventListener("paste", (e) => {
      const text = e.clipboardData?.getData("text");
      if (text) {
        pasteIntoTextArea(__privateGet(this, _textarea), text);
        e.preventDefault();
        this.onInput();
      }
    });
  }
  // TODO
  set algString(s) {
    __privateGet(this, _textarea).value = s;
    this.onInput();
  }
  // TODO: remove?
  get algString() {
    return __privateGet(this, _textarea).value;
  }
  // To we need a getter?
  set placeholder(placeholderText) {
    __privateGet(this, _textarea).placeholder = placeholderText;
  }
  onInput() {
    __privateGet(this, _carbonCopyHighlight).hidden = true;
    this.highlightLeaf(null);
    const endTrimmed = __privateGet(this, _textarea).value.trimEnd();
    this.model.valueProp.set(endTrimmed);
    __privateGet(this, _algProp, algProp_get)?.set(endTrimmed);
  }
  async onSelectionChange() {
    if (document.activeElement !== this || this.shadow.activeElement !== __privateGet(this, _textarea)) {
      return;
    }
    if (__privateGet(this, _twistyPlayerProp) !== "alg") {
      return;
    }
    const { selectionStart, selectionEnd } = __privateGet(this, _textarea);
    this.model.selectionProp.set({
      selectionStart,
      selectionEnd
    });
  }
  async onBlur() {
  }
  setAlgIssueClassForPuzzle(issues) {
    __privateGet(this, _textareaClassListValidForPuzzleManager).setValue(issues);
  }
  // TODO: support a primary highlighted move and secondary ones.
  highlightLeaf(leaf) {
    if (__privateGet(this, _twistyPlayerProp) !== "alg") {
      return;
    }
    if (leaf === null) {
      __privateGet(this, _carbonCopyPrefix).textContent = "";
      __privateGet(this, _carbonCopyHighlight).textContent = "";
      __privateGet(this, _carbonCopySuffix).textContent = __privateMethod(this, _padSuffix, padSuffix_fn).call(this, __privateGet(this, _textarea).value);
      return;
    }
    if (leaf === __privateGet(this, _highlightedLeaf)) {
      return;
    }
    __privateSet(this, _highlightedLeaf, leaf);
    __privateGet(this, _carbonCopyPrefix).textContent = __privateGet(this, _textarea).value.slice(
      0,
      leaf.startCharIndex
    );
    __privateGet(this, _carbonCopyHighlight).textContent = __privateGet(this, _textarea).value.slice(
      leaf.startCharIndex,
      leaf.endCharIndex
    );
    __privateGet(this, _carbonCopySuffix).textContent = __privateMethod(this, _padSuffix, padSuffix_fn).call(this, __privateGet(this, _textarea).value.slice(leaf.endCharIndex));
    __privateGet(this, _carbonCopyHighlight).hidden = false;
  }
  get twistyPlayer() {
    return __privateGet(this, _twistyPlayer2);
  }
  // TODO: spread out this impl over private methods instead of self-listeners.
  set twistyPlayer(twistyPlayer) {
    if (__privateGet(this, _twistyPlayer2)) {
      console.warn("twisty-player reassignment/clearing is not supported");
      return;
    }
    __privateSet(this, _twistyPlayer2, twistyPlayer);
    if (!twistyPlayer) {
      return;
    }
    (async () => {
      this.algString = __privateGet(this, _algProp, algProp_get) ? (await __privateGet(this, _algProp, algProp_get).get()).alg.toString() : "";
    })();
    if (__privateGet(this, _twistyPlayerProp) === "alg") {
      __privateGet(this, _twistyPlayer2)?.experimentalModel.puzzleAlg.addFreshListener(
        (algWithIssues) => {
          if (algWithIssues.issues.errors.length === 0) {
            this.setAlgIssueClassForPuzzle(
              // TODO: Allow trailing spaces.
              algWithIssues.issues.warnings.length === 0 ? "none" : "warning"
            );
            const newAlg = algWithIssues.alg;
            const oldAlg = Alg.fromString(this.algString);
            if (!newAlg.isIdentical(oldAlg)) {
              this.algString = newAlg.toString();
              this.onInput();
            } else {
            }
          } else {
            this.setAlgIssueClassForPuzzle("error");
          }
        }
      );
      this.model.leafToHighlight.addFreshListener(
        async (highlightInfo) => {
          if (highlightInfo === null) {
            return;
          }
          const [indexer, timestampRequest] = await Promise.all([
            await twistyPlayer.experimentalModel.indexer.get(),
            await twistyPlayer.experimentalModel.timestampRequest.get()
          ]);
          if (timestampRequest === "auto" && !__privateGet(this, _onInputHasFired)) {
            return;
          }
          const moveStartTimestamp = indexer.indexToMoveStartTimestamp(
            highlightInfo.leafInfo.idx
          );
          const duration = indexer.moveDuration(highlightInfo.leafInfo.idx);
          let newTimestamp;
          switch (highlightInfo.where) {
            case "before": {
              newTimestamp = moveStartTimestamp;
              break;
            }
            case "start":
            case "inside": {
              newTimestamp = moveStartTimestamp + duration / 4;
              break;
            }
            case "end":
            case "after": {
              newTimestamp = moveStartTimestamp + duration;
              break;
            }
            default:
              console.log("invalid where");
              throw new Error("Invalid where!");
          }
          if (!this.debugNeverRequestTimestamp) {
            twistyPlayer.experimentalModel.timestampRequest.set(newTimestamp);
          }
        }
      );
      twistyPlayer.experimentalModel.currentLeavesSimplified.addFreshListener(
        async (currentLeavesSimplified) => {
          const indexer = await twistyPlayer.experimentalModel.indexer.get();
          const leaf = indexer.getAnimLeaf(
            currentLeavesSimplified.patternIndex
          );
          this.highlightLeaf(leaf);
        }
      );
    }
  }
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    switch (attributeName) {
      case ATTRIBUTE_FOR_TWISTY_PLAYER: {
        const elem = document.getElementById(newValue);
        if (!elem) {
          console.warn(`${ATTRIBUTE_FOR_TWISTY_PLAYER}= elem does not exist`);
          return;
        }
        if (!(elem instanceof TwistyPlayer)) {
          console.warn(`${ATTRIBUTE_FOR_TWISTY_PLAYER}=is not a twisty-player`);
          return;
        }
        this.twistyPlayer = elem;
        return;
      }
      case ATTRIBUTE_PLACEHOLDER: {
        this.placeholder = newValue;
        return;
      }
      case ATTRIBUTE_TWISTY_PLAYER_PROP: {
        if (__privateGet(this, _twistyPlayer2)) {
          console.log("cannot set prop");
          throw new Error("cannot set prop after twisty player");
        }
        __privateSet(this, _twistyPlayerProp, newValue);
        return;
      }
    }
  }
  static get observedAttributes() {
    return [
      ATTRIBUTE_FOR_TWISTY_PLAYER,
      ATTRIBUTE_PLACEHOLDER,
      ATTRIBUTE_TWISTY_PLAYER_PROP
    ];
  }
}, _textarea = new WeakMap(), _carbonCopy = new WeakMap(), _carbonCopyPrefix = new WeakMap(), _carbonCopyHighlight = new WeakMap(), _carbonCopySuffix = new WeakMap(), _textareaClassListValidForPuzzleManager = new WeakMap(), _twistyPlayer2 = new WeakMap(), _twistyPlayerProp = new WeakMap(), _algProp = new WeakSet(), algProp_get = function() {
  if (__privateGet(this, _twistyPlayer2) === null) {
    return null;
  } else {
    return __privateGet(this, _twistyPlayer2).experimentalModel[__privateGet(this, _twistyPlayerProp)];
  }
}, _onInputHasFired = new WeakMap(), _padSuffix = new WeakSet(), padSuffix_fn = function(s) {
  return s.endsWith("\n") ? `${s} ` : s;
}, _highlightedLeaf = new WeakMap(), _a15);
customElementsShim.define("twisty-alg-editor", TwistyAlgEditor);
var twizzleLinkCSS = new CSSSource(
  `
.wrapper {
  background: rgb(255, 245, 235);
  border: 1px solid rgba(0, 0, 0, 0.25);

  /* Workaround from https://stackoverflow.com/questions/40010597/how-do-i-apply-opacity-to-a-css-color-variable */
  --text-color: 0, 0, 0;
  --heading-background: 255, 230, 210;

  color: rgb(var(--text-color));
}

.setup-alg, twisty-alg-viewer {
  padding: 0.5em 1em;
}

.heading {
  background: rgba(var(--heading-background), 1);
  color: rgba(var(--text-color), 1);
  font-weight: bold;
  padding: 0.25em 0.5em;
  display: grid;
  grid-template-columns: auto 1fr;

  /* For the move count hover elems. */
  position: sticky;
}

.heading.title {
  background: rgb(255, 245, 235);
  font-size: 150%;
  white-space: pre-wrap;
}

.heading .move-count {
  font-weight: initial;
  text-align: right;
  color: rgba(var(--text-color), 0.4);
}

.wrapper.dark-mode .heading .move-count {
  color: rgba(var(--text-color), 0.7);
}

.heading a {
  text-decoration: none;
  color: inherit;
}

twisty-player {
  width: 100%;
  min-height: 128px;
  height: 288px;
  resize: vertical;
  overflow-y: hidden;
}

twisty-player + .heading {
  padding-top: 0.5em;
}

twisty-alg-viewer {
  display: inline-block;
}

.wrapper {
  container-type: inline-size;
}

.scrollable-region {
  border-top: 1px solid rgba(0, 0, 0, 0.25);
}

.scrollable-region {
  max-height: 18em;
  overflow-y: auto;
}

@container (min-width: 512px) {
  .responsive-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  twisty-player {
    height: 320px
  }
  .scrollable-region {
    border-top: none;
    border-left: 1px solid rgba(0, 0, 0, 0.25);
    contain: strict;
    max-height: 100cqh;
  }
}

.wrapper:fullscreen,
.wrapper:fullscreen .responsive-wrapper {
  width: 100%;
  height: 100%;
}

.wrapper:fullscreen twisty-player,
.wrapper:fullscreen .scrollable-region {
  height: 50%;
}

@container (min-width: 512px) {
  .wrapper:fullscreen twisty-player,
  .wrapper:fullscreen .scrollable-region {
    height: 100%;
  }
}

/* TODO: dedup with Twizzle Editor */
.move-count > span:hover:before {
  background-color: rgba(var(--heading-background), 1);
  color: rgba(var(--text-color), 1);
  backdrop-filter: blur(4px);
  z-index: 100;
  position: absolute;
  padding: 0.5em;
  top: 1.5em;
  right: 0;
  content: attr(data-before);
  white-space: pre-wrap;
  text-align: left;
}

.move-count > span:hover {
  color: rgba(var(--text-color), 1);
  cursor: help;
}
`
);
var twizzleLinkForumTweaksCSS = new CSSSource(`
.wrapper {
  background: white;
  --heading-background: 232, 239, 253
}

.wrapper.dark-mode {
  --text-color: 236, 236, 236;
  --heading-background: 29, 29, 29;
}

.scrollable-region {
  overflow-y: auto;
}

.wrapper.dark-mode {
  background: #262626;
  --text-color: 142, 142, 142;
  border-color: #FFFFFF44;
  color-scheme: dark;
}

.wrapper.dark-mode .heading:not(.title) {
  background: #1d1d1d;
}

.heading.title {
  background: none;
}
`);
function getConfigFromURL(prefix = "", url = location.href) {
  const paramMapping = {
    alg: "alg",
    "setup-alg": "experimental-setup-alg",
    "setup-anchor": "experimental-setup-anchor",
    puzzle: "puzzle",
    stickering: "experimental-stickering",
    "puzzle-description": "experimental-puzzle-description",
    title: "experimental-title",
    "video-url": "experimental-video-url",
    competition: "experimental-competition-id"
  };
  const params = new URL(url).searchParams;
  const config = {};
  for (const [ourParam, twistyPlayerParam] of Object.entries(paramMapping)) {
    const paramValue = params.get(prefix + ourParam);
    if (paramValue !== null) {
      const configKey = twistyPlayerAttributeMap[twistyPlayerParam];
      config[configKey] = paramValue;
    }
  }
  return config;
}
var OUTER_BLOCK_MOVES_EXPLANATION = "outer block moves (e.g. R, Rw, or 4r)";
var INNER_BLOCK_MOVES_EXPLANATION = "inner block moves (e.g. M or 2-5r)";
var METRIC_EXPLANATIONS = {
  [
    "OBTM"
    /* OuterBlockTurnMetric */
  ]: `HTM = OBTM ("Outer Block Turn Metric"):
\u2022 ${INNER_BLOCK_MOVES_EXPLANATION} count as 2 turns
\u2022 ${OUTER_BLOCK_MOVES_EXPLANATION} count as 1 turn
\u2022 rotations (e.g. x) count as 0 turns`,
  [
    "OBQTM"
    /* OuterBlockQuantumTurnMetric */
  ]: `QTM = OBQTM ("Outer Block Quantum Turn Metric"):
\u2022 ${INNER_BLOCK_MOVES_EXPLANATION} count as 2 turns per quantum (e.g. M2 counts as 4)
\u2022 ${OUTER_BLOCK_MOVES_EXPLANATION} count as 1 turn per quantum (e.g. R2 counts as 2)
\u2022 rotations (e.g. x) count as 0 turns`,
  [
    "RBTM"
    /* RangeBlockTurnMetric */
  ]: `STM = RBTM ("Range Block Turn Metric"):
\u2022 ${INNER_BLOCK_MOVES_EXPLANATION} count as 1 turn
\u2022 ${OUTER_BLOCK_MOVES_EXPLANATION} count as 1 turn
\u2022 rotations (e.g. x) count as 0 turns`,
  [
    "RBQTM"
    /* RangeBlockQuantumTurnMetric */
  ]: `SQTM = RBQTM ("Range Block Quantum Turn Metric"):
\u2022 ${INNER_BLOCK_MOVES_EXPLANATION} count as 1 turn per quantum (e.g. M2 counts as 2)
\u2022 ${OUTER_BLOCK_MOVES_EXPLANATION} count as 1 turn per quantum (e.g. R2 counts as 2)
\u2022 rotations (e.g. x) count as 0 turns`,
  [
    "ETM"
    /* ExecutionTurnMetric */
  ]: `ETM ("Execution Turn Metric"):
\u2022 all moves (including rotations) count as 1 turn`
};
var CONSISTENT_METRIC_ABBREVIATIONS = {
  [
    "OBTM"
    /* OuterBlockTurnMetric */
  ]: "OB",
  [
    "OBQTM"
    /* OuterBlockQuantumTurnMetric */
  ]: "OBQ",
  [
    "RBTM"
    /* RangeBlockTurnMetric */
  ]: "RB",
  [
    "RBQTM"
    /* RangeBlockQuantumTurnMetric */
  ]: "RBQ",
  [
    "ETM"
    /* ExecutionTurnMetric */
  ]: "E"
};
var _fallback, fallback_fn, _cssElem, _cssCDNForumTweaksElem, _scrollableRegion, _responsiveWrapper, _moveCountElem, _addHeading, addHeading_fn, _a16;
var TwizzleLink = (_a16 = class extends ManagedCustomElement {
  constructor(options) {
    super({ mode: "open" });
    __privateAdd(this, _fallback);
    __privateAdd(this, _addHeading);
    __publicField(this, "twistyPlayer", null);
    __publicField(this, "a", null);
    __privateAdd(this, _cssElem, void 0);
    __privateAdd(this, _cssCDNForumTweaksElem, void 0);
    __privateAdd(this, _scrollableRegion, void 0);
    __privateAdd(this, _responsiveWrapper, void 0);
    __privateAdd(this, _moveCountElem, void 0);
    this.options = options;
  }
  async connectedCallback() {
    __privateSet(this, _responsiveWrapper, this.addElement(document.createElement("div")));
    __privateGet(this, _responsiveWrapper).classList.add("responsive-wrapper");
    if (this.options?.colorScheme === "dark") {
      this.contentWrapper.classList.add("dark-mode");
    }
    __privateSet(this, _cssElem, this.addCSS(twizzleLinkCSS));
    if (this.options?.cdnForumTweaks) {
      this.addCSS(twizzleLinkForumTweaksCSS);
    }
    this.a = this.querySelector("a");
    if (!this.a) {
      return;
    }
    const config = getConfigFromURL("", this.a.href);
    const href = this.a?.href;
    const { hostname, pathname } = new URL(href);
    if (hostname !== "alpha.twizzle.net") {
      __privateMethod(this, _fallback, fallback_fn).call(this);
      return;
    }
    if (["/edit/", "/explore/"].includes(pathname)) {
      const isExplorer = pathname === "/explore/";
      if (config.puzzle && !(config.puzzle in puzzles)) {
        const puzzleDescription = (await import("./chunks/puzzle-geometry-3DZHDFOQ.js")).getPuzzleDescriptionString(config.puzzle);
        delete config.puzzle;
        config.experimentalPuzzleDescription = puzzleDescription;
      }
      this.twistyPlayer = __privateGet(this, _responsiveWrapper).appendChild(
        new TwistyPlayer({
          background: this.options?.cdnForumTweaks ? "checkered-transparent" : "checkered",
          colorScheme: this.options?.colorScheme === "dark" ? "dark" : "light",
          ...config,
          viewerLink: isExplorer ? "experimental-twizzle-explorer" : "auto"
        })
      );
      this.twistyPlayer.fullscreenElement = this.contentWrapper;
      if (config.experimentalTitle) {
        this.twistyPlayer.experimentalTitle = config.experimentalTitle;
      }
      __privateSet(this, _scrollableRegion, __privateGet(this, _responsiveWrapper).appendChild(
        document.createElement("div")
      ));
      __privateGet(this, _scrollableRegion).classList.add("scrollable-region");
      if (config.experimentalTitle) {
        __privateMethod(this, _addHeading, addHeading_fn).call(this, config.experimentalTitle).classList.add("title");
      }
      if (config.experimentalSetupAlg) {
        __privateMethod(this, _addHeading, addHeading_fn).call(this, "Setup", async () => (await this.twistyPlayer?.experimentalModel.setupAlg.get())?.alg.toString() ?? null);
        const setupAlgDiv = __privateGet(this, _scrollableRegion).appendChild(
          document.createElement("div")
        );
        setupAlgDiv.classList.add("setup-alg");
        setupAlgDiv.textContent = new Alg(
          config.experimentalSetupAlg
        ).toString();
      }
      const movesHeading = __privateMethod(this, _addHeading, addHeading_fn).call(this, "Moves", async () => (await this.twistyPlayer?.experimentalModel.alg.get())?.alg.toString() ?? null);
      __privateSet(this, _moveCountElem, movesHeading.appendChild(
        constructMoveCountDisplay(this.twistyPlayer.experimentalModel)
      ));
      __privateGet(this, _moveCountElem).classList.add("move-count");
      const twistyAlgViewer = __privateGet(this, _scrollableRegion).appendChild(
        new TwistyAlgViewer({ twistyPlayer: this.twistyPlayer })
      );
      twistyAlgViewer.part.add("twisty-alg-viewer");
    } else {
      __privateMethod(this, _fallback, fallback_fn).call(this);
    }
  }
}, _fallback = new WeakSet(), fallback_fn = function() {
  this.contentWrapper.textContent = "";
  if (this.a) {
    const span = this.contentWrapper.appendChild(
      document.createElement("span")
    );
    span.textContent = "\u2757\uFE0F";
    span.title = "Could not show a player for link";
    this.addElement(this.a);
  }
  __privateGet(this, _cssElem)?.remove();
  __privateGet(this, _cssCDNForumTweaksElem)?.remove();
}, _cssElem = new WeakMap(), _cssCDNForumTweaksElem = new WeakMap(), _scrollableRegion = new WeakMap(), _responsiveWrapper = new WeakMap(), _moveCountElem = new WeakMap(), _addHeading = new WeakSet(), addHeading_fn = function(text, getTextToCopy) {
  const headingDiv = __privateGet(this, _scrollableRegion).appendChild(
    document.createElement("div")
  );
  headingDiv.classList.add("heading");
  const wrapperSpan = headingDiv.appendChild(document.createElement("span"));
  wrapperSpan.textContent = text;
  if (getTextToCopy) {
    wrapperSpan.textContent += " ";
    const a = wrapperSpan.appendChild(document.createElement("a"));
    a.textContent = "\u{1F4CB}";
    a.href = "#";
    a.title = "Copy to clipboard";
    async function setAndClear(text2) {
      a.textContent = text2;
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      if (a.textContent === text2) {
        a.textContent = "\u{1F4CB}";
      }
    }
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      a.textContent = "\u{1F4CB}\u2026";
      const textToCopy = await getTextToCopy();
      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          setAndClear("\u{1F4CB}\u2705");
        } catch (e2) {
          setAndClear("\u{1F4CB}\u274C");
          throw e2;
        }
      } else {
        setAndClear("\u{1F4CB}\u274C");
      }
    });
  }
  return headingDiv;
}, _a16);
customElementsShim.define("twizzle-link", TwizzleLink);
function constructMoveCountDisplay(model, elem = document.createElement("span")) {
  async function update() {
    const [algWithIssues, puzzleLoader] = await Promise.all([
      model.puzzleAlg.get(),
      model.puzzleLoader.get()
    ]);
    if (algWithIssues.issues.errors.length !== 0) {
      elem.textContent = "";
      return;
    }
    let isFirstMetric = true;
    function addMetric(metric) {
      if (isFirstMetric) {
        isFirstMetric = false;
      } else {
        elem.append(")(");
      }
      const span = elem.appendChild(document.createElement("span"));
      const moveCount = countMetricMoves(
        puzzleLoader,
        metric,
        algWithIssues.alg
      );
      span.append(`${CONSISTENT_METRIC_ABBREVIATIONS[metric]}: `);
      const moveNumber = span.appendChild(document.createElement("span"));
      moveNumber.textContent = moveCount.toString();
      moveNumber.classList.add("move-number");
      span.setAttribute("data-before", METRIC_EXPLANATIONS[metric] ?? "");
      span.setAttribute("title", METRIC_EXPLANATIONS[metric] ?? "");
    }
    elem.textContent = "(";
    if (puzzleLoader.id === "3x3x3") {
      addMetric(
        "OBTM"
        /* OuterBlockTurnMetric */
      );
      addMetric(
        "OBQTM"
        /* OuterBlockQuantumTurnMetric */
      );
      addMetric(
        "RBTM"
        /* RangeBlockTurnMetric */
      );
    } else if (puzzleLoader.pg) {
      addMetric(
        "RBTM"
        /* RangeBlockTurnMetric */
      );
      addMetric(
        "RBQTM"
        /* RangeBlockQuantumTurnMetric */
      );
    }
    addMetric(
      "ETM"
      /* ExecutionTurnMetric */
    );
    elem.append(")");
  }
  model.puzzleAlg.addFreshListener(update);
  model.puzzleID.addFreshListener(update);
  return elem;
}

// src/main.ts
var App = class {
  constructor() {
    // Example of getting an element from the page.
    __publicField(this, "twistyPlayer", document.querySelector("#main-player"));
    // Example of creating a new element and adding it to the page.
    __publicField(this, "twistyAlgViewer", document.body.prepend(
      new TwistyAlgViewer({ twistyPlayer: this.twistyPlayer })
    ));
    this.updateScramble();
  }
  async updateScramble() {
    this.twistyPlayer.alg = await randomScrambleForEvent("333");
    this.twistyPlayer.play();
  }
};
globalThis.app = new App();
//# sourceMappingURL=main.js.map
