import {
  expose,
  node_adapter_default
} from "./chunk-N4ZS44MS.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-NEAVVKH5.js
var useNodeWorkarounds = typeof globalThis.Worker === "undefined" && typeof globalThis.WorkerNavigator === "undefined";
var worker_threads_mangled = "node:w-orker-_threa-ds";
var worker_threads_unmangled = () => worker_threads_mangled.replace(/-/g, "");
async function nodeEndpointPort() {
  const { parentPort } = await import(
    /* @vite-ignore */
    worker_threads_unmangled()
  ).catch();
  return node_adapter_default(parentPort);
}
function expose2(api) {
  if (useNodeWorkarounds) {
    (async () => {
      expose(api, await nodeEndpointPort());
    })();
  } else {
    expose(api);
  }
}

export {
  nodeEndpointPort,
  expose2 as expose
};
//# sourceMappingURL=chunk-ZYUBUQN6.js.map
