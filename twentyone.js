"use strict";

const readline = require('readline-sync');
const SHUFFLE = require('shuffle-array');

class Card {
  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
  }
}

class Deck {
  static getDeck(suit) {
    const deck = [
      {H: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {D: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {C: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {S: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
    ];

    switch (suit) {
      case "H": return deck[0];
      case "D": return deck[1];
      case "C": return deck[2];
      case "S": return deck[3];
      default: return deck;
    }
  }

  constructor() {
    this.cards = null;
  }

  shuffle() {
    this.cards = SHUFFLE(this.cards);
  }

  deal() {
    //STUB
    // does the dealer or the deck deal?
  }
}

class Participant {

  constructor() {
    this.hand = [];
  }

  hit(deck) {
    this.hand.push(deck.pop());
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }
}

class Player extends Participant {
  constructor() {
    super();
    //STUB
    // What sort of state does a player need?
    // Score? Hand? Amount of money available?
  }
}

class Dealer extends Participant {
  // Very similar to a Player; do we need this?

  constructor() {
    //STUB
    // What sort of state does a dealer need?
    // Score? Hand? Deck of cards? Bow tie?
    super();
    this.hidden = true;
  }

  hide() {
    //STUB
  }

  reveal() {
    this.hidden = false;
  }
}

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  initializeDeck() {
    let allCards = [];

    Deck.getDeck().forEach(suitGroup => {
      let suit = Object.keys(suitGroup)[0];

      suitGroup[suit].forEach(num => {
        allCards.push(new Card(num, suit));
      });
    });

    this.deck.cards = allCards;
    this.deck.shuffle();
  }

  start() {
    //SPIKE
    this.displayWelcomeMessage();
    this.initializeDeck();
    this.dealCards();
    this.showCards(this.formatStructure(this.dealer));
    this.showCards(this.formatStructure(this.player));
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  dealCards() {
    const players = [this.player, this.dealer];

    players.forEach(player => {
      player.hand.push(this.deck.cards.pop(), this.deck.cards.pop());
    });
  }

  formatStructure(player) {
    let index = 0;
    let amount = player.hand.length;
    let number = player.hand[index]["number"];
    let edges = " +-------+";
    let sides = " |       |";
    let middle = number !== 10 ? ` |   ${number}   |` : ` |   ${number}  |`;

    for (let count = 1; count <= amount; count += 1) {
      edges = edges.repeat(count);
      sides = sides.repeat(count);
      middle = middle.repeat(count);
      index += 1;
    }

    return [edges, sides, middle, player];
  }

  showCards(structure) {
    console.log("");
    console.log(structure[3] === this.player ? "Players hand:" : "Dealers hand:");
    console.log("");
    console.log(structure[0]);
    console.log(structure[1]);
    console.log(structure[1]);
    console.log(structure[2]);
    console.log(structure[1]);
    console.log(structure[1]);
    console.log(structure[0]);
  }

  playerTurn() {

    let answer;

    while (true) {
      console.log("Hit or Stay? (h/s): ");
      answer = readline.question("").trimStart();

      if (["h", "hi", "hit"].includes(answer.toLowerCase()[0])) {
        this.player.hit(this.deck.cards);
        break;
      } else if (["s", "st", "sta", "stay"].includes(answer.toLowerCase()[0])) break;

      console.log("Thats not a valid answer!");
    }
  }

  dealerTurn() {
    //STUB
  }

  displayWelcomeMessage() {
    console.log("Welcome to Twenty-one!");
  }

  displayGoodbyeMessage() {
    console.log("Goodbye, thanks for playing!");
  }

  displayResult() {
    //STUB
  }
}

let game = new TwentyOneGame();
game.start();
