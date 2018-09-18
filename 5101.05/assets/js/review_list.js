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
	// $this.category_game = game.getCategoryGame();
	$this.category_game = $this.game_data['category_game'];
	// $this.curr_challenge = game.scorm_helper.getSingleData("curr_challenge");
	// $this.curr_challenge = ($this.game_data["curr_challenge"] == undefined ? 1 : $this.game_data["curr_challenge"]);
	$this.curr_challenge = game.current_challenge;
	console.log($this.curr_challenge);

	$this.category_game = 'sales';
	if($this.category_game == undefined){
		// game.setSlide(0);
	}
	/*$("#tutorial").modal("show");
	$('#sliderTutorial').slick({
        dots: true,
        infinite: false,
        speed: 500
     });

	$("#tutorial .start-game").click(function(e){
		$("#tutorial").modal("hide");
	});*/

	$.get("config/quiz_review_"+$this.category_game+".json",function(e){
		console.log(e);/**/
		$this.ldata = e;
		console.log($this.ldata[$this.curr_challenge - 1]);
		if($this.ldata[$this.curr_challenge - 1]['data'].length > 0){
			$this.curr_soal = [];
			$this.curr_soal.push(e[$this.curr_challenge - 1]);

			$(".loader_image_index").show();
			$.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e2){
				$(".loader_image_index").hide();
				console.log(e2);
				//get challenge answer before
				$this.last_challange = e2;
				$this.last_challange.sort(function(a, b) {
	                return a.activityid - b.activityid;
	            });
	            console.log($this.last_challange);

	            /*check status on review*/
	            if($this.last_challange.length > 0){
	            	var onReview = true;
	            	var countSubChallenge = 0;
	            	var data_sub_challenge = $this.ldata[$this.curr_challenge - 1]['data'];
	            	for (var h = 0; h < data_sub_challenge.length; h++) {

		            	for (var i = 0; i < $this.last_challange.length; i++) {
				            var max = game.max_file_upload + 1;
							var min = 1;
							var activityid = $this.last_challange[i]["activityid"];
							var challenge_id = $this.last_challange[i]["challenge_id"];
							var grade = $this.last_challange[i]["grade"];
							var game_data = $this.game_data;
							console.log(game_data);
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

							console.log('min: '+min+' max: '+max+' activityid: '+activityid);
							if(activityid >= min && activityid <= max){
								countSubChallenge += 1;

								if(grade == 0 || grade == 100){
									onReview = false;
								}
								break;
							}
						}
					}
					console.log('countSubChallenge: '+countSubChallenge+' length_sub_challenge: '+data_sub_challenge.length);
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
				alert("Connection problem, please connect to internet !");
				$('.list-group').html('');
				$('.loader_image_index').hide();
			});
		}else{
			$('.list-group').html('<span color:red:>Quiz not found</span>');
		}
	},'json');
};

// reviewList.prototype.mulai_game = function() {
// 	var $this = this;
// 	$this.isReview = false;
// 	$this.isComplete = false;

// 	$this.sc_data = game.scorm_helper.getLastGame("game1");


	
// 	$.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e){
// 		console.log(e);
// 		if(e.length>0){
// 			$this.sc_data = e;
// 			for (var i = 0; i < e.length; i++) {
// 				if($this.curr_review == ""){
// 					$this.curr_review = e[i]["review_by"];
// 				}

// 				if(e[i]["grade"] != -1){
// 					if(e[i]["status"]=="accepted" && e[i]["review_by"] == "buddy"){
// 						$this.count_review_buddy++;
// 					}
// 					else if(e[i]["status"]=="accepted" && e[i]["review_by"]=="atasan"){
// 						$this.count_review_atasan++;
// 					}
// 					else if(e[i]["status"]=="accepted" && e[i]["review_by"]=="learner"){
// 						$this.count_review_atasan++;
// 					}
// 				}
// 				else{
// 					$this.isReview = true;
// 					break;
// 				}
// 			}

// 			if(($this.count_review_learner == e.length && $this.tipe_review=="learner") || $this.count_review_atasan == e.length){
// 				$this.isComplete = true;
// 			}
// 			else if($this.count_review_buddy == e.length){
// 				if($this.tipe_review == "buddy"){
// 					$this.isComplete = true;
// 				}
// 				else{
// 					$this.isReview = true;
// 				}
// 			}

