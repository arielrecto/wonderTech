/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/alpinejs/dist/module.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/alpinejs/dist/module.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }
  queue.length = 0;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, {scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  }});
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, {subtree: true, childList: true, attributes: true, attributeOldValue: true});
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var recordQueue = [];
var willProcessRecordQueue = false;
function flushObserver() {
  recordQueue = recordQueue.concat(observer.takeRecords());
  if (recordQueue.length && !willProcessRecordQueue) {
    willProcessRecordQueue = true;
    queueMicrotask(() => {
      processRecordQueue();
      willProcessRecordQueue = false;
    });
  }
}
function processRecordQueue() {
  onMutate(recordQueue);
  recordQueue.length = 0;
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = [];
  let addedAttributes = new Map();
  let removedAttributes = new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
      mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({name, value: el.getAttribute(name)});
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.includes(node))
      continue;
    onElRemoveds.forEach((i) => i(node));
    if (node._x_cleanups) {
      while (node._x_cleanups.length)
        node._x_cleanups.pop()();
    }
  }
  addedNodes.forEach((node) => {
    node._x_ignoreSelf = true;
    node._x_ignore = true;
  });
  for (let node of addedNodes) {
    if (removedNodes.includes(node))
      continue;
    if (!node.isConnected)
      continue;
    delete node._x_ignoreSelf;
    delete node._x_ignore;
    onElAddeds.forEach((i) => i(node));
    node._x_ignore = true;
    node._x_ignoreSelf = true;
  }
  addedNodes.forEach((node) => {
    delete node._x_ignoreSelf;
    delete node._x_ignore;
  });
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function refreshScope(element, scope2) {
  let existingScope = element._x_dataStack[0];
  Object.entries(scope2).forEach(([key, value]) => {
    existingScope[key] = value;
  });
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  let thisProxy = new Proxy({}, {
    ownKeys: () => {
      return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
    },
    has: (target, name) => {
      return objects.some((obj) => obj.hasOwnProperty(name));
    },
    get: (target, name) => {
      return (objects.find((obj) => {
        if (obj.hasOwnProperty(name)) {
          let descriptor = Object.getOwnPropertyDescriptor(obj, name);
          if (descriptor.get && descriptor.get._x_alreadyBound || descriptor.set && descriptor.set._x_alreadyBound) {
            return true;
          }
          if ((descriptor.get || descriptor.set) && descriptor.enumerable) {
            let getter = descriptor.get;
            let setter = descriptor.set;
            let property = descriptor;
            getter = getter && getter.bind(thisProxy);
            setter = setter && setter.bind(thisProxy);
            if (getter)
              getter._x_alreadyBound = true;
            if (setter)
              setter._x_alreadyBound = true;
            Object.defineProperty(obj, name, {
              ...property,
              get: getter,
              set: setter
            });
          }
          return true;
        }
        return false;
      }) || {})[name];
    },
    set: (target, name, value) => {
      let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
      if (closestObjectWithKey) {
        closestObjectWithKey[name] = value;
      } else {
        objects[objects.length - 1][name] = value;
      }
      return true;
    }
  });
  return thisProxy;
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, {value, enumerable}]) => {
      if (enumerable === false || value === void 0)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        let [utilities, cleanup2] = getElementBoundUtilities(el);
        utilities = {interceptor, ...utilities};
        onElRemoved(el, cleanup2);
        return callback(el, utilities);
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  Object.assign(error2, {el, expression});
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  callback();
  shouldAutoEvaluateFunctions = cache;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  if (typeof expression === "function") {
    return generateEvaluatorFromFunction(dataStack, expression);
  }
  let evaluator = generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, {scope: scope2 = {}, params = []} = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)\s/.test(expression) ? `(() => { ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      return new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, {scope: scope2 = {}, params = []} = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else {
    receiver(value);
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
}
function directives(el, attributes, originalAttributeOverride) {
  let transformedAttributeMap = {};
  let directives2 = Array.from(attributes).map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler3 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler3.inline && handler3.inline(el, directive2, utilities);
    handler3 = handler3.bind(handler3, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler3) : handler3();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({name, value}) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return {name, value};
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({name, value}) => {
    let {name: newName, value: newValue} = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, {name, value});
    if (newName !== name)
      callback(newName, name);
    return {name: newName, value: newValue};
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({name}) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({name, value}) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "bind",
  "init",
  "for",
  "mask",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport",
  "element"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
function start() {
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors())).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
function initTree(el, walker = walk) {
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      directives(el2, el2.attributes).forEach((handle) => handle());
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root) {
  walk(root, (el) => cleanupAttributes(el));
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, {value, modifiers, expression}, {evaluate: evaluate2}) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (!expression) {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    enter: (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    leave: (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0);
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: delay,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: delay,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: {during: defaultValue, start: defaultValue, end: defaultValue},
      leave: {during: defaultValue, start: defaultValue, end: defaultValue},
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  let clickAwayCompatibleShow = () => {
    document.visibilityState === "visible" ? requestAnimationFrame(show) : setTimeout(show);
  };
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning.beforeCancel(() => reject({isFromCancelledTransition: true}));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      queueMicrotask(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, {during, start: start2, end} = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (el.type === "radio") {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      el.checked = checkedAttrLooseCompare(el.value, value);
    }
  } else if (el.type === "checkbox") {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function isBooleanAttr(attrName) {
  const booleanAttributes = [
    "disabled",
    "checked",
    "required",
    "readonly",
    "hidden",
    "open",
    "selected",
    "autofocus",
    "itemscope",
    "multiple",
    "novalidate",
    "allowfullscreen",
    "allowpaymentrequest",
    "formnovalidate",
    "autoplay",
    "controls",
    "loop",
    "muted",
    "playsinline",
    "default",
    "ismap",
    "reversed",
    "async",
    "defer",
    "nomodule"
  ];
  return booleanAttributes.includes(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  if (attr === "")
    return true;
  return attr;
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  callback(alpine_default);
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
  initInterceptors(stores[name]);
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, object) {
  binds[name] = typeof object !== "function" ? () => object : object;
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.10.0",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  setReactivityEngine,
  closestDataStack,
  skipDuringClone,
  addRootSelector,
  addInitSelector,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  setEvaluator,
  mergeProxies,
  findClosest,
  closestRoot,
  interceptor,
  transition,
  setStyles,
  mutateDom,
  directive,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  bound: getBinding,
  $data: scope,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// node_modules/@vue/shared/dist/shared.esm-bundler.js
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
var slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ =  false ? 0 : {};
var EMPTY_ARR =  false ? 0 : [];
var extend = Object.assign;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var targetMap = new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol( false ? 0 : "");
var MAP_KEY_ITERATE_KEY = Symbol( false ? 0 : "");
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const {deps} = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (false) {}
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (false) {}
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var shallowGet = /* @__PURE__ */ createGetter(false, true);
var readonlyGet = /* @__PURE__ */ createGetter(true);
var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
var arrayInstrumentations = {};
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    const arr = toRaw(this);
    for (let i = 0, l = this.length; i < l; i++) {
      track(arr, "get", i + "");
    }
    const res = method.apply(arr, args);
    if (res === -1 || res === false) {
      return method.apply(arr, args.map(toRaw));
    } else {
      return res;
    }
  };
});
["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    pauseTracking();
    const res = method.apply(this, args);
    resetTracking();
    return res;
  };
});
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
var shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (false) {}
    return true;
  },
  deleteProperty(target, key) {
    if (false) {}
    return true;
  }
};
var shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const {has: has2} = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target["__v_raw"];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const {has: has2, get: get3} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (false) {}
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const {has: has2, get: get3} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (false) {}
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  false ? 0 : void 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const {value, done} = innerIterator.next();
        return done ? {value, done} : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (false) {}
    return type === "delete" ? false : this;
  };
}
var mutableInstrumentations = {
  get(key) {
    return get$1(this, key);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
};
var shallowInstrumentations = {
  get(key) {
    return get$1(this, key, false, true);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, true)
};
var readonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, false)
};
var shallowReadonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, true)
};
var iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
iteratorMethods.forEach((method) => {
  mutableInstrumentations[method] = createIterableMethod(method, false, false);
  readonlyInstrumentations[method] = createIterableMethod(method, true, false);
  shallowInstrumentations[method] = createIterableMethod(method, false, true);
  shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: createInstrumentationGetter(false, false)
};
var shallowCollectionHandlers = {
  get: createInstrumentationGetter(false, true)
};
var readonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, false)
};
var shallowReadonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, true)
};
var reactiveMap = new WeakMap();
var shallowReactiveMap = new WeakMap();
var readonlyMap = new WeakMap();
var shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (false) {}
    return target;
  }
  if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed["__v_raw"]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}

// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, {evaluateLater: evaluateLater2, effect: effect3}) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let firstTime = true;
  let oldValue;
  let effectReference = effect3(() => evaluate2((value) => {
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  }));
  el._x_effects.delete(effectReference);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  let currentEl = el;
  while (currentEl) {
    if (currentEl._x_refs)
      refObjects.push(currentEl._x_refs);
    currentEl = currentEl.parentNode;
  }
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el) => (name, key = null) => {
  let root = closestIdRoot(el, name);
  let id = root ? root._x_ids[name] : findAndIncrementId(name);
  return key ? `${name}-${id}-${key}` : `${name}-${id}`;
});

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, {scope: {__placeholder: val}});
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    effect3(() => innerSet(outerGet()));
    effect3(() => outerSet(innerGet()));
  });
});

// packages/alpinejs/src/directives/x-teleport.js
directive("teleport", (el, {expression}, {cleanup: cleanup2}) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = document.querySelector(expression);
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  mutateDom(() => {
    target.appendChild(clone2);
    initTree(clone2);
    clone2._x_ignore = true;
  });
  cleanup2(() => clone2.remove());
});

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, {modifiers}, {cleanup: cleanup2}) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", (el, {expression}, {effect: effect3}) => effect3(evaluateLater(el, expression)));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler3 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("prevent"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("self"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.target === el && next(e);
    });
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler3 = wrapHandler(handler3, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("once")) {
    handler3 = wrapHandler(handler3, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler3, options);
    });
  }
  handler3 = wrapHandler(handler3, (next, e) => {
    if (isKeyEvent(event)) {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
    }
    next(e);
  });
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = debounce(handler3, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = throttle(handler3, wait);
  }
  listenerTarget.addEventListener(event, handler3, options);
  return () => {
    listenerTarget.removeEventListener(event, handler3, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    ctrl: "control",
    slash: "/",
    space: "-",
    spacebar: "-",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    equal: "="
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, {modifiers, expression}, {effect: effect3, cleanup: cleanup2}) => {
  let evaluate2 = evaluateLater(el, expression);
  let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
  let evaluateAssignment = evaluateLater(el, assignmentExpression);
  var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let assigmentFunction = generateAssignmentFunction(el, modifiers, expression);
  let removeListener = on(el, event, modifiers, (e) => {
    evaluateAssignment(() => {
    }, {scope: {
      $event: e,
      rightSideOfExpression: assigmentFunction
    }});
  });
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  let evaluateSetModel = evaluateLater(el, `${expression} = __placeholder`);
  el._x_model = {
    get() {
      let result;
      evaluate2((value) => result = value);
      return result;
    },
    set(value) {
      evaluateSetModel(() => {
      }, {scope: {__placeholder: value}});
    }
  };
  el._x_forceModelUpdate = () => {
    evaluate2((value) => {
      if (value === void 0 && expression.match(/\./))
        value = "";
      window.fromModel = true;
      mutateDom(() => bind(el, "value", value));
      delete window.fromModel;
    });
  };
  effect3(() => {
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate();
  });
});
function generateAssignmentFunction(el, modifiers, expression) {
  if (el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  return (event, currentValue) => {
    return mutateDom(() => {
      if (event instanceof CustomEvent && event.detail !== void 0) {
        return event.detail || event.target.value;
      } else if (el.type === "checkbox") {
        if (Array.isArray(currentValue)) {
          let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
          return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
        return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        }) : Array.from(event.target.selectedOptions).map((option) => {
          return option.value || option.text;
        });
      } else {
        let rawValue = event.target.value;
        return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
      }
    });
  };
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, {expression}, {evaluate: evaluate2}) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
directive("bind", (el, {value, modifiers, expression, original}, {effect: effect3}) => {
  if (!value) {
    return applyBindingsObject(el, expression, original, effect3);
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && expression.match(/\./))
      result = "";
    mutateDom(() => bind(el, value, result, modifiers));
  }));
});
function applyBindingsObject(el, expression, original, effect3) {
  let bindingProviders = {};
  injectBindingProviders(bindingProviders);
  let getBindings = evaluateLater(el, expression);
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  getBindings((bindings) => {
    let attributes = Object.entries(bindings).map(([name, value]) => ({name, value}));
    let staticAttributes = attributesOnly(attributes);
    attributes = attributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    directives(el, attributes, original).map((handle) => {
      cleanupRunners.push(handle.runCleanups);
      handle();
    });
  }, {scope: bindingProviders});
}
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", skipDuringClone((el, {expression}, {cleanup: cleanup2}) => {
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, {scope: dataProviderContext});
  if (data2 === void 0)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
}));

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, {modifiers, expression}, {effect: effect3}) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => el.style.display = "none");
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once((value) => value ? show() : hide(), (value) => {
    if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
      el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
    } else {
      value ? clickAwayCompatibleShow() : hide();
    }
  });
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, {expression}, {effect: effect3, cleanup: cleanup2}) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => el2.remove());
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => keys.push(value2), {scope: {index: key, ...scope2}});
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => keys.push(value), {scope: {index: i, ...scope2}});
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!!lookup[key]._x_effects) {
        lookup[key]._x_effects.forEach(dequeueJob);
      }
      lookup[key].remove();
      lookup[key] = null;
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      refreshScope(elForSpot, scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      addScopeToNode(clone2, reactive(scope2), templateEl);
      mutateDom(() => {
        lastEl.after(clone2);
        initTree(clone2);
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      refreshScope(lookup[sames[i]], scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler2() {
}
handler2.inline = (el, {expression}, {cleanup: cleanup2}) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler2);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, {expression}, {effect: effect3, cleanup: cleanup2}) => {
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      initTree(clone2);
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      walk(clone2, (node) => {
        if (!!node._x_effects) {
          node._x_effects.forEach(dequeueJob);
        }
      });
      clone2.remove();
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, {expression}, {evaluate: evaluate2}) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, {value, modifiers, expression}, {cleanup: cleanup2}) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, {scope: {$event: e}, params: [e]});
  });
  cleanup2(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName2, slug) {
  directive(directiveName2, (el) => warn(`You can't use [x-${directiveName2}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({reactive: reactive2, effect: effect2, release: stop, raw: toRaw});
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/module.esm.js");
/* harmony import */ var remixicon_fonts_remixicon_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! remixicon/fonts/remixicon.css */ "./node_modules/remixicon/fonts/remixicon.css");
// require('./bootstrap');

window.Alpine = alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"];
alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"].start();


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/remixicon/fonts/remixicon.css":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/remixicon/fonts/remixicon.css ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _remixicon_eot_t_1590207869815__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./remixicon.eot?t=1590207869815 */ "./node_modules/remixicon/fonts/remixicon.eot?t=1590207869815");
/* harmony import */ var _remixicon_woff2_t_1590207869815__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./remixicon.woff2?t=1590207869815 */ "./node_modules/remixicon/fonts/remixicon.woff2?t=1590207869815");
/* harmony import */ var _remixicon_woff_t_1590207869815__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./remixicon.woff?t=1590207869815 */ "./node_modules/remixicon/fonts/remixicon.woff?t=1590207869815");
/* harmony import */ var _remixicon_ttf_t_1590207869815__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./remixicon.ttf?t=1590207869815 */ "./node_modules/remixicon/fonts/remixicon.ttf?t=1590207869815");
/* harmony import */ var _remixicon_svg_t_1590207869815__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./remixicon.svg?t=1590207869815 */ "./node_modules/remixicon/fonts/remixicon.svg?t=1590207869815");
// Imports







