// node_modules/@hotwired/stimulus/dist/stimulus.js
function camelize(value) {
  return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function namespaceCamelize(value) {
  return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
}
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}
function isSomething(object) {
  return object !== null && object !== void 0;
}
function hasProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}
function readInheritableStaticArrayValues(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return Array.from(ancestors.reduce((values, constructor2) => {
    getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
    return values;
  }, /* @__PURE__ */ new Set()));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return ancestors.reduce((pairs, constructor2) => {
    pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
    return pairs;
  }, []);
}
function getAncestorsForConstructor(constructor) {
  const ancestors = [];
  while (constructor) {
    ancestors.push(constructor);
    constructor = Object.getPrototypeOf(constructor);
  }
  return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
  const definition = constructor[propertyName];
  return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
  const definition = constructor[propertyName];
  return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
}
var getOwnKeys = (() => {
  if (typeof Object.getOwnPropertySymbols == "function") {
    return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
  } else {
    return Object.getOwnPropertyNames;
  }
})();
var extend = (() => {
  function extendWithReflect(constructor) {
    function extended() {
      return Reflect.construct(constructor, arguments, new.target);
    }
    extended.prototype = Object.create(constructor.prototype, {
      constructor: { value: extended }
    });
    Reflect.setPrototypeOf(extended, constructor);
    return extended;
  }
  function testReflectExtension() {
    const a = function() {
      this.a.call(this);
    };
    const b = extendWithReflect(a);
    b.prototype.a = function() {
    };
    return new b();
  }
  try {
    testReflectExtension();
    return extendWithReflect;
  } catch (error) {
    return (constructor) => class extended extends constructor {
    };
  }
})();
var defaultSchema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: (identifier) => `data-${identifier}-target`,
  outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
  keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
};
function objectFromEntries(array) {
  return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
}
function ClassPropertiesBlessing(constructor) {
  const classes = readInheritableStaticArrayValues(constructor, "classes");
  return classes.reduce((properties, classDefinition) => {
    return Object.assign(properties, propertiesForClassDefinition(classDefinition));
  }, {});
}
function propertiesForClassDefinition(key) {
  return {
    [`${key}Class`]: {
      get() {
        const { classes } = this;
        if (classes.has(key)) {
          return classes.get(key);
        } else {
          const attribute = classes.getAttributeName(key);
          throw new Error(`Missing attribute "${attribute}"`);
        }
      }
    },
    [`${key}Classes`]: {
      get() {
        return this.classes.getAll(key);
      }
    },
    [`has${capitalize(key)}Class`]: {
      get() {
        return this.classes.has(key);
      }
    }
  };
}
function OutletPropertiesBlessing(constructor) {
  const outlets = readInheritableStaticArrayValues(constructor, "outlets");
  return outlets.reduce((properties, outletDefinition) => {
    return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
  }, {});
}
function getOutletController(controller, element, identifier) {
  return controller.application.getControllerForElementAndIdentifier(element, identifier);
}
function getControllerAndEnsureConnectedScope(controller, element, outletName) {
  let outletController = getOutletController(controller, element, outletName);
  if (outletController)
    return outletController;
  controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
  outletController = getOutletController(controller, element, outletName);
  if (outletController)
    return outletController;
}
function propertiesForOutletDefinition(name) {
  const camelizedName = namespaceCamelize(name);
  return {
    [`${camelizedName}Outlet`]: {
      get() {
        const outletElement = this.outlets.find(name);
        const selector = this.outlets.getSelectorForOutletName(name);
        if (outletElement) {
          const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
          if (outletController)
            return outletController;
          throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
        }
        throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
      }
    },
    [`${camelizedName}Outlets`]: {
      get() {
        const outlets = this.outlets.findAll(name);
        if (outlets.length > 0) {
          return outlets.map((outletElement) => {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
          }).filter((controller) => controller);
        }
        return [];
      }
    },
    [`${camelizedName}OutletElement`]: {
      get() {
        const outletElement = this.outlets.find(name);
        const selector = this.outlets.getSelectorForOutletName(name);
        if (outletElement) {
          return outletElement;
        } else {
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      }
    },
    [`${camelizedName}OutletElements`]: {
      get() {
        return this.outlets.findAll(name);
      }
    },
    [`has${capitalize(camelizedName)}Outlet`]: {
      get() {
        return this.outlets.has(name);
      }
    }
  };
}
function TargetPropertiesBlessing(constructor) {
  const targets = readInheritableStaticArrayValues(constructor, "targets");
  return targets.reduce((properties, targetDefinition) => {
    return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
  }, {});
}
function propertiesForTargetDefinition(name) {
  return {
    [`${name}Target`]: {
      get() {
        const target = this.targets.find(name);
        if (target) {
          return target;
        } else {
          throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
        }
      }
    },
    [`${name}Targets`]: {
      get() {
        return this.targets.findAll(name);
      }
    },
    [`has${capitalize(name)}Target`]: {
      get() {
        return this.targets.has(name);
      }
    }
  };
}
function ValuePropertiesBlessing(constructor) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
  const propertyDescriptorMap = {
    valueDescriptorMap: {
      get() {
        return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
          return Object.assign(result, { [attributeName]: valueDescriptor });
        }, {});
      }
    }
  };
  return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
    return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
  }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
  const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
  const { key, name, reader: read, writer: write } = definition;
  return {
    [name]: {
      get() {
        const value = this.data.get(key);
        if (value !== null) {
          return read(value);
        } else {
          return definition.defaultValue;
        }
      },
      set(value) {
        if (value === void 0) {
          this.data.delete(key);
        } else {
          this.data.set(key, write(value));
        }
      }
    },
    [`has${capitalize(name)}`]: {
      get() {
        return this.data.has(key) || definition.hasCustomDefaultValue;
      }
    }
  };
}
function parseValueDefinitionPair([token, typeDefinition], controller) {
  return valueDescriptorForTokenAndTypeDefinition({
    controller,
    token,
    typeDefinition
  });
}
function parseValueTypeConstant(constant) {
  switch (constant) {
    case Array:
      return "array";
    case Boolean:
      return "boolean";
    case Number:
      return "number";
    case Object:
      return "object";
    case String:
      return "string";
  }
}
function parseValueTypeDefault(defaultValue) {
  switch (typeof defaultValue) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
  }
  if (Array.isArray(defaultValue))
    return "array";
  if (Object.prototype.toString.call(defaultValue) === "[object Object]")
    return "object";
}
function parseValueTypeObject(payload) {
  const { controller, token, typeObject } = payload;
  const hasType = isSomething(typeObject.type);
  const hasDefault = isSomething(typeObject.default);
  const fullObject = hasType && hasDefault;
  const onlyType = hasType && !hasDefault;
  const onlyDefault = !hasType && hasDefault;
  const typeFromObject = parseValueTypeConstant(typeObject.type);
  const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
  if (onlyType)
    return typeFromObject;
  if (onlyDefault)
    return typeFromDefaultValue;
  if (typeFromObject !== typeFromDefaultValue) {
    const propertyPath = controller ? `${controller}.${token}` : token;
    throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
  }
  if (fullObject)
    return typeFromObject;
}
function parseValueTypeDefinition(payload) {
  const { controller, token, typeDefinition } = payload;
  const typeObject = { controller, token, typeObject: typeDefinition };
  const typeFromObject = parseValueTypeObject(typeObject);
  const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
  const typeFromConstant = parseValueTypeConstant(typeDefinition);
  const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
  if (type)
    return type;
  const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
  throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
}
function defaultValueForDefinition(typeDefinition) {
  const constant = parseValueTypeConstant(typeDefinition);
  if (constant)
    return defaultValuesByType[constant];
  const hasDefault = hasProperty(typeDefinition, "default");
  const hasType = hasProperty(typeDefinition, "type");
  const typeObject = typeDefinition;
  if (hasDefault)
    return typeObject.default;
  if (hasType) {
    const { type } = typeObject;
    const constantFromType = parseValueTypeConstant(type);
    if (constantFromType)
      return defaultValuesByType[constantFromType];
  }
  return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(payload) {
  const { token, typeDefinition } = payload;
  const key = `${dasherize(token)}-value`;
  const type = parseValueTypeDefinition(payload);
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() {
      return defaultValueForDefinition(typeDefinition);
    },
    get hasCustomDefaultValue() {
      return parseValueTypeDefault(typeDefinition) !== void 0;
    },
    reader: readers[type],
    writer: writers[type] || writers.default
  };
}
var defaultValuesByType = {
  get array() {
    return [];
  },
  boolean: false,
  number: 0,
  get object() {
    return {};
  },
  string: ""
};
var readers = {
  array(value) {
    const array = JSON.parse(value);
    if (!Array.isArray(array)) {
      throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
    }
    return array;
  },
  boolean(value) {
    return !(value == "0" || String(value).toLowerCase() == "false");
  },
  number(value) {
    return Number(value.replace(/_/g, ""));
  },
  object(value) {
    const object = JSON.parse(value);
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
    }
    return object;
  },
  string(value) {
    return value;
  }
};
var writers = {
  default: writeString,
  array: writeJSON,
  object: writeJSON
};
function writeJSON(value) {
  return JSON.stringify(value);
}
function writeString(value) {
  return `${value}`;
}
var Controller = class {
  constructor(context) {
    this.context = context;
  }
  static get shouldLoad() {
    return true;
  }
  static afterLoad(_identifier, _application) {
    return;
  }
  get application() {
    return this.context.application;
  }
  get scope() {
    return this.context.scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get targets() {
    return this.scope.targets;
  }
  get outlets() {
    return this.scope.outlets;
  }
  get classes() {
    return this.scope.classes;
  }
  get data() {
    return this.scope.data;
  }
  initialize() {
  }
  connect() {
  }
  disconnect() {
  }
  dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
    const type = prefix ? `${prefix}:${eventName}` : eventName;
    const event = new CustomEvent(type, { detail, bubbles, cancelable });
    target.dispatchEvent(event);
    return event;
  }
};
Controller.blessings = [
  ClassPropertiesBlessing,
  TargetPropertiesBlessing,
  ValuePropertiesBlessing,
  OutletPropertiesBlessing
];
Controller.targets = [];
Controller.outlets = [];
Controller.values = {};

