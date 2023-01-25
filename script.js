/**
 * Function which build pack of Cards as an Array and as an Object
 * @param {*} asArray - which decides whether to return as an Array or as an Object
 * @returns - packArr if asArray is true, else packObj
 */
function buildCards(asArray=true){
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
    const packArr = []
    const packObj = {}

    // write your code here
    for(let i in suits){
        for(let j in values){
           let str= values[j]+" of "+suits[i];
            packArr.push(str);
            packObj[str]=parseInt(j)+1;
        }
    }


    if(!asArray){
        return packObj;
    }
    return packArr;
}

/**
 * Define Deck class
 */
class Deck {
    constructor() {
        this.deck = [];
        this.reset(); //Add 52 cards to the deck
        this.shuffle(); //Suffle the deck
    } //End of constructor


    /**
     * Resetting the Deck
     * Hint: use buildCards in this method
     */
    reset() {
        // write your code here
        this.deck=[];
        this.deck=buildCards(true);
    } //End of reset()


    /**
     * Shuffling the cards
     */
    shuffle() {
        // write your code here
        let j=this.deck.length;
        for(let i=0;i<j;i++){
            let suits=Math.floor(Math.random()*j)
            let values=this.deck[i];
            this.deck[i]=this.deck[suits];
            this.deck[suits]=values;
        }
    } //End of shuffle()

    /**
     * Deal a card
     * @returns {String} A Card from the deck of cards
     */
    deal() {
        // write your code here
       return this.deck.pop();
    } //End of deal()

    /**
     * Check if the Deck is empty
     * @returns {Boolean} True or False 
     */
    isEmpty() {
        // write your code here
        if(this.deck.length==0){
            return 1;
        }
        else{
            return 0;
        }
    } //End of isEmpty()

    /**
     * Remaining cards in the Deck
     * @returns {Number} Number of cards in the Deck
     */
    length() {
        // write your code here
       return this.deck.length;
    } //End of length()

} //End of Deck Class


/**
 * Define Card Class
 */
class Card {
    constructor(card) {
        this.card = card;

        // Get all cards as an Object with key as card name and value as the number of the card
        const cardValues = buildCards(false);

        this.value = cardValues[card];
        this.suit = card.substring(card.indexOf(" of ") + 4);
        this.placeHolder = null;
        this.flipped = false;

        var suits = { 'Hearts': 0, 'Diamonds': 13, 'Clubs': 26, 'Spades': 39 }
        this.position = suits[this.suit] + this.value; //Position in a sorted deck
    } //End of Constructor

    /**
     * Method to display the card
     * @param {*} placeHolder 
     * @param {*} flipped 
     */
    displayCard(placeHolder, flipped = true) {
        this.placeHolder = document.getElementById(placeHolder);
        this.placeHolder.classList.add("card");
        this.flipped = flipped;
        if (flipped) {
            this.placeHolder.style.backgroundPosition = -150 * this.position + "px";
        } else {
            this.placeHolder.style.backgroundPosition = "0px";
        }
    } // End of displayCard

    /**
     * Method to flip the card
     */
    flip() {
        if (this.flipped) {
            this.placeHolder.style.backgroundPosition = "0px";
            this.flipped = false;
        } else {
            this.placeHolder.style.backgroundPosition = -150 * this.position + "px";
            this.flipped = true;
        }
    } //End of flip()

} //End of Card class

/**
 * Functions which help Play the BlackJack game 
 */
const deck = new Deck();
let card1, card2, playerCard1, playerCard2, playerCard3, playerCard4;

let playerTotal = 0;
let dealerTotal = 0;

/**
 * Dealing initial Cards
 */
