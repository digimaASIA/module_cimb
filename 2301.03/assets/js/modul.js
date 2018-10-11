var timer_interval = 0;
var Modul = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

Modul.prototype.init = function() {
	console.log('Modul init');
	var $this = this;
    /*game data*/
	$this.game_data = game.game_data;
	$this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 1);
    // console.log('category_game: '+$this.category_game);
    $this.life = ($this.game_data['last_life'] != undefined ? $this.game_data['last_life'] : game.life_max);
    /*end game data*/
    // localStorage.setItem("isViewVideo", false);
    // $this.isViewVideo = localStorage.getItem("isViewVideo");
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];   
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.curr_soal= game.current_challenge;
    console.log($this.game_data);
    console.log(game.current_challenge);
    $this.isRand = false;
    $this.isTimer = false;
    $this.countTime = 300;
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"];
    $this.slide_content = $(".slider-content-video").clone();
    $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();
    // $this.num_bullet = $this.slide_content.find(".num_bullet").first().clone();
    $this.mode = 1;
    $this.currAnswer = 0;
    $this.time = 0;

    $.get("config/setting_quiz_"+$this.category_game+".json",function(e){
        console.log(e);
        console.log('$this.curr_soal: '+$this.curr_soal);
        $this.question_data = e['list_question'];
        $this.question_data2 = e['list_question'][$this.curr_soal];
        console.log($this.question_data);
        console.log($this.question_data2);

        //set attr src to video
        if($this.mode == 2){
            $("#video-1 source").attr('src', 'assets/video/sample_video.mp4');
        }

    	// $(".btn_submit").click(function(e){
    	// 	$('#popupdialogbox').modal('hide');
    	// 	// var id = e.target.id;
    	// 	var id = $('.selected').attr('id');
    	// 	console.log(id);
    	// 	if(id != undefined){
    	// 		id = id.split('_');
    	// 		//set category_game
    	// 		game_data['category_game'] = id[1];
    	// 		//set start date play
    	// 		var date = game.getDate2();
    	// 		game_data['start_date'] = date;
    	// 		console.log(game_data);
    	// 		game.scorm_helper.setSingleData('game_data', game_data);
    	// 		game.nextSlide();
    	// 	}else{
    	// 		alert('Harap pilih jabatan Anda!');
    	// 	}
    	// });

    	// var clone_video = $("#video").clone();
    	// console.log(clone_video);

        // setting timer game per soal
        $this.isTimer = (e["settings"]["duration"])?true:false;
        $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;

    	$this.mulai_game();
    },'json');
};


