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
      {"H": ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {"D": ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {"C": ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
      {"S": ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]},
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

  hit() {
        //STUB
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
  }
  
  hide() {
      //STUB
  }
  
  reveal() {
      //STUB
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
    this.showCards();
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
  
  showCards() {
      //STUB
  }
  
  playerTurn() {
      //STUB
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