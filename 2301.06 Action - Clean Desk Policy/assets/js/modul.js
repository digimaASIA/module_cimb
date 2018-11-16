var timer_interval = 0;
var Modul = function(){
	
}

Modul.prototype.init = function(current_settings) {
	var $this = this;
    /*game data*/
    $this.current_settings = current_settings;
	$this.game_data = game.game_data;
    $this.category_game = ($this.game_data['category_game'] != undefined ? $this.game_data['category_game'] : 0);
    $this.life = ($this.game_data['last_life'] != undefined ? $this.game_data['last_life'] : game.life_max);
    /*end game data*/
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];   
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.isRand = false;
    $this.isTimer = false;
    $this.countTime = 300;
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"];
    $this.slide_content = $(".slider-content").clone();
    $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();
    $this.mode = 1;
    $this.currAnswer = 0;
    $this.time = 0;
    $this.loading_timeout = 3500;//in milisecond
    $this.item_selected = undefined; //item yang dipilih untuk ditempatkan

    $.get("config/setting_quiz_slide_"+$this.current_settings["slide"]+".json",function(e){
        console.log(e);
        $this.question_data = e['list_question'][$this.category_game];
        console.log($this.question_data);
        // setting timer game per soal
        $this.isTimer = (e["settings"]["duration"])?true:false;
        $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;

        $('.loader_image_index_bar').show();

        setTimeout(function(){
            $('.loader_image_index_bar').hide(); 
    	   $this.mulai_game();
        },$this.loading_timeout);

    },'json');
};

Modul.prototype.mulai_game = function(){
    var $this = this;

    // ambil permainan terakhir user
    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
    // baru pertama kali mulai
    if(ldata == undefined || ldata["answer"] == undefined || ldata["answer"]== null || ldata["answer"].length < $this.question_data.length){
        var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game,$this.getQuestion(),ldata);
        //show modal tutorial
        $this.showModal();
        console.log(sdata);
        $this.curr_soal = sdata["answer"].length;
        $this.ldata2 = $this.question_data[$this.curr_soal];
        // $('.video_div').html('');
        // var id_video = $this.curr_soal + 1;

        // var video1 = $('<video />', {
        //     id: 'video-'+id_video,
        //     src: 'assets/video/'+$this.ldata2['video'],
        //     type: 'video/mp4',
        //     controls: true
        // });
        // video1.appendTo($('.video_div'));
        // video1.css('display', 'none');

        // var video = document.getElementById("video-"+id_video);


        // function addEvent(){

        //     $(".video").click(function(e){
        //         $(this).off();

        //         $(".btn-close").hide(); 
                
        //         video_duration = video.duration;
        //         contentTimeout = video_duration * 1000;
        //         if($this.isViewVideo == true){
        //             if(!isNaN(video_duration)){
        //                 video.currentTime = video_duration - 0.1;
        //             }else{
        //                 video.currentTime = game.video_duration;
        //             }
        //             contentTimeout = 100;
        //         }else{
        //             //set value
        //             game.video_duration = video_duration;
        //         }

        //         //play video
        //         // $this.playVideo(id_video);

        //         //show quiz content in decision time
        //         setTimeout(function(){ 
        //             $this.showContentVideo(1);
        //             $this.opacityVideo(1, id_video);
        //             $("video").get(0).pause();

        //             $('.video_header_wrapper').show();

        //             // start timer playing game 
        //             if($this.isTimer){
        //                 $this.startGameTimer();
        //             }else{
        //                 $(".timer").hide();
        //             }
        //         }, contentTimeout);

        //         $("#video .btn-close").click(function(e){
        //             $(this).off();
        //             $this.stopVideo(id_video);
        //             addEvent();
        //         });

        //         if(video.hasAttribute("controls")) {
        //             video.removeAttribute("controls")   
        //         } else {
        //             video.setAttribute("controls","controls")   
        //         }
                
        //         $this.show_life();
        //     });

        //     /*if($this.isViewVideo == false && id_video == 1 &&){
        //         $this.showModal();
        //     }else{*/
        //         // game.audio.audioButton.play();
        //         $('.modal#tutorial').modal("hide");
        //         $('.loader_image_index').show();
        //         $this.interval_video = setInterval(function(){ 
        //             var readyState = video.readyState;
        //             if(readyState == 4){
        //                 clearInterval($this.interval_video);
        //                 $(".video").click();
        //                 $('.loader_image_index').hide();
        //             }
        //         },900);
        //     //}
        //     if(($this.curr_soal + 1) == $this.question_data.length){
        //         if(game.game_data['last_score'] != undefined){
        //             console.log('test');
        //             $('.modal#tutorial').modal("hide");
        //             $('.tutorial.mc').removeClass('active');
        //             $this.resetValue();
        //             //game.setSlide(3);
        //             return;
        //         }
        //     }
        // }
      
        // // addEvent();
        
        $('.btn_tutorial_mc').click(function(e){
            // console.log('test');
            game.audio.audioButton.play();
            $('.modal#tutorial').modal("hide");
            $('.tutorial.mc').removeClass('active');

            // $this.time_videoplay = setTimeout(function() {
            //     $(".video").click();
            // },900);
        });

        // $('.icon_tutorial').click(function(e){
        //     clearInterval(timer_interval);
        //     $this.isStartTime = false;
        //     game.audio.audioButton.play();
        //     $this.showModal();

        //     $('.btn_tutorial_mc').click(function(e){
        //         if($this.isTimer){
        //             $this.startGameTimer();
        //         }else{
        //             $(".timer").hide();
        //         }
        //         $('.modal#tutorial').modal("hide");
        //         $('.tutorial.mc').removeClass('active');
        //     });
        // });
        $this.showQuestion();
    }
    else{ //resume game
        console.log($this.curr_soal);
        game.game_data['last_score'] = 100;
        $this.setGameData3();                    
        $this.resetValue();
        $('.btn-next-tryagain').hide();
        $('.btn-next-result').show();
        $(".result").show();
        game.audio.audioMenang.play();
        $(".btn-next-result").click(function(e){
            game.setSlide(1);
        });
    }
}

