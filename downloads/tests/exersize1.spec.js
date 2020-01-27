const { fizzBuzz } = require('./exersize1');

describe('fizzBuzz', () => {
  it('should throw an exeption if input is not a number', () => {
    const args = [null, undefined, false, 'a', [], {}];

    args.forEach(arg => {
      expect(() => { fizzBuzz(arg) }).toThrow();
    });
  });

  it('should return FizzBuzz if input is divisible by 3 and 5', () => {
    const result = fizzBuzz(15);
    expect(result).toBe('FizzBuzz');
  });

  it('should return Fizz if input is only divisible by 3', () => {
    const result = fizzBuzz(3);
    expect(result).toBe('Fizz');
  });

  it('should return Buzz if input is only divisible by 5', () => {
    const result = fizzBuzz(5);
    expect(result).toBe('Buzz');
  });

  it('should return input number if input is not divisible by 3 or 5', () => {
    const result = fizzBuzz(8);
    expect(result).toBe(8);
  });
});