Modul.prototype.mulai_game = function(){
    console.log('mulai_game');
	var $this = this;

    // ambil permainan terakhir user
    var ldata = (game.scorm_helper.getLastGame("game1") == undefined ? [] : game.scorm_helper.getLastGame("game1"));
    console.log(ldata);
    // baru pertama kali mulai atau resume
    if(game.startGame == 1 || ldata["answer"]== undefined || ldata["answer"]== null || (game.startGame == 0 && ldata["answer"].length < $this.question_data.length)){
        $(document).ready(function(){
            $('.video_div').html('');
            $this.ldata2 = $this.question_data2;
            console.log($this.ldata2);
            var id_video = $this.curr_soal + 1;

            // for (var i = 0; i < $this.ldata.length; i++) {
                var video1 = $('<video />', {
                    id: 'video-'+id_video,
                    src: 'assets/video/'+$this.ldata2['video'],
                    type: 'video/mp4',
                    controls: true
                });
                video1.appendTo($('.video_div'));
                video1.css('display', 'none');

                var video_feedback = $('<video />', {
                    id: 'video_feedback-1',
                    src: 'assets/video/'+$this.ldata2['video_feedback'],
                    type: 'video/mp4',
                    controls: true
                });
                video_feedback.appendTo($('.video_div'));
                video_feedback.css('display', 'none')
            // }

            console.log('id_video: '+id_video);
            // var video = $("#video-"+id_video)[0];
            var video = document.getElementById("video-"+id_video);

            function addEvent(){
                console.log('addEvent');
                console.log('isViewVideo: '+$this.isViewVideo);

                $(".video").click(function(e){
                    $(this).off();

                    $(".btn-close").hide(); 
                    
                    if($this.mode == 1){
                        console.log($("#video-"+id_video));
                        console.log($("#video-"+id_video)[0]);
                        console.log($("#video-"+id_video)['context']);
                        console.log(video);
                        video_duration = video.duration;
                        contentTimeout = video_duration * 1000;
                        console.log(video_duration);
                        console.log('isViewVideo: '+$this.isViewVideo);
                        console.log(game.video_duration);
                        if($this.isViewVideo == true){
                            if(!isNaN(video_duration)){
                                console.log('test');
                                video.currentTime = video_duration - 0.1;
                            }else{
                                video.currentTime = game.video_duration;
                            }
                            contentTimeout = 100;
                            console.log(contentTimeout);
                            // localStorage.setItem("isViewVideo", true);
                            // game.isViewVideo = true;
                        }else{
                            //set value
                            game.video_duration = video_duration;
                        }
                        console.log(game.video_duration);

                        console.log(contentTimeout);
                        console.log(game.isViewVideo);

                        //play video
                        playVideo(id_video);

                        //show quiz content in decision time
                        setTimeout(function(){ 
                            showContentVideo(1);
                            opacityVideo(1, id_video);
                            $("video").get(0).pause();

                            $('.video_header_wrapper').show();

                            // start timer playing game 
                            if($this.isTimer){
                                $this.startGameTimer();
                            }
                        }, contentTimeout);

                        // var lengthOfVideo = video.duration();
                        $("#video .btn-close").click(function(e){
                            $(this).off();
                            stopVideo(id_video);
                            addEvent();
                        });

                        // console.log('hasAttribute');
                        // console.log(video);
                        // console.log(video.hasAttribute("controls"));
                        if(video.hasAttribute("controls")) {
                            video.removeAttribute("controls")   
                        } else {
                            video.setAttribute("controls","controls")   
                        }
                    }else if(mode == 2){
                        window.setInterval(function(t){
                            var video = $("#video-"+id_video)[0];
                            console.log(video);
                            console.log(video.readyState);
                            if (video.readyState > 0) {
                                console.log(video);
                                video_duration = video.duration;
                                contentTimeout = video_duration * 1000;
                                console.log(parseFloat(video_duration));
                                console.log('isViewVideo: '+$this.isViewVideo);
                                if($this.isViewVideo == 'true'){
                                    video.currentTime = video_duration;
                                    contentTimeout = 100;
                                    console.log(contentTimeout);
                                    // localStorage.setItem("isViewVideo", true);
                                    // game.isViewVideo = true;
                                }
                                console.log(contentTimeout);
                                setTimeout(function(){ 
                                    showContentVideo(1);
                                    $("video").get(0).pause();
                                }, contentTimeout);

                                // var lengthOfVideo = video.duration();
                                $("#video .btn-close").click(function(e){
                                    $(this).off();
                                    stopVideo();
                                    addEvent();
                                });
                                playVideo(id_video);

                                console.log('hasAttribute');
                                console.log(video);
                                console.log(video.hasAttribute("controls"));
                                if(video.hasAttribute("controls")) {
                                    video.removeAttribute("controls")   
                                } else {
                                    video.setAttribute("controls","controls")   
                                }
                            }
                        },5000);

                        var myVideoPlayer = document.getElementById('video-1');
                        console.log(myVideoPlayer);
                        myVideoPlayer.addEventListener('loadedmetadata', function() {
                            console.log(myVideoPlayer.duration);
                        });
                    }

                    $this.show_life();
                });

                if($this.isViewVideo == false && id_video == 1){
                    $this.showModal();
                }else{
                    // game.audio.audioButton.play();
                    $('.modal#tutorial').hide();
                    $('.loader_image_index').show();
                    $this.interval_video = setInterval(function(){ 
                        var readyState = video.readyState;
                        if(readyState == 4){
                            clearInterval($this.interval_video);
                            $(".video").click();
                            $('.loader_image_index').hide();
                        }
                    },900);
                }
                console.log(($this.curr_soal + 1)+' - '+$this.question_data.length);
                if(($this.curr_soal + 1) == $this.question_data.length){
                    if(game.game_data['last_score'] != undefined){
                        console.log('test');
                        $('.modal#tutorial').hide();
                        $('.tutorial.mc').removeClass('active');
                        $this.resetValue();
                        game.setSlide(3);
                        return;
                    }
                }
            }
          
            addEvent();
            	// playVideo('video-2');
            // $('.btn-y').click(function(){
            //     $('.video_btn_wrapper').hide();
            //     $('.video_desc_wrapper').hide();
            //     opacityVideo(0);
            //     playVideo(1);
            // });

            // $('.btn-n').click(function(){
            //     $('.video_btn_wrapper').hide();
            //     // stopVideo();
            //     showContentVideo(0);
            //     $("#video .btn-close").click();
            // });

            // $('.btn-change').click(function(){
            // 	showContentVideo(0);
            // 	$("#video-1")[0].removeAttribute("controls");
            // 	// $("#video .btn-close").click();
            // 	stopVideo();
            // 	$('video#video-1').hide();
            // 	playVideo(2);
            // });

            
            $('.btn_tutorial_mc').click(function(e){
                // console.log('test');
                game.audio.audioButton.play();
                $('.modal#tutorial').hide();
                $('.tutorial.mc').removeClass('active');

                $this.time_videoplay = setTimeout(function() {
                    $(".video").click();
                },900);
            });

            $('.icon_tutorial').click(function(e){
                clearInterval(timer_interval);
                $this.isStartTime = false;
                game.audio.audioButton.play();
                $this.showModal();

                $('.btn_tutorial_mc').click(function(e){
                    if($this.isTimer){
                        console.log($this.isStartTime);
                        $this.startGameTimer();
                    }
                    $('.modal#tutorial').hide();
                    $('.tutorial.mc').removeClass('active');
                });
            });
        });

        var sdata = game.scorm_helper.setQuizData("game1",$this.getQuestion());
        console.log(sdata);
        // $this.curr_soal = sdata["answer"].length;
        $this.showQuestion();
    }
    else{
        // sudah selesai quiz
        game.nextSlide();
    }
}