//fungsi menampilkan soal dan pertanyaan
Modul.prototype.showQuestion = function() {
    var $this = this;

    var $clone = $this.slide_content.clone();
    // console.log($clone);
    console.log($this.curr_soal);
    console.log($this.ldata2);
    // $clone.find(".curr_soal").html(parseInt($this.curr_soal+1));
    // $clone.find(".total_soal").html($this.question_data.length);
    // $clone.find(".text_question").html($this.question_data[$this.curr_soal]["question"]);
    // $clone.find(".pilihan_wrapper").html("");
    // $clone.find(".bullet.number").html("");

    // random pilihan
    var arr = [];
    var arr_rand = [];

    console.log($this.ldata2['type']);
    if($this.ldata2['type'] == 'dad_item_and_place'){
        var total_curr_soal = $this.ldata2['pilihan'].length;
        var pilihan_place = $this.ldata2['pilihan_2'];
        console.log($('.item'));
        var item = $('.item').first().clone();
        var item_place = $('.item_place').first().clone();
        // $clone.find(".curr_soal").html(parseInt($this.curr_soal+1)+'/'+total_curr_soal);
        $clone.find(".text_title").html($this.ldata2["text"]);
        // $clone.find(".text_question").html($this.ldata2["question"]);
        // $clone.find(".content_dad").html("");
        // $clone.find(".bullet.number").html("");
        $('.slider-content').html('');

        for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
            arr.push(i);
        }

        // if($this.isRand == true){
        //     for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
        //         var rand = Math.floor((Math.random() * (arr.length-1)));
        //         arr_rand.push(arr[rand]);
        //         arr.splice(rand, 1);
        //     }
        // }
        arr_rand = arr;

        console.log(item);
        console.log(arr_rand);
        for (var i = 0; i < arr_rand.length; i++) {
            //append item
            $app_pilihan = item.clone();
            console.log($this.ldata2["pilihan"][i]);
            // $app_pilihan.attr("index",$this.ldata2["pilihan"][i]["index"]);
            $app_pilihan.find(".text_item").html($this.ldata2["pilihan"][i]["text"]);
            $app_pilihan.find(".img_item").attr('src', 'assets/image/game/'+$this.ldata2["pilihan"][i]["image"]);
            $app_pilihan.attr("index",$this.ldata2["pilihan"][i]["index"]);

            console.log($app_pilihan);
            // append ke pilihan wrapper
            // $clone.find(".content_dad").append($app_pilihan);
        }
        console.log(pilihan_place);
        for (var i = 0; i < pilihan_place.length; i++) {
            //append place_item
            $app_pilihan_2 = item_place.clone();
            console.log($app_pilihan_2);
            $app_pilihan_2.find(".text_item").html(pilihan_place[i]["text"]);
            $app_pilihan_2.find(".img_item").attr('src', 'assets/image/game/'+pilihan_place[i]["image"]);
            $app_pilihan_2.attr("index",pilihan_place[i]["index"]);
            console.log($app_pilihan_2);
            // $clone.find(".content_dad").append($app_pilihan_2);
        }
        
        console.log($clone);
        $($clone).addClass($this.ldata2["type"]);
        $(".slider-content").append($clone);
        $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.curr_soal);
        $($clone).attr("curr_soal",$this.curr_soal);

        //event click item
        $('.item .img_item').click(function(){
            console.log('click');
            var id = $(this).attr('id');
            id = id.split('-');
            $this.item_selected = id;
            $('.popupdialogbox_mc').show();
            $('.popupdialogbox').modal('show');
        });
    }else{
        // var total_curr_soal = $this.ldata2['pilihan'].length;
        // $clone.find(".curr_soal").html(parseInt($this.curr_soal+1)+'/'+total_curr_soal);
        // $clone.find(".text_title").html($this.ldata2["text"]);
        // $clone.find(".text_question").html($this.ldata2["question"]);
        // $clone.find(".content_dad").html("");
        // // $clone.find(".bullet.number").html("");

        // for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
        //     arr.push(i);
        // }

        // // if($this.isRand == true){
        // //     for (var i = 0; i < $this.question_data[$this.curr_soal]["pilihan"].length; i++) {
        // //         var rand = Math.floor((Math.random() * (arr.length-1)));
        // //         arr_rand.push(arr[rand]);
        // //         arr.splice(rand, 1);
        // //     }
        // // }
        // arr_rand = arr;

        // // console.log($this.pilihan_wrap);
        // for (var i = 0; i < arr_rand.length; i++) {
        //     $app_pilihan = $('.item').clone();
        //     $app_pilihan.find(".txt_pilihan").html($this.ldata2["pilihan"][arr_rand[i]]["text"]);
        //     $app_pilihan.find(".pilihan").attr("index",$this.ldata2["pilihan"][arr_rand[i]]["index"]);
            
        //     // jika pilihan multiple choice
        //     if($this.ldata2["type"] == "mc"){
        //         $($app_pilihan).addClass("mc");
        //         $($app_pilihan).find(".bul_abjad").html($this.arr_alphabet[i]);
        //     }
        //     else if($this.ldata2["type"] == "mmc"){
        //         $($app_pilihan).addClass("mmc");
        //     }

        //     // append ke pilihan wrapper
        //     $clone.find(".pilihan_wrapper").append($app_pilihan);
        //     // $clone.find(".bullet.number").append($num_bullet);
        // }
        
        // $($clone).addClass($this.ldata2["type"]);
        // $("#content-video").append($clone);
        // $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.curr_soal);
        // $($clone).attr("curr_soal",$this.curr_soal);
    }
    console.log($this.isAppend);
    // panggil jquery mobile untuk setting swipe (di panggil saat pertama kali/1x)
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

