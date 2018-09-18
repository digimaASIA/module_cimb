var review = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

var sc_data = [];

review.prototype.getScormLength = function(last_game) {
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

review.prototype.init = function() {
	console.log('init review');
	var $this = this;
	$this.count_review_buddy=0;
	$this.count_review_atasan=0;
	$this.count_review_learner=0;

	$this.game_data = game.game_data;
	console.log($this.game_data);
	$this.category_game = $this.game_data['category_game'];
	$this.category_game = 'sales';

	$this.curr_challenge = parseInt($this.game_data['curr_challenge']);
	$this.curr_challenge = 1; //comment

	$this.curr_sub_challenge = $this.game_data['curr_sub_challenge'];
	$this.curr_sub_challenge = 1; //comment

	$this.mission_complete = 0; 
	$this.mission_total = 0;

	$this.max_file_upload = game.max_file_upload;

	$this.sc_data = [];
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
	
	// $.get("config/quiz_review_"+$this.category_game+".json",function(e){
	// 	console.log(e);/**/
	// 	// $this.ldata = e;
	// 	$this.curr_soal = [];
	// 	$this.curr_soal.push(e[$this.curr_challenge - 1]['data'][$this.curr_sub_challenge - 1])
	// 	// console.log($this.curr_soal);
	// 	$this.mission_total = e[$this.curr_challenge - 1]['data'].length;

	// 	$('.total_mission').html('/'+$this.mission_total);
	// 	// $this.mulai_game();

	// 	// $(".loader_image_index").show();
	// 	// $.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e2){
	// 	// 	$(".loader_image_index").hide();
	// 	// 	console.log(e2);
	// 	// 	$this.last_challange = e2;
	// 	// 	$this.last_challange.sort(function(a, b) {
 //  //               return a.activityid - b.activityid;
 //  //           });
 //  //           console.log($this.last_challange);
	// 	// 	$this.appendHtml($this.curr_soal);
	// 	// },'json');
	// },'json');

	$('.btn-next2').click(function(){
		game.setSlide(3);
	});

	$('.loader_image_index').show();
	$.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e){
		console.log(JSON.parse(e));
		$('.loader_image_index').hide();
		$this.ldata = JSON.parse(e);
	});

	// var url = game.base_url+'get_challenge.php';
	// var async = false;
	// var formdata = {"cmid":game.module_id,"username":game.username};
	// var post = game.requestPost(url, async, formdata);
	// console.log(post);
	// console.log('test');
};

