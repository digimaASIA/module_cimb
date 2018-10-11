var timer_interval = 0;
var beforeResult = function(){
	var $this = this;
	$this.total_score = 0;
	$this.curr_review = "";
	this.tipe_review = "bertingkat";
}

beforeResult.prototype.init = function() {
	console.log('beforeResult init');
	var $this = this;
    /*game data*/
	$this.game_data = game.game_data;
	$this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 1);
    // console.log('category_game: '+$this.category_game);
    $this.life = ($this.game_data['life'] != undefined ? $this.game_data['life'] : game.life_max);
    /*end game data*/
    // localStorage.setItem("isViewVideo", false);
    // $this.isViewVideo = localStorage.getItem("isViewVideo");
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];   
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.curr_soal=game.current_challenge;
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

    // $.get("config/setting_quiz_"+$this.category_game+".json",function(e){
    //     console.log(e);
    //     console.log('$this.curr_soal: '+$this.curr_soal);
    //     $this.question_data = e['list_question'];
    //     $this.question_data2 = e['list_question'][$this.curr_soal];
    //     console.log($this.question_data);
    //     console.log($this.question_data2);

    //     //set attr src to video
    //     if($this.mode == 2){
    //         $("#video-1 source").attr('src', 'assets/video/sample_video.mp4');
    //     }

    //     // setting timer game per soal
    //     $this.isTimer = (e["settings"]["duration"])?true:false;
    //     $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;

    // 	$this.mulai_game();
    // },'json');

    var id_video;
    if($this.game_data['last_score'] == 100){
        id_video = 1; //id video win
    }else{
        id_video = 2; //id video lose
    }

    $(document).ready(function(){
        // console.log('id_video: '+id_video);
        // var video = $("#video-"+id_video)[0];
        var video = document.getElementById("video-"+id_video);

        function addEvent(){
            console.log('addEvent');

            $(".video").click(function(e){
                $(this).off();

                $(".btn-close").hide(); 
                    
                // console.log($("#video-"+id_video));
                // console.log($("#video-"+id_video)[0]);
                // console.log($("#video-"+id_video)['context']);
                // console.log(video);
                video_duration = video.duration;
                contentTimeout = video_duration * 1000;
                // console.log(video_duration);
                // console.log('isViewVideo: '+$this.isViewVideo);
                // console.log(game.video_duration);
                // if($this.isViewVideo == true){
                //     if(!isNaN(video_duration)){
                //             video.currentTime = video_duration;
                //     }else{
                //         video.currentTime = game.video_duration;
                //     }
                //     contentTimeout = 100;
                //     console.log(contentTimeout);
                //     // localStorage.setItem("isViewVideo", true);
                //     // game.isViewVideo = true;
                // }else{
                //     //set value
                //     game.video_duration = video_duration;
                // }
                console.log(video_duration);
                video.currentTime = video_duration;
                console.log(contentTimeout);
                // console.log(game.isViewVideo);
                //show quiz content in decision time
                setTimeout(function(){ 
                //     showContentVideo(1);
                //     opacityVideo(1, id_video);
                    $("video").get(0).pause();
                    opacityVideo(1,id_video);
                    $this.result();
                    // game.setSlide(4);

                //     $('.video_header_wrapper').show();

                //     // start timer playing game 
                //     if($this.isTimer){
                //         $this.startGameTimer();
                //     }
                    // game.setSlide(4);
                }, contentTimeout);

                // var lengthOfVideo = video.duration();
                $("#video .btn-close").click(function(e){
                    $(this).off();
                    $this.stopVideo(id_video);
                    addEvent();
                });
                $this.playVideo(id_video);

                console.log('hasAttribute');
                console.log(video);
                console.log(video.hasAttribute("controls"));
                if(video.hasAttribute("controls")) {
                    video.removeAttribute("controls")   
                } else {
                    video.setAttribute("controls","controls")   
                }

                // if($this.isViewVideo == false){
                //     $this.showModal();
                // }else{
                //     game.audio.audioButton.play();
                //     $('.modal#tutorial').hide();
                //     $(".video").click();
                // }
            });
        }
      
        addEvent();
        $('.loader_image_index').show();
        $this.interval_video = setInterval(function(){ 
            var readyState = video.readyState;
            if(readyState == 4){
                clearInterval($this.interval_video);
                $('.loader_image_index').hide();
                $(".video").click();
            }
        },800);
    });
};

