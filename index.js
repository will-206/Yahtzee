'use strict';

// global vars //
const gameStats = {
  playerName: 'player 1',
  remainingRolls: 3,
  highScore: JSON.parse(localStorage.getItem('highScore')) || 0
};

const dice = [
  { currentValue: 0, locked: false },
  { currentValue: 0, locked: false },
  { currentValue: 0, locked: false },
  { currentValue: 0, locked: false },
  { currentValue: 0, locked: false }
];

const scoreCard = {
  aces: { name: 'Aces', score: 0, used: false, section: 'upper' },
  twos: { name: 'Twos', score: 0, used: false, section: 'upper' },
  threes: { name: 'Threes', score: 0, used: false, section: 'upper' },
  fours: { name: 'Fours', score: 0, used: false, section: 'upper' },
  fives: { name: 'Fives', score: 0, used: false, section: 'upper' },
  sixes: { name: 'Sixes', score: 0, used: false, section: 'upper' },
  bonus: { name: 'Bonus', score: 0, used: false, section: 'none' },
  threeOfAKind: { name: 'Three of a kind', score: 0, used: false, section: 'lower' },
  fourOfAKind: { name: 'Four of a kind', score: 0, used: false, section: 'lower' },
  fullHouse: { name: 'Full House', score: 0, used: false, section: 'lower' },
  smStraight: { name: 'Small Straight', score: 0, used: false, section: 'lower' },
  lgStraight: { name: 'Large Straight', score: 0, used: false, section: 'lower' },
  yahtzee: { name: 'Yahtzee!', score: 0, used: false, section: 'lower' },
  chance: { name: 'Chance', score: 0, used: false, section: 'lower' },
  total: { name: 'Total', score: 0, used: false, section: 'none' }
};

// api call //
const $xhr = $.ajax({
  method: 'GET',
  url: 'https://randomuser.me/api/',
  dataType: 'json'
});

$xhr.done((data) => {
  if ($xhr.status !== 200) {
    return;
  }
  gameStats.playerName = (data.results[0].login.username.replace(/\d/g, ''));
});

const updateTips = function() {
  const rolls = gameStats.remainingRolls;

  if (rolls === 3) {
    $('#turnTips').text('');
  }
  else if (rolls === 0) {
    $('#turnTips').text('Click Category to Score');
  }
  else {
    $('#turnTips').text('Click Dice you want to keep and roll again or Click Category to score');
  }
};

