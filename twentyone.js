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
    // Do we need this since we already have the hit function?
  }
}

class Participant {
  static EMPTY_HAND = new Array();

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
    return this.score() === 21;
  }

  isBusted() {
    return this.score() > 21;
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

    return totalValue > 21 && this.getValues().includes(Card.ACE) ? totalValue - 10 : totalValue;
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
    //SPIKE
    this.displayWelcomeMessage();

    while (true) {
      this.initializeDeck();
      this.dealCards();
      console.log(this.deck.cards.length);

      while (true) {
        if (this.player.done || this.player.isBusted() || this.player.hasTwentyOne()) {
          this.showAllCards();
          break;
        }
        this.showAllCards();
        this.playerTurn();;
      }
      while (true) {
        this.dealer.reveal();
        if (this.player.isBusted() || this.dealer.isBusted() || this.dealer.withinLimit()) {
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

  dealCards() {
    const players = [this.player, this.dealer];

    players.forEach(player => {
      player.hand.push(this.deck.cards.pop(), this.deck.cards.pop());
    });
  }

  showAllCards() {
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
    if (player.hidden === true) {
      playerHand[0]["number"] = "?";
    } else {
      playerHand[0]["number"] = player.hand[0]["number"];
    }

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
  }

  displayGoodbyeMessage() {
    console.log("Goodbye, thanks for playing!");
  }

  displayResult() {

    if (this.player.isBusted()) {
      console.log("You bust! Game over, you lose!");
    } else if (this.dealer.isBusted()) {
      console.log("Dealer bust! you Win!");
    } else if (!this.player.isBusted() && !this.dealer.isBusted()) {
      let message = this.player.score() > this.dealer.score() ?
        "Your score is higher, you win!" :
        "Dealers score is higher, you lose!";

      console.log(message);
    }
  }

  resetHand() {
    this.player.hand = Participant.EMPTY_HAND.slice();
    this.dealer.hand = Participant.EMPTY_HAND.slice(); 
  }

  playAgain() {
    let again;

    while (true) {
      console.log("Would you like to play again? (y/n):");
      again = readline.question("").trimStart();

      if (['y', 'ye', 'yes', 'n', 'no'].includes(again[0].toLowerCase())) break;

      console.log(`"${again}" is not a valid answer`);
    }

    return again[0].toLowerCase() === 'y';
  }
}

let game = new TwentyOneGame();
game.start();