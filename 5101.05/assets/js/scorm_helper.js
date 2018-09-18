var ScormHelper = function(){
	var $this = this;
	this.scorm = pipwerks.SCORM;
	this.curr_slide = 0;
	this.category = 0;

	if(!game.isLocal){
		this.lmsConnected = this.scorm.init();
		try{
			if(this.lmsConnected){
				var lastStatus = this.scorm.get("cmi.core.lesson_status");
				if(lastStatus!="completed"){
					this.setStatus("incomplete");
				}

				var sus_data = this.scorm.get("cmi.suspend_data");
				$this.ldata = JSON.parse(sus_data);
				//get last slide page
				if($this.ldata["curr_slide"] != undefined){
					$this.curr_slide = parseInt($this.ldata["curr_slide"]);	
					game.debug($this.curr_slide+" "+parseInt(game.arr_content.length-1));
					//sudah sampai akhir page
					if($this.curr_slide == game.arr_content.length-1){
						$this.setSlide(0);
					}

					//if last page before page 3 or page game map
					if($this.ldata["curr_slide"] < 3){
						//check if category_game exist
						if($this.ldata['category_game'] != undefined){
							game.debug('category_game: '+$this.ldata['category_game']);
							//if found, go to game page with this category_game
							if($this.ldata['category_game']){
								$this.setSlide(3);
							}
						}
					}
				}
			}
			else{
				$this.ldata = {};
			}
		}catch(e){
			$this.ldata = {};
		}
	}
	else{
		$this.ldata = {};
	}

	// var url = new URL(parent.document.location.href);
	// var c = url.searchParams.get("a");
	// alert(c);
	// alert(parent.document.location.href);
	
	// alert(this.scorm.get("cmi.core.student_id"));
}

ScormHelper.prototype.getUsername = function() {
	var $this = this;
	return $this.scorm.get("cmi.core.student_id");
};
ScormHelper.prototype.getCurrSlide = function() {
	game.debug(this.curr_slide);
	return this.curr_slide;
};
ScormHelper.prototype.nextSlide = function() {
	this.curr_slide = parseInt(this.curr_slide)+1;
	this.setSingleData("curr_slide",this.curr_slide);
};
ScormHelper.prototype.setSlide = function($slide) {
	this.curr_slide = $slide;
	this.setSingleData("curr_slide",$slide);
};

ScormHelper.prototype.setSingleData = function(index,value) {
	var $this = this;
	$this.ldata[index]=value;
	game.debug(index+" "+value);
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
	pipwerks.SCORM.save();
};

// get by index from suspend data
ScormHelper.prototype.getSingleData = function(index) {
	var $this = this;
	// return $this.ldata[index];
	game.debug($this.ldata[index]);
	return ($this.ldata[index] === undefined)?1:$this.ldata[index];
};

ScormHelper.prototype.getLastGame = function(category) {
	var $this = this;
	var arr = [];
	if($this.ldata["quiz"] === undefined || $this.ldata["quiz"].length == 0){
		$this.ldata["quiz"] = [];
	}
	else{
		arr = $this.ldata["quiz"][$this.ldata["quiz"].length-1];
	}

	var idx = -1;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]["index"] == category){
			idx=i;
			break;
		}
	}

	$this.category = idx;
	console.log(arr);
	// return (arr.length>0)?(arr[idx]["list_data"] != undefined ? arr[idx]["list_data"] : arr):arr;
};

ScormHelper.prototype.setQuizData = function(category,json_data) {
	var $this = this;
	var temp = [];
	console.log(json_data);
	temp.push({"index":category,"list_data":json_data});

	$this.category = 0;
	// console.log(temp);
	// console.log($this.ldata);
	// console.log($this.ldata["quiz"]);
	($this.ldata["quiz"] == undefined ? $this.ldata["quiz"] = [] : '');
	$this.ldata["quiz"].push(temp);
	// console.log($this.ldata);
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
	pipwerks.SCORM.save();
};

