var Modul = function(){
	var $this = this;
	this.scorm = pipwerks.SCORM;
	this.isLocal = true;
	var url="config/get_challange.json";
	this.audioButton = document.createElement('audio');
	this.audioButton.setAttribute('src', 'sound/sound_button.wav');
	this.module_id = 372;
	$this.total_score = 0;
	this.username = "mita@digimasia.com";

	if(!$this.isLocal){

		this.base_url = "http://demo.digimasia.com/cimbinaga/";
		this.lmsConnected = this.scorm.init();

		try{
			if(this.lmsConnected){
				$this.username = $this.scorm.get("cmi.core.student_id");
				var lastStatus = $this.scorm.get("cmi.core.lesson_status");
	
				if(lastStatus!="completed"){
					this.setStatus("incomplete");
				}

				var sus_data = this.scorm.get("cmi.suspend_data");
				$this.sc_data = JSON.parse(sus_data);
			}
			else{
				$this.sc_data = [];
			}
		}catch(e){
			$this.sc_data = [];
		}
	}
	else{
		this.base_url = "";
		$this.sc_data = [];
	}

	$.get(url,function(e){
		$this.ldata = e;
		$("#content").load("parts/cover.html",function(e){
			$(".btn-start").click(function(e){
				$this.audioButton.play();
				$this.create_slide1();
			});
		});
	},'json');
}

Modul.prototype.create_slide1 = function() {
	var $this = this;
	$("#content").load("parts/slide_1.html",function(e){
		var time_star = setInterval(function() {
			clearInterval(time_star);
			$this.create_slider();
		},8000);
	});
};

Modul.prototype.create_slider = function() {
	var $this = this;
	$("#content").load("parts/slider.html",function(e){
		$(".button.start").click(function(e){
			$this.create_modul();
		});
	});
};
Modul.prototype.create_modul = function() {
	var $this = this;
	$("#content").load("parts/slide-2.html",function(e){
		$this.cekScormData();
	});
};

Modul.prototype.cekScormData = function() {
	var $this = this;
	$this.isComplete = true;
	$this.isReview = true;

	if($this.getScormLength() == $this.ldata.length){
		$.post($this.base_url+"get_challenge.php",{"cmid":$this.module_id,"username":$this.username},function(e){
			console.log(e);
			console.log("============");
			if(e.length>0){
				for (var i = 0; i < e.length; i++) {
					if(e[i]["grade"] != -1){
						if(e[i]["grade"] < e[i]["pass_grade"]){
							$this.isComplete = false;
						}
						for (var j = 0; j < $this.sc_data.length; j++) {
							if($this.sc_data[j]["activityid"] == e[i]["activityid"]){
								$this.sc_data[j]["grade"] = e[i]["grade"];
								$this.sc_data[j]["activity_response"] = e[i]["activity_response"];
								break;
							}
						}
					}
					else{
						$this.isReview = false;
						break;
					}
				}

				console.log($this.isReview);
				console.log($this.isComplete);
				console.log($this.sc_data);

				if(!$this.isReview){
					// tampil page lagi di review
					$this.create_page_review();
				}
				else if($this.isComplete){
					// show popup complete
					$("#popupcomplete").modal("show");
					$this.create_challange();
				}
				else{
					$this.create_challange();
				}
			}else{
				$this.create_challange();
			}
		},'json');
	}
	else{
		$this.create_challange();
	}
};

Modul.prototype.getScormLength = function() {
	var $this = this;
	var count = 0;
	for (var i = 0; i < $this.sc_data.length; i++) {
		if($this.sc_data[i] !== void 0){
			count++;
		}
	}

	return count;
};

Modul.prototype.create_page_review = function() {
	$("#content").load("parts/review.html",function(e){

	});
};

Modul.prototype.create_challange = function() {
	var $this = this;
	$this.count = 0;
	$(".submit-ans").click(function(e){
		var data_submit = $this.getDataForSubmit();
		console.log(data_submit);
		if(data_submit.length>0){
			$(this).off();
			$.post($this.base_url+"submit.php",{username:$this.username,cmid:$this.module_id,data:data_submit},function(e){
				if(e.status == "success"){
					// masuk ke page review
					$this.create_page_review();
				}
				else{
					// popup gagal submit
					$("#popupalert").modal("show");
					console.log("gagal submit");
				}
			},'json');
		}
		else{
			// popup gagal karena masih ada data yang kosong
			$("#popupalert2").modal("show");
			console.log("masih ada data yang kosong");
		}
	});

	$this.loadContent();
};