// src/transition.js
async function transition(element, state, transitionOptions = {}) {
  if (!!state) {
    enter(element, transitionOptions);
  } else {
    leave(element, transitionOptions);
  }
}
async function enter(element, transitionOptions = {}) {
  const transitionClasses = element.dataset.transitionEnter || transitionOptions.enter || "enter";
  const fromClasses = element.dataset.transitionEnterFrom || transitionOptions.enterFrom || "enter-from";
  const toClasses = element.dataset.transitionEnterTo || transitionOptions.enterTo || "enter-to";
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggleClass || "hidden";
  element.classList.add(...transitionClasses.split(" "));
  element.classList.add(...fromClasses.split(" "));
  element.classList.remove(...toClasses.split(" "));
  element.classList.remove(...toggleClass.split(" "));
  await nextFrame();
  element.classList.remove(...fromClasses.split(" "));
  element.classList.add(...toClasses.split(" "));
  try {
    await afterTransition(element);
  } finally {
    element.classList.remove(...transitionClasses.split(" "));
  }
}
async function leave(element, transitionOptions = {}) {
  const transitionClasses = element.dataset.transitionLeave || transitionOptions.leave || "leave";
  const fromClasses = element.dataset.transitionLeaveFrom || transitionOptions.leaveFrom || "leave-from";
  const toClasses = element.dataset.transitionLeaveTo || transitionOptions.leaveTo || "leave-to";
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggle || "hidden";
  element.classList.add(...transitionClasses.split(" "));
  element.classList.add(...fromClasses.split(" "));
  element.classList.remove(...toClasses.split(" "));
  await nextFrame();
  element.classList.remove(...fromClasses.split(" "));
  element.classList.add(...toClasses.split(" "));
  try {
    await afterTransition(element);
  } finally {
    element.classList.remove(...transitionClasses.split(" "));
    element.classList.add(...toggleClass.split(" "));
  }
}
function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}
function afterTransition(element) {
  return Promise.all(element.getAnimations().map((animation) => animation.finished));
}

