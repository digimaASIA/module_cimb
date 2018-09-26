var Tebak2 = function(){
	var $this = this;

	// CUSTOM SETTINGS
	$this.type = "page";
	$this.isRandom = false;
	$this.showNumbering = true;
	$this.isTimer = false;
	$this.startNumber = 1;
	$this.games = false;
}

Tebak2.prototype.init = function(current_settings) {
	var $this = this;
	
	// INITIALIZE
	$this.current_settings = current_settings;
	$this.isswipe = false;
	$this.isStartTime = false;
	$this.question_data = [];
	$this.curr_soal=0;
	$this.isAppend=0;
	$this.count_benar=0;
	$this.curr_soal=0;
	$this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

	
	// GET JSON
	$.get("config/setting_quiz_slide_"+$this.current_settings["slide"]+".json",function(e){
		
		// JIKA ADA SETTINGS DI JSON
		if(e["settings"]){
			$this.games = (e["settings"]["games"])?e["settings"]["games"]:$this.games;
			$this.type = (e["settings"]["type"])?e["settings"]["type"]:$this.type;
			$this.isRandom = (e["settings"]["isRandom"])?e["settings"]["isRandom"]:$this.isRandom;
			$this.showNumbering = (e["settings"]["showNumbering"])?true:false;
			$this.isTimer = (e["settings"]["duration"])?true:false;
			$this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;
			$this.startNumber = (e["settings"]["startNumber"])?e["settings"]["startNumber"]:$this.startNumber;
			if($this.type == "popup"){
				$this.popupType = (e["settings"]["popupType"])?e["settings"]["popupType"]:"order";
			}
			$this.totalQuestion = (e["settings"]["totalQuestion"])?e["settings"]["totalQuestion"]:e["list_question"].length;
		}
		$this.question_data = e["list_question"];

		// INITIALIZE GAME QUIZ TYPE
		if($this.type == "page" || $this.type == "slider"){
			$this.$clone = $(".slider-content").clone();
		}
		else if($this.type == "popup"){
			$this.$clone = $("#game_quiz_popup .game_quiz_popup").clone();
		}

		$this.$pilihan_clone = $($this.$clone).find(".pilihan").first().clone();
		$this.category_wrap = $($this.$clone).find(".category").first().clone();
		$this.select = $($this.$clone).find("select").first().clone();

		// INITIALIZE DRAG AND DROP
		$this.drop = $(".drop").first().clone();
		$this.drag = $(".drag").first().clone();
		$($this.drop).css({"display":"inline-block"});
		$($this.drag).css({"display":"inline-block"});
		$(".drop_wrapper").html("");
		$(".drag_wrapper").html("");

		// REMOVE ALL CONTENT
		$("#game_quiz_page").html("");
		$("#game_quiz_popup .modal-content").find("div").html("");

		$this.mulai_game();

	},'json');
	
};

Tebak2.prototype.mulai_game = function() {
	var $this = this;
	
	var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
	// jk pertama kali, maka isinya ldata = []
	/*
	console.log('ldata');
	console.log(ldata);
	console.log('ldata');
	*/
	game.temp = game.scorm_helper.getSingleData("temp");
	// jk pertama kali, maka isinya game.temp = undefined
	/* console.log('ldata');
	console.log($this.question_data.length);
	console.log('ldata');  */
	
	// game.temp = undefined
	// ldata["answer"]== undefined
	// $this.question_data.length = 3
	if(game.temp == 1 || 
	   ldata["answer"]== undefined || 
	   ldata["answer"]== null || 
	   (game.temp == 0 && ldata["answer"].length < $this.question_data.length)
	){
		// mungkin jika pertama kali, akan masuk di sini
		
		game.scorm_helper.setSingleData("temp",0);
		var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion(),ldata);
		
		// $this.current_settings["slide"] = 2
		// $this.getQuestion() = array 3 elemen
		// sdata = sekumpulan data LearningRecord
		$this.list_question = sdata["list_question"];
		$this.list_answer = sdata["answer"];
		$this.curr_soal = sdata["answer"].length;
		/* console.log('test');
		console.log($this.list_question);
		console.log('test');
		console.log('test2');
		console.log($this.list_answer);
		console.log('test2');
		console.log('test3');
		console.log($this.curr_soal);
		console.log('test3'); */
		// $this.list_question = array 3 element
		// $this.list_answer = array kosong
		// $this.curr_soal = 0
		
		/* console.log('test');
		console.log($this.type);
		console.log('test'); */
		// $this.type = popup
		if($this.type == "page" || $this.type == "slider"){
			$this.show_question();
		}else if($this.type == "popup"){
			
			//alert('kesini ya');
			$this.init_button();
		}

	}else{
		game.scorm_helper.setSingleData("temp",0);
		game.nextSlide();
	}
};

