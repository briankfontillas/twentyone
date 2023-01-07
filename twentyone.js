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

  constructor() {
    this.hand = [];
    this.done = false;
    this.points = 0;
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
    // return this.hand.reduce((prev, current) => {
    //   let currentNumber;

    //   if (current["number"] === Card.ACE) {
    //     currentNumber = Card.convertAce(prev);
    //   } else if (Card.FACE_CARDS.includes(current["number"])) {
    //     currentNumber = 10;
    //   } else {
    //     currentNumber = current["number"];
    //   }

    //   return prev + currentNumber;
    // }, 0);
    //STUB
    //--------------------
    // we have an array [2, 4, A, A, K]
    // will have an indicator that an ace has been added
    // iterate, adding all values
      // if the element is a face card, add 10
      // if the element an ace,
        //if indicator is false
          // set to true
          // add 11
        //if indicator is true
          // add 1
    // after total is made, if value is over 21, subtract 10 and return value
    // if not, return value

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
      if (this.player.done || this.player.isBusted() || this.player.hasTwentyOne()) {
        this.showAllCards();
        break;
      }
      this.showAllCards();
      this.playerTurn();;
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
    //stub
    //If i bust, i need only my final hand to display, then i need a message saying that I busted, then a msg saying i lost
    //If dealer busts, i need to display dealers final hand (revealed), and my final hand and a message stating dealer busted
      //then a msg saying i won
    //if nobody busts, the player with the highest score wins and a win message for that player appears
  }

  playAgain() {
    //Stub
  }
}

let game = new TwentyOneGame();
game.start();