ScormHelper.prototype.pushCompleteSlide = function() {
	var $this = this;
	if($this.ldata["arr_slide_complete"] === undefined){
		$this.ldata["arr_slide_complete"] = [];
	}

	var flag = 0;
	for (var i = 0; i < $this.ldata["arr_slide_complete"].length; i++) {
		if($this.ldata["arr_slide_complete"][i] == $this.curr_slide){
			flag=1;
			break;
		}
	}

	if(flag == 0){
		$this.ldata["arr_slide_complete"].push($this.curr_slide);
	}

	game.debug("push : "+$this.curr_slide);
	$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
	pipwerks.SCORM.save();
};

//check previous slide and compare with array slide complete
ScormHelper.prototype.cekCompleteNext = function() {
	console.log('cekCompleteNext');
	var $this = this;
	var result = true;
	if(parseInt($this.curr_slide)+1<game.arr_content.length){
		console.log(parseInt($this.curr_slide)+1);
		console.log(game.arr_content);
		var pre_slide = game.arr_content[parseInt($this.curr_slide)+1]["pre_slide"];
		console.log(pre_slide);
		console.log($this.ldata);
		for (var i = 0; i < pre_slide.length; i++) {
			var flag=0;
			//check arr slide complete
			for (var j = 0; j < $this.ldata["arr_slide_complete"].length; j++) {
				if(pre_slide[i] == $this.ldata["arr_slide_complete"][j]){
					flag = 1;
					break;
				}
			}

			if(flag == 0){
				result = false;
				break;
			}
		}
	}
	result = true;
	return result;
};

ScormHelper.prototype.setAnsData = function(category,sc_data) {
	var $this = this;

	console.log(sc_data);
	if($this.ldata["quiz"] === undefined || $this.ldata["quiz"].length == 0){
		$this.setQuizData(category,sc_data);
	}
	else{
		$this.ldata["quiz"][$this.ldata["quiz"].length-1][$this.category]["list_data"] = sc_data;
		game.debug(JSON.stringify($this.ldata["quiz"][$this.ldata["quiz"].length-1][$this.category]));
		$this.scorm.set("cmi.suspend_data", JSON.stringify($this.ldata));
		pipwerks.SCORM.save();
	}
	
};

ScormHelper.prototype.getQuizResult = function(category) {
	var $this = this;
	var count=0;
	var arr = $this.ldata["quiz"][$this.ldata["quiz"].length-1];
	game.debug(arr);

	var idx = -1;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]["index"] == category){
			idx=i;
			$this.category = idx;
			break;
		}
	}
	game.debug(idx);

	var ans = arr[idx]["answer"];

	for (var i = 0; i < ans.length; i++) {
		if(ans[i]==1){
			count = parseInt(count)+1;
		}
	}

	game.debug(arr[idx]);

	return count;
};

ScormHelper.prototype.sendResult = function(score) {
	var $this = this;
	$this.scorm.set("cmi.core.score.raw", score);
	$this.setSingleData("nilai",score*2);
};

ScormHelper.prototype.setStatus = function(value) {
	var $this = this;
   //If the lmsConnection is active...
   if($this.lmsConnected){
   
	  //... try setting the course status to "completed"
	  var success = $this.scorm.set("cmi.core.lesson_status", value);
	  pipwerks.SCORM.save();
	  //If the course was successfully set to "completed"...
	  if(success){
	  
		 //... disconnect from the LMS, we don't need to do anything else.
		 //scorm.quit();
	  
	  //If the course couldn't be set to completed for some reason...
	  } else {
   
		 //alert the user and close the course window
		 alert("Error: Course could not be set to complete!");
   
	  }
   
   //If the course isn't connected to the LMS for some reason...
   } else {
   
	  //alert the user and close the course window
	  alert("Error: Course is not connected to the LMS");
   }
}