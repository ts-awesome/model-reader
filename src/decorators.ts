import 'reflect-metadata';
import {ReaderMetaSymbol} from "./symbols";
import _ from './utils';

interface Deserializer<T=any> {
  (raw: any, meta: string, strict: boolean): T;
}

function ensureMetadata(proto: any): Record<string, Deserializer> {
  if (typeof proto[ReaderMetaSymbol] !== 'object') {
    proto[ReaderMetaSymbol] = {};
  }

  return proto[ReaderMetaSymbol];
}

function last<T>(x: T[]): T | undefined {
  return x.length ? x[x.length - 1] : undefined;
}

function first<T>(x: T[]): T | undefined {
  return x.length ? x[0] : undefined;
}

export function readable(target: any, key: string): void;
export function readable(nullable?: true): PropertyDecorator;
export function readable(name: string, nullable?: true): PropertyDecorator;
export function readable<T extends Function>(name: string, model: T, nullable?: true): PropertyDecorator;
export function readable<T extends Function>(model: T, nullable?: true): PropertyDecorator;
export function readable<T extends Function>(name: string, items: [T], nullable?: true): PropertyDecorator;
export function readable<T extends Function>(items: [T], nullable?: true): PropertyDecorator;
export function readable(...args: unknown[]): PropertyDecorator | void {
  let src: string | undefined = undefined;
  let nullable = false;
  let Model: any = undefined;

  if (args.length > 1 && typeof args[1] === 'string') {
    const [target, key] = args as [object, string | symbol];
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return decorator(target, key);
  }

  src = typeof first(args) === 'string' ? args.shift() as string : undefined;
  nullable = typeof last(args) === 'boolean' ? args.pop() as boolean : false;
  [Model = undefined] = args as any[];

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return decorator;

  function decorator (target: Object, dest: string | symbol): void {
    if (typeof dest !== 'string') {
      throw new Error(`@readable works only on string keys`);
    }

    if (Model === undefined) {
      const autoType = Reflect.getOwnMetadata("design:type", target, dest);
      if (autoType === Object || autoType === Array || autoType === undefined) {
        throw new Error(`Please add explicit model for key "${dest}". Auto detect failed.`);
      }

      Model = autoType;
    }

    ensureMetadata(target.constructor)[dest] = ((raw, meta): any =>
      _(raw[src ?? dest], Model, meta, !nullable as any));
  }
}