Modul.prototype.cekJawaban = function(arr) {
    var $this = this;
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

    console.log($this.question_data[$this.curr_soal]);
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
    else if($this.question_data[$this.curr_soal]["type"] == "dad_item_and_place"){
        console.log('dad_item_and_place');
        console.log($clone);
        // jika tipe soalnya multiple choice
        // $clone.find(".btn-submit").hide();
        // click button pilihan
        $(".pilihan").click(function(e){
            console.log('click');
            $(".pilihan").off();
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
            console.log($(this));
            console.log($(this).parents(".pilihan_wrapper"));
            $this.cekJawaban($(this).parents(".pilihan_wrapper"),"dad_item_and_place");
        });
    }
};

// cek jawaban
// clone -> div content parentnya (class slider-content)
// type -> tipe pertanyaannya
Modul.prototype.cekJawaban = function($clone,$type) {
    console.log('cekJawaban');
    var $this = this;
    var $flag=0;
    // akumulasi jumlah pilihan jawaban yang benar
    var count = 0;

    // set response for cmi.interactions.n.student_response
    console.log($this.question_data);
    console.log(parseInt($($clone).attr("curr_soal")));
    console.log($this.curr_soal);
    console.log($clone);
    var response;
    var jawaban;
    if(isNaN($($clone).attr("curr_soal"))){
        response = $this.question_data[parseInt($($clone).attr("curr_soal"))]["question"];
        jawaban = $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"];
    }else{
        response = $this.question_data[$this.curr_soal]["question"];
        jawaban = $this.question_data[$this.curr_soal]["jawaban"];
    }

    console.log($($clone).find(".pilihan"));
    $($clone).find(".pilihan").each(function(index){
        // jika tipenya drag and drop sequence
        if($type == "dadswipe"){
            // jika urutannya salah
            if($(this).attr("index") != $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"][index]){
                $flag=1;
            }
        }
        else{
            console.log('else');
            console.log($type);
            if($type == "dad_item_and_place"){
                console.log($(this));
                console.log($(this).hasClass("active"));
                if($(this).hasClass("active")){
                    var video_feedback = $('<video />', {
                        id: 'video_feedback-1',
                        src: 'assets/video/'+$this.ldata2['feedback'][$(this).attr("index")]["video"],
                        type: 'video/mp4',
                        controls: true
                    });
                    video_feedback.appendTo($('.video_div'));
                    video_feedback.css('display', 'none');
                    $(this).removeClass("active");
                    // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                    var $cek=0;
                    for (var i = 0; i < jawaban.length; i++) {
                        console.log(jawaban);
                        if(jawaban[i] == $this.item_selected){
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
            }else{
                // tipe lainnya jika punya class active
                if($(this).hasClass("active")){
                    var video_feedback = $('<video />', {
                        id: 'video_feedback-1',
                        src: 'assets/video/'+$this.ldata2['feedback'][$(this).attr("index")]["video"],
                        type: 'video/mp4',
                        controls: true
                    });
                    video_feedback.appendTo($('.video_div'));
                    video_feedback.css('display', 'none');
                    $(this).removeClass("active");
                    // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                    var $cek=0;
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
        $this.resetValue();
    }
    else{ 
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
        var id_video_before = curr_soal + 1;
        var id_video = 1;
        var video = document.getElementById('video_feedback-'+id_video);
        var contentTimeout = video.duration * 1000;
         //call function show video feedback quiz
        $this.showVideoFeedback(id_video_before, id_video, video);

        //set timeout to show
        setTimeout(function(){ 
            //set timeout to show
            // opacityVideo(1, id_video, 'feedback');
            $("#video_feedback-"+id_video)[0].pause();
            $(".icon_exit_feedback").show();
            //$('.icon_tutorial').show();

            if($flag==0){
                //$this.showModalFeedback(1);
                //$(".alert").addClass("benar");
            }else{
                //$this.showModalFeedback(0);
                //$(".alert").addClass("salah");
            }
        }, contentTimeout);

        var benar = ($flag == 0 ? 1 : 0);
        $this.close_feedback(benar);
    },800);
    // next page soal berikutnya aktif
    $(".button_next_page").addClass("active");
};

Modul.prototype.next = function($clone,$type) {
    var $this = this;
    game.setSlide(3);
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
    $(".timer").show();
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

                    /*set action when answer false*/
                    $this.setFalseAnswer();
                    $this.count_life(false);
                    if($this.life == 0){
                        //set score lsoe
                        $(".img-menang").hide();
                        $(".img-kalah").show();
                        $(".text_button_wrapper").show();
                        $(".result").show();
                        game.game_data['last_score'] = 0;
                        game.audio.audioKalah.play();
                        game.scorm_helper.setStatus("failed");
                        game.scorm_helper.sendResult(game.game_data['last_score']);
                        $('.btn-next-tryagain').click(function(e){
                            $this.QuitModul();
                        });
                    }else{
                        game.setSlide(3);
                    }
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
    console.log('showModal');
    $('.modal#tutorial').modal("show");
    $('.tutorial.dad').addClass('active');
};


Modul.prototype.playVideo = function(id, type = '') {
    $("#video").show();

    //set prefix id video
    var prefix_id = 'video';
    if(type == 'feedback'){
        prefix_id = 'video_feedback';
    }
    $("video#"+prefix_id+"-"+id).show();
    $("video#"+prefix_id+"-"+id)[0].play();
};

Modul.prototype.stopVideo = function(id) {
    $("#video").hide();
    $("#video-"+id)[0].pause();
    $("#video-"+id)[0].currentTime = 0;
};

Modul.prototype.opacityVideo = function(val, id, type = '') {
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
};

Modul.prototype.showContentVideo = function(val) {
    if(val == 1){
        $('.video_btn_wrapper').show();
    }else{
        $('.video_btn_wrapper').hide();
    }
};

Modul.prototype.resetValue = function(){
    game.video_duration = 0;
    game.isViewVideo = false;
}

Modul.prototype.showModalFeedback = function(benar){
    var $this = this;
    $(".modal#modal_feedback").find(".title_feedback_2").hide();
    if(benar==1){
        $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data[$this.curr_soal]['feedback_true']);
        $(".modal#modal_feedback").find(".benar").show();
        $('.modal#modal_feedback').modal('show');
    }else{
        $(".modal#modal_feedback").find(".text_dynamic").html($this.question_data[$this.curr_soal]['feedback_false']);
        $(".modal#modal_feedback").find(".salah").show();
        $('.modal#modal_feedback').modal('show');
    }
}

Modul.prototype.setFalseAnswer = function(){
    var $this = this;

    var response = $this.question_data[$this.curr_soal]["question"];
    game.audio.audioSalah.play();
  
    //set flag view video
    game.isViewVideo = true;
};

Modul.prototype.close_feedback = function(benar){
    var $this = this;
    $('.icon_exit_feedback').click(function(e){
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
        var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
        if($this.life == 0){
            //set score lsoe
            $(this).hide();
            $(".img-menang").hide();
            $(".img-kalah").show();
            $(".text_button_wrapper").show();
            $(".result").show();
            game.game_data['last_score'] = 0;
            game.audio.audioKalah.play();
            game.scorm_helper.setStatus("failed");
            game.scorm_helper.sendResult(game.game_data['last_score']);
            $this.resetValue();
            $('.btn-next-tryagain').click(function(e){
                $this.QuitModul();
            });
            //game.setSlide(3);
        }else{
            if(total["score"] ==  total["total_soal"]){
                //set score win
                $(this).hide();
                game.game_data['last_score'] = 100;
                $this.setGameData3();                    
                $this.resetValue();
                $('.btn-next-tryagain').hide();
                $('.btn-next-result').show();
                $(".result").show();
                game.audio.audioMenang.play();
                $(".btn-next-result").click(function(e){
                    game.setSlide(1);
                });
                //game.setSlide(3);
            }else{
                game.setSlide(3);
            }
        }
    });
};

//function show append conetent in video
Modul.prototype.showVideoFeedback = function(id_video_before, id_video, video){
    var $this = this;
    $this.stopVideo(id_video_before);
    $this.opacityVideo(0, id_video, 'feedback');
    $(".star-wrapper").hide();
    $('#content-video').hide();
    $('.icon_tutorial').hide();
    $(".timer").hide();
    $('video#video-'+id_video_before).hide();
    $this.playVideo(id_video, 'feedback');

    if(video.hasAttribute("controls")) {
        video.removeAttribute("controls")   
    } else {
        video.setAttribute("controls","controls")   
    }
};

Modul.prototype.setGameData = function(){
    var date = game.getDate();
    game.game_data['last_score'] = undefined;
    game.game_data['start_date'] = date;
    game.game_data['last_life'] = game.life_max;
    game.game_data['last_challenge'] = undefined;
    game.game_data['status'] = 'lose';
    game.game_data['category_game'] = undefined;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

Modul.prototype.setGameData2 = function(){
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
Modul.prototype.setGameData3 = function(){
    var date = game.getDate();

    //set game log
    var last_game_log = (game.game_data['game_log'] == undefined ? [] : game.game_data['game_log']);
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
    game.game_data['category_game'] = game.game_data['category_game'];
    game.game_data['game_log'] = last_game_log;
    game.game_data['status'] = 'win';
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

Modul.prototype.QuitModul = function() {
    try{
        var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
        btn_back.click();
    }
    catch(e){
        top.window.close();
    }
};