Tebak2.prototype.init_button = function() {
	var $this = this;
	var index = 0;

	// INITIAL TIME
	
	// jk pertama kali $this.isTimer = false
	if($this.isTimer){
		$this.countTime+=1;
		$(".timer .text_time").html($this.setTimer());
		$(".timer").show();
	}
	else{
		$(".timer").remove();
	}
	$this.startGameTimer();

	$this.temp_button = game.scorm_helper.getSingleData("temp_button");
	/* console.log('test');
	console.log($this.temp_button);
	console.log('test'); */
	// $this.temp_button = undefined
	if($this.temp_button == null || $this.temp_button == undefined){
		$this.temp_button = [];
	}
	/* console.log('test2');
	console.log($this.temp_button);
	console.log('test2'); */
	$this.show_question();
	
};

Tebak2.prototype.show_question = function() {
	var $this = this;
	var $clone;

	$clone = $this.$clone.first().clone();
	
	// get current soal
	var $current_soal = $this.question_data[$this.list_question[$this.curr_soal]];
	
	/* 
	console.log('tes2');
	console.log($this.list_question[$this.curr_soal]);
	console.log('tes2');
	
	console.log('tes3');
	console.log($current_soal);
	console.log('tes3'); */
	// $this.curr_soal = 0
	// $this.list_question[$this.curr_soal] = 0
	// $current_soal = array data soal yg akan di tampilkan
	
	// $this.showNumbering = true
	if(!$this.showNumbering){
		$clone.find(".number_question").hide();
	}
	
	
	// parseInt($this.startNumber-1)=0
	// parseInt($this.curr_soal+1)=1
	// parseInt($this.list_question.length)=2
	// .curr_soal = 1
	// .total_soal = 3
	/* console.log('tes1');
	console.log(parseInt($this.startNumber-1));
	console.log('tes1');
	console.log('tes2');
	console.log(parseInt($this.curr_soal+1));
	console.log('tes2');
	console.log('tes3');
	console.log(parseInt($this.list_question.length));
	console.log('tes3'); */
	
	// setting question numbering
	$clone.find(".curr_soal").html(parseInt($this.startNumber-1)+parseInt($this.curr_soal+1));
	$clone.find(".total_soal").html(($this.startNumber-1)+$this.list_question.length);
	
	// remove all content
	$clone.find(".pilihan_wrapper").html("");
	$clone.find(".category_wrapper").html("");
	
	/* console.log('tes1');
	console.log($current_soal["image"]);
	console.log('tes1'); */
	// $current_soal["image"] = undefined
	// if image is available -> setting image
	if($current_soal["image"]){
		$clone.find("#img_soal").show();
		$clone.find("#img_soal").attr("src","assets/image/game_quiz/list_img/"+$current_soal["image"]);
	}
	else{
		// tolong img_soal di hide
		$clone.find("#img_soal").hide();
	}
	
	/* console.log('tes1');
	console.log($current_soal["type"]);
	console.log('tes1');  */
	// $current_soal["type"] = dadseqcat
	$($clone).addClass($current_soal["type"]);
  
	if($current_soal["type"] == "mc"||
		$current_soal["type"] == "mmc"||
		$current_soal["type"] == "dadsequence"||
		$current_soal["type"] == "dadseqcat")
	{
		// setting question
		if($current_soal["question"]){
			$clone.find(".text_question").html($current_soal["question"]);
		}
		
		/* console.log('tes1');
		console.log($current_soal["pilihan"].length);
		console.log('tes1'); */
		// menghitung jumlah pilihan soal (a, b, c nya)
		// $current_soal["pilihan"].length ==> jika soal ada a, b, c, d ==> maka ada 4
		// random pilihan
		var arr_temp = [];
		var arr_rand = [];
		// arr_temp adalah index untuk array pilihan jawaban
		for (var i = 0; i < $current_soal["pilihan"].length; i++) {
			arr_temp.push(i);
		}
		
		// console.log('tes2');
		// console.log(arr_temp);
		// console.log('tes2');
		
		 
		for (var i = 0; i < $current_soal["pilihan"].length; i++) {
			var rand = Math.floor((Math.random() * (arr_temp.length-1)));
			arr_rand.push(arr_temp[rand]);
			arr_temp.splice(rand, 1);
		}
		
		for (var i = 0; i < arr_rand.length; i++) {
			$app_pilihan = $this.$pilihan_clone.clone();
			$app_category = $this.category_wrap.clone();

			$app_pilihan.find(".txt_pilihan").html($current_soal["pilihan"][arr_rand[i]]["text"]);
			$app_pilihan.attr("index",$current_soal["pilihan"][arr_rand[i]]["index"]);
			$($app_pilihan).addClass($current_soal["type"]);
			$($app_pilihan).find(".bul_abjad").html($this.arr_alphabet[i]);
			
			// console.log('tes_'+i);
			// console.log($app_pilihan);
			// console.log('tes_'+i);
			
			$clone.find(".pilihan_wrapper").append($app_pilihan);
			
			if($this.question_data[$this.curr_soal]["type"] == "dadseqcat"){
				
				$($app_category).html($this.question_data[$this.curr_soal]["category"][i]);
				$clone.find(".category_wrapper").append($app_category);
				/* console.log('tes_'+i);
				console.log('a');
				console.log('tes_'+i); */
			}
			
		} 
		
		// console.log('tes2');
		// console.log(arr_rand.length);
		// console.log('tes2');
	
		// console.log('tes2');
		// console.log(arr_temp);
		// console.log('tes2');
	}else if($current_soal["type"] == "dad"){
		$this.initDad($clone);
	}else if($current_soal["type"] == "dpd"){
		$this.initDpD($clone);
	}
    
	// apalagi
	// console.log('tes1');
	// console.log($this.type);
	// console.log('tes1');
	if($this.type == "page" || $this.type == "slider"){
		$("#game_quiz_page").append($clone);
		$($clone).attr("id","slide_"+"_"+$this.curr_soal);
		$($clone).attr("curr_soal",$this.curr_soal);
	}
	else if($this.type == "popup"){
		// sampai di sini sudah bisa menampilkan json
		$("#game_quiz_popup .modal-content").find("div").first().append($clone);
		// console.log('tes2');
		// console.log($this.curr_soal);
		// console.log('tes2');
		
		$($clone).attr("id","slide_"+"_"+$this.curr_soal);
		$($clone).attr("curr_soal",$this.curr_soal);
		$("#game_quiz_popup").modal("show");
	}
    
	// $this.isAppend = 0
	if($this.isAppend == 0){
		$this.isAppend = 1;
		
		// $this.type = popup
		if($this.type != "popup"){
			// INITIAL TIME
			if($this.isTimer){
				$this.countTime+=1;
				$(".timer .text_time").html($this.setTimer());
			}
			else{
				$(".timer").remove();
			}
		}
		
		if($this.type == "page"){
			$this.setTutorial();
			$.getScript( "assets/js/jquery.mobile-1.4.5.min.js", function( data, textStatus, jqxhr ) {
				$this.settingPage($clone);
			});
		}
		else{
			if($this.type!="popup"){
				$this.startGameTimer();
			}
			
			// console.log('tes3');
			// console.log($clone);
			// console.log('tes3');
			$this.settingPage($clone);
		}
		
	}
	else{
		$this.settingPage($clone);
	}
	
	// ga kesini
	if($this.type == "slider"){
		$this.curr_soal+=1;
		if($this.curr_soal<$this.list_question.length){
			$this.show_question();	
		}else{
			$('#game_quiz_page').slick({
		        dots: true,
		        infinite: false,
		        speed: 500,
		        adaptiveHeight:true,
		        slidesToShow: 1,
        		slidesToScroll: 1
	      	});
		}
	}
	// ga kesini
	
	if($this.type == "popup"){
		// console.log('tes1');
		// console.log($this.curr_soal);
		// console.log('tes1');		
		$this.curr_soal+=1; // $this.curr_soal = 1
		
		// $this.curr_soal = 1
		// $this.list_question.length =3
		if($this.curr_soal<$this.list_question.length){
			$this.show_question();	
		}
		else{
			$('#game_quiz_popup .modal-content').find("div").first().slick({
		        dots: true,
		        infinite: false,
		        speed: 500,
		        adaptiveHeight:true,
		        slidesToShow: 1,
        		slidesToScroll: 1
	      	});
		}
	}
	
	if($this.isTimer && $this.type != "popup"){
		$(".timer").show();
	}
	
};