// src/alert.js
var alert_default = class extends Controller {
  static values = {
    dismissAfter: Number,
    showDelay: { type: Number, default: 0 },
    removeDelay: { type: Number, default: 1100 }
  };
  connect() {
    setTimeout(() => {
      enter(this.element);
    }, this.showDelayValue);
    if (this.hasDismissAfterValue) {
      setTimeout(() => {
        this.close();
      }, this.dismissAfterValue);
    }
  }
  // Runs hide animation and then removes element from the page
  close() {
    leave(this.element).then(() => {
      this.element.remove();
    });
  }
};

// src/autosave.js
var autosave_default = class extends Controller {
  static targets = ["form", "status"];
  static values = {
    submitDuration: { type: Number, default: 1e3 },
    statusDuration: { type: Number, default: 2e3 },
    submittingText: { type: String, default: "Saving..." },
    successText: { type: String, default: "Saved!" },
    errorText: { type: String, default: "Unable to save." }
  };
  connect() {
    this.timeout = null;
  }
  save() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = this.submittingTextValue;
      this.formTarget.requestSubmit();
    }, this.submitDurationValue);
  }
  success() {
    this.setStatus(this.successTextValue);
  }
  error() {
    this.setStatus(this.errorTextValue);
  }
  setStatus(message) {
    this.statusTarget.textContent = message;
    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = "";
    }, this.statusDurationValue);
  }
};

