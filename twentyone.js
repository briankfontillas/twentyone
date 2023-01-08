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
}

class Participant {
  static EMPTY_HAND = [];
  static WINNING_SCORE = 21;

  constructor() {
    this.hand = Participant.EMPTY_HAND.slice();
    this.done = false;
  }

  hit(deck) {
    this.hand.push(deck.pop());
  }

  stay() {
    this.done = true;
  }

  getValues() {
    return this.hand.map(card => card["number"]);
  }

  hasTwentyOne() {
    return this.score() === Participant.WINNING_SCORE;
  }

  isBusted() {
    return this.score() > Participant.WINNING_SCORE;
  }

  score() {
    let hasAce = false;
    let totalValue = this.getValues().reduce((total, currentValue) => {

      if (Card.FACE_CARDS.includes(currentValue)) {
        currentValue = 10;
      } else if (currentValue === Card.ACE && !hasAce) {
        hasAce = true;
        currentValue = 11;
      } else if (currentValue === Card.ACE && hasAce) {
        currentValue = 1;
      }

      return total + currentValue;
    }, 0);

    return totalValue > Participant.WINNING_SCORE &&
      this.getValues().includes(Card.ACE) ? totalValue - 10 : totalValue;
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
    this.hidden = true;
  }

  reveal() {
    this.hidden = false;
  }

  withinLimit() {
    return this.score() >= 17;
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
    this.displayWelcomeMessage();

    while (true) {
      this.initializeDeck();
      this.dealCards();
      while (true) {
        if (this.passesTurn(this.player)) {
          this.showAllCards();
          break;
        }
        this.showAllCards();
        this.playerTurn();
      }
      while (!this.player.isBusted()) {
        this.dealer.reveal();
        if (this.passesTurn(this.dealer)) {
          this.showAllCards();
          break;
        }
        this.showAllCards();
        this.dealerTurn();
      }
      this.showAllCards();
      this.displayResult();
      if (!this.playAgain()) break;
      this.resetHand();
    }

    this.displayGoodbyeMessage();

  }

  passesTurn(player) {
    return player === this.player ?
      (this.player.done ||
        this.player.isBusted() ||
        this.player.hasTwentyOne()) :
      (this.dealer.isBusted() || this.dealer.withinLimit());
  }

  dealCards() {
    const players = [this.player, this.dealer];

    players.forEach(player => {
      player.hand.push(this.deck.cards.pop(), this.deck.cards.pop());
    });

    this.dealer.hide();
  }

  showAllCards() {
    console.clear();
    let dealerScoreText = this.dealer.hidden ? "?" : this.dealer.score();

    this.showCards(this.dealer);
    this.showCards(this.player);
    console.log(`Dealers score: ${dealerScoreText} | Players score: ${this.player.score()}`);
    console.log("");
  }

  formatStructure(player) {
    let index = 0;
    let playerHand = JSON.parse(JSON.stringify(player.hand));
    let middleLine = [];
    let edges;
    let sides;

    playerHand[0]["number"] = player.hidden === true ? "?" :
      player.hand[0]["number"];

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
    readline.question("Dealer will hit (press enter to continue)");
    this.dealer.hit(this.deck.cards);
  }

  displayWelcomeMessage() {
    console.log("Welcome to Twenty-one!");
    readline.question("press enter to continue...");
  }

  displayGoodbyeMessage() {
    console.log("Goodbye, thanks for playing!");
  }

  displayResult() {

    if (this.player.isBusted()) {
      console.log("You bust! Game over, you lose!");
    } else if (this.dealer.isBusted()) {
      console.log("Dealer bust! you Win!");
    } else if (!this.player.isBusted() && !this.dealer.isBusted() &&
      this.player.score() > this.dealer.score()) {
      console.log("Your score is higher, you win!");
    } else if (!this.player.isBusted() && !this.dealer.isBusted() &&
      this.player.score() < this.dealer.score()) {
      console.log("Dealer's score is higher, you lose!");
    } else {
      console.log("It's a tie! Scores are the same.");
    }
  }

  resetHand() {
    this.player.hand = Participant.EMPTY_HAND.slice();
    this.dealer.hand = Participant.EMPTY_HAND.slice();
    this.player.done = false;
  }

  playAgain() {
    let again;

    while (true) {
      console.log("Would you like to play again? (y/n):");
      again = readline.question("").trimStart();

      if (['y', 'ye', 'yes', 'n', 'no'].includes(again.toLowerCase()[0])) break;

      console.log(`"${again}" is not a valid answer`);
    }

    return again.toLowerCase()[0] === 'y';
  }
}

let game = new TwentyOneGame();
game.start();