var ModulReview = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

var sc_data = [];

ModulReview.prototype.getScormLength = function(last_game) {
	var $this = this;
	console.log("sssssssssssssssss");
	console.log(last_game);
	console.log("sssssssssssssssss");
	var count = 0;
	for (var i = 0; i < last_game.length; i++) {
		if(last_game[i] !== void 0){
			count++;
		}
	}

	return count;
};

ModulReview.prototype.init = function() {
	console.log('init ModulReview');
	var $this = this;
	$this.count_review_buddy=0;
	$this.count_review_atasan=0;
	$this.count_review_learner=0;

	$this.game_data = game.game_data;
	console.log($this.game_data);
	$this.category_game = $this.game_data['category_game'];

	$this.curr_challenge = game.current_challenge;
	console.log('curr_challenge: '+$this.curr_challenge);

	$this.curr_sub_challenge = $this.game_data['curr_sub_challenge'];
	// $this.curr_sub_challenge = 2; //comment

	$this.mission_complete = 0; 
	$this.mission_total = 0;

	$this.max_file_upload = game.max_file_upload;

	$this.sc_data = [];

	$this.max_activityid = $this.max_file_upload * $this.curr_challenge + 1;

	//set variabel status submit
	$this.flagSubmit = 0;

	$this.arr_last_challenge = [];
	//flag data sudah didelete di database, if 1 data sudah didelete
	$this.isDeletedatNull = 1;
	$this.count_sub_challenge_before = 0;

	$this.attemp = game.attemp;
    $this.newAttemp = game.newAttemp;
    $this.scorm_attempt = game.scorm_attempt;

    $this.reviewer = 1;

    console.log(game.game_data['amount_choose_reviewer_peer']);
    // game.game_data['amount_choose_reviewer_peer'] = 10;
    $this.amount_choose_reviewer_peer = (game.game_data['amount_choose_reviewer_peer'] != undefined ? game.game_data['amount_choose_reviewer_peer'] : 0);
    console.log($this.amount_choose_reviewer_peer);
    $this.limit_choose_reviewer_peer = game.limit_choose_reviewer_peer;
	
	$.get("config/setting_quiz_slide_3.json",function(e){
		console.log(e);
		if(game.total_challenge != undefined){
			e = game.duplicateDataQuiz(e); 
		}
		// $this.ldata = e;
		console.log($this.curr_sub_challenge);
		if($this.curr_challenge > 1){
			for (var i = 0; i < ($this.curr_challenge - 1); i++) {
				console.log(e[i]['data'].length);
				var count = e[i]['data'].length;
				$this.count_sub_challenge_before += count;
			}
			console.log($this.count_sub_challenge_before);
			console.log($this.curr_sub_challenge - 1 - $this.count_sub_challenge_before);
			var curr_soal = e[$this.curr_challenge - 1]['data'][$this.curr_sub_challenge - 1 - $this.count_sub_challenge_before];
			$this.curr_soal = [];
			$this.curr_soal.push(e[$this.curr_challenge - 1]['data'][$this.curr_sub_challenge - 1 - $this.count_sub_challenge_before])
			console.log($this.curr_soal);
			$this.mission_total = e[$this.curr_challenge - 1]['data'].length;
		}else{
			var curr_soal = e[$this.curr_challenge - 1]['data'][$this.curr_sub_challenge - 1];
			$this.curr_soal = [];
			$this.curr_soal.push(e[$this.curr_challenge - 1]['data'][$this.curr_sub_challenge - 1])
			console.log($this.curr_soal);
			$this.mission_total = e[$this.curr_challenge - 1]['data'].length;
		}

		$('.total_mission').html('/'+$this.mission_total);
		$('.title_challenge').html();
		console.log(curr_soal);
		$('.desc_challenge').html(curr_soal['label_2']);

		//function set reviewer
		// $this.setReviewer(curr_soal['reviewer']);

		$this.mulai_game();

	},'json');
};