review.prototype.mulai_game = function() {
	console.log('mulai_game');
	var $this = this;
	$this.isReview = false;
	$this.isComplete = false;

	$this.sc_data = game.scorm_helper.getLastGame("game1");
	$('.loader_image_index').show();
	$.post(game.base_url+"get_challenge.php",{"cmid":game.module_id,"username":game.username},function(e){
		console.log(e);
		$('.loader_image_index').hide();
		if(e.length>0){
			$this.sc_data = e;
			for (var i = 0; i < e.length; i++) {
				if($this.curr_review == ""){
					$this.curr_review = e[i]["review_by"];
				}

				if(e[i]["grade"] != -1){
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
					break;
				}
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
			console.log('$this.isReview: '+$this.isReview);
			if($this.isReview){
				// tampil page lagi di review
				$this.create_page_review();
			}
			else if($this.isComplete){
				// show popup complete
				game.scorm_helper.setSingleData("score_scale",2);
				game.scorm_helper.sendResult(game.max_score);
				game.scorm_helper.setStatus("completed");
				// $("#popupcomplete").modal("show");
				$("#popupcomplete .close-popupcomplete").click(function(e){
					$("#popupcomplete").modal("hide");
				});
				// console.log('test1');
				$this.create_challange();
			}
			else{
				$("#tutorial").modal("show");
				$('#sliderTutorial').slick({
			        dots: true,
			        infinite: false,
			        speed: 500
			     });

				$("#tutorial .start-game").click(function(e){
					$("#tutorial").modal("hide");
				});
				// console.log('test2');
				$this.create_challange();
			}

			if($this.count_review_buddy == e.length || $this.count_review_learner == e.length || $this.count_review_atasan == e.length || $this.isComplete){
				$(".submit-ans").hide();
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
			// console.log('test3');
			$this.create_challange();
		}
	},'json');
};

review.prototype.create_challange = function() {
	console.log('create_challange');
	// console.log(modulReview);
	// console.log(game);
	// console.log(setupSlider);
	// remove_item(1);
	// ModulReview.remove_item(1);
	var $this = this;
	$this.count = 0;
	var img_ext   = ['jpg','gif','png','jpeg'];
	$(".submit-ans").click(function(e){
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
			if(data_submit.length>0){
				// $(this).off();
				try{
					$('.loader_image_index').show();
					console.log({username:game.username,cmid:game.module_id,data:data_submit});
					$.post(game.base_url+"submit.php",{username:game.username,cmid:game.module_id,data:data_submit},function(e){
						console.log(e);
						$('.loader_image_index').hide();
						if(e.status == "success"){
							// masuk ke page review
							$this.create_page_review();
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
    					alert( "error" );
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
	var curr_upload_id = parseInt($('.curr_upload_id').val());
	// console.log(clone_item_2);
	$('.list-group').html('');
	var flagEventDelete = 0;
	var splice;
	$(".fileToUpload").change(function(e){
		console.log(this);
		console.log(curr_upload_id);
		var files       = this.files;
		var numItems = $('.list-group .list-group-item').length
		console.log(files);
		console.log('curr_upload_id: '+curr_upload_id);
		console.log('numItems: '+numItems);
		//max_file_upload from game.js
		if(files.length <= $this.max_file_upload && numItems <= 2){
			var id = curr_upload_id;
			for (var i = 0; i < files.length; i++) {
				// id = curr_upload_id;
				// id = i+1;
				console.log('id: '+id);
				var clone_item_3 = $(clone_item_2).clone();
				console.log(i);
				
				console.log(Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_'));
				
				// files[i]['name']   = Math.random().toString(36).replace('0.', '')+'_'+files[i].name.replace(' ','_');
				// files[i].name   = 'asd123.jpg';
				console.log(files[i].name);
				var ext         = files[i].name.split('.')[1].toLowerCase();
				console.log(ext);
				// var size        = files[i].size;
				// console.log(size);
				console.log(files[i]);
				console.log($.inArray(ext,img_ext));
				
	            var activity_title = 'Mission-'+$this.curr_challenge+'-'+$this.curr_sub_challenge;
	            var activity_type; //activity_type: 5, itu file
	            var activity_question = $('.desc_challenge').text();
	            var activity_response;
	            var flagImage = 0;

				if($.inArray(ext,img_ext) > -1){
					activity_type = 1; //activity type image
					flagImage = 1;
					// console.log('test');
					$.imageCompressor(files[i], function(res){
						console.log(res);
						var arr_img = [];
						arr_img.push(res);
						$(clone_item_3).attr('id', 'list-group-item_'+numItems);
						$(clone_item_3).find('.img_dynamic').attr('id','img_dynamic-'+numItems);
						$(clone_item_3).find('.fa-times').attr('id','fa-times_'+numItems);
						// $(clone_item_3).find('.fa-times').attr('onclick','modulReview.remove_item('+numItems+')');
						$(clone_item_3).find('.txt_dynamic .file_name').html(res.name);
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


					});
					// new ImageCompressor(files[i], {
					// 	maxWidth: 800,
					// 	maxHeight: 800,
					// 	success(result) {
					// 		console.log(result);
					// 		// callback(result);
					// 	},
					// 	error(e) {
					// 		console.log(e.message);
					// 		alert(e.message);
					// 	}
			  //       });
				}else{
					activity_type = 5; //activity type file
					$(clone_item_3).attr('id', 'list-group-item_'+numItems);
					$(clone_item_3).find('.img_dynamic').hide();
					$(clone_item_3).find('.fa-times').attr('id','fa-times_'+numItems);
					$(clone_item_3).find('.fa-times').attr('onclick',this.remove_item);
					$(clone_item_3).find('.txt_dynamic .file_name').html(files[i].name);
					var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+files[i].name+"?123";
					$(clone_item_3).find(".img_dynamic").attr("src",img_src);

					// $('.list-group').append(clone_item_3);
				}

				curr_upload_id += 1;
				console.log('curr_upload_id: '+curr_upload_id);
				$('.curr_upload_id').val(numItems);
				$('.list-group').append(clone_item_3);

				console.log('#fa-times_'+numItems);
				// $('.fa-times').click(function(e){
				// 	// var id = $(this).attr('id');
				// 	var id = numItems;
				// 	// id = id.split('_');
				// 	// id = id[1];
				// 	console.log(id);
				// 	$('#list-group-item_'+id).remove();
				// 	$this.sc_data.splice(id, 1);
				// 	console.log($this.sc_data);
				// });

				//append content will upload to server
				// $this.loadContent();

				//upload image to server
				var activityid = $this.curr_sub_challenge * (numItems+1);
				var form = clone_item_3;
				console.log('uploadFile');
				$('.loader_image_index').show();
				game.uploadFile(activityid, files[i], function(data){	
					console.log(data);
					console.log(form);
					console.log(form.find(".img_dynamic"));
	                var grade_by_id = null;
	                 // if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
	                 //     grade_by_id = null;
	                 // }
	                 // else{
	                 //     grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
	                 // }

	                 if(flagImage == 1){
	                	$(form).find(".img_dynamic").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
	                 	activity_response = game.base_url+data["message"];
	                 }else{
	                 	activity_response = '<a href='+game.base_url+data["message"]+'>Klik Here</a>';
	                 }
	                 $('.loader_image_index').hide();

	                 console.log('test');
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
	                     reviewtype:2,
	                     challange_id: $this.curr_challenge
	                 };
	                 console.log(res);
	                 console.log($this.sc_data);
	                 console.log(sc_data);
	                 $this.sc_data[numItems] = res;
	                 sc_data[numItems] = res;
	                 console.log($this.sc_data);
	                 console.log(sc_data);

	                 game.scorm_helper.setAnsData("game1",$this.sc_data);
					
				});
			}
			
			// if(flagEventDelete == 0){
				// flagEventDelete = 1;
				//event click .fa-times
				$('.fa-times').click(function(e){
					var id = $(this).attr('id');
					id = id.split('_');	
					id = id[1];
					console.log(id);
					$('#list-group-item_'+id).remove();
					// if($this.sc_data.length > 0){
					// 	for (var i = 0; i < $this.sc_data.length; i++) {
					// 		if($this.sc_data[i]['']
					// 	}
					// 	$this.sc_data.splice(id, 1);
					// }
					console.log(splice);
					if(splice == undefined){
						splice = $this.sc_data.splice(id, 1);
					}
					console.log(splice);
					console.log($this.sc_data);
				});
			// }
			// $('list-group').append(clone_item_2);
		}else{
			alert('Maximum upload is 3 files !');
		}
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
};

review.prototype.popupNotComplete = function() {
	// popup gagal karena masih ada data yang kosong
	$("#popupalert2").modal("show");
	$("#popupalert2 .closealert").click(function(e){
		$("#popupalert2").modal("hide");
	});
	console.log("masih ada data yang kosong");
};

review.prototype.getDataForSubmit = function() {
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
		var next_id = game.max_file_upload + 1;
		console.log($this.sc_data);
		var activity_question = '';

		for (var i = 0; i < $this.sc_data.length; i++) {
			if($this.sc_data[i]["grade"] == -1 || $this.sc_data[i]["grade"] == 0){
				arr_temp.push($this.sc_data[i]);
			}

			if(i == ($this.sc_data.length - 1)){
				activity_question = $this.sc_data[i]['activity_question'];
			}
		}

		var activity_title = 'Mission-'+$this.curr_challenge+'-'+$this.curr_sub_challenge;
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
			reviewtype:2,
			challange_id: $this.curr_challenge
		};

		arr_temp.push(res);
	}

	return arr_temp;
};

review.prototype.loadContent = function() {
	var url2="";
	var $this = this;
	var data = $this.curr_soal;
	console.log(data);

	// if(challange[$this.count]["activity_type"] == 1){
	// 	url2 = "content/type-1.html";
	// }
	// else if(challange[$this.count]["activity_type"] == 2){
	// 	url2 = "content/type-2.html";
	// }

	// $.get(url2,function(e){
	// 	var clone = $(e).clone();
	// 	$("#accordion").append(clone);

	// 	$(clone).find("input[name='user_id']").val(game.username);
	// 	$(clone).find("input[name='cmid']").val(game.module_id);
	// 	$(clone).find("input[name='activityid']").val(challange[$this.count]["activityid"]);
		
	// 	$(clone).attr("index",$this.count);
	// 	// $(clone).find("#accordion-wrapper").attr("href","#data-"+challange[$this.count]["activityid"]);
	// 	// $(clone).find(".panel-collapse.collapse").attr("id","data-"+challange[$this.count]["activityid"]);
	// 	$(clone).find(".panel-title").html(challange[$this.count]["activity_title"]);
	// 	$(clone).find(".panel-body p").html(challange[$this.count]["activity_question"]);
	// 	// $(clone).find(".status>div").css({"display":"none"});
	// 	// $(clone).find(".grade_by").hide();

	// 	if($(clone).find("#inputTextarea").length>0){
	// 		var input_textarea = "textarea_"+challange[$this.count]["activityid"];
	// 		$(clone).find("#inputTextarea").attr("id",input_textarea);
			
	// 		if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
	// 			$(clone).find("#"+input_textarea).val($this.sc_data[$this.count]["activity_response"]);
	// 			if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
	// 				$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);
	// 				$(clone).find("#"+input_textarea).attr("readonly","readonly");
	// 				$(clone).find("#"+input_textarea).attr("disabled","disabled");
	// 			}
	// 		}

	// 		document.getElementById(input_textarea).onchange = function () {
	// 			var form = $("textarea[id='"+input_textarea+"'").parents("form");
	// 			var grade_by_id;
	// 			if($this.sc_data[$(form).attr("index")] == undefined){
	// 				grade_by_id = null;
	// 			}
	// 			else{
	// 				grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
	// 			}

	// 			var res = {
	// 					activityid:$this.ldata[$(form).attr("index")]["activityid"],
	// 					activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
	// 					activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
	// 					activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
	// 					activity_response:$(this).val(),
	// 					grade:-1,
	// 					pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
	// 					grade_type:$this.ldata[$(form).attr("index")]["grade_type"],
	// 					grade_by_id:grade_by_id,
	// 					reviewtype:2
	// 				};
	// 			$this.sc_data[$(form).attr("index")] = res;
	// 			game.scorm_helper.setAnsData("game1",$this.sc_data);
	// 		}
	// 	}
	// 	else if($(clone).find("#fileToUpload").length>0){
	// 		var id_file = "files_"+challange[$this.count]["activityid"];
	// 		var img = "image_"+challange[$this.count]["activityid"];

	// 		$(clone).find("#fileToUpload").attr("id",id_file);
	// 		$(clone).find("#image").attr("id",img);

	// 		if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
	// 			$(clone).find(".upload_wrapper").css({"display":"none"});
	// 			$(clone).find(".thumb_profile").css({"display":"block"});
	// 			document.getElementById(img).src = $this.sc_data[$this.count]["activity_response"]+"?lastmod="+new Date();

	// 			if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
	// 				$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);
	// 				$(clone).find(".thumb_profile .close").css({"display":"none"});
	// 				$(clone).find(".submit_wrapper").css({"display":"none"});
	// 			}
	// 		}
	// 		else{
	// 			$(clone).find(".upload_wrapper").css({"display":"block"});
	// 			$(clone).find(".thumb_profile").css({"display":"none"});
	// 		}

	// 		console.log(id_file);
	// 		document.getElementById(id_file).addEventListener('change', (e) => {
	// 		  	const file = e.target.files[0];
	// 			$(clone).find(".upload_wrapper").css({"display":"none"});
	// 			$(clone).find(".thumb_profile").css({"display":"block"});

	// 			var form = $("input[id='"+id_file+"']").parents("form");
	// 			$(form).find(".loader_image").css({"display":"block"});
	// 			$(form).find(".progress-bar").css({"width":"0%"});
	// 			$(form).find("input[type='submit']").css({"display":"none"});
	// 			$(form).find(".img_result img").attr("src","image/none.png");

	// 			console.log(file);
	// 		  if (!file) {
	// 		    return;
	// 		  }

	// 		  new ImageCompressor(file, {
	// 		    maxWidth: 800,
	// 		    maxHeight: 800,
	// 		    success(result) {
	// 		    	console.log(result);
	// 		      var formData = new FormData();
	// 		      formData.append('user_id',game.username);
	// 		      formData.append('cmid',game.module_id);
	// 		      formData.append('activityid',$this.ldata[$(form).attr("index")]["activityid"]);
	// 		      formData.append('file', result, result.name);
	// 		      $(form).find("#progress").css({"display":"block"});
			      
	// 			    try{
	// 					$.ajax({
	// 						xhr: function() {
	// 					        var xhr = new window.XMLHttpRequest();
	// 					        xhr.upload.addEventListener("progress", function(evt) {
	// 					            if (evt.lengthComputable) {
	// 					                var percentComplete = evt.loaded / evt.total;
	// 					                //Do something with upload progress here
	// 					                $(form).find(".progress-bar").css({"width":(percentComplete*100)+"%"});
	// 					            }
	// 					       }, false);

	// 					       return xhr;
	// 					    },
	// 						url: game.base_url+"upload.php",
	// 						type: "POST",           // Type of request to be send, called as method
	// 						data: formData, 		// Data sent to server, a set of key/value pairs (i.e. form fields and values)
	// 						contentType: false,     // The content type used when sending data to the server.
	// 						cache: false,           // To unable request pages to be cached
	// 						processData:false,      // To send DOMDocument or non processed data file it is set to false
	// 						dataType: 'json',
	// 						success: function(data) {
	// 							if(data["status"] == "success"){
	// 								$(form).find(".loader_image").css({"display":"none"});
	// 								$(form).find("#progress").css({"display":"none"});
	// 								$(form).find(".upload_wrapper").css({"display":"none"});

	// 								$(form).find(".img_result img").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
	// 								var grade_by_id;
	// 								if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
	// 									grade_by_id = null;
	// 								}
	// 								else{
	// 									grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
	// 								}

	// 								var res = {
	// 									activityid:$this.ldata[$(form).attr("index")]["activityid"],
	// 									activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
	// 									activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
	// 									activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
	// 									activity_response:game.base_url+data["message"],
	// 									grade:-1,
	// 									pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
	// 									grade_type:$this.ldata[$(form).attr("index")]["grade_type"],
	// 									grade_by_id:grade_by_id,
	// 									reviewtype:2
	// 								};

	// 								$this.sc_data[$(form).attr("index")] = res;
	// 								console.log($this.sc_data);

	// 								game.scorm_helper.setAnsData("game1",$this.sc_data);
	// 							}
	// 						}
	// 					});	
	// 				}catch(e){
	// 					alert(e);
	// 				}



	// 		    },
	// 		    error(e) {
	// 		      console.log(e.message);
	// 		    },
	// 		  });
	// 		});
	// 	}
	// 	if($this.sc_data[$this.count] !== void 0 && $this.sc_data[$this.count]!=undefined && $this.sc_data[$this.count]!=null){
	// 		if($this.sc_data[$this.count]["review_by"] == "buddy"){
	// 			if($this.sc_data[$this.count]["status"] == "accepted"){
	// 				$(clone).find(".review_wrap.buddy").addClass("accepted");
	// 			}
	// 			else{
	// 				$(clone).find(".review_wrap.buddy").addClass("rejected");
	// 			}
	// 		}
	// 		else if($this.sc_data[$this.count]["review_by"] == "atasan"){
	// 			if($this.sc_data[$this.count]["status"] == "accepted"){
	// 				$(clone).find(".review_wrap.atasan").addClass("accepted");
	// 			}
	// 			else{
	// 				$(clone).find(".review_wrap.atasan").addClass("rejected");
	// 			}
	// 		}
	// 	}

	// 	$this.count = parseInt($this.count)+1;
	// 	if($this.count<challange.length){
	// 		$this.loadContent();
	// 	}
	// 	else{
	// 		$this.setTrigger();
	// 	}
	// 	$(".total_score").html($this.total_score);
	// },'html');

	// $("#content").attr("class","bg-white");

    // clone
    var clone_item  = $(".list-group-item").first().clone();
    // var clone_modal = $(".owl-carousel2 #item_modal_1").first().clone();
    // console.log(clone_modal);
    // var clone_btn = $(".dynamic_button a").first().clone();
    // kosongkan
    // $(".list-group-item").html("");
    // $(clone_item).find(".dynamic_button").html("");
    // set ava image
    if(data[0]["image"]){
        $(".ava img").attr("src","assets/images/"+data[0]["image"]);
    }

    console.log(data);
    var arrChallenge = $this.arrChallenge;
    console.log(arrChallenge);

  	for (var i = 0; i < data.length; i++) {
  		console.log(data[i]['label_2']);
  		$('.desc_challenge').html(data[i]['label_2']);
   //      var clone = $(clone_item).clone();
   //      // var clone2 = $(clone_modal).clone();
      
   //      var number = i+1;
   //      var id_file = "files_"+number;  
   //      // var start = $this.challenge * 2 - 1;
   //      // var interval =(number * 2 - 2);
   //      // var activityid = start + interval;
   //      var activityid = data[i]["activityid"];


   //      $(clone).find(".quiz-number").html("<strong>"+number+"</strong>");
   //      $(clone).find(".quiz-dots").html("");
   //      $(clone).find(".fileToUpload").addClass("fileToUpload_"+number);
   //      $(clone).find(".fileToUpload").attr("id",id_file);
   //      $(clone).find(".thumb_profile").attr("id", "thumb_profile-"+number);
   //      $(clone).find(".thumb_profile .close").attr("id", "close-"+number);
   //      $(clone).find(".textarea").addClass("textarea_"+number);
   //      $(clone).find(".upload_wrapper").attr("id", "upload_wrapper-"+number);
   //      $(clone).find(".input_wrapper").attr("id", "input_wrapper-"+number);
   //      $(clone).find(".quiz-wrapper").attr("id", "quiz-wrapper-"+number);
   //      $(clone).find(".img_result").attr("id", "img_result-"+number);
   //      $(clone).find(".textstatus").attr("id", "textstatus-"+number);
   //      $(clone).find(".activityid").attr("id", "activityid-"+activityid);

        
   //      for (var j = 0; j < data.length; j++) {
   //          if(j  < i){
   //              $(clone).find(".quiz-dots").append("<span class='dots complete'>");
   //          }else if(j  == i){
   //              $(clone).find(".quiz-dots").append("<span class='dots active'>");
   //          }else{
   //              $(clone).find(".quiz-dots").append("<span class='dots'>");
   //          }
   //      }

   //      if(arrChallenge.length > 0){
   //          for(var k = 0; k < arrChallenge.length; k++){
   //              console.log(arrChallenge[k]["activityid"]+" - "+activityid+" - "+arrChallenge[k]["grade"]);
   //              if(arrChallenge[k]["activityid"] == activityid){
   //                  var img_src = game.base_url+"img_upload/"+game.username+"/"+game.module_id+"/"+arrChallenge[k]["activityid"]+".jpg?123";
   //                  // var img_src = arrChallenge[k]["activity_response"];
   //                  var answer = arrChallenge[k]["activity_response"];
   //                  console.log(img_src);
   //                  console.log(answer);
   //                  console.log("number: "+number);

   //                  if(arrChallenge[k]["grade"] == 100){ //accept grade
   //                      $(clone).find("#upload_wrapper-"+number).hide();
   //                      $(clone).find("#thumb_profile-"+number).show();
   //                      $(clone).find("#close-"+number).hide();
   //                      $(clone).find(".textarea_"+number).attr("disabled", true);
   //                      $(clone).find("#textstatus-"+number).text("accepted");

   //                      if(typeof arrChallenge[k+1] != "undefined"){
   //                          console.log(arrChallenge[k+1]);
   //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
   //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
   //                          }
   //                      }

   //                      if(typeof arrChallenge[k] != "undefined"){
   //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
   //                      }
   //                  }

   //                  if(arrChallenge[k]["grade"] == 0){ //reject grade
   //                      $(clone).find("#upload_wrapper-"+number).hide();
   //                      $(clone).find("#thumb_profile-"+number).show();
   //                      $(clone).find("#textstatus-"+number).text("rejected");
   //                      $(clone).find("#close-"+number).hide();
   //                      $(clone).find(".textarea_"+number).attr("disabled", true);

   //                      if(typeof arrChallenge[k+1] != "undefined"){
   //                          console.log(arrChallenge[k+1]);
   //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
   //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
   //                          }
   //                      }

   //                      if(typeof arrChallenge[k] != "undefined"){
   //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
   //                      }
   //                  }

   //                  if(arrChallenge[k]["grade"] == -1){ //reject grade
   //                      $(clone).find("#upload_wrapper-"+number).hide();
   //                      console.log("#thumb_profile-"+number);
   //                      $(clone).find("#thumb_profile-"+number).show();
   //                      $(clone).find("#textstatus-"+number).text("review");
   //                      $(clone).find("#close-"+number).hide();
   //                      $(clone).find(".textarea_"+number).attr("disabled", true);

   //                      console.log(arrChallenge[k+1]);
   //                      if(typeof arrChallenge[k+1] != "undefined"){
   //                          if(arrChallenge[k+1]["activityid"] % 2 == 0){
   //                              $(clone).find(".textarea_"+number).val(arrChallenge[k+1]["activity_response"]);
   //                          }
   //                      }

   //                      if(typeof arrChallenge[k] != "undefined"){
   //                          $(clone).find("#img_result-"+number+" img").attr("src",img_src);
   //                      }
   //                  }
   //              }
   //          }
   //      }
        
   //      if(data[i]["image2"]!=undefined){
   //          $(clone).find(".dynamic_img").last().attr("src","assets/images/"+data[i]["image2"]);
   //      }

   //      if(data[i]["image"]){
   //          if(data[i]["image"]!="false"){
   //              $(clone).find(".video_content").remove();
   //              $(clone).attr("data-avatar",data[i]["image"]);
   //              $(clone).find(".dynamic_img").first().attr("src","assets/images/"+data[i]["image"]);
   //          }else{
   //              $(clone).find(".video_content").remove();
   //              $(clone).find(".image").remove();
   //              $(clone).find(".caption").css("height","100%");
   //          }
   //      }
   //      else{
   //          $(clone).find(".dynamic_cover").attr("src","assets/images/"+data[i]["cover_video"]);
   //          $(clone).addClass("video_wrapper");
   //          $(clone).find(".img_wrapper span").css({"vertical-align":"middle"});
   //          $(clone).find(".dynamic_img").first().hide();
   //          $("video source").attr('src',"assets/video/"+data[i]["video"]);
   //          $("video")[0].load();

   //          $(clone).find(".video_content").click(function(e){
   //              if(!$(".modal-video").hasClass("open")){
   //                  $(".modal-video").addClass("open");
   //                  $("video")[0].play();
   //              }
   //          });

   //          $(".modal-video .btn-close").click(function(e){
   //              $(".modal-video").removeClass("open");
   //              $("video")[0].pause();
   //          });
            
   //      }

   //      if($this.list_ans.length > 0){

   //      }else{
   //          if(data[i]["question"] != undefined){
   //              $(clone).find(".textarea_"+number).attr("placeholder",data[i]["question"]);
   //          }
   //      }
     
   //      if(data[i]["text"] == undefined){
   //          $(clone).find(".text-box").hide();
   //      }else{
   //          //set text in json file key and class dynamic_text
   //          // console.log(clone);
   //          // $(clone).find(".dynamic_text").html(data[i]["text"]);

   //          if(data[i]["text"].indexOf("[first name]") != -1){
   //              var txt_name = data[i]["text"];
   //              var name = game.scorm_helper.getName();
   //              var firstname = name.split(", ");
   //              var real_name = txt_name.replace("[first name]","<span style='color:blue;'>"+firstname[1]+"</span>");
   //              $(clone).find(".dynamic_text").html(real_name);
   //          }else{
   //              $(clone).find(".dynamic_text").html(data[i]["text"]);
   //          }
   //      }

   //      if(data[i]["label"]){
   //          $(clone).find(".quiz-label").html(data[i]["label"]);
   //      }
   //      else{
   //          $(clone).find(".quiz-label").remove();
   //      }

   //      console.log(clone);
   //      $(".owl-carousel").append(clone);
   //      // $(".owl-carousel2").append('test');

    }
};

review.prototype.setTrigger = function() {
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
review.prototype.create_page_review = function() {
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

review.prototype.remove_item = function(e) {
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