//fungsi menampilkan soal dan pertanyaan
Modul.prototype.showQuestion = function() {
    var $this = this;

    var $clone = $this.slide_content.clone();
    // console.log($clone);
    $('#content-video').html('');
    $clone.find(".curr_soal").html(parseInt($this.curr_soal+1));
    $clone.find(".total_soal").html($this.question_data.length);
    $clone.find(".text_question").html($this.question_data[$this.curr_soal]["question"]);
    // $(".text_time").html($this.setTimer());
    $clone.find(".pilihan_wrapper").html("");
    $clone.find(".bullet.number").html("");

    // random pilihan
    var arr = [];
    var arr_rand = [];

    for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
        arr.push(i);
    }
    console.log('$this.curr_soal: '+$this.curr_soal);
    for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
        var rand = Math.floor((Math.random() * (arr.length-1)));
        arr_rand.push(arr[rand]);
        arr.splice(rand, 1);
    }
    // console.log($this.pilihan_wrap);
    for (var i = 0; i < arr_rand.length; i++) {
        $app_pilihan = $this.pilihan_wrap.clone();
        // $num_bullet = $this.num_bullet.clone();

        // $($num_bullet).find("span").html(i+1);
        $app_pilihan.find(".txt_pilihan").html($this.question_data[$this.curr_soal]["pilihan"][arr_rand[i]]["text"]);
        $app_pilihan.find(".pilihan").attr("index",$this.question_data[$this.curr_soal]["pilihan"][arr_rand[i]]["index"]);
        
        // jika pilihan multiple choice
        if($this.question_data[$this.curr_soal]["type"] == "mc"){
            $($app_pilihan).addClass("mc");
            $($app_pilihan).find(".bul_abjad").html($this.arr_alphabet[i]);
        }
        else if($this.question_data[$this.curr_soal]["type"] == "mmc"){
            // jika pilihan multiple multiple choice
            $($app_pilihan).addClass("mmc");
        }

        // append ke pilihan wrapper
        $clone.find(".pilihan_wrapper").append($app_pilihan);
        // $clone.find(".bullet.number").append($num_bullet);
    }
    
    $($clone).addClass($this.question_data[$this.curr_soal]["type"]);
    // console.log($clone);
    $("#content-video").append($clone);
    $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.curr_soal);
    $($clone).attr("curr_soal",$this.curr_soal);

    // panggil jquery mobile untuk setting swipe (di panggil saat pertama kali/1x)
    console.log($this.isAppend);
    if($this.isAppend == 0){
        $this.isAppend = 1;
        // $this.setTutorial();
        $.getScript( "assets/js/jquery.mobile-1.4.5.min.js", function( data, textStatus, jqxhr ) {
            $this.settingPage($clone);
        });
    }
    else{
        $this.settingPage($clone);
    }
};

