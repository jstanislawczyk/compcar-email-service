import {ObjectUtils} from './object.utils';
import {expect} from 'chai';

describe('ObjectUtils', () => {

  describe('isObject', () => {
    describe('should return true if given value', () => {
      it('is object', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject({
          test: 1,
        });

        // Arrange
        expect(result).to.be.true;
      });

      it('is empty object', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject({});

        // Arrange
        expect(result).to.be.true;
      });
    });

    describe('should return false if value', () => {
      it('is undefined', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject(undefined);

        // Arrange
        expect(result).to.be.false;
      });

      it('is null', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject(null);

        // Arrange
        expect(result).to.be.false;
      });

      it('is number', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject(123);

        // Arrange
        expect(result).to.be.false;
      });

      it('is string', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject('test');

        // Arrange
        expect(result).to.be.false;
      });

      it('is empty array', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject([]);

        // Arrange
        expect(result).to.be.false;
      });

      it('is array', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject([]);

        // Arrange
        expect(result).to.be.false;
      });

      it('is array of objects', () => {
        // Arrange
        const result: boolean = ObjectUtils.isObject([{
          test: 1,
        }]);

        // Arrange
        expect(result).to.be.false;
      });
    });
  });
});