beforeResult.prototype.result = function(){
    console.log('result');
    var $this = this;
    var score = game.game_data['last_score'];
    // var score = 100;
    console.log(score);
    // count score range 0-100 for save to cmi.raw.score
    // var count = score/game.max_score*100;
    // for score in text
    // $(".txt_score").html(score);
    // save score to to cmi.raw.score
    // game.scorm_helper.sendResult(count);
    game.scorm_helper.sendResult(score);
    $('.result').show();
    game.isViewVideo = false;
    // set duration and save to scorm
    // game.scorm_helper.setDuration();
    // if score larger than minimum grade
    if(score >= 75){
        // set to win
        game.audio.audioMenang.play();
        game.scorm_helper.setStatus("passed");
        $('.btn-next-tryagain').hide();
        $('.btn-next-result').show();
        // $(".btn-next-result").css({"display":"block"});
        // $(".slider-content").addClass("win");
        // $(".title-result").html("Congratulations!");
        // go to next slide
        $(".btn-next-tryagain").click(function(e){
            // console.log('test');
            game.audio.audioButton.play();
            $(this).off();
            $this.setGameData2();
            game.setSlide(2);
        });

        $(".btn-next-result").click(function(e){
            game.audio.audioButton.play();
            $(this).off();
            $this.setGameData3();
            game.setSlide(1);
        });
    }else{
        // set to lose
        game.scorm_helper.setStatus("failed");
        game.audio.audioKalah.play();
        $(".img-menang").hide();
        $(".img-kalah").show();
        $(".text_button_wrapper").show();
        // $(".btn-tryagain").css({"display":"block"});
        // $(".slider-content").addClass("lose");
        // $(".title-result").html("Keep Trying!");
        // click try again button
        // $(".btn-tryagain").click(function(e){
        //     game.audio.audioButton.play();
        //     try{
        //         var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
        //         btn_back.click();
        //     }
        //     catch(e){
        //         top.window.close();
        //     }
        // });

        $(".btn-next-tryagain").click(function(e){
            // console.log('test');
            game.audio.audioButton.play();
            $(this).off();
            $this.setGameData();
            game.setSlide(1);
        });
    }
}

