var reviewList = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

// reviewList.prototype.getScormLength = function(last_game) {
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

reviewList.prototype.init = function() {
	console.log('init reviewList');
	var $this = this;
	$this.count_review_buddy=0;
	$this.count_review_atasan=0;
	$this.count_review_learner=0;
	$this.game_data = game.game_data;
	console.log($this.game_data);
	// $this.category_game = game.getCategoryGame();
	$this.category_game = $this.game_data['category_game'];
	// $this.curr_challenge = game.scorm_helper.getSingleData("curr_challenge");
	// $this.curr_challenge = ($this.game_data["curr_challenge"] == undefined ? 1 : $this.game_data["curr_challenge"]);
	$this.curr_challenge = game.current_challenge;
	console.log($this.curr_challenge);

	$this.attemp = game.attemp;
    $this.newAttemp = game.newAttemp;

	$.get("config/setting_quiz_slide_3.json",function(e){
		// console.log(e);/**/
		$this.ldata = e;
		if(game.total_challenge != undefined){
			$this.ldata = game.duplicateDataQuiz($this.ldata); 
		}
		// console.log($this.ldata[$this.curr_challenge - 1]);
		$(".title_instruction span").html('');
		$(".desc_challenge").html('');
		if($this.ldata[$this.curr_challenge - 1]['data'].length > 0){
			$this.curr_soal = [];
			$this.curr_soal.push(e[$this.curr_challenge - 1]);

			$(".loader_image_index").show();
			$.post(game.base_url+game.get_challenge_review_file,{"cmid":game.module_id,"username":game.username},function(e2){
				$(".loader_image_index").hide();
				// console.log(JSON.stringify(e2));
				//get challenge answer before
				$this.last_challange = e2;
				$this.last_challange.sort(function(a, b) {
	                return a.activityid - b.activityid;
	            });
	            // console.log($this.last_challange);

	            /*check status on review*/
	            if($this.last_challange.length > 0){
	            	var onReview = true;
	            	var countSubChallenge = 0;
	            	var data_sub_challenge = $this.ldata[$this.curr_challenge - 1]['data'];
	            	console.log($this.last_challange);
	            	for (var h = 0; h < data_sub_challenge.length; h++) {

		            	for (var i = 0; i < $this.last_challange.length; i++) {
				            var max = game.max_file_upload + 1;
							var min = 1;
							var activityid = $this.last_challange[i]["activityid"];
							var challenge_id = $this.last_challange[i]["challenge_id"];
							var grade = $this.last_challange[i]["grade"];
							var deleted_at = $this.last_challange[i]["deleted_at"];
							var game_data = $this.game_data;
							// console.log(game_data);
							if(game_data['curr_challenge'] == undefined){
								game_data['curr_challenge'] = 1;
							}

							var max = game.max_file_upload + 1;
							var min = 1;
							if(data_sub_challenge[h]['activityid'] > 1){
								var deret_n = $.deretAritmatika(1, 4, data_sub_challenge[h]['activityid']); //function deret aritmatika kyubi.js
								min = deret_n;

								var deret_n2 = $.deretAritmatika(4, 4, data_sub_challenge[h]['activityid']); //function deret aritmatika kyubi.js
								max = deret_n2;
							}

							// console.log('min: '+min+' max: '+max+' activityid: '+activityid);
							if($this.newAttemp == false){
								if(activityid >= min && activityid <= max){
									if(deleted_at == null){
										countSubChallenge += 1;

										if(grade == 0 || grade == 100){
											onReview = false;
										}
										break;
									}
								}
							}else{
								var last_attemp = ($this.last_challange[i]['attemp'] == 0 ? 1 : $this.last_challange[i]['attemp']);
								if(activityid >= min && activityid <= max && last_attemp == $this.attemp){
									if(deleted_at == null){
										countSubChallenge += 1;

										if(grade == 0 || grade == 100){
											onReview = false;
										}
										break;
									}
								}
							}
						}
					}
					// console.log('countSubChallenge: '+countSubChallenge+' length_sub_challenge: '+data_sub_challenge.length);
					if(challenge_id == game_data['curr_challenge']){
						if(countSubChallenge == data_sub_challenge.length){
							if(onReview == true){
								game.game_data['on_review'] = true;
								$this.game_data = game.game_data;
								game.scorm_helper.setSingleData('game_data', game.game_data);
								game.setSlide(6);
							}
						}
					}
				}
				/*end check status on review*/

				//append html
				$this.appendHtml($this.curr_soal);
			},'json')
			.fail(function(e) {
				console.log(e);
				// alert("Breathe. It's just a bad connection, not a bad life. Please find a better place for a better connection. But close this module first!");
				
				game.popupText(game.error_request_global);
				$('.list-group').html('');
				$('.loader_image_index').hide();
			});
		}else{
			$('.list-group').html('<span color:red:>Quiz not found</span>');
		}
	},'json');
};

