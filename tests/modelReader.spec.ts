import {Computer} from './model';
import _ from '../src/utils';

describe('Testing model reader', () => {
    const testRaw: object = {testCase: 'testRaw', testNumber: 1, date: '1995-12-17T03:24:00'};
    function testDate() {
        return new Date('1995-12-17T03:24:00');
    }

    it('Result should be instance of class with the containing raw', () => {
        const result = _(testRaw, null, Computer);
        expect(result).toBeInstanceOf(Computer);
    });

    it('Result should be instance of class with the containing raw(case with Meta)', () => {
        const result = _(testRaw, null, Computer, 'testMeta');
        expect(result).toBeInstanceOf(Computer);
    });

    it('Result should be array filled with instance of class with the containing raw ', () => {
        const result = _([testRaw], null, Computer);
        expect(result![0]).toBeInstanceOf(Computer);
    });

    it('Result should be Date', () => {
       const result = _(testRaw, testDate);
       expect(result).toBeInstanceOf(Date);
    });

    it('Result should be object with the correct data', () => {
        const setC = () => {
          const pc = new Computer();
          pc.id = 2;
          pc.name = 'test_pc';
          pc.price = 1200;
          pc.uid = '213ksada';
          pc.year = 2019;
          return pc;
        };
        const result = _(testRaw, setC, 'testMeta', false);
        expect(result).toBeInstanceOf(Computer);
    })
});