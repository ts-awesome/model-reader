import _ from './utils';

type Class = new (...args: any) => any;

export interface WithRaw {
  raw: any;
}

export function proxied<T extends Class>(raw: any[], Model: [T], context?: string, strict?: boolean): InstanceType<T>[] & WithRaw;
export function proxied<T extends Class>(raw: any, Model: T, context?: string, strict?: boolean): InstanceType<T> & WithRaw;
export function proxied<T extends Class>(raw: any, Model: any, context?: string, strict = true): any {
  let instance: any = null;

  function target() {
    return instance ?? (instance = _(raw, Model, context ?? 'value', strict as true));
  }

  function keys(): Array<string | number | symbol> {
    const instance = target();
    const keys = Object.keys(instance);
    return keys; //Array.isArray(instance) ? keys.map(Number) : keys;
  }

  return new Proxy({}, {
    get: function (_, key) {
      if (key === 'raw') {
        return raw;
      }
      if (key === 'toJSON') {
        return () => target()
      }
      return target()[key];
    },
    set: function (_, key, value) {
      if (key === 'raw') {
        return false;
      }
      if (key === 'toJSON') {
        return false;
      }

      return target()[key] = value;
    },
    deleteProperty: function (_, key) {
      if (key === 'raw') {
        return false;
      }
      if (key === 'toJSON') {
        return false;
      }
      return (delete target()[key]);
    },
    enumerate: function () {
      return keys();
    },
    ownKeys: function () {
      return keys();
    },
    has: function (_, key) {
      return key in target();
    },
    defineProperty: function (_, key, descr) {
      if (key === 'raw') {
        return;
      }
      if (key === 'toJSON') {
        return;
      }
      Object.defineProperty(target(), key, descr);
      return target();
    },
    getOwnPropertyDescriptor: function (_, key) {
      if (key === 'raw') {
        return {
          value: raw,
          writable: false,
          enumerable: false,
          configurable: false,
        }
      }

      if (key === 'toJSON') {
        return {
          value: () => target(),
          writable: false,
          enumerable: false,
          configurable: false,
        }
      }

      return Object.getOwnPropertyDescriptor(target(), key);
    },
    getPrototypeOf() {
      return Object.getPrototypeOf(target());
    },
    setPrototypeOf(_: {}, proto) {
      return Object.setPrototypeOf(target(), proto);
    },
    isExtensible(): boolean {
      return Object.isExtensible(target());
    },
    preventExtensions(): boolean {
      return Object.preventExtensions(target());
    }
  });
}
