var timer_interval = 0;
var final = function(){

}

final.prototype.init = function(current_settings) {
	var $this = this;
    /*game data*/
    $this.current_settings = current_settings;
	$this.game_data = game.game_data;
	$this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 1);
    // console.log('category_game: '+$this.category_game);
    $this.life = ($this.game_data['life'] != undefined ? $this.game_data['life'] : game.life_max);
    /*end game data*/
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
    $this.mode = 1;
    $this.currAnswer = 0;
    $this.time = 0;
    $this.attemp = game.attemp;

    $.get("config/setting_ending_slide_"+$this.current_settings["slide"]+".json",function(e){
        $this.ending = e['ending'];
        $this.mulai();
    },'json');
};


final.prototype.mulai = function() {
    var $this = this;
    var id_video = 1;

    $(document).ready(function(){
        var video = $("#video-1")[0];
        $(video).attr("src","assets/video/"+$this.ending);

        function addEvent(){            
            $(".video").click(function(e){
                $(this).off();

                $(".btn-close").hide(); 
                
                video_duration = video.duration;
                contentTimeout = video_duration * 1000;
                video.currentTime = video_duration;
                setTimeout(function(){ 
                    $("video").get(0).pause();
                    $this.opacityVideo(1,id_video);
                    $this.result();
                }, contentTimeout);

                $this.playVideo(id_video);

                if(video.hasAttribute("controls")) {
                    video.removeAttribute("controls")   
                } else {
                    video.setAttribute("controls","controls")   
                }
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
    var $this = this;
    $(".btn-close").show();
    $(".btn-close").click(function(e){
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

final.prototype.playVideo = function (id){
    $("#video").show();
    $("video#video-"+id).show();
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
    }else{
        $('.video_btn_wrapper').hide();
    }
}