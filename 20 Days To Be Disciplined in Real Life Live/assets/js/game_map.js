var gameMap = function(){

}

gameMap.prototype.init = function() {
	console.log("init gameMap");
	var $this = this;
	$this.image_path = game.image_path;
	// console.log(game.game_data);
	$this.game_data = game.game_data;

	// console.log($this.game_data);

	$this.category_game = $this.game_data['category_game'];

	//get curr challenge
	$this.curr_challenge = 1; //default challenge
	
	if(game.modeInterval == 1){
		var interval = $this.setCurrSoal();
		game.game_data['interval_days'] = interval;
		// console.log(interval);
		(interval >= game.total_soal ? interval = (game.total_soal - 1) : '');
		// console.log(interval);

		//passed challenge based on interval day
		if(game.next_challenge_until_played != undefined){
			if(game.next_challenge_until_played == true){
				//if interval > 1, continue to next stage
				if(interval > 1){
					interval = 1;
				}else{
					interval = 0;
				}
			}
		}
	
		$this.curr_challenge += interval;
		// console.log('curr_challenge: '+$this.curr_challenge);
	}else if(game.modeInterval == 2){
		// game.game_data['curr_challenge'] = 5;
		// game.game_data['date_last_submit'] = '2019-05-02';
		// game.game_data['flag_increment_step_by_answer'] = 1;
		if(game.game_data['curr_challenge'] != undefined){
			$this.curr_challenge = game.game_data['curr_challenge'];
		}
		console.log(game.game_data);

		$this.flag_date_last_submit = 0;
		$this.curr_challenge_scoes_track = game.game_data['curr_challenge'];
		// game.game_data['date_last_submit'] = "2019-04-30";
		// game.game_data['flag_increment_step_by_answer'] = 1;
		if(game.game_data['date_last_submit'] != undefined){
			$this.flag_date_last_submit = 1;
			var res = $this.flagIncrementCurrentChallenge();
			if(res == true){
				$this.curr_challenge += 1;
				game.game_data['date_last_submit'] = undefined;
				if($this.curr_challenge > game.total_challenge){
					$this.curr_challenge = game.total_challenge;
				}
			}
		}
		else{
			// var interval = $this.setCurrSoal();
			// game.game_data['interval_days'] = interval;
			// console.log(interval);
			// if(interval > 0 && game.game_data['curr_challenge'] != undefined){
			// 	if(game.game_data['curr_challenge'] > 1){

			// 	}
			// }

			// if(game.game_data['mode_interval'] == undefined){
				// $(".loader_image_index").show();
				// $.post(game.base_url+"get_challenge_review.php",{"cmid":game.module_id,"username":game.username},function(e2){
				// 	$(".loader_image_index").hide();
				// },'json')
				// .fail(function(e) {
				// 	$(".loader_image_index").hide();
				// 	console.log(e);
				// 	game.popupText(game.error_request_global);
				// });
			// }
		}

		game.game_data['interval_days'] = $this.curr_challenge - 1;
	}	
	
	//set game last challenge
	game.game_data['curr_challenge'] = $this.curr_challenge;
	console.log(game.game_data);
	
	//get current score
	$this.curr_score = ($this.game_data['curr_score'] == undefined ? 0 : $this.game_data['curr_score']);
	$this.hasReview = true; //status semua challenge sudah diisi dan direview oleh supervisor

	var current = game.scorm_helper.getCurrSlide();
	// var current = 3;
	var listSlider = game.arr_content[current]["slide_data"];
    $this.listSlider = listSlider;
    // console.log($this.listSlider);

    //set score per soal
    $this.score_per_soal = game.max_score / game.total_soal;

    $this.attemp = game.attemp;
    $this.newAttemp = game.newAttemp;
    $this.pointNotFilled = 0;
    $this.total_score_notFilled = 0;

    //check status on review
 //    if($this.game_data['on_review'] != undefined){
	// 	if($this.game_data['on_review'] == true){
	// 		game.setSlide(6);
	// 	}
	// }
	$.get("config/game_map.json",function(e){
		console.log(e);
		//data map
		$this.ldataMap = e;

		$(".loader_image_index").show();
		$.get("config/setting_quiz_slide_3.json",function(res){
			console.log(res);
			//data quiz
			if(game.total_challenge != undefined){
				res = game.duplicateDataQuiz(res); 
			}
			console.log(res);
			$this.ldata = res;
			$this.mulai_game();
		},'json')
		.fail(function(e) {
			$(".loader_image_index").hide();
			console.log(e);
			alert("Cannot load data json from local !");
		});
	},'json');
};

gameMap.prototype.flagIncrementCurrentChallenge = function(){
	var last_date = game.game_data['date_last_submit'];
	console.log(last_date);
	// alert(last_date);
	var date_server = game.getDate2();
	console.log(date_server);
	// alert(date_server);
	last_date = new Date(last_date.replace(/-/g, "/"));
	date_server = new Date(date_server.replace(/-/g, "/"));
	var d1 = new Date(last_date);
	var d2 = new Date(date_server);
	// alert(d1);
	// alert(d2);
	console.log(d1+' - '+d2);
	var reviewTrue = 1;
	if(d1 == undefined){
		reviewTrue = 0;
		alert('Date last submit undefined!');
	}else if(d2 == undefined){
		reviewTrue = 0;
		alert('Date server submit undefined!');
	}

	if(reviewTrue == 0){
		game.setSlide(-1);
	}else{
		if(d1 < d2){
			return true;
		}else{
			return false;
		}
	}
};

