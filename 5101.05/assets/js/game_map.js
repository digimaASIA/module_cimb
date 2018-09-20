var gameMap = function(){


}

gameMap.prototype.init = function() {
	console.log("init gameMap");
	var $this = this;
	$this.image_path = game.image_path;
	console.log(game.game_data);
	$this.game_data = game.game_data;
	console.log($this.game_data);

	// $this.category_game = game.getCategoryGame();
	$this.category_game = $this.game_data['category_game'];

	//get curr challenge
	$this.curr_challenge = 1; //default challenge
	var interval = $this.setCurrSoal();
	(interval >= game.total_soal ? interval = (game.total_soal - 1) : '');
	console.log(interval);
	$this.curr_challenge += interval;
	console.log('curr_challenge: '+$this.curr_challenge);

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
		$.get("config/quiz_review_"+$this.category_game+".json",function(res){
			console.log(res);
			//data quiz
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

gameMap.prototype.mulai_game = function(){
	var $this = this;
	$.post(game.base_url+"get_challenge_review.php",{"cmid":game.module_id,"username":game.username},function(e2){
		$(".loader_image_index").hide();
		console.log(e2);
		$this.last_challange = e2;
		if($this.last_challange.length > 0){
			$this.last_challange.sort(function(a, b) {
	            return a.activityid - b.activityid;
	        });
	        console.log($this.last_challange);
	        var ldata2 = $this.last_challange;

			for (var i = 0; i < ldata2.length; i++) {
				//get data from database
				var attemp_prev = ldata2[i]["attemp"];
				var category_game_prev = ldata2[i]["category_game"];
				(attemp_prev == 0 ? attemp_prev = 1 : '');
				(category_game_prev == null ? category_game_prev = 'sales' : '');
				console.log(attemp_prev+' - '+$this.attemp);
			    if(attemp_prev < $this.attemp){
			        $this.newAttemp = true;
			        game.newAttemp = true;
			        break;
			    }else{
			    	console.log(category_game_prev+' - '+$this.category_game);
			    	//attemp same, but category game different
			    	if(category_game_prev != $this.category_game){
			    		$this.newAttemp = true;
			    		game.newAttemp = true;
			    		break;
			    	}
			    }
			}
			console.log($this.newAttemp);
	        //append html content
			$this.appendHtml();
		}
    },'json')
	.fail(function(e2) {
		$(".loader_image_index").hide();
		console.log(e2);
		alert("Cannot connect to server !");
	});
}

gameMap.prototype.appendHtml = function() {
	var $this = this;
	var clone = $(".wrap").clone();
	$(".wrap").text("");
	console.log($this);
	var data = $this.ldataMap
	console.log(data);

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
					console.log($this.curr_challenge+'-'+challenge);
					if($this.curr_challenge >= challenge){
						if($this.curr_challenge == challenge){
							console.log('here');
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
	//set total soal
	game.total_soal = total_soal;
	//count current score and append
	$this.curr_score = game.score;
	$(clone).find(".curr_score").html($this.curr_score);
	$(clone).find(".total_score").html('/'+game.max_score);
	$('.wrap').append(clone);
	// $this.createSlider();

	//event click soal
	const curr_challenge = $this.curr_challenge;
	$('.dynamic_img').click(function(e){
		var id = e.currentTarget.id;
		id = id.split('-');
		console.log(id[1]+'-'+curr_challenge);
		game.current_challenge = id[1];
		if(id[1] <= curr_challenge){
			game.setSlide(4);
		}
	});

	$(".img-tutorial").click(function(e){
	// 	// $this.createModalSlider();
        game.audio.audioButton.play();
 //        //open modal
        $("#tutorial").modal("show");

   		$('#ulasan').slick({
   		    dots: true,
   	       	infinite: false,
   
        });
     
    	$("#tutorial .start-game").click(function(e){
    		$("#tutorial").modal("hide");
     	});

    });

    /*call count score function*/
    $this.countScoreResult();
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

	//get perkiraan score dari score sekarang hingga score akhit, diambil jika menang terus atau score 5
	console.log('$this.curr_score: '+$this.curr_score+' sisa_challenge: '+sisa_challenge+' $this.score_per_soal: '+$this.score_per_soal);
	var perkiraan_score_akhir = $this.curr_score + (sisa_challenge * $this.score_per_soal);
	// var perkiraan_score_akhir = 74;
	console.log('perkiraan_score_akhir: '+perkiraan_score_akhir);
	console.log('$this.hasReview: '+$this.hasReview);

	if(perkiraan_score_akhir < game.min_score && $this.hasReview == true){
		game.openModal('modal_feedback');
	}else{
		console.log($this.curr_challenge+' - '+game.total_soal+' - '+$this.hasReview)
		if($this.curr_challenge == game.total_soal && $this.hasReview == true){
			if(game.min_score <= $this.curr_score){
				game.game_data['curr_score'] = $this.curr_score;
				game.setSlide(7);
			}
		}
	}	

	$('.close_feedback').click(function(){
		game.scorm_helper.setStatus('failed');
		var date = game.getDate2();
		console.log(new Date());
		// $this.game_data['start_date'] = date;
		$this.game_data = {};
		game.scorm_helper.setSingleData('game_data', undefined);
		//set new attemp
		var attemp = $this.attemp + 1;
		game.scorm_helper.setSingleData('attemp', attemp);
		game.closeModal('modal_feedback');
		//got to cover page
		game.setSlide(0);
	});
}

gameMap.prototype.setCurrScore = function(){
	console.log('setCurrScore');
	var $this = this;
	var total_score = 0;
	if($this.ldata.length > 0){
		for (var i = 0; i < $this.ldata.length; i++) {
			var data2 = $this.ldata[i]['data'];
			var curr_score_per_challenge = 0;
			if(data2.length > 0){
				var curr_score_per_sub_challenge = $this.score_per_soal / data2.length;
				var point = 0;
				for (var j = 0; j < data2.length; j++) {
					var curr_activityid = data2[j]['activityid'];
					if($this.last_challange.length > 0){
						var flagPoint = 0;
						for (var k = 0; k < $this.last_challange.length; k++) {
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
							// console.log($this.last_challange[k]);
							// console.log(challange_id);
							// console.log($this.curr_challenge);
							// console.log(curr_activityid);
							//check challenge id from json and database
							if($this.newAttemp == false && $this.ldata[i]['id'] == challange_id){
								if(activityid >= min && activityid <= max){
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
						if(flagPoint == 1){
							point += 1;
						}
					}
				}

				console.log('challange_id: '+$this.ldata[i]['id']);
				console.log('curr_score_per_sub_challenge: '+curr_score_per_sub_challenge+' point: '+point);
				var curr_score_per_challenge = curr_score_per_sub_challenge * point;
				console.log('total_score: '+total_score);
				total_score += curr_score_per_challenge;
				console.log('total_score: '+total_score);
			}
		}
	}
	console.log(total_score);
	return total_score;	
}

//set current soal by date
gameMap.prototype.setCurrSoal = function(){
	var $this = this;
	console.log($this.curr_challenge);
	var date = game.getDate2();
	var last_date = game.game_data['start_date'];
	var start = new Date(last_date);
	// var start = new Date('2018-09-13');
	console.log('date: '+date);
	var end = new Date(date);
	console.log(game.game_data);
	console.log('start: '+start);
	console.log('end: '+end);
	var interval = $.datediff(start,end);
	console.log(interval);
	return interval;
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