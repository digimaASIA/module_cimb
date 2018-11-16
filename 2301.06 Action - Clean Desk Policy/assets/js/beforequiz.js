var beforeQuiz = function(){
	
}

beforeQuiz.prototype.init = function(current_settings) {
	var $this = this;
    $this.current_settings = current_settings;
	$this.game_data = game.game_data;
    $this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 0);
    
    $.get("config/setting_beforequiz_slide_"+$this.current_settings["slide"]+".json",function(e){
        $this.choices = e['choices'];
        //check all category game finisher played
        var allGamePlayed = $this.checkAllCategoryComplete();
        if(allGamePlayed == 1){
            game.scorm_helper.setSingleData('view_beforequiz',false);
        	game.setSlide(3);
        }else if(!$this.choices[$this.category_game]["beforequiz"]){
            $this.showModal();
        }else if(!$this.game_data['view_beforequiz'] || $this.game_data['view_beforequiz'] == undefined){
            $this.showModal();
        }else{
            $this.mulai_game();
        }
    },'json');
};

beforeQuiz.prototype.showModal = function() {
    // console.log('showModal');
    var $this = this;
    $('.modal#tutorial').modal("show");
    $('.tutorial.mc').addClass('active');
    $(".btn_tutorial_mc").click(function(e){
        $('.modal#tutorial').modal("hide");
        if(!$this.choices[$this.category_game]["beforequiz"]){
            game.scorm_helper.setSingleData('view_beforequiz',false);
            game.setSlide(3);
        }else{
            $this.mulai_game();
        }
    });
};


beforeQuiz.prototype.mulai_game = function(){
	var $this = this;
    $('.video_div').html('');
    var video1 = $('<video />', {
        id: 'video-0',
        src: 'assets/video/'+$this.choices[$this.category_game]['video'],
        type: 'video/mp4',
        controls: true
    });
    video1.appendTo($('.video_div'));
    video1.css('display', 'none');
	var video = document.getElementById("video-0");
    function addEvent(){
        $(".video").click(function(e){
            $(this).off();

            $(".btn-close").hide();

            video_duration = video.duration;
            contentTimeout = video_duration * 1000;
            if($this.game_data["view_beforequiz"]){
                if(!isNaN(video_duration)){
                    video.currentTime = video_duration - 0.1;
                }else{
                    video.currentTime = game.video_duration;
                }
                contentTimeout = 100;
            }

            setTimeout(function(){
                $this.showContentVideo(1);
                $("video").get(0).pause();
            }, contentTimeout);

            $("#video .btn-close").click(function(e){
                $(this).off();
                $this.stopVideo();
                addEvent();
            });
            $this.playVideo(0);
        	
            if(video.hasAttribute("controls")) {
				video.removeAttribute("controls")   
			} else {
				video.setAttribute("controls","controls")   
			}
            return contentTimeout;
        });
    }

    $(document).ready(function(){

        addEvent();
        $(".loader_image_index").show();
        $this.interval_video = setInterval(function(){ 
        	var readyState = video.readyState;
        	if(readyState == 4){
        		clearInterval($this.interval_video);
	            $(".video").click();
	            $(".loader_image_index").hide();
	        }
        },800);
        $this.append_html();
        $('.btn_choose').click(function(){
            game.audio.audioButton.play();
            var id = $(this).attr('id');
            id = id.split('-');
            var video_feedback = $('<video />', {
                id: 'video_feedback-1',
                src: 'assets/video/'+$this.choices[$this.category_game]["button"][id[1]]["video"],
                type: 'video/mp4',
                controls: true
            });
            video_feedback.appendTo($('.video_div'));
            video_feedback.css('display', 'none');
            $this.game_data['sub_category_game'] = id[1];
            $this.game_data['view_beforequiz'] = true;
            var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log']);
            var data = {
                "category" : $this.category_game,
                "sub_category_game" : $this.game_data["sub_category_game"]
            };
            last_game_log.push(data);
            $this.game_data['game_log'] = last_game_log;
            game.scorm_helper.setSingleData('sub_category_game',$this.game_data['sub_category_game']);
            game.scorm_helper.setSingleData('view_beforequiz',$this.game_data['view_beforequiz']);
            game.scorm_helper.setSingleData('game_data', $this.game_data);
            $this.time_feedback = setInterval(function() {
                clearInterval($this.time_feedback);
                time_feedback = null;
                var video = $('#video_feedback-1')[0];
                var contentTimeout = video.duration * 1000;
                $this.showVideoFeedback(video);
                setTimeout(function(){
                    $('.video_header_wrapper').show();
                    $("#video_feedback-1")[0].pause();
                    $(".icon_exit_feedback").show();
                    $(".icon_exit_feedback").click(function(e){
                        game.setSlide(2);
                    });
                },contentTimeout);
            },800);
        });
    });
}