ModulReview.prototype.mulai_game = function() {
	console.log('mulai_game');
	var $this = this;
	$this.isReview = false;
	$this.isComplete = false;

	// $this.sc_data = game.scorm_helper.getLastGame("challenge_"+$this.curr_challenge+"-"+$this.curr_sub_challenge+"-"+$this.category_game, $this.sc_data);
	// console.log($this.sc_data);
	// $this.sc_data = [];

	$this.setReviewerPeer(); //function set option for reviewer peer
	var number_mission = $this.curr_sub_challenge - (($this.curr_challenge - 1) * 5);
	$('.loader_image_index').show();
	$.post(game.base_url+game.get_challenge_review_file,{"cmid":game.module_id,"username":game.username},function(e){
		console.log(e);
		$('.loader_image_index').hide();
		if(e.length>0){
			$this.ldata2 = e;
			// $this.sc_data = e;
			$this.count_upload = 0;
			var find_activityid = ($this.max_file_upload + 1) * $this.curr_challenge 
			for (var i = 0; i < e.length; i++) {
				if($this.curr_review == ""){
					$this.curr_review = e[i]["review_by"];
				}
				// console.log(e[i]["challenge_id"]);
				// console.log($this.curr_sub_challenge);
				if(e[i]["grade"] != -1 && e[i]["challenge_id"] == $this.curr_challenge){
					if(e[i]["status"]=="accepted" && e[i]["review_by"] == "buddy"){
						$this.count_review_buddy++;
					}
					else if(e[i]["status"]=="accepted" && e[i]["review_by"]=="atasan"){
						$this.count_review_atasan++;
					}
					else if(e[i]["status"]=="accepted" && e[i]["review_by"]=="learner"){
						$this.count_review_atasan++;
					}
				}
				else{
					$this.isReview = true;
					// break;
				}

				// check activity id lower than max activityid

				if(parseInt(e[i]['activityid']) == find_activityid){
					$this.count_upload += 1;
				}

				// console.log(e[i]['challenge_id']+' - '+$this.curr_challenge);
				if(e[i]['challenge_id'] == $this.curr_challenge){
					var max = game.max_file_upload + 1;
					var min = 1;
					var activityid = e[i]["activityid"];
					if($this.curr_sub_challenge > 1){
						var deret_n = $.deretAritmatika(1, 4, $this.curr_sub_challenge); //function deret aritmatika kyubi.js
						min = deret_n;

						var deret_n2 = $.deretAritmatika(4, 4, $this.curr_sub_challenge); //function deret aritmatika kyubi.js
						max = deret_n2;
					}
					// console.log('min: '+min+' max: '+max+' activityid: '+activityid);
					if($this.newAttemp == false){
						if(activityid >= min && activityid <= max){
							$this.flagSubmit = 1;
							$this.arr_last_challenge.push(e[i]);

							//set flag isDeletedatNull
							if(e[i]['deleted_at']){
								$this.isDeletedatNull = 0;
							}
						}
					}else{
						var last_attemp = (e[i]['attemp'] == 0 ? 1 : e[i]['attemp']);
						if(activityid >= min && activityid <= max && last_attemp == $this.attemp){
							$this.flagSubmit = 1;
							$this.arr_last_challenge.push(e[i]);

							//set flag isDeletedatNull
							if(e[i]['deleted_at']){
								$this.isDeletedatNull = 0;
							}
						}
					}
				}

			}

			//set mission upload to number_mission
			$('.number_mission').html(number_mission);
			if($this.curr_challenge > 1){
				$('.number_mission').html($this.curr_sub_challenge - $this.count_sub_challenge_before);
			}

			if(($this.count_review_learner == e.length && $this.tipe_review=="learner") || $this.count_review_atasan == e.length){
				$this.isComplete = true;
			}
			else if($this.count_review_buddy == e.length){
				if($this.tipe_review == "buddy"){
					$this.isComplete = true;
				}
				else{
					$this.isReview = true;
				}
			}

			// console.log('$this.isReview: '+$this.isReview);
			$this.create_challange();
			// if($this.isReview){
			// 	// tampil page lagi di review
			// 	$this.create_page_review();
			// }
			// else if($this.isComplete){
			// 	// show popup complete
			// 	game.scorm_helper.setSingleData("score_scale",2);
			// 	game.scorm_helper.sendResult(game.max_score);
			// 	game.scorm_helper.setStatus("completed");
			// 	// $("#popupcomplete").modal("show");
			// 	$("#popupcomplete .close-popupcomplete").click(function(e){
			// 		$("#popupcomplete").modal("hide");
			// 	});
			// 	// console.log('test1');
			// 	$this.create_challange();
			// }
			// else{
			// 	$("#tutorial").modal("show");
			// 	$('#sliderTutorial').slick({
			//         dots: true,
			//         infinite: false,
			//         speed: 500
			//      });

			// 	$("#tutorial .start-game").click(function(e){
			// 		$("#tutorial").modal("hide");
			// 	});
			// 	// console.log('test2');
			// 	$this.create_challange();
			// }

			if($this.count_review_buddy == e.length || $this.count_review_learner == e.length || $this.count_review_atasan == e.length || $this.isComplete){
				$(".btn-ans").hide();
			}
		}else{
			// $("#tutorial").modal("show");
			// $('#sliderTutorial').slick({
		 //        dots: true,
		 //        infinite: false,
		 //        speed: 500
		 //     });

			$("#tutorial .start-game").click(function(e){
				$("#tutorial").modal("hide");
			});

			//set number mission
			$('.number_mission').html(number_mission);
			// console.log('test3');
			$this.create_challange();
		}
	},'json')
	.fail(function(e2) {
		$(".loader_image_index").hide();
		console.log(e2);
		game.popupText(game.error_request_global, action = 1);
		$("#popupalert2 .closealert").click(function(e){
            $("#popupalert2").modal("hide");

            $('.loader_image_index').show();
        });
	});
};

/*Function set reviewer*/
	ModulReview.prototype.setReviewer = function(arr_reviewer) {
		var arr_reviewer = arr_reviewer;
		if(arr_reviewer != undefined){
			if(arr_reviewer.length > 0){
				var arr = [];
				for (var i = 0; i < arr_reviewer.length; i++) {
					arr.push(arr_reviewer[i]);
				}
				
				$(".reviewer").empty();

				$(".reviewer").select2({
					data: arr,
					multiple: false,
					width: '100%',
					escapeMarkup: function(markup) {
						return markup;
					}
				});
			}
		}
	}
/*End function set reviewer*/

