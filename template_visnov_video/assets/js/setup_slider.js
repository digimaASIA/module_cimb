var setupSlider = function(){


}

setupSlider.prototype.init = function() {
	console.log("init setupSlider");
	var $this = this;
	// $this.image_path = game.image_path;
	// console.log($this.image_path);
	// $this.game_data = game.game_data;
	// console.log($this.game_data);
	// $this.category_game = game.game_data['category_game'];
	// console.log($this.category_game);

	$this.arr_content = game.arr_content;
	var current = game.scorm_helper.getCurrSlide();
    var ldata = $this.arr_content[current]["data"];
	$this.appendHtml(ldata);

	// $.get("config/game_map.json",function(e){
	// 	console.log(e);
	// 	$this.appendHtml(e);
	// },'json');
};

setupSlider.prototype.appendHtml = function(data) {
	var $this = this;
	var clone = $(".wrap").clone();
	$(".wrap").text("");
	console.log($this);
	console.log(data);

	if(data.length > 0){
		for (var i = 0; i < data.length; i++) {
			var no = i+1;
			$(clone).find(".slider-content").clone();

			if(data.length > 0){
				for (var j = 0; j < data2.length; j++) {
					var no2 = j+1;
					var clone2 = $(clone).find("#div_map-"+no);
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_step").attr("src", $this.image_path+"map/"+data2[j]['image_1']); 
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_step-2").attr("src", $this.image_path+"map/"+data2[j]['image_2']); 
					$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .dynamic_txt").html(data2[j]['text']);

					var curr_challenge = data2[j]['id'];
					if($this.challenge == curr_challenge){
						$(clone).find("#div_map-"+no+" .dynamic_img-"+no2+" .img_curr_step").css('display', 'unset');
					} 
				}
			}
		}
	}

	$('.wrap').append(clone);
};