// 			if($this.isReview){
// 				// tampil page lagi di review
// 				$this.create_page_review();
// 			}
// 			else if($this.isComplete){
// 				// show popup complete
// 				game.scorm_helper.setSingleData("score_scale",2);
// 				game.scorm_helper.sendResult(game.max_score);
// 				game.scorm_helper.setStatus("completed");
// 				$("#popupcomplete").modal("show");
// 				$("#popupcomplete .close-popupcomplete").click(function(e){
// 					$("#popupcomplete").modal("hide");
// 				});
// 				$this.create_challange();
// 			}
// 			else{
// 				$("#tutorial").modal("show");
// 				$('#sliderTutorial').slick({
// 			        dots: true,
// 			        infinite: false,
// 			        speed: 500
// 			     });

// 				$("#tutorial .start-game").click(function(e){
// 					$("#tutorial").modal("hide");
// 				});
// 				$this.create_challange();
// 			}

// 			if($this.count_review_buddy == e.length || $this.count_review_learner == e.length || $this.count_review_atasan == e.length || $this.isComplete){
// 				$(".submit-ans").hide();
// 			}
// 		}else{
// 			$("#tutorial").modal("show");
// 			$('#sliderTutorial').slick({
// 		        dots: true,
// 		        infinite: false,
// 		        speed: 500
// 		     });

// 			$("#tutorial .start-game").click(function(e){
// 				$("#tutorial").modal("hide");
// 			});
// 			$this.create_challange();
// 		}
// 	},'json');
// };

// reviewList.prototype.create_challange = function() {
// 	var $this = this;
// 	$this.count = 0;
// 	$(".submit-ans").click(function(e){
// 		var flag = 0;
// 		game.audio.audioButton.play();
// 		$(".img_result img").each(function(e){
// 			console.log($(this).attr("src"));
// 			if($(this).attr("src")=="(unknown)" || $(this).attr("src")=="image/none.png"){
// 				flag = 1;
// 			}
// 		});

// 		$("textarea").each(function(e){
// 			console.log($(this).val());
// 			if($(this).val() == "" || $(this).val() == null){
// 				flag = 1;
// 			}
// 		});

// 		console.log(flag);

// 		if(flag == 1){
// 			console.log("popup Not Complete");
// 			$this.popupNotComplete();
// 		}
// 		else{
// 			var data_submit = $this.getDataForSubmit();
// 			console.log(data_submit);
// 			if(data_submit.length>0){
// 				$(this).off();
// 				$.post(game.base_url+"submit.php",{username:game.username,cmid:game.module_id,data:data_submit},function(e){
// 					if(e.status == "success"){
// 						// masuk ke page review
// 						$this.create_page_review();
// 					}
// 					else{
// 						// popup gagal submit
// 						$("#popupalert").modal("show");
// 						$("#popupalert .closealert").click(function(e){
// 							$("#popupalert2").modal("hide");
// 						});
// 						console.log("gagal submit");
// 					}
// 				},'json');
// 			}
// 			else{
// 				$this.popupNotComplete();
// 			}
// 		}
// 	});
	
// 	$this.loadContent();
// };

// reviewList.prototype.popupNotComplete = function() {
// 	// popup gagal karena masih ada data yang kosong
// 	$("#popupalert2").modal("show");
// 	$("#popupalert2 .closealert").click(function(e){
// 		$("#popupalert2").modal("hide");
// 	});
// 	console.log("masih ada data yang kosong");
// };

// reviewList.prototype.getDataForSubmit = function() {
// 	var flag = 0;
// 	var arr_temp = [];
// 	var $this = this;
// 	for (var i = 0; i < $this.sc_data.length; i++) {
// 		if($this.sc_data[i]["grade"] == -1 || $this.sc_data[i]["grade"] == 0){
// 			arr_temp.push($this.sc_data[i]);
// 		}
// 	}

// 	return arr_temp;
// };

// reviewList.prototype.loadContent = function() {
// 	var url2="";
// 	var $this = this;
// 	var challange = $this.ldata;