ModulReview.prototype.create_challange = function() {
	console.log('create_challange');
	// console.log(modulReview);
	// console.log(game);
	// console.log(setupSlider);
	// remove_item(1);
	// ModulReview.remove_item(1);
	var $this = this;
	$this.count = 0;
	var img_ext   = ['jpg','gif','png','jpeg'];
	var video_ext   = ['3gp','mp4','flv','mkv','avi','wmv','mov','mpeg'];

	$('.btn-confirm').click(function(e){
		$('.popupdialogbox .submit-ans').removeClass('clicked');
		$('.popupdialogbox .modal-content-2.tutorial').show();
		$('.popupdialogbox').modal('show');
		$('.select2').hide();
	});

	$('.pilihan_reviewer').click(function(e){
		var id = $(this).attr('id');
		id = id[1];

		if(id == 1){
			$('.popupdialogbox .modal-content-2').hide();
			$('.popupdialogbox .modal-content-2 .tutorial').show();
			// $('.popupdialogbox').modal('show');
		}else{
			$('.popupdialogbox .modal-content-2').hide();
			$('.popupdialogbox .modal-content-2 .peer_detail').show();
		}
	});

	$(".submit-ans").click(function(e){
		$('.select2').show();
		// $(this).off();
		if(!$(this).hasClass('clicked')){
			$(this).addClass('clicked');
			$('.popupdialogbox').modal('hide');
			$('.popupdialogbox .modal-content-2').hide();
			var flag = 0; //flag valid 
			game.audio.audioButton.play();
			// $(".img_result img").each(function(e){
			// 	console.log($(this).attr("src"));
			// 	if($(this).attr("src")=="(unknown)" || $(this).attr("src")=="image/none.png"){
			// 		flag = 1;
			// 	}
			// });

			// console.log($(".img_result"));
			if($(".list-group .img_result").length > 0){
				$(".list-group .img_result").each(function(e){
					console.log($(this));
					var newFileName = $(this).find('.file_name').text();
					console.log(newFileName);
					var ext = $.getExtensionFile(newFileName); //call function getExtensionFile in kyubi.js
					console.log(ext);
					
					if($.inArray(ext,img_ext) > -1){//file extension image
						// console.log($(this).find('img').attr("src"));
						var src = $(this).find('img').attr("src");
						if(src=="(unknown)" || src=="image/none.png"){
							flag = 1;
						}
					}else{ //file extension not image, get src from html img
						var src = $(this).find('img').attr("src");
						if(src=="(unknown)" || src=="image/none.png"){
							flag = 1;
						}
					}
				});
			}else{
				flag = 1;
			}

			$("textarea").each(function(e){
				// console.log($(this).val());
				if($(this).val() == "" || $(this).val() == null){
					flag = 1;
				}
			});

			var reviewer = $('.reviewer').val();
			if(reviewer == 2){
				var reviewer_id = $('.user').val();
				if(reviewer_id == undefined){
					flag = 1;
				}
			}

			// console.log(flag);

			//flag tidak valid
			if(flag == 1){
				// console.log("popup Not Complete");
				$this.popupNotComplete('Mohon Isi Semua <i>Activity</i>.');
			}
			else{
				var data_submit = $this.getDataForSubmit();
				// console.log(data_submit);
				if(data_submit.length>1){
					// $(this).off();
					try{
						$('.loader_image_index').show();
						console.log({username:game.username,cmid:game.module_id,data:data_submit});
						$.post(game.base_url+game.submit_review_file,{username:game.username,cmid:game.module_id,data:data_submit},function(e){
							// alert(JSON.stringify(e));
							$('.loader_image_index').hide();
							$('.submit-ans').removeClass('clicked');
							if(e.status == 'success'){
								var user_id = e.userid;
								// var user_id = '28535';
								var url = game.base_url+game.user_controller_file+"?request=insert_user_module_data";
						        var async = false;
						        var arr_temp = {};
						        arr_temp['game_data'] = game.game_data;
							        
						        /*Set amount_choose_reviewer_peer to scorm suspend data*/
									var reviewer = $('.reviewer').val();
									if(reviewer == 2){
										game.game_data['amount_choose_reviewer_peer'] = $this.amount_choose_reviewer_peer + 1;
									}
									console.log($this.curr_challenge);
									console.log(game.total_soal);
									if($this.curr_challenge == game.total_soal){
										game.game_data['flag_submit_last_challange'] = 1;
									}

									if(game.modeInterval == 2){
										if(game.game_data['date_last_submit'] == undefined){
											var date_server = game.getDate2(); //get date from server
											// alert(date_server);
											game.game_data['date_last_submit'] = date_server;
										}
									}

									game.scorm_helper.setSingleData('game_data', game.game_data);
									console.log(game.game_data);
								/*End set limit_choose_reviewer_peer to scorm suspend data*/
								game.setSlide(4);

						        var mode = 3;
						        if(mode == 1){
						       		var formData = new FormData();
							        formData.append('user_id', user_id);
							        formData.append('module_id', game.module_id);
							        formData.append('attempt', game.scorm_attempt);
							        formData.append('value', JSON.stringify(arr_temp));
							        // var formData = {"user_id":user_id,"module_id":game.module_id,"attempt":$this.scorm_attempt};
							        // alert(url);
							        // alert(async);
							        var object = {};
									formData.forEach(function(value, key){
									    object[key] = value;
									});
									var json_test = JSON.stringify(object);
							        alert(json_test);
							        var res = game.requestPost(url, async, formData);
							        console.log(res);
							        alert(JSON.stringify(res));

							  //       if(res['status'] == 200){
								 //        /*Set amount_choose_reviewer_peer to scorm suspend data*/
									// 		var reviewer = $('.reviewer').val();
									// 		if(reviewer == 2){
									// 			game.game_data['amount_choose_reviewer_peer'] = $this.amount_choose_reviewer_peer + 1;
									// 			game.scorm_helper.setSingleData('game_data', game.game_data);
									// 			console.log(game.game_data);
									// 		}
									// 	/*End set limit_choose_reviewer_peer to scorm suspend data*/
									// 	game.setSlide(4);
									// }else{
									// 	$('.loader_image_index').hide();
									// 	$this.popupNotComplete('Error insert user data module!');
									// }
								}else if(mode == 2){
									$('.loader_image_index').show();
									alert(user_id);
									alert(game.module_id);
									alert(game.scorm_attempt);
									alert(JSON.stringify(arr_temp));
							        $.post(url,{user_id:user_id,module_id:game.module_id,attempt:game.scorm_attempt,value:JSON.stringify(arr_temp)},function(res){
								        $('.loader_image_index').hide();
								        alert(JSON.stringify(res));
								        if(res['status'] == 200){
									        /*Set amount_choose_reviewer_peer to scorm suspend data*/
												var reviewer = $('.reviewer').val();
												if(reviewer == 2){
													game.game_data['amount_choose_reviewer_peer'] = $this.amount_choose_reviewer_peer + 1;
													game.scorm_helper.setSingleData('game_data', game.game_data);
													console.log(game.game_data);
												}
											/*End set limit_choose_reviewer_peer to scorm suspend data*/
											game.setSlide(4);
										}else{
											$this.popupNotComplete('Error insert user data module!');
										}
									},'json')
									.fail(function(e) {
										$('.loader_image_index').hide();
										// console.log(e);
				    					// alert("Error Submit !");
				    					$this.popupNotComplete('Error insert user data module !');
				    					// $('.loader_image_index').hide();
				    					// $('.submit-ans').removeClass('clicked');
				  					});
				  				}
							}
							else{
								// popup gagal submit
								$("#popupalert").modal("show");
								$("#popupalert .closealert").click(function(e){
									$("#popupalert").modal("hide");
								});
								// console.log("gagal submit");
							}
						},'json')
						.fail(function(e) {
							// console.log(e);
	    					// alert("Error Submit !");
	    					$this.popupNotComplete('Error Submit !');
	    					$('.loader_image_index').hide();
	    					$('.submit-ans').removeClass('clicked');
	  					});
					}catch(e){
						// console.log(e);
						// alert(e);
						$this.popupNotComplete(e);
					}
				}else{
					$this.popupNotComplete('Mohon Isi Semua <i>Activity</i>.');
				}
			}
		}

	});
	
	var clone_item = $('.list-group').clone();
	var clone_item_2 = $('.list-group .list-group-item').first().clone();
	// console.log(clone_item_2);
	$('.list-group').html('');
	// console.log('test');
	var flagEventDelete = 0;
	var splice;
	var activityid_before = 0;

	$(".fileToUpload").change(function(e){
		// console.log('fileToUpload');
		// $('.loader_image_index').show();
		// console.log(this);
		// console.log(curr_upload_id);
		var files       = this.files;
		var numItems = $('.list-group .list-group-item').length;
		var curr_upload_id = parseInt($('.curr_upload_id').val());
		// console.log(files);
		// console.log('curr_upload_id: '+curr_upload_id);
		// console.log('numItems: '+numItems);
		//max_file_upload from game.js
		// $('.loader_image_quiz_review').show();
		if(files.length <= $this.max_file_upload && numItems <= 2){
			for (var i = 0; i < files.length; i++) {
				var clone_item_3 = $(clone_item_2).clone();
				// console.log(i);
				
				// console.log(Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_'));
				
				// files[i]['name']   = Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_');
				// files[i].name   = 'asd123.jpg';
				// console.log(files[i].name);
				var fileName         = files[i].name;
				var ext 	        = $.getExtensionFile(fileName); //call function getExtensionFile from kyubi.js
				// console.log(ext);
				var size        = files[i].size;
				// if(size > 4000000){
				// 	alert('File size is too large, maximum 4MB');
				// 	return;
				// }
				// var size        = files[i].size;
				// console.log(size);
				// console.log(files[i]);
				// console.log($.inArray(ext,img_ext));
				
	            var activity_title = 'Mission-'+$this.curr_challenge+'-'+($this.curr_sub_challenge - $this.count_sub_challenge_before);
	            var activity_type; //activity_type: 5, itu file
	            var activity_question = $('.desc_challenge').text();
	            var activity_response;
	            var flagImage = 0;
	            const file = files[i];
	            
				// console.log(ext);
				if($.inArray(ext,img_ext) > -1){
					// activity_type = 1; //activity type image
					flagImage = 1;
					// console.log('test');
					$('.loader_image_index').show();
					$.imageCompressor(files[i], function(res){
						$('.loader_image_index').hide();
						// console.log(res);

						//upload image to server
						//deret aritmatika
						var currSubChallenge = $this.curr_sub_challenge;
						var activityid = numItems + 1;
						if($this.curr_sub_challenge > 1){
							if(numItems == 0){
								activityid = $.deretAritmatika(1, 4, currSubChallenge); //function kyubi.js
								activityid_before = activityid;
							}else{
								activityid = activityid_before + numItems; //function kyubi.js
							}
						}
						// console.log('activityid_2: '+activityid);
						var form = clone_item_3;
						// console.log('uploadFile');
						$('.loader_image_index').show();
						var newFileName = Math.random().toString(36).replace('0.', '')+'_'; //random name
						newFileName += $.generateStandardFileName(fileName); //call function generateStandardFileName in kyubi.js

						// alert('test');
						game.uploadFile(activityid, res, newFileName, true, function(data){	
							console.log(data);
							// console.log(form);
							// console.log(form.find(".img_dynamic"));
							if(data["status"] == "success"){
				                var grade_by_id = null;
				                var reviewer = $(clone_item_3).find('.reviewer').val();
				                var reviewtype = 1;
				                // console.log('reviewer: '+reviewer);
				                // if(reviewer == 2){ //if reviewer peer
				                // 	var reviewer_id = $(clone_item_3).find('.user').val();
				                // 	grade_by_id = reviewer_id;
				                // 	reviewtype = 3;
				                // }
				                // console.log('grade_by_id: '+grade_by_id);
				                 // if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
				                 //     grade_by_id = null;
				                 // }
				                 // else{
				                 //     grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
				                 // }
				                 // console.log('flagImage: '+flagImage);
				                // if(flagImage == 1){
			                 		var arr_img = [];
									arr_img.push(res);
									activity_type = 1; //activity type image
									$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
									$(clone_item_3).find('.img_dynamic').attr('id','img_dynamic-'+curr_upload_id);
									$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
									// $(clone_item_3).find('.fa-times').attr('onclick','modulReview.remove_item('+curr_upload_id+')');
									$(clone_item_3).find('.txt_dynamic .file_name').html(file.name);
									// $('#img_dynamic-'+id).attr('src',game.base_url+data2["message"]+"?lastmod="+new Date());
									// console.log(i);
									// console.log(arr_img);
									// console.log(id);

									//preview image
									// $.base64image(arr_img).done(function(res2){
									// 	// console.log(res2);
									// 	// console.log(clone_item_3);
									// 	console.log('id: '+id);
									// 	// $(clone_item_3).find('.img_dynamic').attr('src',res2);
									// });

									// curr_upload_id += 1;
									// console.log('curr_upload_id: '+curr_upload_id);
									// $('.curr_upload_id').val(numItems);
									// $('.list-group').append(clone_item_3);

				                	$(form).find(".img_dynamic").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
				                 	activity_response = game.base_url+data["message"];
				     //            }else{
				     //             	activity_type = 5; //activity type file
									// $(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
									// $(clone_item_3).find('.img_dynamic').hide();
									// $(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
									// // $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
									// console.log(file);
									// $(clone_item_3).find('.txt_dynamic .file_name').html(file.name);
									// var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+file.name+"?123";
									// $(clone_item_3).find(".img_dynamic").attr("src",img_src);

				     //             	activity_response = '<a href="'+game.base_url+data["message"]+'">Klik Here</a>';
				     //            }

				                curr_upload_id += 1;
								// console.log('curr_upload_id: '+curr_upload_id);
								$('.curr_upload_id').val(curr_upload_id);
								$('.list-group').append(clone_item_3);


				                $('.icon_remove').click(function(e){
				                	$('.list-group').html('');
				                	$this.sc_data = [];

				                	// console.log($this.sc_data);
				                });

				                var res = {
				                     activityid: activityid,
				                     activity_title: activity_title,
				                     activity_type: activity_type, //activity_type: 5, itu file
				                     activity_question: activity_question,
				                     activity_response: activity_response,
				                     grade:-1,
				                     pass_grade:100,
				                     grade_type:0,
				                     grade_by_id:grade_by_id,
				                     reviewtype: reviewtype, //1: supervisor, 2: buddy, 3: peer
				                     challenge_id: $this.curr_challenge,
				                     sub_challenge_id: $this.curr_sub_challenge,
				                     category_game: $this.category_game,
				                     attemp: $this.attemp
				                 };
				                 // console.log(res);
				                 // console.log($this.sc_data);
				                 // console.log(sc_data);
				                 $this.sc_data[numItems] = res;
				                 // sc_data[numItems] = res;
				                 // console.log($this.sc_data);
				                 // console.log(sc_data);

				                game.scorm_helper.setAnsData("challenge_"+$this.curr_challenge+"-"+$this.curr_sub_challenge+"-"+$this.category_game, $this.sc_data);
				            	$('.loader_image_index').hide();
				            }else{
				            	$('.loader_image_index').hide();
				            }
						});

					});
				}else{
					// activity_type = 5; //activity type file
					// $(clone_item_3).attr('id', 'list-group-item_'+numItems);
					// $(clone_item_3).find('.img_dynamic').hide();
					// $(clone_item_3).find('.fa-times').attr('id','fa-times_'+numItems);
					// $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
					// $(clone_item_3).find('.txt_dynamic .file_name').html(files[i].name);
					// var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+files[i].name+"?123";
					// $(clone_item_3).find(".img_dynamic").attr("src",img_src);

					// $('.list-group').append(clone_item_3);

					var currSubChallenge = $this.curr_sub_challenge;
					var activityid = numItems + 1;
					if($this.curr_sub_challenge > 1){
						if(numItems == 0){
							activityid = $.deretAritmatika(1, 4, currSubChallenge); //function kyubi.js
							activityid_before = activityid;
						}else{
							activityid = activityid_before + numItems; //function kyubi.js
						}
					}
					// console.log('activityid_2: '+activityid);
					var form = clone_item_3;
					// console.log('uploadFile');
					$('.loader_image_index').show();
					var newFileName = Math.random().toString(36).replace('0.', '')+'_';
					newFileName += $.generateStandardFileName(files[i].name);
					// alert('test');
					game.uploadFile(activityid, files[i], newFileName, true, function(data){	
						// console.log(data);
						// console.log(form);
						// console.log(form.find(".img_dynamic"));
						if(data["status"] == "success"){
			                var grade_by_id = null;
			                var reviewer = $(clone_item_3).find('.reviewer').val();
			                var reviewtype = 1;

			                //function get reviewer
			            	if(game.mode_reviewer != undefined){
			            		if(game.mode_reviewer == 1){
					                // if(reviewer == 2){ //if reviewer peer
					                // 	var reviewer_id = $(clone_item_3).find('.reviewer_id').val(); 
					                // 	grade_by_id = reviewer_id;
					                // 	reviewtype = 3;
					                // }
					            }
					        }
			                // console.log('flagImage: '+flagImage);
			               	activity_type = 6; //activity type file
			                if($.inArray(ext,video_ext) > -1){
			                	activity_type = 5; //activity type video
			                }
							$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
							$(clone_item_3).find('.img_dynamic').hide();
							$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
							// $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
							// console.log(file);
							$(clone_item_3).find('.txt_dynamic .file_name').html(file.name);
							var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+file.name+"?lastmod="+new Date();
							// $(clone_item_3).find(".img_dynamic").attr("src",img_src);

							activity_response = '<a href="'+game.base_url+data["message"]+'">Klik Here</a>';
							if(game.activity_response_url != undefined ){
								if(game.activity_response_url == true){
									activity_response = game.base_url+data["message"];
								}
		                 	}

			                curr_upload_id += 1;
							// console.log('curr_upload_id: '+curr_upload_id);
							$('.curr_upload_id').val(curr_upload_id);
							$('.list-group').append(clone_item_3);


			                $('.icon_remove').click(function(e){
			                	$('.list-group').html('');
			                	$this.sc_data = [];

			                	// console.log($this.sc_data);
			                });

			                var res = {
			                     activityid: activityid,
			                     activity_title: activity_title,
			                     activity_type: activity_type, //activity_type: 5, itu file
			                     activity_question: activity_question,
			                     activity_response: activity_response,
			                     grade:-1,
			                     pass_grade:100,
			                     grade_type:0,
			                     grade_by_id:grade_by_id,
			                     reviewtype:reviewtype, //2 buddy, 1 supervisor
			                     challenge_id: $this.curr_challenge,
			                     sub_challenge_id: $this.curr_sub_challenge,
			                     category_game: $this.category_game,
			                     attemp: $this.attemp
			                 };
			                 // console.log(res);
			                 // console.log($this.sc_data);
			                 // console.log(sc_data);
			                 $this.sc_data[numItems] = res;
			                 sc_data[numItems] = res;
			                 // console.log($this.sc_data);
			                 // console.log(sc_data);

			                game.scorm_helper.setAnsData("challenge_"+$this.curr_challenge+"-"+$this.curr_sub_challenge+"-"+$this.category_game, $this.sc_data);
			            	$('.loader_image_index').hide();
			            }else{
			            	$('.loader_image_index').hide();
			            }
					});
				}


				/*//upload image to server
				//deret aritmatika
				var currSubChallenge = $this.curr_sub_challenge;
				var activityid = numItems + 1;
				if($this.curr_sub_challenge > 1){
					if(numItems == 0){
						activityid = $.deretAritmatika(1, 4, currSubChallenge); //function kyubi.js
						activityid_before = activityid;
					}else{
						activityid = activityid_before + numItems; //function kyubi.js
					}
				}
				console.log('activityid_2: '+activityid);
				var form = clone_item_3;
				console.log('uploadFile');
				$('.loader_image_index').show();
				var newFileName = Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_');
				// alert('test');
				game.uploadFile(activityid, files[i], newFileName, true, function(data){	
					console.log(data);
					console.log(form);
					console.log(form.find(".img_dynamic"));
					if(data["status"] == "success"){
		                var grade_by_id = null;
		                 // if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
		                 //     grade_by_id = null;
		                 // }
		                 // else{
		                 //     grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
		                 // }
		                 console.log('flagImage: '+flagImage);
		                if(flagImage == 1){
	                 		var arr_img = [];
							arr_img.push(res);
							activity_type = 1; //activity type image
							$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
							$(clone_item_3).find('.img_dynamic').attr('id','img_dynamic-'+curr_upload_id);
							$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
							// $(clone_item_3).find('.fa-times').attr('onclick','modulReview.remove_item('+curr_upload_id+')');
							$(clone_item_3).find('.txt_dynamic .file_name').html(file.name);
							// $('#img_dynamic-'+id).attr('src',game.base_url+data2["message"]+"?lastmod="+new Date());
							// console.log(i);
							// console.log(arr_img);
							// console.log(id);

							//preview image
							// $.base64image(arr_img).done(function(res2){
							// 	// console.log(res2);
							// 	// console.log(clone_item_3);
							// 	console.log('id: '+id);
							// 	// $(clone_item_3).find('.img_dynamic').attr('src',res2);
							// });

							// curr_upload_id += 1;
							// console.log('curr_upload_id: '+curr_upload_id);
							// $('.curr_upload_id').val(numItems);
							// $('.list-group').append(clone_item_3);

		                	$(form).find(".img_dynamic").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
		                 	activity_response = game.base_url+data["message"];
		                }else{
		                 	activity_type = 5; //activity type file
							$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
							$(clone_item_3).find('.img_dynamic').hide();
							$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
							// $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
							console.log(file);
							$(clone_item_3).find('.txt_dynamic .file_name').html(file.name);
							var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+file.name+"?123";
							$(clone_item_3).find(".img_dynamic").attr("src",img_src);

		                 	activity_response = '<a href="'+game.base_url+data["message"]+'">Klik Here</a>';
		                }

		                curr_upload_id += 1;
						console.log('curr_upload_id: '+curr_upload_id);
						$('.curr_upload_id').val(curr_upload_id);
						$('.list-group').append(clone_item_3);


		                $('.icon_remove').click(function(e){
		                	$('.list-group').html('');
		                	$this.sc_data = [];

		                	console.log($this.sc_data);
		                });

		                var res = {
		                     activityid: activityid,
		                     activity_title: activity_title,
		                     activity_type: activity_type, //activity_type: 5, itu file
		                     activity_question: activity_question,
		                     activity_response: activity_response,
		                     grade:-1,
		                     pass_grade:100,
		                     grade_type:0,
		                     grade_by_id:grade_by_id,
		                     reviewtype:1, //2 buddy, 1 supervisor
		                     challenge_id: $this.curr_challenge,
		                     sub_challenge_id: $this.curr_sub_challenge,
		                     category_game: $this.category_game,
		                     attemp: $this.attemp
		                 };
		                 console.log(res);
		                 console.log($this.sc_data);
		                 console.log(sc_data);
		                 $this.sc_data[numItems] = res;
		                 sc_data[numItems] = res;
		                 console.log($this.sc_data);
		                 console.log(sc_data);

		                game.scorm_helper.setAnsData("challenge_"+$this.curr_challenge+"-"+$this.curr_sub_challenge+"-"+$this.category_game, $this.sc_data);
		            	$('.loader_image_index').hide();
		            }else{
		            	$('.loader_image_index').hide();
		            }
				});*/
			} //end looping
			
			// if(flagEventDelete == 0){
				// flagEventDelete = 1;
				//event click .fa-times
				
			// }
			// $('list-group').append(clone_item_2);
			// $('.loader_image_quiz_review').hide();
			// $('.loader_image_index').show();
		}else{
			// $('.loader_image_quiz_review').hide();
			alert('Maximum upload is 3 files !');
		}
	});
	
	console.log($this.arr_last_challenge);
	// console.log('isDeletedatNull: '+$this.isDeletedatNull);
	//if data field delete_at belum ada isi didatabse
	if($this.isDeletedatNull == 1){
		//cek $this.arr_last_challenge, yang isinya array pada sub challenge yang dipilih
		if($this.arr_last_challenge.length > 0){
			$this.disabledAllEvent();
			// $('.icon_remove').css('display', 'none');

			//looping data challenge answer from database
			// console.log($this.arr_last_challenge);
			for (var i = 0; i < $this.arr_last_challenge.length; i++) {
				var clone_item_3 = $(clone_item_2).clone();
				var curr_upload_id = parseInt($('.curr_upload_id').val());
				var response = $this.arr_last_challenge[i]['activity_response'];
				var review_type = $this.arr_last_challenge[i]['reviewtype'];
				if(i < $this.arr_last_challenge.length - 1){
					// console.log($this.arr_last_challenge[i]);
					if($this.arr_last_challenge[i]['activity_type'] == 1){
						var img_src = response;
		   				var arr_response = response.split('/');
		   				var file_name = arr_response[7];
						activity_type = 1; //activity type image
						$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
						$(clone_item_3).find('.img_dynamic').attr('id','img_dynamic-'+curr_upload_id);
						$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
						// $(clone_item_3).find('.fa-times').attr('onclick','modulReview.remove_item('+curr_upload_id+')');
						$(clone_item_3).find('.txt_dynamic .file_name').html(file_name);

		            	$(clone_item_3).find(".img_dynamic").attr("src",img_src);

		            	//function get reviewer
		            	console.log(game.mode_reviewer);
		            	if(game.mode_reviewer != undefined){
		            		if(game.mode_reviewer == 1){
								// console.log('review_type: '+review_type);
								if(review_type == 3){
									$(".reviewer").val(2).trigger('change');
									$('.reviewer').attr("disabled", true);

									//set peer
									$('.div_user').show();
									console.log($this.arr_last_challenge[i]['reviewer']);
									if($this.arr_last_challenge[i]['reviewer'] != undefined){
										var fullname = $this.arr_last_challenge[i]['reviewer']['firstname']+' '+$this.arr_last_challenge[i]['reviewer']['lastname'];
										var username = $this.arr_last_challenge[i]['reviewer']['username'];
										// $('.user').attr("placeholder", fullname+' - '+username);
										$(".user").select2({
											data: [],
											multiple: false,
											width: '100%',
											placeholder: fullname+' - '+username,
											escapeMarkup: function(markup) {
												return markup;
											}
										});
									}

									$('.user').attr("disabled", true);

								}else if(review_type == 1){
									$('.reviewer').attr("disabled", true);
								}
							}
						}
					}else{
						// console.log(response);
						var arr_response = response.split('/');
						// console.log(arr_response);
		   				var file_name = arr_response[7];
		   				// console.log(file_name);
		   				// file_name = file_name.split('>');
						activity_type = 5; //activity type file
						$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
						$(clone_item_3).find('.img_dynamic').hide();
						$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
						// $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
						$(clone_item_3).find('.txt_dynamic .file_name').html(file_name);
						// $(clone_item_3).find(".img_dynamic").attr("src",img_src);

						//function get reviewer
						if(game.mode_reviewer != undefined){
		            		if(game.mode_reviewer == 1){
								// console.log('review_type: '+review_type);
								if(review_type == 3){
									$(".reviewer").val(2).trigger('change');
									$('.reviewer').attr("disabled", true);

									//set peer
									$('.div_user').show();
									if($this.arr_last_challenge[i]['reviewer'] != undefined){
										var fullname = $this.arr_last_challenge[i]['reviewer']['firstname']+' '+$this.arr_last_challenge[i]['reviewer']['lastname'];
										var username = $this.arr_last_challenge[i]['reviewer']['username'];
										// $('.user').attr("placeholder", fullname+' - '+username);
										$(".user").select2({
											data: [],
											multiple: false,
											width: '100%',
											placeholder: fullname+' - '+username,
											escapeMarkup: function(markup) {
												return markup;
											}
										});
									}

									$('.user').attr("disabled", true);

								}else if(review_type == 1){
									$('.reviewer').attr("disabled", true);
								}
							}
						}
					}

					curr_upload_id += 1;
					// console.log('curr_upload_id: '+curr_upload_id);
					$('.curr_upload_id').val(curr_upload_id);
					$('.list-group').append(clone_item_3);
				}
				else{
					$('.textarea_1').text(response);
				}
			}

			$('.btn-back').click(function(){
				$(this).off();
				game.setSlide(4);
			});

			// $('.btn-back-2').click(function(){
			// 	$(this).off();
			// 	game.setSlide(4);
			// });
		}else{
			//if curr challenge didn't submited, even though position in next step
			($this.game_data["curr_challenge"] == undefined ? $this.game_data["curr_challenge"] = 1 : '');
			/*if game_data curr_challenge sama dengan current challenge
				and interval day start_data <= total soal game
			*/
			// console.log($this.game_data['interval_days']+' - '+game.total_soal);
			if($this.game_data["curr_challenge"] == $this.curr_challenge && $this.game_data['interval_days'] <= game.total_soal){
				$('.btn-back-2').css('display','unset');
			}else{
				$this.disabledAllEvent();

				// console.log('game.mode_reviewer: '+game.mode_reviewer);
				//function get reviewer
		        if(game.mode_reviewer != undefined){
		        	$('.reviewer').attr("disabled", true);
		        }

				$('.btn-back').click(function(){
					$(this).off();
					game.setSlide(4);
				});

				// $('.btn-back-2').click(function(){
				// 	$(this).off();
				// 	game.setSlide(4);
				// });
			}
		}
	}else{
		//if curr challenge didn't submited, even though position in next step
		($this.game_data["curr_challenge"] == undefined ? $this.game_data["curr_challenge"] = 1 : '');
		/*if game_data curr_challenge sama dengan current challenge
			and interval day start_data <= total soal game
		*/
		// console.log($this.game_data['interval_days']+' - '+game.total_soal);
		if($this.game_data["curr_challenge"] == $this.curr_challenge && $this.game_data['interval_days'] <= game.total_soal){
			$('.btn-back-2').css('display','unset');
		}else{
			$this.disabledAllEvent();

			//function get reviewer
	        if(game.mode_reviewer != undefined){
	        	$('.reviewer').attr("disabled", true);
	        }

			$('.btn-back').click(function(){
				$(this).off();
				game.setSlide(4);
			});
		}
	}

	
	$('.btn-back-2').click(function(){
		$(this).off();
		game.setSlide(4);
	});
	// $this.loadContent();

	//event click .fa-times
	// $('.fa-times').click(function(e){
	// 	var id = $(this).attr('id');
	// 	id = id.split('_');	
	// 	console.log(id);
	// 	$('#list-group-item_'+id[1]).remove();
	// 	$this.sc_data.splice(id[1], 1);
	// 	console.log($this.sc_data);
	// });

	//event select reviewer
	$('.reviewer').change(function(e){
	    var val = $(this).val();
	    console.log(val);
	    $(".user").empty();
	    $('.div_search_user').hide();
	    $('.div_user').hide();
	    if(val == 2){
	    	$('.div_search_user').show();

	    	$('.btn_search_user').click(function(){
	    		var search_user = $('.search_user').val();
	    		search_user = search_user.trim(); //remove space from string
	    		$this.user_data = [];
	    		$('.div_user').hide();

	    		if(search_user.length < 3){
	    			// alert('Minimal input karakter 3 !');
	    			game.popupText('Minimal input karakter 3 !');
	    		}else{
	    			/*request get*/
	    			$('.loader_image_index').show();
					var url = game.base_url+game.user_controller_file+"?request=get_all_user";
					var async = false;
					// var formData = new FormData();
					// formData.append("search",search_user);
					// var parameter = {"search":search_user};
					// var result = game.requestPost(url, async, formData);
					// console.log(result);

					$.post(url,{"search":search_user},function(result){
						console.log(result);
						$('.loader_image_index').hide();

						if(result['status'] == 200){
							if(result['data'].length > 0){
								$this.user_data = result['data'];
							}else{
								alert('Data peer tidak ditemukan !');
							}

							// if(result['divisi'].length > 0){
							// 	$this.divisi_data = result['divisi'];
							// }
						}else{
							alert('Data peer tidak ditemukan !');
						}
						/*End request get*/


		    	
				    	if($this.user_data.length > 0){
					    	var arr = [];
						   //  	var arr = [
						   //  		{
									// 	id: 0,
								 //        text: 'Pilih Sub-Directorat'
									// }
						   //  	];
					   		
					    	console.log($this.user_data.length);
					    	console.log($this.user_data);
							for (var i = 0; i < $this.user_data.length; i++) {
								var id = $this.user_data[i]['id'];
								var username = $this.user_data[i]['username'];
								var fullname = $this.user_data[i]['firstname']+' '+$this.user_data[i]['lastname']+' - '+$this.user_data[i]['username'];
								var temp = {
									id: id,
							        text: fullname
								};

								arr.push(temp);
							}

							console.log(arr);
							$(".user").empty();
							$(".user").select2({
								data: arr,
								multiple: false,
								width: '100%',
								placeholder: "Pilih Sub-Directorat",
								escapeMarkup: function(markup) {
									return markup;
								}
							});

							console.log('test');
					    	// $('.div_sub_directorat').show();
					    	// $('.div_divisi').show();
					    	$('.div_user').show();
					    }
					},'json')
					.fail(function(e2) {
						$(".loader_image_index").hide();
						console.log(e2);
						var text = 'Error request to server!';
						game.popupText(text);
					});
	    		}
	    	});
	    }else{
	        // $('.div_sub_directorat').hide();
	        // $('.div_divisi').hide();

	    }
	});

	$('.sub_directorat').change(function(e){
		var selected_sub_directorat = $(".sub_directorat option:selected").text();
	    console.log(selected_sub_directorat);

	    $(".divisi").empty();
	    //generate option divisi
	    if(selected_sub_directorat != ''){
	    	var arr = [];
	   //  	var arr = [
	   //  		{
				// 	id: 0,
			 //        text: 'Pilih Divisi'
				// }
	   //  	];

	    	console.log($this.divisi_data);
			for (var i = 0; i < $this.divisi_data.length; i++) {
				if(selected_sub_directorat == $this.divisi_data[i]['data']){
					var temp = {
						id: (i+1),
				        text: $this.divisi_data[i]['data']
					};

					arr.push(temp);
				}
			}

			// if(arr.length == 1){

			// }

			$(".divisi").select2({
				data: arr,
				multiple: false,
				width: '100%',
				placeholder: "Pilih Divisi",
				escapeMarkup: function(markup) {
					return markup;
				}
			});

	    }

	    // $('.div_sub_directorat').show();
	});
};

