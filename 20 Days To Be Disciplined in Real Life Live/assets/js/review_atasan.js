var reviewAtasan = function(){
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

reviewAtasan.prototype.init = function() {
	console.log('init reviewList');
	var $this = this;

	$('.popupdialogbox_review_atasan').modal('show');
	$('.close_modal_review_atasam').click(function(){
		$('.popupdialogbox_review_atasan').modal('hide');
	});

	$('.btn_review').click(function(){
		game.setSlide(3);
	});
}