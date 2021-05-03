let blackjackGame = {
 'you': {'scoreSpan':'#your-blackjack-result', 'div':'#your-box','score':0},
 'dealer': {'scoreSpan':'#dealer-blackjack-result', 'div':'#dealer-box','score':0},
 'cards': ['2','3','4','5','6','7',
'8','9','10','K','J','Q','A'],
 'cardsmap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':1},
 'wins': 0,
 'losses': 0,
 'draws': 0,
 'isStand': false,
 'turnsOver': false,
 'logicOver': false
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const bustSound = new Audio('static/sounds/aww.mp3');
const cashSound = new Audio('static/sounds/cash.mp3');
const drawSound = new Audio('static/sounds/draw.mp3');


document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerlogic);
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);



function randomcard() {
 let randomIndex =  Math.floor(Math.random() * 13);
 return blackjackGame['cards'][randomIndex];
}

async function blackjackHit() {
 if (blackjackGame['isStand'] === false) {
  let card = randomcard();
  showcard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
  if (YOU['score'] > 21) {
    await sleep(1000);
    blackjackGame['logicOver'] = false;
    blackjackGame['isStand'] = true;
    dealerlogic();
  }
 }
}

function showcard(card, activePlayer) {
  if (activePlayer['score'] + blackjackGame['cardsmap'][card] <= 21) {
      let cardImage = document.createElement('img');
      cardImage.src = `./static/images/${card}.png`;
      document.querySelector(activePlayer['div']).appendChild(cardImage);
      hitSound.play();
}
}

function blackjackDeal() {

 if (blackjackGame['turnsOver'] === true) {
  blackjackGame['isStand'] = false;
  dealCard (YOU);
  dealCard (DEALER);
  let resultDiv = document.getElementById('blackjack-result');
  resultDiv.innerText = "Let's Play";
  resultDiv.style.color = 'white';
  blackjackGame['turnsOver'] = false;
  blackjackGame['logicOver'] = false;
 }
}

function dealCard(activePlayer) {
 let Images = document.querySelector(activePlayer['div']).querySelectorAll('img');

 for (i=0; i < Images.length; i++) {
   Images[i].remove();
 }
 hitSound.play();
 activePlayer['score'] = 0;
 document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
 document.querySelector(activePlayer['scoreSpan']).style.color = 'white';
}

function updateScore(card, activePlayer) {
  activePlayer['score'] += blackjackGame['cardsmap'][card];
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }else {
  document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
  }
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerlogic() {
  if (blackjackGame['logicOver'] === false){
    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16) {
      let card = randomcard();
      showcard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
      await sleep(2000);
    } 
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    blackjackGame['logicOver'] = true;
  }
}


function computeWinner() {
  let winner;

  if (YOU['score'] <=21) {
    if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
      winner = YOU;
    }else if (YOU['score'] < DEALER['score']) {
      console.log('You lost');
      winner = DEALER;
    }else if (YOU['score'] === DEALER['score']) {
      console.log('You draw');
    }
  }else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    winner = DEALER;
  } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    console.log('You draw');
  }
  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (winner === YOU) {
    message = "YOU WON!";
    messageColor =  "green";
    cashSound.play();
    blackjackGame['wins']++;
    document.getElementById('wins').innerText = blackjackGame['wins'];
  } else if (winner === DEALER) {
    message = "YOU LOST!";
    messageColor = "red";
    bustSound.play();
    blackjackGame['losses']++;
    document.getElementById('losses').innerText = blackjackGame['losses'];
  } else {
    message = "YOU DRAW!";
    messageColor = "black";
    drawSound.play();
    blackjackGame['draws']++;
    document.getElementById('draws').innerText = blackjackGame['draws'];
  }
  resultDiv = document.getElementById("blackjack-result");
  resultDiv.innerText = message;
  resultDiv.style.color =  messageColor;
}


const triggerControl = (event) => {
  let keyCode = event.keyCode;
  if (keyCode == "72") {
    blackjackHit();
  } else if (keyCode == "68") {
    blackjackDeal();
  } else if (keyCode == "74") {
    dealerlogic();
  }
}

addEventListener('keydown', triggerControl);

