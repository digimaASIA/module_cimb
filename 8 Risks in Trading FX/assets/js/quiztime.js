var QuizTime = function(){
	
}
QuizTime.prototype.init = function(current_settings) {
	var $this = this;
	$this.current_settings = current_settings;
	$.get("config/setting_quiztime_slide_"+$this.current_settings["slide"]+".json",function(e){
		$this.custome = e;
		$this.createSlider();
	},'json');
};
QuizTime.prototype.createSlider = function() {
	var $this = this;
	$(".ribbon_result img").attr("src","assets/image/slider/"+$this.custome["ribbon"]["ribbon_image"]);
	$(".ribbon_result .title-result").html($this.custome["ribbon"]["ribbon_text"]);
	$(".ribbon_result .title-result").css("color",$this.custome["ribbon"]["ribbon_color"]);
	$(".slider-content.win").css("background",$this.custome["background"]);
	$(".result_wrapper.win_wapper").css("background",$this.custome["background"]);
	$(".img-menang img").attr("src","assets/image/slider/"+$this.custome["image"]);
	$(".result_wrapper.win_wapper .desc").html($this.custome["desc"]["text"]);
	$(".result_wrapper.win_wapper .desc").css("color",$this.custome["desc"]["text_color"]);
	$(".button").html($this.custome["button"]["text"]);
	$(".button").css($this.custome["button"]["css"]);
	$(".btn_next").click(function(e){
		var btn_next = $(this);
		game.audio.audioButton.play();
		if($this.custome["button"]["popup"]){
			$("#"+$this.custome["button"]["popup"]).modal({backdrop: 'static',keyboard: true,show: true});
		}else if($this.custome["button"]["gotoslide"]){
			btn_next.off();
			game.scorm_helper.setSlide(parseInt($this.custome["button"]["gotoslide"])-1);
			game.nextSlide();
		}else{
			game.nextSlide();
		}
	});
	$("#"+$this.custome["button"]["popup"]+" .popupalert-yes").click(function(e){
		$(this).off();
		$("#"+$this.custome["button"]["popup"]+" .popupalert-no").off();
	    $("#"+$this.custome["button"]["popup"]).modal("hide");
	    game.audio.audioButton.play();
	    game.nextSlide();
	});
	$("#"+$this.custome["button"]["popup"]+" .popupalert-no").click(function(e){
		$(this).off();
	    $("#"+$this.custome["button"]["popup"]+" .popupalert-yes").off();
	    $("#"+$this.custome["button"]["popup"]).modal("hide");
	    game.audio.audioButton.play();
	    if($this.custome["button"]["gotoslide"]){
	    	game.scorm_helper.setSlide(parseInt($this.custome["button"]["gotoslide"])-1);
			game.nextSlide();
	    }
	});
};