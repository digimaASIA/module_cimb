var SplashScreen = function(){

}

SplashScreen.prototype.init = function() {
	game.scorm_helper.pushCompleteSlide();
	var time = setTimeout(function(){
		clearInterval(time);
		game.nextSlide();
	}, 3000);
};