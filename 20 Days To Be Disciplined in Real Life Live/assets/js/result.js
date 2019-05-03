/**
* this is a class for generate game results either star or score.
* @class
* @author     NejiElYahya
*/

var Result = function(){

}


Result.prototype.init = function() {
	console.log('init Result');
	var $this = this;
	// remove jquery mobile
	$("html").removeClass("ui-mobile");
	// get last game from scorm
	// var game_quiz = game.scorm_helper.getQuizResult(["game_slide_4"]);
	// console.log(game_quiz);
	// count all game score range 0-5 for the star
	// var score = parseInt(game_quiz["score"])/parseInt(game_quiz["total_soal"])*game.max_score;
	var score = game.game_data['curr_score'];
	// var score = 400;
	var score_badges = $this.getBadges_2(score);
	console.log(score_badges);
	if(score_badges){
		console.log('test');
		// $('.modal_badge .img_badge').attr('src','assets/image/medals.gif');
		// $('.div_badge').html('Selamat anda mendapatkan badge '+score_badges);


		/*Function append badges image*/
	    var arr_data = score_badges;
	    if(arr_data.length > 0){
	    	var flag_splice = 0;
	    	for (var i = 0; i < arr_data.length; i++) {
	    		console.log(arr_data[i]['score']);
	    		console.log(score);
	    		console.log(i);
	    		if(arr_data[i]['score'] <= score){

	    		}else{
	    			// if(flag_splice == 0){
	    				console.log('splice: '+i);
	    				flag_splice = 1;
	    				arr_data.splice(i,1);
	    				i -= 1;
	    			// }else{
	    			// 	console.log('splice: '+(i-1));
	    			// 	arr_data.splice((i-1),1);
	    			// }
	    			console.log(arr_data);
	    		}
	    	}
	    	console.log(arr_data);
	    	if(arr_data.length > 0){
		    	var clone_item = $('.btn_choose').clone();
		    	$('.div_btn_choose').html('');
		        for (var i = 0; i < arr_data.length; i++) {
		        	
			            var clone = $(clone_item).clone();
			            var col = parseInt(12 / arr_data.length);
			            if(arr_data.length == 3){
			            	if(i+1 == arr_data.length){
			            		col = 12;
			            	}else{
			            		col = 6;
			            	}
			            }else if(arr_data.length == 4){
			            	col = 6;
			            }
			            
			            //add id to btn_pilih
			            $(clone).attr('id', 'btn_pilih-'+i);

			            //add class col bootsrtap
			            $(clone).addClass('col-xs-'+col);
			            //add attr image src
			            var img_src = arr_data[i]['img'];
			            $(clone).find('img').attr('src', img_src);
			            //add attr text
			            $(clone).find('.img_category_text').html(arr_data[i]['name']);

			            //set image finish game category
			            // if($this.game_data['game_log'] != undefined){
			            //     var arr_game_log = $this.game_data['game_log'];
			            //     var flagFind = 0;
			            //     for (var j = 0; j < arr_game_log.length; j++) {
			            //         if(arr_game_log[j]['category_game'] == i){
			            //             flagFind = 1;
			            //             break;
			            //         }
			            //     }

			            //     if(flagFind == 1){
			            //         var img_src_2 = 'assets/image/game_assets/accept_status.png';
			            //         $(clone).find('.img_centang img').attr('src',img_src_2);
			            //         $(clone).find('.img_centang').show();
			            //     }
			            // }
			            // console.log(clone);
			            $('.div_btn_choose').append(clone);
		        }
		    }
	    }
	    /*End function append badges image*/

	    if(arr_data.length > 0){
			$('.modal_badge').modal('show');

			$('.btn_close').click(function(){
				$('.modal_badge').modal('hide');
			});
		}
	}
	console.log(score);
	// count score range 0-100 for save to cmi.raw.score
	var count = score/game.max_score*100;
	// for score in text
	$(".txt_score").html(score);
	// save score to to cmi.raw.score
	// game.scorm_helper.sendResult(count);
	// game.scorm_helper.sendResult(score);
	// set duration and save to scorm
	// game.scorm_helper.setDuration();
	// if score larger than minimum grade
	if(score >= game.min_score){
		// set to win
		game.audio.audioMenang.play();
		// game.scorm_helper.setStatus("passed");
		// $(".btn-next-result").css({"display":"block"});
		// $(".slider-content").addClass("win");
		// $(".title-result").html("Congratulations!");

		game.scorm_helper.sendResult(score);
    	game.scorm_helper.setSingleData('attemp',game.attemp);
    	game.scorm_helper.setStatus("passed");
		
		// go to next slide
		$(".btn-next-result").unbind().click(function(e){
			console.log('test');
			// game.audio.audioButton.play();
			// $(this).off();
			// game.nextSlide();

			game.audio.audioButton.play();

			/*function delete challenge answer*/
			// var formData = new FormData();
		 //    formData.append('username', game.username);
		 //    formData.append('cmid', game.module_id);
		 //    formData.append('attemp', game.attemp);
		 //    formData.append('challenge_id', game.game_data['curr_challenge']);
		    // var formData = {"cmid":game.module_id,"username":game.username};
		    var url = game.base_url+"challenge_answer.php?request=delete_challenge_answer";
		    // var async = false;
		    // $res = game.requestPost(url, async, formData);

		    $('.loader_image_index').show();
			$.post(url,{"cmid":game.module_id,"username":game.username,"attemp":game.attemp},function($res){
			    console.log($res);
			    // alert(JSON.stringify($res));
			    $('.loader_image_index').hide();
			    if($res.status == 200){
			    	try{
			            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
			            btn_back.click();
			        }
			        catch(e){
			            top.window.close();
			        }
			    }else{
			    	// alert('Server error!, please call administrator');
			    	var text = 'Server error!, please call administrator';
			    	game.popupText(text, action = 1);
					$("#popupalert2 .closealert").click(function(e){
			            $("#popupalert2").modal("hide");

			            $('.loader_image_index').show();
			        });
			    }
			}, 'json')
			.fail(function(e2) {
				$(".loader_image_index").hide();
				console.log(e2);
				game.popupText(game.error_request_global, action = 1);
				$("#popupalert2 .closealert").click(function(e){
		            $("#popupalert2").modal("hide");
		            $('.loader_image_index').show();
		        });
			});
		    /*End function delete challenge answer*/
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

Result.prototype.getBadges = function(score){
	console.log(game.arr_badges);
	if(game.arr_badges != undefined){
		console.log(game.arr_badges.length);
		if(game.arr_badges.length > 0){
			for (var i = 0; i < game.arr_badges.length; i++) {
				var score_badges_from = game.arr_badges[i][0];
				var score_badges_to = game.arr_badges[i][1];
				console.log(score_badges_from+' - '+score_badges_to+' - '+score);
				if(score_badges_from <= score && score_badges_to >= score){
					console.log('return');
					return i+1;
				}
			}
		}
	}

	return false;
};

Result.prototype.getBadges_2 = function(score){
	var url = game.base_url_2+'api/public/index.php/check_badge/'+game.username+'/'+game.module_id+'/'+score;
	var res = game.requestGet(url, false);
	console.log(res);
	res = res['data']['badges'];
	console.log(res);
	// $.get(url,function(e){	
	// 	game.arr_badges = e;
	// 	console.log(game.arr_badges);
	// 	return game.arr_badges;
	// 	// if(game.arr_badges != undefined){
	// 	// 	console.log(game.arr_badges.length);
	// 	// 	if(game.arr_badges.length > 0){
	// 	// 		for (var i = 0; i < game.arr_badges.length; i++) {
	// 	// 			var score_badges_from = game.arr_badges[i][0];
	// 	// 			var score_badges_to = game.arr_badges[i][1];
	// 	// 			console.log(score_badges_from+' - '+score_badges_to+' - '+score);
	// 	// 			if(score_badges_from <= score && score_badges_to >= score){
	// 	// 				console.log('return');
	// 	// 				return i+1;
	// 	// 			}
	// 	// 		}
	// 	// 	}
	// 	// }
	// },'json');

	return res;
};