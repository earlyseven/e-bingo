"use strict";

(function(exports){
	function BingoWinningCombinations(){
		// Blackout
		// Square
		// T
		// Double Line
		// Sinle Line

		return {
			'blackout': {
				'prize': 1500,
				'pattern': '11111111111111111111' 
			}
		};
	}

	function Bingo(maxBet,maxCardCount,jackpot){
		this.maxBet 		= maxBet;
		this.maxCardCount 	= maxCardCount; 
		this.jackpot 		= jackpot;
		this.cardCount 		= maxCardCount;
		this.betCount 		= 1 * this.maxBet;
		this.totalBet 		= 1;
		this.roundDrawBalls = [];
		this.extraBalls		= [];
		this.cardsSet 		= [];
		this.cardNumRanges  = [1,30];
		this.CARD_ROWS 		= 5;
		this.CARD_COLS 		= 5;
	}

	Bingo.prototype.addOrSubtractElementCount = function(add,element){

		if( !( element in this ) ){
			console.error(element,' not found.');
			return false;
		}

		if(add == true){
			this[element]++;
		}else{
			this[element]--;
		}
		console.log(element,this[element])
		return this;
	}

	Bingo.prototype.manipulateCardCount = function(add){
		if( add && (this.cardCount < this.maxCardCount) ){
			this.addOrSubtractElementCount(add,'cardCount');
		}else if( !add && (this.cardCount > 0) && (this.cardCount <= this.maxCardCount) ){
			this.addOrSubtractElementCount(add,'cardCount');	
		}else{
			this.cardCount = 1;
		}
		return this;
	}

	Bingo.prototype.generateCardNumbersSet = function(){
		var numberSet = [],
			cardSize = this.CARD_ROWS * this.CARD_COLS;
			for(;;){
				var randomNumber = this.generateRandomNumber();
					if( numberSet.indexOf( randomNumber ) < 0 ){
						numberSet.push( {
							matched : false,
							number 	: randomNumber
						} );
					}
					
					if( numberSet.length == cardSize){
						break;
					}
			}
		return numberSet;
	}

	Bingo.prototype.calculateBet = function(){
		this.totalBet = this.betCount * this.cardCount;
		return this;
	}

	Bingo.prototype.generateCardsSet = function(){
		var i = 0;

		this.cardsSet = [];

		for( i; i < this.cardCount; i++ ){
			var cardNumbersSet = this.generateCardNumbersSet();
				this.cardsSet.push(cardNumbersSet);
		}

		return this;
	}

	Bingo.prototype.generateDrawBalls = function(ballsCount,ballType,extraBallProperties){
		var i = 0,
			maxRange = this.cardNumRanges[1] * 2,
			someRandNum = Math.floor( Math.random( 0, maxRange ) * maxRange );

		this[ballType] = [];

		for( i; i < ballsCount; i++ ){
			var randomNumber = this.generateRandomNumber(),
				randomNumberItem = {
					number 	: randomNumber
				},
				extraBallProperty;

				if( extraBallProperties ){
					for( extraBallProperty in extraBallProperties ){
						randomNumberItem[extraBallProperty] = extraBallProperty[extraBallProperty];
					}
				}

				if( i == someRandNum ){
					randomNumberItem['number'] = 'magic ball';
				}

				this[ballType].push(randomNumberItem);
		}
		return this;
	}

	Bingo.prototype.generateRandomNumber = function(){
		var minNum = this.cardNumRanges[0],
			maxNum = this.cardNumRanges[1];
		return Math.ceil( Math.random(minNum,maxNum) * maxNum );
	}

	Bingo.prototype.getRoundDrawBallsNumbers = function(){
		return this.roundDrawBalls.map(function(ball){
			return ball.number;
		});
	}

	Bingo.prototype.renderDrawBallSetDOM = function($drawBallSet){
		var roundDrawBallsNumbers = this.getRoundDrawBallsNumbers(),
			$table = document.createElement('table'),
			$tr = document.createElement('tr');

			$drawBallSet.innerHTML = null;

			roundDrawBallsNumbers.forEach(function(drawNumber){
				var $td = document.createElement('td');
					$td.innerHTML = drawNumber;
					$td.classList.add('draw-ball');

					$tr.appendChild( $td );
			});

			$table.appendChild( $tr );

			$drawBallSet.appendChild( $table );

			return this;
	}	

	Bingo.prototype.renderCardSetDOM = function($bingoNode,newSet){

		if(newSet){
			this.generateCardsSet();
		}

		$bingoNode.innerHTML = null;

		this.cardsSet.forEach(function(cardSet){

			var $cardsSet = document.createElement('table');
			var $tr = document.createElement('tr');
				cardSet.forEach(function(cardItem,index){

					if( ( ( index ) % 5 ) == 0 ){
						$cardsSet.appendChild( $tr );
						$tr = document.createElement('tr');
					}

					var $td = document.createElement('td');
					
					if(cardItem.matched){
						$td.classList.add('matched');
					}

					$td.innerHTML = cardItem.number;

					$tr.appendChild( $td );
				});

				$bingoNode.appendChild( $cardsSet );

		});

		return this;
	}

	Bingo.prototype.resetCardsSet = function(){
		this.cardsSet = this.cardsSet.map(function(cardSet){
			return cardSet.map(function(cardItem,cardItemIndex){
				cardItem['matched'] = false;
				return cardItem;	
			});
		});
		return this;
	}

	Bingo.prototype.addOrDeductCard = function(add,$playerCardsSet){
		this
			.manipulateCardCount(add)
			.generateCardsSet()
			.calculateBet()
			.renderCardSetDOM($playerCardsSet,false);
	}		

	Bingo.prototype.changeCards = function($playerCardsSet){
		this.renderCardSetDOM($playerCardsSet,true);
	}

	Bingo.prototype.play = function($playerCardsSet,$drawBallsSet){
		console.log('DRAW STARTED',this);
		this
			.resetCardsSet()
			.generateDrawBalls(10,'extraBalls',{open:false})
			.generateDrawBalls(30,'roundDrawBalls',{matched:false});

		var roundDrawBallsNumbers = this.getRoundDrawBallsNumbers();

			this.cardsSet = this.cardsSet.map(function(cardSet){
				return cardSet.map(function(cardItem,cardItemIndex){
					if( roundDrawBallsNumbers.indexOf( cardItem.number ) > -1 ){
						cardItem['matched'] = true;
					}
					return cardItem;	
				});
			});

			this
				.renderCardSetDOM($playerCardsSet,false)
				.renderDrawBallSetDOM($drawBallsSet);
			
			return this;
	}

	Bingo.prototype.autoPlay = function($playerCardsSet,$drawBallsSet){
		var context = this,
			intervalID = null;
			// console.log('intervalID',intervalID);
			return function(continueAutoPlay){
				// console.log('continueAutoPlay',continueAutoPlay);
				if( continueAutoPlay == false ){
					clearInterval(intervalID);
					// console.log('clearin some syit',intervalID);
				}

				intervalID = setInterval(function(){
					context.play($playerCardsSet,$drawBallsSet);
				},2000);
			}
	}

	window.Bingo = window.Bingo || Bingo || Function;

}(window));