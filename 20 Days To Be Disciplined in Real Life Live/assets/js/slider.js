var Slider = function(){

}
Slider.prototype.init = function(current_settings) {
	console.log('Slider init');
	var $this = this;
	$this.current_settings = current_settings;
	$this.list_slider = $(".list_slider").first().clone();
	$this.popupList = $("#popupList").find(".description").first().clone();
	$this.button = $(".button").first().clone();
	$this.ccButton = $(".click_and_show_wrapper .button_click_and_show").first().clone();

	$("#ulasan").html("");
	$($this.list_slider).find(".button_wrapper").html("");
	$($this.list_slider).find(".click_and_show_wrapper").html("");

	$this.arr_content = game.arr_content;
	var current = game.scorm_helper.getCurrSlide();
    var ldata = $this.arr_content[current]["data"];
    $this.listSlider = ldata;

    $this.createSlider();
};

Slider.prototype.addVideoEvent = function(clone) {
	var $this = this;
	$(clone).find(".video").click(function(e){
	    $(this).off();
	    $("#video .btn-close").click(function(e){
	      $(this).off();
	      $this.stopVideo();
	      $this.addVideoEvent(clone);
	    });
	    $this.playVideo();
	});
};
Slider.prototype.playVideo = function() {
	$("#video").show();
	$("#video1").show();
	$("video").get(0).play();
};
Slider.prototype.stopVideo = function() {
	$("#video").hide();
	$("#video1")[0].pause();
	$("#video1")[0].currentTime = 0;
}

Slider.prototype.createSlider = function() {
	var $this = this;

	for (var i = 0; i < $this.listSlider.length; i++) {
		var clone = $this.list_slider.clone();
		
		if($this.listSlider[i]["image"]){
			$(clone).find(".img-load").attr("src","assets/image/"+$this.listSlider[i]["image"]);
		}
		else{
			$(clone).find(".img-load").remove();	
		}

		if($this.listSlider[i]["ribbon"]){
			$(clone).find(".ribbon-content").html($this.listSlider[i]["ribbon"]);
		}
		else{
			$(clone).find(".rb-wrap").remove();
		}

		if($this.listSlider[i]["text"]){
			$(clone).find(".keterangan").html($this.listSlider[i]["text"]);
		}
		else{
			$(clone).find(".keterangan").remove();	
		}

		if($this.listSlider[i]["video"]){
			$("#video").find("source").attr("src","assets/video/"+$this.listSlider[i]["video"]);
			$("#video1")[0].load();
			$this.addVideoEvent(clone);
		}
		else{
			$(clone).find(".bg-video").remove();
		}

		if($this.listSlider[i]["click_and_show"]){
			var list = $this.listSlider[i]["click_and_show"];

			for (var l = 0; l < list.length; l++) {
				var cButton = $($this.ccButton).first().clone();
				$(cButton).find(".text").html(list[l]["title"]);
				$(clone).find(".click_and_show_wrapper").append(cButton);
				$(cButton).attr("index",l);
				$(cButton).click(function(e){
					$("#popupList .title").html($(this).find(".text").html());
					var cloneList = $(".point_wrapper_block").first().clone();
					var cloneWrapper = $(".point_wrapper").first().clone();
					$(".point_wrapper").html("");
					console.log(list[parseInt($(this).attr("index"))]["list"][parseInt($(this).attr("index"))]);
					for (var m = 0; m < list[parseInt($(this).attr("index"))]["list"].length; m++) {
							//console.log(list[parseInt($(this).attr("index"))]["list"][m]);
							var cList = $(cloneList).first().clone();
							$(cList).find(".point_desc").html(list[parseInt($(this).attr("index"))]["list"][m]);
							$(".point_wrapper").append(cList);
					}
					$("#popupList .btn-close").click(function(e){
						$(this).off();
						$("#popupList").modal("hide");
					});

					$("#popupList").modal("show");
				});
			}
		}
		else{
			$(clone).find(".click_and_show_wrapper").remove();
		}

		$("#ulasan").append(clone);

		if($this.listSlider[i]["button"]){
			for (var j = 0; j < $this.listSlider[i]["button"].length; j++) {
				var cloneBtn = $this.button.clone();
				$(cloneBtn).html($this.listSlider[i]["button"][j]["text"]);
				$(clone).find(".button_wrapper").append(cloneBtn);
				if($this.listSlider[i]["button"][j]["gotoSlide"]){
					$(cloneBtn).attr("gotoSlide",$this.listSlider[i]["button"][j]["gotoSlide"]);
					$(cloneBtn).click(function(e){
						$(this).off();
						game.scorm_helper.setSlide(parseInt($(this).attr("gotoSlide"))-1);
						game.nextSlide();
					});
				}
				else{
					if($this.listSlider[i]["video"]){
						$(cloneBtn).click(function(e){
							$("#popupAlertVideo").modal("show");
						});
						$("#popupAlertVideo .popupalert-yes").click(function(e){
						    $(this).off();
						    $("#popupAlertVideo").modal("hide");
						    game.audio.audioButton.play();
						    game.nextSlide();
						});
						$("#popupAlertVideo .popupalert-no").click(function(e){
						    $("#popupAlertVideo").modal("hide");
						});
					}
					else{
						$(cloneBtn).click(function(e){
							$(this).off();
							game.nextSlide();
						});
					}
				}
			}
		}
		else{
			$(clone).find(".button_wrapper").remove();
		}
	}
	$('#ulasan').slick({
        dots: true,
        infinite: false,
        speed: 500
      });
      $("#ulasan").on('afterChange', function(event, slick, currentSlide, nextSlide){
         $(".img-load").each(function(e){
           var src = $(this).attr("src");
           $(this).attr("src",src);
         });
     });

    $(".popupList").slick({
    	dots: true,
    	infinite: false,
    	speed: 500
    });
};