gameMap.prototype.mulai_game = function(){
	console.log('mulai_game');
	var $this = this;
	/*Comment by elim*/
	$(".loader_image_index").show();
	$.post(game.base_url+game.get_challenge_review_file,{"cmid":game.module_id,"username":game.username},function(e2){
		$(".loader_image_index").hide();
		// e2 = [];
		console.log(e2);
		$this.last_challange = e2;
		if($this.last_challange.length > 0){
			$this.last_challange.sort(function(a, b) {
	            return a.activityid - b.activityid;
	        });
	        // console.log($this.last_challange);
	        var ldata2 = $this.last_challange;
	        console.log('game.attemp: '+game.attemp);
	        var res = $this.setAttemp(ldata2);
	        game.attemp = res['highest_attemp'];
	        game.newAttemp = res['newAttemp'];
	        $this.attemp = game.attemp;
	        $this.newAttemp = game.newAttemp;
	        console.log('game.attemp: '+game.attemp);

	        /*Function set curr_challenge_scoes_track*/
	        	if(game.modeInterval == 2){
		        	if($this.flag_date_last_submit == 0 && game.game_data['flag_increment_step_by_answer'] == undefined){
		        		var last_challange_id = 1;
		        		var curr_challenge_before = $this.curr_challenge;
		        		for (var i = 0; i < ldata2.length; i++) {
		        			// console.log($this.attemp);
		        			// console.log(ldata2[i]['attemp']);
		        			if($this.attemp == ldata2[i]['attemp']){
		        				// console.log(ldata2[i]['challenge_id']);
		        				// console.log(last_challange_id);
		        				if(ldata2[i]['challenge_id'] >= last_challange_id){
		        					// console.log(ldata2[i]['challenge_id']);
		        					last_challange_id = parseInt(ldata2[i]['challenge_id']);
		        					// console.log(last_challange_id);

		        					var submit_date = ldata2[i]['submit_date'];
		        					submit_date = new Date(submit_date.replace(/-/g, "/"));
		        					var date_server = game.getDate2();
		        					// date_server = '2019-05-02';
		        					// console.log(date_server);
									date_server = new Date(date_server.replace(/-/g, "/"));
									var d1 = new Date(submit_date);
									var d2 = new Date(date_server);

									console.log(submit_date);
									console.log(date_server);
									console.log($this.curr_challenge - 1);
									console.log(last_challange_id);
									if(submit_date < date_server){
										console.log(submit_date+' - '+date_server);
										$this.curr_challenge = last_challange_id + 1;
									}
									// console.log(last_challange_id);
		        				}
		        			}
		        		}

		        		$this.curr_challenge_scoes_track = last_challange_id;

		        		console.log(curr_challenge_before);
		        		console.log($this.curr_challenge);
		        		if(curr_challenge_before < $this.curr_challenge){
		        			game.game_data['flag_increment_step_by_answer'] = 1;
		        		}


						/*Function set interval*/
							// var interval_2 = $this.setCurrSoal();
							// console.log(interval_2);
							// game.game_data['interval_days'] = interval_2;
							// // console.log(interval);
							// (interval_2 >= game.total_soal ? interval_2 = (game.total_soal) : '');
							// // console.log(interval_2);

							// interval_2 += 1;
							// console.log(interval_2 + 1);
							// console.log($this.curr_challenge);
							// if(interval_2 > $this.curr_challenge){
							// 	console.log('test');
							// 	$this.curr_challenge =  interval_2;
							// }
						/*End function set interval*/

		        		if($this.curr_challenge > game.total_challenge){
							$this.curr_challenge = game.total_challenge;
						}

						console.log($this.curr_challenge);
						game.game_data['interval_days'] = $this.curr_challenge - 1;
						game.game_data['curr_challenge'] = $this.curr_challenge;
		        	}
		        }
	        /*End function set curr_challenge_scoes_track*/

	        var amount_challenge = 0;
			for (var i = 0; i < ldata2.length; i++) {
				//get data from database
				var attemp_prev = ldata2[i]["attemp"];
				// var category_game_prev = ldata2[i]["category_game"];
				(attemp_prev == 0 ? attemp_prev = 1 : '');
				// (category_game_prev == null ? category_game_prev = 'sales' : '');
				// console.log(attemp_prev+' - '+$this.attemp);
			    // if(attemp_prev < $this.attemp){
			    //     $this.newAttemp = true;
			    //     game.newAttemp = true;
			    //     break;
			    // }else{
			    	// console.log(category_game_prev+' - '+$this.category_game);
			    	//attemp same, but category game different
			    	// if(category_game_prev != $this.category_game){
			    	// 	$this.newAttemp = true;
			    	// 	game.newAttemp = true;
			    	// 	break;
			    	// }
			    // }

		        /*Function set curr_challenge*/
		        console.log($this.flag_date_last_submit);
		        if(game.modeInterval == 2){
			        if($this.flag_date_last_submit == 0 && game.game_data['flag_increment_step_by_answer'] == undefined){
			        	console.log($this.curr_challenge+' - '+$this.curr_challenge_scoes_track);
						if($this.curr_challenge_scoes_track != undefined){
							// if($this.curr_challenge_scoes_track > 1){
								console.log(ldata2[i]);
								console.log($this.curr_challenge_scoes_track+' - '+ldata2[i]['challenge_id']);
								if($this.curr_challenge_scoes_track == ldata2[i]['challenge_id']){
									var curr_activityid = ldata2[i]['activityid'];
									var max = $.deretAritmatika(4, 4, ldata2[i]['sub_challenge_id']); //function deret aritmatika kyubi.js

									var min = $.deretAritmatika(1, 4, ldata2[i]['sub_challenge_id']); //function deret aritmatika kyubi.js
									console.log(min+' - '+curr_activityid);
									if(min == curr_activityid){
										amount_challenge += 1;
									}
								}
							// }
						}
					}
				}
				/*End function set curr_challenge*/
			}

			//migration from mode interval 1 to mode interval 2. If min submit 1, at curr_challenge, add curr_challenge 1. 
			// if($this.flag_date_last_submit == 0 && game.game_data['flag_increment_step_by_answer'] == undefined){
			// 	console.log(amount_challenge);
			// 	if(amount_challenge > 0){
			// 		var date_server = game.getDate2(); //get date from server
			// 		// game.game_data['date_last_submit'] = date_server;
			// 		// console.log($this.curr_challenge_scoes_track);
			// 		// if($this.curr_challenge_scoes_track != undefined){
			// 		// 	$this.curr_challenge = parseInt($this.curr_challenge_scoes_track);
			// 		// }
			// 		// console.log($this.curr_challenge);
			// 		// $this.curr_challenge += 1;
			// 		// console.log($this.curr_challenge+' - '+game.total_challenge);
			// 		if($this.curr_challenge > game.total_challenge){
			// 			$this.curr_challenge = game.total_challenge;
			// 		}
			// 		// console.log($this.curr_challenge);
			// 		game.game_data['interval_days'] = $this.curr_challenge - 1;
			// 		game.game_data['curr_challenge'] = $this.curr_challenge;
			// 		// game.game_data['flag_increment_step_by_answer'] = 1;
			// 		console.log(game.game_data);
			// 	}
			// }
			// alert($this.curr_challenge);

			console.log($this.newAttemp);
	        //append html content
			$this.appendHtml();
		}else{
			$this.appendHtml();
		}
    },'json')
	.fail(function(e2) {
		$(".loader_image_index").hide();
		console.log(e2);
		game.popupText(game.error_request_global);
	});
	/*End comment by elim*/

	// var formData = new FormData();
 //    formData.append('user_id', game.username);
 //    formData.append('search', game.module_id);
	// var res = game.requestPost(game.base_url+"get_challenge_review.php", false, formData);
	// console.log(res);
}

