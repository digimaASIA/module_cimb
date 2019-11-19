/**
 * Scorm Helper is standardization of SCORM parameters.
 * there are : leasson status, duration, activity question, result per activity, score, and suspend data.  
 * @class
 * @author     NejiElYahya
 */
var ScormHelper = function(){
	var $this = this;
	this.scorm = pipwerks.SCORM;
	this.curr_slide = 0;
	this.category = 0;
	this.lastDuration = 0;

	// this use for local testing.
	if(game.environment == "development"){
		var tempSlide = localStorage.getItem("tempSlide");
		this.curr_slide=tempSlide;
	}

	try{
		// initial connection to scorm
		this.lmsConnected = this.scorm.init();
		
		if(this.lmsConnected){
			// get leason status
			var lastStatus = this.scorm.get("cmi.core.lesson_status");
			if(lastStatus!="passed" && lastStatus!="failed" && lastStatus!="completed"){
				this.setStatus("incomplete");
			}

			// get suspend
			var sus_data = this.scorm.get("cmi.suspend_data");
			$this.ldata = JSON.parse(sus_data);
			console.log($this.ldata);

			// last duration
			var prevduration = this.scorm.get("cmi.core.total_time");
			if(prevduration != undefined && prevduration == null){
				var arr=prevduration.split(":");
				var hours = parseInt(arr[0])*(1000 * 3600);
				var minutes = parseInt(arr[1])*(1000*60);
				var sec = parseInt(arr[2])*1000;
				
				this.lastDuration = hours+minutes+sec;
			}

			var sus_data = this.scorm.get("cmi.suspend_data");
			$this.ldata = JSON.parse(sus_data);
			if($this.ldata["curr_slide"] != undefined){
				$this.curr_slide = parseInt($this.ldata["curr_slide"]);	
				game.debug($this.curr_slide+" "+parseInt(game.arr_content.length-1));
				if($this.curr_slide == game.arr_content.length-1){
					$this.setSlide(0);
				}
			}
		}
		else{
			$this.ldata = {};

			/*test*/
			// $this.ldata = {
			// 	"curr_slide":3,
			// 	"quiz":[
			// 		{"index":"game_slide_3_0","answer":[[1]],"list_question":[0],"start_date":"7 November 2019 14:24:41","end_date":"7 November 2019 14:25:11","is_complete":true,"last_score":1,"last_life":5},
			// 		{"index":"game_slide_3_1","answer":[[1]],"list_question":[0],"start_date":"7 November 2019 14:24:41","end_date":"7 November 2019 14:25:11","is_complete":true,"last_score":1,"last_life":5}
			// 	],
			// 	"game_data":{"total_soal_current_slide":2,"total_soal":6,"slide":3,"last_score":2,"total_answer_true":2,"curr_soal":0,"category_game":1}
			// };

			// $this.curr_slide = $this.ldata["curr_slide"];
			console.log($this.ldata);
			/*end test*/
		}
	}catch(e){
		$this.ldata = {};
	}
}

/**
 * Sets the duration.
 */
ScormHelper.prototype.setDuration = function() {
	var duration = Math.abs(game.getCurrDateTimestamp() - game.startDate);
	var prevduration = new Date(this.lastDuration).getTime();
	var count =  Math.abs(duration + prevduration);
	//console.log(game.parseTime(count));
	this.scorm.set("cmi.core.session_time",game.parseTime(count));
};

/**
 * Gets the current slide.
 *
 * @return     {string} The current slide
 */
ScormHelper.prototype.getCurrSlide = function() {
	game.debug(this.curr_slide);
	return this.curr_slide;
};

/**
 * set to next slide.
 */
ScormHelper.prototype.nextSlide = function() {
	this.curr_slide = parseInt(this.curr_slide)+1;
	this.setSingleData("curr_slide",this.curr_slide);
};

/**
 * Sets the slide.
 *
 * @param      {number}  $slide  The slide
 */
ScormHelper.prototype.setSlide = function($slide) {
	this.curr_slide = $slide;
	this.setSingleData("curr_slide",$slide);
};

/**
 * Gets the single data.
 * 
 * @description this use for get value by index in suspend data.
 * @param      {string}  index   The index
 * @return     {number|string|Array}  The single data.
 */
ScormHelper.prototype.getSingleData = function(index) {
	var $this = this;
	return $this.ldata[index];
};

/**
 * Sets the single data.
 *
 * description this use for save or append index in suspend data.
 * @param      {string}  index   The index
 * @param      {string}  value   The value
 */
ScormHelper.prototype.setSingleData = function(index,value) {
	var $this = this;
	$this.ldata[index]=value;
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
};