ModulReview.prototype.popupNotComplete = function(text) {
	// popup gagal karena masih ada data yang kosong
	$("#popupalert2 .tutorial .description .desc_text").html(text);
	$("#popupalert2 .tutorial").show();
	$("#popupalert2").modal("show");
	$("#popupalert2 .closealert").click(function(e){
		$("#popupalert2").modal("hide");
	});
	// console.log("masih ada data yang kosong");
};

ModulReview.prototype.getDataForSubmit = function() {
	var flag = 0;
	var arr_temp = [];
	var $this = this;

	var mode = 2;

	if(mode == 1){
		for (var i = 0; i < $this.sc_data.length; i++) {
			if($this.sc_data[i]["grade"] == -1 || $this.sc_data[i]["grade"] == 0){
				arr_temp.push($this.sc_data[i]);
			}
		}
	}else{
		var next_id = 0;
		console.log($this.sc_data);
		var activity_question = '';
		var grade_by_id = null;
		var reviewtype = 1;
		var reviewer = 1;
		//function get reviewer
    	if(game.mode_reviewer != undefined){
    		if(game.mode_reviewer == 1){
				reviewer = $('.reviewer').val();
				console.log('reviewer: '+reviewer);
		        if(reviewer == 2){ //if reviewer peer
		        	var reviewer_id = $('.user').val(); 
		        	grade_by_id = reviewer_id;
		        	reviewtype = 3;
		        }
		    }
		}

		for (var i = 0; i < $this.sc_data.length; i++) {
			if($this.sc_data[i]["grade"] == -1 || $this.sc_data[i]["grade"] == 0){

				if(game.mode_reviewer != undefined){
    				if(game.mode_reviewer == 1){
						//set key grade_by_id
						if(reviewer == 2){
							$this.sc_data[i]["grade_by_id"] = grade_by_id;
							$this.sc_data[i]["reviewtype"] = reviewtype;
						}
					}
				}
				arr_temp.push($this.sc_data[i]);
			}

			if(i == ($this.sc_data.length - 1)){
				activity_question = $this.sc_data[i]['activity_question'];
				next_id = $this.sc_data[i]['activityid'] + 1;
			}
		}

		var activity_title = 'Mission-'+$this.curr_challenge+'-'+($this.curr_sub_challenge - $this.count_sub_challenge_before);
		var activity_type = 2;
		var activity_response = $('.textarea').val();
		
		var res = {
			activityid: next_id,
			activity_title: activity_title,
			activity_type: activity_type, //activity_type: 5, itu file
			activity_question: activity_question,
			activity_response: activity_response,
			grade:-1,
			pass_grade:100,
			grade_type:0,
			grade_by_id:grade_by_id,
			reviewtype:reviewtype,
			challenge_id: $this.curr_challenge,
			sub_challenge_id: $this.curr_sub_challenge,
			category_game: $this.category_game,
			attemp: $this.attemp
		};

		arr_temp.push(res);
	}

	return arr_temp;
};

