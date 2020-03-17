var StageBootstrap = function(){
	
}

StageBootstrap.prototype.init = function(current_settings) {
	var $this = this

	//set setting global
	$this.setting_global = new Setting();

	$this.current_settings = current_settings;
	$this.gamedata = game.scorm_helper.getSingleData('game_data');
	$this.game_data = game.game_data;
	$this.total_soal = 0;
	$this.total_step = 0;
	/*$this.gamedata = [];
	$this.gamedata["complete_stage"] = [1,3];
	$this.gamedata["failed_stage"] = [2];*/
	$this.stage = $(".stage").first().clone();
	$(".stage_wrapper").html("");

	/*Function set timer global*/
	if(game.time_global == true){
		if(game.start_timer_global == 0){
			game.startTimerGlobal();
		}
	}else{
	  $(".timer").hide();
	}
	/*End function set timer global*/


	$.get("config/setting_stage_slide_"+$this.current_settings["slide"]+"_list.json",function(e){
		$this.background = e["background"];
		$this.itemsrow = e["items_row"];
		$this.items = e["items"];
		$this.button = e["button"];

		//count step
		$this.step_data = e["items"];
		$this.total_step = $this.step_data.length;
        game.total_step = $this.total_step;
        $this.tutorial_data = e["list_tutorial"];


		// $this.get_total_soal();
		if($this.game_data["mode_staging"] == undefined){
	        $("#popupAlertVideo .description p").html("Pilih mode staging");
	        $("#popupAlertVideo .btn-standard--yes .l-table-middle__cell").html("Berurutan");
	        $("#popupAlertVideo .btn-standard--no .l-table-middle__cell").html("Random");
	        $("#popupAlertVideo").modal({backdrop: 'static',keyboard: true,show: true});
			$("#popupAlertVideo .btn-standard--yes").click(function(e){
			    $(this).off();
			    $this.game_data["mode_staging"] = "berurutan";
			    $("#popupAlertVideo").modal("hide");
			    game.audio.audioButton.play();
			    // game.nextSlide();
			    $("#popupAlertVideo").modal("hide");
			    $this.game_data["unlock_all_stage"] = false; 
			    $this.get_total_soal();
			});
			$("#popupAlertVideo .btn-standard--no").click(function(e){
				$(this).off();
				$this.game_data["mode_staging"] = "random";
				$("#popupAlertVideo .popupalert-yes").off();
				game.audio.audioButton.play();
			    $("#popupAlertVideo").modal("hide");
			    $this.game_data["unlock_all_stage"] = true; 
			    $this.get_total_soal();
			});
		}else{
			$this.get_total_soal();
		}
	},"json");
};

  /*Function get total soal from all stage*/
StageBootstrap.prototype.get_total_soal = function() {
    console.log("get_total_soal");
    var $this = this;
    $this.total_soal = game.total_soal;
    console.log($this.total_soal);

    if($this.total_soal == 0){
        for (var i = 0; i < $this.total_step; i++) {
          // console.log(i);
          let no = $this.current_settings["slide"] + (i+1);
          const no_2 = i;
          // console.log("config/setting_quiz_slide_"+no+".json");
          $.get("config/setting_quiz_slide_"+no+".json",function(e3){
              // console.log(e3);
              // console.log(game.scorm_helper.lmsConnected);
              // e3 = (game.scorm_helper.lmsConnected == true ? JSON.parse(e3) : e3);
              $this.total_soal += e3["list_question"].length;
              // console.log($this.total_soal);
              game.total_soal = $this.total_soal;

              // console.log($this.total_soal);
              // console.log(($this.total_step-1));
              // console.log(no_2);
              // console.log(($this.total_step-1) == no_2);
              if(($this.total_step-1) == no_2){
              		if($this.game_data["unlock_all_stage"] == true){
              			$this.setData_2();
              		}else{
              			$this.setData();
              		}
			        // game.startTimerGlobal();
					game.setProgresBar();
              }
          },'json');
        }
    }else{
        // $this.setData();
        $this.setData_2();
        // game.startTimerGlobal();
		game.setProgresBar();
    }
};