gameMap.prototype.appendHtml = function() {
	var $this = this;
	var clone = $(".wrap").clone();
	$(".wrap").text("");
	// console.log($this);
	var data = $this.ldataMap
	// console.log(data);

	var total_soal = 0;
	if(data.length > 0){
		for (var i = 0; i < data.length; i++) {
			var no = i+1;
			$(clone).find("#div_map-"+no+" img.img_map").attr("src", $this.image_path+"map/"+data[i]['image_1']);

			var data2 = data[i]['data'];
			console.log(data2);
			if(data2.length > 0){
				for (var j = 0; j < data2.length; j++) {
					var no2 = j+1;
					var clone2 = $(clone).find("#div_map-"+no);
					total_soal += 1;
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2).attr("id", "dynamic_img-"+data2[j]['id']); 
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_step").attr("src", $this.image_path+"map/"+data2[j]['image_1']); 
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_step-2").attr("src", $this.image_path+"map/"+data2[j]['image_2']); 
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .dynamic_txt").html(data2[j]['text']);

					var challenge = data2[j]['id'];
					// console.log($this.curr_challenge+'-'+challenge);
					if($this.curr_challenge >= challenge){
						if($this.curr_challenge == challenge){
							// console.log('here');
							$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_curr_step").css('display', 'unset');
							$(clone).find("#div_map-"+no+" .dynamic_img-"+no2).addClass('active');
						}else{
							$(clone).find("#div_map-"+no+" .dynamic_img-"+no2).addClass('active');
						}
					}
				}
			}
		}
	}

	game.score = $this.setCurrScore();
	// game.score = 300;
	console.log(game.score);
	//set total soal
	game.total_soal = total_soal;
	//count current score and append
	// console.log('game.score: '+game.score);
	// game.score = 80;
	$this.curr_score = game.score;
	game.game_data['curr_score'] = $this.curr_score;
	$(clone).find(".curr_score").html($this.curr_score);
	$(clone).find(".total_score").html('/'+game.max_score);
	$('.wrap').append(clone);
	// $this.createSlider();

	if(game.show_modal_curr_day_score != undefined){
    	// if(game.show_modal_curr_day_score == 0){
    		//set day
    		$('.dynamic_text_day').html('DAY '+$this.curr_challenge); 
    		$('.curr_score_game_map').html($this.curr_score); 
    		$('.total_score_game_map').html(' / '+game.max_score); 
    		$('.popupdialogbox_game_map').modal('show');

    		$('.close_modal_game_map').click(function(e){
    			$('.popupdialogbox_game_map').modal('hide');
    			// game.show_modal_curr_day_score = 1;
   				//set focus to class input_code
   				$('.input_code').focus();

   				$('.input_code').on('keyup', function() {
   					console.log(this.value);
					if(this.value == 'date123'){
						game.mode_development = 1;
						var date_server = game.getDate2();
				        $('.date_server').val(date_server);
				        $('.date_server_2').html(date_server);
				        $('.mode_interval_select').val(game.modeInterval);
				        $('.div_date_server').css('display','block');
				    }
   				});
    		});
    	// }
    }

    // console.log(game.mode_development);
	if(game.mode_development != undefined){
		if(game.mode_development == 1){
			var date_server = game.getDate2();
			$('.date_server').val(date_server);
			$('.date_server_2').html(date_server);
			$('.mode_interval_select').val(game.modeInterval);
			$('.div_date_server').css('display','block');
		}
	}

	//event click soal
	const curr_challenge = $this.curr_challenge;
	$('.dynamic_img').click(function(e){
		var id = e.currentTarget.id;
		id = id.split('-');
		console.log(id[1]+'-'+curr_challenge);
		game.current_challenge = id[1];
		if(id[1] <= curr_challenge){
			//prevent click more than one
			if ( $(this).hasClass("unclickable") ) {
				e.preventDefault();
	    	} else {
	    		$(this).addClass("unclickable");
	    		game.scorm_helper.setSingleData('game_data', game.game_data);
				game.setSlide(4);
			}
		}
	});

	$(".img-tutorial").click(function(e){
	// 	// $this.createModalSlider();
        game.audio.audioButton.play();
 //        //open modal
 		$(".modal#tutorial .tutorial").show();
        $(".modal#tutorial").modal("show");

   		$('#ulasan').slick({
   		    dots: true,
   	       	infinite: false,
   
        });
     
    	$("#tutorial .start-game").click(function(e){
    		$(".modal#tutorial .tutorial").hide();
    		$("#tutorial").modal("hide");
     	});

    });
	
    $('.btn_date_server').click(function(){
    	var val = $('.date_server').val();
    	var arr_val = val.split('-');
    	var returnval = true;
    	if(arr_val[0].length != 4){
    		returnval = false
    	}

    	if(arr_val[1].length != 2){
    		returnval = false
    	}

    	if(arr_val[2].length != 2){
    		returnval = false
    	}

    	if(val != '' && returnval == true){
    		game.manual_date_server = $('.date_server').val();
    		console.log(game.manual_date_server);
    		game.setSlide(3);
    	}else{
    		alert('Tolong isi date server, pastikan format benar exp.`2019-04-02`');
    	}
    });

    $('.mode_interval_select').change(function(){
    	var val = $(this).val();

    	game.modeInterval = val;
    	game.setSlide(3);
    });

    var url = game.base_url_2+'api/public/index.php/check_badge/'+game.username+'/'+game.module_id+'/'+game.score;
    //set scorm score
    game.scorm_helper.sendResult(game.score);
    $.get(url,function(e){
    	console.log(e);
    	if(e){
    		/*call count score function*/
    		$this.countScoreResult();
    	}
    },'json');
};


