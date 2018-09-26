/**
* this is a class for generate game results either star or score.
* @class
* @author     NejiElYahya
*/

var Result = function(){

}


Result.prototype.init = function() {
	console.log('init Result');
	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	// get last game from scorm
	// var game_quiz = game.scorm_helper.getQuizResult(["game_slide_4"]);
	// console.log(game_quiz);
	// count all game score range 0-5 for the star
	// var score = parseInt(game_quiz["score"])/parseInt(game_quiz["total_soal"])*game.max_score;
	var score = game.game_data['curr_score'];
	// var score = 100;
	console.log(score);
	// count score range 0-100 for save to cmi.raw.score
	var count = score/game.max_score*100;
	// for score in text
	$(".txt_score").html(score);
	// save score to to cmi.raw.score
	// game.scorm_helper.sendResult(count);
	game.scorm_helper.sendResult(score);
	// set duration and save to scorm
	// game.scorm_helper.setDuration();
	// if score larger than minimum grade
	if(score >= game.min_score){
		// set to win
		game.audio.audioMenang.play();
		game.scorm_helper.setStatus("passed");
		// $(".btn-next-result").css({"display":"block"});
		// $(".slider-content").addClass("win");
		// $(".title-result").html("Congratulations!");
		// go to next slide
		$(".btn-next-result").click(function(e){
			console.log('test');
			game.audio.audioButton.play();
			$(this).off();
			game.nextSlide();
		});
	}
	else{
		// set to lose
		game.scorm_helper.setStatus("failed");
		game.audio.audioKalah.play();
		$(".btn-tryagain").css({"display":"block"});
		$(".slider-content").addClass("lose");
		$(".title-result").html("Keep Trying!");
		// click try again button
		$(".btn-tryagain").click(function(e){
			game.audio.audioButton.play();
			try{
	            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	            btn_back.click();
	        }
	        catch(e){
	            top.window.close();
	        }
		});
	}

	// set star
	var flag=0;
	var count_star=0;

	var time_star = setInterval(function() {
		count_star++;
		if(count_star<=game.max_score){
			if(count_star<=score){
				$(".star-wrapper .star:nth-child("+count_star+")").addClass("active");	
			}
			$(".star-wrapper .star:nth-child("+count_star+")").fadeIn(1000);
			$(".star-wrapper .star:nth-child("+count_star+")").css({"display":"inline-block"});
			
		}
		else{
			clearInterval(time_star);
		}
	},200);	
};