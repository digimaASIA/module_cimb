var beforeChallenge = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

beforeChallenge.prototype.init = function() {
	console.log('beforeChallenge init');
	var game_data = game.game_data;

	$(".btn_confirm").click(function(e){
		$('.tutorial').hide();
		$('.tutorial#confirm_2').show();
    	$('#popupdialogbox').modal('show');
	});

	$(".btn_submit").click(function(e){
		$('#popupdialogbox').modal('hide');
		// var id = e.target.id;
		var id = $('.selected').attr('id');
		console.log(id);
		if(id != undefined){
			id = id.split('_');
			//set category_game
			game_data['category_game'] = id[1];
			//set start date play
			var date = game.getDate2();
			game_data['start_date'] = date;
			console.log(game_data);
			game.scorm_helper.setSingleData('game_data', game_data);
			game.nextSlide();
		}else{
			alert('Harap pilih jabatan Anda!');
		}
	});
};


// beforeChallenge.prototype.getScormLength = function(last_game) {
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