// score card functions //
const getScore = function(category) {
  const resultArr = [];
  let score = 0;

  for (const key in dice) {
    resultArr.push(dice[key].currentValue);
  }

  const resultString = resultArr.sort().toString().replace(/,/g, '');

  const addScore = function(number) {
    for (const elem in resultArr) {
      if (resultArr[elem] === number) {
        score += number;
      }
    }
  };

  const total = function() {
    let subTotal = 0;

    for (const elem in resultArr) {
      subTotal += resultArr[elem];
    }

    return subTotal;
  };

  switch (category) {
    case 'aces':
      addScore(1);
      break;

    case 'twos':
      addScore(2);
      break;

    case 'threes':
      addScore(3);
      break;

    case 'fours':
      addScore(4);
      break;

    case 'fives':
      addScore(5);
      break;

    case 'sixes':
      addScore(6);
      break;

    case 'bonus': {
      let subTotalUpper = 0;

      for (const elem in scoreCard) {
        const scoreElem = scoreCard[elem];

        if (scoreElem.used && scoreElem.section === 'upper') {
          subTotalUpper += scoreElem.score;
        }
      }

      if (subTotalUpper >= 63) {
        score = 35;
        scoreCard[category].used = true;
      }
      break;
    }

    case 'threeOfAKind':
      if (/(.)\1{2}/.test(resultString)) {
        score = total();
      }
      break;

    case 'fourOfAKind':
      if (/(.)\1{3}/.test(resultString)) {
        score = total();
      }
      break;

    case 'fullHouse':
      if (/(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/.test(resultString)) {
        score = 25;
      }
      break;

    case 'smStraight':
      if (/1.*2.*3.*4|2.*3.*4.*5|3.*4.*5.*6/.test(resultString)) {
        score = 30;
      }
      break;

    case 'lgStraight':
      if (/12345|23456/.test(resultString)) {
        score = 40;
      }
      break;

    case 'yahtzee':
      if (/(.)\1{4}/.test(resultString)) {
        score = 50;
      }
      break;

    case 'chance':
      score = total();
      break;

    case 'total':
      for (const elem in scoreCard) {
        if (scoreCard[elem].used) {
          score += scoreCard[elem].score;
        }
      }
      if (score > gameStats.highScore) {
        gameStats.highScore = score;
        $('#highScore').text('High Score: ' + gameStats.highScore);
        localStorage.setItem('highScore', JSON.stringify(score));
      }
      break;

    default:
  }

  return score;
};

const drawScoreCard = function() {
  $('#tableBody').empty();
  for (const elem in scoreCard) {
    const $tableRow = $('<tr>');

    $tableRow.addClass('category grey lighten');

    let $td = $('<td>');

    if (scoreCard[elem].name === 'Bonus') {
      $td.text('Bonus (score 35 if sum of above categories >= 63)');
    }
    else {
      $td.text(scoreCard[elem].name);
    }
    $tableRow.append($td);
    $td = $('<td class="center-align">');
    const thisRollScore = getScore(elem.toString());

    $td.text(thisRollScore);

    if (!scoreCard[elem].used && scoreCard[elem].section !== 'none') {
      $tableRow.addClass('grey lighten-5');
      $tableRow.addClass('clickable');
      addRowListeners(elem, $tableRow, thisRollScore);
    }
    else if (scoreCard[elem].section === 'none') {
      scoreCard[elem].score = thisRollScore;
    }
    else {
      $td.text(scoreCard[elem].score);
    }
    $tableRow.append($td);
    $('#tableBody').append($tableRow);
  }
};

const addRowListeners = function(elem, $tr, thisRollScore) {
  $tr.on('click', () => {
    scoreCard[elem].score = thisRollScore;
    scoreCard[elem].used = true;
    gameStats.remainingRolls = 3;
    updateTips();
    resetDice();
    removeDiceListeners();
    removeRollListener();
    addRollListener();
    drawScoreCard();
    removeScoreCardListeners();
    checkGameOver();
    $('#scoreHeader').text("Score: " + scoreCard.total.score);
  });
};

const resetScoreCard = function() {
  for (const elem in scoreCard) {
    scoreCard[elem].score = 0;
    scoreCard[elem].used = false;
  }
};

const removeScoreCardListeners = function() {
  $('.category').off('click');
  $('.category').removeClass('clickable');
  $('.category').removeClass('highlight');
};

const checkGameOver = function() {
  let gameOver = true;

  for (const elem in scoreCard) {
    if (!scoreCard[elem].used && scoreCard[elem].section !== 'none') {
      gameOver = false;
    }
  }
  if (gameOver) {
    $('#controls').addClass('hide');
    $('#finalScore').text(gameStats.playerName + "'s Final Score: " + scoreCard.total.score);
    $('#finalScore').removeClass('hide');
  }
};

// dice functions //
const drawDice = function(face, space) {
  const $dice = $('<div>');

  $dice.addClass('dice clickable');
  const addDot = function(target, number) {
    for (let j = 0; j < number; j++) {
      target.append($('<span>').addClass('dot'));
    }
  };

  switch (face) {
    case 1:
      $dice.addClass('one');
      addDot($dice, 1);
      space.append($dice);
      break;

    case 2:
      $dice.addClass('two');
      addDot($dice, 2);
      space.append($dice);
      break;

    case 3:
      $dice.addClass('three');
      addDot($dice, 3);
      space.append($dice);
      break;

    case 4: {
      $dice.addClass('four');
      let $column = $('<div>');

      $column.addClass('column');
      addDot($column, 2);
      $dice.append($column);
      $column = $('<div>');
      $column.addClass('column');
      addDot($column, 2);
      $dice.append($column);
      space.append($dice);
      break;
    }

    case 5: {
      $dice.addClass('five');
      let $column2 = $('<div>');

      $column2.addClass('column');
      addDot($column2, 2);
      $dice.append($column2);
      $column2 = $('<div>');
      $column2.addClass('column');
      addDot($column2, 1);
      $dice.append($column2);
      $column2 = $('<div>');
      $column2.addClass('column');
      addDot($column2, 2);
      $dice.append($column2);
      space.append($dice);
      break;
    }

    case 6: {
      $dice.addClass('six');
      let $column3 = $('<div>');

      $column3.addClass('column');
      addDot($column3, 3);
      $dice.append($column3);
      $column3 = $('<div>');
      $column3.addClass('column');
      addDot($column3, 3);
      $dice.append($column3);
      space.append($dice);
      break;
    }

    default:
  }
};

const unlockDice = function() {
  for (let i = 0; i < dice.length; i++) {
    dice[i].locked = false;
  }
};

const rollDice = function() {
  for (let i = 0; i < dice.length; i++) {
    if (!dice[i].locked) {
      dice[i].currentValue = Math.floor(Math.random() * 6 + 1);
    }
  }
};

const $diceSpace = function(index) {
  return $('#space' + (index + 1));
};

const drawAllDice = function() {
  for (let i = 0; i < dice.length; i++) {
    $diceSpace(i).empty();
    drawDice(dice[i].currentValue, $diceSpace(i));

    if (dice[i].locked) {
      const $lock = $('<i class="material-icons" >lock</i>');

      $diceSpace(i).append($lock);
    }
  }
};

const resetDice = function() {
  for (let i = 0; i < dice.length; i++) {
    dice[i].currentValue = 6;
  }
  unlockDice();
  drawAllDice();
  $('.dice').removeClass('clickable');

  // reset roll counter
  gameStats.remainingRolls = 3;
  $('#remainingRolls').text('Remaining Rolls: ' + gameStats.remainingRolls);
};

const addDiceListeners = function() {
  for (let i = 0; i < dice.length; i++) {
    $diceSpace(i).on('click', () => {
      if (dice[i].locked) {
        dice[i].locked = false;
      }
      else {
        dice[i].locked = true;
      }
      drawAllDice();
    });
  }
};

const removeDiceListeners = function() {
  for (let i = 0; i < dice.length; i++) {
    $diceSpace(i).off('click');
    $('.dice').removeClass('clickable');
  }
};

// listeners
$(document).ready(() => {
  $('#highScore').text('High Score: ' + gameStats.highScore);
  $('.modal-trigger').leanModal();
});

const removeRollListener = function() {
  unlockDice();
  drawAllDice();
  $('#roll').off('click');
  $('#roll').addClass('grey');
  removeDiceListeners();
};

const addRollListener = function() {
  $('#roll').removeClass('grey');

  $('#roll').on('click', () => {
    removeDiceListeners();
    addDiceListeners();
    rollDice();
    drawAllDice();
    drawScoreCard();
    gameStats.remainingRolls -= 1;
    $('#remainingRolls').text('Remaining Rolls: ' + gameStats.remainingRolls);
    if (gameStats.remainingRolls === 0) {
      removeRollListener();
    }
    updateTips();
    $('.playerName').text('Username: ' + gameStats.playerName);
  });
};

$('#turnTips').on('click', () => {
  $('#turnTips').toggleClass('hide');
});

addRollListener();
$('#newGame').on('click', () => {
  $('#finalScore').addClass('hide');
  removeRollListener();
  addRollListener();
  removeDiceListeners();
  resetDice();
  resetScoreCard();
  drawScoreCard();
  removeScoreCardListeners();
  $('.playerName').text('Username: ' + gameStats.playerName);
  updateTips();
});
