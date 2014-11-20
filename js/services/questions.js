'use strict';

angular
.module('ecg.services')

.factory('Questions', function() {
  // TODO: the questions should be crypted

  var questions = [
    {
      type: 'normal',
      noise: 0.0,
      answers: [
        { id: 0, text: 'нормальна екг', correct: true },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'idioventricularRhythm',
      noise: 0.0,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: true },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'acceleratedJunctionalRhythm',
      noise: 0.0,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: true },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'firstDegreeAVBlock',
      noise: 0.0,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: true },
      ]
    },
    {
      type: 'acceleratedIdioventricularRhythm',
      noise: 0.0,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'прискорений ідіовентрикулярний ритм', correct: true },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },

    {
      type: 'normal',
      noise: 0.5,
      answers: [
        { id: 0, text: 'нормальна екг', correct: true },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'idioventricularRhythm',
      noise: 0.5,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: true },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'acceleratedJunctionalRhythm',
      noise: 0.5,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: true },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
    {
      type: 'firstDegreeAVBlock',
      noise: 0.5,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'ідіовентрикулярний ритм', correct: false },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: true },
      ]
    },
    {
      type: 'acceleratedIdioventricularRhythm',
      noise: 0.5,
      answers: [
        { id: 0, text: 'нормальна екг', correct: false },
        { id: 1, text: 'прискорений ідіовентрикулярний ритм', correct: true },
        { id: 2, text: 'прискоренный вузловой ритм', correct: false },
        { id: 3, text: 'атріовентрикулярна блокада 1 ступеню', correct: false },
      ]
    },
  ];

  function shuffle(array) {
    var i = array.length;
    while(--i) {
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
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