// 	if(challange[$this.count]["activity_type"] == 1){
// 		url2 = "content/type-1.html";
// 	}
// 	else if(challange[$this.count]["activity_type"] == 2){
// 		url2 = "content/type-2.html";
// 	}

// 	$.get(url2,function(e){
// 		var clone = $(e).clone();
// 		$("#accordion").append(clone);

// 		$(clone).find("input[name='user_id']").val(game.username);
// 		$(clone).find("input[name='cmid']").val(game.module_id);
// 		$(clone).find("input[name='activityid']").val(challange[$this.count]["activityid"]);
		
// 		$(clone).attr("index",$this.count);
// 		// $(clone).find("#accordion-wrapper").attr("href","#data-"+challange[$this.count]["activityid"]);
// 		// $(clone).find(".panel-collapse.collapse").attr("id","data-"+challange[$this.count]["activityid"]);
// 		$(clone).find(".panel-title").html(challange[$this.count]["activity_title"]);
// 		$(clone).find(".panel-body p").html(challange[$this.count]["activity_question"]);
// 		// $(clone).find(".status>div").css({"display":"none"});
// 		// $(clone).find(".grade_by").hide();

// 		if($(clone).find("#inputTextarea").length>0){
// 			var input_textarea = "textarea_"+challange[$this.count]["activityid"];
// 			$(clone).find("#inputTextarea").attr("id",input_textarea);
			
// 			if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
// 				$(clone).find("#"+input_textarea).val($this.sc_data[$this.count]["activity_response"]);
// 				if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
// 					$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);
// 					$(clone).find("#"+input_textarea).attr("readonly","readonly");
// 					$(clone).find("#"+input_textarea).attr("disabled","disabled");
// 				}
// 			}

// 			document.getElementById(input_textarea).onchange = function () {
// 				var form = $("textarea[id='"+input_textarea+"'").parents("form");
// 				var grade_by_id;
// 				if($this.sc_data[$(form).attr("index")] == undefined){
// 					grade_by_id = null;
// 				}
// 				else{
// 					grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
// 				}

// 				var res = {
// 						activityid:$this.ldata[$(form).attr("index")]["activityid"],
// 						activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
// 						activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
// 						activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
// 						activity_response:$(this).val(),
// 						grade:-1,
// 						pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
// 						grade_type:$this.ldata[$(form).attr("index")]["grade_type"],
// 						grade_by_id:grade_by_id,
// 						reviewtype:2
// 					};
// 				$this.sc_data[$(form).attr("index")] = res;
// 				game.scorm_helper.setAnsData("game1",$this.sc_data);
// 			}
// 		}
// 		else if($(clone).find("#fileToUpload").length>0){
// 			var id_file = "files_"+challange[$this.count]["activityid"];
// 			var img = "image_"+challange[$this.count]["activityid"];

// 			$(clone).find("#fileToUpload").attr("id",id_file);
// 			$(clone).find("#image").attr("id",img);

// 			if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
// 				$(clone).find(".upload_wrapper").css({"display":"none"});
// 				$(clone).find(".thumb_profile").css({"display":"block"});
// 				document.getElementById(img).src = $this.sc_data[$this.count]["activity_response"]+"?lastmod="+new Date();

// 				if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
// 					$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);
// 					$(clone).find(".thumb_profile .close").css({"display":"none"});
// 					$(clone).find(".submit_wrapper").css({"display":"none"});
// 				}
// 			}
// 			else{
// 				$(clone).find(".upload_wrapper").css({"display":"block"});
// 				$(clone).find(".thumb_profile").css({"display":"none"});
// 			}

// 			console.log(id_file);
// 			document.getElementById(id_file).addEventListener('change', (e) => {
// 			  	const file = e.target.files[0];
// 				$(clone).find(".upload_wrapper").css({"display":"none"});
// 				$(clone).find(".thumb_profile").css({"display":"block"});

// 				var form = $("input[id='"+id_file+"']").parents("form");
// 				$(form).find(".loader_image").css({"display":"block"});
// 				$(form).find(".progress-bar").css({"width":"0%"});
// 				$(form).find("input[type='submit']").css({"display":"none"});
// 				$(form).find(".img_result img").attr("src","image/none.png");

