/**
* this is a class for generate game results either star or score.
* @class
* @author     NejiElYahya
*/

var resultStep = function(){

}


resultStep.prototype.init = function(current_settings) {
    var $this = this;
    $this.current_settings = current_settings;
    $this.game_data = game.game_data;
    $this.play_video_interval_step; //variabel interval play video
    $this.video_path = 'assets/video/result/';
    // $this.score = 0;
        
    // console.log("setting_result_step_slide:"+$this.current_settings["slide"]);
    $.get("config/setting_result_step_slide_"+$this.current_settings["slide"]+".json",function(e){
        console.log(e);
        $this.ldata = e;
        $this.score = e["score"];
        $this.background = e["background"];
        $this.win = e["win"];
        $this.lose = e["lose"];
        $this.setResult();
    },'json');
};

resultStep.prototype.setResult = function() {
    var $this = this;

    //hide header
    $(".header").hide();

    // remove jquery mobile
    $("html").removeClass("ui-mobile");
    // game.audio.audioBackground.pause();
    // game.audio.audioMotor.pause();

    /*comment by elim*/
    // var game_quiz = game.scorm_helper.getQuizResult(["game_slide_2"]);
    // var game_quiz = game.scorm_helper.getQuizResultPrefix();
    // console.log(game_quiz);
    // count all game score range 0-5 for the star
    // var score = parseInt(game_quiz["score"])/parseInt(game_quiz["total_soal"])*game.max_score;
    // $this.life = ($this.game_data['last_life'] != undefined ? $this.game_data['last_life'] : game.life_max);

    // $this.global_timeout = ($this.game_data["global_timeout"] != undefined ? $this.game_data["global_timeout"] : undefined);

    var score = 0;
    // $this.game_data["total_answer_true"] = 2;
    // $this.game_data["total_soal_current_slide"] = 2;
    if($this.game_data["total_answer_true"] == $this.game_data["total_soal_current_slide"]){
        score = 100;
    }

    /*end comment by elim*/
    // count score range 0-100 for save to cmi.raw.score
    var count = score/game.max_score*100;
    // for score in text
    $(".score").html(Math.round(score));
    // if($this.score){
    //     $(".star_wrapper").hide();
    //     $(".score_wrapper").show();
    // }else{
    //     $(".star_wrapper").show();
    //     $(".score_wrapper").hide();
    // }
    $(".star_wrapper").hide();
    $(".score_wrapper").hide();

    // save score to to cmi.raw.score
    game.scorm_helper.sendResult(Math.round(count));
    // set duration and save to scorm
    // game.scorm_helper.setDuration();
    // if score larger than minimum grade

    //validasi set background using gif or video
    if($this.ldata['background_video'] != undefined && $this.ldata['background_video'] != ""){
        let $clone = $("#body");
        let src = $this.ldata['background_video'];
        $this.setVideo($clone, src);
    }else{
        $(".result_wrapper").css("background","url(assets/image/cover/"+$this.background+") no-repeat center / cover");
    }
    
    // console.log(score);
    if(Math.round(score) >= game.min_score){
        // set to win
        // $(".slider-content").css({"background":"url('assets/image/result/bg-win.png') no-repeat center","background-size":"cover"});
        // $this.win["backsound"] = undefined;

         //play audio
        if($this.win["backsound"] != undefined && $this.win["backsound"] != ""){
            let looping = false;
            game.playBacksound($this.win["backsound"], looping);
        }else{
            game.audio.audioMenang.play();
        }

        // game.scorm_helper.setStatus("passed");
        $(".result_wrapper").addClass("win");
        $(".ribbon_result img").attr("src","assets/image/cover/"+$this.win["ribbon"]);
        $(".ribbon_result .text_ribbon_result").html($this.win["ribbon_text"]);
        $(".score_wrapper").css($this.win["score_css"]);
        $(".text_wrapper").html($this.win["description"]["text"]);
        $(".text_wrapper").css($this.win["description"]["css"]);
        $(".button").html($this.win["button"]["text"]);
        $(".button").css($this.win["button"]["button_css"]);
        $(".button").addClass("btn-next-result");
        // go to next slide
        $(".btn-next-result").click(function(e){
            //clear interval play video
            clearInterval($this.play_video_interval_step);

            game.audio.audioButton.play();
            //$(this).off();
            // try{
            //     var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
            //     btn_back.click();
            // }
            // catch(e){
            //     top.window.close();
            // }

            game.setSlide(2);
        });
    }
    else{
        // set to lose
        // $(".slider-content").css({"background":"url('assets/image/result/bg-lose.png') no-repeat center","background-size":"cover"});
        // game.scorm_helper.setStatus("failed");

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
        $(".text_wrapper").html($this.lose["description"]["text"]);
        $(".text_wrapper").css($this.lose["description"]["css"]);
        $(".button").html($this.lose["button"]["text"]);
        $(".button").css($this.lose["button"]["button_css"]);
        $(".button").addClass("btn-tryagain_step");
        // click try again button
        $(".btn-tryagain_step").click(function(e){
            //clear interval play video
            // alert($this.play_video_interval);
            clearInterval($this.play_video_interval_step);
            // alert($this.play_video_interval);

            game.audio.audioButton.play();
            //$(this).off();
            // try{
            //     var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
            //     btn_back.click();
            // }
            // catch(e){
            //     top.window.close();
            // }

             game.setSlide(2);
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

resultStep.prototype.setVideo = function($clone, src) {
    // console.log("setVideo");
    var $this = this;
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    // console.log($(".img_video"));
    $(".img_video").hide();
    $("#video")[0].load();

    game.showLoading();
    $("#video").on("canplay",function(e){
        game.hideLoading();
        $this.playVideo();

        $("#video").on("ended",function(e){
            $(this).off();
            // $this.pauseVideo();

            //call function set video, to call again this video
            // $this.play_video_interval_step = setInterval(function() {
            //     $this.playVideo();
            // },200);

            $this.playVideo_loop();
        });
    });
};

resultStep.prototype.playVideo = function() {
    var $this = this;
    $("#video")[0].play();
};

resultStep.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

resultStep.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};