const lib = require('./lib');
const db = require('./db');
const mail = require('./mail');

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
  it('should apply 10% discount customer has more than 10 points', () => {
    // mock

    db.getCustomerSync = function(customerId) {
      console.log('Fake reading customer...');
      return { id: customerId, points: 13 };
    }

    const order = { customerId: 1, totalPrice: 100 };
    lib.applyDiscount(order);

    expect(order.totalPrice).toBeCloseTo(100 * 0.9);
  })

});

describe('notifyCustomer', () => {
  it('should send an notification email to the customer', () => {
    // jest mock
    // const mockFunction = jest.fn();
    // mockFunction.mockReturnValue(1);
    // mockFunction.mockResovedValue(1);
    // mockFunction.mockRejectedValue(new Error('...'));
    db.getCustomerSync = jest.fn().mockReturnValue({ id: 1,  email: 'fake@email.com' });
    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send).toHaveBeenCalledWith('fake@email.com', 'Your order was placed successfully.');
    expect(mail.send.mock.calls[0][0]).toBe('fake@email.com');
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
})
