var Audio = function(){
	console.log('audio');
	this.audioButton = document.createElement('audio');
    this.audioButton.setAttribute('src', 'assets/audio/sound_button.wav');

   	this.audioBenar = document.createElement('audio');
	this.audioBenar.setAttribute('src', 'assets/audio/benar.wav');

	this.audioSalah = document.createElement('audio');
	this.audioSalah.setAttribute('src', 'assets/audio/salah.wav');

	this.audioKalah = document.createElement('audio');
	this.audioKalah.setAttribute('src', 'assets/audio/kalah.mp3');

	this.audioMenang = document.createElement('audio');
	this.audioMenang.setAttribute('src', 'assets/audio/menang.mp3');
}