beforeResult.prototype.mulai_game = function(){
    console.log('mulai_game');
	var $this = this;

    // ambil permainan terakhir user
    var ldata = (game.scorm_helper.getLastGame("game1") == undefined ? [] : game.scorm_helper.getLastGame("game1"));
    console.log(ldata);
    // baru pertama kali mulai atau resume
    if(game.startGame == 1 || ldata["answer"]== undefined || ldata["answer"]== null || (game.startGame == 0 && ldata["answer"].length < $this.question_data.length)){
        $(document).ready(function(){
            var id_video = $this.curr_soal + 1;
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
                                    video.currentTime = video_duration;
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
                            $this.stopVideo(id_video);
                            addEvent();
                        });
                        $this.playVideo(id_video);

                        console.log('hasAttribute');
                        console.log(video);
                        console.log(video.hasAttribute("controls"));
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
                                    $this.stopVideo();
                                    addEvent();
                                });
                                $this.playVideo(id_video);

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

                if($this.isViewVideo == false){
                    $this.showModal();
                }else{
                    game.audio.audioButton.play();
                    $('.modal#tutorial').hide();
                    $(".video").click();
                }
            }
          
            addEvent();
            	// $this.playVideo('video-2');
            // $('.btn-y').click(function(){
            //     $('.video_btn_wrapper').hide();
            //     $('.video_desc_wrapper').hide();
            //     opacityVideo(0);
            //     $this.playVideo(1);
            // });

            // $('.btn-n').click(function(){
            //     $('.video_btn_wrapper').hide();
            //     // $this.stopVideo();
            //     showContentVideo(0);
            //     $("#video .btn-close").click();
            // });

            // $('.btn-change').click(function(){
            // 	showContentVideo(0);
            // 	$("#video-1")[0].removeAttribute("controls");
            // 	// $("#video .btn-close").click();
            // 	$this.stopVideo();
            // 	$('video#video-1').hide();
            // 	$this.playVideo(2);
            // });

            
            $('.btn_tutorial_mc').click(function(e){
                // console.log('test');
                game.audio.audioButton.play();
                $('.modal#tutorial').hide();
                $(".video").click();

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
beforeResult.prototype.showQuestion = function() {
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

beforeResult.prototype.getQuestion = function() {
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

beforeResult.prototype.settingPage = function($clone) {
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
beforeResult.prototype.cekJawaban = function($clone,$type) {
    console.log('cekJawaban');
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
    if($flag==0){
        game.scorm_helper.pushAnswer(1,response);
        game.audio.audioBenar.play();
        // $(".alert").addClass("benar");
        // $this.currAnswer = 0;
       
        //set last challenge
        game.game_data['last_challenge'] = parseInt($this.curr_soal)+1;
        $this.curr_soal = game.game_data['last_challenge'];

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
        // $this.stopVideo($this.curr_soal+1);
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

beforeResult.prototype.next = function($clone,$type) {
    var $this = this;
    console.log($this.currAnswer);
    // if( $this.currAnswer == 1){
        game.setSlide(2);
    // }
};

beforeResult.prototype.show_life = function() {
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

beforeResult.prototype.count_life = function(val) {
    var $this = this;
    if(val == false){
        $this.life -= 1;
    }

    game.game_data['life'] = $this.life;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

beforeResult.prototype.startGameTimer = function() {
    var $this = this;
    if(!$this.isStartTime){
        $this.isStartTime = true;
        if($this.isTimer){
            timer_interval = setInterval(function() {
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

                    //show modal feedback for answer false
                    $this.time_feedback = setTimeout(function() {
                        $this.showModalFeedback(0);
                        $(".alert").addClass("salah");

                    },800);

                    //add event click close_feedback
                    $this.close_feedback(0);

                }
            },1000);
        }
    }
};

beforeResult.prototype.setTimer = function() {
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

beforeResult.prototype.showModal = function() {
    console.log('showModal');
    $('.modal#tutorial').show();
    $('.tutorial.mc').addClass('active');
};

beforeResult.prototype.playVideo = function (id){
    console.log($("video"));
    console.log($("video#video-"+id));
    $("#video").show();
    $("video#video-"+id).show();
    // $("video#video-"+id).get(0).play();
    // console.log($("video").get(id-1));
    // console.log($("video").get(1));
    $("video").get(id-1).play();
}

beforeResult.prototype.stopVideo = function (id){
    $("#video").hide();
    $("#video-"+id)[0].pause();
    $("#video-"+id)[0].currentTime = 0;
}

beforeResult.prototype.pauseVideo = function (){
    $("video-1")[0].pause();
}

//set opacity video
beforeResult.prototype.opacityVideo = function (val, id){
    $('video#video').hide();
    if(val == 1){
        $('video#video-'+id).css('opacity', '0.3');
    }else{
        $('video#video-'+id).css('opacity', 'unset');
    }
}

//show hide video
beforeResult.prototype.showContentVideo = function (val){
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

showContentVideo.resetValue = function (){
    game.video_duration = 0;
}

beforeResult.prototype.showModalFeedback = function(benar){
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

beforeResult.prototype.setFalseAnswer = function(){
    var response = $this.question_data2["question"];
    game.scorm_helper.pushAnswer(0,response);
    game.audio.audioSalah.play();
  
    //set flag view video
    game.isViewVideo = true;
};

beforeResult.prototype.close_feedback = function(benar){
    $('.close_feedback').click(function(e){
        // console.log('close_feedback');
        //remove this event handler
        $(this).off();
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

        console.log('$this.life: '+$this.life);
        if($this.life == 0){
            game.game_data['last_score'] = 0;
            game.setSlide(3);
        }else{
            console.log($this.curr_soal +" - "+$this.question_data.length);
            if(($this.curr_soal + 1) ==  $this.question_data.length){
                game.setSlide(3);
            }else{
                game.setSlide(2);
            }
        }
    });
};

beforeResult.prototype.setGameData = function(){
    var date = game.getDate2();
    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = undefined;
    game.game_data['status'] = 'lose';
    game.game_data['category_game'] = undefined;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

beforeResult.prototype.setGameData2 = function(){
    var date = game.getDate2();

    //set game log
    var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log'])
    var game_log = {
        "category_game" : game.game_data['category_game'],
        "score"         : game.game_data['last_score'],
        "start_date"    : game.game_data['start_date'],
        "last_life"     : game.game_data['last_life']
    };
    last_game_log.push(game_log);

    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = undefined;
    game.game_data['game_log'] = last_game_log;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

//set game data win
beforeResult.prototype.setGameData3 = function(){
    var date = game.getDate2();

    //set game log
    var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log'])
    var game_log = {
        "category_game" : game.game_data['category_game'],
        "score"         : game.game_data['last_score'],
        "start_date"    : game.game_data['start_date'],
        "last_life"     : game.game_data['last_life']
    };
    last_game_log.push(game_log);

    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = undefined;
    game.game_data['category_game'] = undefined;
    game.game_data['game_log'] = last_game_log;
    game.game_data['status'] = 'win';
    game.scorm_helper.setSingleData('game_data', game.game_data);
}