ModulReview.prototype.setTrigger = function() {
	var $this = this;
	$('.panel-heading').click(function(){
		console.log("tes");
		$('.panel-collapse.in').collapse('hide');
		
	    $(this).parents('form').find('.panel-collapse').collapse('toggle');
	    if($(this).find(".arrow.down").is(':visible')){
			$(".arrow.up").hide();
			$(".arrow.down").show();
			$(this).find(".arrow.up").show();
			$(this).find(".arrow.down").hide();
		}
		else{
			$(".arrow.up").hide();
			$(".arrow.down").show();
			$(this).find(".arrow.down").show();
			$(this).find(".arrow.up").hide();
		}
	});

	$("#content").on('click',".close",function(e){
		game.audio.audioButton.play();
		$(this).parents("form").find(".img_result img").attr("src","image/none.png");
		$(this).parents("form")[0].reset();
		$(this).parents("form").find(".fileToUpload").val("");
		$(this).parents("form").find("input[name='user_id']").val(game.username);
		$(this).parents("form").find("input[name='cmid']").val(game.module_id);
		$(this).parents("form").find("input[name='activityid']").val($this.ldata[$(this).parents("form").attr("index")]["activityid"]);

		$(this).parents(".panel-default").find(".upload_wrapper").css({"display":"block"});
		$(this).parents(".panel-default").find(".thumb_profile").css({"display":"none"});
		$(this).parents(".panel-default").find("#progress").css({"display":"none"});
	});
};

