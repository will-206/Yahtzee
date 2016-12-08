'use strict';
// global vars //
const gameStats = {
  playerName: 'player 1',
  remainingRolls: 3,
  highScore: JSON.parse(localStorage.getItem('highScore')) || 1
};

const dice = [
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false}
];

const scoreCard = {
  aces: {name: 'Aces', score: 0, used: false, section: 'upper'},
  twos: {name: 'Twos', score: 0, used: false, section: 'upper'},
  threes: {name: 'Threes', score: 0, used: false, section: 'upper'},
  fours: {name: 'Fours', score: 0, used: false, section: 'upper'},
  fives: {name: 'Fives', score: 0, used: false, section: 'upper'},
  sixes: {name: 'Sixes', score: 0, used: false, section: 'upper'},
  bonus: {name: 'Bonus', score: 0, used: false, section: 'none'},
  threeOfAKind: {name: 'Three of a kind', score: 0, used: false, section: 'lower'},
  fourOfAKind: {name: 'Four of a kind', score: 0, used: false, section: 'lower'},
  fullHouse: {name: 'Full House', score: 0, used: false, section: 'lower'},
  smStraight: {name: 'Small Straight', score: 0, used: false, section: 'lower'},
  lgStraight: {name: 'Large Straight', score: 0, used: false, section: 'lower'},
  yahtzee: {name: 'Yahtzee!', score: 0, used: false, section: 'lower'},
  // yahtzeeBonus: {name: 'Yahtzee Bonus', score: 0, used: false,},
  chance: {name: 'Chance', score: 0, used: false, section: 'lower'},
  total: {name: 'Total', score: 0, used: false, section: 'none'}
};

// api call //
const $xhr = $.ajax({
  method: 'GET',
  url:'https://randomuser.me/api/',
  dataType: 'json'
});

$xhr.done((data) => {
  if ($xhr.status !== 200) {
    return;
  }
  gameStats.playerName = (data.results[0].login.username.replace(/\d/g, ''));
});

$xhr.fail((err) => {
  console.log(err);
});

// score card functions //
function getScore(category) {
  let resultArr = [];
  let score = 0;

  for (let key in dice) {
    resultArr.push(dice[key].currentValue);
  }

  let resultString = resultArr.sort().toString().replace(/,/g, '');

  function addScore(number) {
    for(let elem in resultArr) {
      if (resultArr[elem] === number) {
        score += number;
      }
    }
  }

  function total() {
    let subTotal = 0;
    for(let elem in resultArr) {
      subTotal += resultArr[elem];
    }
    return subTotal;
  }

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

    case 'bonus':
    let subTotalUpper = 0;
    for (let elem in scoreCard) {
      if (scoreCard[elem].used === true && scoreCard[elem].section === 'upper') {
        subTotalUpper += scoreCard[elem].score;
      }
    }

    if (subTotalUpper >= 63) {
      score = 35;
      scoreCard[category].used = true;
    }
    break;

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

    // case 'yahtzeeBonus':
    //  if (/(.)\1{4}/.test(resultString) || yahtzee.scored=true) {
    //    score = 100;
    //  }
    // break;

    case 'chance':
    score = total();
    break;

    case 'total':
    for (let elem in scoreCard) {
      if (scoreCard[elem].used === true) {
        score += scoreCard[elem].score;
      }
    }
    if (score > gameStats.highScore) {
      gameStats.highScore = score;
      $('#highScore').text('High Score: ' + gameStats.highScore);
      localStorage.setItem('highScore', JSON.stringify(score));
    }
    break;
  }
  return score;
}

function drawScoreCard() {
  $('#tableBody').empty();
  for (let elem in scoreCard) {
    let $tableRow = $('<tr>');
    $tableRow.addClass('category');
    let $td = $('<td>');
    if (scoreCard[elem].name === 'Bonus') {
      $td.text('Bonus (score 35 if above categories > 62)');
    } else {
      $td.text(scoreCard[elem].name);
    }
    $tableRow.append($td);
    $td = $('<td>');
    $td.addClass('center-align');
    let thisRollScore = getScore(elem.toString());

    $td.text(thisRollScore);

    if (scoreCard[elem].used === false && scoreCard[elem].section !== 'none') {
      $td.addClass('indigo lighten-5');
      console.log("why you stop");
      $tableRow.addClass('clickable');
      addRowListeners(elem, $tableRow, thisRollScore);
    } else if (scoreCard[elem].section === 'none') {
      scoreCard[elem].score = thisRollScore;
    } else {
      $td.text(scoreCard[elem].score);
    }
    $tableRow.append($td);
    $('#tableBody').append($tableRow);
  }
}