Modul.prototype.getQuestion = function() {
    var $this = this;
    var arr_quest = [];
    var arr = [];
    for (var i = 0; i < $this.question_data.length; i++) {
        arr.push(i);
    }

    if($this.isRand == true){
        do{
            var rand = Math.ceil(Math.random()*(arr.length-1));
            arr_quest.push(arr[rand]);
            arr.splice(rand,1);
        }while(arr.length>0);
    }
    else{
        arr_quest = arr;
    }
    return arr_quest;
};

Modul.prototype.settingPage = function($clone) {
    console.log('settingPage');
    var $this = this;
    
    // setting prev
    if($this.curr_soal>0){
        $($clone).attr("data-prev","#slide_"+$this.attemp_soal+"_"+(parseInt($this.curr_soal)-1));   
    }else{
        $($clone).attr("data-prev","");
    }
    // setting next
    if(parseInt($this.curr_soal)+1<$this.question_data.length){
        $($clone).attr("data-next","#slide_"+$this.attemp_soal+"_"+(parseInt($this.curr_soal)+1));
    }
    else{
        $($clone).attr("data-next","#result");
    }

    // change to first question
    if($this.curr_soal == 0){
        $.mobile.changePage( "#slide_"+$this.attemp_soal+"_"+$this.curr_soal, { transition: "none"} );
    }
    // swipe left
    $($clone).swipeleft(function( event ) {
        $this.next();  
    });
    // click button next-soal
    $($clone).find(".next-soal").click(function(e){
        // $this.next();
    });

    // jika tipe soalnya drag and drop sequence
    if($this.question_data[$this.curr_soal]["type"] == "dadswipe"){
        $clone.find(".pilihan_wrapper").sortable();
        // click button submit
        $($clone).find(".btn-submit").click(function(e){
            $(this).unbind();
            $(this).hide();
            //show button next-soal
            // $($clone).find(".next-soal").show();
            $clone.find(".pilihan_wrapper").sortable("disable");
            // cek jawaban
            $this.cekJawaban($(this).parents(".slider-content"),"dadswipe");

            // kasi jawaban benarnya
            $clone.find(".pilihan_wrapper").html("");
            for (var i = 0; i < $this.question_data[$($clone).attr("curr_soal")]["jawaban"].length; i++) {
                $app_pilihan = $this.pilihan_wrap.clone();
                $app_pilihan.find(".txt_pilihan").html($this.question_data[$($clone).attr("curr_soal")]["pilihan"][$this.question_data[$($clone).attr("curr_soal")]["jawaban"][i]]["text"]);
                $clone.find(".pilihan_wrapper").append($app_pilihan);
            }

        });
    }
    else if($this.question_data[$this.curr_soal]["type"] == "mc"){
        // jika tipe soalnya multiple choice
        $clone.find(".btn-submit").hide();
        // click button pilihan
        console.log($clone);
        console.log($clone.find(".pilihan"));
        $clone.find(".pilihan").click(function(e){
            // console.log('click');
            $clone.find(".pilihan").off();
            // $($clone).find(".next-soal").show();

            if(!$(this).hasClass("active")){
                $(this).addClass("active"); 
            }
            else{
                $(this).removeClass("active");  
            }

            /*clear interval*/
            clearInterval(timer_interval);
            /*end clear interval*/

            // cek jawaban
            //.parent get parent ancestor from this element
            $this.cekJawaban($(this).parents(".slider-content-video"),"mc");
        });
    }
    else if($this.question_data[$this.curr_soal]["type"] == "mmc"){
        // jika tipe nya multiple-multiple choice

        // click button pilihan
        $clone.find(".pilihan").click(function(e){
            if(!$(this).hasClass("active")){
                $(this).addClass("active"); 
            }
            else{
                $(this).removeClass("active");  
            }
        });

        // click button submit
        $($clone).find(".btn-submit").click(function(e){
            $clone.find(".pilihan").off();
            $($clone).find(".next-soal").show();
            $(this).hide();
            // cek jawaban
            $this.cekJawaban($(this).parents(".slider-content"),"mmc");
        });
    }
};