/**
 * Gets the last game.
 *
 * @param      {string}  category  index of game
 * @return     {Array}  The last game by category.
 */
ScormHelper.prototype.getLastGame = function(category) {
	var $this = this;
	var arr = [];
	console.log($this.ldata["quiz"]);
	if($this.ldata["quiz"] === undefined || $this.ldata["quiz"].length == 0){
		$this.ldata["quiz"] = [];
	}
	else{
		arr = $this.ldata["quiz"];
	}

	var idx = -1;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]["index"] == category){
			idx=i;
			break;
		}
	}

	$this.category = idx;

	return(arr.length>0)?arr[idx]:arr;

	// var ldata = {"index":"game_slide_3_0",
 //            "answer":[[1,1]],
 //            "list_question":[0],
 //            "start_date":"20 Juni 2019 15:21:39",
 //            "end_date":"20 Juni 2019 15:22:8",
 //            "is_complete":true,"last_score":1,
 //            "last_life":3
 //    };
	// return ldata;
};


/**
 * Sets the quiz data.
 *
 * @param      {sting}		category  index of game
 * @param      {Array}		arr_rand  The question list.
 * @return     {Object}		current game object.
 */
ScormHelper.prototype.setQuizData = function(category,arr_rand) {
	var $this = this;
	var arr = $this.getLastGame(category);
	console.log(arr_rand);
	var result = {index:category,answer:[], list_question:arr_rand, start_date:game.getFullDate(), end_date:"",is_complete:false};

	// if index already exist and game was completed
	if((game.startGame == 1 && arr!=undefined && arr.length!=0)  || (arr!=undefined && arr.length!=0 && arr["answer"].length == arr["list_question"].length)){
		$this.ldata["quiz"].splice($this.category,1);	
		$this.ldata["quiz"].push(result);
		$this.category = $this.ldata["quiz"].length-1;
	}
	else if(parseInt($this.category) == -1){
		$this.ldata["quiz"].push(result);
		$this.category = $this.ldata["quiz"].length-1;
	}
	else{
		result = arr;
	}

	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));

	return result;
};

ScormHelper.prototype.resetQuizDataByIndex = function(category) {
	var $this = this;
	var result;
	for (var i = 0; i < $this.ldata["quiz"].length; i++) {
		if($this.ldata["quiz"][i]['index'] == category){
			$this.ldata["quiz"].splice(i,1);
			break;
		} 
	}

	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));

	// return result;
}

ScormHelper.prototype.resetAllQuizData = function() {
	var $this = this;
	$this.ldata["quiz"] = undefined;
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
}


/**
 * Pushes an answer.
 * push every user answer question by question. 
 *
 * @param      {number}  answer    The current activity answer (0 incorrect, 1 correct)
 * @param      {string}  response  The current activity question 
 */
ScormHelper.prototype.pushAnswer = function(answer,response,last_score = '', last_life = '') {
	var $this = this;
	console.log($this.ldata["quiz"]);
	console.log(answer);
	$this.ldata["quiz"][$this.category]["answer"].push(answer);
	// console.log($this.ldata["quiz"]);
	var str=(answer == 0)?"wrong":"correct";
	
	var index = 0;
	if($this.category>0){
		for (var i = 0; i < $this.category; i++) {
			index = index+$this.ldata["quiz"][i]["answer"].length;
		}
	}

	var index = index+$this.ldata["quiz"][$this.category]["answer"].length-1;

	$this.scorm.set("cmi.interactions."+index+".result", str);
	// $this.scorm.set("cmi.interactions."+index+".student_response",response);
	// console.log($this.ldata["quiz"]);
	//jika soal dan jawaban sama atau sudah akhir soal
	if($this.ldata["quiz"][$this.category]["answer"].length == $this.ldata["quiz"][$this.category]["list_question"].length){
		$this.ldata["quiz"][$this.category]["end_date"] = game.getFullDate();
		$this.ldata["quiz"][$this.category]["is_complete"] = true;

		//set last score dari main game
		if(last_score != ''){	
			$this.ldata["quiz"][$this.category]["last_score"] = last_score;
		}
		
		//set last life dari main game
		if(last_life != ''){	
			$this.ldata["quiz"][$this.category]["last_life"] = last_life;
		}
	}

	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
};


/**
 * Sets the answer.
 * set all the answer of current question game.  
 * 
 * @param      {Array}  answer    The answer
 * @param      {Array}  question  The question
 */