/*function count score*/
gameMap.prototype.countScoreResult = function(){
	var $this = this;

	console.log('game.total_soal: '+game.total_soal);
	// $this.score_per_soal = game.max_score / game.total_soal;
	console.log($this.game_data);
	console.log($this.game_data['category_game']);
	// $this.curr_score = 0;
	$this.curr_challenge = $this.game_data['curr_challenge'];
	($this.game_data['curr_score'] != undefined ? $this.curr_score = $this.game_data['curr_score'] : '');
	var sisa_challenge = game.total_soal - $this.curr_challenge;

	/*Function count step not filled into score*/
	//get perkiraan score dari score sekarang hingga score akhit, diambil jika menang terus atau score 5
	console.log('$this.curr_challenge: '+$this.curr_challenge+' game.total_soal: '+game.total_soal);
	if($this.curr_challenge <= game.total_soal){
		var total_score_notFilled = (game.total_soal - $this.curr_challenge) * 20;
		$this.total_score_notFilled = total_score_notFilled;
	}
	/*End function count step not filled into score*/

	console.log('$this.curr_score: '+$this.curr_score+' sisa_challenge: '+sisa_challenge+' $this.score_per_soal: '+$this.score_per_soal+' $this.total_score_notFilled: '+$this.total_score_notFilled);
	var perkiraan_score_akhir = $this.curr_score + (sisa_challenge * $this.score_per_soal) + $this.total_score_notFilled;
	// var perkiraan_score_akhir = 74;
	console.log('perkiraan_score_akhir: '+perkiraan_score_akhir);
	console.log('$this.hasReview: '+$this.hasReview);

	if(perkiraan_score_akhir < game.min_score && $this.hasReview == true){
		game.openModal('modal_feedback');
	}else{
		// game.game_data['flag_submit_last_challange'] = 1;
		// $this.hasReview = true;
		console.log($this.curr_challenge+' - '+game.total_soal+' - '+$this.hasReview+' - '+game.game_data['flag_submit_last_challange']+' - '+game.game_data['interval_days']);
		if($this.curr_challenge == game.total_soal && $this.hasReview == true){
			if(game.modeInterval == 2){
				if(game.game_data['flag_submit_last_challange'] != undefined){ //jika flag_submit_last_challange 
					if(game.min_score <= $this.curr_score && game.game_data['flag_submit_last_challange'] == 1){
						$(".modal-backdrop").hide();
						game.game_data['curr_score'] = $this.curr_score;
						game.scorm_helper.setSingleData('game_data', game.game_data);
						game.setSlide(7);
					}
				}else if(game.game_data['interval_days'] != undefined){ 
					if(game.game_data['interval_days'] > game.total_soal && $this.hasReview == true){//jika hari lebih besar dari 20 hari
						$(".modal-backdrop").hide();
						game.game_data['curr_score'] = $this.curr_score;
						game.scorm_helper.setSingleData('game_data', game.game_data);
						game.setSlide(7);
					}
				}
			}else{
				console.log(game.min_score+' - '+$this.curr_score);
				if(game.min_score <= $this.curr_score){
					$('.close_modal_game_map').click(function(){
						$(".modal-backdrop").hide();
						game.game_data['curr_score'] = $this.curr_score;
						game.scorm_helper.setSingleData('game_data', game.game_data);
						game.setSlide(7);
					});
				}
			}
		}
	}	

	//event click try again
	$('.close_feedback').unbind().click(function(){
		game.scorm_helper.setStatus('failed');
		var date = game.getDate2();
		// $this.game_data = {};
		// game.scorm_helper.setSingleData('game_data', undefined);

		//set new attemp
		game.closeModal('modal_feedback');
		//got to cover page

		if($this.curr_challenge != undefined){
			// var formData = new FormData();
		 //    formData.append('username', game.username);
		 //    formData.append('cmid', game.module_id);
		 //    formData.append('attemp', $this.attemp);
		    // formData.append('challenge_id', $this.curr_challenge);
		    game.amount_try_again += 1;
		    // var formData = {"cmid":game.module_id,"username":game.username};

		   	console.log($this.curr_score);
		   	console.log($this.hasReview);
		   	// if($this.curr_score > 0 && $this.hasReview == true){
			    var url = game.base_url+"challenge_answer.php?request=delete_challenge_answer";
			    var async = false;
			    // $res = game.requestPost(url, async, formData);
			    $('.loader_image_index').show();
			    $.post(url,{"cmid":game.module_id,"username":game.username,"attemp":$this.attemp},function($res){
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
				    	// console.log('try again response error');
				    	// try{
				     //        var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
				     //        btn_back.click();
				     //    }
				     //    catch(e){
				     //        top.window.close();
				     //    }
				    	// alert('Server error!, please call administrator');
				    	alert("Breathe. It's just a bad connection, not a bad life. Please find a better place for a better connection. But close this module first!");
				    	game.popupText('Server error!, please call administrator');

				    	game.scorm_helper.setStatus("failed");
				    	game.scorm_helper.setSingleData('attemp',game.attemp);
		   				game.scorm_helper.sendResult(game.score);

				    }
			    },'json')
			    .fail(function(e2) {
					$(".loader_image_index").hide();
					console.log(e2);

					$('.popupdialogbox_game_map').modal('hide');
					game.popupText(game.error_request_global, action = 1);
					$("#popupalert2 .closealert").click(function(e){
			            $("#popupalert2").modal("hide");

			            $('.loader_image_index').show();
			        });
				});
						// }else{
			// 	console.log('quit without request');
			// 	try{
		 //            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
		 //            btn_back.click();
		 //        }
		 //        catch(e){
		 //            top.window.close();
		 //        }
			// }
		}
	});
}