StageBootstrap.prototype.setData = function() {
	var $this = this;
	console.log("total_soal: "+game.total_soal);
	var $col = 12/$this.itemsrow;
	var $mod = $this.items.length%2;

	//set game_data
	$this.game_data["total_stage"] = $this.items.length;

	var arr_complete_stage = ($this.game_data["complete_stage"] != undefined ? $this.game_data["complete_stage"] : []);
	var arr_failed_stage = ($this.game_data["failed_stage"] != undefined ? $this.game_data["failed_stage"] : []);

	$(".header").show();
	if($this.gamedata == undefined){
		$this.curr_step = 0;
		$this.life = game.life_max;
	}else{
		$this.curr_step = $this.gamedata["curr_step"] != undefined ? $this.gamedata["curr_step"] : 0;
		$this.life = ($this.gamedata["last_life"] != undefined ? $this.gamedata["last_life"] : game.life_max);
	}

	if(game.mode_life == true){
		$this.setLife();
	}

	$(".slider-content").css($this.background);
	$(".button_wrapper").find(".button_finish").html($this.button["text"]);
	$(".button_wrapper").find(".button_finish").css($this.button["css"]);

	console.log((arr_complete_stage.length + arr_failed_stage.length));
	console.log($this.game_data["total_stage"]);

	$(".button_finish").click(function(e){
		if(arr_complete_stage.length == $this.game_data["total_stage"]){
			$(this).off();
			game.scorm_helper.setSlide($this.button["gotoslide"]-1);
			game.setSlide($this.setting_global["slide_result"]);
		}else{
			$(".notif_red").show();
		}
	});

	if(arr_complete_stage.length == $this.game_data["total_stage"]){
		$(".button_finish").css({"opacity":"unset"});
	}

	console.log($this.game_data);
	for(var i = 0; i < $this.items.length; i++){
		var $clone = $this.stage.clone();
		$($clone).attr("index",i+1);
		$($clone).attr("name",$this.items[i]);
		$($clone).addClass("col-xs-"+$col);
		if(i == $this.items.length-1 && $mod != 0 && $this.itemsrow > 1){
			$($clone).addClass("centered");
		}
		$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["default"]);
		if(($this.curr_step+1) >= $($clone).attr("index")){
			//jika (curr_step+1) tidak ditemukan di array complete_stage dan failed_stage
			if($this.game_data["complete_stage"] != undefined && $this.game_data["failed_stage"]){
				if($this.game_data["complete_stage"].indexOf((i+1)) == -1 && $this.game_data["failed_stage"].indexOf((i+1)) == -1){
					$($clone).addClass("active");
				}
			}else{
				// if(($this.curr_step+1) == $($clone).attr("index")){
					$($clone).addClass("active");
				// }	
			}
		}
		if($this.game_data != undefined){
			// console.log($this.game_data);

			if($this.game_data["complete_stage"] != undefined && $this.game_data["failed_stage"] != undefined){
				var complete = $this.game_data["complete_stage"];
				var failed = $this.game_data["failed_stage"];
				for(var j = 0; j < complete.length; j++){
					if(complete[j] == $($clone).attr("index")){
						$($clone).addClass("complete");

						// if($($clone).hasClass("active")){
						// 	$($clone).removeClass("active")
						// }
					}
				}
				for(var j = 0; j < failed.length; j++){
					if(failed[j] == $($clone).attr("index")){
						$($clone).addClass("failed");

						// if($($clone).hasClass("active")){
						// 	$($clone).removeClass("active")
						// }
					}
				}
				if(complete.length == $this.items.length){
					$(".button_wrapper").show();
					$(".button_wrapper .button_finish").removeClass("disabled");
				}else{
					// $(".button_wrapper").hide();
				}
			}
		}
		if($($clone).hasClass("complete")){
			$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["complete"]);
		}else if($($clone).hasClass("failed")){
			$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["failed"]);
			$($clone).click(function(e){
				$(this).off();
				let index = $(this).attr("index");

				//set game data
				$this.game_data["selected_stage"] = parseInt(index);
				game.game_data = $this.game_data;
				game.scorm_helper.setSingleData("game_data",$this.game_data);
				// if($this.game_data["slide"] != undefined){
					let a = game.slide_game_map + parseInt(index);

					game.setSlide(a);
				// }else{
				//   game.nextSlide();
				// }
			});
		}else if($($clone).hasClass("active")){
			$($clone).click(function(e){
				$(this).off();
				let index = $(this).attr("index");

				//set game data
				$this.game_data["selected_stage"] = parseInt(index);
				game.game_data = $this.game_data;
				game.scorm_helper.setSingleData("game_data",$this.game_data);
				console.log($this.game_data);
				// if($this.game_data["slide"] != undefined){
					let a = game.slide_game_map + parseInt(index);
					
					console.log(a);
					game.setSlide(a);
				// }else{
				//   game.nextSlide();
				// }
			});
		}else{
			//validasi step yang sekarang apabila => maka terbuka
			if($this.curr_step >= i){

			}else{
				$($clone).addClass("lock");
				$($clone).append("<img class='padlock' src='assets/image/game_map_stage/gembok.png'>");
			}
		}
		$(".stage_wrapper").append($clone);
	}
};

