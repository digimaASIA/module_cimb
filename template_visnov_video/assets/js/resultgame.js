/**
* this is a class for generate game results either star or score.
* @class
* @author     NejiElYahya
*/

var ResultGame = function(){

}


ResultGame.prototype.init = function(current_settings) {
	console.log("init");
	var $this = this;
	$this.current_settings = current_settings;
	$this.video_path = 'assets/video/result/';
	$this.play_video_interval_result; //variabel interval play video
	$.get("config/setting_result_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.ldata = e;
		$this.score = e["score"];
		$this.background = e["background"];
		$this.background_lose = e["background_lose"];
		$this.win = e["win"];
		$this.lose = e["lose"];
		$this.setResult();
	},'json');
};

ResultGame.prototype.setResult = function() {
	var $this = this;

	//hide header
	$(".header").hide();

	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	// game.audio.audioBackground.pause();
	// game.audio.audioMotor.pause();
		
	/*comment by elim*/
	let modeTest = 0;
	var score;
	var game_quiz;

	if(modeTest == 1){
		score = 100;
	}else{
		game_quiz = game.scorm_helper.getQuizResultPrefix();
		
		if(game_quiz["score"] == 0){
			score = 0;
		}else{
			console.log(game_quiz["score"]);
			console.log(game.total_soal);
			console.log(game.max_score);
			score = parseInt(game_quiz["score"])/parseInt(game.total_soal)*game.max_score;
		}
	}

	console.log(score);
	/*end comment by elim*/
	// count score range 0-100 for save to cmi.raw.score
	var count = score/game.max_score*100;
	// for score in text
	$(".score").html(Math.round(score));
	if($this.score){
		$(".star_wrapper").hide();
		$(".score_wrapper").show();
	}else{
		$(".star_wrapper").show();
		$(".score_wrapper").hide();
	}
	// save score to to cmi.raw.score
	game.scorm_helper.sendResult(Math.round(count));
	// set duration and save to scorm
	// game.scorm_helper.setDuration();
	// if score larger than minimum grade
	if(Math.round(score) >= game.min_score){
		// set to win
		// $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
		
		//validasi set background using gif or video
		if($this.ldata['background_video'] != undefined && $this.ldata['background_video'] != ""){
	        let $clone = $("#body");
	        let src = $this.ldata['background_video'];
	        $this.setVideo($clone, src);
	    }else{
	        $(".result_wrapper").css("background","url(assets/image/cover/"+$this.background+") no-repeat center / cover");
	    }
		
		//play audio
        if($this.win["backsound"] != undefined && $this.win["backsound"] != ""){
            let looping = false;
            game.playBacksound($this.win["backsound"], looping);
        }else{
            game.audio.audioMenang.play();
        }
		
		game.scorm_helper.setStatus("passed");
		$(".result_wrapper").addClass("win");
		$(".ribbon_result img").attr("src","assets/image/cover/"+$this.win["ribbon"]);
		console.log($this.win);
		$(".ribbon_result .text_ribbon_result").html($this.win["ribbon_text"]);
        $(".score_wrapper").css($this.lose["score_css"]);
		$(".score_wrapper").css($this.win["score_css"]);
		$(".text_wrapper").html($this.win["description"]["text"]);
		$(".text_wrapper").css($this.win["description"]["css"]);
		$(".button").html($this.win["button"]["text"]);
		$(".button").css($this.win["button"]["button_css"]);
		$(".button").addClass("btn-next-result");
		// go to next slide
		$(".btn-next-result").click(function(e){
			//clear interval play video
            clearInterval($this.play_video_interval_result);

			game.audio.audioButton.play();
			//$(this).off();
			try{
	            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
	            btn_back.click();
	        }
	        catch(e){
	            top.window.close();
	        }
		});
	}
	else{
		// set to lose
		// $(".slider-content").css({"background":"url('assets/image/result/bg-lose.png') no-repeat center","background-size":"cover"});
		
		//validasi set background using gif or video
		if($this.ldata['background_lose_video'] != undefined && $this.ldata['background_lose_video'] != ""){
	        let $clone = $("#body");
	        let src = $this.ldata['background_lose_video'];
	        $this.setVideo($clone, src);
	    }else{
	        $(".result_wrapper").css("background","url(assets/image/cover/"+$this.background+") no-repeat center / cover");
	    }

		game.scorm_helper.setStatus("failed");
		
		//play audio
        if($this.lose["backsound"] != undefined && $this.lose["backsound"] != ""){
            let looping = false;
            game.playBacksound($this.lose["backsound"], looping);
        }else{
            game.audio.audioKalah.play();
        }
		
		$(".result_wrapper").addClass("lose");
		$(".ribbon_result img").attr("src","assets/image/cover/"+$this.lose["ribbon"]);
		$(".ribbon_result .text_ribbon_result").html($this.lose["ribbon_text"]);
        $(".score_wrapper").css($this.lose["score_css"]);
		$(".score_wrapper").css($this.lose["score_css"]);
		$(".text_wrapper").html($this.lose["description"]["text"]);
		$(".text_wrapper").css($this.lose["description"]["css"]);
		$(".button").html($this.lose["button"]["text"]);
		$(".button").css($this.lose["button"]["button_css"]);
		$(".button").addClass("btn-tryagain-result");
		// click try again button
		$(".btn-tryagain-result").click(function(e){
			//clear interval play video
            clearInterval($this.play_video_interval_result);

			game.audio.audioButton.play();
			//$(this).off();
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
				$(".star_wrapper .star:nth-child("+count_star+")").addClass("active");
			}
			$(".star_wrapper .star:nth-child("+count_star+")").fadeIn(1000);
		}
		else{
			clearInterval(time_star);
		}
	},200);
};


ResultGame.prototype.setVideo = function($clone, src) {
    // console.log("setVideo");
    var $this = this;
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    // console.log($(".img_video"));
    $(".img_video").hide();
    $("#video")[0].load();

    game.showLoading();
    // alert("test");
    $("#video").on("canplay",function(e){
    	game.hideLoading();
        $this.playVideo();

        $("#video").on("ended",function(e){
            $(this).off();
            // $this.pauseVideo();

            //call function set video, to call again this video
            // $this.play_video_interval_result = setInterval(function() {
            //     $this.playVideo();
            // },200);

            $this.playVideo_loop();
        });
    });
};

ResultGame.prototype.playVideo = function() {
    var $this = this;
    $("#video")[0].play();
};

ResultGame.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

ResultGame.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};