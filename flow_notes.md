# Notes

## Card and deck object

- The deck consists of 52 `cards`
- Each single card is an individual Object
    - What does this object look like?
        -------
        - Number
        - Suit
        -------
- Since the deck consists of 52 cards,
    - How can we structure the deck status with individual cards?
    
### Problem
We need to create a structure that contains all individual (52) cards in a deck and store the value into a property (state)

### example
cons(number, suit)
cards: [{}, {}...];
[
    {H: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {D: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {C: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {S: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K}
]

new Card(3, C)

{number: 3,
 suit: C
}

[
    {H: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {D: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {C: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K},
    {S: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K}
]

{H: [A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K]}

[A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K]

new Card(current number, current suit)
{A, H}
[] >> [{A, H}]
{2, H}
[{A, H}] >> [{A, H}, {2, H}] >>return
....

next

{A, D}
{2, D}

....

### Data structure
Array with multiple objects (52)

[
    {},
    {},
    ...
]

### Algorithm

Create a static method that displays an array of objects that contain the suit as the single key, and an array of all possible nums in that suite

1. Create a static method
2. Create an array with the objects
3. the static method takes 1 argument but has a default of none
    - the arg given will return the designated argument.
        - This method only accepts strings of 'H', 'D', 'C', 'S' or no args


main method

[] empty array

1. Iterate over each suit and its numbers
2. for the current suit, iterate over the numbers array
3. for each element within the array, create a new Card where the first arg is the number, and the second arg is the current object key name
  - push the new card object into the empty array
4. After iteration, return the "empty" array

## Deal cards

- method is currently in main game class
- method would point to its "Deck" property
  - deck property's hand property would be modified

- we need to take the current deck array, remove a random card (obj) and add it to the hand

dealCards:

for each participant:
  the array value within the hand property adds the last card of the deck array