// cek jawaban
// clone -> div content parentnya (class slider-content)
// type -> tipe pertanyaannya
Modul.prototype.cekJawaban = function($clone,$type) {
    // console.log('cekJawaban');
    var $this = this;
    var $flag=0;
    // akumulasi jumlah pilihan jawaban yang benar
    var count = 0;

    // set response for cmi.interactions.n.student_response
    var response = $this.question_data[parseInt($($clone).attr("curr_soal"))]["question"];

    $($clone).find(".pilihan").each(function(index){
        // jika tipenya drag and drop sequence
        if($type == "dadswipe"){
            // jika urutannya salah
            if($(this).attr("index") != $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"][index]){
                $flag=1;
            }
        }
        else{
            // tipe lainnya jika punya class active
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                var $cek=0;
                // console.log($this.question_data);
                // console.log(parseInt($($clone).attr("curr_soal")));
                // console.log($(this).attr("index"));
                for (var i = 0; i < $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"].length; i++) {
                    if($this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"][i] == $(this).attr("index")){
                        $cek=1;
                        break;
                    }
                }
                // indexnya tidak ada di list jawaban
                if($cek == 0){
                    $flag=1;
                    $(this).addClass("wrong");
                }
                else{
                    // indexnya ada di list jawaban
                    count++;
                    $(this).addClass("right");
                }
            }
        }
    });

    // jika tipenya multiple choice atau multiple-multipe choice
    if($type == "mc" || $type == "mmc"){
        // jumlah pilihan jawaban yang benar tidak sesuai 
        if(count != $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"].length){
            $flag=1;
        }
    }

    // jawabannya benar
    var curr_soal = $this.curr_soal;
    if($flag==0){
        game.scorm_helper.pushAnswer(1,response);
        game.audio.audioBenar.play();
        // $(".alert").addClass("benar");
        // $this.currAnswer = 0;
        //set flag view video
        
        //set last challenge
        game.game_data['last_challenge'] = parseInt($this.curr_soal)+1;
        $this.curr_soal = game.game_data['last_challenge'];
        console.log($this.curr_soal);
        game.scorm_helper.setSingleData('game_data', game.game_data);

        $this.resetValue();

    }
    else{ //jawaban salah
        // game.scorm_helper.pushAnswer(0,response);
        // game.audio.audioSalah.play();
        // // $(".alert").addClass("salah");
        // // $this.currAnswer = 1;
        // //set flag view video
        // game.isViewVideo = true;

        // if($this.life == 0){
        //     game.game_data['last_score'] = 0;
        // }

        $this.setFalseAnswer();
    }
    // set durasi feedback (kedip)
    $this.time_feedback = setInterval(function() {
        // $($this.curr_card).hide();
        $(".alert").removeClass("salah");
        $(".alert").removeClass("benar");
        clearInterval($this.time_feedback);
        time_feedback = null;
        
        //flag jawaban true
        //if answer true the current soal increment 1
        // $(".modal#modal_feedback").find(".title_feedback_2").hide();
        // stopVideo($this.curr_soal+1);

        //declaration video
        console.log('declaration video');
        console.log(curr_soal);
        var id_video_before = curr_soal + 1;
        var id_video = 1;
        var video = document.getElementById('video_feedback-'+id_video);
        var contentTimeout = video.duration * 1000;
         //call function show video feedback quiz
        $this.showVideoFeedback(id_video_before, id_video, video);
        // stopVideo(id_video_before);
        // opacityVideo(0, id_video, 'feedback');
        // $('#content-video').hide();
        // $('video#video-'+id_video_before).hide();
        // playVideo(id_video, 'feedback');

        // if(video.hasAttribute("controls")) {
        //     video.removeAttribute("controls")   
        // } else {
        //     video.setAttribute("controls","controls")   
        // }

        //set timeout to show
        setTimeout(function(){ 
            //set timeout to show
            // opacityVideo(1, id_video, 'feedback');
            $("#video_feedback-"+id_video)[0].pause();
            $('.icon_tutorial').show();

            if($flag==0){
                // $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data2['feedback_true']);
                // $(".modal#modal_feedback").find(".benar").show();
                // $('.modal#modal_feedback').modal('show');

                $this.showModalFeedback(1);
                $(".alert").addClass("benar");
            }else{
                // $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data2['feedback_false']);
                // $(".modal#modal_feedback").find(".salah").show();
                // $('.modal#modal_feedback').modal('show');
                $this.showModalFeedback(0);
                $(".alert").addClass("salah");
            }
        }, contentTimeout);
        // set soal berikutnya
        // if($this.curr_soal<$this.question_data.length){
        //     console.log('showQuestion');
        //     $this.showQuestion();   
        // }

        //show modal feedback
        // $('.modal#modal_feedback').modal('show');

        // $('.close_feedback').click(function(e){
        //     // console.log('close_feedback');
        //     //remove this event handler
        //     $(this).off();
        //     //flag jawaban true
        //     if($flag==0){
                
        //     }else{
        //         $this.count_life(false);
        //     }

        //     $('.modal#modal_feedback').modal('hide');

        //     $(".alert").removeClass("salah");
        //     $(".alert").removeClass("benar");

        //     game.scorm_helper.setSingleData('game_data', game.game_data);
        //     //if soal sudah sampai soal terakhir dari data di json
        //     if(($this.curr_soal + 1) ==  $this.question_data.length){
        //         game.setSlide(3);
        //     }else{
        //         game.setSlide(2);
        //     }
        // });

        var benar = ($flag == 0 ? 1 : 0);
        $this.close_feedback(benar);
    },800);
    // next page soal berikutnya aktif
    $(".button_next_page").addClass("active");
};

