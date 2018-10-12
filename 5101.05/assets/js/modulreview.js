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
	// $this.category_game = 'sales';

	// $this.curr_challenge = ($this.game_data["curr_challenge"] == undefined ? 1 : parseInt($this.game_data["curr_challenge"]));
	$this.curr_challenge = game.current_challenge;
	console.log('curr_challenge: '+$this.curr_challenge);
	// $this.curr_challenge = parseInt($this.game_data['curr_challenge']);
	// $this.curr_challenge = 1; //comment

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
	$this.isDeletedatNull = 1;
	$this.count_sub_challenge_before = 0;

	$this.attemp = game.attemp;
    $this.newAttemp = game.newAttemp;

	/*$("#tutorial").modal("show");
	$('#sliderTutorial').slick({
        dots: true,
        infinite: false,
        speed: 500
     });

	$("#tutorial .start-game").click(function(e){
		$("#tutorial").modal("hide");
	});*/

	// $.get("config/get_challange.json",function(e){
	// 	$this.ldata = e;
	// 	// $this.mulai_game();
	// },'json');
	
	$.get("config/quiz_review_"+$this.category_game+".json",function(e){
		console.log(e);
		// $this.ldata = e;
		console.log($this.curr_sub_challenge);
		if($this.curr_challenge > 1){
			for (var i = 0; i < ($this.curr_challenge - 1); i++) {
				var count = e[i]['data'].length;
				$this.count_sub_challenge_before += count;
			}
			// console.log($this.count_sub_challenge_before);
			// console.log($this.curr_sub_challenge - 1 - $this.count_sub_challenge_before);
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
		$this.mulai_game();

		// $(".loader_image_index").show();
		// $.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e2){
		// 	$(".loader_image_index").hide();
		// 	console.log(e2);
		// 	$this.last_challange = e2;
		// 	$this.last_challange.sort(function(a, b) {
  //               return a.activityid - b.activityid;
  //           });
  //           console.log($this.last_challange);
		// 	$this.appendHtml($this.curr_soal);
		// },'json');
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
	$('.loader_image_index').show();
	$.post(game.base_url+"get_challenge_review.php",{"cmid":game.module_id,"username":game.username},function(e){
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

				console.log(e[i]['challenge_id']+' - '+$this.curr_challenge);
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
					console.log('min: '+min+' max: '+max+' activityid: '+activityid);
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
			$('.number_mission').html($this.curr_sub_challenge);
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
			$('.number_mission').html(0);
			// console.log('test3');
			$this.create_challange();
		}
	},'json');
};

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

	$('.btn-confirm').click(function(e){
		$('.popupdialogbox').modal('show');
	});

	$(".submit-ans").click(function(e){
		$('.popupdialogbox').modal('hide');
		var flag = 0; //flag valid 
		game.audio.audioButton.play();
		// $(".img_result img").each(function(e){
		// 	console.log($(this).attr("src"));
		// 	if($(this).attr("src")=="(unknown)" || $(this).attr("src")=="image/none.png"){
		// 		flag = 1;
		// 	}
		// });

		console.log($(".img_result"));
		if($(".img_result").length > 0){
			$(".img_result").each(function(e){
				var ext = $(this).find('file_name').text();
				ext = ext.split('.');
				ext = ext[1];
				if($.inArray(ext,img_ext) > -1){//file extension image
					console.log($(this).find('img').attr("src"));
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
			console.log($(this).val());
			if($(this).val() == "" || $(this).val() == null){
				flag = 1;
			}
		});

		console.log(flag);

		//flag tidak valid
		if(flag == 1){
			console.log("popup Not Complete");
			$this.popupNotComplete();
		}
		else{
			var data_submit = $this.getDataForSubmit();
			console.log(data_submit);
			if(data_submit.length>1){
				// $(this).off();
				try{
					$('.loader_image_index').show();
					console.log({username:game.username,cmid:game.module_id,data:data_submit});
					$.post(game.base_url+"submit_review.php",{username:game.username,cmid:game.module_id,data:data_submit},function(e){
						console.log(e);
						$('.loader_image_index').hide();
						if(e.status == "success"){
							// masuk ke page review
							// $this.create_page_review();
							game.setSlide(4);
						}
						else{
							// popup gagal submit
							$("#popupalert").modal("show");
							$("#popupalert .closealert").click(function(e){
								$("#popupalert").modal("hide");
							});
							console.log("gagal submit");
						}
					},'json')
					.fail(function(e) {
						console.log(e);
    					alert("Error Submit !");
    					$('.loader_image_index').hide();

  					});
				}catch(e){
					console.log(e);
					alert(e);
				}
			}
			else{
				$this.popupNotComplete();
			}
		}

	});
	
	var clone_item = $('.list-group').clone();
	var clone_item_2 = $('.list-group .list-group-item').first().clone();
	// console.log(clone_item_2);
	$('.list-group').html('');
	console.log('test');
	var flagEventDelete = 0;
	var splice;
	var activityid_before = 0;

	$(".fileToUpload").change(function(e){
		// $('.loader_image_index').show();
		// console.log(this);
		// console.log(curr_upload_id);
		var files       = this.files;
		var numItems = $('.list-group .list-group-item').length;
		var curr_upload_id = parseInt($('.curr_upload_id').val());
		// console.log(files);
		console.log('curr_upload_id: '+curr_upload_id);
		console.log('numItems: '+numItems);
		//max_file_upload from game.js
		// $('.loader_image_quiz_review').show();
		if(files.length <= $this.max_file_upload && numItems <= 2){
			for (var i = 0; i < files.length; i++) {
				var clone_item_3 = $(clone_item_2).clone();
				console.log(i);
				
				console.log(Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_'));
				
				// files[i]['name']   = Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_');
				// files[i].name   = 'asd123.jpg';
				console.log(files[i].name);
				var ext         = files[i].name.split('.')[1].toLowerCase();
				console.log(ext);
				var size        = files[i].size;
				if(size > 4000000){
					alert('File size is too large, maximum 4MB');
					return;
				}
				// var size        = files[i].size;
				// console.log(size);
				console.log(files[i]);
				console.log($.inArray(ext,img_ext));
				
	            var activity_title = 'Mission-'+$this.curr_challenge+'-'+($this.curr_sub_challenge - $this.count_sub_challenge_before);
	            var activity_type; //activity_type: 5, itu file
	            var activity_question = $('.desc_challenge').text();
	            var activity_response;
	            var flagImage = 0;
	            const file = files[i];
				if($.inArray(ext,img_ext) > -1){
					// activity_type = 1; //activity type image
					flagImage = 1;
					// console.log('test');
					$('.loader_image_index').show();
					$.imageCompressor(files[i], function(res){
						$('.loader_image_index').hide();
						console.log(res);

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
				}

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
				});
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
	console.log('isDeletedatNull: '+$this.isDeletedatNull);
	if($this.isDeletedatNull == 1){
		if($this.arr_last_challenge.length > 0){
			$this.disabledAllEvent();
			// $('.icon_remove').css('display', 'none');

			//looping data challenge answer from database
			for (var i = 0; i < $this.arr_last_challenge.length; i++) {
				var clone_item_3 = $(clone_item_2).clone();
				var curr_upload_id = parseInt($('.curr_upload_id').val());
				var response = $this.arr_last_challenge[i]['activity_response'];
				if(i < $this.arr_last_challenge.length - 1){
					if($this.arr_last_challenge[i]['activity_type'] == 1){
						var img_src = response;
		   				var arr_response = response.split('/');
		   				var file_name = arr_response[8];
						activity_type = 1; //activity type image
						$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
						$(clone_item_3).find('.img_dynamic').attr('id','img_dynamic-'+curr_upload_id);
						$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
						// $(clone_item_3).find('.fa-times').attr('onclick','modulReview.remove_item('+curr_upload_id+')');
						$(clone_item_3).find('.txt_dynamic .file_name').html(file_name);

		            	$(clone_item_3).find(".img_dynamic").attr("src",img_src);
					}else{
						var arr_response = response.split('/');
		   				var file_name = arr_response[8];
		   				file_name = file_name.split('>');
						activity_type = 5; //activity type file
						$(clone_item_3).attr('id', 'list-group-item_'+curr_upload_id);
						$(clone_item_3).find('.img_dynamic').hide();
						$(clone_item_3).find('.fa-times').attr('id','fa-times_'+curr_upload_id);
						// $(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
						$(clone_item_3).find('.txt_dynamic .file_name').html(file_name[0]);
						// $(clone_item_3).find(".img_dynamic").attr("src",img_src);
					}

					curr_upload_id += 1;
					console.log('curr_upload_id: '+curr_upload_id);
					$('.curr_upload_id').val(curr_upload_id);
					$('.list-group').append(clone_item_3);
				}
				else{
					$('.textarea_1').text(response);
				}
			}

			$('.btn-back').click(function(){
				game.setSlide(3);
			});
		}else{
			//if curr challenge didn't submited, even though position in next step
			($this.game_data["curr_challenge"] == undefined ? $this.game_data["curr_challenge"] = 1 : '');
			if($this.game_data["curr_challenge"] == $this.curr_challenge){
				
			}else{
				$this.disabledAllEvent();

				$('.btn-back').click(function(){
					game.setSlide(3);
				});
			}
		}
	}
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
};

ModulReview.prototype.popupNotComplete = function() {
	// popup gagal karena masih ada data yang kosong
	$("#popupalert2").modal("show");
	$("#popupalert2 .closealert").click(function(e){
		$("#popupalert2").modal("hide");
	});
	console.log("masih ada data yang kosong");
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

		for (var i = 0; i < $this.sc_data.length; i++) {
			if($this.sc_data[i]["grade"] == -1 || $this.sc_data[i]["grade"] == 0){
				arr_temp.push($this.sc_data[i]);
			}

			if(i == ($this.sc_data.length - 1)){
				activity_question = $this.sc_data[i]['activity_question'];
				next_id = $this.sc_data[i]['activityid'] + 1;
			}
		}

		var activity_title = 'Mission-'+$this.curr_challenge+'-'+($this.curr_sub_challenge - $this.count_sub_challenge_before);
		var activity_type = 2;
		var activity_response = $('.textarea ').val();
		var grade_by_id = null;
		
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
			reviewtype:1,
			challenge_id: $this.curr_challenge,
			sub_challenge_id: $this.curr_sub_challenge,
			category_game: $this.category_game,
			attemp: $this.attemp
		};

		arr_temp.push(res);
	}

	return arr_temp;
};

// ModulReview.prototype.loadContent = function() {
// 	var url2="";
// 	var $this = this;
// 	var data = $this.curr_soal;
// 	console.log(data);

//     // clone
//     var clone_item  = $(".list-group-item").first().clone();
//     // var clone_modal = $(".owl-carousel2 #item_modal_1").first().clone();
//     // console.log(clone_modal);
//     // var clone_btn = $(".dynamic_button a").first().clone();
//     // kosongkan
//     // $(".list-group-item").html("");
//     // $(clone_item).find(".dynamic_button").html("");
//     // set ava image
//     if(data[0]["image"]){
//         $(".ava img").attr("src","assets/images/"+data[0]["image"]);
//     }

//     console.log(data);
//     var arrChallenge = $this.arrChallenge;
//     console.log(arrChallenge);

//   	for (var i = 0; i < data.length; i++) {
//   		console.log(data[i]['label_2']);
//   		$('.desc_challenge').html(data[i]['label_2']);
//    //      var clone = $(clone_item).clone();
//    //      // var clone2 = $(clone_modal).clone();
      
//    //      var number = i+1;
//    //      var id_file = "files_"+number;  
//    //      // var start = $this.challenge * 2 - 1;
//    //      // var interval =(number * 2 - 2);
//    //      // var activityid = start + interval;
//    //      var activityid = data[i]["activityid"];


//    //      $(clone).find(".quiz-number").html("<strong>"+number+"</strong>");
//    //      $(clone).find(".quiz-dots").html("");
//    //      $(clone).find(".fileToUpload").addClass("fileToUpload_"+number);
//    //      $(clone).find(".fileToUpload").attr("id",id_file);
//    //      $(clone).find(".thumb_profile").attr("id", "thumb_profile-"+number);
//    //      $(clone).find(".thumb_profile .close").attr("id", "close-"+number);
//    //      $(clone).find(".textarea").addClass("textarea_"+number);
//    //      $(clone).find(".upload_wrapper").attr("id", "upload_wrapper-"+number);
//    //      $(clone).find(".input_wrapper").attr("id", "input_wrapper-"+number);
//    //      $(clone).find(".quiz-wrapper").attr("id", "quiz-wrapper-"+number);
//    //      $(clone).find(".img_result").attr("id", "img_result-"+number);
//    //      $(clone).find(".textstatus").attr("id", "textstatus-"+number);
//    //      $(clone).find(".activityid").attr("id", "activityid-"+activityid);

        
//    //      for (var j = 0; j < data.length; j++) {
//    //          if(j  < i){
//    //              $(clone).find(".quiz-dots").append("<span class='dots complete'>");
//    //          }else if(j  == i){
//    //              $(clone).find(".quiz-dots").append("<span class='dots active'>");
//    //          }else{
//    //              $(clone).find(".quiz-dots").append("<span class='dots'>");
//    //          }
//    //      }

//    //      if(arrChallenge.length > 0){
//    //          for(var k = 0; k < arrChallenge.length; k++){
//    //              console.log(arrChallenge[k]["activityid"]+" - "+activityid+" - "+arrChallenge[k]["grade"]);
//    //              if(arrChallenge[k]["activityid"] == activityid){
//    //                  var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+arrChallenge[k]["activityid"]+".jpg?123";
//    //                  // var img_src = arrChallenge[k]["activity_response"];
//    //                  var answer = arrChallenge[k]["activity_response"];
//    //                  console.log(img_src);
//    //                  console.log(answer);
//    //                  console.log("number: "+number);

//    //                  if(arrChallenge[k]["grade"] == 100){ //accept grade
//    //                      $(clone).find("#upload_wrapper-"+number).hide();
//    //                      $(clone).find("#thumb_profile-"+number).show();
//    //                      $(clone).find("#close-"+number).hide();
//    //                      $(clone).find(".textarea_"+number).attr("disabled", true);
//    //                      $(clone).find("#textstatus-"+number).text("accepted");

//    //                      if(typeof arrChallenge[k+1] != "undefined"){
//    //                          console.log(arrChallenge[k+1]);
//    //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
//    //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
//    //                          }
//    //                      }

//    //                      if(typeof arrChallenge[k] != "undefined"){
//    //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
//    //                      }
//    //                  }

//    //                  if(arrChallenge[k]["grade"] == 0){ //reject grade
//    //                      $(clone).find("#upload_wrapper-"+number).hide();
//    //                      $(clone).find("#thumb_profile-"+number).show();
//    //                      $(clone).find("#textstatus-"+number).text("rejected");
//    //                      $(clone).find("#close-"+number).hide();
//    //                      $(clone).find(".textarea_"+number).attr("disabled", true);

//    //                      if(typeof arrChallenge[k+1] != "undefined"){
//    //                          console.log(arrChallenge[k+1]);
//    //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
//    //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
//    //                          }
//    //                      }

//    //                      if(typeof arrChallenge[k] != "undefined"){
//    //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
//    //                      }
//    //                  }

//    //                  if(arrChallenge[k]["grade"] == -1){ //reject grade
//    //                      $(clone).find("#upload_wrapper-"+number).hide();
//    //                      console.log("#thumb_profile-"+number);
//    //                      $(clone).find("#thumb_profile-"+number).show();
//    //                      $(clone).find("#textstatus-"+number).text("review");
//    //                      $(clone).find("#close-"+number).hide();
//    //                      $(clone).find(".textarea_"+number).attr("disabled", true);

//    //                      console.log(arrChallenge[k+1]);
//    //                      if(typeof arrChallenge[k+1] != "undefined"){
//    //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
//    //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
//    //                          }
//    //                      }

//    //                      if(typeof arrChallenge[k] != "undefined"){
//    //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
//    //                      }
//    //                  }
//    //              }
//    //          }
//    //      }
        
//    //      if(data[i]["image2"]!=undefined){
//    //          $(clone).find(".dynamic_img").last().attr("src","assets/images/"+data[i]["image2"]);
//    //      }

//    //      if(data[i]["image"]){
//    //          if(data[i]["image"]!="false"){
//    //              $(clone).find(".video_content").remove();
//    //              $(clone).attr("data-avatar",data[i]["image"]);
//    //              $(clone).find(".dynamic_img").first().attr("src","assets/images/"+data[i]["image"]);
//    //          }else{
//    //              $(clone).find(".video_content").remove();
//    //              $(clone).find(".image").remove();
//    //              $(clone).find(".caption").css("height","100%");
//    //          }
//    //      }
//    //      else{
//    //          $(clone).find(".dynamic_cover").attr("src","assets/images/"+data[i]["cover_video"]);
//    //          $(clone).addClass("video_wrapper");
//    //          $(clone).find(".img_wrapper span").css({"vertical-align":"middle"});
//    //          $(clone).find(".dynamic_img").first().hide();
//    //          $("video source").attr('src',"assets/video/"+data[i]["video"]);
//    //          $("video")[0].load();

//    //          $(clone).find(".video_content").click(function(e){
//    //              if(!$(".modal-video").hasClass("open")){
//    //                  $(".modal-video").addClass("open");
//    //                  $("video")[0].play();
//    //              }
//    //          });

//    //          $(".modal-video .btn-close").click(function(e){
//    //              $(".modal-video").removeClass("open");
//    //              $("video")[0].pause();
//    //          });
            
//    //      }

//    //      if($this.list_ans.length > 0){

//    //      }else{
//    //          if(data[i]["question"] != undefined){
//    //              $(clone).find(".textarea_"+number).attr("placeholder",data[i]["question"]);
//    //          }
//    //      }
     
//    //      if(data[i]["text"] == undefined){
//    //          $(clone).find(".text-box").hide();
//    //      }else{
//    //          //set text in json file key and class dynamic_text
//    //          // console.log(clone);
//    //          // $(clone).find(".dynamic_text").html(data[i]["text"]);

//    //          if(data[i]["text"].indexOf("[first name]") != -1){
//    //              var txt_name = data[i]["text"];
//    //              var name = game.scorm_helper.getName();
//    //              var firstname = name.split(", ");
//    //              var real_name = txt_name.replace("[first name]","<span style='color:blue;'>"+firstname[1]+"</span>");
//    //              $(clone).find(".dynamic_text").html(real_name);
//    //          }else{
//    //              $(clone).find(".dynamic_text").html(data[i]["text"]);
//    //          }
//    //      }

//    //      if(data[i]["label"]){
//    //          $(clone).find(".quiz-label").html(data[i]["label"]);
//    //      }
//    //      else{
//    //          $(clone).find(".quiz-label").remove();
//    //      }

//    //      console.log(clone);
//    //      $(".owl-carousel").append(clone);
//    //      // $(".owl-carousel2").append('test');

//     }
// };

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