reviewList.prototype.appendHtml = function(data) {
	var $this = this;
	// console.log($this.last_challange);
	var clone = $(".wrap").clone();
	var mode = 2;
	// var clone2 = $(clone).find(".list-group-item").clone();
	$(".wrap").text("");

	var total_soal = 0;
	// console.log(data);
	if(data.length > 0){
		for (var i = 0; i < data.length; i++) {
			var no = i+1;
			$(clone).find(".title_instruction span").html(data[i]['label']);
			$(clone).find(".desc_challenge").html(data[i]['desc']);

			var data2 = data[i]['data'];
			// console.log(data2);
			if(data2.length > 0){
				// console.log('remove .list-group');
				var clone_item = $(clone).find('.list-group-item').clone();
				$(clone).find(".list-group").text('');
				for (var j = 0; j < data2.length; j++) {
					var no2 = j+1;
					total_soal += 1;

					var clone_item2 = $(clone_item).clone();
					if(mode == 1){
						// get activity id from calculate (n * 2 - 1)
						var curr_activityid = data2[j]['activityid'] * 2 - 1;
					}else{
						//get activityid, same with sub_challenge_id
						var curr_activityid = data2[j]['activityid'];
					}
					var id = 'list_group_item-'+data[i]['id']+'-'+data2[j]['activityid']+'-'+curr_activityid;
					//set id
					$(clone_item2).attr('id', id);
					$(clone_item2).find(".txt_dynamic").html(data2[j]['label']); 


					if($this.last_challange.length > 0){
						for (var k = 0; k < $this.last_challange.length; k++) {

							if(mode == 1){
								var activityid = $this.last_challange[k]['activityid'];
								var activityid2 = $this.last_challange[k+1]['activityid'];
								var grade = $this.last_challange[k]['grade'];
								var grade2 = $this.last_challange[k+1]['grade'];
								var deleted_at = $this.last_challange[k]['deleted_at'];

								if(activityid % 2 == 0){
									//check activityid text
									if(activityid == curr_activityid){
										if(grade == 100 && grade2 == 100){ //if review img and text accepted
											$(clone_item2).find(id+' .dot').hide();
											$(clone_item2).find(id+' .img_dynamic').show();
										}else if(grade == 0 && grade2 == 0){ //if review img and text rejected
											$(clone_item2).find(id+' .dot').hide();
											$(clone_item2).find(id+' .img_dynamic').attr('src', game.image_path+'review/'+'icon-decline.png');
											$(clone_item2).find(id+' .img_dynamic').show();
										}else if(grade == -1 && grade2 == -1){//if img and text still reviewing
											$(clone_item2).find(id+' .dot').hide();
											$(clone_item2).find(id+' .img_dynamic').attr('src', game.image_path+'review/'+'icon-submit.png');
											$(clone_item2).find(id+' .img_dynamic').show();
										}
										break;
									}
								}
							}else{
								var activityid = $this.last_challange[k]['activityid'];
								var grade = $this.last_challange[k]['grade'];
								var challange_id = $this.last_challange[k]['challenge_id'];
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
								// console.log($this.curr_challenge+'-'+challange_id);
								// console.log(curr_activityid);
								// console.log($this.newAttemp);
								// console.log(activityid);
								//newAttemp from game_map
								if($this.newAttemp == false){
									if($this.curr_challenge == challange_id){
										if(activityid >= min && activityid <= max){
											// console.log(id);
											if(deleted_at == null){
												if(grade == 100){ //if review img and text accepted
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').show();
												}else if(grade == 0){ //if review img and text rejected
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-decline.png');
													$(clone_item2).find('.img_dynamic').show();

													break;
												}else if(grade == -1){//if img and text still reviewing
													// console.log('test');
													// console.log(clone_item2);
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-submit.png');
													$(clone_item2).find('.img_dynamic').show();
												}
												// console.log(clone_item2);
											}
										}
									}
								}else{
									var last_attemp = ($this.last_challange[k]['attemp'] == 0 ? 1 : $this.last_challange[k]['attemp']);
									if($this.curr_challenge == challange_id && last_attemp == $this.attemp){
										if(activityid >= min && activityid <= max){
											// console.log(id);
											if(deleted_at == null){
												if(grade == 100){ //if review img and text accepted
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').show();
												}else if(grade == 0){ //if review img and text rejected
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-decline.png');
													$(clone_item2).find('.img_dynamic').show();

													break;
												}else if(grade == -1){//if img and text still reviewing
													// console.log('test');
													// console.log(clone_item2);
													$(clone_item2).find('.dot').hide();
													$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-submit.png');
													$(clone_item2).find('.img_dynamic').show();
												}
												// console.log(clone_item2);
											}
										}
									}
								}
							}
						}
						var list = '';
					}
					// console.log(clone_item2[0]['outerText']);
					// console.log(clone_item2);
					$(clone).find(".list-group").append(clone_item2);
			
				}
			}
		}
	}

	// //set total soal
	// game.total_sub_soal = total_soal;
	// //count current score and append
	// var curr_score = (game.max_score / game.total_soal) * game.score;
	// $(clone).find(".curr_score").html(curr_score);
	// $(clone).find(".total_score").html('/'+game.max_score);
	$('.wrap').append(clone);

	//event click soal
	$('.list-group-item').click(function(e){
		var id = e.currentTarget.id;
		id = id.split('-');
		// console.log(id);
		// game.game_data['curr_challenge'] = id[2];
		game.game_data['curr_sub_challenge'] = id[2];
		// game.scorm_helper.setSingleData('game_data', game.game_data);
		
		//prevent click more than one
		if ( $(this).hasClass("unclickable") ) {
			e.preventDefault();
    	} else {
    		$(this).addClass("unclickable")
			game.nextSlide();
		}
	});

	$('.btn-back').click(function(){
		$(this).off();
		game.setSlide(3);
	});
};