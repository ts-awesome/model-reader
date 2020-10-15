import {readable} from '../src/decorators';
import {Computer} from './model';

describe('Testing function readable', () => {
    const testName = 'testName';

    it('Case when model and name has been set, should return PropertyDecorator', () => {
       const result = readable(testName, Computer, true);
       console.log(result);
       expect(result).toBeInstanceOf(Function);
    });

    it('Case when only name has been set, should return PropertyDecorator', () => {
       const result = readable(testName, true);
       expect(result).toBeInstanceOf(Function)
    });

    it('Case when array items have been set', () => {
       const result = readable([Computer], true);
       expect(result).toBeInstanceOf(Function);
    });

});