function initialDeal() {
    if (deck.length() < 7) {
        deck.reset();
        deck.shuffle();
    }

    // Deal(Instantiate) 2 Dealer cards and 2 Player cards

    card1=new Card(deck.deal());
    card2=new Card(deck.deal());
    playerCard1=new Card(deck.deal());
    playerCard2=new Card(deck.deal());

    // Open the board with 2 Dealer cards (one Dealer card is closed) and 2 Player cards (both open)

    card1.displayCard('card1',1);
    card2.displayCard('card2',0);
    playerCard1.displayCard('playerCard1',1);
    playerCard2.displayCard('playerCard2',1);

    // Setting face card values to 10

    card1.value=card1.value>10?10:card1.value;
    card2.value=card2.value>10?10:card2.value;
    playerCard1.value=playerCard1.value>10?10:playerCard1.value;
    playerCard2.value=playerCard2.value>10?10:playerCard2.value;


    // Getting player cards total - show an alert only if there is a Blackjack
    /*
    // Alert to show Blackjack
        cuteAlert({
            type: "success",
            title: "Superb!!!",
            message: "Blackjacked !!!",
            buttonText: "Wohoo !!!",
            img:"success.svg"
        }).then(() => {
            location.reload()  // Load a new game
        })
    */

        playerTotal=playerCard1.value+playerCard2.value;
        if(playerTotal==21){
            cuteAlert({
                type:'success',
                title: "superb!!!",
                message: "Blackjacked !!!",
                buttonText: "wohoo !!!",
                img:"success.svg"
            }).then(() => {
                location.reload()
            })
        }

} //End of deal()

/**
 * If the Player stands with his cards - the Dealer has to flip his closed card and determine who wins the game
 */
function stand() {
    // flip Dealer cards and compare

    card2.flip();
    dealerTotal=card1.value+card2.value;
    


    // Checking Dealer and Player score - to give the result using cuteAlerts (just like the alert in initialDeal function)

    if(playerTotal>=dealerTotal){
        cuteAlert({
            type:'success',
            title:"congratulations !!!",
            message:"You won the game",
            buttonText:"yayy !",
            img:"success.svg"
            
        }).then(() => {
            location.reload()
        })
    }
        else{
            cuteAlert({
            type:"error",
            title:"oh no !!!",
            message:"dealer won the game",
            buttonText:"ok",
            img:"error.svg"
        }).then(() => {
            location.reload()
        })}

}

// Variable to track the extra cards dealed
let extraCnt = 0;

/**
 * function which deals extra playercards - Max. 2 cards
 */
function hit() {
    let dealButton = document.getElementById("deal");

    // Dealing the extra cards that the player requests

    playerCard3=new Card(deck.deal());
    playerCard4=new Card(deck.deal());
    if(extraCnt ==0){
        playerCard3.displayCard('playerCard3',1);
        playerCard3.value=playerCard3>10?10:playerCard3.value;
        playerTotal=playerTotal+playerCard3.value;
    }
    else if(extraCnt ==1){
        playerCard4.displayCard('playerCard4',1);
        playerCard4.value=playerCard4>10?10:playerCard4.value;
        playerTotal=playerTotal+playerCard4.value;

    }
    else{
        dealButton.style.display='none';
        cuteAlert({
            type:'warning',
            title:'sorry',
            message:'max cards dealed',
            buttonText:'ok',
            img:'warning.svg'
        })
    }


    // Dealing new cards 
    // Use conditional block
    /*
    When 4 cards are dealed use the following code
        dealButton.style.display = 'none'
        // Alert - Max. Cards dealed
        cuteAlert({
            type: "warning",
            title: "Sorry...",
            message: "Max. Cards dealed",
            buttonText: "OK",
            img:"warning.svg"
        })
    */

        if(playerTotal>21){
            cuteAlert({
                type:'error',
                title:'busted',
                message:'you lost the game',
                buttonText:'ok',
                img:'error.svg'
            }).then(() =>{location.reload()})
        }
        else{
            21==playerTotal&&cuteAlert({
                type:'success',
                title:'superb',
                message:'blackjacked',
                buttonText:'wooh',
                img:'success.svg'
            }).then(() => {
                location.reload()
            });
        }


    // Checking the total of the player cards before dealing new cards
        // cuteAlert - Player looses the game - as score is more than 21
        // cuteAlert - Player wins with BlackJack !!!


    // Increment extra card count
    extraCnt++;
}
 
/**
 * Initial Deal
 */
initialDeal();