function addRowListeners(elem, $tr, thisRollScore) {
  $tr.on('click', () => {
    scoreCard[elem].score = thisRollScore;
    scoreCard[elem].used = true;
    gameStats.remainingRolls = 3;
    updateTips();
    drawScoreCard();
    removeScoreCardListeners();
    resetDice();
    removeDiceListeners();
    removeRollListener();
    addRollListener();
    checkGameOver();
  });
}

function resetScoreCard() {
  for (const elem in scoreCard) {
    scoreCard[elem].score = 0;
    scoreCard[elem].used = false;
  }
}

function removeScoreCardListeners() {
  $('.category').off('click');
  $('.category').removeClass('clickable');
}

function updateTips() {
  const rolls = gameStats.remainingRolls;
  if (rolls === 3) {
    $('#turnTips').text('Click Roll');
  }
  else if (rolls === 0){
    $('#turnTips').text('Click Category to Score');
  } else {
    $('#turnTips').text('Click Dice you wish to keep and roll again or Click Category to score');
  }
}

function checkGameOver() {
  let gameOver = true;
  for (const elem in scoreCard) {
    if (scoreCard[elem].used === false && scoreCard[elem].section !== 'none') {
      gameOver = false;
    }
  }
  if (gameOver) {
    $('#controls').addClass('hide');
    $('#finalScore').text(gameStats.playerName + "'s Final Score: " + scoreCard.total.score);
    $('#finalScore').removeClass('hide');
  }
}
// dice functions //
function drawDice(face, space) {
  const $dice = $('<div>');
  $dice.addClass('dice clickable');
  function addDot(target, number) {
    for(let j = 0; j < number; j++) {
      target.append($('<span>').addClass('dot'));
    }
  }
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

    case 4:
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

    case 5:
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

    case 6:
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
  }
}

function unlockDice() {
  for (let i = 0; i < dice.length; i++) {
    dice[i].locked = false;
  }
}
function resetDice() {
  for (let i = 0; i< dice.length; i++) {
    dice[i].currentValue = 6;
  }
  unlockDice();
  drawAllDice();
  $('.dice').removeClass('clickable');
  //reset roll counter
  gameStats.remainingRolls = 3;
  $('#remainingRolls').text('Remaining Rolls: ' + gameStats.remainingRolls);
}
function rollDice() {
  for (let i = 0; i < dice.length; i++) {
    if (!dice[i].locked) {
      dice[i].currentValue = Math.floor(Math.random() * 6 + 1);
    }
  }
}

function $diceSpace(index) {
  return $('#space' + (index + 1));
}

function drawAllDice() {
  for (let i = 0; i < dice.length; i++) {
    $diceSpace(i).empty();    drawDice(dice[i].currentValue, $diceSpace(i));

    if (dice[i].locked) {
      let $lock = $('<i class="material-icons" >lock</i>');
      $diceSpace(i).append($lock);
    }
  }
}

function addDiceListeners() {
  for (let i = 0; i < dice.length; i ++) {
    $diceSpace(i).on('click', (event) => {
      if (dice[i].locked) {
        dice[i].locked = false;
      } else {
        dice[i].locked = true;
      }
      drawAllDice();
    });
  }
}

function removeDiceListeners() {
  for (let i = 0; i < dice.length; i ++) {
    $diceSpace(i).off('click');
    $('.dice').removeClass('clickable');
  }
}

// listeners
$(document).ready(function() {
  $('#highScore').text('High Score: ' + gameStats.highScore);
  $('.modal-trigger').leanModal();
});

function addRollListener() {
  $('#roll').removeClass('grey');

  $('#roll').on('click', (event) => {
    removeDiceListeners();
    addDiceListeners();
    rollDice();
    drawAllDice();
    drawScoreCard();
    gameStats.remainingRolls --;
    $('#remainingRolls').text('Remaining Rolls: ' + gameStats.remainingRolls);
    if (gameStats.remainingRolls === 0) {
      removeRollListener();
    }
    updateTips();
  });
}

function removeRollListener() {
  unlockDice();
  drawAllDice();
  $('#roll').off('click');
  $('#roll').addClass('grey');
  removeDiceListeners();
}

$('#turnTips').on('click', () => {
  $('#turnTips').toggleClass('hide');
});

$('#newGame').on('click', () => {
  $('#finalScore').addClass('hide');
  removeRollListener();
  addRollListener();
  $('#controls').removeClass('hide');
  removeDiceListeners();
  resetDice();
  resetScoreCard();
  drawScoreCard();
  removeScoreCardListeners();
  $('.playerName').text(gameStats.playerName);
  updateTips();
});
