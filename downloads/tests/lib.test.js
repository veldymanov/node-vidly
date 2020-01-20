const lib = require('./lib');

describe('absolute', () => {
  it('should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1); // toBeCloseTo(), toEqual()
  });

  it('should return a positive number if input is negative', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it('should return zero if input is zero', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe('greet', () => {
  it('should return the greeting message', () => {
    const result = lib.greet('Andrew');

    expect(result).toMatch(/Andrew/);
    expect(result).toContain('Andrew');
  });
});

describe('getCurrencies', () => {
  it('should return supported currencies', () => {
    const result = lib.getCurrencies();

    // Too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // Too specific
    expect(result[0]).toBe('USD');
    expect(result[1]).toBe('AUD');
    expect(result[2]).toBe('EUR');
    expect(result.length).toBe(3);

    // Better way
    expect(result).toContain('USD');
    expect(result).toContain('AUD');
    expect(result).toContain('EUR');

    // Proper way
    const expected = ['USD', 'AUD', 'EUR'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});

describe('getProduct', () => {
  it('should return product with the given id', () => {
    const result = lib.getProduct(1);

    // Too general
    expect(result).toBeDefined();

    // Too specific
    expect(result).toEqual({ id: 1, price: 10 });

    // Proper way
    expect(result).toMatchObject({ id: 1, price: 10 });
    expect(result).toMatchObject({ id: 1 });
    expect(result).toHaveProperty('id', 1);
  });
});

describe('registerUser', () => {
  it('should throw an exeption if username is falsy', () => {
    const args = [null, undefined, '', NaN, false];

    args.forEach(arg => {
      expect(() => { lib.registerUser(arg) }).toThrow();
    });
  });

  it('should return a user object if valid username is passed', () => {
    const result = lib.registerUser('Andrew');

    expect(result).toHaveProperty('username', 'Andrew');
    expect(result.id).toBeGreaterThan(0);
  });
});

describe('applyDiscount', () => {
  const order = {
    customerId: 13,
    totalPrice: 100
  };
  lib.applyDiscount(order);

  expect(order.totalPrice).toBeCloseTo(100 * 0.9);
});
