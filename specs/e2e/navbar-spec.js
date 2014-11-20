function login(user, password) {
  var form = element(by.css('.form-signin'));

  form.element(by.model('user.login')).sendKeys(user);
  form.element(by.model('user.password')).sendKeys(password);

  form.submit();
}

describe('Navigation bar', function() {
  it('should display current user`s login', function() {
    browser.get('index.html');
    browser.waitForAngular();

    login('John', 'Doe');
    var elem = element(by.css('.navbar-text')).element(by.binding('user.login'));

    expect(elem.getText()).toBe('John');

    browser.get('index.html');
    browser.waitForAngular();

    login('nhoJ', 'Doe');
    var elem = element(by.css('.navbar-text')).element(by.binding('user.login'));

    expect(elem.getText()).toBe('nhoJ');
  });

  it('should provide `log out` ability', function() {
    browser.get('index.html');
    browser.waitForAngular();

    login('John', 'Doe');
    element(by.css('#navbar')).element(by.css('[ng-click="signOut()"]')).click();

    var signinContainer = by.css('.signin-container');
    expect(browser.isElementPresent(signinContainer)).toBe(true);
  });

  it('should allow `log in` after `log out`', function() {
    browser.get('index.html');
    browser.waitForAngular();

    login('John', 'Doe');
    element(by.css('#navbar')).element(by.css('[ng-click="signOut()"]')).click();

    var signinContainer = by.css('.signin-container');
    expect(browser.isElementPresent(signinContainer)).toBe(true);

    login('nhoJ', 'Doe');

    var elem = element(by.css('.navbar-text')).element(by.binding('user.login'));
    expect(elem.getText()).toBe('JohnnhoJ');
  });
});
