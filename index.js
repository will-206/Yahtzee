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
  bonus: {name: "Bonus", score: 0},
  threeOfAKind: {name: "Three of a kind", score: 0, used: false},
  fourOfAKind: {name: "Four of a kind", score: 0, used: false},
  fullHouse: {name: "Full House", score: 0, used: false},
  smallStraight: {name: "Small Straight", score: 0, used: false},
  lgStraight: {name: "Large Straight", score: 0, used: false},
  yahtzee: {name: "Yahtzee!", score: 0, used: false},
  yahtzeeBonus: {name: "Yahtzee Bonus", score: 0, used: false},
  chance: {name: "Chance", score: 0, used: false},
  total: {name: "Total", score: 0}
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
    $td.text(scoreCard[elem].score);
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
  space2: {currentValue: 5, locked: false},
  space3: {currentValue: 4, locked: false},
  space4: {currentValue: 3, locked: false},
  space5: {currentValue: 2, locked: false},
  space6: {currentValue: 1, locked: false}
}
function resetDiceValue() {
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
    dice[key].currentValue = random();
  }
}
function drawAllDice() {
  for (let key in dice) {
    drawDice(dice[key].currentValue, $('#'+ key));
  }
}
function gameLoop() {
  $('#newGame').on('click', (event) => {
    resetDiceValue();
    $('#controls').removeClass('hide');
    drawScoreCard();
    drawAllDice();
    $('#roll').on('click', (event) => {
      rollDice();
      drawAllDice();
    });
  });
}
gameLoop();