ScormHelper.prototype.setAnswer = function(answer,question) {
	var $this = this;
	var count = 0;
	$this.ldata["quiz"][$this.category]["answer"] = answer;

	for (var i = 0; i < question.length; i++) {
		var str = "";
		if(answer[i] == 1){
			count+=1;
			str = "correct";
		}
		else if(answer[i] === 0){
			count+=1;
			str = "incorrect";
		}
		else{
			str = "unanticipated";
		}
		$this.scorm.set("cmi.interactions."+i+".result", str);
		$this.scorm.set("cmi.interactions."+i+".student_response",question[i]);
	}
	
	if(count == question.length){
		$this.ldata["quiz"][$this.category]["end_date"] = game.getFullDate();
		$this.ldata["quiz"][$this.category]["is_complete"] = true;
	}
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
};


/**
 * Gets the result by category.
 *
 * @param      {string}	slide
 * return      {Array}	The result by category.
 */
ScormHelper.prototype.getResultByCategory = function(slide) {
	var $this = this;
	var arr = $this.ldata["quiz"];
	var result = [];
	result["score"]=0;
	result["total_soal"]=0;
	// console.log(arrSlide);
	for (var i = 0; i < arr.length; i++) {
		var cek = 0;
		if(arr[i]["index"] == slide){
			result["total_soal"] = parseInt(result["total_soal"])+arr[i]["list_question"].length;	
			for (var j = 0; j < arr[i]["answer"].length; j++) {
				if(arr[i]["answer"][j]==1){
					result["score"] = parseInt(result["score"])+1;
				}
			}
		}
	}

	return result;
};


/**
 * Gets the quiz result.
 *
 * @param      {Array}   arrSlide  list slide that score will be accumulated.
 * @return     {Array}   The result will return score and total question.
 */
ScormHelper.prototype.getQuizResult = function(arrSlide) {
	var $this = this;
	var arr = $this.ldata["quiz"];
	console.log(arr);
	var result = [];
	result["score"]=0;
	result["total_soal"]=0;
	// console.log(arrSlide);
	for (var i = 0; i < arr.length; i++) {
		var cek = 0;
		if(arrSlide!=undefined){			
			for (var k = 0; k < arrSlide.length; k++) {
				// console.log(arr[i]["index"]+" "+arrSlide[k]);
				if(arr[i]["index"] == arrSlide[k]){
					cek=1;
					break;
				}
			}
		}
		else{
			cek = 1;
		}
		if(cek == 1){
			console.log(parseInt(result["total_soal"]));
			console.log(arr[i]["list_question"]);
			result["total_soal"] = parseInt(result["total_soal"])+arr[i]["list_question"].length;	
			for (var j = 0; j < arr[i]["answer"].length; j++) {
				if(arr[i]["answer"][j].length > 1){
					if(arr[i]["answer"][j][1]==1){
						result["score"] = parseInt(result["score"])+1;
					}
				}else{
					if(arr[i]["answer"][j]==1){
						result["score"] = parseInt(result["score"])+1;
					}
				}
			}
		}
	}

	return result;
};

ScormHelper.prototype.getQuizResultPrefix = function(arrSlide = "") {
	var $this = this;
	var arr = $this.ldata["quiz"];
	console.log(arr);
	var result = [];
	result["score"]=0;
	result["total_soal"]=0;
	result["game_quiz"] = [];
	// console.log(arrSlide);

	for (var i = 0; i < arr.length; i++) {
		let slide = arr[i]["index"].split("_");
		slide = slide[2];

		if(slide == arrSlide){
			if(arr[i]["answer"].length > 0){
				result["total_soal"] += arr[i]["list_question"].length;
				let arr_answer = arr[i]["answer"];
				for (var j = 0; j < arr_answer.length; j++) {
					if(arr_answer[j] == 1){
						result["score"] += 1;
					}
				}
			}
		}else{
			if(arr[i]["answer"].length > 0){
				result["game_quiz"].push(arr[i]);
				result["total_soal"] += arr[i]["list_question"].length;
				let arr_answer = arr[i]["answer"];
				for (var j = 0; j < arr_answer.length; j++) {
					if(arr_answer[j] == 1){
						result["score"] += 1;
					}
				}
			}
		}
	}


	return result;
}

/**
 * Sends a result.
 *
 * @param      {number}  score   The score
 */
ScormHelper.prototype.sendResult = function(score) {
	var $this = this;
	$this.scorm.set("cmi.core.score.raw", score);
};


/**
 * Sets the leasson status.
 *
 * @param      {string}  value   passed or failed
 */
ScormHelper.prototype.setStatus = function(value) {
	var $this = this;
   if($this.lmsConnected){
   	 var success = $this.scorm.set("cmi.core.lesson_status", value);
	  pipwerks.SCORM.save();
   }
}