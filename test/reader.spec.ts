import 'reflect-metadata';
import _, {readable} from "../src";

describe('reader', () => {

  describe('(raw: any[], convertTo: [typeof Date], ...)', () => {
    it('valid date strict', () => {
      const date = new Date(2020, 1, 1, 1, 2, 3, 0);
      const input = [date.toISOString()];
      const result = _(input, [Date]);
      expect(result).toEqual([date]);
    })

    it('null date non-strict', () => {
      const result = _([null], [Date], false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: typeof Date, ...)', () => {
    it('valid date strict', () => {
      const date = new Date(2020, 1, 1, 1, 2, 3, 0);
      const input = date.toISOString();
      const result = _(input, Date);
      expect(result).toEqual(date);
    })

    it('null date non-strict', () => {
      const result = _(null, Date, false);
      expect(result).toEqual(null);
    })
  })

  describe('(raw: any[], convertTo: [typeof Number], ...)', () => {
    it('valid number strict', () => {
      const value = 123;
      const input = [value.toString()];
      const result = _(input, [Number]);
      expect(result).toEqual([value]);
    })

    it('null number non-strict', () => {
      const result = _([null], [Number], false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: typeof Number, ...)', () => {
    it('valid number strict', () => {
      const value = 123;
      const input = value.toString();
      const result = _(input, Number);
      expect(result).toEqual(value);
    })

    it('null number non-strict', () => {
      const result = _(null, Number, false);
      expect(result).toEqual(null);
    })
  })

  describe('(raw: any[], convertTo: [typeof String], ...)', () => {
    it('valid string strict', () => {
      const value = "123";
      const input = [Number(value)];
      const result = _(input, [String]);
      expect(result).toEqual([value]);
    })

    it('null string non-strict', () => {
      const result = _([null], [String], false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: typeof String, ...)', () => {
    it('valid string strict', () => {
      const value = "123";
      const input = Number(value);
      const result = _(input, String);
      expect(result).toEqual(value);
    })

    it('null string non-strict', () => {
      const result = _(null, String, false);
      expect(result).toEqual(null);
    })
  })

  describe('(raw: any[], convertTo: [typeof Boolean], ...)', () => {
    it('valid bool strict', () => {
      const value = true;
      const input = ["true", "false", 1, 0, true, false];
      const result = _(input, [Boolean]);
      expect(result).toEqual([value, !value, value, !value, value, !value]);
    })

    it('null bool non-strict', () => {
      const result = _([null], [Boolean], false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: typeof Boolean, ...)', () => {
    it('valid bool strict', () => {
      const value = false;
      const input = String(value);
      const result = _(input, Boolean);
      expect(result).toEqual(value);
    })

    it('null bool non-strict', () => {
      const result = _(null, Boolean, false);
      expect(result).toEqual(null);
    })
  })

  function clone<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
  }

  describe('(raw: any[], convertTo: null, constructor: T, ...)', () => {
    class Model {
      @readable public id!: number;
      @readable public value!: string;

      constructor(id: number, value: string) {
        this.id = id;
        this.value = value;
      }
    }

    it('valid obj strict', () => {
      const value = new Model(1, "test");
      const input = [clone(value)];
      const result = _(input, null, Model);
      expect(result).toEqual([value]);
    })

    it('null obj non-strict', () => {
      const result = _([null], null, Model, false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: null, constructor: T, ...)', () => {
    class Model {
      @readable public id!: number;
      @readable public value!: string;

      constructor(id: number, value: string) {
        this.id = id;
        this.value = value;
      }
    }

    it('valid obj strict', () => {
      const value = new Model(1, "test");
      const input = clone(value);
      const result = _(input, null, Model);
      expect(result).toEqual(value);
    })

    it('null obj non-strict', () => {
      const result = _(null, null, Model, false);
      expect(result).toEqual(null);
    })
  })

  describe('(raw: any[], convertTo: [T], ...)', () => {
    class Model {
      @readable public id!: number;
      @readable public value!: string;

      constructor(id: number, value: string) {
        this.id = id;
        this.value = value;
      }
    }

    it('valid obj strict', () => {
      const value = new Model(1, "test");
      const input = [clone(value)];
      const result = _(input, [Model]);
      expect(result).toEqual([value]);
    })

    it('null obj non-strict', () => {
      const result = _([null], [Model], false);
      expect(result).toEqual([null]);
    })
  })

  describe('(raw: any, convertTo: T, ...)', () => {
    it('valid obj strict', () => {
      class Model {
        @readable public id!: number;
        @readable public value!: string;

        constructor(id: number, value: string) {
          this.id = id;
          this.value = value;
        }
      }

      const value = new Model(1, "test");
      const input = clone(value);
      const result = _(input, Model);
      expect(result).toEqual(value);
    })

    it('invalid obj strict', () => {
      class Model {
        @readable public id!: number;
      }

      const input = {id: null};
      expect(()=> {
        _(input, Model, 'input')
      }).toThrowError(`Could not deserialize input.id. Value expected.`);
    })

    it('invalid submodel strict', () => {
      class Model {
        @readable public id!: number;
        @readable(true) public sub!: Model;
      }

      const input = {id: 1, sub: {id: null}};
      expect(()=> {
        _(input, Model, 'input')
      }).toThrowError(`Could not deserialize input.sub.id. Value expected.`);
    })

    it('invalid sub array model strict', () => {
      class Model {
        @readable public id!: number;
        @readable([Model], true) public sub!: Model[];
      }

      const input = {id: 1, sub: [{id: 2}, {id: null}]};
      expect(()=> {
        _(input, Model, 'input')
      }).toThrowError(`Could not deserialize input.sub[1].id. Value expected.`);
    })

    it('valid tree model strict', () => {
      class Model {
        @readable public id!: number;
        @readable([Model], true) public sub!: Model[];
      }

      const input = {id: 1, sub: [{id: 2}, {id: 3}]};
      const result = _(input, Model);
      expect(JSON.stringify(result)).toBe(JSON.stringify(input));
    })

    it('valid model with remapping strict', () => {
      class Model {
        @readable('_id') public id!: number;

        constructor(id: number) {
          this.id = id;
        }
      }

      const input = {_id: 1, sub: [{id: 2}, {id: 3}]};
      const result = _(input, Model);
      expect(result).toEqual(new Model(1));
    })

    it('null obj non-strict', () => {
      class Model {}
      const result = _(null, Model, false);
      expect(result).toEqual(null);
    })
  })

});