Modul.prototype.getDataForSubmit = function() {
	var flag = 0;
	var arr_temp = [];
	var $this = this;
	for (var i = 0; i < $this.sc_data.length; i++) {
		if($this.sc_data[i] !== void 0){
			if($this.sc_data[i]["grade"] == -1){
				arr_temp[i] = $this.sc_data[i];
			}
			else if($this.sc_data[i]["grade"] == 0){
				arr_temp = [];
				break;	
			}
		}
		else{
			arr_temp = [];
			break;
		}
	}

	return arr_temp;
};

Modul.prototype.loadContent = function() {
	var url2="";
	var $this = this;
	var challange = $this.ldata;

	if(challange[$this.count]["activity_type"] == 1){
		url2 = "parts/type-1.html";
	}
	else if(challange[$this.count]["activity_type"] == 2){
		url2 = "parts/type-2.html";
	}

	$.get(url2,function(e){
		var clone = $(e).clone();
		$("#accordion").append(clone);

		$(clone).find("input[name='user_id']").val($this.username);
		$(clone).find("input[name='cmid']").val($this.module_id);
		$(clone).find("input[name='activityid']").val(challange[$this.count]["activityid"]);
		
		$(clone).attr("index",$this.count);
		$(clone).find("#accordion-wrapper").attr("href","#data-"+challange[$this.count]["activityid"]);
		$(clone).find(".panel-collapse.collapse").attr("id","data-"+challange[$this.count]["activityid"]);
		$(clone).find(".panel-title").html(challange[$this.count]["activity_title"]);
		$(clone).find(".panel-body p").html(challange[$this.count]["activity_question"]);
		$(clone).find(".status>div").css({"display":"none"});
		
		if($(clone).find("#inputTextarea").length>0){
			var input_textarea = "textarea_"+challange[$this.count]["activityid"];
			$(clone).find("#inputTextarea").attr("id",input_textarea);
			
			if($this.sc_data[$this.count] !== void 0){
				$(clone).find("#"+input_textarea).val($this.sc_data[$this.count]["activity_response"]);
				if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
					$(clone).find(".status .accept").css({"display":"block"});
					$(clone).find("#"+input_textarea).attr("readonly");
					$(clone).find("#"+input_textarea).attr("disabled");
					$(clone).find(".status .accept .score").html($this.sc_data[$this.count]["grade"]);
				}

				if($this.sc_data[$this.count]["grade"]!=-1){
					$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);	
					if($this.sc_data[$this.count]["grade"]<$this.sc_data[$this.count]["pass_grade"]){
						$(clone).find(".status .reject").css({"display":"block"});
						$(clone).find(".status .reject .score").html($this.sc_data[$this.count]["grade"]);
					}
				}
			}

			document.getElementById(input_textarea).onchange = function () {
				var form = $(this).parents("form");
				var res = {
						activityid:$this.ldata[$(form).attr("index")]["activityid"],
						activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
						activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
						activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
						activity_response:$(this).val(),
						grade:-1,
						pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
						grade_type:$this.ldata[$(form).attr("index")]["grade_type"]
					};
				$this.sc_data[$(form).attr("index")] = res;
				console.log($this.sc_data);

				if(!$this.isLocal){
					$this.scorm.set("cmi.suspend_data",JSON.stringify($this.sc_data));
					pipwerks.SCORM.save();
				}
			}
		}
		else if($(clone).find("#fileToUpload").length>0){
			var id_file = "files_"+challange[$this.count]["activityid"];
			var img = "image_"+challange[$this.count]["activityid"];

			$(clone).find("#fileToUpload").attr("id",id_file);
			$(clone).find("#image").attr("id",img);

			if($this.sc_data[$this.count] !== void 0){
				$(clone).find(".upload_wrapper").css({"display":"none"});
				$(clone).find(".thumb_profile").css({"display":"block"});
				document.getElementById(img).src = $this.sc_data[$this.count]["activity_response"];

				if($this.sc_data[$this.count]["grade"]>=$this.sc_data[$this.count]["pass_grade"]){
					$(clone).find(".status .accept").css({"display":"block"});
					$(clone).find(".thumb_profile .close").css({"display":"none"});
					$(clone).find(".submit_wrapper").css({"display":"none"});
					$(clone).find(".status .accept .score").html($this.sc_data[$this.count]["grade"]);
				}

				if($this.sc_data[$this.count]["grade"]!=-1){
					$this.total_score = parseInt($this.total_score) + parseInt($this.sc_data[$this.count]["grade"]);	
					if($this.sc_data[$this.count]["grade"]<$this.sc_data[$this.count]["pass_grade"]){
						$(clone).find(".status .reject").css({"display":"block"});
						$(clone).find(".status .reject .score").html($this.sc_data[$this.count]["grade"]);
					}
				}
			}
			else{
				$(clone).find(".upload_wrapper").css({"display":"block"});
				$(clone).find(".thumb_profile").css({"display":"none"});
			}

			document.getElementById(id_file).onchange = function () {
				$(clone).find(".upload_wrapper").css({"display":"none"});
				$(clone).find(".thumb_profile").css({"display":"block"});

			    var form = $(this).parents("form");
			    var url_upload = "";
			    if(!$this.isLocal){
			    	url_upload = $(form).attr("action");
			    }
			    else{
			    	url_upload = "http://localhost/CIMB_1101.11/";
			    }

				$(form).find(".progress-bar").css({"width":"0%"});
				$(form).find("input[type='submit']").css({"display":"none"});
				$(form).find("#progress").css({"display":"block"});

				$.ajax({
					xhr: function() {
				        var xhr = new window.XMLHttpRequest();
				        xhr.upload.addEventListener("progress", function(evt) {
				            if (evt.lengthComputable) {
				                var percentComplete = evt.loaded / evt.total;
				                //Do something with upload progress here
				                $(form).find(".progress-bar").css({"width":(percentComplete*100)+"%"});
				            }
				       }, false);

				       return xhr;
				    },
					url: url_upload+"upload.php",
					type: "POST",             // Type of request to be send, called as method
					data: new FormData($(form)[0]), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
					contentType: false,       // The content type used when sending data to the server.
					cache: false,             // To unable request pages to be cached
					processData:false,        // To send DOMDocument or non processed data file it is set to false
					dataType: 'json',
					success: function(data) {
						if(data["status"] == "success"){
							$(form).find("#progress").css({"display":"none"});
							$(form).find(".upload_wrapper").css({"display":"none"});

							$(form).find(".img_result img").attr("src",url_upload+data["message"]);
							
							var res = {
								activityid:$this.ldata[$(form).attr("index")]["activityid"],
								activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
								activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
								activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
								activity_response:url_upload+data["message"],
								grade:-1,
								pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
								grade_type:$this.ldata[$(form).attr("index")]["grade_type"]
							};

							$this.sc_data[$(form).attr("index")] = res;
							console.log($this.sc_data);

							if(!$this.isLocal){
								$this.scorm.set("cmi.suspend_data",JSON.stringify($this.sc_data));
								pipwerks.SCORM.save();
							}
						}
					}
				});	
			};	
		}
		
		$this.count = parseInt($this.count)+1;
		if($this.count<challange.length){
			$this.loadContent();
		}
		else{
			$this.setTrigger();
		}

		$(clone).on('.panel-heading','click', function () {
		    $(this).find('.panel-collapse').collapse('toggle');
		});

		$(".total_score").html($this.total_score);
	},'html');
};

Modul.prototype.setTrigger = function() {
	var $this = this;
	$("#content").on('click',".close",function(e){
		$this.audioButton.play();
		$(this).parents("form").find(".img_result img").attr("src","#");
		$(this).parents("form")[0].reset();
		$(this).parents("form").find("input[name='user_id']").val($this.username);
		$(this).parents("form").find("input[name='cmid']").val($this.module_id);
		$(this).parents("form").find("input[name='activityid']").val($this.ldata[$(this).parents("form").attr("index")]["activityid"]);

		$(this).parents(".panel-default").find(".upload_wrapper").css({"display":"block"});
		$(this).parents(".panel-default").find(".thumb_profile").css({"display":"none"});
		$(this).parents(".panel-default").find("#progress").css({"display":"none"});
	});
};


Modul.prototype.setStatus = function(value) {
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
		 console.log("Error: Course could not be set to complete!");
   
	  }
   
   //If the course isn't connected to the LMS for some reason...
   } else {
   
	  //alert the user and close the course window
	  console.log("Error: Course is not connected to the LMS");
   
   }

}