Tebak2.prototype.getQuestion = function() {
	var $this = this;
	var arr_quest = [];
	var arr_rand = [];
	var returnQuest = [];

	for (var i = 0; i < $this.question_data.length; i++) {
		arr_quest.push(i);
	}

	if($this.isRandom == true || ($this.type == "popup" && $this.popupType == "random")){
		do{
			var rand = Math.ceil(Math.random()*(arr_quest.length-1));
			arr_rand.push(arr_quest[rand]);
			arr_quest.splice(rand,1);
		}while(arr_quest.length>0);

		returnQuest = arr_rand;
	}
	else{
		returnQuest = arr_quest;
	}

	var start = returnQuest.length-(returnQuest.length-$this.totalQuestion);
	var end = returnQuest.length-$this.totalQuestion;
	returnQuest.splice(start,end);

	return returnQuest;
};

Tebak2.prototype.startGameTimer = function() {
	var $this = this;
	if(!$this.isStartTime){
		$this.isStartTime = true;
		if($this.isTimer){
			$this.time = setInterval(function() {
				if($this.countTime>0){
					$(".timer .text_time").html($this.setTimer());
				}
				else{
					clearInterval($this.time);
					$this.time = null;
					$(".timer .text_time").html("00:00");
					game.scorm_helper.setSingleData("temp",0);
					game.nextSlide();
				}
			},1000);
		}
	}
};