//append html category game
beforeQuiz.prototype.append_html = function() {
    var $this = this;
    var clone_item = $('.btn_choose').clone();
    $('.div_btn_choose').html('');

    if($this.choices[$this.category_game]["button"].length > 0){
        for (var i = 0; i < $this.choices[$this.category_game]["button"].length; i++) {
            var clone = $(clone_item).clone();
            $(clone).attr('id','btn_pilih-'+i);
            $(clone).html($this.choices[$this.category_game]["button"][i]["text"]);
            $(clone).css($this.choices[$this.category_game]["button"][i]["position"]);
            if($this.game_data['game_log'] != undefined){
                var arr_game_log = $this.game_data['game_log'];
                var flagFind = 0;
                for (var j = 0; j < arr_game_log.length; j++) {
                    if(arr_game_log[j]['sub_category_game'] == i){
                        flagFind = 1;
                        break;
                    }
                }

                if(flagFind == 1){
                    $(clone).addClass('active');
                }
            }
            // console.log(clone);
            $('.div_btn_choose').append(clone);
        }
    }
}


beforeQuiz.prototype.playVideo = function(id,type='') {
    $("#video").show();

    //set prefix id video
    var prefix_id = 'video';
    if(type == 'feedback'){
        prefix_id = 'video_feedback';
    }
    $("video#"+prefix_id+"-"+id).show();
    $("video#"+prefix_id+"-"+id)[0].play();
};

beforeQuiz.prototype.stopVideo = function() {
    $("#video").hide();
    if($("#video-0")[0].play !== undefined){
        $("#video-0")[0].pause();
        $("#video-0")[0].currentTime = 0;
    }
};

beforeQuiz.prototype.opacityVideo = function(val) {
    $('video#video').hide();
    if(val == 1){
        
    }else{
        $('video#video-1').css('opacity', 'unset');
    }
};

beforeQuiz.prototype.showContentVideo = function(val) {
    var $this = this;
    if(val == 1){
        $('.video_btn_wrapper').show(); 
        $('.video_desc_wrapper').show(); 
        $this.opacityVideo(1);
    }else{
        $('.video_btn_wrapper').hide(); 
        $('.video_desc_wrapper').hide(); 
        $this.opacityVideo(0);
    }
};

beforeQuiz.prototype.showVideoFeedback = function(video){
    var $this = this;
    $this.stopVideo();
    $this.opacityVideo(1);
    $('#content-video').hide();
    $('video#video-0').hide();
    $this.playVideo(1, 'feedback');
    if(video.hasAttribute("controls")) {
        video.removeAttribute("controls")   
    } else {
        video.setAttribute("controls","controls")   
    }
};

beforeQuiz.prototype.checkAllCategoryComplete = function(){
	var $this = this;
	var arr_played_category = [];
	if($this.choices[$this.category_game]["button"].length > 0){
		for (var i = 0; i < $this.choices[$this.category_game]["button"].length; i++) {
	        if($this.game_data['game_log'] != undefined){
		        var arr_game_log = $this.game_data['game_log'];
		        var flagFind = 0;
		        for (var j = 0; j < arr_game_log.length; j++) {
		            if(arr_game_log[j]['sub_category_game'] == i){
		                flagFind = 1;
		                break;
		            }
		        }

		        //if category game id find in game_log
		        if(flagFind == 1){
		            arr_played_category.push(i);
		        }
		    }
		}
	}
	if(arr_played_category.length > 0){
		if(arr_played_category.length == $this.choices.length){
			return 1;
		}else{
			return 0;
		}
	}else{
		return 0;
	}
};
