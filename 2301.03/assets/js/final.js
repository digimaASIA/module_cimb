var timer_interval = 0;
var final = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

final.prototype.init = function() {
	console.log('final init');
	var $this = this;
    /*game data*/
	$this.game_data = game.game_data;
	$this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 1);
    // console.log('category_game: '+$this.category_game);
    $this.life = ($this.game_data['life'] != undefined ? $this.game_data['life'] : game.life_max);
    /*end game data*/
    // localStorage.setItem("isViewVideo", false);
    // $this.isViewVideo = localStorage.getItem("isViewVideo");
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];   
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.curr_soal=game.current_challenge;
    $this.isRand = false;
    $this.isTimer = false;
    $this.countTime = 300;
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"];
    $this.slide_content = $(".slider-content-video").clone();
    $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();
    // $this.num_bullet = $this.slide_content.find(".num_bullet").first().clone();
    $this.mode = 1;
    $this.currAnswer = 0;
    $this.time = 0;
    $this.attemp = game.attemp;

    // $.get("config/setting_quiz_"+$this.category_game+".json",function(e){
    //     console.log(e);
    //     console.log('$this.curr_soal: '+$this.curr_soal);
    //     $this.question_data = e['list_question'];
    //     $this.question_data2 = e['list_question'][$this.curr_soal];
    //     console.log($this.question_data);
    //     console.log($this.question_data2);

    //     //set attr src to video
    //     if($this.mode == 2){
    //         $("#video-1 source").attr('src', 'assets/video/sample_video.mp4');
    //     }

    //     // setting timer game per soal
    //     $this.isTimer = (e["settings"]["duration"])?true:false;
    //     $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;

    // 	$this.mulai_game();
    // },'json');

    var id_video = 1;

    $(document).ready(function(){
        // console.log('id_video: '+id_video);
        // var video = $("#video-"+id_video)[0];
        var video = document.getElementById("video-"+id_video);

        function addEvent(){
            console.log('addEvent');

            $(".video").click(function(e){
                $(this).off();

                $(".btn-close").hide(); 
                    
                // console.log($("#video-"+id_video));
                // console.log($("#video-"+id_video)[0]);
                // console.log($("#video-"+id_video)['context']);
                // console.log(video);
                video_duration = video.duration;
                contentTimeout = video_duration * 1000;
                // console.log(video_duration);
                // console.log('isViewVideo: '+$this.isViewVideo);
                // console.log(game.video_duration);
                // if($this.isViewVideo == true){
                //     if(!isNaN(video_duration)){
                //             video.currentTime = video_duration;
                //     }else{
                //         video.currentTime = game.video_duration;
                //     }
                //     contentTimeout = 100;
                //     console.log(contentTimeout);
                //     // localStorage.setItem("isViewVideo", true);
                //     // game.isViewVideo = true;
                // }else{
                //     //set value
                //     game.video_duration = video_duration;
                // }
                console.log(video_duration);
                video.currentTime = video_duration;
                console.log(contentTimeout);
                // console.log(game.isViewVideo);
                //show quiz content in decision time
                setTimeout(function(){ 
                //     showContentVideo(1);
                //     opacityVideo(1, id_video);
                    $("video").get(0).pause();
                    opacityVideo(1,id_video);
                    $this.result();
                    // game.setSlide(4);

                //     $('.video_header_wrapper').show();

                //     // start timer playing game 
                //     if($this.isTimer){
                //         $this.startGameTimer();
                //     }
                    // game.setSlide(4);
                }, contentTimeout);

                // var lengthOfVideo = video.duration();
                $("#video .btn-close").click(function(e){
                    $(this).off();
                    $this.stopVideo(id_video);
                    addEvent();
                });
                $this.playVideo(id_video);

                console.log('hasAttribute');
                console.log(video);
                console.log(video.hasAttribute("controls"));
                if(video.hasAttribute("controls")) {
                    video.removeAttribute("controls")   
                } else {
                    video.setAttribute("controls","controls")   
                }

                // if($this.isViewVideo == false){
                //     $this.showModal();
                // }else{
                //     game.audio.audioButton.play();
                //     $('.modal#tutorial').hide();
                //     $(".video").click();
                // }
            });
        }
      
        addEvent();
        $('.loader_image_index').show();
         $this.interval_video = setInterval(function(){ 
            var readyState = video.readyState;
            if(readyState == 4){
            	clearInterval($this.interval_video);
	            $('.loader_image_index').hide();
	            $(".video").click();
	        }
        },800);
    });
};

final.prototype.result = function(){
    console.log('result');
    var $this = this;
    $('.result').show();
    $('.btn-tryagain').show();
    $(".btn-tryagain").click(function(e){
		game.audio.audioButton.play();
		try{
            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
            btn_back.click();
            game.attemp += 1;
            game.scorm_helper.setSingleData('attemp', game.attemp);
        }
        catch(e){
            top.window.close();
        }
	});
}

final.prototype.showModal = function() {
    console.log('showModal');
    $('.modal#tutorial').show();
    $('.tutorial.mc').addClass('active');
};

final.prototype.playVideo = function (id){
    console.log($("video"));
    console.log($("video#video-"+id));
    $("#video").show();
    $("video#video-"+id).show();
    // $("video#video-"+id).get(0).play();
    // console.log($("video").get(id-1));
    // console.log($("video").get(1));
    $("video").get(id-1).play();
}

final.prototype.stopVideo = function (id){
    $("#video").hide();
    $("#video-"+id)[0].pause();
    $("#video-"+id)[0].currentTime = 0;
}

final.prototype.pauseVideo = function (){
    $("video-1")[0].pause();
}

//set opacity video
final.prototype.opacityVideo = function (val, id){
    $('video#video').hide();
    if(val == 1){
        $('video#video-'+id).css('opacity', '0.3');
    }else{
        $('video#video-'+id).css('opacity', 'unset');
    }
}

//show hide video
final.prototype.showContentVideo = function (val){
    if(val == 1){
        $('.video_btn_wrapper').show(); 
        // $('.video_desc_wrapper').show(); 
        // opacityVideo(1);
    }else{
        $('.video_btn_wrapper').hide(); 
        // $('.video_desc_wrapper').hide(); 
        // opacityVideo(0);
    }
}

showContentVideo.resetValue = function (){
    game.video_duration = 0;
}


final.prototype.setGameData = function(){
    var date = game.getDate2();
    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = 0;
    game.game_data['status'] = 'lose';
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

final.prototype.setGameData2 = function(){
    var date = game.getDate2();

    //set game log
    var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log'])
    var game_log = {
        "category_game" : game.game_data['category_game'],
        "score"         : game.game_data['last_score'],
        "start_date"    : game.game_data['start_date'],
        "last_life"     : game.game_data['last_life']
    };
    last_game_log.push(game_log);

    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = 0;
    game.game_data['game_log'] = last_game_log;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

//set game data win
final.prototype.setGameData3 = function(){
    var date = game.getDate2();

    //set game log
    var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log'])
    var game_log = {
        "category_game" : game.game_data['category_game'],
        "score"         : game.game_data['last_score'],
        "start_date"    : game.game_data['start_date'],
        "last_life"     : game.game_data['last_life']
    };
    last_game_log.push(game_log);

    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = 0;
    game.game_data['category_game'] = "";
    game.game_data['game_log'] = last_game_log;
    game.game_data['status'] = 'win';
    game.scorm_helper.setSingleData('game_data', game.game_data);
}