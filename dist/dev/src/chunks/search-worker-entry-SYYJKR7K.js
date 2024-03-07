import {
  nodeEndpointPort
} from "./chunk-ZYUBUQN6.js";
import {
  exposeAPI
} from "./chunk-M2B7MMQB.js";
import "./chunk-N4ZS44MS.js";
import "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/search-worker-entry.js
if (exposeAPI.expose) {
  (async () => {
    await import("./inside-HD7LWJVS-TBMFVR2P.js");
    const messagePort = globalThis.postMessage ? globalThis : await nodeEndpointPort();
    messagePort.postMessage("comlink-exposed");
  })();
}
var WORKER_ENTRY_FILE_URL = import.meta.url;
export {
  WORKER_ENTRY_FILE_URL
};
//# sourceMappingURL=search-worker-entry-SYYJKR7K.js.map
