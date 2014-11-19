'use strict';

angular
.module('ecg.services')

.factory('Questions', function() {
  // TODO: the questions should be crypted

  var questions = [
    {
      type: 'normal',
      noise: 0,
      answers: [
        { text: 'нормальна екг', correct: true },
        { text: 'TODO', correct: false },
        { text: 'TODO', correct: false },
        { text: 'TODO', correct: false },
      ]
    },
    {
      type: 'normal',
      noise: 0.5,
      answers: [
        { text: 'нормальна екг', correct: true },
        { text: 'TODO', correct: false },
        { text: 'TODO', correct: false },
        { text: 'TODO', correct: false },
      ]
    }
  ];

  function shuffle(array) {
    var i = array.length;
    while(i--) {
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array();
  }

  return function getQuestions(count) {
    // shuffle questions and select first random 'count' of them
    var selectedQuestions = shuffle(questions.slice()).slice(0, count);

    // shuffle answers for each question
    selectedQuestions.forEach(function(question) {
      question.answers = shuffle(question.answers.slice());
    });

    return selectedQuestions;
  }
});