gameMap.prototype.setCurrScore = function(){
	console.log('setCurrScore');
	var $this = this;
	var total_score = 0;
	if($this.ldata.length > 0){
		//looping challenge
		for (var i = 0; i < $this.ldata.length; i++) {
			var challangeId = $this.ldata[i]['id'];
			var data2 = $this.ldata[i]['data'];
			var curr_score_per_challenge = 0;
			if(data2.length > 0){
				var curr_score_per_sub_challenge = $this.score_per_soal / data2.length;
				var point = 0;
				//looping subchallenge
				for (var j = 0; j < data2.length; j++) {
					var curr_activityid = data2[j]['activityid'];
					//flag find subchallenge in database based on attemp
					var flagFindSubChallenge = 0;

					if($this.last_challange.length > 0){
						var flagPoint = 0;
						//looping subchallenge in database
						for (var k = 0; k < $this.last_challange.length; k++) {
							var activityid = $this.last_challange[k]['activityid'];
							var grade = $this.last_challange[k]['grade'];
							var challange_id = $this.last_challange[k]['challenge_id'];
							//field deleted_at in challenge answer, data deleted
							var deleted_at = $this.last_challange[k]['deleted_at'];
							var max = game.max_file_upload + 1;
							var min = 1;
							if(curr_activityid > 1){
								var deret_n = $.deretAritmatika(4, 4, curr_activityid); //function deret aritmatika kyubi.js
								max = deret_n;

								var deret_n2 = $.deretAritmatika(1, 4, curr_activityid); //function deret aritmatika kyubi.js
								min = deret_n2;
							}

							//check activityid text
							// console.log($this.last_challange[k]);
							// console.log(challange_id);
							// console.log($this.curr_challenge);
							// console.log(curr_activityid);
							//check challenge id from json and database
							// console.log($this.newAttemp);
							if($this.newAttemp == false){
								//compare challenge id in json and database
								if($this.ldata[i]['id'] == challange_id){
									if(activityid >= min && activityid <= max){
										if(deleted_at == null){
											flagFindSubChallenge = 1;
											if(grade == 100){ //if review img and text accepted
												console.log('test');
												flagPoint = 1;
											}else if(grade == 0){ //if review img and text rejected
												flagPoint = 0;
												break;
											}else if(grade == -1){
												flagPoint = 0;
												$this.hasReview = false;
												break;
											}
										}
									}
								}
							}else{
								var last_attemp = ($this.last_challange[k]['attemp'] == 0 ? 1 : $this.last_challange[k]['attemp']);
								if($this.ldata[i]['id'] == challange_id && last_attemp == $this.attemp){
									if(activityid >= min && activityid <= max){
										if(deleted_at == null){
											flagFindSubChallenge = 1;
											if(grade == 100){ //if review img and text accepted
												flagPoint = 1;
											}else if(grade == 0){ //if review img and text rejected
												flagPoint = 0;
												break;
											}else if(grade == -1){
												flagPoint = 0;
												$this.hasReview = false;
												break;
											}
										}
									}
								}
							}
						}
						if(flagPoint == 1){
							point += 1;
						}
					}
					//if subchallenge not found in database
					// if(flagFindSubChallenge == 0){
					// 	console.log('$this.curr_challenge: '+$this.curr_challenge+' challangeId: '+challangeId);
					// 	if($this.curr_challenge == challangeId){
					// 		// $this.hasReview = false;
					// 		$this.pointNotFilled += 1;
					// 	}
					// }
				}

				// console.log('challange_id: '+$this.ldata[i]['id']);
				console.log('curr_score_per_sub_challenge: '+curr_score_per_sub_challenge+' point: '+point+' $this.pointNotFilled: '+$this.pointNotFilled);
				var curr_score_per_challenge = curr_score_per_sub_challenge * point;
				// var curr_score_per_challenge_2 = curr_score_per_sub_challenge * $this.pointNotFilled;
				// console.log('total_score: '+total_score);
				total_score += curr_score_per_challenge;
				// $this.total_score_notFilled = curr_score_per_challenge_2;
				console.log($this.total_score_notFilled);
				// console.log('total_score: '+total_score);
			}
		}
	}
	// console.log(total_score);
	return total_score;	
}

