var beforeChallenge = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

beforeChallenge.prototype.init = function() {
	console.log('beforeChallenge init');
	var $this = this;
	$this.game_data = game.game_data;

    $.get("config/templete_content.json",function(e){
        console.log(e);
        $this.category_game_arr = e['category_game'];
        console.log($this.category_game_arr);

        //check all category game finisher played
        var allGamePlayed = $this.checkAllCategoryGamePlayed();
        console.log($this.game_data);
        console.log(allGamePlayed+' - '+$this.game_data['last_score']);
        if(allGamePlayed == 1 && $this.game_data['status'] != undefined){
        	if($this.game_data['status'] == 'win'){
        		game.setSlide(4);
        	}else if($this.game_data['last_challenge'] != undefined){
        		game.setSlide(2);
        	}
        }

    	$(".btn_confirm").click(function(e){
    		$('.tutorial').hide();
    		$('.tutorial#confirm_2').show();
        	$('#popupdialogbox').modal('show');
    	});

    	$(".btn_submit").click(function(e){
    		$('#popupdialogbox').modal('hide');
    		// var id = e.target.id;
    		var id = $('.selected').attr('id');
    		console.log(id);
    		if(id != undefined){
    			id = id.split('_');
    			//set category_game
    			game_data['category_game'] = id[1];
    			//set start date play
    			var date = game.getDate2();
    			game_data['start_date'] = date;
    			console.log(game_data);
    			game.scorm_helper.setSingleData('game_data', game_data);
    			game.nextSlide();
    		}else{
    			alert('Harap pilih jabatan Anda!');
    		}
    	});

    	var clone_video = $("#video").clone();
    	console.log(clone_video);

    	$this.mulai_game();
    },'json');
};


beforeChallenge.prototype.mulai_game = function(){
	var $this = this;
	var video = $("#video-1")[0];
	// var video_duration = video.duration;
	// console.log(video_duration);

    function addEvent(){
        $(".video").click(function(e){
            $(this).off();

            $(".btn-close").hide();	

            video_duration = video.duration;
            contentTimeout = video_duration * 1000;
            // if(game.isViewVideo == false){
            //     video.currentTime = video_duration;
            //     contentTimeout = 100;
            // }

            setTimeout(function(){
                showContentVideo(1);
                $("video").get(0).pause();
            }, contentTimeout);

            $("#video .btn-close").click(function(e){
                $(this).off();
                stopVideo();
                addEvent();
            });
            playVideo(1);
        	// var lengthOfVideo = video.duration();

            console.log('hasAttribute');
            console.log(video);
            console.log(video.hasAttribute("controls"));
            if(video.hasAttribute("controls")) {
				video.removeAttribute("controls")   
			} else {
				video.setAttribute("controls","controls")   
			}
        });
    }
      
    function playVideo(id){
    	console.log($("video"));
    	console.log($("video#video-"+id));
        $("#video").show();
        $("video#video-"+id).show();
        // $("video#video-"+id).get(0).play();
        // console.log($("video").get(id-1));
        // console.log($("video").get(1));
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

        addEvent();
        $(".loader_image_index").show();
        $this.interval_video = setInterval(function(){ 
        	var readyState = video.readyState;
        	console.log('readyState: '+readyState);
        	if(readyState == 4){
        		clearInterval($this.interval_video);
	            // $('.loader_image_index').hide();
	            $(".video").click();
	            $(".loader_image_index").hide();
	        }
        },800);
        $this.append_html();
        	// $(".video").click();
        	// playVideo('video-2');
        // $('.btn-y').click(function(){
        //     $('.video_btn_wrapper').hide();
        //     $('.video_desc_wrapper').hide();
        //     opacityVideo(0);
        //     playVideo(1);
        // });

        // $('.btn-n').click(function(){
        //     $('.video_btn_wrapper').hide();
        //     // stopVideo();
        //     showContentVideo(0);
        //     $("#video .btn-close").click();
        // });

        // $('.btn-change').click(function(){
        // 	showContentVideo(0);
        // 	$("#video-1")[0].removeAttribute("controls");
        // 	// $("#video .btn-close").click();
        // 	stopVideo();
        // 	$('video#video-1').hide();
        // 	playVideo(2);
        // });

        $('.btn_pilih').click(function(){
        	console.log($(this).attr('id'));
        	var id = $(this).attr('id');
        	id = id.split('-');
        	$this.game_data['category_game'] = id[1];
        	game.scorm_helper.setSingleData('category_game',$this.game_data['category_game']);
        	var date = game.getDate2();
        	$this.game_data['start_date'] = date;
        	game.scorm_helper.setSingleData('game_data', $this.game_data);

        	//set view video
        	showContentVideo(0);
            // $(this).off();
			stopVideo();
			addEvent();
			game.nextSlide();
        });
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
            var id = (i+1);
            // console.log('col: '+col);

            //add id to btn_pilih
            $(clone).attr('id', 'btn_pilih-'+id);

            //add class col bootsrtap
            $(clone).addClass('col-xs-'+col);
            // console.log($this.category_game_arr[i]);
            // console.log($this.category_game_arr[i]['category_game_name']);
            //add attr image src
            var img_src = 'assets/image/'+$this.category_game_arr[i]['image'];
            $(clone).find('img').attr('src', img_src);
            //add attr text
            $(clone).find('.text_category').html($this.category_game_arr[i]['category_game_name']);

            //set image finish game category
            // console.log($this.game_data);
            // console.log($this.game_data['game_log']);
            if($this.game_data['game_log'] != undefined){
                var arr_game_log = $this.game_data['game_log'];
                var flagFind = 0;
                for (var j = 0; j < arr_game_log.length; j++) {
                    console.log(arr_game_log[j]['category_game']+' -'+id);
                    if(arr_game_log[j]['category_game'] == id){
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
	console.log($this.category_game_arr);
	if($this.category_game_arr.length > 0){
		for (var i = 0; i < $this.category_game_arr.length; i++) {
	        var id = (i+1);
	       	console.log($this.game_data['game_log']);
			if($this.game_data['game_log'] != undefined){
		        var arr_game_log = $this.game_data['game_log'];
		        console.log(arr_game_log);
		        var flagFind = 0;
		        for (var j = 0; j < arr_game_log.length; j++) {
		            if(arr_game_log[j]['category_game'] == id){
		                flagFind = 1;
		                break;
		            }
		        }

		        //if category game id find in game_log
		        if(flagFind == 1){
		            arr_played_category.push(id);
		        }
		    }
		}
	}
	console.log(arr_played_category);
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

// beforeChallenge.prototype.getScormLength = function(last_game) {
// 	var $this = this;
// 	console.log("sssssssssssssssss");
// 	console.log(last_game);
// 	console.log("sssssssssssssssss");
// 	var count = 0;
// 	for (var i = 0; i < last_game.length; i++) {
// 		if(last_game[i] !== void 0){
// 			count++;
// 		}
// 	}

// 	return count;
// };

