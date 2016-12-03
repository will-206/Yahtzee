"use strict";

function random () {
  return Math.floor(Math.random() * 6 + 1);
}
function makeScoreCard() {
  let categories = ["Aces", "Twos", "Threes", "Fours", "Fives", "Sixes", "Bonus", "3 of a kind", "4 of a kind", "Full House", "Sm Straight", "Lg Straight", "Yahtzee!", "Yahtzee Bonus", "Chance", "Total"];
  for (let elem in categories) {
    console.log(categories[elem]);
  }
}
makeScoreCard();