//set current soal from start date and current date
gameMap.prototype.setCurrSoal = function(){
	var $this = this;
	var date = game.getDate2();
	console.log('date: '+date);
	console.log(game.game_data);
	var last_date = game.game_data['start_date'];
	console.log('last_date: '+last_date);

	var start = new Date(last_date.replace(/-/g, "/"));

	console.log('date: '+date);
	var end = new Date(date.replace(/-/g, "/"));

	console.log('start: '+start);
	console.log('end: '+end);
	var interval = $.datediff(start,end);
	console.log(interval);
	//get weekend number
	console.log('game.challenge_on_weekend: '+game.challenge_on_weekend);
	if(game.challenge_on_weekend == false){
		var checkWeekend = $this.checkWeekend(start, interval);
		interval -= checkWeekend;
	}
	return interval;
}

gameMap.prototype.checkWeekend = function(start_date, interval){
	//cek weekend
	console.log('start_date: '+start_date);
	var countSaturdayOrSunday = 0;
	for (var i = 1; i <= interval; i++) {
		start_date.setDate(start_date.getDate() + 1);
		console.log(start_date);
		var day = start_date.getDay();
		console.log('day: '+day);
		if(day === 6 || day === 0){
			// 6 = Saturday, 0 = Sunday
			var minDay = 0;
			if(day === 6){
				countSaturdayOrSunday += 1;
			}else if(day === 0){
				countSaturdayOrSunday += 1;
			} 
			//if saturday min 1 day, if sunday min 2 days
			// console.log(start_date.getDate());
			// console.log(start_date.getDate() - minDay);
			// start_date.setDate(start_date.getDate() - minDay);
		}
	}
	
	return countSaturdayOrSunday;
}

