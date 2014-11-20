function login(user, password) {
  var form = element(by.css('.form-signin'));

  form.element(by.model('user.login')).sendKeys(user);
  form.element(by.model('user.password')).sendKeys(password);

  form.submit();
}

function getAnswer(index) {
  return element
    .all(by.repeater('answer in question.answers'))
    .then(function(rows) {
      return rows[index].getWebElement();
    });
}

function hasClass(element, cls) {
  return element.getAttribute('class').then(function(classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

describe('Questions', function() {
  it('should appears after authorization', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    var answersLocator = by.repeater('answer in question.answers');
    expect(browser.isElementPresent(answersLocator)).toBe(true);

    var simulatorLocator = by.css('ecg-simulator');
    expect(browser.isElementPresent(simulatorLocator)).toBe(true);
  });

  it('should be in count of 5', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    var questionCountLocator = by.binding('questCount');
    expect(browser.isElementPresent(questionCountLocator)).toBe(true);
    expect(element(questionCountLocator).getText()).toBe('5');
  });

  it('should start from 1st question', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    var questionCountLocator = by.binding('questNum');
    expect(browser.isElementPresent(questionCountLocator)).toBe(true);
    expect(element(questionCountLocator).getText()).toBe('1');
  });

  it('shouldn`t display accept button before the answer is selected', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    var nextQuestionLocation = by.css('[ng-click="getNextQuestion()"]');
    expect(element(nextQuestionLocation).isDisplayed()).toBe(false);
  });

  it('should display accept button after the answer is selected', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    getAnswer(0)
      .then(function(answer) {
        answer.click();

        var nextQuestionLocation = by.css('[ng-click="getNextQuestion()"]');
        expect(element(nextQuestionLocation).isDisplayed()).toBe(true);
      });
  });

  it('should display accept button after the answer is selected', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    getAnswer(0)
      .then(function(answer) {
        answer.click();
        expect(hasClass(answer, 'active')).toBe(true);

        return getAnswer(1);
      })
      .then(function(answer) {
        expect(hasClass(answer, 'active')).toBe(false);
        answer.click();

        return getAnswer(0);
      })
      .then(function(answer) {
        expect(hasClass(answer, 'active')).toBe(false);
      });
  });

  it('should be able to get to finish', function() {
    browser.get('index.html');
    browser.waitForAngular();
    login('John', 'Doe');

    var nextQuestionLocation = by.css('[ng-click="getNextQuestion()"]');
    var questionCountLocator = by.binding('questNum');

    var promise = getAnswer(0)
      .then(function(answer) {
        answer.click();
        element(nextQuestionLocation).click();
        return getAnswer(0);
      })
      .then(function(answer) {
        expect(browser.isElementPresent(questionCountLocator)).toBe(true);
        expect(element(questionCountLocator).getText()).toBe('2');

        answer.click();
        element(nextQuestionLocation).click();
        return getAnswer(0);
      })
      .then(function(answer) {
        expect(browser.isElementPresent(questionCountLocator)).toBe(true);
        expect(element(questionCountLocator).getText()).toBe('3');

        answer.click();
        element(nextQuestionLocation).click();
        return getAnswer(0);
      })
      .then(function(answer) {
        expect(browser.isElementPresent(questionCountLocator)).toBe(true);
        expect(element(questionCountLocator).getText()).toBe('4');

        answer.click();
        element(nextQuestionLocation).click();
        return getAnswer(0);
      })
      .then(function(answer) {
        expect(browser.isElementPresent(questionCountLocator)).toBe(true);
        expect(element(questionCountLocator).getText()).toBe('5');

        answer.click();
        element(nextQuestionLocation).click();

        expect(browser.isElementPresent(questionCountLocator)).toBe(false);
        expect(browser.isElementPresent(by.css('.result-page'))).toBe(true);

        return true;
      });

    browser.wait(function() { return promise; });
  });
});
