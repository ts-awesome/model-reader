import 'reflect-metadata';
import _, {ReaderSymbol} from "../src";

describe('reader', () => {
  class SimpleDate extends Date {
    public static [ReaderSymbol](raw: any): SimpleDate {
      const date = raw instanceof Date ? raw : new Date(raw);
      console.log('here', raw, date);
      return new SimpleDate(date.getTime());
    }

    toJSON(): string {
      return this.toString();
    }

    toString(): string {
      return this.toISOString().split('T')[0];
    }
  }

  it('valid date string strict', () => {
    const date = new Date(2020, 1, 1, 1, 2, 3, 0);
    const input = [date.toISOString()];
    const result = _(input, [SimpleDate]);
    expect(result).toEqual([date]);
  });

  it('valid date object strict', () => {
    const date = new Date(2020, 1, 1, 1, 2, 3, 0);
    const input = [date];
    const result = _(input, [SimpleDate]);
    expect(result).toEqual([date]);
  });
});
