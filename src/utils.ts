import {ReaderSymbol, ReaderMetaSymbol} from "./symbols";
import {ReaderError} from "./errors";

type Class = new (...args: any) => any;

function last<T>(x: T[]): T | undefined {
  return x.length ? x[x.length - 1] : undefined;
}

export default function _(raw: any[], convertTo: [typeof Date], meta: string): Date[] | null;
export default function _(raw: any[], convertTo: [typeof Date], meta: string, strict: false): Date[] | null;
export default function _(raw: any[], convertTo: [typeof Date], meta: string, strict: true): Date[];
export default function _(raw: any[], convertTo: [typeof Date]): Date[] | null;
export default function _(raw: any[], convertTo: [typeof Date], strict: false): Date[] | null;
export default function _(raw: any[], convertTo: [typeof Date], strict: true): Date[];
export default function _(raw: any, convertTo: typeof Date, meta: string): Date | null;
export default function _(raw: any, convertTo: typeof Date, meta: string, strict: false): Date | null;
export default function _(raw: any, convertTo: typeof Date, meta: string, strict: true): Date;
export default function _(raw: any, convertTo: typeof Date): Date | null;
export default function _(raw: any, convertTo: typeof Date, strict: false): Date | null;
export default function _(raw: any, convertTo: typeof Date, strict: true): Date;
export default function _<T>(raw: any[], convertTo: [(raw: any) => T], meta: string): T[] | null;
export default function _<T>(raw: any[], convertTo: [(raw: any) => T], meta: string, strict: false): T[] | null;
export default function _<T>(raw: any[], convertTo: [(raw: any) => T], meta: string, strict: true): T[];
export default function _<T>(raw: any[], convertTo: [(raw: any) => T]): T[] | null;
export default function _<T>(raw: any[], convertTo: [(raw: any) => T], strict: false): T[] | null;
export default function _<T>(raw: any[], convertTo: [(raw: any) => T], strict: true): T[];
export default function _<T>(raw: any, convertTo: (raw: any) => T, meta: string): T | null;
export default function _<T>(raw: any, convertTo: (raw: any) => T, meta: string, strict: false): T | null;
export default function _<T>(raw: any, convertTo: (raw: any) => T, meta: string, strict: true): T;
export default function _<T>(raw: any, convertTo: (raw: any) => T): T | null;
export default function _<T>(raw: any, convertTo: (raw: any) => T, strict: false): T | null;
export default function _<T>(raw: any, convertTo: (raw: any) => T, strict: true): T;
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T, meta: string): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T, meta: string, strict: false): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T, meta: string, strict: true): InstanceType<T>[];
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T, strict: false): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: null, constructor: T, strict: true): InstanceType<T>[];
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T, meta: string): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T, meta: string, strict: false): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T, meta: string, strict: true): InstanceType<T>;
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T, strict: false): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: null, constructor: T, strict: true): InstanceType<T>;
export default function _<T extends Class>(raw: any[], convertTo: [T], meta: string): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: [T], meta: string, strict: false): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: [T], meta: string, strict: true): InstanceType<T>[];
export default function _<T extends Class>(raw: any[], convertTo: [T]): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: [T], strict: false): InstanceType<T>[] | null;
export default function _<T extends Class>(raw: any[], convertTo: [T], strict: true): InstanceType<T>[];
export default function _<T extends Class>(raw: any, convertTo: T, meta: string): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: T, meta: string, strict: false): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: T, meta: string, strict: true): InstanceType<T>;
export default function _<T extends Class>(raw: any, convertTo: T): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: T, strict: false): InstanceType<T> | null;
export default function _<T extends Class>(raw: any, convertTo: T, strict: true): InstanceType<T>;
export default function _(raw: unknown, convertTo: unknown, ...args: any[]): any {
  const strict: boolean = typeof last(args) === 'boolean' ? args.pop() : false;
  const meta: string = typeof last(args) === 'string' ? args.pop() : 'value';
  const Constructor = convertTo === null ? args.shift() : undefined;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return read(raw, convertTo, Constructor, meta, strict);
}

interface Deserializer<T=any> {
  (raw: any, meta: string, strict: boolean): T;
}