// gameMap.prototype.createSlider = function() {
// 	var $this = this;
// 	$this.list_slider = $(".list_slider").first().clone();
// 	$this.button = $(".button").first().clone();
// 	// $('#ulasan').text('test');
// 	// $('.btn-standard').text('test');
// 	console.log($this.listSlider);
// 	console.log($this.list_slider);
// 	console.log($this.button);
// 	for (var i = 0; i < $this.listSlider.length; i++) {
// 		var clone = $this.list_slider.clone();
		
// 		if($this.listSlider[i]["image"]){
// 			$(clone).find(".img-load").attr("src","assets/image/"+$this.listSlider[i]["image"]);
// 		}
// 		else{
// 			$(clone).find(".img-load").remove();	
// 		}

// 		if($this.listSlider[i]["ribbon"]){
// 			$(clone).find(".ribbon-content").html($this.listSlider[i]["ribbon"]);
// 		}
// 		else{
// 			$(clone).find(".rb-wrap").remove();
// 		}

// 		if($this.listSlider[i]["text"]){
// 			$(clone).find(".keterangan").html($this.listSlider[i]["text"]);
// 		}
// 		else{
// 			$(clone).find(".keterangan").remove();	
// 		}

// 		if($this.listSlider[i]["video"]){
// 			$("#video").find("source").attr("src","assets/video/"+$this.listSlider[i]["video"]);
// 			$("#video1")[0].load();
// 			$this.addVideoEvent(clone);
// 		}
// 		else{
// 			$(clone).find(".bg-video").remove();
// 		}

// 		if($this.listSlider[i]["click_and_show"]){
// 			var list = $this.listSlider[i]["click_and_show"];

// 			for (var l = 0; l < list.length; l++) {
// 				var cButton = $($this.ccButton).first().clone();
// 				$(cButton).find(".text").html(list[l]["title"]);
// 				$(clone).find(".click_and_show_wrapper").append(cButton);
// 				$(cButton).attr("index",l);
// 				$(cButton).click(function(e){
// 					$("#popupList .title").html($(this).find(".text").html());
// 					var cloneList = $(".point_wrapper_block").first().clone();
// 					var cloneWrapper = $(".point_wrapper").first().clone();
// 					$(".point_wrapper").html("");
// 					console.log(list[parseInt($(this).attr("index"))]["list"][parseInt($(this).attr("index"))]);
// 					for (var m = 0; m < list[parseInt($(this).attr("index"))]["list"].length; m++) {
// 							//console.log(list[parseInt($(this).attr("index"))]["list"][m]);
// 							var cList = $(cloneList).first().clone();
// 							$(cList).find(".point_desc").html(list[parseInt($(this).attr("index"))]["list"][m]);
// 							$(".point_wrapper").append(cList);
// 					}
// 					$("#popupList .btn-close").click(function(e){
// 						$(this).off();
// 						$("#popupList").modal("hide");
// 					});

// 					$("#popupList").modal("show");
// 				});
// 			}
// 		}
// 		else{
// 			$(clone).find(".click_and_show_wrapper").remove();
// 		}

// 		$("#ulasan").append(clone);

// 		if($this.listSlider[i]["button"]){
// 			for (var j = 0; j < $this.listSlider[i]["button"].length; j++) {
// 				var cloneBtn = $this.button.clone();
// 				$(cloneBtn).html($this.listSlider[i]["button"][j]["text"]);
// 				console.log($(clone).find(".button_wrapper"));
// 				$(clone).find(".button_wrapper").append(cloneBtn);
// 				if($this.listSlider[i]["button"][j]["gotoSlide"]){
// 					$(cloneBtn).attr("gotoSlide",$this.listSlider[i]["button"][j]["gotoSlide"]);
// 					$(cloneBtn).click(function(e){
// 						$(this).off();
// 						game.scorm_helper.setSlide(parseInt($(this).attr("gotoSlide"))-1);
// 						game.nextSlide();
// 					});
// 				}
// 				else{
// 					if($this.listSlider[i]["video"]){
// 						$(cloneBtn).click(function(e){
// 							$("#popupAlertVideo").modal("show");
// 						});
// 						$("#popupAlertVideo .popupalert-yes").click(function(e){
// 						    $(this).off();
// 						    $("#popupAlertVideo").modal("hide");
// 						    game.audio.audioButton.play();
// 						    game.nextSlide();
// 						});
// 						$("#popupAlertVideo .popupalert-no").click(function(e){
// 						    $("#popupAlertVideo").modal("hide");
// 						});
// 					}
// 					else{
// 						$(cloneBtn).click(function(e){
// 							$(this).off();
// 							game.nextSlide();
// 						});
// 					}
// 				}
// 			}
// 		}
// 		else{
// 			$(clone).find(".button_wrapper").remove();
// 		}
// 	}