Modul.prototype.next = function($clone,$type) {
    var $this = this;
    console.log($this.currAnswer);
    // if( $this.currAnswer == 1){
        game.setSlide(2);
    // }
};

Modul.prototype.show_life = function() {
    var $this = this;
    var count_star = 0;
    var time_star = setInterval(function() {
        count_star++;
        if(count_star <= game.life_max){
            if(count_star<=$this.life){
                $(".star-wrapper .star:nth-child("+count_star+")").addClass("active");  
            }
            $(".star-wrapper .star:nth-child("+count_star+")").fadeIn(1000);
            $(".star-wrapper .star:nth-child("+count_star+")").css({"display":"inline-block"});
            
        }
        else{
            clearInterval(time_star);
        }
    },200); 
};

Modul.prototype.count_life = function(val) {
    var $this = this;
    if(val == false){
        $this.life -= 1;
    }

    game.game_data['last_life'] = $this.life;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

Modul.prototype.startGameTimer = function() {
    var $this = this;
    // console.log($this.isStartTime);
    if(!$this.isStartTime){
        // console.log('test');
        $this.isStartTime = true;
        if($this.isTimer){
            timer_interval = setInterval(function() {
                // console.log($this.countTime);
                if($this.countTime>0){
                    $(".timer .text_time").html($this.setTimer());
                }
                else{
                    clearInterval(timer_interval);
                    $this.time = null;
                    $(".timer .text_time").html("00:00");

                    /* 
                        temp: 
                            1: menandakan akan main game baru
                            2: menandakan sudah main game tersebut
                    */
                    // game.scorm_helper.setSingleData("temp",0);
                    // game.nextSlide();

                    /*set action when answer false*/
                    $this.setFalseAnswer();
                    /*end set action when answer false*/

                    //declaration video
                    // console.log('declaration video');
                    var curr_soal = $this.curr_soal;
                    console.log(curr_soal);
                    var id_video_before = curr_soal + 1;
                    var id_video = 1;
                    var video = document.getElementById('video_feedback-'+id_video);
                    var contentTimeout = video.duration * 1000;
                     //call function show video feedback quiz
                    $this.showVideoFeedback(id_video_before, id_video, video);

                    //show modal feedback for answer false
                    $this.time_feedback = setTimeout(function() {
                        $this.showModalFeedback(0);
                        $(".alert").addClass("salah");
                        $('.icon_tutorial').show();

                    },contentTimeout);

                    //add event click close_feedback
                    $this.close_feedback(0);

                }
            },1000);
        }
    }
};

Modul.prototype.setTimer = function() {
    $this = this;
    
    $this.countTime = $this.countTime-1;
    var diffMunites = Math.floor($this.countTime/60);
    var diffSec = Math.floor($this.countTime%60);
    // console.log('diffMunites: '+diffMunites);
    // console.log('diffSec: '+diffSec);
    var str = '';
    if(diffMunites<10){
        str=str+"0"+diffMunites+":";
    }
    else if(diffMunites>=10){
        str=str+diffMunites+":";
    }

    if(diffSec<10){
        str=str+"0"+diffSec;
    }
    else if(diffSec>=10){
        str=str+diffSec;
    }

    return str;
};

Modul.prototype.showModal = function() {
    // console.log('showModal');
    $('.modal#tutorial').show();
    $('.tutorial.mc').addClass('active');
};

function playVideo(id, type = ''){
    // console.log($("video"));
    // console.log($("video#video-"+id));
    $("#video").show();

    //set prefix id video
    var prefix_id = 'video';
    if(type == 'feedback'){
        prefix_id = 'video_feedback';
    }
    console.log("video#"+prefix_id+"-"+id)
    $("video#"+prefix_id+"-"+id).show();
    // $("video#video-"+id).get(0).play();
    // console.log($("video").get(id-1));
    // console.log($("video").get(1));
    // $("video").get(id-1).play();
    $("video#"+prefix_id+"-"+id)[0].play();
}

function stopVideo(id){
    console.log('stopVideo: '+id);
    $("#video").hide();
    $("#video-"+id)[0].pause();
    $("#video-"+id)[0].currentTime = 0;
}

function pauseVideo(){
    $("video-1")[0].pause();
}

//set opacity video
function opacityVideo(val, id, type = ''){
    $('video#video').hide();

    var prefix_id = 'video';
    if(type == 'feedback'){
        prefix_id = 'video_feedback';
    }

    if(val == 1){
        $('video#'+prefix_id+'-'+id).css('opacity', '0.3');
    }else{
        $('video#'+prefix_id+'-'+id).css('opacity', 'unset');
    }
}

//show hide video
function showContentVideo(val){
    if(val == 1){
        $('.video_btn_wrapper').show(); 
        // $('.video_desc_wrapper').show(); 
        // opacityVideo(1);
    }else{
        $('.video_btn_wrapper').hide(); 
        // $('.video_desc_wrapper').hide(); 
        // opacityVideo(0);
    }
}

Modul.prototype.resetValue = function(){
    game.video_duration = 0;
    game.isViewVideo = false;
}

Modul.prototype.showModalFeedback = function(benar){
    var $this = this;
    $(".modal#modal_feedback").find(".title_feedback_2").hide();
    // stopVideo($this.curr_soal+1);
    if(benar==1){
        // console.log('$this.curr_soal: '+$this.curr_soal);
        // console.log($this.question_data2);
        // console.log($this.question_data2['feedback_true']);
        $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data2['feedback_true']);
        $(".modal#modal_feedback").find(".benar").show();
        $('.modal#modal_feedback').modal('show');
    }else{
        $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data2['feedback_false']);
        $(".modal#modal_feedback").find(".salah").show();
        $('.modal#modal_feedback').modal('show');
    }
}