//function setData_2 set all stage unlock
StageBootstrap.prototype.setData_2 = function() {
	console.log("setData_2");
	var $this = this;
	console.log("total_soal: "+game.total_soal);
	var $col = 12/$this.itemsrow;
	var $mod = $this.items.length%2;

	//set game_data
	$this.game_data["total_stage"] = $this.items.length;

	var arr_complete_stage = ($this.game_data["complete_stage"] != undefined ? $this.game_data["complete_stage"] : []);
	var arr_failed_stage = ($this.game_data["failed_stage"] != undefined ? $this.game_data["failed_stage"] : []);

	$(".header").hide();
	if($this.gamedata == undefined){
		$this.curr_step = 0;
		$this.life = game.life_max;
	}else{
		$this.curr_step = $this.gamedata["curr_step"] != undefined ? $this.gamedata["curr_step"] : 0;
		$this.life = ($this.gamedata["last_life"] != undefined ? $this.gamedata["last_life"] : game.life_max);
	}

	if(game.mode_life == true){
		$this.setLife();
	}

	$(".slider-content").css($this.background);
	$(".button_wrapper").find(".button_finish").html($this.button["text"]);
	$(".button_wrapper").find(".button_finish").css($this.button["css"]);

	console.log((arr_complete_stage.length + arr_failed_stage.length));
	console.log($this.game_data["total_stage"]);

	$(".button_finish").click(function(e){
		if(arr_complete_stage.length == $this.game_data["total_stage"]){
			$(this).off();
			game.scorm_helper.setSlide($this.button["gotoslide"]-1);
			game.setSlide($this.setting_global["slide_result"]);
		}else{
			$(".notif_red").show();
		}
	});

	if(arr_complete_stage.length == $this.game_data["total_stage"]){
		$(".button_finish").css({"opacity":"unset"});
	}

	console.log($this.game_data);
	for(var i = 0; i < $this.items.length; i++){
		var $clone = $this.stage.clone();
		$($clone).attr("index",i+1);
		$($clone).attr("name",$this.items[i]);
		$($clone).addClass("col-xs-"+$col);
		if(i == $this.items.length-1 && $mod != 0 && $this.itemsrow > 1){
			$($clone).addClass("centered");
		}
		$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["default"]);
		if(($this.curr_step+1) >= $($clone).attr("index")){
			//jika (curr_step+1) tidak ditemukan di array complete_stage dan failed_stage
			if($this.game_data["complete_stage"] != undefined && $this.game_data["failed_stage"]){
				if($this.game_data["complete_stage"].indexOf((i+1)) == -1 && $this.game_data["failed_stage"].indexOf((i+1)) == -1){
					$($clone).addClass("active");
				}
			}else{
				// if(($this.curr_step+1) == $($clone).attr("index")){
					$($clone).addClass("active");
				// }	
			}
		}
		if($this.game_data != undefined){
			// console.log($this.game_data);

			if($this.game_data["complete_stage"] != undefined && $this.game_data["failed_stage"] != undefined){
				var complete = $this.game_data["complete_stage"];
				var failed = $this.game_data["failed_stage"];
				for(var j = 0; j < complete.length; j++){
					if(complete[j] == $($clone).attr("index")){
						$($clone).addClass("complete");

						// if($($clone).hasClass("active")){
						// 	$($clone).removeClass("active")
						// }
					}
				}
				for(var j = 0; j < failed.length; j++){
					if(failed[j] == $($clone).attr("index")){
						$($clone).addClass("failed");

						// if($($clone).hasClass("active")){
						// 	$($clone).removeClass("active")
						// }
					}
				}
				if(complete.length == $this.items.length){
					$(".button_wrapper").show();
					$(".button_wrapper .button_finish").removeClass("disabled");
				}else{
					// $(".button_wrapper").hide();
				}
			}
		}
		if($($clone).hasClass("complete")){
			$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["complete"]);
		}else if($($clone).hasClass("failed")){
			$($clone).find(".img_stage").attr("src","assets/image/game_map_stage/"+$this.items[i]["failed"]);
			// $($clone).click(function(e){
			// 	$(this).off();
			// 	let index = $(this).attr("index");

			// 	//set game data
			// 	$this.game_data["selected_stage"] = parseInt(index);
			// 	game.game_data = $this.game_data;

			// 	if($this.game_data["slide"] != undefined){
			// 		let a = game.slide_game_map + parseInt(index);

			// 		game.setSlide(a);
			// 	}else{
			// 	  game.nextSlide();
			// 	}
			// });
		}else if($($clone).hasClass("active")){
			// $($clone).click(function(e){
			// 	$(this).off();
			// 	let index = $(this).attr("index");

			// 	//set game data
			// 	$this.game_data["selected_stage"] = parseInt(index);
			// 	game.game_data = $this.game_data;

			// 	if($this.game_data["slide"] != undefined){
			// 		let a = game.slide_game_map + parseInt(index);
			// 		// console.log(a);
			// 		game.setSlide(a);
			// 	}else{
			// 	  game.nextSlide();
			// 	}
			// });
		}else{
			//validasi step yang sekarang apabila => maka terbuka
			if($this.curr_step >= i){

			}else{
				$($clone).addClass("active");
				// $($clone).append("<img class='padlock' src='assets/image/game_map_stage/gembok.png'>");
			}
		}
		$(".stage_wrapper").append($clone);
	}

	$(".stage").unbind().click(function(e){
		$(this).off();
		let index = $(this).attr("index");
		// alert($(this).hasClass("failed"));
		if($(this).hasClass("active") || $(this).hasClass("failed")){
			//set game data
			$this.game_data["selected_stage"] = parseInt(index);
			game.game_data = $this.game_data;
			game.scorm_helper.setSingleData("game_data",$this.game_data);

			// if($this.game_data["slide"] != undefined){
				let a = game.slide_game_map + parseInt(index);
				// console.log(a);
				game.setSlide(a);
			// }else{
			//   game.nextSlide();
			// }
		}
	});
};


StageBootstrap.prototype.setLife = function() {
	var $this = this;
    var count_star = 0;

    $(".header .star-wrapper").show();
    $(".star-wrapper .star").removeClass('active');
    var time_star = setInterval(function() {
        count_star++;
        if(count_star <= game.life_max){
            if(count_star<=$this.life){
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