Tebak2.prototype.settingPage = function($clone) {
	var $this = this;
	// get current soal
	var $current_soal = $this.question_data[$this.list_question[$this.curr_soal]];

	if($this.type == "page"){
		// setting prev
		if($this.curr_soal>0){
			$($clone).attr("data-prev","#slide_"+"_"+(parseInt($this.curr_soal)-1));	
		}else{
			$($clone).attr("data-prev","");	
		}
		// setting next
		if(parseInt($this.curr_soal)+1<$this.question_data.length){
			$($clone).attr("data-next","#slide_"+"_"+(parseInt($this.curr_soal)+1));
		}
		else{
			$($clone).attr("data-next","#result");
		}

		if($this.curr_soal == 0){
			$.mobile.changePage( "#slide_"+"_"+$this.curr_soal, { transition: "none"} );
		}

		$($clone).swipeleft(function( event ) {
		    $this.next();  
		});

		$($clone).find(".next-soal").click(function(e){
			$this.next();
		});
	}

	if($current_soal["type"] == "dadsequence" || $current_soal["type"] == "dadseqcat"){
		$clone.find(".pilihan_wrapper").sortable();
	}
	else if($current_soal["type"] == "mc"){
		$clone.find(".btn-submit").hide();
		$clone.find(".pilihan").click(function(e){

			if(!$(this).hasClass("active")){
				$(this).addClass("active");	
			}
			else{
				$(this).removeClass("active");	
			}

			if($this.type != "slider"){
				$clone.find(".pilihan").off();
				if(!$this.games){
					$($clone).find(".next-soal").show();
					$this.cek_jawaban($clone,"mc");
				}else{
					game.nextSlide();
				}
			}
		});
	}
	else if($current_soal["type"] == "mmc"){
		$clone.find(".pilihan").click(function(e){
			if(!$(this).hasClass("active")){
				$(this).addClass("active");	
			}
			else{
				$(this).removeClass("active");	
			}
		});
	}
	else if($current_soal["type"] == "dad"){
		$(".drag").draggable({
			cursor: 'move',
			revert : function(event, ui) {
				if(!$this.isDrop){
					return true;
				}
				else{
					$(this).css({"top":"0","left":"0"});
				}
	        },
			drag: function( event, ui ) {
				$(".drop").css({"z-index":0});
				$(this).parent().css({"z-index":1});
				$this.isDrop = false;
				$this.selectedDrag = $(this);
			}
	    });

	    $('.drop').droppable({
		  drop: function( event, ui ) {
		  	$this.isDrop = true;
		  	if($(this).find(".drag").length>0){
		  		var target = $(this).find(".drag");
		  		$($clone).find(".drag_wrapper").append(target);
		  		$(this).append($this.selectedDrag);	
		  	}
		  	else{
		  		$(this).append($this.selectedDrag);	
		  	}
		  }
		});
	}

	if($this.type != "slider" && $this.type != "popup"){
		$($clone).find(".btn-submit").click(function(e){
			$(this).off();
			$(this).hide();
			if(!$this.games){
				if($current_soal["type"] == "dad"){
					$clone.find(".drag").draggable('disable');
				}
				else if($current_soal["type"] == "dadsequence" || $current_soal["type"] == "dadseqcat"){
					$clone.find(".pilihan_wrapper").sortable("disable");
				}

				$clone.find(".pilihan").off();
				$($clone).find(".next-soal").show();
				$this.cek_jawaban($clone,$current_soal["type"]);

				if($current_soal["type"] == "dadsequence" || $current_soal["type"] == "dadseqcat"){
					// kasi jawaban benarnya
					$clone.find(".pilihan_wrapper").html("");
					for (var i = 0; i < $current_soal["jawaban"].length; i++) {
						$app_pilihan = $this.$pilihan_clone.clone();
						$app_pilihan.find(".txt_pilihan").html($current_soal["pilihan"][$current_soal["jawaban"][i]]["text"]);
						$clone.find(".pilihan_wrapper").append($app_pilihan);
					}
				}
			}else{
				game.nextSlide();
			}
		});
	}
	else{
		if($this.curr_soal<$this.list_question.length-1){
			$($clone).find(".btn-submit").remove();
		}
		else{
			$($clone).find(".btn-submit").show();
			$($clone).find(".btn-submit").click(function(e){
				$(this).off();
				if(!$this.games){
					$this.cek_jawaban_slider();
				}else{
					game.nextSlide();
				}
			});
		}
	}
	
	$($clone).css({'visibility':'visible'});
};

