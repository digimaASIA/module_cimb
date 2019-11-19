var Audio = function(){
	this.audioButton = document.createElement('audio');
    this.audioButton.setAttribute('src', 'assets/audio/sound_button.wav');

   	this.audioBenar = document.createElement('audio');
	this.audioBenar.setAttribute('src', 'assets/audio/correct.mp3');

	this.audioSalah = document.createElement('audio');
	this.audioSalah.setAttribute('src', 'assets/audio/incorrect.mp3');

	this.audioKalah = document.createElement('audio');
	this.audioKalah.setAttribute('src', 'assets/audio/tryAgain.mp3');

	this.audioMenang = document.createElement('audio');
	this.audioMenang.setAttribute('src', 'assets/audio/YouDidIT_Congratz_mixdown.mp3');

	this.audio_dynamic = function(src){
		console.log(src);
		this.audioDynamic = document.createElement('audio');
		this.audioDynamic.setAttribute('src', src);
		return this.audioDynamic;
	}
}