ModulReview.prototype.create_page_review = function() {
	var $url = "";
	var $this = this;
	if($this.count_review_buddy == $this.ldata.length || $this.curr_review == "atasan"){
		$url = "content/review_atasan.html";
	}
	else{
		$url = "content/review.html";
	}

	$("#content").load($url,function(e){

	});	
	
};

ModulReview.prototype.remove_item = function(e) {
	var $this = this;
	var id = e;
	console.log(id);
	console.log($this);
	$('#list-group-item_'+id).remove();
	console.log($this);
	console.log(sc_data);
	console.log($this.sc_data);
	console.log(this.sc_data);
	$this.sc_data.splice(id, 1);
	console.log($this.sc_data);
}

ModulReview.prototype.disabledAllEvent = function(){
	$('.fileToUpload').attr('disabled', 'true');
	$('.textarea_1').attr('disabled', 'true');
	$('.btn-confirm').attr('disabled', 'true');
	$('.btn-confirm').css('display', 'none');
	$('.btn-back').css('display', 'unset');
}

ModulReview.prototype.setReviewerPeer = function(){
	var $this = this;
	/*Check amount count reviewer*/
    if($this.limit_choose_reviewer_peer != undefined){
	    // $this.limit_choose_reviewer_peer = game.limit_choose_reviewer_peer;
	    // $this.amount_choose_reviewer_peer = $this.game_data['amount_choose_reviewer_peer'];
	    console.log($this.amount_choose_reviewer_peer);
	    console.log($this.limit_choose_reviewer_peer);
	    var amount_select_peer = $this.limit_choose_reviewer_peer - $this.amount_choose_reviewer_peer;
	    $('.amount_select_peer').html(amount_select_peer);
	    if($this.amount_choose_reviewer_peer >= $this.limit_choose_reviewer_peer){
	    	var arr = [
			    {
			        id: 1,
			        text: 'Atasan'
			    }
			];


			$(".reviewer").empty();

			$(".reviewer").select2({
				data: arr,
				multiple: false,
				width: '100%',
				escapeMarkup: function(markup) {
					return markup;
				}
			});
	    	// $('.reviewer option#2').hide();
	    }
	}
    /*End check amount count reviewer*/
}