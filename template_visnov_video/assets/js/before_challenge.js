var beforeChallenge = function(){
	
}

beforeChallenge.prototype.init = function(current_settings) {
	var $this = this;
    $this.current_settings = current_settings;
	$this.game_data = game.game_data;
    
    // $.get("config/setting_category_slide_"+$this.current_settings["slide"]+".json",function(e){
    //     $this.category_game_arr = e['category_game'];
    //     $this.category = e['category'];
    //     $this.opening = e['opening'];
    //     //check all category game finisher played
    //     var allGamePlayed = $this.checkAllCategoryGamePlayed();
    //     if(allGamePlayed == 1 && $this.game_data['status'] != undefined){
    //         console.log("a");
    //     	if($this.game_data['status'] == 'win'){
    //             console.log("b");
    //     		$this.QuizComplete();
    //     	}else if($this.game_data['last_challenge'] != undefined){
    //             console.log("c");
    //     		game.setSlide(3);
    //     	}
    //     }

    // 	var clone_video = $("#video").clone();
    	
    // 	$this.mulai_game();
    // },'json');
    $this.mulai_game();
};


beforeChallenge.prototype.mulai_game = function(){
	var $this = this;

    $('.popupdialogbox #confirm_1').show();
    $('.popupdialogbox').modal('show');
	// var video = $("#video-1")[0];
    // $(video).attr("src","assets/video/"+$this.opening);
   //  function addEvent(){
   //      $(".video").click(function(e){
   //          $(this).off();

   //          $(".btn-close").hide();

   //          video_duration = video.duration;
   //          contentTimeout = video_duration * 1000;
   //          if($this.game_data["view_opening"]){
   //              if(!isNaN(video_duration)){
   //                  video.currentTime = video_duration - 0.1;
   //              }else{
   //                  video.currentTime = game.video_duration;
   //              }
   //              contentTimeout = 100;
   //          }

   //          setTimeout(function(){
   //              if($this.category){
   //                  showContentVideo(1);
   //                  $("video").get(0).pause();
   //              }else{
   //                  $("video").get(0).pause();
   //                  var id_button = $this.game_data["category_game"];
   //                  if(id_button == undefined){
   //                      id_button = 0;
   //                      $(".btn_pilih[id='btn_pilih-"+id_button+"']").trigger("click");
   //                  }else{
   //                      id_button = parseInt(id_button)+1;
   //                      $(".btn_pilih[id='btn_pilih-"+id_button+"']").trigger("click");
   //                  }
   //              }
   //          }, contentTimeout);

   //          $("#video .btn-close").click(function(e){
   //              $(this).off();
   //              stopVideo();
   //              addEvent();
   //          });
   //          playVideo(1);
        	
   //          if(video.hasAttribute("controls")) {
			// 	video.removeAttribute("controls")   
			// } else {
			// 	video.setAttribute("controls","controls")   
			// }
   //          return contentTimeout;
   //      });
   //  }

   $('.close-modal').unbind().click(function(){
        $('.popupdialogbox #confirm_1').hide();
        $('.popupdialogbox').modal('hide');
        game.audio.audioButton.play();
        game.nextSlide();
   });

    $('.popupdialogbox-prev-slide').unbind().click(function(){
        $('.popupdialogbox #confirm_1').hide();
        $('.popupdialogbox').modal('hide');
        game.audio.audioButton.play();
        game.setSlide(1);
    });
      
    function playVideo(id){
    	$("#video").show();
        $("video#video-"+id).show();
        $("video").get(id-1).play();
    }

    function stopVideo(){
        $("#video").hide();
        $("#video-1")[0].pause();
        $("#video-1")[0].currentTime = 0;
    }

    function pauseVideo(){
        $("video-1")[0].pause();
    }

    //set opacity video
    function opacityVideo(val){
    	$('video#video').hide();
    	if(val == 1){
    		$('video#video-1').css('opacity', '0.3');
    	}else{
    		$('video#video-1').css('opacity', 'unset');
    	}
    }

    //show hide video
    function showContentVideo(val){
    	if(val == 1){
    		$('.video_btn_wrapper').show(); 
        	$('.video_desc_wrapper').show(); 
        	opacityVideo(1);
    	}else{
    		$('.video_btn_wrapper').hide(); 
        	$('.video_desc_wrapper').hide(); 
        	opacityVideo(0);
    	}
    }

    $(document).ready(function(){

        // addEvent();
        // $(".loader_image_index").show();
        // $this.interval_video = setInterval(function(){ 
        // 	var readyState = video.readyState;
        // 	if(readyState == 4){
        // 		clearInterval($this.interval_video);
	       //      $(".video").click();
	       //      $(".loader_image_index").hide();
	       //  }
        // },800);
        // $this.append_html();
        // $('.btn_pilih').click(function(){
        //     var id = $(this).attr('id');
        //     id = id.split('-');
        //     $this.game_data['category_game'] = id[1];
        //     $this.game_data['view_opening'] = true;
        //     game.scorm_helper.setSingleData('category_game',$this.game_data['category_game']);
        //     game.scorm_helper.setSingleData('view_opening',$this.game_data['view_opening']);
        //     var date = game.getDate();
        //     $this.game_data['start_date'] = date;
        //     game.scorm_helper.setSingleData('game_data', $this.game_data);

        //     //set view video
        //     showContentVideo(0);
        //     stopVideo();
        //     addEvent();
        //     game.nextSlide();
        // });
    });
}