// src/color_preview.js
var color_preview_default = class extends Controller {
  static targets = ["preview", "color"];
  static values = {
    style: { type: String, default: "backgroundColor" }
  };
  update() {
    this.preview = this.colorTarget.value;
  }
  set preview(color) {
    this.previewTarget.style[this.styleValue] = color;
    const yiqColor = this._getContrastYIQ(color);
    if (this.styleValue === "color") {
      this.previewTarget.style.backgroundColor = yiqColor;
    } else {
      this.previewTarget.style.color = yiqColor;
    }
  }
  _getContrastYIQ(hexColor) {
    hexColor = hexColor.replace("#", "");
    const yiqThreshold = 128;
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1e3;
    return yiq >= yiqThreshold ? "#000" : "#fff";
  }
};

// src/dropdown.js
var dropdown_default = class extends Controller {
  static targets = ["menu", "button", "menuItem"];
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true }
  };
  static classes = ["enter", "enterFrom", "enterTo", "leave", "leaveFrom", "leaveTo", "toggle"];
  connect() {
    document.addEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  disconnect() {
    document.removeEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  openValueChanged() {
    transition(this.menuTarget, this.openValue, this.transitionOptions);
    if (this.openValue === true && this.hasMenuItemTarget) {
      this.menuItemTargets[0].focus();
    }
  }
  show() {
    this.openValue = true;
  }
  close() {
    this.openValue = false;
  }
  // Closes dropdown from outside click or keyboard
  hide(event) {
    if (this.closeOnClickOutsideValue && event.target.nodeType && this.element.contains(event.target) === false && this.openValue) {
      this.openValue = false;
    }
    if (this.closeOnEscapeValue && event.key === "Escape" && this.openValue) {
      this.openValue = false;
    }
  }
  toggle() {
    this.openValue = !this.openValue;
  }
  nextItem(event) {
    event.preventDefault();
    this.menuItemTargets[this.nextIndex].focus();
  }
  previousItem(event) {
    event.preventDefault();
    this.menuItemTargets[this.previousIndex].focus();
  }
  // getters and setters
  get currentItemIndex() {
    return this.menuItemTargets.indexOf(document.activeElement);
  }
  get nextIndex() {
    return Math.min(this.currentItemIndex + 1, this.menuItemTargets.length - 1);
  }
  get previousIndex() {
    return Math.max(this.currentItemIndex - 1, 0);
  }
  get transitionOptions() {
    return {
      enter: this.hasEnterClass ? this.enterClass : "transition ease-out duration-100",
      enterFrom: this.hasEnterFromClass ? this.enterFromClass : "transform opacity-0 scale-95",
      enterTo: this.hasEnterToClass ? this.enterToClass : "transform opacity-100 scale-100",
      leave: this.hasLeaveClass ? this.leaveClass : "transition ease-in duration-75",
      leaveFrom: this.hasLeaveFromClass ? this.leaveFromClass : "transform opacity-100 scale-100",
      leaveTo: this.hasLeaveToClass ? this.leaveToClass : "transform opacity-0 scale-95",
      toggleClass: this.hasToggleClass ? this.toggleClass : "hidden"
    };
  }
  // Ensures the menu is hidden before Turbo caches the page
  beforeCache() {
    this.openValue = false;
    this.menuTarget.classList.add("hidden");
  }
};

// src/modal.js
var modal_default = class extends Controller {
  static targets = ["dialog"];
  static values = {
    open: Boolean
  };
  connect() {
    if (this.openValue)
      this.open();
    document.addEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  disconnect() {
    document.removeEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  open() {
    this.dialogTarget.showModal();
  }
  close() {
    this.dialogTarget.close();
  }
  backdropClose(event) {
    if (event.target.nodeName == "DIALOG")
      this.dialogTarget.close();
  }
  // For showing non-modally
  show() {
    this.dialogTarget.show();
  }
  beforeCache() {
    this.close();
  }
};

// src/popover.js
var popover_default = class extends Controller {
  static targets = ["content"];
  static values = {
    dismissAfter: Number,
    open: { type: Boolean, default: false }
  };
  openValueChanged() {
    transition(this.contentTarget, this.openValue);
    if (this.shouldAutoDismiss)
      this.scheduleDismissal();
  }
  // If already true, extend the dismissal another X seconds since this will not trigger openValueChanged
  show(event) {
    if (this.shouldAutoDismiss)
      this.scheduleDismissal();
    this.openValue = true;
  }
  hide() {
    this.openValue = false;
  }
  toggle() {
    this.openValue = !this.openValue;
  }
  get shouldAutoDismiss() {
    return this.openValue && this.hasDismissAfterValue;
  }
  scheduleDismissal() {
    if (!this.hasDismissAfterValue)
      return;
    this.cancelDismissal();
    this.timeoutId = setTimeout(() => {
      this.hide();
      this.timeoutId = void 0;
    }, this.dismissAfterValue);
  }
  cancelDismissal() {
    if (typeof this.timeoutId === "number") {
      clearTimeout(this.timeoutId);
      this.timeoutId = void 0;
    }
  }
};

// src/slideover.js
var slideover_default = class extends Controller {
  static targets = ["dialog"];
  static values = {
    open: Boolean
  };
  connect() {
    if (this.openValue)
      this.open();
    document.addEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  disconnect() {
    document.removeEventListener("turbo:before-cache", this.beforeCache.bind(this));
  }
  open() {
    this.dialogTarget.showModal();
  }
  close() {
    this.dialogTarget.close();
  }
  backdropClose(event) {
    if (event.target.nodeName == "DIALOG")
      this.dialogTarget.close();
  }
  beforeCache() {
    this.close();
  }
};

// src/tabs.js
var tabs_default = class extends Controller {
  static classes = ["activeTab", "inactiveTab"];
  static targets = ["tab", "panel", "select"];
  static values = {
    index: 0,
    updateAnchor: Boolean,
    scrollToAnchor: Boolean,
    scrollActiveTabIntoView: Boolean
  };
  initialize() {
    if (this.anchor)
      this.indexValue = this.tabTargets.findIndex((tab) => tab.id === this.anchor);
  }
  connect() {
    this.showTab();
  }
  // Changes to the clicked tab
  change(event) {
    if (event.currentTarget.tagName === "SELECT") {
      this.indexValue = event.currentTarget.selectedIndex;
    } else if (event.currentTarget.dataset.index) {
      this.indexValue = event.currentTarget.dataset.index;
    } else if (event.currentTarget.dataset.id) {
      this.indexValue = this.tabTargets.findIndex((tab) => tab.id == event.currentTarget.dataset.id);
    } else {
      this.indexValue = this.tabTargets.indexOf(event.currentTarget);
    }
    window.dispatchEvent(new CustomEvent("tsc:tab-change"));
  }
  nextTab() {
    this.indexValue = Math.min(this.indexValue + 1, this.tabsCount - 1);
  }
  previousTab() {
    this.indexValue = Math.max(this.indexValue - 1, 0);
  }
  firstTab() {
    this.indexValue = 0;
  }
  lastTab() {
    this.indexValue = this.tabsCount - 1;
  }
  indexValueChanged() {
    this.showTab();
    if (this.updateAnchorValue) {
      const new_tab_id = this.tabTargets[this.indexValue].id;
      if (this.scrollToAnchorValue) {
        location.hash = new_tab_id;
      } else {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.split("#")[0] + "#" + new_tab_id;
        history.replaceState({}, document.title, newUrl);
      }
    }
  }
  showTab() {
    this.panelTargets.forEach((panel, index) => {
      const tab = this.tabTargets[index];
      if (index === this.indexValue) {
        panel.classList.remove("hidden");
        tab.ariaSelected = "true";
        if (this.hasInactiveTabClass)
          tab?.classList?.remove(...this.inactiveTabClasses);
        if (this.hasActiveTabClass)
          tab?.classList?.add(...this.activeTabClasses);
      } else {
        panel.classList.add("hidden");
        tab.ariaSelected = null;
        if (this.hasActiveTabClass)
          tab?.classList?.remove(...this.activeTabClasses);
        if (this.hasInactiveTabClass)
          tab?.classList?.add(...this.inactiveTabClasses);
      }
    });
    if (this.hasSelectTarget) {
      this.selectTarget.selectedIndex = this.indexValue;
    }
    if (this.scrollActiveTabIntoViewValue)
      this.scrollToActiveTab();
  }
  // If tabs have horizontal scrolling, the active tab may be out of sight.
  // Make sure the active tab is visible by scrolling it into the view.
  scrollToActiveTab() {
    const activeTab = this.element.querySelector("[aria-selected]");
    if (activeTab)
      activeTab.scrollIntoView({ inline: "center" });
  }
  get tabsCount() {
    return this.tabTargets.length;
  }
  get anchor() {
    return document.URL.split("#").length > 1 ? document.URL.split("#")[1] : null;
  }
};

// src/toggle.js
var toggle_default = class extends Controller {
  static targets = ["toggleable"];
  static values = {
    open: { type: Boolean, default: false }
  };
  toggle(event) {
    this.openValue = !this.openValue;
    this.animate();
  }
  // Sets open to value of checkbox or radio
  toggleInput(event) {
    this.openValue = event.target.checked;
    this.animate();
  }
  hide() {
    this.openValue = false;
    this.animate();
  }
  show() {
    this.openValue = true;
    this.animate();
  }
  animate() {
    this.toggleableTargets.forEach((target) => {
      transition(target, this.openValue);
    });
  }
};
export {
  alert_default as Alert,
  autosave_default as Autosave,
  color_preview_default as ColorPreview,
  dropdown_default as Dropdown,
  modal_default as Modal,
  popover_default as Popover,
  slideover_default as Slideover,
  tabs_default as Tabs,
  toggle_default as Toggle
};
