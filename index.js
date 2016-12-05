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
drawScoreCard();