Modul.prototype.setFalseAnswer = function(){
    var $this = this;

    var response = $this.question_data2["question"];
    game.scorm_helper.pushAnswer(0,response);
    game.audio.audioSalah.play();
  
    //set flag view video
    game.isViewVideo = true;
};

Modul.prototype.close_feedback = function(benar){
    var $this = this;
    $('.close_feedback').click(function(e){
        // console.log('close_feedback');
        //remove this event handler
        $(this).off();
        // console.log('benar: '+benar);
        //flag jawaban true
        if(benar==1){
            
        }else{
            $this.count_life(false);
        }

        $('.modal#modal_feedback').modal('hide');

        $(".alert").removeClass("salah");
        $(".alert").removeClass("benar");

        game.scorm_helper.setSingleData('game_data', game.game_data);
        //if soal sudah sampai soal terakhir dari data di json

        // console.log('$this.life: '+$this.life);
        if($this.life == 0){
            //set score lsoe
            game.game_data['last_score'] = 0;
            $this.resetValue();
            game.setSlide(3);
        }else{
            console.log(($this.curr_soal+1)+" - "+$this.question_data.length);
            if(($this.curr_soal + 1) >  $this.question_data.length){
                //set score win
                game.game_data['last_score'] = 100;
                $this.resetValue();
                game.setSlide(3);
            }else{
                game.setSlide(2);
            }
        }
    });
};

//function show append conetent in video
Modul.prototype.showVideoFeedback = function(id_video_before, id_video, video){
    var $this = this;
    stopVideo(id_video_before);
    opacityVideo(0, id_video, 'feedback');
    $('#content-video').hide();
    $('.icon_tutorial').hide();
    $('video#video-'+id_video_before).hide();
    playVideo(id_video, 'feedback');

    if(video.hasAttribute("controls")) {
        video.removeAttribute("controls")   
    } else {
        video.setAttribute("controls","controls")   
    }

};