function isIterable(obj) {
  // checks for null and undefined
  if (typeof obj !== 'object' || obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function iterate<T, X>(x: Iterable<T>, iterator: (x, idx) => X): X[] {
  const res: X[] = [];
  let idx = 0;
  for(const value of x) {
    res.push(iterator(value, idx++));
  }
  return res;
}

function fromEntries (iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj
  }, {})
}

function read(raw: any, convertTo: any, Constructor: Function | undefined, meta: string, strict: boolean): any {
  if (raw == null) {
    if (strict) {
      throw new ReaderError(`Could not deserialize ${meta}. Value expected.`)
    }
    return raw;
  }

  // (raw, null, Constructor) case
  if (convertTo === null) {
    if (isIterable(raw)) {
      return iterate(raw, (_, idx) => read(_, null, Constructor, `${meta}[${idx}]`, strict));
    }
    if (typeof Constructor !== 'function') {
      throw new ReaderError(`Could not deserialize ${meta}. Constructor expected to be a function.`)
    }
    if (typeof raw !== 'object') {
      if (strict) {
        throw new ReaderError(`Could not deserialize ${meta}. Object expected, got ${typeof raw}.`)
      }
      return null;
    }
    const value = {...raw};
    Object.setPrototypeOf(value, Constructor.prototype);
    return value;
  }

  // (raw, [Model]) case
  if (Array.isArray(convertTo)) {
    const [Model] = convertTo;
    if (Model == null) {
      throw new ReaderError(`Could not deserialize ${meta}. Model expected, got ${typeof Model}.`)
    }
    if (!isIterable(raw)) {
      if (strict) {
        throw new ReaderError(`Could not deserialize ${meta}. Iterable expected, got ${typeof raw}.`)
      }
      return null;
    }
    return iterate(raw, (_, idx) => read(_, Model, undefined, `${meta}[${idx}]`, strict));
  }

  if (convertTo == null) {
    throw new ReaderError(`Could not deserialize ${meta}. convertTo expected to be a function, got ${typeof convertTo}`);
  }

  // (raw, Model) case with custom DeserializerSymbol
  if (convertTo[ReaderSymbol]) {
    const reader = convertTo[ReaderSymbol];
    if (typeof reader !== 'function') {
      throw new ReaderError(`Could not deserialize ${meta}. ${convertTo.name}[ReaderSymbol] expected to be a function.`)
    }
    return reader(raw, meta, strict);
  }

  // (raw, Model) case with @serializable declarations
  if (convertTo[ReaderMetaSymbol]) {
    const props: Record<string, Deserializer> = convertTo[ReaderMetaSymbol];
    if (typeof props !== 'object') {
      throw new ReaderError(`Could not deserialize ${meta}. ${convertTo.name} metadata is corrupted.`)
    }

    const values = Object.entries(props)
      .map(([prop, converter]) => [prop, converter(raw, `${meta}.${prop}`, strict)]);
    return read(fromEntries(values), null, convertTo, meta, strict);
  }

  // (raw, Date) case
  if (convertTo === Date) {
    const value = new Date(raw);
    if (isNaN(value.getTime())) {
      if (strict) {
        throw new ReaderError(`Could not deserialize ${meta}. Valid Date() argument is expected.`)
      }
      return null;
    }
    return value;
  }

  if (convertTo === Boolean) {
    return typeof raw === 'string' && raw.toLowerCase() === 'false' ? false : !!raw;
  }

  if (convertTo === Number) {
    const value = Number(raw);
    if (isNaN(value)) {
      if (strict) {
        throw new ReaderError(`Could not deserialize ${meta}. Valid Number is expected.`)
      }
      return null;
    }
    return value;
  }

  if (typeof convertTo !== 'function') {
    throw new ReaderError(`Could not deserialize ${meta}. convertTo expected to be a function, got ${typeof convertTo}`);
  }

  if (convertTo === Function) {
    if (typeof raw !== 'function') {
      if (strict) {
        throw new ReaderError(`Could not deserialize ${meta}. Valid Function is expected.`)
      }
      return null;
    }
    return raw;
  }

  // (raw, ((x: any) => T)) case, eg Number, String, RegExp
  try {
    return convertTo(raw);
  } catch (e) {
    throw new ReaderError(`Could not deserialize ${meta}: ${Object.getPrototypeOf(e)?.constructor?.name ?? (typeof e)} ${e.message ?? e}`);
  }
}