var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_eot_t_1590207869815__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_eot_t_1590207869815__WEBPACK_IMPORTED_MODULE_2__["default"], { hash: "#iefix" });
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_woff2_t_1590207869815__WEBPACK_IMPORTED_MODULE_3__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_woff_t_1590207869815__WEBPACK_IMPORTED_MODULE_4__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_ttf_t_1590207869815__WEBPACK_IMPORTED_MODULE_5__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_remixicon_svg_t_1590207869815__WEBPACK_IMPORTED_MODULE_6__["default"], { hash: "#remixicon" });
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*\n* Remix Icon v2.5.0\n* https://remixicon.com\n* https://github.com/Remix-Design/RemixIcon\n*\n* Copyright RemixIcon.com\n* Released under the Apache License Version 2.0\n*\n* Date: 2020-05-23\n*/\n@font-face {\n  font-family: \"remixicon\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + "); /* IE9*/\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format('embedded-opentype'), /* IE6-IE8 */\n  url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\"),\n  url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"woff\"),\n  url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/\n  url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format('svg'); /* iOS 4.1- */\n  font-display: swap;\n}\n\n[class^=\"ri-\"], [class*=\" ri-\"] {\n  font-family: 'remixicon' !important;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.ri-lg { font-size: 1.3333em; line-height: 0.75em; vertical-align: -.0667em; }\n.ri-xl { font-size: 1.5em; line-height: 0.6666em; vertical-align: -.075em; }\n.ri-xxs { font-size: .5em; }\n.ri-xs { font-size: .75em; }\n.ri-sm { font-size: .875em }\n.ri-1x { font-size: 1em; }\n.ri-2x { font-size: 2em; }\n.ri-3x { font-size: 3em; }\n.ri-4x { font-size: 4em; }\n.ri-5x { font-size: 5em; }\n.ri-6x { font-size: 6em; }\n.ri-7x { font-size: 7em; }\n.ri-8x { font-size: 8em; }\n.ri-9x { font-size: 9em; }\n.ri-10x { font-size: 10em; }\n.ri-fw { text-align: center; width: 1.25em; }\n\n.ri-24-hours-fill:before { content: \"\\ea01\"; }\n.ri-24-hours-line:before { content: \"\\ea02\"; }\n.ri-4k-fill:before { content: \"\\ea03\"; }\n.ri-4k-line:before { content: \"\\ea04\"; }\n.ri-a-b:before { content: \"\\ea05\"; }\n.ri-account-box-fill:before { content: \"\\ea06\"; }\n.ri-account-box-line:before { content: \"\\ea07\"; }\n.ri-account-circle-fill:before { content: \"\\ea08\"; }\n.ri-account-circle-line:before { content: \"\\ea09\"; }\n.ri-account-pin-box-fill:before { content: \"\\ea0a\"; }\n.ri-account-pin-box-line:before { content: \"\\ea0b\"; }\n.ri-account-pin-circle-fill:before { content: \"\\ea0c\"; }\n.ri-account-pin-circle-line:before { content: \"\\ea0d\"; }\n.ri-add-box-fill:before { content: \"\\ea0e\"; }\n.ri-add-box-line:before { content: \"\\ea0f\"; }\n.ri-add-circle-fill:before { content: \"\\ea10\"; }\n.ri-add-circle-line:before { content: \"\\ea11\"; }\n.ri-add-fill:before { content: \"\\ea12\"; }\n.ri-add-line:before { content: \"\\ea13\"; }\n.ri-admin-fill:before { content: \"\\ea14\"; }\n.ri-admin-line:before { content: \"\\ea15\"; }\n.ri-advertisement-fill:before { content: \"\\ea16\"; }\n.ri-advertisement-line:before { content: \"\\ea17\"; }\n.ri-airplay-fill:before { content: \"\\ea18\"; }\n.ri-airplay-line:before { content: \"\\ea19\"; }\n.ri-alarm-fill:before { content: \"\\ea1a\"; }\n.ri-alarm-line:before { content: \"\\ea1b\"; }\n.ri-alarm-warning-fill:before { content: \"\\ea1c\"; }\n.ri-alarm-warning-line:before { content: \"\\ea1d\"; }\n.ri-album-fill:before { content: \"\\ea1e\"; }\n.ri-album-line:before { content: \"\\ea1f\"; }\n.ri-alert-fill:before { content: \"\\ea20\"; }\n.ri-alert-line:before { content: \"\\ea21\"; }\n.ri-aliens-fill:before { content: \"\\ea22\"; }\n.ri-aliens-line:before { content: \"\\ea23\"; }\n.ri-align-bottom:before { content: \"\\ea24\"; }\n.ri-align-center:before { content: \"\\ea25\"; }\n.ri-align-justify:before { content: \"\\ea26\"; }\n.ri-align-left:before { content: \"\\ea27\"; }\n.ri-align-right:before { content: \"\\ea28\"; }\n.ri-align-top:before { content: \"\\ea29\"; }\n.ri-align-vertically:before { content: \"\\ea2a\"; }\n.ri-alipay-fill:before { content: \"\\ea2b\"; }\n.ri-alipay-line:before { content: \"\\ea2c\"; }\n.ri-amazon-fill:before { content: \"\\ea2d\"; }\n.ri-amazon-line:before { content: \"\\ea2e\"; }\n.ri-anchor-fill:before { content: \"\\ea2f\"; }\n.ri-anchor-line:before { content: \"\\ea30\"; }\n.ri-ancient-gate-fill:before { content: \"\\ea31\"; }\n.ri-ancient-gate-line:before { content: \"\\ea32\"; }\n.ri-ancient-pavilion-fill:before { content: \"\\ea33\"; }\n.ri-ancient-pavilion-line:before { content: \"\\ea34\"; }\n.ri-android-fill:before { content: \"\\ea35\"; }\n.ri-android-line:before { content: \"\\ea36\"; }\n.ri-angularjs-fill:before { content: \"\\ea37\"; }\n.ri-angularjs-line:before { content: \"\\ea38\"; }\n.ri-anticlockwise-2-fill:before { content: \"\\ea39\"; }\n.ri-anticlockwise-2-line:before { content: \"\\ea3a\"; }\n.ri-anticlockwise-fill:before { content: \"\\ea3b\"; }\n.ri-anticlockwise-line:before { content: \"\\ea3c\"; }\n.ri-app-store-fill:before { content: \"\\ea3d\"; }\n.ri-app-store-line:before { content: \"\\ea3e\"; }\n.ri-apple-fill:before { content: \"\\ea3f\"; }\n.ri-apple-line:before { content: \"\\ea40\"; }\n.ri-apps-2-fill:before { content: \"\\ea41\"; }\n.ri-apps-2-line:before { content: \"\\ea42\"; }\n.ri-apps-fill:before { content: \"\\ea43\"; }\n.ri-apps-line:before { content: \"\\ea44\"; }\n.ri-archive-drawer-fill:before { content: \"\\ea45\"; }\n.ri-archive-drawer-line:before { content: \"\\ea46\"; }\n.ri-archive-fill:before { content: \"\\ea47\"; }\n.ri-archive-line:before { content: \"\\ea48\"; }\n.ri-arrow-down-circle-fill:before { content: \"\\ea49\"; }\n.ri-arrow-down-circle-line:before { content: \"\\ea4a\"; }\n.ri-arrow-down-fill:before { content: \"\\ea4b\"; }\n.ri-arrow-down-line:before { content: \"\\ea4c\"; }\n.ri-arrow-down-s-fill:before { content: \"\\ea4d\"; }\n.ri-arrow-down-s-line:before { content: \"\\ea4e\"; }\n.ri-arrow-drop-down-fill:before { content: \"\\ea4f\"; }\n.ri-arrow-drop-down-line:before { content: \"\\ea50\"; }\n.ri-arrow-drop-left-fill:before { content: \"\\ea51\"; }\n.ri-arrow-drop-left-line:before { content: \"\\ea52\"; }\n.ri-arrow-drop-right-fill:before { content: \"\\ea53\"; }\n.ri-arrow-drop-right-line:before { content: \"\\ea54\"; }\n.ri-arrow-drop-up-fill:before { content: \"\\ea55\"; }\n.ri-arrow-drop-up-line:before { content: \"\\ea56\"; }\n.ri-arrow-go-back-fill:before { content: \"\\ea57\"; }\n.ri-arrow-go-back-line:before { content: \"\\ea58\"; }\n.ri-arrow-go-forward-fill:before { content: \"\\ea59\"; }\n.ri-arrow-go-forward-line:before { content: \"\\ea5a\"; }\n.ri-arrow-left-circle-fill:before { content: \"\\ea5b\"; }\n.ri-arrow-left-circle-line:before { content: \"\\ea5c\"; }\n.ri-arrow-left-down-fill:before { content: \"\\ea5d\"; }\n.ri-arrow-left-down-line:before { content: \"\\ea5e\"; }\n.ri-arrow-left-fill:before { content: \"\\ea5f\"; }\n.ri-arrow-left-line:before { content: \"\\ea60\"; }\n.ri-arrow-left-right-fill:before { content: \"\\ea61\"; }\n.ri-arrow-left-right-line:before { content: \"\\ea62\"; }\n.ri-arrow-left-s-fill:before { content: \"\\ea63\"; }\n.ri-arrow-left-s-line:before { content: \"\\ea64\"; }\n.ri-arrow-left-up-fill:before { content: \"\\ea65\"; }\n.ri-arrow-left-up-line:before { content: \"\\ea66\"; }\n.ri-arrow-right-circle-fill:before { content: \"\\ea67\"; }\n.ri-arrow-right-circle-line:before { content: \"\\ea68\"; }\n.ri-arrow-right-down-fill:before { content: \"\\ea69\"; }\n.ri-arrow-right-down-line:before { content: \"\\ea6a\"; }\n.ri-arrow-right-fill:before { content: \"\\ea6b\"; }\n.ri-arrow-right-line:before { content: \"\\ea6c\"; }\n.ri-arrow-right-s-fill:before { content: \"\\ea6d\"; }\n.ri-arrow-right-s-line:before { content: \"\\ea6e\"; }\n.ri-arrow-right-up-fill:before { content: \"\\ea6f\"; }\n.ri-arrow-right-up-line:before { content: \"\\ea70\"; }\n.ri-arrow-up-circle-fill:before { content: \"\\ea71\"; }\n.ri-arrow-up-circle-line:before { content: \"\\ea72\"; }\n.ri-arrow-up-down-fill:before { content: \"\\ea73\"; }\n.ri-arrow-up-down-line:before { content: \"\\ea74\"; }\n.ri-arrow-up-fill:before { content: \"\\ea75\"; }\n.ri-arrow-up-line:before { content: \"\\ea76\"; }\n.ri-arrow-up-s-fill:before { content: \"\\ea77\"; }\n.ri-arrow-up-s-line:before { content: \"\\ea78\"; }\n.ri-artboard-2-fill:before { content: \"\\ea79\"; }\n.ri-artboard-2-line:before { content: \"\\ea7a\"; }\n.ri-artboard-fill:before { content: \"\\ea7b\"; }\n.ri-artboard-line:before { content: \"\\ea7c\"; }\n.ri-article-fill:before { content: \"\\ea7d\"; }\n.ri-article-line:before { content: \"\\ea7e\"; }\n.ri-aspect-ratio-fill:before { content: \"\\ea7f\"; }\n.ri-aspect-ratio-line:before { content: \"\\ea80\"; }\n.ri-asterisk:before { content: \"\\ea81\"; }\n.ri-at-fill:before { content: \"\\ea82\"; }\n.ri-at-line:before { content: \"\\ea83\"; }\n.ri-attachment-2:before { content: \"\\ea84\"; }\n.ri-attachment-fill:before { content: \"\\ea85\"; }\n.ri-attachment-line:before { content: \"\\ea86\"; }\n.ri-auction-fill:before { content: \"\\ea87\"; }\n.ri-auction-line:before { content: \"\\ea88\"; }\n.ri-award-fill:before { content: \"\\ea89\"; }\n.ri-award-line:before { content: \"\\ea8a\"; }\n.ri-baidu-fill:before { content: \"\\ea8b\"; }\n.ri-baidu-line:before { content: \"\\ea8c\"; }\n.ri-ball-pen-fill:before { content: \"\\ea8d\"; }\n.ri-ball-pen-line:before { content: \"\\ea8e\"; }\n.ri-bank-card-2-fill:before { content: \"\\ea8f\"; }\n.ri-bank-card-2-line:before { content: \"\\ea90\"; }\n.ri-bank-card-fill:before { content: \"\\ea91\"; }\n.ri-bank-card-line:before { content: \"\\ea92\"; }\n.ri-bank-fill:before { content: \"\\ea93\"; }\n.ri-bank-line:before { content: \"\\ea94\"; }\n.ri-bar-chart-2-fill:before { content: \"\\ea95\"; }\n.ri-bar-chart-2-line:before { content: \"\\ea96\"; }\n.ri-bar-chart-box-fill:before { content: \"\\ea97\"; }\n.ri-bar-chart-box-line:before { content: \"\\ea98\"; }\n.ri-bar-chart-fill:before { content: \"\\ea99\"; }\n.ri-bar-chart-grouped-fill:before { content: \"\\ea9a\"; }\n.ri-bar-chart-grouped-line:before { content: \"\\ea9b\"; }\n.ri-bar-chart-horizontal-fill:before { content: \"\\ea9c\"; }\n.ri-bar-chart-horizontal-line:before { content: \"\\ea9d\"; }\n.ri-bar-chart-line:before { content: \"\\ea9e\"; }\n.ri-barcode-box-fill:before { content: \"\\ea9f\"; }\n.ri-barcode-box-line:before { content: \"\\eaa0\"; }\n.ri-barcode-fill:before { content: \"\\eaa1\"; }\n.ri-barcode-line:before { content: \"\\eaa2\"; }\n.ri-barricade-fill:before { content: \"\\eaa3\"; }\n.ri-barricade-line:before { content: \"\\eaa4\"; }\n.ri-base-station-fill:before { content: \"\\eaa5\"; }\n.ri-base-station-line:before { content: \"\\eaa6\"; }\n.ri-basketball-fill:before { content: \"\\eaa7\"; }\n.ri-basketball-line:before { content: \"\\eaa8\"; }\n.ri-battery-2-charge-fill:before { content: \"\\eaa9\"; }\n.ri-battery-2-charge-line:before { content: \"\\eaaa\"; }\n.ri-battery-2-fill:before { content: \"\\eaab\"; }\n.ri-battery-2-line:before { content: \"\\eaac\"; }\n.ri-battery-charge-fill:before { content: \"\\eaad\"; }\n.ri-battery-charge-line:before { content: \"\\eaae\"; }\n.ri-battery-fill:before { content: \"\\eaaf\"; }\n.ri-battery-line:before { content: \"\\eab0\"; }\n.ri-battery-low-fill:before { content: \"\\eab1\"; }\n.ri-battery-low-line:before { content: \"\\eab2\"; }\n.ri-battery-saver-fill:before { content: \"\\eab3\"; }\n.ri-battery-saver-line:before { content: \"\\eab4\"; }\n.ri-battery-share-fill:before { content: \"\\eab5\"; }\n.ri-battery-share-line:before { content: \"\\eab6\"; }\n.ri-bear-smile-fill:before { content: \"\\eab7\"; }\n.ri-bear-smile-line:before { content: \"\\eab8\"; }\n.ri-behance-fill:before { content: \"\\eab9\"; }\n.ri-behance-line:before { content: \"\\eaba\"; }\n.ri-bell-fill:before { content: \"\\eabb\"; }\n.ri-bell-line:before { content: \"\\eabc\"; }\n.ri-bike-fill:before { content: \"\\eabd\"; }\n.ri-bike-line:before { content: \"\\eabe\"; }\n.ri-bilibili-fill:before { content: \"\\eabf\"; }\n.ri-bilibili-line:before { content: \"\\eac0\"; }\n.ri-bill-fill:before { content: \"\\eac1\"; }\n.ri-bill-line:before { content: \"\\eac2\"; }\n.ri-billiards-fill:before { content: \"\\eac3\"; }\n.ri-billiards-line:before { content: \"\\eac4\"; }\n.ri-bit-coin-fill:before { content: \"\\eac5\"; }\n.ri-bit-coin-line:before { content: \"\\eac6\"; }\n.ri-blaze-fill:before { content: \"\\eac7\"; }\n.ri-blaze-line:before { content: \"\\eac8\"; }\n.ri-bluetooth-connect-fill:before { content: \"\\eac9\"; }\n.ri-bluetooth-connect-line:before { content: \"\\eaca\"; }\n.ri-bluetooth-fill:before { content: \"\\eacb\"; }\n.ri-bluetooth-line:before { content: \"\\eacc\"; }\n.ri-blur-off-fill:before { content: \"\\eacd\"; }\n.ri-blur-off-line:before { content: \"\\eace\"; }\n.ri-body-scan-fill:before { content: \"\\eacf\"; }\n.ri-body-scan-line:before { content: \"\\ead0\"; }\n.ri-bold:before { content: \"\\ead1\"; }\n.ri-book-2-fill:before { content: \"\\ead2\"; }\n.ri-book-2-line:before { content: \"\\ead3\"; }\n.ri-book-3-fill:before { content: \"\\ead4\"; }\n.ri-book-3-line:before { content: \"\\ead5\"; }\n.ri-book-fill:before { content: \"\\ead6\"; }\n.ri-book-line:before { content: \"\\ead7\"; }\n.ri-book-mark-fill:before { content: \"\\ead8\"; }\n.ri-book-mark-line:before { content: \"\\ead9\"; }\n.ri-book-open-fill:before { content: \"\\eada\"; }\n.ri-book-open-line:before { content: \"\\eadb\"; }\n.ri-book-read-fill:before { content: \"\\eadc\"; }\n.ri-book-read-line:before { content: \"\\eadd\"; }\n.ri-booklet-fill:before { content: \"\\eade\"; }\n.ri-booklet-line:before { content: \"\\eadf\"; }\n.ri-bookmark-2-fill:before { content: \"\\eae0\"; }\n.ri-bookmark-2-line:before { content: \"\\eae1\"; }\n.ri-bookmark-3-fill:before { content: \"\\eae2\"; }\n.ri-bookmark-3-line:before { content: \"\\eae3\"; }\n.ri-bookmark-fill:before { content: \"\\eae4\"; }\n.ri-bookmark-line:before { content: \"\\eae5\"; }\n.ri-boxing-fill:before { content: \"\\eae6\"; }\n.ri-boxing-line:before { content: \"\\eae7\"; }\n.ri-braces-fill:before { content: \"\\eae8\"; }\n.ri-braces-line:before { content: \"\\eae9\"; }\n.ri-brackets-fill:before { content: \"\\eaea\"; }\n.ri-brackets-line:before { content: \"\\eaeb\"; }\n.ri-briefcase-2-fill:before { content: \"\\eaec\"; }\n.ri-briefcase-2-line:before { content: \"\\eaed\"; }\n.ri-briefcase-3-fill:before { content: \"\\eaee\"; }\n.ri-briefcase-3-line:before { content: \"\\eaef\"; }\n.ri-briefcase-4-fill:before { content: \"\\eaf0\"; }\n.ri-briefcase-4-line:before { content: \"\\eaf1\"; }\n.ri-briefcase-5-fill:before { content: \"\\eaf2\"; }\n.ri-briefcase-5-line:before { content: \"\\eaf3\"; }\n.ri-briefcase-fill:before { content: \"\\eaf4\"; }\n.ri-briefcase-line:before { content: \"\\eaf5\"; }\n.ri-bring-forward:before { content: \"\\eaf6\"; }\n.ri-bring-to-front:before { content: \"\\eaf7\"; }\n.ri-broadcast-fill:before { content: \"\\eaf8\"; }\n.ri-broadcast-line:before { content: \"\\eaf9\"; }\n.ri-brush-2-fill:before { content: \"\\eafa\"; }\n.ri-brush-2-line:before { content: \"\\eafb\"; }\n.ri-brush-3-fill:before { content: \"\\eafc\"; }\n.ri-brush-3-line:before { content: \"\\eafd\"; }\n.ri-brush-4-fill:before { content: \"\\eafe\"; }\n.ri-brush-4-line:before { content: \"\\eaff\"; }\n.ri-brush-fill:before { content: \"\\eb00\"; }\n.ri-brush-line:before { content: \"\\eb01\"; }\n.ri-bubble-chart-fill:before { content: \"\\eb02\"; }\n.ri-bubble-chart-line:before { content: \"\\eb03\"; }\n.ri-bug-2-fill:before { content: \"\\eb04\"; }\n.ri-bug-2-line:before { content: \"\\eb05\"; }\n.ri-bug-fill:before { content: \"\\eb06\"; }\n.ri-bug-line:before { content: \"\\eb07\"; }\n.ri-building-2-fill:before { content: \"\\eb08\"; }\n.ri-building-2-line:before { content: \"\\eb09\"; }\n.ri-building-3-fill:before { content: \"\\eb0a\"; }\n.ri-building-3-line:before { content: \"\\eb0b\"; }\n.ri-building-4-fill:before { content: \"\\eb0c\"; }\n.ri-building-4-line:before { content: \"\\eb0d\"; }\n.ri-building-fill:before { content: \"\\eb0e\"; }\n.ri-building-line:before { content: \"\\eb0f\"; }\n.ri-bus-2-fill:before { content: \"\\eb10\"; }\n.ri-bus-2-line:before { content: \"\\eb11\"; }\n.ri-bus-fill:before { content: \"\\eb12\"; }\n.ri-bus-line:before { content: \"\\eb13\"; }\n.ri-bus-wifi-fill:before { content: \"\\eb14\"; }\n.ri-bus-wifi-line:before { content: \"\\eb15\"; }\n.ri-cactus-fill:before { content: \"\\eb16\"; }\n.ri-cactus-line:before { content: \"\\eb17\"; }\n.ri-cake-2-fill:before { content: \"\\eb18\"; }\n.ri-cake-2-line:before { content: \"\\eb19\"; }\n.ri-cake-3-fill:before { content: \"\\eb1a\"; }\n.ri-cake-3-line:before { content: \"\\eb1b\"; }\n.ri-cake-fill:before { content: \"\\eb1c\"; }\n.ri-cake-line:before { content: \"\\eb1d\"; }\n.ri-calculator-fill:before { content: \"\\eb1e\"; }\n.ri-calculator-line:before { content: \"\\eb1f\"; }\n.ri-calendar-2-fill:before { content: \"\\eb20\"; }\n.ri-calendar-2-line:before { content: \"\\eb21\"; }\n.ri-calendar-check-fill:before { content: \"\\eb22\"; }\n.ri-calendar-check-line:before { content: \"\\eb23\"; }\n.ri-calendar-event-fill:before { content: \"\\eb24\"; }\n.ri-calendar-event-line:before { content: \"\\eb25\"; }\n.ri-calendar-fill:before { content: \"\\eb26\"; }\n.ri-calendar-line:before { content: \"\\eb27\"; }\n.ri-calendar-todo-fill:before { content: \"\\eb28\"; }\n.ri-calendar-todo-line:before { content: \"\\eb29\"; }\n.ri-camera-2-fill:before { content: \"\\eb2a\"; }\n.ri-camera-2-line:before { content: \"\\eb2b\"; }\n.ri-camera-3-fill:before { content: \"\\eb2c\"; }\n.ri-camera-3-line:before { content: \"\\eb2d\"; }\n.ri-camera-fill:before { content: \"\\eb2e\"; }\n.ri-camera-lens-fill:before { content: \"\\eb2f\"; }\n.ri-camera-lens-line:before { content: \"\\eb30\"; }\n.ri-camera-line:before { content: \"\\eb31\"; }\n.ri-camera-off-fill:before { content: \"\\eb32\"; }\n.ri-camera-off-line:before { content: \"\\eb33\"; }\n.ri-camera-switch-fill:before { content: \"\\eb34\"; }\n.ri-camera-switch-line:before { content: \"\\eb35\"; }\n.ri-capsule-fill:before { content: \"\\eb36\"; }\n.ri-capsule-line:before { content: \"\\eb37\"; }\n.ri-car-fill:before { content: \"\\eb38\"; }\n.ri-car-line:before { content: \"\\eb39\"; }\n.ri-car-washing-fill:before { content: \"\\eb3a\"; }\n.ri-car-washing-line:before { content: \"\\eb3b\"; }\n.ri-caravan-fill:before { content: \"\\eb3c\"; }\n.ri-caravan-line:before { content: \"\\eb3d\"; }\n.ri-cast-fill:before { content: \"\\eb3e\"; }\n.ri-cast-line:before { content: \"\\eb3f\"; }\n.ri-cellphone-fill:before { content: \"\\eb40\"; }\n.ri-cellphone-line:before { content: \"\\eb41\"; }\n.ri-celsius-fill:before { content: \"\\eb42\"; }\n.ri-celsius-line:before { content: \"\\eb43\"; }\n.ri-centos-fill:before { content: \"\\eb44\"; }\n.ri-centos-line:before { content: \"\\eb45\"; }\n.ri-character-recognition-fill:before { content: \"\\eb46\"; }\n.ri-character-recognition-line:before { content: \"\\eb47\"; }\n.ri-charging-pile-2-fill:before { content: \"\\eb48\"; }\n.ri-charging-pile-2-line:before { content: \"\\eb49\"; }\n.ri-charging-pile-fill:before { content: \"\\eb4a\"; }\n.ri-charging-pile-line:before { content: \"\\eb4b\"; }\n.ri-chat-1-fill:before { content: \"\\eb4c\"; }\n.ri-chat-1-line:before { content: \"\\eb4d\"; }\n.ri-chat-2-fill:before { content: \"\\eb4e\"; }\n.ri-chat-2-line:before { content: \"\\eb4f\"; }\n.ri-chat-3-fill:before { content: \"\\eb50\"; }\n.ri-chat-3-line:before { content: \"\\eb51\"; }\n.ri-chat-4-fill:before { content: \"\\eb52\"; }\n.ri-chat-4-line:before { content: \"\\eb53\"; }\n.ri-chat-check-fill:before { content: \"\\eb54\"; }\n.ri-chat-check-line:before { content: \"\\eb55\"; }\n.ri-chat-delete-fill:before { content: \"\\eb56\"; }\n.ri-chat-delete-line:before { content: \"\\eb57\"; }\n.ri-chat-download-fill:before { content: \"\\eb58\"; }\n.ri-chat-download-line:before { content: \"\\eb59\"; }\n.ri-chat-follow-up-fill:before { content: \"\\eb5a\"; }\n.ri-chat-follow-up-line:before { content: \"\\eb5b\"; }\n.ri-chat-forward-fill:before { content: \"\\eb5c\"; }\n.ri-chat-forward-line:before { content: \"\\eb5d\"; }\n.ri-chat-heart-fill:before { content: \"\\eb5e\"; }\n.ri-chat-heart-line:before { content: \"\\eb5f\"; }\n.ri-chat-history-fill:before { content: \"\\eb60\"; }\n.ri-chat-history-line:before { content: \"\\eb61\"; }\n.ri-chat-new-fill:before { content: \"\\eb62\"; }\n.ri-chat-new-line:before { content: \"\\eb63\"; }\n.ri-chat-off-fill:before { content: \"\\eb64\"; }\n.ri-chat-off-line:before { content: \"\\eb65\"; }\n.ri-chat-poll-fill:before { content: \"\\eb66\"; }\n.ri-chat-poll-line:before { content: \"\\eb67\"; }\n.ri-chat-private-fill:before { content: \"\\eb68\"; }\n.ri-chat-private-line:before { content: \"\\eb69\"; }\n.ri-chat-quote-fill:before { content: \"\\eb6a\"; }\n.ri-chat-quote-line:before { content: \"\\eb6b\"; }\n.ri-chat-settings-fill:before { content: \"\\eb6c\"; }\n.ri-chat-settings-line:before { content: \"\\eb6d\"; }\n.ri-chat-smile-2-fill:before { content: \"\\eb6e\"; }\n.ri-chat-smile-2-line:before { content: \"\\eb6f\"; }\n.ri-chat-smile-3-fill:before { content: \"\\eb70\"; }\n.ri-chat-smile-3-line:before { content: \"\\eb71\"; }\n.ri-chat-smile-fill:before { content: \"\\eb72\"; }\n.ri-chat-smile-line:before { content: \"\\eb73\"; }\n.ri-chat-upload-fill:before { content: \"\\eb74\"; }\n.ri-chat-upload-line:before { content: \"\\eb75\"; }\n.ri-chat-voice-fill:before { content: \"\\eb76\"; }\n.ri-chat-voice-line:before { content: \"\\eb77\"; }\n.ri-check-double-fill:before { content: \"\\eb78\"; }\n.ri-check-double-line:before { content: \"\\eb79\"; }\n.ri-check-fill:before { content: \"\\eb7a\"; }\n.ri-check-line:before { content: \"\\eb7b\"; }\n.ri-checkbox-blank-circle-fill:before { content: \"\\eb7c\"; }\n.ri-checkbox-blank-circle-line:before { content: \"\\eb7d\"; }\n.ri-checkbox-blank-fill:before { content: \"\\eb7e\"; }\n.ri-checkbox-blank-line:before { content: \"\\eb7f\"; }\n.ri-checkbox-circle-fill:before { content: \"\\eb80\"; }\n.ri-checkbox-circle-line:before { content: \"\\eb81\"; }\n.ri-checkbox-fill:before { content: \"\\eb82\"; }\n.ri-checkbox-indeterminate-fill:before { content: \"\\eb83\"; }\n.ri-checkbox-indeterminate-line:before { content: \"\\eb84\"; }\n.ri-checkbox-line:before { content: \"\\eb85\"; }\n.ri-checkbox-multiple-blank-fill:before { content: \"\\eb86\"; }\n.ri-checkbox-multiple-blank-line:before { content: \"\\eb87\"; }\n.ri-checkbox-multiple-fill:before { content: \"\\eb88\"; }\n.ri-checkbox-multiple-line:before { content: \"\\eb89\"; }\n.ri-china-railway-fill:before { content: \"\\eb8a\"; }\n.ri-china-railway-line:before { content: \"\\eb8b\"; }\n.ri-chrome-fill:before { content: \"\\eb8c\"; }\n.ri-chrome-line:before { content: \"\\eb8d\"; }\n.ri-clapperboard-fill:before { content: \"\\eb8e\"; }\n.ri-clapperboard-line:before { content: \"\\eb8f\"; }\n.ri-clipboard-fill:before { content: \"\\eb90\"; }\n.ri-clipboard-line:before { content: \"\\eb91\"; }\n.ri-clockwise-2-fill:before { content: \"\\eb92\"; }\n.ri-clockwise-2-line:before { content: \"\\eb93\"; }\n.ri-clockwise-fill:before { content: \"\\eb94\"; }\n.ri-clockwise-line:before { content: \"\\eb95\"; }\n.ri-close-circle-fill:before { content: \"\\eb96\"; }\n.ri-close-circle-line:before { content: \"\\eb97\"; }\n.ri-close-fill:before { content: \"\\eb98\"; }\n.ri-close-line:before { content: \"\\eb99\"; }\n.ri-closed-captioning-fill:before { content: \"\\eb9a\"; }\n.ri-closed-captioning-line:before { content: \"\\eb9b\"; }\n.ri-cloud-fill:before { content: \"\\eb9c\"; }\n.ri-cloud-line:before { content: \"\\eb9d\"; }\n.ri-cloud-off-fill:before { content: \"\\eb9e\"; }\n.ri-cloud-off-line:before { content: \"\\eb9f\"; }\n.ri-cloud-windy-fill:before { content: \"\\eba0\"; }\n.ri-cloud-windy-line:before { content: \"\\eba1\"; }\n.ri-cloudy-2-fill:before { content: \"\\eba2\"; }\n.ri-cloudy-2-line:before { content: \"\\eba3\"; }\n.ri-cloudy-fill:before { content: \"\\eba4\"; }\n.ri-cloudy-line:before { content: \"\\eba5\"; }\n.ri-code-box-fill:before { content: \"\\eba6\"; }\n.ri-code-box-line:before { content: \"\\eba7\"; }\n.ri-code-fill:before { content: \"\\eba8\"; }\n.ri-code-line:before { content: \"\\eba9\"; }\n.ri-code-s-fill:before { content: \"\\ebaa\"; }\n.ri-code-s-line:before { content: \"\\ebab\"; }\n.ri-code-s-slash-fill:before { content: \"\\ebac\"; }\n.ri-code-s-slash-line:before { content: \"\\ebad\"; }\n.ri-code-view:before { content: \"\\ebae\"; }\n.ri-codepen-fill:before { content: \"\\ebaf\"; }\n.ri-codepen-line:before { content: \"\\ebb0\"; }\n.ri-coin-fill:before { content: \"\\ebb1\"; }\n.ri-coin-line:before { content: \"\\ebb2\"; }\n.ri-coins-fill:before { content: \"\\ebb3\"; }\n.ri-coins-line:before { content: \"\\ebb4\"; }\n.ri-collage-fill:before { content: \"\\ebb5\"; }\n.ri-collage-line:before { content: \"\\ebb6\"; }\n.ri-command-fill:before { content: \"\\ebb7\"; }\n.ri-command-line:before { content: \"\\ebb8\"; }\n.ri-community-fill:before { content: \"\\ebb9\"; }\n.ri-community-line:before { content: \"\\ebba\"; }\n.ri-compass-2-fill:before { content: \"\\ebbb\"; }\n.ri-compass-2-line:before { content: \"\\ebbc\"; }\n.ri-compass-3-fill:before { content: \"\\ebbd\"; }\n.ri-compass-3-line:before { content: \"\\ebbe\"; }\n.ri-compass-4-fill:before { content: \"\\ebbf\"; }\n.ri-compass-4-line:before { content: \"\\ebc0\"; }\n.ri-compass-discover-fill:before { content: \"\\ebc1\"; }\n.ri-compass-discover-line:before { content: \"\\ebc2\"; }\n.ri-compass-fill:before { content: \"\\ebc3\"; }\n.ri-compass-line:before { content: \"\\ebc4\"; }\n.ri-compasses-2-fill:before { content: \"\\ebc5\"; }\n.ri-compasses-2-line:before { content: \"\\ebc6\"; }\n.ri-compasses-fill:before { content: \"\\ebc7\"; }\n.ri-compasses-line:before { content: \"\\ebc8\"; }\n.ri-computer-fill:before { content: \"\\ebc9\"; }\n.ri-computer-line:before { content: \"\\ebca\"; }\n.ri-contacts-book-2-fill:before { content: \"\\ebcb\"; }\n.ri-contacts-book-2-line:before { content: \"\\ebcc\"; }\n.ri-contacts-book-fill:before { content: \"\\ebcd\"; }\n.ri-contacts-book-line:before { content: \"\\ebce\"; }\n.ri-contacts-book-upload-fill:before { content: \"\\ebcf\"; }\n.ri-contacts-book-upload-line:before { content: \"\\ebd0\"; }\n.ri-contacts-fill:before { content: \"\\ebd1\"; }\n.ri-contacts-line:before { content: \"\\ebd2\"; }\n.ri-contrast-2-fill:before { content: \"\\ebd3\"; }\n.ri-contrast-2-line:before { content: \"\\ebd4\"; }\n.ri-contrast-drop-2-fill:before { content: \"\\ebd5\"; }\n.ri-contrast-drop-2-line:before { content: \"\\ebd6\"; }\n.ri-contrast-drop-fill:before { content: \"\\ebd7\"; }\n.ri-contrast-drop-line:before { content: \"\\ebd8\"; }\n.ri-contrast-fill:before { content: \"\\ebd9\"; }\n.ri-contrast-line:before { content: \"\\ebda\"; }\n.ri-copper-coin-fill:before { content: \"\\ebdb\"; }\n.ri-copper-coin-line:before { content: \"\\ebdc\"; }\n.ri-copper-diamond-fill:before { content: \"\\ebdd\"; }\n.ri-copper-diamond-line:before { content: \"\\ebde\"; }\n.ri-copyleft-fill:before { content: \"\\ebdf\"; }\n.ri-copyleft-line:before { content: \"\\ebe0\"; }\n.ri-copyright-fill:before { content: \"\\ebe1\"; }\n.ri-copyright-line:before { content: \"\\ebe2\"; }\n.ri-coreos-fill:before { content: \"\\ebe3\"; }\n.ri-coreos-line:before { content: \"\\ebe4\"; }\n.ri-coupon-2-fill:before { content: \"\\ebe5\"; }\n.ri-coupon-2-line:before { content: \"\\ebe6\"; }\n.ri-coupon-3-fill:before { content: \"\\ebe7\"; }\n.ri-coupon-3-line:before { content: \"\\ebe8\"; }\n.ri-coupon-4-fill:before { content: \"\\ebe9\"; }\n.ri-coupon-4-line:before { content: \"\\ebea\"; }\n.ri-coupon-5-fill:before { content: \"\\ebeb\"; }\n.ri-coupon-5-line:before { content: \"\\ebec\"; }\n.ri-coupon-fill:before { content: \"\\ebed\"; }\n.ri-coupon-line:before { content: \"\\ebee\"; }\n.ri-cpu-fill:before { content: \"\\ebef\"; }\n.ri-cpu-line:before { content: \"\\ebf0\"; }\n.ri-creative-commons-by-fill:before { content: \"\\ebf1\"; }\n.ri-creative-commons-by-line:before { content: \"\\ebf2\"; }\n.ri-creative-commons-fill:before { content: \"\\ebf3\"; }\n.ri-creative-commons-line:before { content: \"\\ebf4\"; }\n.ri-creative-commons-nc-fill:before { content: \"\\ebf5\"; }\n.ri-creative-commons-nc-line:before { content: \"\\ebf6\"; }\n.ri-creative-commons-nd-fill:before { content: \"\\ebf7\"; }\n.ri-creative-commons-nd-line:before { content: \"\\ebf8\"; }\n.ri-creative-commons-sa-fill:before { content: \"\\ebf9\"; }\n.ri-creative-commons-sa-line:before { content: \"\\ebfa\"; }\n.ri-creative-commons-zero-fill:before { content: \"\\ebfb\"; }\n.ri-creative-commons-zero-line:before { content: \"\\ebfc\"; }\n.ri-criminal-fill:before { content: \"\\ebfd\"; }\n.ri-criminal-line:before { content: \"\\ebfe\"; }\n.ri-crop-2-fill:before { content: \"\\ebff\"; }\n.ri-crop-2-line:before { content: \"\\ec00\"; }\n.ri-crop-fill:before { content: \"\\ec01\"; }\n.ri-crop-line:before { content: \"\\ec02\"; }\n.ri-css3-fill:before { content: \"\\ec03\"; }\n.ri-css3-line:before { content: \"\\ec04\"; }\n.ri-cup-fill:before { content: \"\\ec05\"; }\n.ri-cup-line:before { content: \"\\ec06\"; }\n.ri-currency-fill:before { content: \"\\ec07\"; }\n.ri-currency-line:before { content: \"\\ec08\"; }\n.ri-cursor-fill:before { content: \"\\ec09\"; }\n.ri-cursor-line:before { content: \"\\ec0a\"; }\n.ri-customer-service-2-fill:before { content: \"\\ec0b\"; }\n.ri-customer-service-2-line:before { content: \"\\ec0c\"; }\n.ri-customer-service-fill:before { content: \"\\ec0d\"; }\n.ri-customer-service-line:before { content: \"\\ec0e\"; }\n.ri-dashboard-2-fill:before { content: \"\\ec0f\"; }\n.ri-dashboard-2-line:before { content: \"\\ec10\"; }\n.ri-dashboard-3-fill:before { content: \"\\ec11\"; }\n.ri-dashboard-3-line:before { content: \"\\ec12\"; }\n.ri-dashboard-fill:before { content: \"\\ec13\"; }\n.ri-dashboard-line:before { content: \"\\ec14\"; }\n.ri-database-2-fill:before { content: \"\\ec15\"; }\n.ri-database-2-line:before { content: \"\\ec16\"; }\n.ri-database-fill:before { content: \"\\ec17\"; }\n.ri-database-line:before { content: \"\\ec18\"; }\n.ri-delete-back-2-fill:before { content: \"\\ec19\"; }\n.ri-delete-back-2-line:before { content: \"\\ec1a\"; }\n.ri-delete-back-fill:before { content: \"\\ec1b\"; }\n.ri-delete-back-line:before { content: \"\\ec1c\"; }\n.ri-delete-bin-2-fill:before { content: \"\\ec1d\"; }\n.ri-delete-bin-2-line:before { content: \"\\ec1e\"; }\n.ri-delete-bin-3-fill:before { content: \"\\ec1f\"; }\n.ri-delete-bin-3-line:before { content: \"\\ec20\"; }\n.ri-delete-bin-4-fill:before { content: \"\\ec21\"; }\n.ri-delete-bin-4-line:before { content: \"\\ec22\"; }\n.ri-delete-bin-5-fill:before { content: \"\\ec23\"; }\n.ri-delete-bin-5-line:before { content: \"\\ec24\"; }\n.ri-delete-bin-6-fill:before { content: \"\\ec25\"; }\n.ri-delete-bin-6-line:before { content: \"\\ec26\"; }\n.ri-delete-bin-7-fill:before { content: \"\\ec27\"; }\n.ri-delete-bin-7-line:before { content: \"\\ec28\"; }\n.ri-delete-bin-fill:before { content: \"\\ec29\"; }\n.ri-delete-bin-line:before { content: \"\\ec2a\"; }\n.ri-delete-column:before { content: \"\\ec2b\"; }\n.ri-delete-row:before { content: \"\\ec2c\"; }\n.ri-device-fill:before { content: \"\\ec2d\"; }\n.ri-device-line:before { content: \"\\ec2e\"; }\n.ri-device-recover-fill:before { content: \"\\ec2f\"; }\n.ri-device-recover-line:before { content: \"\\ec30\"; }\n.ri-dingding-fill:before { content: \"\\ec31\"; }\n.ri-dingding-line:before { content: \"\\ec32\"; }\n.ri-direction-fill:before { content: \"\\ec33\"; }\n.ri-direction-line:before { content: \"\\ec34\"; }\n.ri-disc-fill:before { content: \"\\ec35\"; }\n.ri-disc-line:before { content: \"\\ec36\"; }\n.ri-discord-fill:before { content: \"\\ec37\"; }\n.ri-discord-line:before { content: \"\\ec38\"; }\n.ri-discuss-fill:before { content: \"\\ec39\"; }\n.ri-discuss-line:before { content: \"\\ec3a\"; }\n.ri-dislike-fill:before { content: \"\\ec3b\"; }\n.ri-dislike-line:before { content: \"\\ec3c\"; }\n.ri-disqus-fill:before { content: \"\\ec3d\"; }\n.ri-disqus-line:before { content: \"\\ec3e\"; }\n.ri-divide-fill:before { content: \"\\ec3f\"; }\n.ri-divide-line:before { content: \"\\ec40\"; }\n.ri-donut-chart-fill:before { content: \"\\ec41\"; }\n.ri-donut-chart-line:before { content: \"\\ec42\"; }\n.ri-door-closed-fill:before { content: \"\\ec43\"; }\n.ri-door-closed-line:before { content: \"\\ec44\"; }\n.ri-door-fill:before { content: \"\\ec45\"; }\n.ri-door-line:before { content: \"\\ec46\"; }\n.ri-door-lock-box-fill:before { content: \"\\ec47\"; }\n.ri-door-lock-box-line:before { content: \"\\ec48\"; }\n.ri-door-lock-fill:before { content: \"\\ec49\"; }\n.ri-door-lock-line:before { content: \"\\ec4a\"; }\n.ri-door-open-fill:before { content: \"\\ec4b\"; }\n.ri-door-open-line:before { content: \"\\ec4c\"; }\n.ri-dossier-fill:before { content: \"\\ec4d\"; }\n.ri-dossier-line:before { content: \"\\ec4e\"; }\n.ri-douban-fill:before { content: \"\\ec4f\"; }\n.ri-douban-line:before { content: \"\\ec50\"; }\n.ri-double-quotes-l:before { content: \"\\ec51\"; }\n.ri-double-quotes-r:before { content: \"\\ec52\"; }\n.ri-download-2-fill:before { content: \"\\ec53\"; }\n.ri-download-2-line:before { content: \"\\ec54\"; }\n.ri-download-cloud-2-fill:before { content: \"\\ec55\"; }\n.ri-download-cloud-2-line:before { content: \"\\ec56\"; }\n.ri-download-cloud-fill:before { content: \"\\ec57\"; }\n.ri-download-cloud-line:before { content: \"\\ec58\"; }\n.ri-download-fill:before { content: \"\\ec59\"; }\n.ri-download-line:before { content: \"\\ec5a\"; }\n.ri-draft-fill:before { content: \"\\ec5b\"; }\n.ri-draft-line:before { content: \"\\ec5c\"; }\n.ri-drag-drop-fill:before { content: \"\\ec5d\"; }\n.ri-drag-drop-line:before { content: \"\\ec5e\"; }\n.ri-drag-move-2-fill:before { content: \"\\ec5f\"; }\n.ri-drag-move-2-line:before { content: \"\\ec60\"; }\n.ri-drag-move-fill:before { content: \"\\ec61\"; }\n.ri-drag-move-line:before { content: \"\\ec62\"; }\n.ri-dribbble-fill:before { content: \"\\ec63\"; }\n.ri-dribbble-line:before { content: \"\\ec64\"; }\n.ri-drive-fill:before { content: \"\\ec65\"; }\n.ri-drive-line:before { content: \"\\ec66\"; }\n.ri-drizzle-fill:before { content: \"\\ec67\"; }\n.ri-drizzle-line:before { content: \"\\ec68\"; }\n.ri-drop-fill:before { content: \"\\ec69\"; }\n.ri-drop-line:before { content: \"\\ec6a\"; }\n.ri-dropbox-fill:before { content: \"\\ec6b\"; }\n.ri-dropbox-line:before { content: \"\\ec6c\"; }\n.ri-dual-sim-1-fill:before { content: \"\\ec6d\"; }\n.ri-dual-sim-1-line:before { content: \"\\ec6e\"; }\n.ri-dual-sim-2-fill:before { content: \"\\ec6f\"; }\n.ri-dual-sim-2-line:before { content: \"\\ec70\"; }\n.ri-dv-fill:before { content: \"\\ec71\"; }\n.ri-dv-line:before { content: \"\\ec72\"; }\n.ri-dvd-fill:before { content: \"\\ec73\"; }\n.ri-dvd-line:before { content: \"\\ec74\"; }\n.ri-e-bike-2-fill:before { content: \"\\ec75\"; }\n.ri-e-bike-2-line:before { content: \"\\ec76\"; }\n.ri-e-bike-fill:before { content: \"\\ec77\"; }\n.ri-e-bike-line:before { content: \"\\ec78\"; }\n.ri-earth-fill:before { content: \"\\ec79\"; }\n.ri-earth-line:before { content: \"\\ec7a\"; }\n.ri-earthquake-fill:before { content: \"\\ec7b\"; }\n.ri-earthquake-line:before { content: \"\\ec7c\"; }\n.ri-edge-fill:before { content: \"\\ec7d\"; }\n.ri-edge-line:before { content: \"\\ec7e\"; }\n.ri-edit-2-fill:before { content: \"\\ec7f\"; }\n.ri-edit-2-line:before { content: \"\\ec80\"; }\n.ri-edit-box-fill:before { content: \"\\ec81\"; }\n.ri-edit-box-line:before { content: \"\\ec82\"; }\n.ri-edit-circle-fill:before { content: \"\\ec83\"; }\n.ri-edit-circle-line:before { content: \"\\ec84\"; }\n.ri-edit-fill:before { content: \"\\ec85\"; }\n.ri-edit-line:before { content: \"\\ec86\"; }\n.ri-eject-fill:before { content: \"\\ec87\"; }\n.ri-eject-line:before { content: \"\\ec88\"; }\n.ri-emotion-2-fill:before { content: \"\\ec89\"; }\n.ri-emotion-2-line:before { content: \"\\ec8a\"; }\n.ri-emotion-fill:before { content: \"\\ec8b\"; }\n.ri-emotion-happy-fill:before { content: \"\\ec8c\"; }\n.ri-emotion-happy-line:before { content: \"\\ec8d\"; }\n.ri-emotion-laugh-fill:before { content: \"\\ec8e\"; }\n.ri-emotion-laugh-line:before { content: \"\\ec8f\"; }\n.ri-emotion-line:before { content: \"\\ec90\"; }\n.ri-emotion-normal-fill:before { content: \"\\ec91\"; }\n.ri-emotion-normal-line:before { content: \"\\ec92\"; }\n.ri-emotion-sad-fill:before { content: \"\\ec93\"; }\n.ri-emotion-sad-line:before { content: \"\\ec94\"; }\n.ri-emotion-unhappy-fill:before { content: \"\\ec95\"; }\n.ri-emotion-unhappy-line:before { content: \"\\ec96\"; }\n.ri-empathize-fill:before { content: \"\\ec97\"; }\n.ri-empathize-line:before { content: \"\\ec98\"; }\n.ri-emphasis-cn:before { content: \"\\ec99\"; }\n.ri-emphasis:before { content: \"\\ec9a\"; }\n.ri-english-input:before { content: \"\\ec9b\"; }\n.ri-equalizer-fill:before { content: \"\\ec9c\"; }\n.ri-equalizer-line:before { content: \"\\ec9d\"; }\n.ri-eraser-fill:before { content: \"\\ec9e\"; }\n.ri-eraser-line:before { content: \"\\ec9f\"; }\n.ri-error-warning-fill:before { content: \"\\eca0\"; }\n.ri-error-warning-line:before { content: \"\\eca1\"; }\n.ri-evernote-fill:before { content: \"\\eca2\"; }\n.ri-evernote-line:before { content: \"\\eca3\"; }\n.ri-exchange-box-fill:before { content: \"\\eca4\"; }\n.ri-exchange-box-line:before { content: \"\\eca5\"; }\n.ri-exchange-cny-fill:before { content: \"\\eca6\"; }\n.ri-exchange-cny-line:before { content: \"\\eca7\"; }\n.ri-exchange-dollar-fill:before { content: \"\\eca8\"; }\n.ri-exchange-dollar-line:before { content: \"\\eca9\"; }\n.ri-exchange-fill:before { content: \"\\ecaa\"; }\n.ri-exchange-funds-fill:before { content: \"\\ecab\"; }\n.ri-exchange-funds-line:before { content: \"\\ecac\"; }\n.ri-exchange-line:before { content: \"\\ecad\"; }\n.ri-external-link-fill:before { content: \"\\ecae\"; }\n.ri-external-link-line:before { content: \"\\ecaf\"; }\n.ri-eye-2-fill:before { content: \"\\ecb0\"; }\n.ri-eye-2-line:before { content: \"\\ecb1\"; }\n.ri-eye-close-fill:before { content: \"\\ecb2\"; }\n.ri-eye-close-line:before { content: \"\\ecb3\"; }\n.ri-eye-fill:before { content: \"\\ecb4\"; }\n.ri-eye-line:before { content: \"\\ecb5\"; }\n.ri-eye-off-fill:before { content: \"\\ecb6\"; }\n.ri-eye-off-line:before { content: \"\\ecb7\"; }\n.ri-facebook-box-fill:before { content: \"\\ecb8\"; }\n.ri-facebook-box-line:before { content: \"\\ecb9\"; }\n.ri-facebook-circle-fill:before { content: \"\\ecba\"; }\n.ri-facebook-circle-line:before { content: \"\\ecbb\"; }\n.ri-facebook-fill:before { content: \"\\ecbc\"; }\n.ri-facebook-line:before { content: \"\\ecbd\"; }\n.ri-fahrenheit-fill:before { content: \"\\ecbe\"; }\n.ri-fahrenheit-line:before { content: \"\\ecbf\"; }\n.ri-feedback-fill:before { content: \"\\ecc0\"; }\n.ri-feedback-line:before { content: \"\\ecc1\"; }\n.ri-file-2-fill:before { content: \"\\ecc2\"; }\n.ri-file-2-line:before { content: \"\\ecc3\"; }\n.ri-file-3-fill:before { content: \"\\ecc4\"; }\n.ri-file-3-line:before { content: \"\\ecc5\"; }\n.ri-file-4-fill:before { content: \"\\ecc6\"; }\n.ri-file-4-line:before { content: \"\\ecc7\"; }\n.ri-file-add-fill:before { content: \"\\ecc8\"; }\n.ri-file-add-line:before { content: \"\\ecc9\"; }\n.ri-file-chart-2-fill:before { content: \"\\ecca\"; }\n.ri-file-chart-2-line:before { content: \"\\eccb\"; }\n.ri-file-chart-fill:before { content: \"\\eccc\"; }\n.ri-file-chart-line:before { content: \"\\eccd\"; }\n.ri-file-cloud-fill:before { content: \"\\ecce\"; }\n.ri-file-cloud-line:before { content: \"\\eccf\"; }\n.ri-file-code-fill:before { content: \"\\ecd0\"; }\n.ri-file-code-line:before { content: \"\\ecd1\"; }\n.ri-file-copy-2-fill:before { content: \"\\ecd2\"; }\n.ri-file-copy-2-line:before { content: \"\\ecd3\"; }\n.ri-file-copy-fill:before { content: \"\\ecd4\"; }\n.ri-file-copy-line:before { content: \"\\ecd5\"; }\n.ri-file-damage-fill:before { content: \"\\ecd6\"; }\n.ri-file-damage-line:before { content: \"\\ecd7\"; }\n.ri-file-download-fill:before { content: \"\\ecd8\"; }\n.ri-file-download-line:before { content: \"\\ecd9\"; }\n.ri-file-edit-fill:before { content: \"\\ecda\"; }\n.ri-file-edit-line:before { content: \"\\ecdb\"; }\n.ri-file-excel-2-fill:before { content: \"\\ecdc\"; }\n.ri-file-excel-2-line:before { content: \"\\ecdd\"; }\n.ri-file-excel-fill:before { content: \"\\ecde\"; }\n.ri-file-excel-line:before { content: \"\\ecdf\"; }\n.ri-file-fill:before { content: \"\\ece0\"; }\n.ri-file-forbid-fill:before { content: \"\\ece1\"; }\n.ri-file-forbid-line:before { content: \"\\ece2\"; }\n.ri-file-gif-fill:before { content: \"\\ece3\"; }\n.ri-file-gif-line:before { content: \"\\ece4\"; }\n.ri-file-history-fill:before { content: \"\\ece5\"; }\n.ri-file-history-line:before { content: \"\\ece6\"; }\n.ri-file-hwp-fill:before { content: \"\\ece7\"; }\n.ri-file-hwp-line:before { content: \"\\ece8\"; }\n.ri-file-info-fill:before { content: \"\\ece9\"; }\n.ri-file-info-line:before { content: \"\\ecea\"; }\n.ri-file-line:before { content: \"\\eceb\"; }\n.ri-file-list-2-fill:before { content: \"\\ecec\"; }\n.ri-file-list-2-line:before { content: \"\\eced\"; }\n.ri-file-list-3-fill:before { content: \"\\ecee\"; }\n.ri-file-list-3-line:before { content: \"\\ecef\"; }\n.ri-file-list-fill:before { content: \"\\ecf0\"; }\n.ri-file-list-line:before { content: \"\\ecf1\"; }\n.ri-file-lock-fill:before { content: \"\\ecf2\"; }\n.ri-file-lock-line:before { content: \"\\ecf3\"; }\n.ri-file-mark-fill:before { content: \"\\ecf4\"; }\n.ri-file-mark-line:before { content: \"\\ecf5\"; }\n.ri-file-music-fill:before { content: \"\\ecf6\"; }\n.ri-file-music-line:before { content: \"\\ecf7\"; }\n.ri-file-paper-2-fill:before { content: \"\\ecf8\"; }\n.ri-file-paper-2-line:before { content: \"\\ecf9\"; }\n.ri-file-paper-fill:before { content: \"\\ecfa\"; }\n.ri-file-paper-line:before { content: \"\\ecfb\"; }\n.ri-file-pdf-fill:before { content: \"\\ecfc\"; }\n.ri-file-pdf-line:before { content: \"\\ecfd\"; }\n.ri-file-ppt-2-fill:before { content: \"\\ecfe\"; }\n.ri-file-ppt-2-line:before { content: \"\\ecff\"; }\n.ri-file-ppt-fill:before { content: \"\\ed00\"; }\n.ri-file-ppt-line:before { content: \"\\ed01\"; }\n.ri-file-reduce-fill:before { content: \"\\ed02\"; }\n.ri-file-reduce-line:before { content: \"\\ed03\"; }\n.ri-file-search-fill:before { content: \"\\ed04\"; }\n.ri-file-search-line:before { content: \"\\ed05\"; }\n.ri-file-settings-fill:before { content: \"\\ed06\"; }\n.ri-file-settings-line:before { content: \"\\ed07\"; }\n.ri-file-shield-2-fill:before { content: \"\\ed08\"; }\n.ri-file-shield-2-line:before { content: \"\\ed09\"; }\n.ri-file-shield-fill:before { content: \"\\ed0a\"; }\n.ri-file-shield-line:before { content: \"\\ed0b\"; }\n.ri-file-shred-fill:before { content: \"\\ed0c\"; }\n.ri-file-shred-line:before { content: \"\\ed0d\"; }\n.ri-file-text-fill:before { content: \"\\ed0e\"; }\n.ri-file-text-line:before { content: \"\\ed0f\"; }\n.ri-file-transfer-fill:before { content: \"\\ed10\"; }\n.ri-file-transfer-line:before { content: \"\\ed11\"; }\n.ri-file-unknow-fill:before { content: \"\\ed12\"; }\n.ri-file-unknow-line:before { content: \"\\ed13\"; }\n.ri-file-upload-fill:before { content: \"\\ed14\"; }\n.ri-file-upload-line:before { content: \"\\ed15\"; }\n.ri-file-user-fill:before { content: \"\\ed16\"; }\n.ri-file-user-line:before { content: \"\\ed17\"; }\n.ri-file-warning-fill:before { content: \"\\ed18\"; }\n.ri-file-warning-line:before { content: \"\\ed19\"; }\n.ri-file-word-2-fill:before { content: \"\\ed1a\"; }\n.ri-file-word-2-line:before { content: \"\\ed1b\"; }\n.ri-file-word-fill:before { content: \"\\ed1c\"; }\n.ri-file-word-line:before { content: \"\\ed1d\"; }\n.ri-file-zip-fill:before { content: \"\\ed1e\"; }\n.ri-file-zip-line:before { content: \"\\ed1f\"; }\n.ri-film-fill:before { content: \"\\ed20\"; }\n.ri-film-line:before { content: \"\\ed21\"; }\n.ri-filter-2-fill:before { content: \"\\ed22\"; }\n.ri-filter-2-line:before { content: \"\\ed23\"; }\n.ri-filter-3-fill:before { content: \"\\ed24\"; }\n.ri-filter-3-line:before { content: \"\\ed25\"; }\n.ri-filter-fill:before { content: \"\\ed26\"; }\n.ri-filter-line:before { content: \"\\ed27\"; }\n.ri-filter-off-fill:before { content: \"\\ed28\"; }\n.ri-filter-off-line:before { content: \"\\ed29\"; }\n.ri-find-replace-fill:before { content: \"\\ed2a\"; }\n.ri-find-replace-line:before { content: \"\\ed2b\"; }\n.ri-finder-fill:before { content: \"\\ed2c\"; }\n.ri-finder-line:before { content: \"\\ed2d\"; }\n.ri-fingerprint-2-fill:before { content: \"\\ed2e\"; }\n.ri-fingerprint-2-line:before { content: \"\\ed2f\"; }\n.ri-fingerprint-fill:before { content: \"\\ed30\"; }\n.ri-fingerprint-line:before { content: \"\\ed31\"; }\n.ri-fire-fill:before { content: \"\\ed32\"; }\n.ri-fire-line:before { content: \"\\ed33\"; }\n.ri-firefox-fill:before { content: \"\\ed34\"; }\n.ri-firefox-line:before { content: \"\\ed35\"; }\n.ri-first-aid-kit-fill:before { content: \"\\ed36\"; }\n.ri-first-aid-kit-line:before { content: \"\\ed37\"; }\n.ri-flag-2-fill:before { content: \"\\ed38\"; }\n.ri-flag-2-line:before { content: \"\\ed39\"; }\n.ri-flag-fill:before { content: \"\\ed3a\"; }\n.ri-flag-line:before { content: \"\\ed3b\"; }\n.ri-flashlight-fill:before { content: \"\\ed3c\"; }\n.ri-flashlight-line:before { content: \"\\ed3d\"; }\n.ri-flask-fill:before { content: \"\\ed3e\"; }\n.ri-flask-line:before { content: \"\\ed3f\"; }\n.ri-flight-land-fill:before { content: \"\\ed40\"; }\n.ri-flight-land-line:before { content: \"\\ed41\"; }\n.ri-flight-takeoff-fill:before { content: \"\\ed42\"; }\n.ri-flight-takeoff-line:before { content: \"\\ed43\"; }\n.ri-flood-fill:before { content: \"\\ed44\"; }\n.ri-flood-line:before { content: \"\\ed45\"; }\n.ri-flow-chart:before { content: \"\\ed46\"; }\n.ri-flutter-fill:before { content: \"\\ed47\"; }\n.ri-flutter-line:before { content: \"\\ed48\"; }\n.ri-focus-2-fill:before { content: \"\\ed49\"; }\n.ri-focus-2-line:before { content: \"\\ed4a\"; }\n.ri-focus-3-fill:before { content: \"\\ed4b\"; }\n.ri-focus-3-line:before { content: \"\\ed4c\"; }\n.ri-focus-fill:before { content: \"\\ed4d\"; }\n.ri-focus-line:before { content: \"\\ed4e\"; }\n.ri-foggy-fill:before { content: \"\\ed4f\"; }\n.ri-foggy-line:before { content: \"\\ed50\"; }\n.ri-folder-2-fill:before { content: \"\\ed51\"; }\n.ri-folder-2-line:before { content: \"\\ed52\"; }\n.ri-folder-3-fill:before { content: \"\\ed53\"; }\n.ri-folder-3-line:before { content: \"\\ed54\"; }\n.ri-folder-4-fill:before { content: \"\\ed55\"; }\n.ri-folder-4-line:before { content: \"\\ed56\"; }\n.ri-folder-5-fill:before { content: \"\\ed57\"; }\n.ri-folder-5-line:before { content: \"\\ed58\"; }\n.ri-folder-add-fill:before { content: \"\\ed59\"; }\n.ri-folder-add-line:before { content: \"\\ed5a\"; }\n.ri-folder-chart-2-fill:before { content: \"\\ed5b\"; }\n.ri-folder-chart-2-line:before { content: \"\\ed5c\"; }\n.ri-folder-chart-fill:before { content: \"\\ed5d\"; }\n.ri-folder-chart-line:before { content: \"\\ed5e\"; }\n.ri-folder-download-fill:before { content: \"\\ed5f\"; }\n.ri-folder-download-line:before { content: \"\\ed60\"; }\n.ri-folder-fill:before { content: \"\\ed61\"; }\n.ri-folder-forbid-fill:before { content: \"\\ed62\"; }\n.ri-folder-forbid-line:before { content: \"\\ed63\"; }\n.ri-folder-history-fill:before { content: \"\\ed64\"; }\n.ri-folder-history-line:before { content: \"\\ed65\"; }\n.ri-folder-info-fill:before { content: \"\\ed66\"; }\n.ri-folder-info-line:before { content: \"\\ed67\"; }\n.ri-folder-keyhole-fill:before { content: \"\\ed68\"; }\n.ri-folder-keyhole-line:before { content: \"\\ed69\"; }\n.ri-folder-line:before { content: \"\\ed6a\"; }\n.ri-folder-lock-fill:before { content: \"\\ed6b\"; }\n.ri-folder-lock-line:before { content: \"\\ed6c\"; }\n.ri-folder-music-fill:before { content: \"\\ed6d\"; }\n.ri-folder-music-line:before { content: \"\\ed6e\"; }\n.ri-folder-open-fill:before { content: \"\\ed6f\"; }\n.ri-folder-open-line:before { content: \"\\ed70\"; }\n.ri-folder-received-fill:before { content: \"\\ed71\"; }\n.ri-folder-received-line:before { content: \"\\ed72\"; }\n.ri-folder-reduce-fill:before { content: \"\\ed73\"; }\n.ri-folder-reduce-line:before { content: \"\\ed74\"; }\n.ri-folder-settings-fill:before { content: \"\\ed75\"; }\n.ri-folder-settings-line:before { content: \"\\ed76\"; }\n.ri-folder-shared-fill:before { content: \"\\ed77\"; }\n.ri-folder-shared-line:before { content: \"\\ed78\"; }\n.ri-folder-shield-2-fill:before { content: \"\\ed79\"; }\n.ri-folder-shield-2-line:before { content: \"\\ed7a\"; }\n.ri-folder-shield-fill:before { content: \"\\ed7b\"; }\n.ri-folder-shield-line:before { content: \"\\ed7c\"; }\n.ri-folder-transfer-fill:before { content: \"\\ed7d\"; }\n.ri-folder-transfer-line:before { content: \"\\ed7e\"; }\n.ri-folder-unknow-fill:before { content: \"\\ed7f\"; }\n.ri-folder-unknow-line:before { content: \"\\ed80\"; }\n.ri-folder-upload-fill:before { content: \"\\ed81\"; }\n.ri-folder-upload-line:before { content: \"\\ed82\"; }\n.ri-folder-user-fill:before { content: \"\\ed83\"; }\n.ri-folder-user-line:before { content: \"\\ed84\"; }\n.ri-folder-warning-fill:before { content: \"\\ed85\"; }\n.ri-folder-warning-line:before { content: \"\\ed86\"; }\n.ri-folder-zip-fill:before { content: \"\\ed87\"; }\n.ri-folder-zip-line:before { content: \"\\ed88\"; }\n.ri-folders-fill:before { content: \"\\ed89\"; }\n.ri-folders-line:before { content: \"\\ed8a\"; }\n.ri-font-color:before { content: \"\\ed8b\"; }\n.ri-font-size-2:before { content: \"\\ed8c\"; }\n.ri-font-size:before { content: \"\\ed8d\"; }\n.ri-football-fill:before { content: \"\\ed8e\"; }\n.ri-football-line:before { content: \"\\ed8f\"; }\n.ri-footprint-fill:before { content: \"\\ed90\"; }\n.ri-footprint-line:before { content: \"\\ed91\"; }\n.ri-forbid-2-fill:before { content: \"\\ed92\"; }\n.ri-forbid-2-line:before { content: \"\\ed93\"; }\n.ri-forbid-fill:before { content: \"\\ed94\"; }\n.ri-forbid-line:before { content: \"\\ed95\"; }\n.ri-format-clear:before { content: \"\\ed96\"; }\n.ri-fridge-fill:before { content: \"\\ed97\"; }\n.ri-fridge-line:before { content: \"\\ed98\"; }\n.ri-fullscreen-exit-fill:before { content: \"\\ed99\"; }\n.ri-fullscreen-exit-line:before { content: \"\\ed9a\"; }\n.ri-fullscreen-fill:before { content: \"\\ed9b\"; }\n.ri-fullscreen-line:before { content: \"\\ed9c\"; }\n.ri-function-fill:before { content: \"\\ed9d\"; }\n.ri-function-line:before { content: \"\\ed9e\"; }\n.ri-functions:before { content: \"\\ed9f\"; }\n.ri-funds-box-fill:before { content: \"\\eda0\"; }\n.ri-funds-box-line:before { content: \"\\eda1\"; }\n.ri-funds-fill:before { content: \"\\eda2\"; }\n.ri-funds-line:before { content: \"\\eda3\"; }\n.ri-gallery-fill:before { content: \"\\eda4\"; }\n.ri-gallery-line:before { content: \"\\eda5\"; }\n.ri-gallery-upload-fill:before { content: \"\\eda6\"; }\n.ri-gallery-upload-line:before { content: \"\\eda7\"; }\n.ri-game-fill:before { content: \"\\eda8\"; }\n.ri-game-line:before { content: \"\\eda9\"; }\n.ri-gamepad-fill:before { content: \"\\edaa\"; }\n.ri-gamepad-line:before { content: \"\\edab\"; }\n.ri-gas-station-fill:before { content: \"\\edac\"; }\n.ri-gas-station-line:before { content: \"\\edad\"; }\n.ri-gatsby-fill:before { content: \"\\edae\"; }\n.ri-gatsby-line:before { content: \"\\edaf\"; }\n.ri-genderless-fill:before { content: \"\\edb0\"; }\n.ri-genderless-line:before { content: \"\\edb1\"; }\n.ri-ghost-2-fill:before { content: \"\\edb2\"; }\n.ri-ghost-2-line:before { content: \"\\edb3\"; }\n.ri-ghost-fill:before { content: \"\\edb4\"; }\n.ri-ghost-line:before { content: \"\\edb5\"; }\n.ri-ghost-smile-fill:before { content: \"\\edb6\"; }\n.ri-ghost-smile-line:before { content: \"\\edb7\"; }\n.ri-gift-2-fill:before { content: \"\\edb8\"; }\n.ri-gift-2-line:before { content: \"\\edb9\"; }\n.ri-gift-fill:before { content: \"\\edba\"; }\n.ri-gift-line:before { content: \"\\edbb\"; }\n.ri-git-branch-fill:before { content: \"\\edbc\"; }\n.ri-git-branch-line:before { content: \"\\edbd\"; }\n.ri-git-commit-fill:before { content: \"\\edbe\"; }\n.ri-git-commit-line:before { content: \"\\edbf\"; }\n.ri-git-merge-fill:before { content: \"\\edc0\"; }\n.ri-git-merge-line:before { content: \"\\edc1\"; }\n.ri-git-pull-request-fill:before { content: \"\\edc2\"; }\n.ri-git-pull-request-line:before { content: \"\\edc3\"; }\n.ri-git-repository-commits-fill:before { content: \"\\edc4\"; }\n.ri-git-repository-commits-line:before { content: \"\\edc5\"; }\n.ri-git-repository-fill:before { content: \"\\edc6\"; }\n.ri-git-repository-line:before { content: \"\\edc7\"; }\n.ri-git-repository-private-fill:before { content: \"\\edc8\"; }\n.ri-git-repository-private-line:before { content: \"\\edc9\"; }\n.ri-github-fill:before { content: \"\\edca\"; }\n.ri-github-line:before { content: \"\\edcb\"; }\n.ri-gitlab-fill:before { content: \"\\edcc\"; }\n.ri-gitlab-line:before { content: \"\\edcd\"; }\n.ri-global-fill:before { content: \"\\edce\"; }\n.ri-global-line:before { content: \"\\edcf\"; }\n.ri-globe-fill:before { content: \"\\edd0\"; }\n.ri-globe-line:before { content: \"\\edd1\"; }\n.ri-goblet-fill:before { content: \"\\edd2\"; }\n.ri-goblet-line:before { content: \"\\edd3\"; }\n.ri-google-fill:before { content: \"\\edd4\"; }\n.ri-google-line:before { content: \"\\edd5\"; }\n.ri-google-play-fill:before { content: \"\\edd6\"; }\n.ri-google-play-line:before { content: \"\\edd7\"; }\n.ri-government-fill:before { content: \"\\edd8\"; }\n.ri-government-line:before { content: \"\\edd9\"; }\n.ri-gps-fill:before { content: \"\\edda\"; }\n.ri-gps-line:before { content: \"\\eddb\"; }\n.ri-gradienter-fill:before { content: \"\\eddc\"; }\n.ri-gradienter-line:before { content: \"\\eddd\"; }\n.ri-grid-fill:before { content: \"\\edde\"; }\n.ri-grid-line:before { content: \"\\eddf\"; }\n.ri-group-2-fill:before { content: \"\\ede0\"; }\n.ri-group-2-line:before { content: \"\\ede1\"; }\n.ri-group-fill:before { content: \"\\ede2\"; }\n.ri-group-line:before { content: \"\\ede3\"; }\n.ri-guide-fill:before { content: \"\\ede4\"; }\n.ri-guide-line:before { content: \"\\ede5\"; }\n.ri-h-1:before { content: \"\\ede6\"; }\n.ri-h-2:before { content: \"\\ede7\"; }\n.ri-h-3:before { content: \"\\ede8\"; }\n.ri-h-4:before { content: \"\\ede9\"; }\n.ri-h-5:before { content: \"\\edea\"; }\n.ri-h-6:before { content: \"\\edeb\"; }\n.ri-hail-fill:before { content: \"\\edec\"; }\n.ri-hail-line:before { content: \"\\eded\"; }\n.ri-hammer-fill:before { content: \"\\edee\"; }\n.ri-hammer-line:before { content: \"\\edef\"; }\n.ri-hand-coin-fill:before { content: \"\\edf0\"; }\n.ri-hand-coin-line:before { content: \"\\edf1\"; }\n.ri-hand-heart-fill:before { content: \"\\edf2\"; }\n.ri-hand-heart-line:before { content: \"\\edf3\"; }\n.ri-hand-sanitizer-fill:before { content: \"\\edf4\"; }\n.ri-hand-sanitizer-line:before { content: \"\\edf5\"; }\n.ri-handbag-fill:before { content: \"\\edf6\"; }\n.ri-handbag-line:before { content: \"\\edf7\"; }\n.ri-hard-drive-2-fill:before { content: \"\\edf8\"; }\n.ri-hard-drive-2-line:before { content: \"\\edf9\"; }\n.ri-hard-drive-fill:before { content: \"\\edfa\"; }\n.ri-hard-drive-line:before { content: \"\\edfb\"; }\n.ri-hashtag:before { content: \"\\edfc\"; }\n.ri-haze-2-fill:before { content: \"\\edfd\"; }\n.ri-haze-2-line:before { content: \"\\edfe\"; }\n.ri-haze-fill:before { content: \"\\edff\"; }\n.ri-haze-line:before { content: \"\\ee00\"; }\n.ri-hd-fill:before { content: \"\\ee01\"; }\n.ri-hd-line:before { content: \"\\ee02\"; }\n.ri-heading:before { content: \"\\ee03\"; }\n.ri-headphone-fill:before { content: \"\\ee04\"; }\n.ri-headphone-line:before { content: \"\\ee05\"; }\n.ri-health-book-fill:before { content: \"\\ee06\"; }\n.ri-health-book-line:before { content: \"\\ee07\"; }\n.ri-heart-2-fill:before { content: \"\\ee08\"; }\n.ri-heart-2-line:before { content: \"\\ee09\"; }\n.ri-heart-3-fill:before { content: \"\\ee0a\"; }\n.ri-heart-3-line:before { content: \"\\ee0b\"; }\n.ri-heart-add-fill:before { content: \"\\ee0c\"; }\n.ri-heart-add-line:before { content: \"\\ee0d\"; }\n.ri-heart-fill:before { content: \"\\ee0e\"; }\n.ri-heart-line:before { content: \"\\ee0f\"; }\n.ri-heart-pulse-fill:before { content: \"\\ee10\"; }\n.ri-heart-pulse-line:before { content: \"\\ee11\"; }\n.ri-hearts-fill:before { content: \"\\ee12\"; }\n.ri-hearts-line:before { content: \"\\ee13\"; }\n.ri-heavy-showers-fill:before { content: \"\\ee14\"; }\n.ri-heavy-showers-line:before { content: \"\\ee15\"; }\n.ri-history-fill:before { content: \"\\ee16\"; }\n.ri-history-line:before { content: \"\\ee17\"; }\n.ri-home-2-fill:before { content: \"\\ee18\"; }\n.ri-home-2-line:before { content: \"\\ee19\"; }\n.ri-home-3-fill:before { content: \"\\ee1a\"; }\n.ri-home-3-line:before { content: \"\\ee1b\"; }\n.ri-home-4-fill:before { content: \"\\ee1c\"; }\n.ri-home-4-line:before { content: \"\\ee1d\"; }\n.ri-home-5-fill:before { content: \"\\ee1e\"; }\n.ri-home-5-line:before { content: \"\\ee1f\"; }\n.ri-home-6-fill:before { content: \"\\ee20\"; }\n.ri-home-6-line:before { content: \"\\ee21\"; }\n.ri-home-7-fill:before { content: \"\\ee22\"; }\n.ri-home-7-line:before { content: \"\\ee23\"; }\n.ri-home-8-fill:before { content: \"\\ee24\"; }\n.ri-home-8-line:before { content: \"\\ee25\"; }\n.ri-home-fill:before { content: \"\\ee26\"; }\n.ri-home-gear-fill:before { content: \"\\ee27\"; }\n.ri-home-gear-line:before { content: \"\\ee28\"; }\n.ri-home-heart-fill:before { content: \"\\ee29\"; }\n.ri-home-heart-line:before { content: \"\\ee2a\"; }\n.ri-home-line:before { content: \"\\ee2b\"; }\n.ri-home-smile-2-fill:before { content: \"\\ee2c\"; }\n.ri-home-smile-2-line:before { content: \"\\ee2d\"; }\n.ri-home-smile-fill:before { content: \"\\ee2e\"; }\n.ri-home-smile-line:before { content: \"\\ee2f\"; }\n.ri-home-wifi-fill:before { content: \"\\ee30\"; }\n.ri-home-wifi-line:before { content: \"\\ee31\"; }\n.ri-honor-of-kings-fill:before { content: \"\\ee32\"; }\n.ri-honor-of-kings-line:before { content: \"\\ee33\"; }\n.ri-honour-fill:before { content: \"\\ee34\"; }\n.ri-honour-line:before { content: \"\\ee35\"; }\n.ri-hospital-fill:before { content: \"\\ee36\"; }\n.ri-hospital-line:before { content: \"\\ee37\"; }\n.ri-hotel-bed-fill:before { content: \"\\ee38\"; }\n.ri-hotel-bed-line:before { content: \"\\ee39\"; }\n.ri-hotel-fill:before { content: \"\\ee3a\"; }\n.ri-hotel-line:before { content: \"\\ee3b\"; }\n.ri-hotspot-fill:before { content: \"\\ee3c\"; }\n.ri-hotspot-line:before { content: \"\\ee3d\"; }\n.ri-hq-fill:before { content: \"\\ee3e\"; }\n.ri-hq-line:before { content: \"\\ee3f\"; }\n.ri-html5-fill:before { content: \"\\ee40\"; }\n.ri-html5-line:before { content: \"\\ee41\"; }\n.ri-ie-fill:before { content: \"\\ee42\"; }\n.ri-ie-line:before { content: \"\\ee43\"; }\n.ri-image-2-fill:before { content: \"\\ee44\"; }\n.ri-image-2-line:before { content: \"\\ee45\"; }\n.ri-image-add-fill:before { content: \"\\ee46\"; }\n.ri-image-add-line:before { content: \"\\ee47\"; }\n.ri-image-edit-fill:before { content: \"\\ee48\"; }\n.ri-image-edit-line:before { content: \"\\ee49\"; }\n.ri-image-fill:before { content: \"\\ee4a\"; }\n.ri-image-line:before { content: \"\\ee4b\"; }\n.ri-inbox-archive-fill:before { content: \"\\ee4c\"; }\n.ri-inbox-archive-line:before { content: \"\\ee4d\"; }\n.ri-inbox-fill:before { content: \"\\ee4e\"; }\n.ri-inbox-line:before { content: \"\\ee4f\"; }\n.ri-inbox-unarchive-fill:before { content: \"\\ee50\"; }\n.ri-inbox-unarchive-line:before { content: \"\\ee51\"; }\n.ri-increase-decrease-fill:before { content: \"\\ee52\"; }\n.ri-increase-decrease-line:before { content: \"\\ee53\"; }\n.ri-indent-decrease:before { content: \"\\ee54\"; }\n.ri-indent-increase:before { content: \"\\ee55\"; }\n.ri-indeterminate-circle-fill:before { content: \"\\ee56\"; }\n.ri-indeterminate-circle-line:before { content: \"\\ee57\"; }\n.ri-information-fill:before { content: \"\\ee58\"; }\n.ri-information-line:before { content: \"\\ee59\"; }\n.ri-infrared-thermometer-fill:before { content: \"\\ee5a\"; }\n.ri-infrared-thermometer-line:before { content: \"\\ee5b\"; }\n.ri-ink-bottle-fill:before { content: \"\\ee5c\"; }\n.ri-ink-bottle-line:before { content: \"\\ee5d\"; }\n.ri-input-cursor-move:before { content: \"\\ee5e\"; }\n.ri-input-method-fill:before { content: \"\\ee5f\"; }\n.ri-input-method-line:before { content: \"\\ee60\"; }\n.ri-insert-column-left:before { content: \"\\ee61\"; }\n.ri-insert-column-right:before { content: \"\\ee62\"; }\n.ri-insert-row-bottom:before { content: \"\\ee63\"; }\n.ri-insert-row-top:before { content: \"\\ee64\"; }\n.ri-instagram-fill:before { content: \"\\ee65\"; }\n.ri-instagram-line:before { content: \"\\ee66\"; }\n.ri-install-fill:before { content: \"\\ee67\"; }\n.ri-install-line:before { content: \"\\ee68\"; }\n.ri-invision-fill:before { content: \"\\ee69\"; }\n.ri-invision-line:before { content: \"\\ee6a\"; }\n.ri-italic:before { content: \"\\ee6b\"; }\n.ri-kakao-talk-fill:before { content: \"\\ee6c\"; }\n.ri-kakao-talk-line:before { content: \"\\ee6d\"; }\n.ri-key-2-fill:before { content: \"\\ee6e\"; }\n.ri-key-2-line:before { content: \"\\ee6f\"; }\n.ri-key-fill:before { content: \"\\ee70\"; }\n.ri-key-line:before { content: \"\\ee71\"; }\n.ri-keyboard-box-fill:before { content: \"\\ee72\"; }\n.ri-keyboard-box-line:before { content: \"\\ee73\"; }\n.ri-keyboard-fill:before { content: \"\\ee74\"; }\n.ri-keyboard-line:before { content: \"\\ee75\"; }\n.ri-keynote-fill:before { content: \"\\ee76\"; }\n.ri-keynote-line:before { content: \"\\ee77\"; }\n.ri-knife-blood-fill:before { content: \"\\ee78\"; }\n.ri-knife-blood-line:before { content: \"\\ee79\"; }\n.ri-knife-fill:before { content: \"\\ee7a\"; }\n.ri-knife-line:before { content: \"\\ee7b\"; }\n.ri-landscape-fill:before { content: \"\\ee7c\"; }\n.ri-landscape-line:before { content: \"\\ee7d\"; }\n.ri-layout-2-fill:before { content: \"\\ee7e\"; }\n.ri-layout-2-line:before { content: \"\\ee7f\"; }\n.ri-layout-3-fill:before { content: \"\\ee80\"; }\n.ri-layout-3-line:before { content: \"\\ee81\"; }\n.ri-layout-4-fill:before { content: \"\\ee82\"; }\n.ri-layout-4-line:before { content: \"\\ee83\"; }\n.ri-layout-5-fill:before { content: \"\\ee84\"; }\n.ri-layout-5-line:before { content: \"\\ee85\"; }\n.ri-layout-6-fill:before { content: \"\\ee86\"; }\n.ri-layout-6-line:before { content: \"\\ee87\"; }\n.ri-layout-bottom-2-fill:before { content: \"\\ee88\"; }\n.ri-layout-bottom-2-line:before { content: \"\\ee89\"; }\n.ri-layout-bottom-fill:before { content: \"\\ee8a\"; }\n.ri-layout-bottom-line:before { content: \"\\ee8b\"; }\n.ri-layout-column-fill:before { content: \"\\ee8c\"; }\n.ri-layout-column-line:before { content: \"\\ee8d\"; }\n.ri-layout-fill:before { content: \"\\ee8e\"; }\n.ri-layout-grid-fill:before { content: \"\\ee8f\"; }\n.ri-layout-grid-line:before { content: \"\\ee90\"; }\n.ri-layout-left-2-fill:before { content: \"\\ee91\"; }\n.ri-layout-left-2-line:before { content: \"\\ee92\"; }\n.ri-layout-left-fill:before { content: \"\\ee93\"; }\n.ri-layout-left-line:before { content: \"\\ee94\"; }\n.ri-layout-line:before { content: \"\\ee95\"; }\n.ri-layout-masonry-fill:before { content: \"\\ee96\"; }\n.ri-layout-masonry-line:before { content: \"\\ee97\"; }\n.ri-layout-right-2-fill:before { content: \"\\ee98\"; }\n.ri-layout-right-2-line:before { content: \"\\ee99\"; }\n.ri-layout-right-fill:before { content: \"\\ee9a\"; }\n.ri-layout-right-line:before { content: \"\\ee9b\"; }\n.ri-layout-row-fill:before { content: \"\\ee9c\"; }\n.ri-layout-row-line:before { content: \"\\ee9d\"; }\n.ri-layout-top-2-fill:before { content: \"\\ee9e\"; }\n.ri-layout-top-2-line:before { content: \"\\ee9f\"; }\n.ri-layout-top-fill:before { content: \"\\eea0\"; }\n.ri-layout-top-line:before { content: \"\\eea1\"; }\n.ri-leaf-fill:before { content: \"\\eea2\"; }\n.ri-leaf-line:before { content: \"\\eea3\"; }\n.ri-lifebuoy-fill:before { content: \"\\eea4\"; }\n.ri-lifebuoy-line:before { content: \"\\eea5\"; }\n.ri-lightbulb-fill:before { content: \"\\eea6\"; }\n.ri-lightbulb-flash-fill:before { content: \"\\eea7\"; }\n.ri-lightbulb-flash-line:before { content: \"\\eea8\"; }\n.ri-lightbulb-line:before { content: \"\\eea9\"; }\n.ri-line-chart-fill:before { content: \"\\eeaa\"; }\n.ri-line-chart-line:before { content: \"\\eeab\"; }\n.ri-line-fill:before { content: \"\\eeac\"; }\n.ri-line-height:before { content: \"\\eead\"; }\n.ri-line-line:before { content: \"\\eeae\"; }\n.ri-link-m:before { content: \"\\eeaf\"; }\n.ri-link-unlink-m:before { content: \"\\eeb0\"; }\n.ri-link-unlink:before { content: \"\\eeb1\"; }\n.ri-link:before { content: \"\\eeb2\"; }\n.ri-linkedin-box-fill:before { content: \"\\eeb3\"; }\n.ri-linkedin-box-line:before { content: \"\\eeb4\"; }\n.ri-linkedin-fill:before { content: \"\\eeb5\"; }\n.ri-linkedin-line:before { content: \"\\eeb6\"; }\n.ri-links-fill:before { content: \"\\eeb7\"; }\n.ri-links-line:before { content: \"\\eeb8\"; }\n.ri-list-check-2:before { content: \"\\eeb9\"; }\n.ri-list-check:before { content: \"\\eeba\"; }\n.ri-list-ordered:before { content: \"\\eebb\"; }\n.ri-list-settings-fill:before { content: \"\\eebc\"; }\n.ri-list-settings-line:before { content: \"\\eebd\"; }\n.ri-list-unordered:before { content: \"\\eebe\"; }\n.ri-live-fill:before { content: \"\\eebf\"; }\n.ri-live-line:before { content: \"\\eec0\"; }\n.ri-loader-2-fill:before { content: \"\\eec1\"; }\n.ri-loader-2-line:before { content: \"\\eec2\"; }\n.ri-loader-3-fill:before { content: \"\\eec3\"; }\n.ri-loader-3-line:before { content: \"\\eec4\"; }\n.ri-loader-4-fill:before { content: \"\\eec5\"; }\n.ri-loader-4-line:before { content: \"\\eec6\"; }\n.ri-loader-5-fill:before { content: \"\\eec7\"; }\n.ri-loader-5-line:before { content: \"\\eec8\"; }\n.ri-loader-fill:before { content: \"\\eec9\"; }\n.ri-loader-line:before { content: \"\\eeca\"; }\n.ri-lock-2-fill:before { content: \"\\eecb\"; }\n.ri-lock-2-line:before { content: \"\\eecc\"; }\n.ri-lock-fill:before { content: \"\\eecd\"; }\n.ri-lock-line:before { content: \"\\eece\"; }\n.ri-lock-password-fill:before { content: \"\\eecf\"; }\n.ri-lock-password-line:before { content: \"\\eed0\"; }\n.ri-lock-unlock-fill:before { content: \"\\eed1\"; }\n.ri-lock-unlock-line:before { content: \"\\eed2\"; }\n.ri-login-box-fill:before { content: \"\\eed3\"; }\n.ri-login-box-line:before { content: \"\\eed4\"; }\n.ri-login-circle-fill:before { content: \"\\eed5\"; }\n.ri-login-circle-line:before { content: \"\\eed6\"; }\n.ri-logout-box-fill:before { content: \"\\eed7\"; }\n.ri-logout-box-line:before { content: \"\\eed8\"; }\n.ri-logout-box-r-fill:before { content: \"\\eed9\"; }\n.ri-logout-box-r-line:before { content: \"\\eeda\"; }\n.ri-logout-circle-fill:before { content: \"\\eedb\"; }\n.ri-logout-circle-line:before { content: \"\\eedc\"; }\n.ri-logout-circle-r-fill:before { content: \"\\eedd\"; }\n.ri-logout-circle-r-line:before { content: \"\\eede\"; }\n.ri-luggage-cart-fill:before { content: \"\\eedf\"; }\n.ri-luggage-cart-line:before { content: \"\\eee0\"; }\n.ri-luggage-deposit-fill:before { content: \"\\eee1\"; }\n.ri-luggage-deposit-line:before { content: \"\\eee2\"; }\n.ri-lungs-fill:before { content: \"\\eee3\"; }\n.ri-lungs-line:before { content: \"\\eee4\"; }\n.ri-mac-fill:before { content: \"\\eee5\"; }\n.ri-mac-line:before { content: \"\\eee6\"; }\n.ri-macbook-fill:before { content: \"\\eee7\"; }\n.ri-macbook-line:before { content: \"\\eee8\"; }\n.ri-magic-fill:before { content: \"\\eee9\"; }\n.ri-magic-line:before { content: \"\\eeea\"; }\n.ri-mail-add-fill:before { content: \"\\eeeb\"; }\n.ri-mail-add-line:before { content: \"\\eeec\"; }\n.ri-mail-check-fill:before { content: \"\\eeed\"; }\n.ri-mail-check-line:before { content: \"\\eeee\"; }\n.ri-mail-close-fill:before { content: \"\\eeef\"; }\n.ri-mail-close-line:before { content: \"\\eef0\"; }\n.ri-mail-download-fill:before { content: \"\\eef1\"; }\n.ri-mail-download-line:before { content: \"\\eef2\"; }\n.ri-mail-fill:before { content: \"\\eef3\"; }\n.ri-mail-forbid-fill:before { content: \"\\eef4\"; }\n.ri-mail-forbid-line:before { content: \"\\eef5\"; }\n.ri-mail-line:before { content: \"\\eef6\"; }\n.ri-mail-lock-fill:before { content: \"\\eef7\"; }\n.ri-mail-lock-line:before { content: \"\\eef8\"; }\n.ri-mail-open-fill:before { content: \"\\eef9\"; }\n.ri-mail-open-line:before { content: \"\\eefa\"; }\n.ri-mail-send-fill:before { content: \"\\eefb\"; }\n.ri-mail-send-line:before { content: \"\\eefc\"; }\n.ri-mail-settings-fill:before { content: \"\\eefd\"; }\n.ri-mail-settings-line:before { content: \"\\eefe\"; }\n.ri-mail-star-fill:before { content: \"\\eeff\"; }\n.ri-mail-star-line:before { content: \"\\ef00\"; }\n.ri-mail-unread-fill:before { content: \"\\ef01\"; }\n.ri-mail-unread-line:before { content: \"\\ef02\"; }\n.ri-mail-volume-fill:before { content: \"\\ef03\"; }\n.ri-mail-volume-line:before { content: \"\\ef04\"; }\n.ri-map-2-fill:before { content: \"\\ef05\"; }\n.ri-map-2-line:before { content: \"\\ef06\"; }\n.ri-map-fill:before { content: \"\\ef07\"; }\n.ri-map-line:before { content: \"\\ef08\"; }\n.ri-map-pin-2-fill:before { content: \"\\ef09\"; }\n.ri-map-pin-2-line:before { content: \"\\ef0a\"; }\n.ri-map-pin-3-fill:before { content: \"\\ef0b\"; }\n.ri-map-pin-3-line:before { content: \"\\ef0c\"; }\n.ri-map-pin-4-fill:before { content: \"\\ef0d\"; }\n.ri-map-pin-4-line:before { content: \"\\ef0e\"; }\n.ri-map-pin-5-fill:before { content: \"\\ef0f\"; }\n.ri-map-pin-5-line:before { content: \"\\ef10\"; }\n.ri-map-pin-add-fill:before { content: \"\\ef11\"; }\n.ri-map-pin-add-line:before { content: \"\\ef12\"; }\n.ri-map-pin-fill:before { content: \"\\ef13\"; }\n.ri-map-pin-line:before { content: \"\\ef14\"; }\n.ri-map-pin-range-fill:before { content: \"\\ef15\"; }\n.ri-map-pin-range-line:before { content: \"\\ef16\"; }\n.ri-map-pin-time-fill:before { content: \"\\ef17\"; }\n.ri-map-pin-time-line:before { content: \"\\ef18\"; }\n.ri-map-pin-user-fill:before { content: \"\\ef19\"; }\n.ri-map-pin-user-line:before { content: \"\\ef1a\"; }\n.ri-mark-pen-fill:before { content: \"\\ef1b\"; }\n.ri-mark-pen-line:before { content: \"\\ef1c\"; }\n.ri-markdown-fill:before { content: \"\\ef1d\"; }\n.ri-markdown-line:before { content: \"\\ef1e\"; }\n.ri-markup-fill:before { content: \"\\ef1f\"; }\n.ri-markup-line:before { content: \"\\ef20\"; }\n.ri-mastercard-fill:before { content: \"\\ef21\"; }\n.ri-mastercard-line:before { content: \"\\ef22\"; }\n.ri-mastodon-fill:before { content: \"\\ef23\"; }\n.ri-mastodon-line:before { content: \"\\ef24\"; }\n.ri-medal-2-fill:before { content: \"\\ef25\"; }\n.ri-medal-2-line:before { content: \"\\ef26\"; }\n.ri-medal-fill:before { content: \"\\ef27\"; }\n.ri-medal-line:before { content: \"\\ef28\"; }\n.ri-medicine-bottle-fill:before { content: \"\\ef29\"; }\n.ri-medicine-bottle-line:before { content: \"\\ef2a\"; }\n.ri-medium-fill:before { content: \"\\ef2b\"; }\n.ri-medium-line:before { content: \"\\ef2c\"; }\n.ri-men-fill:before { content: \"\\ef2d\"; }\n.ri-men-line:before { content: \"\\ef2e\"; }\n.ri-mental-health-fill:before { content: \"\\ef2f\"; }\n.ri-mental-health-line:before { content: \"\\ef30\"; }\n.ri-menu-2-fill:before { content: \"\\ef31\"; }\n.ri-menu-2-line:before { content: \"\\ef32\"; }\n.ri-menu-3-fill:before { content: \"\\ef33\"; }\n.ri-menu-3-line:before { content: \"\\ef34\"; }\n.ri-menu-4-fill:before { content: \"\\ef35\"; }\n.ri-menu-4-line:before { content: \"\\ef36\"; }\n.ri-menu-5-fill:before { content: \"\\ef37\"; }\n.ri-menu-5-line:before { content: \"\\ef38\"; }\n.ri-menu-add-fill:before { content: \"\\ef39\"; }\n.ri-menu-add-line:before { content: \"\\ef3a\"; }\n.ri-menu-fill:before { content: \"\\ef3b\"; }\n.ri-menu-fold-fill:before { content: \"\\ef3c\"; }\n.ri-menu-fold-line:before { content: \"\\ef3d\"; }\n.ri-menu-line:before { content: \"\\ef3e\"; }\n.ri-menu-unfold-fill:before { content: \"\\ef3f\"; }\n.ri-menu-unfold-line:before { content: \"\\ef40\"; }\n.ri-merge-cells-horizontal:before { content: \"\\ef41\"; }\n.ri-merge-cells-vertical:before { content: \"\\ef42\"; }\n.ri-message-2-fill:before { content: \"\\ef43\"; }\n.ri-message-2-line:before { content: \"\\ef44\"; }\n.ri-message-3-fill:before { content: \"\\ef45\"; }\n.ri-message-3-line:before { content: \"\\ef46\"; }\n.ri-message-fill:before { content: \"\\ef47\"; }\n.ri-message-line:before { content: \"\\ef48\"; }\n.ri-messenger-fill:before { content: \"\\ef49\"; }\n.ri-messenger-line:before { content: \"\\ef4a\"; }\n.ri-meteor-fill:before { content: \"\\ef4b\"; }\n.ri-meteor-line:before { content: \"\\ef4c\"; }\n.ri-mic-2-fill:before { content: \"\\ef4d\"; }\n.ri-mic-2-line:before { content: \"\\ef4e\"; }\n.ri-mic-fill:before { content: \"\\ef4f\"; }\n.ri-mic-line:before { content: \"\\ef50\"; }\n.ri-mic-off-fill:before { content: \"\\ef51\"; }\n.ri-mic-off-line:before { content: \"\\ef52\"; }\n.ri-mickey-fill:before { content: \"\\ef53\"; }\n.ri-mickey-line:before { content: \"\\ef54\"; }\n.ri-microscope-fill:before { content: \"\\ef55\"; }\n.ri-microscope-line:before { content: \"\\ef56\"; }\n.ri-microsoft-fill:before { content: \"\\ef57\"; }\n.ri-microsoft-line:before { content: \"\\ef58\"; }\n.ri-mind-map:before { content: \"\\ef59\"; }\n.ri-mini-program-fill:before { content: \"\\ef5a\"; }\n.ri-mini-program-line:before { content: \"\\ef5b\"; }\n.ri-mist-fill:before { content: \"\\ef5c\"; }\n.ri-mist-line:before { content: \"\\ef5d\"; }\n.ri-money-cny-box-fill:before { content: \"\\ef5e\"; }\n.ri-money-cny-box-line:before { content: \"\\ef5f\"; }\n.ri-money-cny-circle-fill:before { content: \"\\ef60\"; }\n.ri-money-cny-circle-line:before { content: \"\\ef61\"; }\n.ri-money-dollar-box-fill:before { content: \"\\ef62\"; }\n.ri-money-dollar-box-line:before { content: \"\\ef63\"; }\n.ri-money-dollar-circle-fill:before { content: \"\\ef64\"; }\n.ri-money-dollar-circle-line:before { content: \"\\ef65\"; }\n.ri-money-euro-box-fill:before { content: \"\\ef66\"; }\n.ri-money-euro-box-line:before { content: \"\\ef67\"; }\n.ri-money-euro-circle-fill:before { content: \"\\ef68\"; }\n.ri-money-euro-circle-line:before { content: \"\\ef69\"; }\n.ri-money-pound-box-fill:before { content: \"\\ef6a\"; }\n.ri-money-pound-box-line:before { content: \"\\ef6b\"; }\n.ri-money-pound-circle-fill:before { content: \"\\ef6c\"; }\n.ri-money-pound-circle-line:before { content: \"\\ef6d\"; }\n.ri-moon-clear-fill:before { content: \"\\ef6e\"; }\n.ri-moon-clear-line:before { content: \"\\ef6f\"; }\n.ri-moon-cloudy-fill:before { content: \"\\ef70\"; }\n.ri-moon-cloudy-line:before { content: \"\\ef71\"; }\n.ri-moon-fill:before { content: \"\\ef72\"; }\n.ri-moon-foggy-fill:before { content: \"\\ef73\"; }\n.ri-moon-foggy-line:before { content: \"\\ef74\"; }\n.ri-moon-line:before { content: \"\\ef75\"; }\n.ri-more-2-fill:before { content: \"\\ef76\"; }\n.ri-more-2-line:before { content: \"\\ef77\"; }\n.ri-more-fill:before { content: \"\\ef78\"; }\n.ri-more-line:before { content: \"\\ef79\"; }\n.ri-motorbike-fill:before { content: \"\\ef7a\"; }\n.ri-motorbike-line:before { content: \"\\ef7b\"; }\n.ri-mouse-fill:before { content: \"\\ef7c\"; }\n.ri-mouse-line:before { content: \"\\ef7d\"; }\n.ri-movie-2-fill:before { content: \"\\ef7e\"; }\n.ri-movie-2-line:before { content: \"\\ef7f\"; }\n.ri-movie-fill:before { content: \"\\ef80\"; }\n.ri-movie-line:before { content: \"\\ef81\"; }\n.ri-music-2-fill:before { content: \"\\ef82\"; }\n.ri-music-2-line:before { content: \"\\ef83\"; }\n.ri-music-fill:before { content: \"\\ef84\"; }\n.ri-music-line:before { content: \"\\ef85\"; }\n.ri-mv-fill:before { content: \"\\ef86\"; }\n.ri-mv-line:before { content: \"\\ef87\"; }\n.ri-navigation-fill:before { content: \"\\ef88\"; }\n.ri-navigation-line:before { content: \"\\ef89\"; }\n.ri-netease-cloud-music-fill:before { content: \"\\ef8a\"; }\n.ri-netease-cloud-music-line:before { content: \"\\ef8b\"; }\n.ri-netflix-fill:before { content: \"\\ef8c\"; }\n.ri-netflix-line:before { content: \"\\ef8d\"; }\n.ri-newspaper-fill:before { content: \"\\ef8e\"; }\n.ri-newspaper-line:before { content: \"\\ef8f\"; }\n.ri-node-tree:before { content: \"\\ef90\"; }\n.ri-notification-2-fill:before { content: \"\\ef91\"; }\n.ri-notification-2-line:before { content: \"\\ef92\"; }\n.ri-notification-3-fill:before { content: \"\\ef93\"; }\n.ri-notification-3-line:before { content: \"\\ef94\"; }\n.ri-notification-4-fill:before { content: \"\\ef95\"; }\n.ri-notification-4-line:before { content: \"\\ef96\"; }\n.ri-notification-badge-fill:before { content: \"\\ef97\"; }\n.ri-notification-badge-line:before { content: \"\\ef98\"; }\n.ri-notification-fill:before { content: \"\\ef99\"; }\n.ri-notification-line:before { content: \"\\ef9a\"; }\n.ri-notification-off-fill:before { content: \"\\ef9b\"; }\n.ri-notification-off-line:before { content: \"\\ef9c\"; }\n.ri-npmjs-fill:before { content: \"\\ef9d\"; }\n.ri-npmjs-line:before { content: \"\\ef9e\"; }\n.ri-number-0:before { content: \"\\ef9f\"; }\n.ri-number-1:before { content: \"\\efa0\"; }\n.ri-number-2:before { content: \"\\efa1\"; }\n.ri-number-3:before { content: \"\\efa2\"; }\n.ri-number-4:before { content: \"\\efa3\"; }\n.ri-number-5:before { content: \"\\efa4\"; }\n.ri-number-6:before { content: \"\\efa5\"; }\n.ri-number-7:before { content: \"\\efa6\"; }\n.ri-number-8:before { content: \"\\efa7\"; }\n.ri-number-9:before { content: \"\\efa8\"; }\n.ri-numbers-fill:before { content: \"\\efa9\"; }\n.ri-numbers-line:before { content: \"\\efaa\"; }\n.ri-nurse-fill:before { content: \"\\efab\"; }\n.ri-nurse-line:before { content: \"\\efac\"; }\n.ri-oil-fill:before { content: \"\\efad\"; }\n.ri-oil-line:before { content: \"\\efae\"; }\n.ri-omega:before { content: \"\\efaf\"; }\n.ri-open-arm-fill:before { content: \"\\efb0\"; }\n.ri-open-arm-line:before { content: \"\\efb1\"; }\n.ri-open-source-fill:before { content: \"\\efb2\"; }\n.ri-open-source-line:before { content: \"\\efb3\"; }\n.ri-opera-fill:before { content: \"\\efb4\"; }\n.ri-opera-line:before { content: \"\\efb5\"; }\n.ri-order-play-fill:before { content: \"\\efb6\"; }\n.ri-order-play-line:before { content: \"\\efb7\"; }\n.ri-organization-chart:before { content: \"\\efb8\"; }\n.ri-outlet-2-fill:before { content: \"\\efb9\"; }\n.ri-outlet-2-line:before { content: \"\\efba\"; }\n.ri-outlet-fill:before { content: \"\\efbb\"; }\n.ri-outlet-line:before { content: \"\\efbc\"; }\n.ri-page-separator:before { content: \"\\efbd\"; }\n.ri-pages-fill:before { content: \"\\efbe\"; }\n.ri-pages-line:before { content: \"\\efbf\"; }\n.ri-paint-brush-fill:before { content: \"\\efc0\"; }\n.ri-paint-brush-line:before { content: \"\\efc1\"; }\n.ri-paint-fill:before { content: \"\\efc2\"; }\n.ri-paint-line:before { content: \"\\efc3\"; }\n.ri-palette-fill:before { content: \"\\efc4\"; }\n.ri-palette-line:before { content: \"\\efc5\"; }\n.ri-pantone-fill:before { content: \"\\efc6\"; }\n.ri-pantone-line:before { content: \"\\efc7\"; }\n.ri-paragraph:before { content: \"\\efc8\"; }\n.ri-parent-fill:before { content: \"\\efc9\"; }\n.ri-parent-line:before { content: \"\\efca\"; }\n.ri-parentheses-fill:before { content: \"\\efcb\"; }\n.ri-parentheses-line:before { content: \"\\efcc\"; }\n.ri-parking-box-fill:before { content: \"\\efcd\"; }\n.ri-parking-box-line:before { content: \"\\efce\"; }\n.ri-parking-fill:before { content: \"\\efcf\"; }\n.ri-parking-line:before { content: \"\\efd0\"; }\n.ri-passport-fill:before { content: \"\\efd1\"; }\n.ri-passport-line:before { content: \"\\efd2\"; }\n.ri-patreon-fill:before { content: \"\\efd3\"; }\n.ri-patreon-line:before { content: \"\\efd4\"; }\n.ri-pause-circle-fill:before { content: \"\\efd5\"; }\n.ri-pause-circle-line:before { content: \"\\efd6\"; }\n.ri-pause-fill:before { content: \"\\efd7\"; }\n.ri-pause-line:before { content: \"\\efd8\"; }\n.ri-pause-mini-fill:before { content: \"\\efd9\"; }\n.ri-pause-mini-line:before { content: \"\\efda\"; }\n.ri-paypal-fill:before { content: \"\\efdb\"; }\n.ri-paypal-line:before { content: \"\\efdc\"; }\n.ri-pen-nib-fill:before { content: \"\\efdd\"; }\n.ri-pen-nib-line:before { content: \"\\efde\"; }\n.ri-pencil-fill:before { content: \"\\efdf\"; }\n.ri-pencil-line:before { content: \"\\efe0\"; }\n.ri-pencil-ruler-2-fill:before { content: \"\\efe1\"; }\n.ri-pencil-ruler-2-line:before { content: \"\\efe2\"; }\n.ri-pencil-ruler-fill:before { content: \"\\efe3\"; }\n.ri-pencil-ruler-line:before { content: \"\\efe4\"; }\n.ri-percent-fill:before { content: \"\\efe5\"; }\n.ri-percent-line:before { content: \"\\efe6\"; }\n.ri-phone-camera-fill:before { content: \"\\efe7\"; }\n.ri-phone-camera-line:before { content: \"\\efe8\"; }\n.ri-phone-fill:before { content: \"\\efe9\"; }\n.ri-phone-find-fill:before { content: \"\\efea\"; }\n.ri-phone-find-line:before { content: \"\\efeb\"; }\n.ri-phone-line:before { content: \"\\efec\"; }\n.ri-phone-lock-fill:before { content: \"\\efed\"; }\n.ri-phone-lock-line:before { content: \"\\efee\"; }\n.ri-picture-in-picture-2-fill:before { content: \"\\efef\"; }\n.ri-picture-in-picture-2-line:before { content: \"\\eff0\"; }\n.ri-picture-in-picture-exit-fill:before { content: \"\\eff1\"; }\n.ri-picture-in-picture-exit-line:before { content: \"\\eff2\"; }\n.ri-picture-in-picture-fill:before { content: \"\\eff3\"; }\n.ri-picture-in-picture-line:before { content: \"\\eff4\"; }\n.ri-pie-chart-2-fill:before { content: \"\\eff5\"; }\n.ri-pie-chart-2-line:before { content: \"\\eff6\"; }\n.ri-pie-chart-box-fill:before { content: \"\\eff7\"; }\n.ri-pie-chart-box-line:before { content: \"\\eff8\"; }\n.ri-pie-chart-fill:before { content: \"\\eff9\"; }\n.ri-pie-chart-line:before { content: \"\\effa\"; }\n.ri-pin-distance-fill:before { content: \"\\effb\"; }\n.ri-pin-distance-line:before { content: \"\\effc\"; }\n.ri-ping-pong-fill:before { content: \"\\effd\"; }\n.ri-ping-pong-line:before { content: \"\\effe\"; }\n.ri-pinterest-fill:before { content: \"\\efff\"; }\n.ri-pinterest-line:before { content: \"\\f000\"; }\n.ri-pinyin-input:before { content: \"\\f001\"; }\n.ri-pixelfed-fill:before { content: \"\\f002\"; }\n.ri-pixelfed-line:before { content: \"\\f003\"; }\n.ri-plane-fill:before { content: \"\\f004\"; }\n.ri-plane-line:before { content: \"\\f005\"; }\n.ri-plant-fill:before { content: \"\\f006\"; }\n.ri-plant-line:before { content: \"\\f007\"; }\n.ri-play-circle-fill:before { content: \"\\f008\"; }\n.ri-play-circle-line:before { content: \"\\f009\"; }\n.ri-play-fill:before { content: \"\\f00a\"; }\n.ri-play-line:before { content: \"\\f00b\"; }\n.ri-play-list-2-fill:before { content: \"\\f00c\"; }\n.ri-play-list-2-line:before { content: \"\\f00d\"; }\n.ri-play-list-add-fill:before { content: \"\\f00e\"; }\n.ri-play-list-add-line:before { content: \"\\f00f\"; }\n.ri-play-list-fill:before { content: \"\\f010\"; }\n.ri-play-list-line:before { content: \"\\f011\"; }\n.ri-play-mini-fill:before { content: \"\\f012\"; }\n.ri-play-mini-line:before { content: \"\\f013\"; }\n.ri-playstation-fill:before { content: \"\\f014\"; }\n.ri-playstation-line:before { content: \"\\f015\"; }\n.ri-plug-2-fill:before { content: \"\\f016\"; }\n.ri-plug-2-line:before { content: \"\\f017\"; }\n.ri-plug-fill:before { content: \"\\f018\"; }\n.ri-plug-line:before { content: \"\\f019\"; }\n.ri-polaroid-2-fill:before { content: \"\\f01a\"; }\n.ri-polaroid-2-line:before { content: \"\\f01b\"; }\n.ri-polaroid-fill:before { content: \"\\f01c\"; }\n.ri-polaroid-line:before { content: \"\\f01d\"; }\n.ri-police-car-fill:before { content: \"\\f01e\"; }\n.ri-police-car-line:before { content: \"\\f01f\"; }\n.ri-price-tag-2-fill:before { content: \"\\f020\"; }\n.ri-price-tag-2-line:before { content: \"\\f021\"; }\n.ri-price-tag-3-fill:before { content: \"\\f022\"; }\n.ri-price-tag-3-line:before { content: \"\\f023\"; }\n.ri-price-tag-fill:before { content: \"\\f024\"; }\n.ri-price-tag-line:before { content: \"\\f025\"; }\n.ri-printer-cloud-fill:before { content: \"\\f026\"; }\n.ri-printer-cloud-line:before { content: \"\\f027\"; }\n.ri-printer-fill:before { content: \"\\f028\"; }\n.ri-printer-line:before { content: \"\\f029\"; }\n.ri-product-hunt-fill:before { content: \"\\f02a\"; }\n.ri-product-hunt-line:before { content: \"\\f02b\"; }\n.ri-profile-fill:before { content: \"\\f02c\"; }\n.ri-profile-line:before { content: \"\\f02d\"; }\n.ri-projector-2-fill:before { content: \"\\f02e\"; }\n.ri-projector-2-line:before { content: \"\\f02f\"; }\n.ri-projector-fill:before { content: \"\\f030\"; }\n.ri-projector-line:before { content: \"\\f031\"; }\n.ri-psychotherapy-fill:before { content: \"\\f032\"; }\n.ri-psychotherapy-line:before { content: \"\\f033\"; }\n.ri-pulse-fill:before { content: \"\\f034\"; }\n.ri-pulse-line:before { content: \"\\f035\"; }\n.ri-pushpin-2-fill:before { content: \"\\f036\"; }\n.ri-pushpin-2-line:before { content: \"\\f037\"; }\n.ri-pushpin-fill:before { content: \"\\f038\"; }\n.ri-pushpin-line:before { content: \"\\f039\"; }\n.ri-qq-fill:before { content: \"\\f03a\"; }\n.ri-qq-line:before { content: \"\\f03b\"; }\n.ri-qr-code-fill:before { content: \"\\f03c\"; }\n.ri-qr-code-line:before { content: \"\\f03d\"; }\n.ri-qr-scan-2-fill:before { content: \"\\f03e\"; }\n.ri-qr-scan-2-line:before { content: \"\\f03f\"; }\n.ri-qr-scan-fill:before { content: \"\\f040\"; }\n.ri-qr-scan-line:before { content: \"\\f041\"; }\n.ri-question-answer-fill:before { content: \"\\f042\"; }\n.ri-question-answer-line:before { content: \"\\f043\"; }\n.ri-question-fill:before { content: \"\\f044\"; }\n.ri-question-line:before { content: \"\\f045\"; }\n.ri-question-mark:before { content: \"\\f046\"; }\n.ri-questionnaire-fill:before { content: \"\\f047\"; }\n.ri-questionnaire-line:before { content: \"\\f048\"; }\n.ri-quill-pen-fill:before { content: \"\\f049\"; }\n.ri-quill-pen-line:before { content: \"\\f04a\"; }\n.ri-radar-fill:before { content: \"\\f04b\"; }\n.ri-radar-line:before { content: \"\\f04c\"; }\n.ri-radio-2-fill:before { content: \"\\f04d\"; }\n.ri-radio-2-line:before { content: \"\\f04e\"; }\n.ri-radio-button-fill:before { content: \"\\f04f\"; }\n.ri-radio-button-line:before { content: \"\\f050\"; }\n.ri-radio-fill:before { content: \"\\f051\"; }\n.ri-radio-line:before { content: \"\\f052\"; }\n.ri-rainbow-fill:before { content: \"\\f053\"; }\n.ri-rainbow-line:before { content: \"\\f054\"; }\n.ri-rainy-fill:before { content: \"\\f055\"; }\n.ri-rainy-line:before { content: \"\\f056\"; }\n.ri-reactjs-fill:before { content: \"\\f057\"; }\n.ri-reactjs-line:before { content: \"\\f058\"; }\n.ri-record-circle-fill:before { content: \"\\f059\"; }\n.ri-record-circle-line:before { content: \"\\f05a\"; }\n.ri-record-mail-fill:before { content: \"\\f05b\"; }\n.ri-record-mail-line:before { content: \"\\f05c\"; }\n.ri-recycle-fill:before { content: \"\\f05d\"; }\n.ri-recycle-line:before { content: \"\\f05e\"; }\n.ri-red-packet-fill:before { content: \"\\f05f\"; }\n.ri-red-packet-line:before { content: \"\\f060\"; }\n.ri-reddit-fill:before { content: \"\\f061\"; }\n.ri-reddit-line:before { content: \"\\f062\"; }\n.ri-refresh-fill:before { content: \"\\f063\"; }\n.ri-refresh-line:before { content: \"\\f064\"; }\n.ri-refund-2-fill:before { content: \"\\f065\"; }\n.ri-refund-2-line:before { content: \"\\f066\"; }\n.ri-refund-fill:before { content: \"\\f067\"; }\n.ri-refund-line:before { content: \"\\f068\"; }\n.ri-registered-fill:before { content: \"\\f069\"; }\n.ri-registered-line:before { content: \"\\f06a\"; }\n.ri-remixicon-fill:before { content: \"\\f06b\"; }\n.ri-remixicon-line:before { content: \"\\f06c\"; }\n.ri-remote-control-2-fill:before { content: \"\\f06d\"; }\n.ri-remote-control-2-line:before { content: \"\\f06e\"; }\n.ri-remote-control-fill:before { content: \"\\f06f\"; }\n.ri-remote-control-line:before { content: \"\\f070\"; }\n.ri-repeat-2-fill:before { content: \"\\f071\"; }\n.ri-repeat-2-line:before { content: \"\\f072\"; }\n.ri-repeat-fill:before { content: \"\\f073\"; }\n.ri-repeat-line:before { content: \"\\f074\"; }\n.ri-repeat-one-fill:before { content: \"\\f075\"; }\n.ri-repeat-one-line:before { content: \"\\f076\"; }\n.ri-reply-all-fill:before { content: \"\\f077\"; }\n.ri-reply-all-line:before { content: \"\\f078\"; }\n.ri-reply-fill:before { content: \"\\f079\"; }\n.ri-reply-line:before { content: \"\\f07a\"; }\n.ri-reserved-fill:before { content: \"\\f07b\"; }\n.ri-reserved-line:before { content: \"\\f07c\"; }\n.ri-rest-time-fill:before { content: \"\\f07d\"; }\n.ri-rest-time-line:before { content: \"\\f07e\"; }\n.ri-restart-fill:before { content: \"\\f07f\"; }\n.ri-restart-line:before { content: \"\\f080\"; }\n.ri-restaurant-2-fill:before { content: \"\\f081\"; }\n.ri-restaurant-2-line:before { content: \"\\f082\"; }\n.ri-restaurant-fill:before { content: \"\\f083\"; }\n.ri-restaurant-line:before { content: \"\\f084\"; }\n.ri-rewind-fill:before { content: \"\\f085\"; }\n.ri-rewind-line:before { content: \"\\f086\"; }\n.ri-rewind-mini-fill:before { content: \"\\f087\"; }\n.ri-rewind-mini-line:before { content: \"\\f088\"; }\n.ri-rhythm-fill:before { content: \"\\f089\"; }\n.ri-rhythm-line:before { content: \"\\f08a\"; }\n.ri-riding-fill:before { content: \"\\f08b\"; }\n.ri-riding-line:before { content: \"\\f08c\"; }\n.ri-road-map-fill:before { content: \"\\f08d\"; }\n.ri-road-map-line:before { content: \"\\f08e\"; }\n.ri-roadster-fill:before { content: \"\\f08f\"; }\n.ri-roadster-line:before { content: \"\\f090\"; }\n.ri-robot-fill:before { content: \"\\f091\"; }\n.ri-robot-line:before { content: \"\\f092\"; }\n.ri-rocket-2-fill:before { content: \"\\f093\"; }\n.ri-rocket-2-line:before { content: \"\\f094\"; }\n.ri-rocket-fill:before { content: \"\\f095\"; }\n.ri-rocket-line:before { content: \"\\f096\"; }\n.ri-rotate-lock-fill:before { content: \"\\f097\"; }\n.ri-rotate-lock-line:before { content: \"\\f098\"; }\n.ri-rounded-corner:before { content: \"\\f099\"; }\n.ri-route-fill:before { content: \"\\f09a\"; }\n.ri-route-line:before { content: \"\\f09b\"; }\n.ri-router-fill:before { content: \"\\f09c\"; }\n.ri-router-line:before { content: \"\\f09d\"; }\n.ri-rss-fill:before { content: \"\\f09e\"; }\n.ri-rss-line:before { content: \"\\f09f\"; }\n.ri-ruler-2-fill:before { content: \"\\f0a0\"; }\n.ri-ruler-2-line:before { content: \"\\f0a1\"; }\n.ri-ruler-fill:before { content: \"\\f0a2\"; }\n.ri-ruler-line:before { content: \"\\f0a3\"; }\n.ri-run-fill:before { content: \"\\f0a4\"; }\n.ri-run-line:before { content: \"\\f0a5\"; }\n.ri-safari-fill:before { content: \"\\f0a6\"; }\n.ri-safari-line:before { content: \"\\f0a7\"; }\n.ri-safe-2-fill:before { content: \"\\f0a8\"; }\n.ri-safe-2-line:before { content: \"\\f0a9\"; }\n.ri-safe-fill:before { content: \"\\f0aa\"; }\n.ri-safe-line:before { content: \"\\f0ab\"; }\n.ri-sailboat-fill:before { content: \"\\f0ac\"; }\n.ri-sailboat-line:before { content: \"\\f0ad\"; }\n.ri-save-2-fill:before { content: \"\\f0ae\"; }\n.ri-save-2-line:before { content: \"\\f0af\"; }\n.ri-save-3-fill:before { content: \"\\f0b0\"; }\n.ri-save-3-line:before { content: \"\\f0b1\"; }\n.ri-save-fill:before { content: \"\\f0b2\"; }\n.ri-save-line:before { content: \"\\f0b3\"; }\n.ri-scales-2-fill:before { content: \"\\f0b4\"; }\n.ri-scales-2-line:before { content: \"\\f0b5\"; }\n.ri-scales-3-fill:before { content: \"\\f0b6\"; }\n.ri-scales-3-line:before { content: \"\\f0b7\"; }\n.ri-scales-fill:before { content: \"\\f0b8\"; }\n.ri-scales-line:before { content: \"\\f0b9\"; }\n.ri-scan-2-fill:before { content: \"\\f0ba\"; }\n.ri-scan-2-line:before { content: \"\\f0bb\"; }\n.ri-scan-fill:before { content: \"\\f0bc\"; }\n.ri-scan-line:before { content: \"\\f0bd\"; }\n.ri-scissors-2-fill:before { content: \"\\f0be\"; }\n.ri-scissors-2-line:before { content: \"\\f0bf\"; }\n.ri-scissors-cut-fill:before { content: \"\\f0c0\"; }\n.ri-scissors-cut-line:before { content: \"\\f0c1\"; }\n.ri-scissors-fill:before { content: \"\\f0c2\"; }\n.ri-scissors-line:before { content: \"\\f0c3\"; }\n.ri-screenshot-2-fill:before { content: \"\\f0c4\"; }\n.ri-screenshot-2-line:before { content: \"\\f0c5\"; }\n.ri-screenshot-fill:before { content: \"\\f0c6\"; }\n.ri-screenshot-line:before { content: \"\\f0c7\"; }\n.ri-sd-card-fill:before { content: \"\\f0c8\"; }\n.ri-sd-card-line:before { content: \"\\f0c9\"; }\n.ri-sd-card-mini-fill:before { content: \"\\f0ca\"; }\n.ri-sd-card-mini-line:before { content: \"\\f0cb\"; }\n.ri-search-2-fill:before { content: \"\\f0cc\"; }\n.ri-search-2-line:before { content: \"\\f0cd\"; }\n.ri-search-eye-fill:before { content: \"\\f0ce\"; }\n.ri-search-eye-line:before { content: \"\\f0cf\"; }\n.ri-search-fill:before { content: \"\\f0d0\"; }\n.ri-search-line:before { content: \"\\f0d1\"; }\n.ri-secure-payment-fill:before { content: \"\\f0d2\"; }\n.ri-secure-payment-line:before { content: \"\\f0d3\"; }\n.ri-seedling-fill:before { content: \"\\f0d4\"; }\n.ri-seedling-line:before { content: \"\\f0d5\"; }\n.ri-send-backward:before { content: \"\\f0d6\"; }\n.ri-send-plane-2-fill:before { content: \"\\f0d7\"; }\n.ri-send-plane-2-line:before { content: \"\\f0d8\"; }\n.ri-send-plane-fill:before { content: \"\\f0d9\"; }\n.ri-send-plane-line:before { content: \"\\f0da\"; }\n.ri-send-to-back:before { content: \"\\f0db\"; }\n.ri-sensor-fill:before { content: \"\\f0dc\"; }\n.ri-sensor-line:before { content: \"\\f0dd\"; }\n.ri-separator:before { content: \"\\f0de\"; }\n.ri-server-fill:before { content: \"\\f0df\"; }\n.ri-server-line:before { content: \"\\f0e0\"; }\n.ri-service-fill:before { content: \"\\f0e1\"; }\n.ri-service-line:before { content: \"\\f0e2\"; }\n.ri-settings-2-fill:before { content: \"\\f0e3\"; }\n.ri-settings-2-line:before { content: \"\\f0e4\"; }\n.ri-settings-3-fill:before { content: \"\\f0e5\"; }\n.ri-settings-3-line:before { content: \"\\f0e6\"; }\n.ri-settings-4-fill:before { content: \"\\f0e7\"; }\n.ri-settings-4-line:before { content: \"\\f0e8\"; }\n.ri-settings-5-fill:before { content: \"\\f0e9\"; }\n.ri-settings-5-line:before { content: \"\\f0ea\"; }\n.ri-settings-6-fill:before { content: \"\\f0eb\"; }\n.ri-settings-6-line:before { content: \"\\f0ec\"; }\n.ri-settings-fill:before { content: \"\\f0ed\"; }\n.ri-settings-line:before { content: \"\\f0ee\"; }\n.ri-shape-2-fill:before { content: \"\\f0ef\"; }\n.ri-shape-2-line:before { content: \"\\f0f0\"; }\n.ri-shape-fill:before { content: \"\\f0f1\"; }\n.ri-shape-line:before { content: \"\\f0f2\"; }\n.ri-share-box-fill:before { content: \"\\f0f3\"; }\n.ri-share-box-line:before { content: \"\\f0f4\"; }\n.ri-share-circle-fill:before { content: \"\\f0f5\"; }\n.ri-share-circle-line:before { content: \"\\f0f6\"; }\n.ri-share-fill:before { content: \"\\f0f7\"; }\n.ri-share-forward-2-fill:before { content: \"\\f0f8\"; }\n.ri-share-forward-2-line:before { content: \"\\f0f9\"; }\n.ri-share-forward-box-fill:before { content: \"\\f0fa\"; }\n.ri-share-forward-box-line:before { content: \"\\f0fb\"; }\n.ri-share-forward-fill:before { content: \"\\f0fc\"; }\n.ri-share-forward-line:before { content: \"\\f0fd\"; }\n.ri-share-line:before { content: \"\\f0fe\"; }\n.ri-shield-check-fill:before { content: \"\\f0ff\"; }\n.ri-shield-check-line:before { content: \"\\f100\"; }\n.ri-shield-cross-fill:before { content: \"\\f101\"; }\n.ri-shield-cross-line:before { content: \"\\f102\"; }\n.ri-shield-fill:before { content: \"\\f103\"; }\n.ri-shield-flash-fill:before { content: \"\\f104\"; }\n.ri-shield-flash-line:before { content: \"\\f105\"; }\n.ri-shield-keyhole-fill:before { content: \"\\f106\"; }\n.ri-shield-keyhole-line:before { content: \"\\f107\"; }\n.ri-shield-line:before { content: \"\\f108\"; }\n.ri-shield-star-fill:before { content: \"\\f109\"; }\n.ri-shield-star-line:before { content: \"\\f10a\"; }\n.ri-shield-user-fill:before { content: \"\\f10b\"; }\n.ri-shield-user-line:before { content: \"\\f10c\"; }\n.ri-ship-2-fill:before { content: \"\\f10d\"; }\n.ri-ship-2-line:before { content: \"\\f10e\"; }\n.ri-ship-fill:before { content: \"\\f10f\"; }\n.ri-ship-line:before { content: \"\\f110\"; }\n.ri-shirt-fill:before { content: \"\\f111\"; }\n.ri-shirt-line:before { content: \"\\f112\"; }\n.ri-shopping-bag-2-fill:before { content: \"\\f113\"; }\n.ri-shopping-bag-2-line:before { content: \"\\f114\"; }\n.ri-shopping-bag-3-fill:before { content: \"\\f115\"; }\n.ri-shopping-bag-3-line:before { content: \"\\f116\"; }\n.ri-shopping-bag-fill:before { content: \"\\f117\"; }\n.ri-shopping-bag-line:before { content: \"\\f118\"; }\n.ri-shopping-basket-2-fill:before { content: \"\\f119\"; }\n.ri-shopping-basket-2-line:before { content: \"\\f11a\"; }\n.ri-shopping-basket-fill:before { content: \"\\f11b\"; }\n.ri-shopping-basket-line:before { content: \"\\f11c\"; }\n.ri-shopping-cart-2-fill:before { content: \"\\f11d\"; }\n.ri-shopping-cart-2-line:before { content: \"\\f11e\"; }\n.ri-shopping-cart-fill:before { content: \"\\f11f\"; }\n.ri-shopping-cart-line:before { content: \"\\f120\"; }\n.ri-showers-fill:before { content: \"\\f121\"; }\n.ri-showers-line:before { content: \"\\f122\"; }\n.ri-shuffle-fill:before { content: \"\\f123\"; }\n.ri-shuffle-line:before { content: \"\\f124\"; }\n.ri-shut-down-fill:before { content: \"\\f125\"; }\n.ri-shut-down-line:before { content: \"\\f126\"; }\n.ri-side-bar-fill:before { content: \"\\f127\"; }\n.ri-side-bar-line:before { content: \"\\f128\"; }\n.ri-signal-tower-fill:before { content: \"\\f129\"; }\n.ri-signal-tower-line:before { content: \"\\f12a\"; }\n.ri-signal-wifi-1-fill:before { content: \"\\f12b\"; }\n.ri-signal-wifi-1-line:before { content: \"\\f12c\"; }\n.ri-signal-wifi-2-fill:before { content: \"\\f12d\"; }\n.ri-signal-wifi-2-line:before { content: \"\\f12e\"; }\n.ri-signal-wifi-3-fill:before { content: \"\\f12f\"; }\n.ri-signal-wifi-3-line:before { content: \"\\f130\"; }\n.ri-signal-wifi-error-fill:before { content: \"\\f131\"; }\n.ri-signal-wifi-error-line:before { content: \"\\f132\"; }\n.ri-signal-wifi-fill:before { content: \"\\f133\"; }\n.ri-signal-wifi-line:before { content: \"\\f134\"; }\n.ri-signal-wifi-off-fill:before { content: \"\\f135\"; }\n.ri-signal-wifi-off-line:before { content: \"\\f136\"; }\n.ri-sim-card-2-fill:before { content: \"\\f137\"; }\n.ri-sim-card-2-line:before { content: \"\\f138\"; }\n.ri-sim-card-fill:before { content: \"\\f139\"; }\n.ri-sim-card-line:before { content: \"\\f13a\"; }\n.ri-single-quotes-l:before { content: \"\\f13b\"; }\n.ri-single-quotes-r:before { content: \"\\f13c\"; }\n.ri-sip-fill:before { content: \"\\f13d\"; }\n.ri-sip-line:before { content: \"\\f13e\"; }\n.ri-skip-back-fill:before { content: \"\\f13f\"; }\n.ri-skip-back-line:before { content: \"\\f140\"; }\n.ri-skip-back-mini-fill:before { content: \"\\f141\"; }\n.ri-skip-back-mini-line:before { content: \"\\f142\"; }\n.ri-skip-forward-fill:before { content: \"\\f143\"; }\n.ri-skip-forward-line:before { content: \"\\f144\"; }\n.ri-skip-forward-mini-fill:before { content: \"\\f145\"; }\n.ri-skip-forward-mini-line:before { content: \"\\f146\"; }\n.ri-skull-2-fill:before { content: \"\\f147\"; }\n.ri-skull-2-line:before { content: \"\\f148\"; }\n.ri-skull-fill:before { content: \"\\f149\"; }\n.ri-skull-line:before { content: \"\\f14a\"; }\n.ri-skype-fill:before { content: \"\\f14b\"; }\n.ri-skype-line:before { content: \"\\f14c\"; }\n.ri-slack-fill:before { content: \"\\f14d\"; }\n.ri-slack-line:before { content: \"\\f14e\"; }\n.ri-slice-fill:before { content: \"\\f14f\"; }\n.ri-slice-line:before { content: \"\\f150\"; }\n.ri-slideshow-2-fill:before { content: \"\\f151\"; }\n.ri-slideshow-2-line:before { content: \"\\f152\"; }\n.ri-slideshow-3-fill:before { content: \"\\f153\"; }\n.ri-slideshow-3-line:before { content: \"\\f154\"; }\n.ri-slideshow-4-fill:before { content: \"\\f155\"; }\n.ri-slideshow-4-line:before { content: \"\\f156\"; }\n.ri-slideshow-fill:before { content: \"\\f157\"; }\n.ri-slideshow-line:before { content: \"\\f158\"; }\n.ri-smartphone-fill:before { content: \"\\f159\"; }\n.ri-smartphone-line:before { content: \"\\f15a\"; }\n.ri-snapchat-fill:before { content: \"\\f15b\"; }\n.ri-snapchat-line:before { content: \"\\f15c\"; }\n.ri-snowy-fill:before { content: \"\\f15d\"; }\n.ri-snowy-line:before { content: \"\\f15e\"; }\n.ri-sort-asc:before { content: \"\\f15f\"; }\n.ri-sort-desc:before { content: \"\\f160\"; }\n.ri-sound-module-fill:before { content: \"\\f161\"; }\n.ri-sound-module-line:before { content: \"\\f162\"; }\n.ri-soundcloud-fill:before { content: \"\\f163\"; }\n.ri-soundcloud-line:before { content: \"\\f164\"; }\n.ri-space-ship-fill:before { content: \"\\f165\"; }\n.ri-space-ship-line:before { content: \"\\f166\"; }\n.ri-space:before { content: \"\\f167\"; }\n.ri-spam-2-fill:before { content: \"\\f168\"; }\n.ri-spam-2-line:before { content: \"\\f169\"; }\n.ri-spam-3-fill:before { content: \"\\f16a\"; }\n.ri-spam-3-line:before { content: \"\\f16b\"; }\n.ri-spam-fill:before { content: \"\\f16c\"; }\n.ri-spam-line:before { content: \"\\f16d\"; }\n.ri-speaker-2-fill:before { content: \"\\f16e\"; }\n.ri-speaker-2-line:before { content: \"\\f16f\"; }\n.ri-speaker-3-fill:before { content: \"\\f170\"; }\n.ri-speaker-3-line:before { content: \"\\f171\"; }\n.ri-speaker-fill:before { content: \"\\f172\"; }\n.ri-speaker-line:before { content: \"\\f173\"; }\n.ri-spectrum-fill:before { content: \"\\f174\"; }\n.ri-spectrum-line:before { content: \"\\f175\"; }\n.ri-speed-fill:before { content: \"\\f176\"; }\n.ri-speed-line:before { content: \"\\f177\"; }\n.ri-speed-mini-fill:before { content: \"\\f178\"; }\n.ri-speed-mini-line:before { content: \"\\f179\"; }\n.ri-split-cells-horizontal:before { content: \"\\f17a\"; }\n.ri-split-cells-vertical:before { content: \"\\f17b\"; }\n.ri-spotify-fill:before { content: \"\\f17c\"; }\n.ri-spotify-line:before { content: \"\\f17d\"; }\n.ri-spy-fill:before { content: \"\\f17e\"; }\n.ri-spy-line:before { content: \"\\f17f\"; }\n.ri-stack-fill:before { content: \"\\f180\"; }\n.ri-stack-line:before { content: \"\\f181\"; }\n.ri-stack-overflow-fill:before { content: \"\\f182\"; }\n.ri-stack-overflow-line:before { content: \"\\f183\"; }\n.ri-stackshare-fill:before { content: \"\\f184\"; }\n.ri-stackshare-line:before { content: \"\\f185\"; }\n.ri-star-fill:before { content: \"\\f186\"; }\n.ri-star-half-fill:before { content: \"\\f187\"; }\n.ri-star-half-line:before { content: \"\\f188\"; }\n.ri-star-half-s-fill:before { content: \"\\f189\"; }\n.ri-star-half-s-line:before { content: \"\\f18a\"; }\n.ri-star-line:before { content: \"\\f18b\"; }\n.ri-star-s-fill:before { content: \"\\f18c\"; }\n.ri-star-s-line:before { content: \"\\f18d\"; }\n.ri-star-smile-fill:before { content: \"\\f18e\"; }\n.ri-star-smile-line:before { content: \"\\f18f\"; }\n.ri-steam-fill:before { content: \"\\f190\"; }\n.ri-steam-line:before { content: \"\\f191\"; }\n.ri-steering-2-fill:before { content: \"\\f192\"; }\n.ri-steering-2-line:before { content: \"\\f193\"; }\n.ri-steering-fill:before { content: \"\\f194\"; }\n.ri-steering-line:before { content: \"\\f195\"; }\n.ri-stethoscope-fill:before { content: \"\\f196\"; }\n.ri-stethoscope-line:before { content: \"\\f197\"; }\n.ri-sticky-note-2-fill:before { content: \"\\f198\"; }\n.ri-sticky-note-2-line:before { content: \"\\f199\"; }\n.ri-sticky-note-fill:before { content: \"\\f19a\"; }\n.ri-sticky-note-line:before { content: \"\\f19b\"; }\n.ri-stock-fill:before { content: \"\\f19c\"; }\n.ri-stock-line:before { content: \"\\f19d\"; }\n.ri-stop-circle-fill:before { content: \"\\f19e\"; }\n.ri-stop-circle-line:before { content: \"\\f19f\"; }\n.ri-stop-fill:before { content: \"\\f1a0\"; }\n.ri-stop-line:before { content: \"\\f1a1\"; }\n.ri-stop-mini-fill:before { content: \"\\f1a2\"; }\n.ri-stop-mini-line:before { content: \"\\f1a3\"; }\n.ri-store-2-fill:before { content: \"\\f1a4\"; }\n.ri-store-2-line:before { content: \"\\f1a5\"; }\n.ri-store-3-fill:before { content: \"\\f1a6\"; }\n.ri-store-3-line:before { content: \"\\f1a7\"; }\n.ri-store-fill:before { content: \"\\f1a8\"; }\n.ri-store-line:before { content: \"\\f1a9\"; }\n.ri-strikethrough-2:before { content: \"\\f1aa\"; }\n.ri-strikethrough:before { content: \"\\f1ab\"; }\n.ri-subscript-2:before { content: \"\\f1ac\"; }\n.ri-subscript:before { content: \"\\f1ad\"; }\n.ri-subtract-fill:before { content: \"\\f1ae\"; }\n.ri-subtract-line:before { content: \"\\f1af\"; }\n.ri-subway-fill:before { content: \"\\f1b0\"; }\n.ri-subway-line:before { content: \"\\f1b1\"; }\n.ri-subway-wifi-fill:before { content: \"\\f1b2\"; }\n.ri-subway-wifi-line:before { content: \"\\f1b3\"; }\n.ri-suitcase-2-fill:before { content: \"\\f1b4\"; }\n.ri-suitcase-2-line:before { content: \"\\f1b5\"; }\n.ri-suitcase-3-fill:before { content: \"\\f1b6\"; }\n.ri-suitcase-3-line:before { content: \"\\f1b7\"; }\n.ri-suitcase-fill:before { content: \"\\f1b8\"; }\n.ri-suitcase-line:before { content: \"\\f1b9\"; }\n.ri-sun-cloudy-fill:before { content: \"\\f1ba\"; }\n.ri-sun-cloudy-line:before { content: \"\\f1bb\"; }\n.ri-sun-fill:before { content: \"\\f1bc\"; }\n.ri-sun-foggy-fill:before { content: \"\\f1bd\"; }\n.ri-sun-foggy-line:before { content: \"\\f1be\"; }\n.ri-sun-line:before { content: \"\\f1bf\"; }\n.ri-superscript-2:before { content: \"\\f1c0\"; }\n.ri-superscript:before { content: \"\\f1c1\"; }\n.ri-surgical-mask-fill:before { content: \"\\f1c2\"; }\n.ri-surgical-mask-line:before { content: \"\\f1c3\"; }\n.ri-surround-sound-fill:before { content: \"\\f1c4\"; }\n.ri-surround-sound-line:before { content: \"\\f1c5\"; }\n.ri-survey-fill:before { content: \"\\f1c6\"; }\n.ri-survey-line:before { content: \"\\f1c7\"; }\n.ri-swap-box-fill:before { content: \"\\f1c8\"; }\n.ri-swap-box-line:before { content: \"\\f1c9\"; }\n.ri-swap-fill:before { content: \"\\f1ca\"; }\n.ri-swap-line:before { content: \"\\f1cb\"; }\n.ri-switch-fill:before { content: \"\\f1cc\"; }\n.ri-switch-line:before { content: \"\\f1cd\"; }\n.ri-sword-fill:before { content: \"\\f1ce\"; }\n.ri-sword-line:before { content: \"\\f1cf\"; }\n.ri-syringe-fill:before { content: \"\\f1d0\"; }\n.ri-syringe-line:before { content: \"\\f1d1\"; }\n.ri-t-box-fill:before { content: \"\\f1d2\"; }\n.ri-t-box-line:before { content: \"\\f1d3\"; }\n.ri-t-shirt-2-fill:before { content: \"\\f1d4\"; }\n.ri-t-shirt-2-line:before { content: \"\\f1d5\"; }\n.ri-t-shirt-air-fill:before { content: \"\\f1d6\"; }\n.ri-t-shirt-air-line:before { content: \"\\f1d7\"; }\n.ri-t-shirt-fill:before { content: \"\\f1d8\"; }\n.ri-t-shirt-line:before { content: \"\\f1d9\"; }\n.ri-table-2:before { content: \"\\f1da\"; }\n.ri-table-alt-fill:before { content: \"\\f1db\"; }\n.ri-table-alt-line:before { content: \"\\f1dc\"; }\n.ri-table-fill:before { content: \"\\f1dd\"; }\n.ri-table-line:before { content: \"\\f1de\"; }\n.ri-tablet-fill:before { content: \"\\f1df\"; }\n.ri-tablet-line:before { content: \"\\f1e0\"; }\n.ri-takeaway-fill:before { content: \"\\f1e1\"; }\n.ri-takeaway-line:before { content: \"\\f1e2\"; }\n.ri-taobao-fill:before { content: \"\\f1e3\"; }\n.ri-taobao-line:before { content: \"\\f1e4\"; }\n.ri-tape-fill:before { content: \"\\f1e5\"; }\n.ri-tape-line:before { content: \"\\f1e6\"; }\n.ri-task-fill:before { content: \"\\f1e7\"; }\n.ri-task-line:before { content: \"\\f1e8\"; }\n.ri-taxi-fill:before { content: \"\\f1e9\"; }\n.ri-taxi-line:before { content: \"\\f1ea\"; }\n.ri-taxi-wifi-fill:before { content: \"\\f1eb\"; }\n.ri-taxi-wifi-line:before { content: \"\\f1ec\"; }\n.ri-team-fill:before { content: \"\\f1ed\"; }\n.ri-team-line:before { content: \"\\f1ee\"; }\n.ri-telegram-fill:before { content: \"\\f1ef\"; }\n.ri-telegram-line:before { content: \"\\f1f0\"; }\n.ri-temp-cold-fill:before { content: \"\\f1f1\"; }\n.ri-temp-cold-line:before { content: \"\\f1f2\"; }\n.ri-temp-hot-fill:before { content: \"\\f1f3\"; }\n.ri-temp-hot-line:before { content: \"\\f1f4\"; }\n.ri-terminal-box-fill:before { content: \"\\f1f5\"; }\n.ri-terminal-box-line:before { content: \"\\f1f6\"; }\n.ri-terminal-fill:before { content: \"\\f1f7\"; }\n.ri-terminal-line:before { content: \"\\f1f8\"; }\n.ri-terminal-window-fill:before { content: \"\\f1f9\"; }\n.ri-terminal-window-line:before { content: \"\\f1fa\"; }\n.ri-test-tube-fill:before { content: \"\\f1fb\"; }\n.ri-test-tube-line:before { content: \"\\f1fc\"; }\n.ri-text-direction-l:before { content: \"\\f1fd\"; }\n.ri-text-direction-r:before { content: \"\\f1fe\"; }\n.ri-text-spacing:before { content: \"\\f1ff\"; }\n.ri-text-wrap:before { content: \"\\f200\"; }\n.ri-text:before { content: \"\\f201\"; }\n.ri-thermometer-fill:before { content: \"\\f202\"; }\n.ri-thermometer-line:before { content: \"\\f203\"; }\n.ri-thumb-down-fill:before { content: \"\\f204\"; }\n.ri-thumb-down-line:before { content: \"\\f205\"; }\n.ri-thumb-up-fill:before { content: \"\\f206\"; }\n.ri-thumb-up-line:before { content: \"\\f207\"; }\n.ri-thunderstorms-fill:before { content: \"\\f208\"; }\n.ri-thunderstorms-line:before { content: \"\\f209\"; }\n.ri-ticket-2-fill:before { content: \"\\f20a\"; }\n.ri-ticket-2-line:before { content: \"\\f20b\"; }\n.ri-ticket-fill:before { content: \"\\f20c\"; }\n.ri-ticket-line:before { content: \"\\f20d\"; }\n.ri-time-fill:before { content: \"\\f20e\"; }\n.ri-time-line:before { content: \"\\f20f\"; }\n.ri-timer-2-fill:before { content: \"\\f210\"; }\n.ri-timer-2-line:before { content: \"\\f211\"; }\n.ri-timer-fill:before { content: \"\\f212\"; }\n.ri-timer-flash-fill:before { content: \"\\f213\"; }\n.ri-timer-flash-line:before { content: \"\\f214\"; }\n.ri-timer-line:before { content: \"\\f215\"; }\n.ri-todo-fill:before { content: \"\\f216\"; }\n.ri-todo-line:before { content: \"\\f217\"; }\n.ri-toggle-fill:before { content: \"\\f218\"; }\n.ri-toggle-line:before { content: \"\\f219\"; }\n.ri-tools-fill:before { content: \"\\f21a\"; }\n.ri-tools-line:before { content: \"\\f21b\"; }\n.ri-tornado-fill:before { content: \"\\f21c\"; }\n.ri-tornado-line:before { content: \"\\f21d\"; }\n.ri-trademark-fill:before { content: \"\\f21e\"; }\n.ri-trademark-line:before { content: \"\\f21f\"; }\n.ri-traffic-light-fill:before { content: \"\\f220\"; }\n.ri-traffic-light-line:before { content: \"\\f221\"; }\n.ri-train-fill:before { content: \"\\f222\"; }\n.ri-train-line:before { content: \"\\f223\"; }\n.ri-train-wifi-fill:before { content: \"\\f224\"; }\n.ri-train-wifi-line:before { content: \"\\f225\"; }\n.ri-translate-2:before { content: \"\\f226\"; }\n.ri-translate:before { content: \"\\f227\"; }\n.ri-travesti-fill:before { content: \"\\f228\"; }\n.ri-travesti-line:before { content: \"\\f229\"; }\n.ri-treasure-map-fill:before { content: \"\\f22a\"; }\n.ri-treasure-map-line:before { content: \"\\f22b\"; }\n.ri-trello-fill:before { content: \"\\f22c\"; }\n.ri-trello-line:before { content: \"\\f22d\"; }\n.ri-trophy-fill:before { content: \"\\f22e\"; }\n.ri-trophy-line:before { content: \"\\f22f\"; }\n.ri-truck-fill:before { content: \"\\f230\"; }\n.ri-truck-line:before { content: \"\\f231\"; }\n.ri-tumblr-fill:before { content: \"\\f232\"; }\n.ri-tumblr-line:before { content: \"\\f233\"; }\n.ri-tv-2-fill:before { content: \"\\f234\"; }\n.ri-tv-2-line:before { content: \"\\f235\"; }\n.ri-tv-fill:before { content: \"\\f236\"; }\n.ri-tv-line:before { content: \"\\f237\"; }\n.ri-twitch-fill:before { content: \"\\f238\"; }\n.ri-twitch-line:before { content: \"\\f239\"; }\n.ri-twitter-fill:before { content: \"\\f23a\"; }\n.ri-twitter-line:before { content: \"\\f23b\"; }\n.ri-typhoon-fill:before { content: \"\\f23c\"; }\n.ri-typhoon-line:before { content: \"\\f23d\"; }\n.ri-u-disk-fill:before { content: \"\\f23e\"; }\n.ri-u-disk-line:before { content: \"\\f23f\"; }\n.ri-ubuntu-fill:before { content: \"\\f240\"; }\n.ri-ubuntu-line:before { content: \"\\f241\"; }\n.ri-umbrella-fill:before { content: \"\\f242\"; }\n.ri-umbrella-line:before { content: \"\\f243\"; }\n.ri-underline:before { content: \"\\f244\"; }\n.ri-uninstall-fill:before { content: \"\\f245\"; }\n.ri-uninstall-line:before { content: \"\\f246\"; }\n.ri-unsplash-fill:before { content: \"\\f247\"; }\n.ri-unsplash-line:before { content: \"\\f248\"; }\n.ri-upload-2-fill:before { content: \"\\f249\"; }\n.ri-upload-2-line:before { content: \"\\f24a\"; }\n.ri-upload-cloud-2-fill:before { content: \"\\f24b\"; }\n.ri-upload-cloud-2-line:before { content: \"\\f24c\"; }\n.ri-upload-cloud-fill:before { content: \"\\f24d\"; }\n.ri-upload-cloud-line:before { content: \"\\f24e\"; }\n.ri-upload-fill:before { content: \"\\f24f\"; }\n.ri-upload-line:before { content: \"\\f250\"; }\n.ri-usb-fill:before { content: \"\\f251\"; }\n.ri-usb-line:before { content: \"\\f252\"; }\n.ri-user-2-fill:before { content: \"\\f253\"; }\n.ri-user-2-line:before { content: \"\\f254\"; }\n.ri-user-3-fill:before { content: \"\\f255\"; }\n.ri-user-3-line:before { content: \"\\f256\"; }\n.ri-user-4-fill:before { content: \"\\f257\"; }\n.ri-user-4-line:before { content: \"\\f258\"; }\n.ri-user-5-fill:before { content: \"\\f259\"; }\n.ri-user-5-line:before { content: \"\\f25a\"; }\n.ri-user-6-fill:before { content: \"\\f25b\"; }\n.ri-user-6-line:before { content: \"\\f25c\"; }\n.ri-user-add-fill:before { content: \"\\f25d\"; }\n.ri-user-add-line:before { content: \"\\f25e\"; }\n.ri-user-fill:before { content: \"\\f25f\"; }\n.ri-user-follow-fill:before { content: \"\\f260\"; }\n.ri-user-follow-line:before { content: \"\\f261\"; }\n.ri-user-heart-fill:before { content: \"\\f262\"; }\n.ri-user-heart-line:before { content: \"\\f263\"; }\n.ri-user-line:before { content: \"\\f264\"; }\n.ri-user-location-fill:before { content: \"\\f265\"; }\n.ri-user-location-line:before { content: \"\\f266\"; }\n.ri-user-received-2-fill:before { content: \"\\f267\"; }\n.ri-user-received-2-line:before { content: \"\\f268\"; }\n.ri-user-received-fill:before { content: \"\\f269\"; }\n.ri-user-received-line:before { content: \"\\f26a\"; }\n.ri-user-search-fill:before { content: \"\\f26b\"; }\n.ri-user-search-line:before { content: \"\\f26c\"; }\n.ri-user-settings-fill:before { content: \"\\f26d\"; }\n.ri-user-settings-line:before { content: \"\\f26e\"; }\n.ri-user-shared-2-fill:before { content: \"\\f26f\"; }\n.ri-user-shared-2-line:before { content: \"\\f270\"; }\n.ri-user-shared-fill:before { content: \"\\f271\"; }\n.ri-user-shared-line:before { content: \"\\f272\"; }\n.ri-user-smile-fill:before { content: \"\\f273\"; }\n.ri-user-smile-line:before { content: \"\\f274\"; }\n.ri-user-star-fill:before { content: \"\\f275\"; }\n.ri-user-star-line:before { content: \"\\f276\"; }\n.ri-user-unfollow-fill:before { content: \"\\f277\"; }\n.ri-user-unfollow-line:before { content: \"\\f278\"; }\n.ri-user-voice-fill:before { content: \"\\f279\"; }\n.ri-user-voice-line:before { content: \"\\f27a\"; }\n.ri-video-add-fill:before { content: \"\\f27b\"; }\n.ri-video-add-line:before { content: \"\\f27c\"; }\n.ri-video-chat-fill:before { content: \"\\f27d\"; }\n.ri-video-chat-line:before { content: \"\\f27e\"; }\n.ri-video-download-fill:before { content: \"\\f27f\"; }\n.ri-video-download-line:before { content: \"\\f280\"; }\n.ri-video-fill:before { content: \"\\f281\"; }\n.ri-video-line:before { content: \"\\f282\"; }\n.ri-video-upload-fill:before { content: \"\\f283\"; }\n.ri-video-upload-line:before { content: \"\\f284\"; }\n.ri-vidicon-2-fill:before { content: \"\\f285\"; }\n.ri-vidicon-2-line:before { content: \"\\f286\"; }\n.ri-vidicon-fill:before { content: \"\\f287\"; }\n.ri-vidicon-line:before { content: \"\\f288\"; }\n.ri-vimeo-fill:before { content: \"\\f289\"; }\n.ri-vimeo-line:before { content: \"\\f28a\"; }\n.ri-vip-crown-2-fill:before { content: \"\\f28b\"; }\n.ri-vip-crown-2-line:before { content: \"\\f28c\"; }\n.ri-vip-crown-fill:before { content: \"\\f28d\"; }\n.ri-vip-crown-line:before { content: \"\\f28e\"; }\n.ri-vip-diamond-fill:before { content: \"\\f28f\"; }\n.ri-vip-diamond-line:before { content: \"\\f290\"; }\n.ri-vip-fill:before { content: \"\\f291\"; }\n.ri-vip-line:before { content: \"\\f292\"; }\n.ri-virus-fill:before { content: \"\\f293\"; }\n.ri-virus-line:before { content: \"\\f294\"; }\n.ri-visa-fill:before { content: \"\\f295\"; }\n.ri-visa-line:before { content: \"\\f296\"; }\n.ri-voice-recognition-fill:before { content: \"\\f297\"; }\n.ri-voice-recognition-line:before { content: \"\\f298\"; }\n.ri-voiceprint-fill:before { content: \"\\f299\"; }\n.ri-voiceprint-line:before { content: \"\\f29a\"; }\n.ri-volume-down-fill:before { content: \"\\f29b\"; }\n.ri-volume-down-line:before { content: \"\\f29c\"; }\n.ri-volume-mute-fill:before { content: \"\\f29d\"; }\n.ri-volume-mute-line:before { content: \"\\f29e\"; }\n.ri-volume-off-vibrate-fill:before { content: \"\\f29f\"; }\n.ri-volume-off-vibrate-line:before { content: \"\\f2a0\"; }\n.ri-volume-up-fill:before { content: \"\\f2a1\"; }\n.ri-volume-up-line:before { content: \"\\f2a2\"; }\n.ri-volume-vibrate-fill:before { content: \"\\f2a3\"; }\n.ri-volume-vibrate-line:before { content: \"\\f2a4\"; }\n.ri-vuejs-fill:before { content: \"\\f2a5\"; }\n.ri-vuejs-line:before { content: \"\\f2a6\"; }\n.ri-walk-fill:before { content: \"\\f2a7\"; }\n.ri-walk-line:before { content: \"\\f2a8\"; }\n.ri-wallet-2-fill:before { content: \"\\f2a9\"; }\n.ri-wallet-2-line:before { content: \"\\f2aa\"; }\n.ri-wallet-3-fill:before { content: \"\\f2ab\"; }\n.ri-wallet-3-line:before { content: \"\\f2ac\"; }\n.ri-wallet-fill:before { content: \"\\f2ad\"; }\n.ri-wallet-line:before { content: \"\\f2ae\"; }\n.ri-water-flash-fill:before { content: \"\\f2af\"; }\n.ri-water-flash-line:before { content: \"\\f2b0\"; }\n.ri-webcam-fill:before { content: \"\\f2b1\"; }\n.ri-webcam-line:before { content: \"\\f2b2\"; }\n.ri-wechat-2-fill:before { content: \"\\f2b3\"; }\n.ri-wechat-2-line:before { content: \"\\f2b4\"; }\n.ri-wechat-fill:before { content: \"\\f2b5\"; }\n.ri-wechat-line:before { content: \"\\f2b6\"; }\n.ri-wechat-pay-fill:before { content: \"\\f2b7\"; }\n.ri-wechat-pay-line:before { content: \"\\f2b8\"; }\n.ri-weibo-fill:before { content: \"\\f2b9\"; }\n.ri-weibo-line:before { content: \"\\f2ba\"; }\n.ri-whatsapp-fill:before { content: \"\\f2bb\"; }\n.ri-whatsapp-line:before { content: \"\\f2bc\"; }\n.ri-wheelchair-fill:before { content: \"\\f2bd\"; }\n.ri-wheelchair-line:before { content: \"\\f2be\"; }\n.ri-wifi-fill:before { content: \"\\f2bf\"; }\n.ri-wifi-line:before { content: \"\\f2c0\"; }\n.ri-wifi-off-fill:before { content: \"\\f2c1\"; }\n.ri-wifi-off-line:before { content: \"\\f2c2\"; }\n.ri-window-2-fill:before { content: \"\\f2c3\"; }\n.ri-window-2-line:before { content: \"\\f2c4\"; }\n.ri-window-fill:before { content: \"\\f2c5\"; }\n.ri-window-line:before { content: \"\\f2c6\"; }\n.ri-windows-fill:before { content: \"\\f2c7\"; }\n.ri-windows-line:before { content: \"\\f2c8\"; }\n.ri-windy-fill:before { content: \"\\f2c9\"; }\n.ri-windy-line:before { content: \"\\f2ca\"; }\n.ri-wireless-charging-fill:before { content: \"\\f2cb\"; }\n.ri-wireless-charging-line:before { content: \"\\f2cc\"; }\n.ri-women-fill:before { content: \"\\f2cd\"; }\n.ri-women-line:before { content: \"\\f2ce\"; }\n.ri-wubi-input:before { content: \"\\f2cf\"; }\n.ri-xbox-fill:before { content: \"\\f2d0\"; }\n.ri-xbox-line:before { content: \"\\f2d1\"; }\n.ri-xing-fill:before { content: \"\\f2d2\"; }\n.ri-xing-line:before { content: \"\\f2d3\"; }\n.ri-youtube-fill:before { content: \"\\f2d4\"; }\n.ri-youtube-line:before { content: \"\\f2d5\"; }\n.ri-zcool-fill:before { content: \"\\f2d6\"; }\n.ri-zcool-line:before { content: \"\\f2d7\"; }\n.ri-zhihu-fill:before { content: \"\\f2d8\"; }\n.ri-zhihu-line:before { content: \"\\f2d9\"; }\n.ri-zoom-in-fill:before { content: \"\\f2da\"; }\n.ri-zoom-in-line:before { content: \"\\f2db\"; }\n.ri-zoom-out-fill:before { content: \"\\f2dc\"; }\n.ri-zoom-out-line:before { content: \"\\f2dd\"; }\n.ri-zzz-fill:before { content: \"\\f2de\"; }\n.ri-zzz-line:before { content: \"\\f2df\"; }\n\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.eot?t=1590207869815":
/*!********************************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.eot?t=1590207869815 ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/remixicon/remixicon.eot?5cb99e6cba5a4619063f73d47b775f6f");

/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.svg?t=1590207869815":
/*!********************************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.svg?t=1590207869815 ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/remixicon/remixicon.svg?9cedd2150922ead848695530d71a212f");

/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.ttf?t=1590207869815":
/*!********************************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.ttf?t=1590207869815 ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/remixicon/remixicon.ttf?f2616f597cf98f38d2347c9648bfe049");

/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.woff2?t=1590207869815":
/*!**********************************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.woff2?t=1590207869815 ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/remixicon/remixicon.woff2?90668f6f9b3c2c18a090f132d1793c67");

/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.woff?t=1590207869815":
/*!*********************************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.woff?t=1590207869815 ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/remixicon/remixicon.woff?8d09fa11700ed63cf96e1d1c038368f3");

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/remixicon/fonts/remixicon.css":
/*!****************************************************!*\
  !*** ./node_modules/remixicon/fonts/remixicon.css ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_remixicon_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../../postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./remixicon.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/remixicon/fonts/remixicon.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_remixicon_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_remixicon_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;