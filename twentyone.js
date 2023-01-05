"use strict";

const readline = require('readline-sync');
const SHUFFLE = require('shuffle-array');

class Card {
  static topBottom = " +-------+";
  static sides = " |       |";
  static FACE_CARDS = ["K", "Q", "J"];
  static ACE = "A";

  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
  }

  static convertAce(number) {
    return number > 21 ? 1 : 11;
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
    this.done = false;
  }

  hit(deck) {
    this.hand.push(deck.pop());
  }

  stay() {
    this.done = true;
  }

  isBusted() {
    return this.hand
  }

  score() {
    return this.hand.reduce((prev, current) => {
      let currentNumber;

      if (current["number"] === Card.ACE) {
        currentNumber = Card.convertAce(prev);
      } else if (Card.FACE_CARDS.includes(current["number"])) {
        currentNumber = 10;
      } else {
        currentNumber = current["number"];
      }

      return prev + currentNumber;
    }, 0);
  }
}

class Player extends Participant {
  constructor() {
    super();
  }
}

class Dealer extends Participant {

  constructor() {
    super();
    this.hidden = true;
  }

  hide() {
    this.hand[0] = "?";
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
    this.displayStructure = null;
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

    while (true) {
      this.showCards(this.dealer);
      this.showCards(this.player);
      this.playerTurn();
      if (this.player.done) break;
    }

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
    let playerHand = JSON.parse(JSON.stringify(player.hand));
    let middleLine = [];
    let edges;
    let sides;

    if (player.hidden) playerHand[0]["number"] = "?";

    for (let count = 1; count <= playerHand.length; count += 1) {
      let number = playerHand[index]["number"];
      let middle = number !== 10 ? ` |   ${number}   |` : ` |   ${number}  |`;
      [edges, sides] = [Card.topBottom, Card.sides];

      edges = edges.repeat(count);
      sides = sides.repeat(count);
      middleLine.push(middle);
      index += 1;
    }

    this.displayStructure = [edges, sides, middleLine.join("")];
  }

  showCards(player) {
    this.formatStructure(player);

    console.log("");
    console.log(player === this.player ? "Players hand:" : "Dealers hand:");
    console.log("");
    console.log(this.displayStructure[0]);
    console.log(this.displayStructure[1]);
    console.log(this.displayStructure[1]);
    console.log(this.displayStructure[2]);
    console.log(this.displayStructure[1]);
    console.log(this.displayStructure[1]);
    console.log(this.displayStructure[0]);
  }

  playerTurn() {

    let answer;

    while (true) {
      console.log("Hit or Stay? (h/s): ");
      answer = readline.question("").trimStart();

      if (["h", "hi", "hit"].includes(answer.toLowerCase()[0])) {
        this.player.hit(this.deck.cards);
        break;
      } else if (["s", "st", "sta", "stay"].includes(answer.toLowerCase()[0])) {
        this.player.stay();
        break;
      }

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