Tebak2.prototype.cek_jawaban = function($clone,$type) {
	var $this = this;
	var $flag=0;
	var count = 0;
	$this.isswipe = true;
	// get current soal
	var $current_soal = $this.question_data[$this.list_question[$this.curr_soal]];

	// CEK JAWABAN BERDASARKAN TIPE NYA
	if($type == "mc"|| $type == "mmc"|| $type == "dadsequence" || $current_soal["type"] == "dadseqcat")
	{
		$($clone).find(".pilihan").each(function(index){
			if($type == "dadsequence" || $type == "dadseqcat"){
				if($(this).attr("index") != $current_soal["jawaban"][index]){
					$flag=1;
				}
			}
			else{
				if($(this).hasClass("active")){
					$(this).removeClass("active");
					var $cek=0;
					for (var i = 0; i < $current_soal["jawaban"].length; i++) {
						if($current_soal["jawaban"][i] == $(this).attr("index")){
							$cek=1;
							break;
						}
					}

					if($cek == 0){
						$flag=1;
						$(this).addClass("wrong");
					}
					else{
						count++;
						$(this).addClass("right");
					}
				}
			}
		});
	}
	else if($type == "dad"){
		$($clone).find(".drop").each(function(e){
			if($(this).attr("index") != $(this).find(".drag").attr("index")){
				$flag=1;
			}
		});

		if($flag == 1){
			$(".ui-page-active .drag").each(function(e){
				$($clone).find(".drag_wrapper").append($(this));
			});

			$($clone).find(".drop").each(function(e){
				var $that = $(this);
				$(".drag").each(function(f){
					if($that.attr("index") == $(this).attr("index")){
						$($that).html($(this));
					}
				});
			});
		}
		else{
			$($clone).find(".drop").each(function(e){
				$(this).find(".drag").addClass("right");
			});
		}
	}
	else if($type == "dpd"){
		$($clone).find("select").each(function(e){
			if($(this).val().toLowerCase() != $current_soal["jawaban"][parseInt($(this).attr("index"))].toLowerCase()){
				$flag = 1;
			}
		});

		$("select").each(function(e){
			$(this).attr("disabled","disabled");
			$(this).find("option").each(function(el){
				for (var i = 0; i < $current_soal["jawaban"].length; i++) {
					if($(this).html().toLowerCase() == $current_soal["jawaban"][i].toLowerCase()){
						$(this).attr("selected","selected");
					}
				}
			});
		});
	}

	if($type == "mc" || $type == "mmc"){
		if(count != $current_soal["jawaban"].length){
			$flag=1;
			$($clone).find(".pilihan").each(function(e){
				for (var i = 0; i < $current_soal["jawaban"].length; i++) {
					if($current_soal["jawaban"][i] == $(this).attr("index")){
						$(this).addClass("right");
						$($clone).find(".num_pilihan.point-"+$(this).attr("index")).addClass("right");
					}
				}
			});
		}
	}
	// END

	var arr_response = [];
	for (var i = 0; i < $this.list_question.length; i++) {
		arr_response.push($this.question_data[$this.list_question[i]]["question"]);
	}

	if($flag==0){
		$(".modal_feedback").addClass("benar");
		$(".game_quiz_popup_pilihan[index='"+$this.curr_soal+"']").addClass("right");
		$this.list_answer[$this.curr_soal]=1;
		game.audio.audioBenar.play();
		$(".alert").addClass("benar");
	}
	else{
		$(".modal_feedback").addClass("salah");
		$(".game_quiz_popup_pilihan[index='"+$this.curr_soal+"']").addClass("wrong");
		$this.list_answer[$this.curr_soal]=0;
		game.audio.audioSalah.play();
		$(".alert").addClass("salah");
	}
	game.scorm_helper.setAnswer($this.list_answer,arr_response);

	$(".game_quiz_popup_pilihan").off();
	$(".game_quiz_popup_pilihan[index='"+$this.curr_soal+"']").addClass("done");

	if($this.popupType == "order"){
		$this.temp_button.push($this.curr_soal);	
	}

	// SHOW FEEDBACK JIKA TERDAPAT FEEDBACK
	var isFeedback = false;
	if($current_soal["feedback"]){
		isFeedback = true;
		$("#modal_feedback .description p").html($current_soal["feedback"]);
	}
	else if($current_soal["feedback_benar"] && $current_soal["feedback_salah"]){
		isFeedback = true;
		if($flag == 0){
			$("#modal_feedback .description p").html($current_soal["feedback_benar"]);
		}
		else{
			
			$("#modal_feedback .description p").html($current_soal["feedback_salah"]);
		}
	}

	if(isFeedback){
		$("#modal_feedback").modal("show");
		$("#modal_feedback .close_feedback").click(function(e){
			$("#modal_feedback").modal("hide");
			if($this.cekComplete()){
				game.scorm_helper.setSingleData("temp",0);
				game.nextSlide();
			}
		});
	}
	// END

	setTimeout(function() {
		$($this.curr_card).hide();
		$(".alert").removeClass("salah");
		$(".alert").removeClass("benar");

		if(!$this.cekComplete()){
			if($this.type == "page"){
				if($this.curr_soal<$this.list_question.length-1){
					$this.curr_soal = $this.curr_soal+1;
					$this.show_question();
				}
			}
			else if($this.type == "popup"){
				$(".game_quiz_popup_pilihan").off();
				$this.init_button();
			}
		}
		else{
			if(!isFeedback && $this.type != "page"){
				game.scorm_helper.setSingleData("temp",0);
				game.nextSlide();
			}
		}
		$("#game_quiz_popup").modal("hide");

	},800);

	if($this.type == "page"){
		$(".button_next_page").addClass("active");
	}
};