// 				console.log(file);
// 			  if (!file) {
// 			    return;
// 			  }

// 			  new ImageCompressor(file, {
// 			    maxWidth: 800,
// 			    maxHeight: 800,
// 			    success(result) {
// 			    	console.log(result);
// 			      var formData = new FormData();
// 			      formData.append('user_id',game.username);
// 			      formData.append('cmid',game.module_id);
// 			      formData.append('activityid',$this.ldata[$(form).attr("index")]["activityid"]);
// 			      formData.append('file', result, result.name);
// 			      $(form).find("#progress").css({"display":"block"});
			      
// 				    try{
// 						$.ajax({
// 							xhr: function() {
// 						        var xhr = new window.XMLHttpRequest();
// 						        xhr.upload.addEventListener("progress", function(evt) {
// 						            if (evt.lengthComputable) {
// 						                var percentComplete = evt.loaded / evt.total;
// 						                //Do something with upload progress here
// 						                $(form).find(".progress-bar").css({"width":(percentComplete*100)+"%"});
// 						            }
// 						       }, false);

// 						       return xhr;
// 						    },
// 							url: game.base_url+"upload.php",
// 							type: "POST",           // Type of request to be send, called as method
// 							data: formData, 		// Data sent to server, a set of key/value pairs (i.e. form fields and values)
// 							contentType: false,     // The content type used when sending data to the server.
// 							cache: false,           // To unable request pages to be cached
// 							processData:false,      // To send DOMDocument or non processed data file it is set to false
// 							dataType: 'json',
// 							success: function(data) {
// 								if(data["status"] == "success"){
// 									$(form).find(".loader_image").css({"display":"none"});
// 									$(form).find("#progress").css({"display":"none"});
// 									$(form).find(".upload_wrapper").css({"display":"none"});

// 									$(form).find(".img_result img").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
// 									var grade_by_id;
// 									if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
// 										grade_by_id = null;
// 									}
// 									else{
// 										grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
// 									}

// 									var res = {
// 										activityid:$this.ldata[$(form).attr("index")]["activityid"],
// 										activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
// 										activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
// 										activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
// 										activity_response:game.base_url+data["message"],
// 										grade:-1,
// 										pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
// 										grade_type:$this.ldata[$(form).attr("index")]["grade_type"],
// 										grade_by_id:grade_by_id,
// 										reviewtype:2
// 									};

// 									$this.sc_data[$(form).attr("index")] = res;
// 									console.log($this.sc_data);

// 									game.scorm_helper.setAnsData("game1",$this.sc_data);
// 								}
// 							}
// 						});	
// 					}catch(e){
// 						alert(e);
// 					}



// 			    },
// 			    error(e) {
// 			      console.log(e.message);
// 			    },
// 			  });
// 			});
// 		}
// 		if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
// 			if($this.sc_data[$this.count]["review_by"] == "buddy"){
// 				if($this.sc_data[$this.count]["status"] == "accepted"){
// 					$(clone).find(".review_wrap.buddy").addClass("accepted");
// 				}
// 				else{
// 					$(clone).find(".review_wrap.buddy").addClass("rejected");
// 				}
// 			}
// 			else if($this.sc_data[$this.count]["review_by"] == "atasan"){
// 				if($this.sc_data[$this.count]["status"] == "accepted"){
// 					$(clone).find(".review_wrap.atasan").addClass("accepted");
// 				}
// 				else{
// 					$(clone).find(".review_wrap.atasan").addClass("rejected");
// 				}
// 			}
// 		}

// 		$this.count = parseInt($this.count)+1;
// 		if($this.count<challange.length){
// 			$this.loadContent();
// 		}
// 		else{
// 			$this.setTrigger();
// 		}
// 		$(".total_score").html($this.total_score);
// 	},'html');
// };

// reviewList.prototype.setTrigger = function() {
// 	var $this = this;
// 	$('.panel-heading').click(function(){
// 		console.log("tes");
// 		$('.panel-collapse.in').collapse('hide');
		
