"use strict";

(function(domReady){
	domReady(function(){
		var $playerCardsSet = document.getElementById('player-cards-set'),
			$drawBallsSet = document.getElementById('draw-balls-set'),
			$changeCards = document.getElementById('change-cards'),
			$addCard = document.getElementById('add-card'),
			$deductCard = document.getElementById('deduct-card'),
			$play = document.getElementById('play'),
			$autoPlay = document.getElementById('auto-play'),
			bingoMachineOne;

			bingoMachineOne = new Bingo(10,10,15000);
			bingoMachineOne.renderCardSetDOM($playerCardsSet,true);

			$addCard.addEventListener('click',function(){
				bingoMachineOne.addOrDeductCard(true,$playerCardsSet);
			});

			$deductCard.addEventListener('click',function(){
				bingoMachineOne.addOrDeductCard(false,$playerCardsSet);
			});

			$changeCards.addEventListener('click',function(){
				bingoMachineOne.changeCards($playerCardsSet);
			});

			$play.addEventListener('click',function(){
				bingoMachineOne.play($playerCardsSet,$drawBallsSet);
			});

			(function(){
				var autoPlay = bingoMachineOne.autoPlay($playerCardsSet,$drawBallsSet),
					continueAutoPlay = true;
			
					$autoPlay.addEventListener('click',function(){
						// console.log('continueAutoPlay',continueAutoPlay)
						autoPlay(continueAutoPlay);
						continueAutoPlay = !continueAutoPlay;
					});
			}());
	});

}(domReady));