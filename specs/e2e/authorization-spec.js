describe('Authorization', function() {
  it('should prevent user from access without credentials', function() {
    browser.get('index.html');
    browser.waitForAngular();

    var form = element(by.css('.form-signin'));
    var container = by.css('.signin-container');

    form.element(by.css('[type="submit"]')).click();
    expect(browser.isElementPresent(container)).toBe(true);
  });

  it('should prevent user from access without password', function() {
    browser.get('index.html');
    browser.waitForAngular();

    var form = element(by.css('.form-signin'));
    var container = by.css('.signin-container');

    form.element(by.model('user.login')).sendKeys('John');

    form.element(by.css('[type="submit"]')).click();
    expect(browser.isElementPresent(container)).toBe(true);
  });

  it('should prevent user from access without login', function() {
    browser.get('index.html');
    browser.waitForAngular();

    var form = element(by.css('.form-signin'));
    var container = by.css('.signin-container');

    form.element(by.model('user.password')).sendKeys('Doe');

    form.element(by.css('[type="submit"]')).click();
    expect(browser.isElementPresent(container)).toBe(true);
  });

  it('should allow user to access with credentials', function() {
    browser.get('index.html');
    browser.waitForAngular();

    var form = element(by.css('.form-signin'));
    var container = by.css('.signin-container');

    form.element(by.model('user.login')).sendKeys('John');
    form.element(by.model('user.password')).sendKeys('Doe');

    form.element(by.css('[type="submit"]')).click();
    expect(browser.isElementPresent(container)).toBe(false);
  });
});