// 	    $(this).parents('form').find('.panel-collapse').collapse('toggle');
// 	    if($(this).find(".arrow.down").is(':visible')){
// 			$(".arrow.up").hide();
// 			$(".arrow.down").show();
// 			$(this).find(".arrow.up").show();
// 			$(this).find(".arrow.down").hide();
// 		}
// 		else{
// 			$(".arrow.up").hide();
// 			$(".arrow.down").show();
// 			$(this).find(".arrow.down").show();
// 			$(this).find(".arrow.up").hide();
// 		}
// 	});

// 	$("#content").on('click',".close",function(e){
// 		game.audio.audioButton.play();
// 		$(this).parents("form").find(".img_result img").attr("src","image/none.png");
// 		$(this).parents("form")[0].reset();
// 		$(this).parents("form").find(".fileToUpload").val("");
// 		$(this).parents("form").find("input[name='user_id']").val(game.username);
// 		$(this).parents("form").find("input[name='cmid']").val(game.module_id);
// 		$(this).parents("form").find("input[name='activityid']").val($this.ldata[$(this).parents("form").attr("index")]["activityid"]);

// 		$(this).parents(".panel-default").find(".upload_wrapper").css({"display":"block"});
// 		$(this).parents(".panel-default").find(".thumb_profile").css({"display":"none"});
// 		$(this).parents(".panel-default").find("#progress").css({"display":"none"});
// 	});
// };
// reviewList.prototype.create_page_review = function() {
// 	var $url = "";
// 	var $this = this;
// 	if($this.count_review_buddy == $this.ldata.length || $this.curr_review == "atasan"){
// 		$url = "content/review_atasan.html";
// 	}
// 	else{
// 		$url = "content/review.html";
// 	}

// 	$("#content").load($url,function(e){

// 	});	
	
// };

reviewList.prototype.appendHtml = function(data) {
	var $this = this;
	console.log($this.last_challange);
	var clone = $(".wrap").clone();
	var mode = 2;
	// var clone2 = $(clone).find(".list-group-item").clone();
	$(".wrap").text("");

	var total_soal = 0;
	console.log(data);
	if(data.length > 0){
		for (var i = 0; i < data.length; i++) {
			var no = i+1;
			$(clone).find(".title_instruction span").html(data[i]['label']);
			$(clone).find(".desc_challenge").html(data[i]['desc']);

			var data2 = data[i]['data'];
			console.log(data2);
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
								var max = game.max_file_upload + 1;
								var min = 1;
								if(curr_activityid > 1){
									var deret_n = $.deretAritmatika(4, 4, curr_activityid); //function deret aritmatika kyubi.js
									max = deret_n;

									var deret_n2 = $.deretAritmatika(1, 4, curr_activityid); //function deret aritmatika kyubi.js
									min = deret_n2;
								}
								//check activityid text
								console.log($this.last_challange[k]);
								console.log(challange_id);
								console.log($this.curr_challenge);
								console.log(curr_activityid);
								if($this.curr_challenge == challange_id){
									if(activityid >= min && activityid <= max){
										console.log(id);
										if(grade == 100){ //if review img and text accepted
											$(clone_item2).find('.dot').hide();
											$(clone_item2).find('.img_dynamic').show();
										}else if(grade == 0){ //if review img and text rejected
											$(clone_item2).find('.dot').hide();
											$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-decline.png');
											$(clone_item2).find('.img_dynamic').show();

											break;
										}else if(grade == -1){//if img and text still reviewing
											console.log('test');
											console.log(clone_item2);
											$(clone_item2).find('.dot').hide();
											$(clone_item2).find('.img_dynamic').attr('src', game.image_path+'review/'+'icon-submit.png');
											$(clone_item2).find('.img_dynamic').show();

										}
										console.log(clone_item2);
									}
								}
							}
						}
						var list = '';
					}
					// console.log(clone_item2[0]['outerText']);
					console.log(clone_item2);
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
		console.log(id);
		// game.game_data['curr_challenge'] = id[2];
		game.game_data['curr_sub_challenge'] = id[2];
		game.scorm_helper.setSingleData('game_data', game.game_data);
		game.nextSlide();
	});
};