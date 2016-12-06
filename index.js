"use strict";

function random() {
  return Math.floor(Math.random() * 6 + 1);
}

const scoreCard = {
  aces: {name: "Aces", score: 0, used: false},
  twos: {name: "Twos", score: 0, used: false},
  threes: {name: "Threes", score: 0, used: false},
  fours: {name: "Fours", score: 0, used: false},
  fives: {name: "Five", score: 0, used: false},
  sixes: {name: "Sixes", score: 0, used: false},
  bonus: {name: "Bonus", score: 0, used: false},
  threeOfAKind: {name: "Three of a kind", score: 0, used: false},
  fourOfAKind: {name: "Four of a kind", score: 0, used: false},
  fullHouse: {name: "Full House", score: 0, used: false},
  smStraight: {name: "Small Straight", score: 0, used: false},
  lgStraight: {name: "Large Straight", score: 0, used: false},
  yahtzee: {name: "Yahtzee!", score: 0, used: false},
  yahtzeeBonus: {name: "Yahtzee Bonus", score: 0, used: false},
  chance: {name: "Chance", score: 0, used: false},
  total: {name: "Total", score: 0}
}

function getScore(category) {
  let resultArr = [];
  let resultObj = {};
  for (let key in dice) {
    resultArr.push(dice[key].currentValue);
    if ("key" in resultObj) {
      key ++;
    } else {
      resultObj.key = 1;
    }
  }
  console.log(resultObj);
  let score = 0;

  function addScore(number) {
    for(let elem in resultArr) {
      if (resultArr[elem] === number) {
        score += number;
      }
    }
  }

  function countDuplicates() {

  }

  function total(){
    let total = 0;
    for(let elem in resultArr) {
      total += resultArr[elem];
    }
    return total;
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
    break;

    case "threeOfAKind":
    //
    //score = total;
    break;

    case "fourOfAKind":
    //
    //score = total;
    break;

    case "fullHouse":
    //
    //score = 25
    break;

    case "smStraight":
    //4 in a row
    //score = 30
    break;

    case "lgStraight":
    //5 in a row
    //score = 40
    break;

    case "yahtzee":
    //all same
    //score = 50
    break;

    case "yahtzeeBonus":
    //score = 100
    break;

    case "chance":
    score = total;
    break;

    case "total":
    //add up every "used" category
    break;
  }
  // console.log(score);
  return score;
}
function drawScoreCard() {
  $('#tableBody').empty();
  for (let elem in scoreCard) {
    let $tableRow = $('<tr>');
    let $td = $('<td>');
    $td.addClass('category');
    $td.text(scoreCard[elem].name);
    $tableRow.append($td);

    $td = $('<td>');
    $td.text(getScore(elem.toString()));
    $td.addClass("value");
    $tableRow.append($td);
    $('#tableBody').append($tableRow);
  }
}

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
const dice = {
  space1: {currentValue: 6, locked: false},
  space2: {currentValue: 6, locked: false},
  space3: {currentValue: 6, locked: false},
  space4: {currentValue: 6, locked: false},
  space5: {currentValue: 6, locked: false},
}
function resetDice() {
  for (let key in dice) {
    dice[key].currentValue = 6;
  }
  unlock();
}
function unlock() {
  for (let key in dice) {
    dice[key].locked = false;
  }
}
function rollDice() {
  for (let key in dice) {
    if (!dice[key].locked) {
      dice[key].currentValue = random();
    }
  }
}
function drawAllDice() {
  for (let key in dice) {
    $('#' + key).empty();
    drawDice(dice[key].currentValue, $('#' + key));

    if (dice[key].locked) {
      let $lock = $('<i class="material-icons" >lock</i>');
      $('#' + key).append($lock);
    }
  }
  // console.log(getScore("aces"));
  drawScoreCard();
}
function addDiceListeners() {
  for (let key in dice) {
    $('#' + key).on('click', (event) => {
      if (dice[key].locked) {
        dice[key].locked = false;
      } else {
        dice[key].locked = true;
      }
      drawAllDice();
    });
  }
}
function gameLoop() {
  $('#newGame').on('click', (event) => {
    resetDice();
    $('#controls').removeClass('hide');
    drawScoreCard();
    drawAllDice();
    addDiceListeners();
    $('#roll').on('click', (event) => {
      rollDice();
      drawAllDice();
    });
  });
}
gameLoop();