// 	//event click soal
// 	// $("#ulasan").html('');
// 	// console.log($("#ulasan").html(''));
// 	$('#ulasan').slick({
//         dots: true,
//         infinite: false,
//         speed: 500
//       });
//       $("#ulasan").on('afterChange', function(event, slick, currentSlide, nextSlide){
//          $(".img-load").each(function(e){
//            var src = $(this).attr("src");
//            $(this).attr("src",src);
//          });
//      });

//     $(".popupList").slick({
//     	dots: true,
//     	infinite: false,
//     	speed: 500
//     });
// };

gameMap.prototype.setAttemp = function(ldata2){
	var $this = this;
	/*looping data challenge_answer, to get highest attemp*/
	var highest_attemp = 1; //highest attemp from challenge answer
	var newAttemp = false;
	var flag_deleted_at = 0;
	console.log(ldata2.length);
	for (var i = 0; i < ldata2.length; i++) {
		if(parseInt(ldata2[i]['attemp']) > highest_attemp){
			flag_deleted_at = 0;
			highest_attemp = parseInt(ldata2[i]['attemp']);
			// console.log(highest_attemp);
			var deleted_at = ldata2[i]['deleted_at'];
			console.log(deleted_at);
			if(deleted_at != null){
				flag_deleted_at = 1;
			}
		}
	}
	console.log(flag_deleted_at);
	if(highest_attemp == 1){
		for (var i = 0; i < ldata2.length; i++) {
			var deleted_at = ldata2[i]['deleted_at'];
			if(deleted_at != null){
				flag_deleted_at = 1;
			}
		}
	}

	console.log(highest_attemp);
	console.log($this.attemp);
	console.log(flag_deleted_at);

	if(flag_deleted_at == 1){
		highest_attemp = highest_attemp + 1;
		newAttemp = game.attemp; 
		// game.newAttemp = true;
		// $this.newAttemp = game.newAttemp;
	}

	var res = {
		'highest_attemp':highest_attemp,
		'newAttemp':newAttemp
	};

	return res;

	// // /*function untuk menentukan semua jawaban pada attemp sudah direview semua*/
	// var total_data_answer_this_attemp = 0; //varibel untuk data yang sudah mendapatkan review
	// // var flag_deleted_at = 0;
	// for (var i = 0; i < ldata2.length; i++) {
	// 	if(ldata2[i]['attemp'] == highest_attemp){
	// 		var grade = ldata2[i]['grade'];
	// 		if(ldata2[i]['deleted_at'] == null){
	// 			if(grade != -1){
	// 				total_data_answer_this_attemp += 1;
	// 			}
	// 		}	
	// 	}
	// }

	// $this.arr_challenge_per_upload = game.arr_challenge_per_upload;
	// $this.challenge_per_soal = game.challenge_per_soal;
	// var total_challenge_per_upload = 0;//get total soal dari sub challenge upload
	// for (var i = 0; i < $this.arr_challenge_per_upload.length; i++) {
	// 	total_challenge_per_upload += $this.challenge_per_soal * $this.arr_challenge_per_upload[i];
	// }
	// console.log('total_data_answer_this_attemp: '+total_data_answer_this_attemp);
	// if(total_data_answer_this_attemp == total_challenge_per_upload){
	// 	// console.log($this.game_data['flag_add_attemp']);
	// 	if($this.game_data['flag_add_attemp'] == undefined){
	// 		game.attemp = highest_attemp + 1;
	// 		$this.attemp = game.attemp; 
	// 		game.newAttemp = true;
	// 		$this.newAttemp = game.newAttemp;
	// 	}else{
	// 		game.attemp = highest_attemp;
	// 		$this.attemp = game.attemp; 
	// 	}
	// }
	// else{
	// 	if($this.game_data['flag_add_attemp'] != undefined){
	// 		if($this.game_data['flag_add_attemp'] == true){
	// 			game.attemp = highest_attemp + 1;
	// 			$this.attemp = game.attemp; 
	// 			game.newAttemp = true;
	// 			$this.newAttemp = game.newAttemp;
	// 		}else{
	// 			if($this.attemp < highest_attemp){
	// 				game.newAttemp = true;
	// 				$this.newAttemp = game.newAttemp;
	// 			}
	// 			game.attemp = highest_attemp;
	// 			$this.attemp = game.attemp; 
	// 			// game.newAttemp = true;
	// 			// $this.newAttemp = game.newAttemp;
	// 		}
	// 	}else{
	// 		game.attemp = highest_attemp + 1;
	// 		$this.attemp = game.attemp; 
	// 		game.newAttemp = true;
	// 		$this.newAttemp = game.newAttemp;
	// 	}
	// }
}

gameMap.prototype.addDays = function(days) {
    var last_date = game.game_data['start_date'];
	console.log('last_date: '+last_date);
	var date = new Date(last_date.replace(/-/g, "/"));
    date.setDate(date.getDate() + days);
    return date;
}