"use strict";
let playerName = "Player 1"
const $xhr = $.ajax({
  method: 'GET',
  url:'https://randomuser.me/api/',
  dataType: 'json'
});

$xhr.done((data) => {
  if ($xhr.status !== 200) {
    return;
  }
  playerName = (data.results[0].login.username.replace(/\d/g, ""));
});

$xhr.fail((err) => {
  console.log(err);
});
// global vars //
let remainingRolls = 3;

const dice = [
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false},
  {currentValue: 0, locked: false}
];

const scoreCard = {
  aces: {name: "Aces", score: 0, used: false},
  twos: {name: "Twos", score: 0, used: false},
  threes: {name: "Threes", score: 0, used: false},
  fours: {name: "Fours", score: 0, used: false},
  fives: {name: "Fives", score: 0, used: false},
  sixes: {name: "Sixes", score: 0, used: false},
  bonus: {name: "Bonus", score: 0, used: false},
  threeOfAKind: {name: "Three of a kind", score: 0, used: false},
  fourOfAKind: {name: "Four of a kind", score: 0, used: false},
  fullHouse: {name: "Full House", score: 0, used: false},
  smStraight: {name: "Small Straight", score: 0, used: false},
  lgStraight: {name: "Large Straight", score: 0, used: false},
  yahtzee: {name: "Yahtzee!", score: 0, used: false},
  // yahtzeeBonus: {name: "Yahtzee Bonus", score: 0, used: false},
  chance: {name: "Chance", score: 0, used: false},
  total: {name: "Total", score: 0, used: false}
}
// score card functions //
function getScore(category) {
  let resultArr = [];
  let score = 0;

  for (let key in dice) {
    resultArr.push(dice[key].currentValue);
  }

  let resultString = resultArr.sort().toString().replace(/,/g, "");

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
    case "aces":
    addScore(1);
    break;

    case "twos":
    addScore(2);
    break;

    case "threes":
    addScore(3);
    break;

    case "fours":
    addScore(4);
    break;

    case "fives":
    addScore(5);
    break;

    case "sixes":
    addScore(6);
    break;

    case "bonus":
    //if above categories >= 63
    //score = 35
    let subtotal = 0;
    for (let i = 0; i < 6; i++) {
      console.log(scoreCard[i]);
      // subtotal +=
    }
    if (subtotal >= 63) {
      score = 35;
    }
    break;

    case "threeOfAKind":
    if (/(.)\1{2}/.test(resultString)) {
      score = total();
    }
    break;

    case "fourOfAKind":
    if (/(.)\1{3}/.test(resultString)) {
      score = total();
    }
    break;

    case "fullHouse":
    if (/(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/.test(resultString)) {
      score = 25;
    }
    break;

    case "smStraight":
    if (/1.*2.*3.*4|2.*3.*4.*5|3.*4.*5.*6/.test(resultString)) {
      score = 30;
    }
    break;

    case "lgStraight":
    if (/12345|23456/.test(resultString)) {
      score = 40;
    }
    break;

    case "yahtzee":
    if (/(.)\1{4}/.test(resultString)) {
      score = 50;
    }
    break;

    case "yahtzeeBonus":
    // if (/(.)\1{4}/.test(resultString) || yahtzee.scored=true) {
    //   score = 100;
    // }
    break;

    case "chance":
    score = total();
    break;

    case "total":
    for (let elem in scoreCard) {
      if (scoreCard[elem].used === true) {
        score += scoreCard[elem].score;
      }
    }
    break;
  }
  return score;
}

// function drawScoreCard() {
//   $('#tableBody').empty();
//   for (let elem in scoreCard) {
//     let $tableRow = $('<tr>');
//     let thisScore = getScore(elem.toString())
//     if (scoreCard[elem].used === true) {
//       $tableRow.addClass('indigo lighten-5');
//       thisScore = scoreCard[elem].score;
//     } else {
//       $tableRow.on('click', (event) => {
//         scoreCard[elem].score = thisScore;
//         scoreCard[elem].used = true;
//         drawScoreCard();
//         resetDice();
//       });
//       // $(".total").off('click');
//       // remove event listener from total and bonus row
//     }
//     let $td = $('<td>');
//     $td.addClass('category');
//     $td.text(scoreCard[elem].name);
//     $tableRow.append($td);
//     $td = $('<td>');
//     // $td.text(getScore(elem.toString()));
//     $td.text(thisScore);
//     $td.addClass("value");
//     $tableRow.append($td);
//     $('#tableBody').append($tableRow);
//   }
// }
function drawScoreCard() {
  $('#tableBody').empty();
  for (let elem in scoreCard) {
    let $tableRow = $('<tr>');
    let thisScore = getScore(elem.toString())
    let $td = $('<td>');
    $td.addClass('category');
    $td.text(scoreCard[elem].name);
    $tableRow.append($td);
    $td = $('<td>');
    // $td.text(getScore(elem.toString()));
    $td.text(thisScore);

    $td.addClass("center-align");
    function scoreable(category) {
      if (category !== "total" && category !== "bonus") {
        return true;
      }
      return false;
    }
    $td.addClass("indigo lighten-5");

    if (scoreCard[elem].used === true || !scoreable(elem)) {
      $td.removeClass('indigo lighten-5');
      thisScore = scoreCard[elem].score;
    } else {
      $tableRow.on('click', (event) => {
        scoreCard[elem].score = thisScore;
        scoreCard[elem].used = true;
        drawScoreCard();
        resetDice();
      });
    }

    // $td.addClass("value");
    $tableRow.append($td);
    $('#tableBody').append($tableRow);
  }
}

function resetScoreCard() {
  for (const elem in scoreCard) {
    scoreCard[elem].score = 0;
    scoreCard[elem].used = false;
  }
}

// dice functions //
function drawDice(face, space) {
  const $dice = $('<div>');
  $dice.addClass('dice');
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
}
function rollDice() {
  for (let i = 0; i < dice.length; i++) {
    if (!dice[i].locked) {
      dice[i].currentValue = Math.floor(Math.random() * 6 + 1);
    }
  }
  // unlockDice();
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
  }
}

// listeners
$(document).ready(function() {
  $('.modal-trigger').leanModal();
});

$('#newGame').on('click', (event) => {
  $('#controls').removeClass('hide');
  removeDiceListeners();
  resetDice();
  resetScoreCard()
  drawScoreCard();
  $('.playerName').text(playerName);
});

$('#roll').on('click', (event) => {
  removeDiceListeners();
  addDiceListeners();
  rollDice();
  drawAllDice();
  drawScoreCard();
  remainingRolls --;
  console.log(remainingRolls);
});