//append html category game
beforeChallenge.prototype.append_html = function() {
    var $this = this;
    var clone_item = $('.btn_choose').clone();
    $('.div_btn_choose').html('');

    if($this.category_game_arr.length > 0){
        for (var i = 0; i < $this.category_game_arr.length; i++) {
            var clone = $(clone_item).clone();
            var col = parseInt(12 / $this.category_game_arr.length);
            
            //add id to btn_pilih
            $(clone).attr('id', 'btn_pilih-'+i);

            //add class col bootsrtap
            $(clone).addClass('col-xs-'+col);
            //add attr image src
            var img_src = 'assets/image/'+$this.category_game_arr[i]['image'];
            $(clone).find('img').attr('src', img_src);
            //add attr text
            $(clone).find('.text_category').html($this.category_game_arr[i]['category_game_name']);

            //set image finish game category
            if($this.game_data['game_log'] != undefined){
                var arr_game_log = $this.game_data['game_log'];
                var flagFind = 0;
                for (var j = 0; j < arr_game_log.length; j++) {
                    if(arr_game_log[j]['category_game'] == i){
                        flagFind = 1;
                        break;
                    }
                }

                if(flagFind == 1){
                    var img_src_2 = 'assets/image/accept_status.png';
                    $(clone).find('.img_centang img').attr('src',img_src_2);
                    $(clone).find('.img_centang').show();
                }
            }
            // console.log(clone);
            $('.div_btn_choose').append(clone);
        }
    }
}

beforeChallenge.prototype.checkAllCategoryGamePlayed = function(){
	var $this = this;
	var arr_played_category = [];
	if($this.category_game_arr.length > 0){
		for (var i = 0; i < $this.category_game_arr.length; i++) {
	        if($this.game_data['game_log'] != undefined){
		        var arr_game_log = $this.game_data['game_log'];
		        var flagFind = 0;
		        for (var j = 0; j < arr_game_log.length; j++) {
		            if(arr_game_log[j]['category_game'] == i){
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
		if(arr_played_category.length == $this.category_game_arr.length){
			return 1;
		}else{
			return 0;
		}
	}else{
		return 0;
	}
};

beforeChallenge.prototype.QuizComplete = function() {
    var $this = this;
    game.scorm_helper.setStatus("passed");
    game.scorm_helper.sendResult(100);
    game.setSlide(4);
};

