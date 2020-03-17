var timer_interval = 0;
var flag_item_click = 0;
var item_selected2 = undefined;
var time_backsound = 0;

var quizVisnov = function(){
    
}

quizVisnov.prototype.init = function(current_settings) {
    console.log('init modul');
    var $this = this;
    /*game data*/
    $this.current_settings = current_settings;
    $this.game_data = game.scorm_helper.getSingleData("game_data");
    $this.game_data = ($this.game_data != undefined ? $this.game_data : {});
    // console.log($this.current_settings);
    // console.log($this.game_data);
   
    $this.life = ($this.game_data['last_life'] != undefined ? $this.game_data['last_life'] : game.life_max);
    $this.total_step = game.total_step; //total step dari setiap game
    $this.total_soal = 0; //total soal dari semua stage
    $this.curr_step = ($this.game_data["curr_step"] != undefined ? $this.game_data["curr_step"] : 0);
    $this.last_score = ($this.game_data["last_score"] != undefined ? $this.game_data["last_score"] : 0);
    /*end game data*/
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.isRand = false;
    // $this.isTimer = false;
    $this.countTime = 300;
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"];
    // $this.slide_content = $(".slider-content").clone();
    // $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();
    // $this.mode = 1;
    // $this.currAnswer = 0;
    $this.time_global = game.time_global;
    $this.time = 0;
    $this.loading_timeout = 4200;//in milisecond
    $this.item_selected = undefined; //item yang dipilih untuk ditempatkan
    $this.video_feedback_false_answer = 1; //variabel untuk menentukan video_feedback_false
    $this.backsound = 1; //variabel enable or disable backsound
    $this.time_backsound = 0; //time interval backsound
    $this.auto_next_dialog = game.auto_next_dialog;
    $this.time_auto_next = game.time_auto_next; //variabel time auto tap
    $this.interval_auto_next; //interval auto next

    //slide number page
    $this.slide_result_per_step = game.slide_result_per_step + ($this.game_data["selected_stage"]-1);
    $this.slide_result = game.slide_result;
    $this.tryagain_question_false_answer = game.tryagain_question_false_answer;

    /*Path file global*/
    if($this.game_data["selected_stage"] == undefined){
        $this.game_data["selected_stage"] = 1;
    }
    // console.log('assets/video/stage-'+($this.game_data["selected_stage"])+'/');
    $this.video_path = 'assets/video/stage-'+($this.game_data["selected_stage"])+'/';
    $this.path_image = "assets/image/";
    $this.mode = 'video';
    $this.play_video_flag;
    $this.play_video_interval; //variabel interval video
    $this.play_video_interval_feedback; //variabel interval video feedback
    /*End path file global*/

    //variabel setting global
    $this.setting_global = new Setting();

    //jika visual novel linear, tampilkan tutorial
    $this.json_prefix_name = "config/setting_quiz_slide_";
    if($this.setting_global["mode_visual_novel"] == "linear"){
        $this.json_prefix_name = "config_noStage/setting_quiz_slide_";
    }
    // console.log($this.json_prefix_name+$this.current_settings["slide"]+".json");
    $.get($this.json_prefix_name+$this.current_settings["slide"]+".json",function(e){
        console.log(e);
        $this.ldatas = e;
        $this.settings = e["settings"];
        $this.question_datas = e['list_question'];

        //set game data-prev
        $this.game_data["total_soal_current_slide"] = $this.question_datas.length;

        // $this.question_data = e['list_question'][$this.curr_soal];
        // console.log($this.question_data);
        // console.log($this.question_data);
        // setting timer game per soal
        $this.isTimer = (e["settings"]["duration"] != undefined && e["settings"]["duration"] != "")?true:false;
        // $this.isTimer = ($this.question_datas[$this.curr_soal]['duration'])?true:false;
        // console.log($this.isTimer);
        // $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;
        $this.countTime = $this.settings['duration'];
        $this.total_time = $this.settings['duration'];
        
        $this.slide_content = $(".slider-content").clone();
        $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();

        //jika visual novel linear, tampilkan tutorial
        if($this.setting_global["mode_visual_novel"] == "linear"){
            if($this.setting_global["show_tutorial_ular_tangga"]){
                $this.get_total_soal();
                $this.setTutorial();
                $(".img_click").hide();
                // $this.mulai_game();
            }else{
                $this.mulai_game();
            }
        }else{
            $this.mulai_game();
        }
    },'json');
};

quizVisnov.prototype.stage_brankas = function(show_feedback_visnov = "", benar = "") {
    console.log("stageBrankas");
    var $this = this;
    $this.game_data = (game.scorm_helper.getSingleData("game_data") != undefined ? game.scorm_helper.getSingleData("game_data") : {});
    // $this.completed_stage = $this.game_data["completed_stage"];
    // $this.failed_stage = $this.game_data["failed_stage"];
    let ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    // ldata = {
    //  "index": "game_slide_13",
    //  "answer": [1,0],
    //  "list_question": [0, 1, 2],
    //  "start_date": "12 Februari 2020 13:46:33",
    //  "end_date": "",
    //  "is_complete": false
    // };
    console.log($this.game_data);
    console.log(ldata);
    let curr_soal = ($this.game_data["curr_soal"] != undefined ? $this.game_data["curr_soal"] : 0);
    console.log(curr_soal);

    $(".content_visnov").hide();
    $(".stage_brankas_wrapper").show();
    $(".header").hide();
    //set stage indicator
    $(".stage_b").removeClass("active");
    $(".stage_b").removeClass("fail");
    $(".stage_b").removeClass("complete");

    let arr_answer = (ldata != undefined ? ldata["answer"] : []);
    let arr_list_question = (ldata != undefined ? ldata["list_question"] : []);
    if(ldata == undefined || arr_answer != undefined){
        // let arr_answer = arr_answer;
        // let arr_list_question = ldata["list_question"];
        for (var i = 0; i < arr_answer.length; i++) {
            if(arr_answer[i] == 1){
                $(".star:nth-child("+(i+1)+")").addClass("complete");
                $(".stage_b:nth-child("+(arr_list_question[i]+1)+")").addClass("complete");

            }else if(arr_answer[i] == 0){
                $(".star:nth-child("+(i+1)+")").addClass("fail");
                $(".stage_b:nth-child("+(arr_list_question[i]+1)+")").addClass("fail");
            }
        }
    }

    //set stage n dengan addClass active
    console.log(show_feedback_visnov);
    if(show_feedback_visnov == ""){
        if(arr_answer != undefined){
            if(arr_answer.length == $this.question_datas.length && arr_answer.indexOf(0) == -1){
                $this.nextSoalAtLast();
                return;
            }
        }

        $this.setTutorial();

        for (var i = 0; i < $this.question_datas.length; i++) {
            if($this.game_data["curr_soal_next"] == undefined){
                if(i == 0){
                    $(".stage_b:nth-child("+1+")").addClass("active");
                }
            }else{
                if(i == $this.game_data["curr_soal_next"]){
                    $(".stage_b:nth-child("+(i+1)+")").addClass("active");
                }
            }
        }
    }else{
        // $(".btn-global.btn_show_feedback").show();
        // $(".btn_show_feedback").unbind().click(function(){
        //     game.audio.audioButton.play();
        //     $(".btn_show_feedback").show();
        //     if($this.question_datas[curr_soal]["list_feedback_slider"] != undefined){
        //         $this.setTutorialSlider();
        //     }
        // });

        $(".btn-global.btn_show_feedback").show();
        $(document).ready(function(){
            // $clone_img = $(".loader_image_index-2 img").first().clone();
            // let html = "<img class='img_stage_b' src='assets/image/stage_brankas/MC_CIMB_3D_1313.02_BukaPintu_Transparant_Win_v.0.0.0.1-"+(curr_soal+1)+".gif' style='width:100%;'>";
            console.log(benar);
            let src = "assets/image/stage_brankas/MC_CIMB_3D_1313.02_BukaPintu_Transparant_Win_v.0.0.0.1-"+(curr_soal+1)+".gif";
            if(benar == 0){
                src = "assets/image/stage_brankas/MC_CIMB_3D_1313.02_BukaPintu_Transparant_Lose_v.0.0.0.1-"+(curr_soal+1)+".gif";
            }
            $(".stage_b:nth-child("+(curr_soal+1)+") img").attr("src",src);

            // $(".stage_b:nth-child("+(curr_soal+1)+")").html("");
            // $(".stage_b:nth-child("+(curr_soal+1)+")").append(html);

            //stage ganjil
            if(curr_soal%2 == 1){
               $(".stage_b:nth-child("+(curr_soal+1)+") img").css({"-webkit-transform":"scaleX(-1)","transform":"scaleX(-1)"})
            }
           
            //play backsound countdown
            // setTimeout(function(){
                // let src_audio = "assets/audio/"+$this.settings["backsound_countdown"];
                // let audio = game.audio.audio_dynamic(src_audio);
                // audio.play();   
            // },100);

            setTimeout(function(){
                // alert("test");
                $(".btn-global.btn_show_feedback").hide();
                if($this.question_datas[curr_soal]["list_feedback_slider"] != undefined){
                    $this.setTutorialSlider();
                }
            },2000);
        });
    }

    $(".stage_b").unbind().click(function(){
        if($(this).hasClass("active") || $(this).hasClass("fail")){
            game.audio.audioButton.play();
            let index = parseInt($(this).attr("index"));

            $this.game_data["curr_soal"] = (index-1);
            // game.nextSlide();
            $(".stage_brankas_wrapper").hide();
            // $(".content_visnov").show();

            // if(show_feedback_visnov == 1){
            //     if($this.question_datas[curr_soal]["list_feedback_slider"] != undefined){
            //         $this.setTutorialSlider();
            //     }
            // }else{
                $this.mulai_game();
            // }
        }
    });
};

quizVisnov.prototype.mulai_game = function(){
    console.log("mulai_game");
    var $this = this;

    // console.log($this.total_soal);

    $("html").removeClass("ui-mobile");

     //show header element
    $(".header").show();

    //show hide timer global
    if($this.time_global == false){
        $(".header .timer").hide();
    }

    $('.modal-backdrop').hide();
    // ambil permainan terakhir user

    /*Function set progress bar*/
        let mode = 2; 
        game.setProgresBar();
    /*End function set progress bar*/
   
    // console.log(e['settings']['sound_loading_bar']);
    if(this.settings['sound_loading_bar'] != undefined){
        //play audio loading bar
        // var src_audio = "assets/audio/"+$this.question_datas[$this.curr_soal]['audio'];
        // $this.audio_dynamic_2 = game.audio.audio_dynamic(src_audio);
        // var promise = $this.audio_dynamic_2.play();

        // if (promise !== undefined) {
        //     promise.then(_ => {
        //         // Autoplay started!
        //     }).catch(error => {
        //         // Autoplay was prevented.
        //         // Show a "Play" button so that user can start playback.
        //     });
        // }
    }

    console.log("game_slide_"+$this.current_settings["slide"]);
    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    // $this.curr_soal = $this.game_data["curr_soal"];
    console.log(ldata);
    console.log($this.game_data);
    console.log($this.curr_soal);

    if($this.game_data["curr_soal"] != undefined){
        $this.resume = 1;
    }

    //get backsound stage
    if($this.settings["backsound"] != undefined && $this.settings["backsound"] != ""){
        // console.log(game.time_backsound_per_stage);
        // if(game.time_backsound_per_stage == undefined){
        //     game.playBacksound($this.settings["backsound"]);
        // }

        let src = "assets/audio/"+$this.settings["backsound"];
        console.log(src);
        $this.playBacksound(src);
    }

    //show modal tutorial
    // baru pertama kali mulai
    // $this.curr_soal = 0;

    if(ldata == undefined || ldata["answer"] == undefined || ldata["answer"]== null){
        // console.log(ldata);
        // console.log($this.getQuestion());
        var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion(),ldata);
        console.log(sdata);
        ldata = sdata;
        $this.curr_soal = 0;
        console.log($this.curr_soal);
        console.log($this.question_datas);
        $this.feedback_type = ($this.question_datas[$this.curr_soal]["feedback_type"] != undefined ? $this.question_datas[$this.curr_soal]["feedback_type"] : undefined);
        // console.log($this.question_data);
        $this.ldata2 = $this.question_datas[$this.curr_soal];
        //hideo close video button
        $(".btn-close").hide(); 

        if(game.mode_life == true){
            //show life
            $this.show_life();
        }

        //show question
        $this.showQuestion();
    }
    else{ //resume game
        // $this.curr_soal = ldata["answer"].length;
        // // alert($this.curr_soal);
        // $this.ldata2 = $this.question_datas[$this.curr_soal];
        // $this.feedback_type = ($this.question_datas[$this.curr_soal]["feedback_type"] != undefined ? $this.question_datas[$this.curr_soal]["feedback_type"] : undefined);

        let selected_stage = ($this.game_data["selected_stage"] != undefined ? $this.game_data["selected_stage"] : []);
        let arr_failed_stage = ($this.game_data["failed_stage"] != undefined ? $this.game_data["failed_stage"] : []);

        console.log(arr_failed_stage);
        //jika stage n terdapat di array failed_stage, set ulang data game_quiz
        let index_failed = arr_failed_stage.indexOf(selected_stage);
        if(index_failed > -1){
            var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion(),ldata);
            console.log(sdata);
            ldata = sdata;
            $this.curr_soal = 0;
            $this.ldata2 = $this.question_datas[$this.curr_soal];
            $this.feedback_type = ($this.question_datas[$this.curr_soal]["feedback_type"] != undefined ? $this.question_datas[$this.curr_soal]["feedback_type"] : undefined);
            
            //splice / pull 
            $this.game_data["failed_stage"].splice(index_failed,1);

            if(game.mode_life == true){
                //show life
                $this.show_life();
            }

            $this.showQuestion();
        }else{
            $this.curr_soal = ldata["answer"].length;
            // alert($this.curr_soal);
            $this.ldata2 = $this.question_datas[$this.curr_soal];
            $this.feedback_type = ($this.question_datas[$this.curr_soal]["feedback_type"] != undefined ? $this.question_datas[$this.curr_soal]["feedback_type"] : undefined);

            //jika panjang data jawaban sama dengan list question dan dalam data jawaban tidaj ditemukan jawaban 0
            // console.log(ldata);
            // console.log(ldata["answer"].indexOf(0));
            if(ldata["answer"].length == ldata["list_question"].length && ldata["answer"].indexOf(0) == -1){
                let arr_index = ldata["index"].split("_");
             
                if($this.curr_soal == ($this.question_datas.length - 1)){
                    $this.nextSoalAtLast();
                }else{
                    $this.nextSoal();
                }
            }else{
                if(game.mode_life == true){
                    //show life
                    $this.show_life();
                }

                //show question
                $this.showQuestion();
            }
        }
    }

    $('.btn_tutorial_mc').click(function(e){
        console.log('btn_tutorial_mc click');
        $(this).off();
        game.audio.audioButton.play();
        $('.modal#tutorial').modal("hide");
        $('.tutorial.mc').removeClass('active');

        // console.log($this.question_data);
        var arr_before_game = $this.question_datas[$this.curr_soal]['before_game'];
        if(arr_before_game != undefined){
            var text_bubble = arr_before_game[0]['text'];
            $('.modal.modal_bubble_text #text_bubble-1').html(text_bubble);
            $('.star-wrapper').hide();
            $('.modal.modal_bubble_text').modal('show');

            setTimeout(function(){ 
                $('.modal.modal_bubble_text').modal('hide');
                $('.star-wrapper').show();
                if($this.isTimer){
                    if(timer_interval > 0){
                        clearInterval(timer_interval);
                    }
                    $this.isStartTime = false;
                    $this.startGameTimer();
                }else{
                    $(".timer_quiz").hide();
                }
            },3000);
        }else{

            if($this.isTimer){
                if(timer_interval > 0){
                    clearInterval(timer_interval);
                }
                $this.isStartTime = false;
                $this.startGameTimer();
            }else{
                $(".timer_quiz").hide();
            }
        }
    });
}

//fungsi menampilkan soal dan pertanyaan
quizVisnov.prototype.showQuestion = function() {
    var $this = this;

    var item_div_n = $this.curr_soal + 1;
    var $clone = $this.slide_content.clone();
    var $clone_dialog =  $('.item_dialog .item_dialog_text').clone();
    var $clone_dialog_feedback =  $('.item_dialog .item_dialog_feedback_text').clone();
    var $clone_dialog_feedback_false =  $('.item_dialog .item_dialog_feedback_false_text').clone();
    var $clone_img_character =  $('.item_character .img_item').clone();
    var $clone_div_label = $(".content_visnov .div_name_label").clone();
    var $clone_div_label_img = $(".content_visnov .div_label_img").clone();

    //play backsound
    // $this.playBacksound();

    //set background image
    if($this.question_datas[$this.curr_soal]["background_image"] != ""){
        var background_image = "url(assets/image/background/"+$this.question_datas[$this.curr_soal]["background_image"]+")";
        // console.log(background_image);
        $(".slider-content").css("background-image",background_image);
    }


    //sudah append slide_content sebelumnya
    // console.log($this.isAppend);
    if($this.isAppend == 1){
        // console.log($this.question_data);
        $this.ldata2 = $this.question_data;
    }else{
        $('.div_content').html('');
    }

    // random pilihan
    var arr = [];
    var arr_rand = [];

    if($this.mode == 'video'){
        //if type soal mc
         if($this.ldata2['type'] == 'mc'){
            $clone.find(".text_title").html($this.ldata2["text"]);
            $clone.find(".text_challenge_num").html($this.curr_soal + 1);


            var options = $this.ldata2["pilihan"];
            var question = $this.ldata2["question"];
            var item_div_n = 1;

            /*Append question and option*/
                // console.log(question);
                // console.log("#item-"+item_div_n);
                let max_string_length = 141;
                // console.log(question);
                let dialog_text = $this.substringText(question, max_string_length);
                // console.log(dialog_text);

                /*Function set css pilihan jawaban box*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_question .txt_question").css($this.ldata2['box_style']);
                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question .txt_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css dialog box*/
                $clone.find("#item-"+item_div_n+" .div_question .txt_question").html(dialog_text);

                //hide element txt_question
                $clone.find("#item-"+item_div_n+" .div_question .txt_question").hide();

                for (var i = 0; i < options.length; i++) {
                    arr.push(i);
                }

                arr_rand = arr;

                // console.log(arr_rand);
                $clone.find(".row_pilihan .row_no_margin").html("");
                for (var i = 0; i < arr_rand.length; i++) {
                    var no = i+1;

                    let pilihan_wrap_clone = $this.pilihan_wrap.clone();
                    //append options
                    // $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").eq(i).attr('index',i);
                    pilihan_wrap_clone.find(".pilihan").attr("index",i);

                    //  Function substring string
                    let max_string_length = 45;
                    // console.log("test");
                    let pilihan_text = $this.substringText_2(options[arr_rand[i]]['text'], max_string_length);
                    // console.log(pilihan_text);
                    // $clone.find("#item-"+item_div_n+" .div_pilihan .txt_pilihan").eq(i).html(pilihan_text);
                    pilihan_wrap_clone.find(".txt_pilihan").html(pilihan_text);
                    // console.log(pilihan_wrap_clone);
                    $clone.find(".row_pilihan .row_no_margin").append(pilihan_wrap_clone);
                }

                /*Function set css pilihan jawaban*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").css($this.ldata2["box_style_pilihan"]);
                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question .txt_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css pilihan jawaban*/

            /*End append question and option*/

            /*Function Append dialog*/
                $clone.find('.item_dialog .item_dialog_wrapper').html('');
                // console.log($this.ldata2["text_3"]);
                var arr_dialog = $this.ldata2["text_3"];
                for (var i = 0; i < arr_dialog.length; i++) {
                    // console.log($clone_dialog);
                    //append options
                    $clone_dialog.attr('index',i);

                    //substring text
                    let max_string_length = 141;
                    // console.log(arr_dialog[i]['text']);
                    let dialog_text = $this.substringText(arr_dialog[i]['text'], max_string_length);
                    // console.log(dialog_text);

                    /*Function set css dialog box*/
                        if(arr_dialog[i]['box_style'] != undefined){
                            // console.log(arr_dialog[i]);
                            $clone_dialog.css(arr_dialog[i]['box_style']);
                        }else{
                            $clone_dialog.removeAttr('style');
                            $clone_dialog.css("display","none");
                        }
                    /*End function set css dialog box*/

                    $clone_dialog.html(dialog_text);
                    $clone_dialog.attr('id','item_dialog_text-'+i);

                    //function add class suara_batin
                    $clone_dialog.removeClass('suara_batin');
                    if(arr_dialog[i]['suara_batin'] != undefined){
                        if(arr_dialog[i]['suara_batin'] == 1){
                            $clone_dialog.addClass('suara_batin');
                        }
                    }
                    // console.log($clone_dialog);
                    $clone.find('.item_dialog .item_dialog_wrapper').append($($clone_dialog)[0]['outerHTML']);
                }
            /*End function append dialog*/
                
            /*Append dialog feedback true*/
                if($this.ldata2["feedback"] != undefined){
                    var arr_dialog_feedback = $this.ldata2["feedback"];
                    for (var i = 0; i < arr_dialog_feedback.length; i++) {
                       
                        //append options
                        $clone_dialog_feedback.attr('index',i);

                        //substring text
                        let max_string_length = 141;
                        let dialog_text = $this.substringText(arr_dialog_feedback[i]['text'], max_string_length);

                        /*Function set css dialog box*/
                            if(arr_dialog_feedback[i]['box_style'] != undefined){
                                $clone_dialog_feedback.css(arr_dialog_feedback[i]['box_style']);
                            }else{
                                $clone_dialog_feedback.removeAttr('style');
                                $clone_dialog_feedback.css("display","none");
                            }
                        /*End function set css dialog box*/

                        $clone_dialog_feedback.html(dialog_text);
                        $clone_dialog_feedback.attr('id','item_dialog_feedback_text-'+i);

                        //function add class suara_batin
                        $clone_dialog_feedback.removeClass('suara_batin');
                        if(arr_dialog_feedback[i]['suara_batin'] != undefined){
                            if(arr_dialog_feedback[i]['suara_batin'] == 1){
                                $clone_dialog_feedback.addClass('suara_batin');
                            }
                        }

                        $clone.find('.item_dialog .item_dialog_wrapper').append($($clone_dialog_feedback)[0]['outerHTML']);
                    }
                }
            /*End append dialog feedback true*/

            /*Append dialog feedback false*/
                if($this.ldata2["feedback"] != undefined){
                    var arr_dialog_feedback_false = $this.ldata2["feedback_false"];
                    for (var i = 0; i < arr_dialog_feedback_false.length; i++) {
                       
                        //append options
                        $clone_dialog_feedback_false.attr('index',i);

                         //substring text
                        let max_string_length = 141;
                        let dialog_text = $this.substringText(arr_dialog_feedback_false[i]['text'], max_string_length);

                        /*Function set css dialog box*/
                            if(arr_dialog_feedback_false[i]['box_style'] != undefined){
                                $clone_dialog_feedback_false.css(arr_dialog_feedback_false[i]['box_style']);
                            }else{
                                $clone_dialog_feedback_false.removeAttr('style');
                                $clone_dialog_feedback_false.css("display","none");
                            }
                        /*End function set css dialog box*/

                        $clone_dialog_feedback_false.html(dialog_text);
                        $clone_dialog_feedback_false.attr('id','item_dialog_feedback_false_text-'+i);


                        //function add class suara_batin
                        $clone_dialog_feedback_false.removeClass('suara_batin');
                        if(arr_dialog_feedback_false[i]['suara_batin'] != undefined){
                            if(arr_dialog_feedback_false[i]['suara_batin'] == 1){
                                $clone_dialog_feedback_false.addClass('suara_batin');
                            }
                        }

                        // console.log($clone_dialog_feedback_false);
                        $clone.find('.item_dialog .item_dialog_wrapper').append($($clone_dialog_feedback_false)[0]['outerHTML']);
                    }
                }
            /*End append dialog feedback false*/

            //move div_name_label
            // console.log($clone_div_label);
            $clone.find(".content_visnov .div_name_label").remove();
            $clone.find('.item_dialog .item_dialog_wrapper').append($clone_div_label);

            //append
            $($clone).addClass($this.ldata2["type"]);
            $(".div_content").append($clone);
            $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.curr_soal);
            $($clone).attr("curr_soal",$this.curr_soal);
            $('.slider-content').hide();
            $($clone).show();

        }else{
            
        }

        /*Function append content*/
            $($clone).addClass($this.ldata2["type"]);
            $(".div_content").append($clone);
            $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.curr_soal);
            $($clone).attr("curr_soal",$this.curr_soal);
        /*End function append content*/

        //show video
        $this.showVideo(0, $clone);
    }
    
    // panggil jquery mobile untuk setting swipe (di panggil saat pertama kali/1x)
    // if($this.isAppend == 0){
    //     $this.isAppend = 1;
    //     $this.setTutorial();
    //     $.getScript( "assets/js/jquery.mobile-1.4.5.min.js", function( data, textStatus, jqxhr ) {
    //         $this.settingPage($clone);
    //         $('.ui-loader').hide();
    //     });
    // }
    // else{
    //     $this.settingPage($clone);
    // }
     $this.settingPage($clone);
};

quizVisnov.prototype.getQuestion = function() {
    var $this = this;
    var arr_quest = [];
    var arr = [];
    // console.log($this.question_data);
    for (var i = 0; i < $this.question_datas.length; i++) {
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
    // console.log(arr_quest);
    return arr_quest;
};

quizVisnov.prototype.settingPage = function($clone) {
    var $this = this;
    console.log('settingPage');
    // $this.curr_soal = 0;
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
        // $.mobile.changePage( "#slide_"+$this.attemp_soal+"_"+$this.curr_soal, { transition: "none"} );
    }

    // console.log($this.curr_soal);
    // jika tipe soalnya drag and drop sequence
    // console.log($this.curr_soal);
    // console.log($this.question_data);
    if($this.question_datas[$this.curr_soal]["type"] == "dadswipe"){
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
            for (var i = 0; i < $this.question_datas[$this.curr_soal][$($clone).attr("curr_soal")]["jawaban"].length; i++) {
                $app_pilihan = $this.pilihan_wrap.clone();
                $app_pilihan.find(".txt_pilihan").html($this.question_datas[$this.curr_soal][$($clone).attr("curr_soal")]["pilihan"][$this.question_datas[$this.curr_soal][$($clone).attr("curr_soal")]["jawaban"][i]]["text"]);
                $clone.find(".pilihan_wrapper").append($app_pilihan);
            }

        });
    }
    else if($this.question_datas[$this.curr_soal]["type"] == "mc"){
        // jika tipe soalnya multiple choice
        $clone.find(".btn-submit").hide();

        // click button pilihan
        $clone.find(".pilihan").click(function(e){
            console.log('click pilihan');
            // $clone.find(".pilihan").off();
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
            $this.cekJawaban($(this).parents(".slider-content"),"mc");
        });
    }
    else if($this.question_datas[$this.curr_soal]["type"] == "mmc"){
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
    else if($this.question_datas[$this.curr_soal]["type"] == "dad_item_and_place"){
        console.log('dad_item_and_place');
        console.log($clone);
        // jika tipe soalnya multiple choice
        // $clone.find(".btn-submit").hide();
        // click button pilihan
        $(".pilihan").click(function(e){
            console.log('click');
            console.log($this.item_selected);
            if(!$(this).hasClass("pilihan_question")){
                $(this).off();
                // $($clone).find(".next-soal").show();

                if(!$(this).hasClass("active")){
                    $(this).addClass("active"); 
                }
                else{
                    $(this).removeClass("active");  
                }

                /*clear interval*/
                clearInterval(timer_interval);
                console.log($this.time_backsound);
                clearInterval($this.time_backsound);
                // $this.audio_dynamic_2.pause();
                // $this.audio_dynamic_2.currentTime = 0;
                // alert($this.time_backsound);
                /*end clear interval*/

                // cek jawaban
                //.parent get parent ancestor from this element
                $this.cekJawaban($(this).parents(".pilihan_wrapper"),"dad_item_and_place");
            }
        });
    }
};

// cek jawaban
// clone -> div content parentnya (class slider-content)
// type -> tipe pertanyaannya
quizVisnov.prototype.cekJawaban = function($clone,$type) {
    console.log('cekJawaban');
    var $this = this;
    // console.log($this);
    var $flag=0;
    // akumulasi jumlah pilihan jawaban yang benar
    var count = 0;
    var item_div_n = $this.curr_soal + 1;
    // $this.curr_soal = 0;

    // set response for cmi.interactions.n.student_response
    // console.log($this.question_data);
    // console.log(parseInt($($clone).attr("curr_soal")));
    // console.log($this.curr_soal);
    // console.log($clone);
    var response;
    var jawaban;
    // console.log($($clone).attr("curr_soal"));
    if(isNaN($($clone).attr("curr_soal")) && $($clone).attr("curr_soal") != undefined){
        response = $this.question_datas[$this.curr_soal][parseInt($($clone).attr("curr_soal"))]["question"];
        jawaban = $this.question_datas[$this.curr_soal][parseInt($($clone).attr("curr_soal"))]["jawaban"];
    }else{
        response = $this.question_datas[$this.curr_soal]["question"];
        jawaban = $this.question_datas[$this.curr_soal]["jawaban"];
    }
    var id_video = $this.item_selected;
    $($clone).find(".pilihan").each(function(index){
        // jika tipenya drag and drop sequence
        if($type == "dadswipe"){
            // jika urutannya salah
            if($(this).attr("index") != $this.question_datas[$this.curr_soal][parseInt($($clone).attr("curr_soal"))]["jawaban"][index]){
                $flag=1;
            }
        }
        else{
            if($type == "dad_item_and_place"){
                var folder = 'game_'+($this.curr_soal+1);
                if($(this).hasClass("active")){
                    // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                    var $cek=0;

                    var index_pilihan = parseInt($(this).attr('index'));
                    console.log(jawaban[$this.item_selected-1]+' - '+index_pilihan);
                    if(jawaban[$this.item_selected-1] == index_pilihan){
                        $cek=1;
                        // break;
                    }
                    var key_video_feedback = ($cek== 1?'feedback':'feedback_false'); //variabel set key video feedback
                    $this.video_source = 'assets/video/'+folder+'/'+$this.ldata2[key_video_feedback][$this.item_selected-1]["video"];
                    var video_feedback = $('<video />', {
                        id: 'video_feedback-1',
                        src: $this.video_source,
                        type: 'video/mp4',
                        controls: true,
                        playsinline: "playsinline"
                    });

                    console.log($this.curr_soal);
                    console.log($this.ldata2['feedback']);
                    console.log($this.ldata2['feedback'][$this.item_selected-1]["video"]);
                    console.log(video_feedback);
                    $('.video_div').html('');
                    video_feedback.appendTo($('.video_div'));
                    video_feedback.css('display', 'none');
                    $(this).removeClass("active");
                   
                    // indexnya jawaban salah
                    if($cek == 0){
                        $flag=1;
                        // $(this).addClass("wrong");
                    }
                    else{
                        // indexnya ada di list jawaban
                        count++;
                        // $(this).addClass("right");
                    }
                }
            }else{
                // alert('test');
                // tipe lainnya jika punya class active
                if($(this).hasClass("active")){
                    if($this.ldata2['feedback'] != undefined){
                        console.log($(this).attr("index"));
                        console.log($this.ldata2['feedback'][$(this).attr("index")]);
                        // if($this.ldata2['feedback'][$(this).attr("index")] != undefined){
                        //     if($this.ldata2['feedback'][$(this).attr("index")]['video'] != undefined){
                        //         var video_feedback = $('<video />', {
                        //             id: 'video_feedback-1',
                        //             src: 'assets/video/'+$this.ldata2['feedback'][$(this).attr("index")]["video"],
                        //             type: 'video/mp4',
                        //             controls: true
                        //         });
                        //         video_feedback.appendTo($('.video_div'));
                        //         video_feedback.css('display', 'none');
                        //         $(this).removeClass("active");
                        //     }
                        // }
                    }

                    // var video_2 = document.getElementById("video_feedback-1");
                    // $(video_2).load();

                    // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                    var $cek=0;
                    // console.log($this.question_datas);
                    // console.log(parseInt($($clone).attr("curr_soal")));
                    for (var i = 0; i < $this.question_datas[parseInt($($clone).attr("curr_soal"))]["jawaban"].length; i++) {
                        if($this.question_datas[parseInt($($clone).attr("curr_soal"))]["jawaban"][i] == $(this).attr("index")){
                            $cek=1;
                            break;
                        }
                    }
                    console.log($cek);
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
                    // $('.btn_next_dialog').show();
                }
            }
        }
    });

    // jika tipenya multiple choice atau multiple-multipe choice
    if($type == "mc" || $type == "mmc"){
        // jumlah pilihan jawaban yang benar tidak sesuai 
        // console.log($this.question_data);
        // console.log(parseInt($($clone).attr("curr_soal")));
        var index_pilihan = parseInt($(this).attr('index'));
        // console.log(jawaban[$this.item_selected-1]+' - '+index_pilihan);
        // if(jawaban[0] == index_pilihan){
        //     $flag=1;
        //     $(this).addClass("wrong");
        //     // break;
        // }else{
        //     $(this).addClass("right");
        // }
        if(count != $this.question_datas[$this.curr_soal]["jawaban"].length){
            // $flag=1;
        }
    }

    var curr_soal = $this.curr_soal;
    // var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.curr_soal]);
    // var last_score = parseInt(quiz_result['score']);
    var last_score = $this.last_score;
    var benar = 1;
   
    // let ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    // console.log(ldata);
   
    $this.showHideSoal('hide');

    let ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    console.log(ldata);

    // jawabannya benar
    if($flag==0){
        var last_life = parseInt($this.life);
        // var arr_temp = [];
        // arr_temp.push(parseInt($this.curr_soal));//key untuk index
        // arr_temp.push(1);
        last_score += 1;
        $this.last_score = last_score;
        $this.game_data["last_score"] = $this.last_score;

        //set answer game_slide
        if(ldata["answer"][$this.curr_soal] != undefined){
            if (ldata["answer"][$this.curr_soal] == 0) {
                // ldata["answer"].splice($this.curr_soal, 1);
                ldata["answer"][$this.curr_soal] = 1;
            }
        }else{
            game.scorm_helper.pushAnswer(1,response);
        }

        //set game data value total answer true of this slide
        // console.log($this.game_data);
        // console.log(($this.game_data["total_answer_true"] == undefined));
        // $this.game_data["total_answer_true"] = ($this.game_data["total_answer_true"] == undefined ? 1 : ($this.game_data["total_answer_true"] + 1));
        // console.log($this.game_data);
        game.audio.audioBenar.play();
        $(".alert").addClass("benar");
        // game.audio.audioButton.play();       
        // $this.resetValue();

        // $this.showHideSoal('hide');
        // $this.question_datas[$this.curr_soal]["feedback_popup"] = undefined;
        if($this.feedback_type == 'custom'){
            // $this.stage_brankas(1, benar);
        }
        else if($this.question_datas[$this.curr_soal]["feedback_popup"] != undefined){
            $this.showModalFeedback_2(benar, 0);
        }else{
            let index = 0;
            $this.showVideoFeedback($clone, benar, index);
        }
    }else{
        var last_life = parseInt($this.life);
        // var arr_temp = [];
        // arr_temp.push(parseInt($this.curr_soal));//key untuk index
        // arr_temp.push(0);

        if($this.life == 0){
            game.setSlide($this.slide_result);
        }

        if(game.mode_life == true){
            // last_life -= 1;
            $this.count_life(false);
            //show life
            $this.show_life();
        }

        //jika jawab salah lanjut ke soal berikutnya
        // if($this.tryagain_question_false_answer == false){
            //push jawaban salah ke array ldata
        if(ldata["answer"][$this.curr_soal] != undefined){
          
        }else{
            game.scorm_helper.pushAnswer(0,response);
        }

        // }
        game.audio.audioSalah.play();
        $(".alert").addClass("salah");
        benar = 0;

         // $this.showHideSoal('hide');
        // $this.question_datas[$this.curr_soal]["feedback_popup"] = undefined;

        if($this.feedback_type == 'custom'){
            // $this.stage_brankas(1, benar);
        }
        else if($this.question_datas[$this.curr_soal]["feedback_popup"] != undefined){
            $this.showModalFeedback_2(benar, 0);
        }else{
            let index = 0;
            $this.showVideoFeedback($clone, benar, index);
        }
    }

    // alert(last_score);

    setTimeout(function() {
        $(".alert").removeClass("benar");
        $(".alert").removeClass("salah");

        //click button in dialog feedback
        // $this.settingDialogFeedback($clone, benar);

        //set game_data and send to scorm
        var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);

        //setting game_data di scorm
        game.scorm_helper.setSingleData("game_data",$this.game_data);


        //call function set progress bar
        game.setProgresBar();
    },800);
};

quizVisnov.prototype.settingDialogFeedback = function($clone, benar){
    var $this = this;
    //click button in dialog feedback
    $($clone).find('.btn_next_dialog-2').unbind().click(function(){
        console.log("btn_next_dialog-2");
        if($(this).text() == "Try Again"){
            $this.close_feedback_2(benar);
        }
      
        $this.audio_dialog.pause();

        var index = $(this).attr("index");
        if(index == undefined){
            index = 0;
        }
        index = parseInt(index) + 1;        

        $this.settingDialogFeedback_2($clone, benar, index);
    });
}

//setting to next dialog feedback atau next soal
quizVisnov.prototype.settingDialogFeedback_2 = function($clone, benar, index){
    var $this = this;

    if(benar == 1){
        //show life
        if(index == ($this.ldata2['feedback'].length)){
            // $this.close_feedback_2(benar);
            $($clone).find('.img_item').hide();
            $($clone).find('.item_dialog_feedback_text').hide();
            $($clone).find('.item_dialog').hide();

            // $this.setTextButton('btn_next_dialog-2','Next');
            $($clone).find('.btn_next_dialog-2').attr('index',0);
            $($clone).find('.btn_next_dialog-2').hide();

            var curr_soal = $this.curr_soal + 1;
            console.log(curr_soal);
            console.log($this.question_data);
            if(curr_soal<$this.question_data.length){
                $this.curr_soal += 1;
                $this.game_data['curr_soal'] = $this.curr_soal;
                console.log('$this.curr_soal: '+$this.curr_soal);
                console.log($this.game_data);
                game.scorm_helper.setSingleData('game_data', $this.game_data);
                // $this.showQuestion();   
            }else{
                $this.game_data['curr_soal'] = 0;
                //$this.game_data['last_life'] = game.life_max;

                var curr_soal = $this.curr_soal + 1;
                if(curr_soal < $this.question_datas.length){
                    $this.nextSoal();
                }else{
                    $this.nextSoalAtLast();
                }
            }
        }else{
            console.log($this.game_data);
            game.scorm_helper.setSingleData('game_data', $this.game_data);
            $this.showDialogFeedback(index,benar,$clone);
            $($clone).find('.btn_next_dialog-2').attr('index',index);
        }
    }else{
        //hide dialog feedback
        if(index == ($this.ldata2['feedback_false'].length)){
            console.log("tryagain_question_false_answer: "+$this.tryagain_question_false_answer);
            if($this.tryagain_question_false_answer == false){
                var curr_soal = $this.curr_soal + 1;
                if(curr_soal < $this.question_datas.length){
                    $this.nextSoal();
                }else{
                    $this.nextSoalAtLast();
                }
            }else{
                //hide name label
                $($clone).find('.div_name_label').hide();
                console.log("showHideSoal cekJawaban");
                $this.showHideSoal('show');
                $($clone).find('.img_item').hide();
                $($clone).find('.item_dialog_feedback_false_text').hide();
                $($clone).find('.item_dialog').hide();

                // $this.setTextButton('btn_next_dialog-2','Next');
                $($clone).find('.btn_next_dialog-2').attr('index',0);
                $($clone).find('.btn_next_dialog-2').hide();

                //show image last index of dialog
                var last_index = $('.btn_next_dialog').attr('index');
                console.log(last_index);
                $('#img_item-'+last_index).show();

                /*Function continue timer*/
                    if($this.isTimer == true){
                        $this.isStartTime = false;
                        $this.startGameTimer();
                    }else{

                    }
                /*End function continue timer*/
            }
        }else{
            console.log($this.game_data);
            game.scorm_helper.setSingleData('game_data', $this.game_data);

            //call function showDialogFeedback
            $this.showDialogFeedback(index,benar,$clone);

            $($clone).find('.btn_next_dialog-2').attr('index',index);
        }

        //reset question of answer
        $($clone).find('.pilihan_place').find('.pilihan').each(function(e){
            console.log($(this));
            $(this).removeClass('active');
            $(this).removeClass('right');
            $(this).removeClass('wrong');
        });
    }
}

//setting to next dialog feedback video atau next soal
quizVisnov.prototype.settingDialogFeedbackVideo_2 = function($clone, benar, index){
    console.log("settingDialogFeedbackVideo_2");
    var $this = this;

    if(benar == 1){
        //show life
        if(index == ($this.ldata2['feedback'].length)){
            // $this.close_feedback_2(benar);
            $($clone).find('.img_item').hide();
            $($clone).find('.item_dialog_feedback_text').hide();
            $($clone).find('.item_dialog').hide();

            // $this.setTextButton('btn_next_dialog-2','Next');
            $($clone).find('.btn_next_dialog-2').attr('index',0);
            $($clone).find('.btn_next_dialog-2').hide();

            var curr_soal = $this.curr_soal + 1;
            console.log(curr_soal);
            console.log($this.question_data);
            if(curr_soal < $this.question_data.length){
                $this.curr_soal += 1;
                $this.game_data['curr_soal'] = $this.curr_soal;
                console.log('$this.curr_soal: '+$this.curr_soal);
                console.log($this.game_data);
                game.scorm_helper.setSingleData('game_data', $this.game_data);
                // $this.showQuestion();   
            }else{
                $this.game_data['curr_soal'] = 0;
                //$this.game_data['last_life'] = game.life_max;

                var curr_soal = $this.curr_soal + 1;
                console.log(curr_soal);
                console.log($this.question_datas);
                if(curr_soal < $this.question_datas.length){
                    $this.nextSoal();
                }else{
                    $this.nextSoalAtLast();
                }
            }
        }else{
            console.log($this.game_data);
            game.scorm_helper.setSingleData('game_data', $this.game_data);
            $this.showDialogFeedback(index,benar,$clone);
            $($clone).find('.btn_next_dialog-2').attr('index',index);
        }
    }else{
        //hide dialog feedback
        if(index == ($this.ldata2['feedback_false'].length)){
            console.log("tryagain_question_false_answer: "+$this.tryagain_question_false_answer);
            if($this.tryagain_question_false_answer == false){
                var curr_soal = $this.curr_soal + 1;
                if(curr_soal < $this.question_datas.length){
                    $this.nextSoal();
                }else{
                    $this.nextSoalAtLast();
                }
            }else{
                //hide name label
                $($clone).find('.div_name_label').hide();
                console.log("showHideSoal cekJawaban");
                $this.showHideSoal('show');
                $($clone).find('.img_item').hide();
                $($clone).find('.item_dialog_feedback_false_text').hide();
                $($clone).find('.item_dialog').hide();

                // $this.setTextButton('btn_next_dialog-2','Next');
                $($clone).find('.btn_next_dialog-2').attr('index',0);
                $($clone).find('.btn_next_dialog-2').hide();

                //show image last index of dialog
                var last_index = $('.btn_next_dialog').attr('index');
                console.log(last_index);
                $('#img_item-'+last_index).show();

                /*Function continue timer*/
                    if($this.isTimer == true){
                        $this.isStartTime = false;
                        $this.startGameTimer();
                    }else{

                    }
                /*End function continue timer*/
            }
        }else{
            console.log($this.game_data);
            game.scorm_helper.setSingleData('game_data', $this.game_data);

            //call function showDialogFeedback
            $this.showDialogFeedback(index,benar,$clone);

            $($clone).find('.btn_next_dialog-2').attr('index',index);
        }

        //reset question of answer
        $($clone).find('.pilihan_place').find('.pilihan').each(function(e){
            console.log($(this));
            $(this).removeClass('active');
            $(this).removeClass('right');
            $(this).removeClass('wrong');
        });
    }
}

quizVisnov.prototype.show_life = function() {
    console.log("show_life");
    var $this = this;
    var count_star = 0;
    $(".star-wrapper .star").removeClass('active');
    var time_star = setInterval(function() {
        count_star++;
        if(count_star <= game.life_max){
            console.log($this.life);
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

quizVisnov.prototype.count_life = function(val) {
    var $this = this;
    if(val == false){
        $this.life -= 1;
    }

    $this.game_data['last_life'] = $this.life;
    $this.game_data = $this.game_data;
    // game.scorm_helper.setSingleData('game_data', $this.game_data);
}

quizVisnov.prototype.startGameTimer = function() {
    console.log('startGameTimer');
    var $this = this;
    // $(".timer").show();
    console.log($this.isStartTime);
    if(!$this.isStartTime){
        $this.isStartTime = true;
        if($this.isTimer){
            // console.log($this.countTime);
            timer_interval = setInterval(function() {
                // console.log('test');
                // console.log($this.countTime);
                if($this.countTime>0){
                    // console.log($this.setTimer());
                    // $(".timer_quiz .text_time").html($this.setTimer());

                    $this.setTimerPercent();
                }
                else{
                    // $(".alert").addClass("salah");
                    clearInterval(timer_interval);
                    $this.time = null;
                    $(".timer_quiz .text_time").html("--:--");

                    //stop backsound
                    $this.stopBackSound();

                    if(game.mode_life == true){
                        //call function show life
                        $this.show_life();

                        /*Call functoion count_life to and send parameter to minus life*/
                        $this.count_life(false);
                        /*End call functoion count_life to and send parameter to minus life*/
                    }

                    //set game_data and send to scorm
                    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
                    // console.log(ldata);

                    /*Setting game data*/
                        $this.game_data['last_challenge'] = ldata['answer'].length;
                        $this.game_data['curr_soal'] = $this.curr_soal;
                        $this.game_data["curr_step"] = $this.curr_step;
                        game.scorm_helper.setSingleData('game_data', $this.game_data);
                    /*End setting game data*/

                    /*show modal feedback*/
                        console.log("icon_exit_feedback");
                        $(".icon_exit_feedback").show();
                        $this.showModalFeedback_2(0, timeout = 1);

                        $(".icon_exit_feedback").unbind().click(function(){
                            console.log("icon_exit_feedback");
                            //hide modal
                            $('.modal#modal_feedback').modal('hide');
                            // $this.life = 0;

                            console.log($this.life);
                            if($this.life == 0){
                                game.setSlide($this.slide_result);
                            }else{
                                let $clone = $(".slider-content");
                                let benar = 0;

                                console.log(game.mode_life);
                                if(game.mode_life == true){
                                    //show last quiz
                                    $this.showQuestion_2();

                                    //play backsound
                                    $this.playBacksound();

                                    //start timer
                                    $this.isStartTime = false;
                                    $this.countTime = $this.settings['duration'];

                                    $(".timer_quiz .progress-bar").css("width","100%");
                                    // setTimeout(function(){
                                        $this.startGameTimer();
                                    // },1000);
                                }else{
                                    console.log($this.mode);
                                    if($this.mode == "video"){
                                        /*Set answer*/
                                            var arr_temp = [];
                                            arr_temp.push(0);

                                            response = $this.question_datas[$this.curr_soal]["question"];
                                            jawaban = $this.question_datas[$this.curr_soal]["jawaban"];

                                            var last_score = $this.last_score;
                                            var last_life = parseInt($this.life);

                                            game.scorm_helper.pushAnswer(0,response,last_score,last_life);
                                            game.scorm_helper.setSingleData("game_data",$this.game_data);
                                            console.log(ldata);
                                        /*End set answer*/

                                        //call function dialog feedback
                                        $this.showVideoFeedback($clone,benar,0);
                                        // $($clone).find('.pilihan_place').hide();
                                        $this.showHideSoal('hide');

                                    }else{
                                        //call function dialog feedback
                                        $this.showDialogFeedback(0,benar,$clone);
                                        // $($clone).find('.pilihan_place').hide();
                                        $this.showHideSoal('hide');

                                        $this.settingDialogFeedback($clone, benar);
                                    }                                    
                                }
                            }
                        });
                    /*End *show modal feedback*/

                    // var benar = 0;
                    // var timeout = 1;
                    // $this.close_feedback(benar, timeout);

                    //pause bacsound
                    // $this.audio_dynamic_2.pause();
                    // $this.audio_dynamic_2.currentTime = 0;
                    /*End function Setting Timeout*/
                }
            },1000);
        }
    }
};

quizVisnov.prototype.resetTimer = function(){
    clearInterval(timer_interval);
    $(".timer .text_time").html("--:--");
}

quizVisnov.prototype.setTimer = function() {
    // console.log('setTimer');
    $this = this;
    // console.log($this.countTime);
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

quizVisnov.prototype.setTimerPercent = function(){
    $this = this;

    $this.countTime = $this.countTime-1;
    let percent =  $this.countTime / $this.total_time * 100;

    $(".timer_quiz .progress-bar").css("width",percent+"%");
};

quizVisnov.prototype.showModal = function() {
    console.log('showModal');
    var $this = this;
    console.log($this.curr_soal);
    // if($this.curr_soal == 3 || $this.curr_soal == 4){
    //     $('.tutorial.dad .animated.fadeIn').html("Kali ini, kamu hanya diberikan <b>waktu 1 menit</b> dan <b>3 kesempatan salah</b>! Kamu siap?");
    // }
    
    $('.modal#tutorial').modal("show");
    $('.tutorial.mc').addClass('active');
};

quizVisnov.prototype.showModalFeedback_2 = function(benar, timeout = 0){
    var $this = this;
    console.log("showModalFeedback_2");
    $(".modal#modal_feedback").find(".title_feedback_2").hide();
    console.log($(".modal#modal_feedback .modal_feedback_black"));
    // $(".modal#modal_feedback .modal_feedback_black").show();
    $(".modal#modal_feedback .modal_feedback").show();

    // var rand = Math.floor(Math.random() * 6);//random 0 sampai 5

    //hide img benar dan salah
    $(".modal#modal_feedback").find(".title_feedback").hide();
    $(".modal#modal_feedback .modal_feedback").removeClass("benar");
    $(".modal#modal_feedback .modal_feedback").removeClass("salah");
    if(benar==1){
        console.log($(".modal#modal_feedback").find(".text_dynamic"));
        console.log($this.ldata2['feedback_popup']);
        var feedback_true = $this.ldata2['feedback_popup']['text'];

        $(".modal#modal_feedback .modal_feedback").addClass("benar");
        $(".modal#modal_feedback").find(".description p").html(feedback_true);
        // $(".modal#modal_feedback").find(".benar").show();
        $('.modal#modal_feedback').modal('show');
        // game.audio.audioWin.play();

    }else{
        // var feedback_false = $this.ldatas['feedback_false'][rand]['text'];
        // console.log(timeout);
        var feedback_false;
        if(timeout == 1){
            feedback_false = $this.ldatas["feedback_timeout"]["text"];
            $(".modal#modal_feedback").find(".img_result .salah").attr("src","assets/image/general_game_assets/header_timeout.png");
            $(".modal#modal_feedback").find(".description .salah").html("Waktu Habis!");
            $(".modal#modal_feedback").find(".description p").html("Jawab pertanyaan dengan tepat sebelum waktu berakhir.");
            game.audio.audioKalah.play();
        }else{
            feedback_false = $this.ldata2['feedback_false_popup']['text'];
            $(".modal#modal_feedback").find(".description p").html(feedback_false);
        }
        $(".modal#modal_feedback .modal_feedback").addClass("salah");


        // $(".modal#modal_feedback").find(".salah").show();
        $('.modal#modal_feedback').modal('show');
        // game.audio.audioKalah.play();

    }

    const benar_2 = benar;
    $(".icon_exit_feedback").unbind().click(function(){
        //hide modal
        $('.modal#modal_feedback').modal('hide');
        // $this.life = 0;
        if($this.life == 0){
            game.setSlide($this.slide_result);
        }else{
            let $clone = $(".slider-content");
            // let benar = benar_2;

            if(game.mode_life == true){
                //show last quiz
                $this.showQuestion_2();

                //play backsound
                $this.playBacksound();

                //start timer
                $this.isStartTime = false;
                $this.countTime = $this.settings['duration'];

                $(".timer_quiz .progress-bar").css("width","100%");
                // setTimeout(function(){
                    $this.startGameTimer();
                // },1000);
            }else{
                let flag_feedback_dialog = 0;

                //check mode video
                if($this.mode == "video"){
                    //check feedback dialog
                    if($this.ldata2["feedback_dialog"] != undefined){
                        //jika dialog feedback ditemukan, call function showVideoFeedback
                        if($this.ldata2["feedback_dialog"] == 1){
                            flag_feedback_dialog = 1;
                            let $clone = $(".slider-content");
                            let index = 0;
                            console.log($this.ldata2);
                            if(benar_2 == 1){
                                if($this.ldata2["feedback"].length > 0) {
                                    $this.showVideoFeedback($clone, benar_2, index);
                                }
                            }else{
                                if($this.ldata2["feedback_false"].length > 0) {
                                    $this.showVideoFeedback($clone, benar_2, index);
                                }
                            }
                        }
                    }
                }

                //jika feedback dialog tidak ditemukan, call function showDialogFeedback
                if(flag_feedback_dialog == 0){
                     //call function dialog feedback
                    $this.showDialogFeedback(0,benar_2,$clone);
                    // $($clone).find('.pilihan_place').hide();
                    $this.showHideSoal('hide');
                    $this.settingDialogFeedback($clone, benar_2);
                }
            }
        }
    });
}

quizVisnov.prototype.close_feedback_2 = function(benar, timeout = 0){
    console.log('close_feedback_2');
    var $this = this;
    // $('.icon_exit_feedback').click(function(e){
        
        //remove this event handler
        // $(this).off();
        //flag jawaban true
        if(benar==1){
            
        }else{
            //set life to scorm
            $this.count_life(false);
        }

        // $('.modal#modal_feedback').modal('hide');

        // $(".alert").removeClass("salah");
        // $(".alert").removeClass("benar");

        game.scorm_helper.setSingleData('game_data', $this.game_data);
        //if soal sudah sampai soal terakhir dari data di json
        // var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]]);
        var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]]);
        console.log(total);
        var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
        console.log($this.life);
        console.log(ldata);

        //set flag_item_click clickable
        // flag_item_click = 0;

        clearInterval($this.time_backsound);
        console.log($this.life);
        if($this.life == 0){
            //set score lose
            $(this).hide();

            // $this.game_data['last_score'] = 0;
            game.audio.audioKalah.play();
            game.scorm_helper.setStatus("failed");

            var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]]);
            var last_score = $this.last_score;
            game.scorm_helper.sendResult(last_score);

            //go to final page
            $this.audio_dynamic_2.pause();
            $this.audio_dialog.pause();
            game.setSlide(4);
        }else{
            if(ldata["answer"].length == 1){
                var date = game.getDate();

                $this.game_data['start_date'] = date;
                $this.game_data = $this.game_data;
            }

            console.log(ldata["answer"].length);
            console.log(total["total_soal"]);
            if(ldata["answer"].length == total["total_soal"]){

                $('.btn-next-tryagain').click(function(e){
                    console.log('btn-next-tryagain');
                    $(this).off();
                    // $this.QuitModul();
                    $this.resetCurrGame();
                    game.setSlide(2);
                });

                $(".btn-next-result").click(function(e){
                    $(this).off();
                    console.log('btn-next-result');
                    console.log($this.curr_soal);
                    console.log($this.ldatas['list_question'].length);
                    if($this.curr_soal == $this.ldatas['list_question'].length - 1){
                        console.log('slide 3');
                        $('.result_2').show();
                        game.setSlide(3);
                    }else{
                        $this.resetGameData();
                        $this.game_data['curr_soal'] = $this.curr_soal + 1;
                        console.log($this.game_data);
                        game.setSlide(2); //go to page quiz
                    }
                });

                console.log($this.life);
                if($this.life > 0 && benar == 0)//jawaban salah
                {
                    if(game.mode_life == true){
                        $this.show_life();
                    }
                }
                else{
                    //go to final page
                    $this.audio_dynamic_2.pause();
                    $this.audio_dialog.pause();
                    game.setSlide(4);
                }
            }else{
                // game.setSlide(2); //go to quiz page
                // $this.stopVideo_plyr($this.video_plyr);
                // $("#video").hide();\

                if(game.mode_life == true){
                    // console.log('show_life');
                    $this.show_life();
                }

                //validasi game timer
                if($this.isTimer){
                    $this.isStartTime = false;
                    $this.startGameTimer();
                }else{
                    $(".timer_quiz").hide();
                }

                // var rand = Math.floor(Math.random() * 6);//random 0 sampai 5
                // if(benar==1){
                //     //change html feedback_text
                //     console.log($this.ldata2);
                //     $(".feedback_text").html($this.ldatas['feedback_true'][rand]['text']);
                //     //play sound
                //     // var src_audio = "assets/audio/"+$this.ldatas['feedback_true'][rand]['sound'];
                //     // game.audio_dynamis(src_audio);
                // }else{
                //     //change html feedback_text
                //     $(".feedback_text").html($this.ldatas['feedback_false'][rand]['text']);
                //     //play sound
                //     // var src_audio = "assets/audio/"+$this.ldatas['feedback_false'][rand]['sound'];
                //     // game.audio_dynamis(src_audio);
                // }
                //play backsound
                // $this.playBacksound();
            }
        }
       
        console.log($this.game_data);
    // });
};

quizVisnov.prototype.resetCurrGame = function(){
    var $this = this;
    game.scorm_helper.resetQuizDataByIndex("game_slide_"+$this.current_settings["slide"]);
    $this.game_data["curr_soal"] = $this.curr_soal;
}

//function show append content in video
quizVisnov.prototype.showVideoFeedback = function($clone, benar, index){
    // alert("showVideoFeedback");
    var $this = this;

    if(benar == 0){
        $($clone).find('.item_dialog_feedback_false_text').hide();
        arr_dialog = $this.ldata2["feedback_false"];
    }else{
        $($clone).find('.item_dialog_feedback_text').hide();
        arr_dialog = $this.ldata2["feedback"];
    }

    // console.log(arr_dialog);
    // console.log(index);
    // console.log(benar);
    //jika dialog feedback ditemukan
    if(arr_dialog != undefined && arr_dialog.length > 0){
        var index_dialog = arr_dialog[index];
        // console.log(index_dialog);
        if(index_dialog != undefined){
            //setting name label

            $($clone).find('.item_dialog').show();
            // $($clone).find('.btn_next_dialog-2').show();

            let video = index_dialog["video"];
            let last_index = 0;
            if(arr_dialog.length == (index+1)){
                last_index = 1;
            }
            if(benar == 0){
                //show video feedback benar
                let $image = index_dialog["hand_touch_img_video"];
                console.log($image);
                if($image != undefined && $image != ""){
                    //set hand touch image
                    $this.setHandTouchImg($image);

                    //Set cover video
                    if(index_dialog["img_video"] != "" && index_dialog["img_video"] != undefined){
                        let cover_video = index_dialog["img_video"];
                        console.log($this.path_image+'quiz/'+cover_video);
                        $($clone).find(".img_video").attr("src",$this.path_image+'quiz/'+cover_video);
                        $($clone).find(".img_video").show();
                    }
                    //End set cover video

                    $($clone).find(".btn-global").hide();
                    $($clone).find(".btn_next_dialog-2").show();
                    $($clone).find(".btn_next_dialog-2").unbind().click(function(){
                        $(this).hide();
                        // if(!$(this).hasClass('unclickable')){
                        //     $(this).addClass('unclickable');
                            $(".img_click").hide();
                            //Function set video
                            let show_soal = 0;
                            $this.setVideoFeedback($clone, video, index, benar, last_index);
                        // }
                    });
                }else{
                    //Function set video
                    let show_soal = 0;
                    $this.setVideoFeedback($clone, video, index, benar, last_index);
                }

                //play audio dialog
                var audio = $this.ldata2['feedback_false'][index]['audio'];
                if(audio != undefined){
                    var src_audio_2 = "assets/audio/"+audio;
                    // console.log(src_audio_2);
                    $this.playDialogSound(src_audio_2);
                }
            }else{
                //show video feedback benar
                let $image = index_dialog["hand_touch_img_video"];
                console.log($image);
                if($image != undefined && $image != ""){
                    //set hand touch image
                    $this.setHandTouchImg($image);

                    //Set cover video
                    if(index_dialog["img_video"] != "" && index_dialog["img_video"] != undefined){
                        let cover_video = index_dialog["img_video"];
                        console.log($this.path_image+'quiz/'+cover_video);
                        $($clone).find(".img_video").attr("src",$this.path_image+'quiz/'+cover_video);
                        $($clone).find(".img_video").show();
                    }
                    //End set cover video

                    $($clone).find(".btn-global").hide();
                    $($clone).find(".btn_next_dialog-2").show();
                    $($clone).find(".btn_next_dialog-2").unbind().click(function(){
                        $(this).hide();
                        // if(!$(this).hasClass('unclickable')){
                        //     $(this).addClass('unclickable');
                            $(".img_click").hide();
                            //Function set video
                            let show_soal = 0;
                            $this.setVideoFeedback($clone, video, index, benar, last_index);
                        // }
                    });
                }else{
                    // $(".img_click").hide();

                    //Function set video
                    let show_soal = 0;
                    $this.setVideoFeedback($clone, video, index, benar, last_index);
                }

                //play audio dialog
                var audio = $this.ldata2['feedback'][index]['audio'];
                if(audio != undefined){
                    var src_audio_2 = "assets/audio/"+audio;
                    // console.log(src_audio_2);
                    $this.playDialogSound(src_audio_2);
                }

                //call function reset timer
                // $this.resetTimer();
            }
            
            //call function set hand touch image
            let $image = arr_dialog[index]["hand_touch_img"];
            if($image != undefined && $image != ""){
                $this.setHandTouchImg($image);
            }else{
                $(".img_click").hide()
            }
        }

        //set style btn_next_dialog-2
        // $(".btn_next_dialog").hide();
        // $(".btn_next_dialog-2").show();
    }else{
        // $this.settingDialogFeedback($clone, benar);
        // $(".btn_next_dialog-2").click();
        let index_2 = $(".btn_next_dialog-2").attr("index");
        $this.settingDialogFeedback_2($clone, benar, index);
    }
};

quizVisnov.prototype.playBacksound = function(src = '') {
    var $this = this;
   
    //play sound 2
    console.log($this.curr_soal);
    console.log($this.question_data);
    console.log($this.question_datas[$this.curr_soal]);

    var src_audio_2
    if(src == ''){
        src_audio_2 = "assets/audio/"+$this.question_datas[$this.curr_soal]['audio'];
    }else{
        src_audio_2 = src;
    }
    console.log('src_audio_2: '+src_audio_2);
    $this.audio_dynamic_2 = game.audio.audio_dynamic(src_audio_2);
    var promise = $this.audio_dynamic_2.play();

    if (promise !== undefined) {
         promise.then(_ => {
         // Autoplay started!
    }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      });
    }

    $this.time_backsound = setInterval(function() {
        var duration = $this.audio_dynamic_2.duration;
        var currentTime = $this.audio_dynamic_2.currentTime;
        // console.log(duration);
        // console.log(currentTime);
        if(duration <= currentTime){
            // clearInterval($this.time_backsound);

            // var contentTimeout = duration * 1000;
            //stop backsound
            $this.stopBackSound();

            setTimeout(function(){
               
                $this.audio_dynamic_2.play();
                // $this.time_backsound = 800;
            },1000);
        }
    },800);    
};

quizVisnov.prototype.playDialogSound = function(src) {
    var $this = this;
   
    //play sound 2
    // var src_audio_2 = "assets/audio/"+$this.question_datas[$this.curr_soal]['audio'];
    var src_audio_2 = src;
    console.log('src_audio_2: '+src_audio_2);
    $this.audio_dialog = game.audio.audio_dynamic(src_audio_2);
    var promise = $this.audio_dialog.play();

    if (promise !== undefined) {
        promise.then(_ => {
            // Autoplay started!
            console.log('Autoplay');
        }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
      });
    }
};

quizVisnov.prototype.setLabelNameQuestion = function($clone, $label_text, $label_style, $label_position, $suara_batin, $label_icon, $label_img){
    $($clone).find(".pilihan_place .question_label_name").removeAttr("style");
    $($clone).find(".pilihan_place .question_label_name .question_label_img .question_label_name-2").remove();
    $($clone).find(".pilihan_place .question_label_name").hide();
    $($clone).find(".pilihan_place .question_label_img").hide();

    /*Function show label name question*/
        if($label_style != undefined){
            $($clone).find(".pilihan_place .question_label_name").css($label_style);

            if($label_text != undefined && $label_text != ""){
                $($clone).find(".pilihan_place .question_label_name-2").html($label_text);
                $($clone).find(".pilihan_place .question_label_name").show();
            }
        }else if($label_img != undefined && $label_img != ""){
            // let html = '<img class="question_label_img" src="assets/image/other/'+$label_img+'" style="width: 4.5vh;height: 4.5vh;">';
            // $($clone).find(".pilihan_place .question_label_name").append(html);

            $($clone).find(".pilihan_place .question_label_img").attr("src","assets/image/other/"+$label_img);
            $($clone).find(".pilihan_place .question_label_img").show();
        }
    /*End function show label name question*/

    /*Function set position label name question*/
        $($clone).find(".pilihan_place .question_label_name").removeClass("left_label");
        $($clone).find(".pilihan_place .question_label_name").removeClass("right_label");
        $($clone).find(".pilihan_place .question_label_name").removeClass("center_label");

        $($clone).find(".pilihan_place .question_label_img").removeClass("left_label");
        $($clone).find(".pilihan_place .question_label_img").removeClass("right_label");
        $($clone).find(".pilihan_place .question_label_img").removeClass("center_label");
        console.log($label_position);
        if($label_position != undefined){
            console.log($($clone).find(".pilihan_place .question_label_name"));
            $($clone).find(".pilihan_place .question_label_name").addClass($label_position.toLowerCase()+"_label");
            $($clone).find(".pilihan_place .question_label_img").addClass($label_position.toLowerCase()+"_label");
        }
    /*End function set position label name question*/

    /*Function set suara batin*/
        $($clone).find('.pilihan_place .txt_question').removeClass("suara_batin");
        if($suara_batin != undefined){
            if($suara_batin == 1){
                $($clone).find('.pilihan_place .txt_question').addClass("suara_batin");
                var img_html = ' <img class="question_img_suara_batin" src="assets/image/other/thinking_emoji.png" style="">';
                $($clone).find('.pilihan_place .question_label_name .question_label_name-2').append(img_html);
            }
        }
    /*End function set suara batin*/

    /*Function set icon label name*/
        if($label_icon != undefined && $label_icon != ""){
            //jika element image suara batin ditemukan
            if($($clone).find('.pilihan_place .question_img_suara_batin').length > 0){
                $($clone).find('.pilihan_place .question_img_suara_batin').attr("src","assets/image/other/"+$label_icon);
            }else{
                var img_html = ' <img class="question_img_suara_batin" src="assets/image/other/'+$label_icon+'" style="">';
                // $($clone).find('.pilihan_place .question_label_name .question_label_name-2').append(img_html);
            }
        }
    /*End function set icon label name*/
}

quizVisnov.prototype.setLabelNameDialog = function($clone, $name_character, $label_style, $label_position, $suara_batin, $label_icon, $label_img, $label_bg_img = ""){
    var $this = this;
    console.log("setLabelNameDialog");
    $($clone).find('.div_name_label').hide();
    // console.log($name_character);
    if($name_character != undefined && $name_character != ''){
        //show label name
        $($clone).find('.div_name_label .name_label_text').html($name_character);
    }

        //if mode suara batin
        $($clone).find('.div_name_label .name_label_text .img_suara_batin').remove();
        
        if($suara_batin != undefined){
            if($suara_batin == 1){
                var img_html = ' <img class="img_suara_batin" src="assets/image/other/thinking_emoji.png" style="">';
                $($clone).find('.div_name_label .name_label_text').append(img_html);
            }
        }

        /*Function set icon label name*/
        if($label_icon){
            //jika element image suara batin ditemukan
            if($($clone).find('.div_name_label .img_suara_batin').length > 0){
                $($clone).find('.div_name_label .img_suara_batin').attr("src","assets/image/other/"+$label_icon);
            }else{
                var img_html = ' <img class="img_suara_batin" src="assets/image/other/'+$label_icon+'" style="">';
                $($clone).find('.div_name_label .name_label_text').append(img_html);
            }
        }
        /*End function set icon label name*/

        /*Function setting css position name_label_text*/
        $($clone).find('.div_name_label').removeClass("left_label");
        $($clone).find('.div_name_label').removeClass("right_label");
        $($clone).find('.div_name_label').removeClass("center_label");
        if($label_position != undefined){
            $($clone).find('.div_name_label .div_name_label-2').css("float",$label_position);
            $($clone).find('.div_name_label').addClass($label_position.toLowerCase()+"_label");
        }else{
            $($clone).find('.div_name_label-2').css("float","left");
        }
        /*End function setting css name_label_text*/

        $($clone).find(".item_dialog .div_label_img").hide();
        $($clone).find(".item_dialog .div_name_label").hide();
        /*Function change desain label name*/
            $($clone).find('.div_name_label-2 .name_label_text').removeAttr("style");
            // console.log($label_style);
            // console.log($label_img);
            if($label_style != undefined){
                if($name_character != undefined && $name_character != ''){
                    $($clone).find('.div_name_label').show();
                }
                $($clone).find('.div_name_label .img_label').hide();
                $($clone).find('.div_name_label .name_label_text').css($label_style);
                // $($clone).find('.div_name_label .name_label_text').css("padding","0.4vh 4.3vw");
            }else if($label_img != undefined && $label_img != ""){
                // let html = '<img class="question_label_img" src="assets/image/other/'+$label_img+'" style="width: 4.5vh;height: 4.5vh;">';
                // $($clone).find(".pilihan_place .question_label_name").append(html);
                $($clone).find(".item_dialog .div_label_img").attr("src","assets/image/other/"+$label_img);
                $($clone).find(".item_dialog .div_label_img").show();
            }else if($label_bg_img != undefined && $label_bg_img != ""){
                $($clone).find('.div_name_label .img_label').attr("src","assets/image/other/"+$label_bg_img);
            }
        /*End function change desain label name*/

        // $($clone).find('.div_name_label').show();    
}

quizVisnov.prototype.setHandTouchImg = function($image){
    console.log("setHandTouchImg");
    console.log($image);
    if($image != undefined && $image != ""){
        $(".img_click").attr("src","assets/image/other/"+$image);
        $(".img_click").show();
    }
}

//function set show or hide dialog feedback base on slide-content id
quizVisnov.prototype.showDialogFeedback = function(index, benar, $clone = ''){
    // alert("showDialogFeedback");
    var $this = this;

    var arr_dialog;

    if($clone == ''){
        
    }else{
        if(benar == 0){
            $($clone).find('.item_dialog_feedback_false_text').hide();
            arr_dialog = $this.ldata2["feedback_false"];
        }else{
            $($clone).find('.item_dialog_feedback_text').hide();
            arr_dialog = $this.ldata2["feedback"];
        }
        // console.log(arr_dialog);
        //jika dialog feedback ditemukan
        if(arr_dialog != undefined && arr_dialog.length > 0){
            var index_dialog = arr_dialog[index];
            
            if(index_dialog != undefined){
                //setting name label

                $($clone).find('.item_dialog').show();
                $($clone).find('.btn_next_dialog-2').show();
                // console.log(index);
                // console.log(arr_dialog);

                if(benar == 0){
                    if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                        $($clone).find('#item_dialog_feedback_false_text-'+index).show();
                        $(".btn_dialog_wrapper #btn_dialog-1").show();
                    }else{
                        $(".btn_dialog_wrapper .btn_dialog").hide();
                    }

                    //play audio dialog
                    var audio = $this.ldata2['feedback_false'][index]['audio'];
                    if(audio != undefined){
                        var src_audio_2 = "assets/audio/"+audio;
                        // console.log(src_audio_2);
                        $this.playDialogSound(src_audio_2);
                    }
                }else{
                    if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                        $($clone).find('#item_dialog_feedback_text-'+index).show();
                        $(".btn_dialog_wrapper #btn_dialog-1").show();
                    }else{
                        $(".btn_dialog_wrapper .btn_dialog").hide();
                    }

                    //play audio dialog
                    var audio = $this.ldata2['feedback'][index]['audio'];
                    if(audio != undefined){
                        var src_audio_2 = "assets/audio/"+audio;
                        // console.log(src_audio_2);
                        $this.playDialogSound(src_audio_2);
                    }

                    //call function reset timer
                    // $this.resetTimer();
                }

                

                //dari dialog menuju ke soal maka text berubah jadi start 
                if(index == (arr_dialog.length - 1)){
                    if(benar == 1){

                    }else{

                    }
                }else{

                }
                // console.log(arr_dialog);
                // console.log(index);
                var arr_img_character = arr_dialog[index]['img_character'];
                var name_character = arr_dialog[index]['text_2'];
                // console.log(arr_img_character);
                $($clone).find('.img_item').hide();
                $($clone).find('.img_item').css('right','unset');
                $($clone).find('.img_item').css('position','absolute');
                $($clone).find('.img_item').removeClass('cust');
                if(arr_img_character != undefined){
                    if(arr_img_character.length > 0){
                        // console.log('arr_img_character.length: '+arr_img_character.length);
                        if(arr_img_character.length == 1){
                            $($clone).find('#img_item-'+arr_img_character[0]).css('position','unset');
                            $($clone).find('#img_item-'+arr_img_character[0]).show();
                        }else if(arr_img_character.length == 2){
                            $($clone).find('#img_item-'+arr_img_character[0]).addClass('cust');
                            $($clone).find('#img_item-'+arr_img_character[0]).show();
                            // console.log($($clone));
                            // console.log($($clone).find('#img_item-'+arr_img_character[1]));
                            $($clone).find('#img_item-'+arr_img_character[1]).addClass('cust');
                            $($clone).find('#img_item-'+arr_img_character[1]).css('right',0);
                            $($clone).find('#img_item-'+arr_img_character[1]).show();
                        }
                    }

                    //call function set label name
                    let $label_text = name_character;
                    let $label_style = arr_dialog[index]["label_name_style"];
                    let $label_position = arr_dialog[index]["text_2_position"]; 
                    let $suara_batin = arr_dialog[index]["suara_batin"];
                    let $label_icon = arr_dialog[index]["label_name_icon"];
                    let $label_img = arr_dialog[index]["text_2_img"];
                    $this.setLabelNameDialog($clone, $label_text, $label_style, $label_position, $suara_batin, $label_icon, $label_img);

                    //call function set hand touch image
                    let $image = arr_dialog[index]["hand_touch_img"];
                    if($image != undefined && $image != ""){
                        $this.setHandTouchImg($image);
                    }else{
                        $(".img_click").hide()
                    }
                }
            }

            //set style btn_next_dialog-2
            $(".btn_next_dialog").hide();
            $(".btn_next_dialog-2").show();
        }else{
            // $this.settingDialogFeedback($clone, benar);
            // $(".btn_next_dialog-2").click();
            let index_2 = $(".btn_next_dialog-2").attr("index");
            $this.settingDialogFeedback_2($clone, benar, index);
        }
    }
}

quizVisnov.prototype.showHideSoal = function(mode){
    if(mode == 'show'){
        // $('.modal-backdrop-cust').show();
        console.log($('.pilihan_place'));
        $('.pilihan_place').css('z-index',1041);
        $('.pilihan_place').css('position','fixed');
        $('.pilihan_place').css('display','block');

        //hide btn_dialog
        // $('.btn_dialog_wrapper .btn_dialog').hide();
    }else{
        $('.modal-backdrop-cust').hide();
        $('.pilihan_place').css('z-index','unset');
        $('.pilihan_place').css('position','unset');
        $('.pilihan_place').hide();
    }
}

//stop backsound
quizVisnov.prototype.stopBackSound = function(){
    var $this = this;
    //pause sound
    // console.log($this.audio_dynamic_2);
    if($this.audio_dynamic_2 != undefined){
        $this.audio_dynamic_2.pause();
        $this.audio_dynamic_2.currentTime = 0;
    }

    // if(game.audio_backsound_per_stage != undefined){
    //     clearInterval(game.audio_backsound_per_stage);
    //     game.audio_backsound_per_stage.pause();
    //     game.audio_backsound_per_stage.currentTime = 0;
    // }
}

quizVisnov.prototype.substringText = function(string, max_string){
    var $this = this;
    /*Function set dialog text*/
        let dialog_text = string;
        console.log(dialog_text.length);
        console.log(max_string);
        if(dialog_text.length > max_string){
            let string_2 = 16;
            let arr_html_found = $this.getHtmltag(dialog_text);

            if(arr_html_found.length > 0){
                string_2 = 23;
            }

            dialog_text = dialog_text.substring(0, (max_string-string_2));
            dialog_text += "...";
        }
        console.log(dialog_text);
        console.log(dialog_text.length);
        return dialog_text;
    /*End function set dialog text*/
}

quizVisnov.prototype.substringText_2 = function(string, max_string){
/*Function set dialog text*/
    let dialog_text = string;
    console.log(dialog_text.length);
    console.log(max_string);
    if(dialog_text.length > max_string){
        dialog_text = dialog_text.substring(0, max_string);
        // dialog_text += "...";
    }
    console.log(dialog_text);
    console.log(dialog_text.length);
    return dialog_text;
/*End function set dialog text*/
}

quizVisnov.prototype.getHtmltag = function (a){
    var temp = document.createElement("div");
     temp.innerHTML = a;

     var all = temp.getElementsByTagName("*");
     var tags = [];
     for (var i = 0, max = all.length; i < max; i++) {
       // Do something with the element here
       console.log(all[i].tagName);
       tags.push(all[i].tagName);
     }

     console.log(tags);

     return tags;
}

quizVisnov.prototype.showQuestion_2 = function($clone){
    var $this = this;
    $this.showHideSoal('show');
    $($clone).find('.div_name_label').hide();
    $($clone).find('.img_item').hide();
    $($clone).find('.item_dialog_feedback_false_text').hide();
    $($clone).find('.item_dialog').hide();

    // $this.setTextButton('btn_next_dialog-2','Next');
    $($clone).find('.btn_next_dialog-2').attr('index',0);
    $($clone).find('.btn_next_dialog-2').hide();

    // //reset question of answer
    // $($clone).find('.pilihan_place').find('.pilihan').each(function(e){
    //     console.log($(this));
    //     $(this).removeClass('active');
    //     $(this).removeClass('right');
    //     $(this).removeClass('wrong');
    // });
}

//function setting next soal 
quizVisnov.prototype.nextSoal = function(){
    console.log('nextSoal');
    var $this = this;
    // console.log($this.curr_soal);
    // $this.curr_soal += 1;
    //  console.log($this.curr_soal);
    $this.game_data['curr_soal'] = $this.curr_soal;
    $this.game_data['show_feedback_visnov'] = 1;
    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);


    // let curr_soal_next = ($this.game_data['curr_soal_next'] != undefined ? $this.game_data['curr_soal_next'] :0);
    // if(curr_soal_next < $this.question_datas.length){
    //     curr_soal_next += 1;
    // }
    let curr_soal_next = ldata["answer"].length;
    $this.game_data['curr_soal_next'] = curr_soal_next;

    // console.log($this.game_data);
    // $this.game_data = $this.game_data;
    game.scorm_helper.setSingleData('game_data', $this.game_data);
    console.log($this.game_data);
    console.log(ldata);

    //stop interval play sound
    clearInterval($this.time_backsound);
    $this.stopBackSound();
    // alert($this.current_settings["slide"]);
    // console.log($this.current_settings["slide"]);
    // $this.current_settings["slide"] = 3;
    console.log($this.current_settings["slide"]);
    game.setSlide($this.current_settings["slide"]);
}

//functon setting next soal if current soal last soal
quizVisnov.prototype.nextSoalAtLast = function(){
    var $this = this;
    console.log("nextSoalAtLast");
    // alert("nextSoalAtLast");
    // console.log($this.game_data);

    // $this.game_data["curr_soal"] = 0;
    // $this.game_data["curr_soal"] = 0;
    // let ldata = game.scorm_helper.getSingleData("game_slide_"+$this.current_settings["slide"]);
    var game_quiz = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]]);
    console.log(game_quiz);

    if($this.setting_global["mode_visual_novel"] == "linear"){

    }else{
        /*Function set stage clear*/ 
            let selected_stage = $this.game_data["selected_stage"];
            let complete_stage = ($this.game_data["complete_stage"] != undefined ? $this.game_data["complete_stage"] : []);
            let failed_stage = ($this.game_data["failed_stage"] != undefined ? $this.game_data["failed_stage"] : []);
            let percent_correct_answer =  game_quiz["score"] / game_quiz["total_soal"] * 100;
            console.log(percent_correct_answer);
            let percent_correct_answer_per_stage = ($this.settings["percent_correct_answer_per_stage"] != undefined ? $this.settings["percent_correct_answer_per_stage"] : $this.setting_global["percent_correct_answer_per_stage"]);


            if(percent_correct_answer >=  percent_correct_answer_per_stage){
                let index_failed = failed_stage.indexOf(selected_stage);
                if(index_failed > -1){
                    failed_stage.splice(index_failed,1);
                }
                complete_stage.push(selected_stage);
            }else{
                // console.log(game.scorm_helper.ldata);
                let quiz = game.scorm_helper.ldata["quiz"];
                console.log(quiz);
                // console.log(quiz.length);
                // console.log($this.question_datas.length);

                let index_failed = failed_stage.indexOf(selected_stage);
                console.log(index_failed);
                // let start_index = parseInt(quiz.length) - parseInt($this.question_datas.length);
                // quiz.splice(start_index,parseInt($this.question_datas.length));

                //kurangi last_score dari score yang salah dijawab pada satage ini
                if($this.game_data["last_score"] > 0){
                    console.log($this.question_datas);
                    // console.log($this.game_data["total_answer_true"]);
                    // if(selected_stage == 1){
                    //     $this.game_data["last_score"] = 0;
                    // }else{
                        // $this.game_data["last_score"] -= $this.game_data["total_answer_true"];
                    // }
                }

                if(index_failed == -1){
                    // console.log(quiz);
                    failed_stage.push(selected_stage);
                }
            }

            console.log(complete_stage);       
            console.log(failed_stage);       
            if((($this.curr_step+1) < $this.game_data["total_stage"]) && ((complete_stage.length + failed_stage.length) == ($this.curr_step+1))){
                $this.curr_step += 1; 
                $this.game_data["curr_step"] = $this.curr_step;
            }

            console.log(complete_stage);
            console.log(failed_stage);
            $this.game_data["complete_stage"] = complete_stage;
            $this.game_data["failed_stage"] = failed_stage;
            // $this.game_data["total_answer_true_2"] = $this.game_data["total_answer_true"];
            // $this.game_data["total_answer_true"] = 0;
        /*End function set stage clear*/ 
    }

    // console.log($this.game_data);
    $this.game_data = $this.game_data;
    console.log($this.game_data);
    game.scorm_helper.setSingleData('game_data', $this.game_data);

    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    console.log(ldata);
    let ldata2 = game.scorm_helper.ldata;
    console.log(ldata2);
    // console.log($this.game_data);
    clearInterval($this.time_backsound);

    if($this.audio_dynamic_2 != undefined){
        $this.audio_dynamic_2.pause();
    }

    if($this.audio_dialog != undefined){
        $this.audio_dialog.pause();
    }
    // console.log($this.game_data);

    // console.log("slide_result: "+$this.slide_result_per_step);
    game.pause_timer_global = true;

    //stop backsound per stage
    if(game.time_backsound_per_stage != undefined){
        console.log(game.time_backsound_per_stage);
        clearInterval(game.time_backsound_per_stage);
    }

    if(game.audio_backsound_per_stage != undefined){
        console.log(game.audio_backsound_per_stage);
        game.audio_backsound_per_stage.pause();
        game.audio_backsound_per_stage.currentTime = 0;
    }

    if(game.time_backsound_per_stage != undefined){
        game.time_backsound_per_stage = undefined;
    }

    //set video interval false
    $this.play_video_flag = false;

    if($this.setting_global['mode_visual_novel'] == "linear"){
        // game.setSlide($this.setting_global['slide_result']);
        // alert("nextSlide");
        game.nextSlide();
    }else{
        if($this.setting_global['hide_result_step_page'] != undefined){
            if($this.setting_global['hide_result_step_page'] == true){
                game.setSlide($this.setting_global['slide_game_map']);
            }
        }else{
            // alert($this.slide_result_per_step);
            game.setSlide($this.setting_global["slide_game_map"]);
            // game.nextSlide();
        }
    }
}

quizVisnov.prototype.setVideo = function($clone = '', src, show_soal = '', index, flag_loop = 0) {
    console.log("setVideo");
    // alert("setVideo");
    var $this = this;
    // console.log($(".img_video"));
    // $(".img_video").show();
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    // console.log($(".img_video"));
    // $(".img_video").show();
    $("#video").hide();
    $("#video")[0].load();

    game.showLoading();
    let flag_play_video = 0;
    $("#video").on("canplay",function(e){
        if(flag_play_video == 0){
            flag_play_video = 1;
            game.hideLoading();

            //check if game resume
            // console.log($this.resume);
            $("video").prop('muted',false);
            if($this.resume != undefined){
                if ($this.resume == 1) {
                    $this.resume = undefined;
                    //muted video, agar bisa diplay
                    $("video").prop('muted',true);
                }
            }

            // $(".img_video").hide();
            $("#video").show();
            $this.playVideo_loop();

            if(flag_loop == 0){
                /*Function set dialog*/
                    var arr_dialog = $this.ldata2["text_3"];
                    var name_character = $this.ldata2["text_3"][index]['text_2'];

                    //show hide dialog text and box
                    // console.log(arr_dialog[index]["text"]);
                    $($clone).find('.item_dialog_text').hide();
                    if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                        $($clone).find('#item_dialog_text-'+index).show();
                        // console.log($($clone).find(".btn_dialog_wrapper"));
                        // $($clone).find(".btn_dialog_wrapper").show();
                        $($clone).find(".btn_dialog_wrapper img").show();
                    }else{
                        $($clone).find(".btn_dialog_wrapper img").hide();
                    }

                    //call function set label name
                    let $label_text = name_character;
                    let $label_style = $this.ldata2["text_3"][index]["label_name_style"];
                    let $label_position = $this.ldata2["text_3"][index]["text_2_position"]; 
                    let $suara_batin = $this.ldata2["text_3"][index]["suara_batin"];
                    let $label_icon = $this.ldata2["text_3"][index]["label_name_icon"];
                    let $label_img = $this.ldata2["text_3"][index]["text_2_img"];
                    $this.setLabelNameDialog($clone, $label_text, $label_style, $label_position, $suara_batin, $label_icon, $label_img);

                    //call function set hand touch
                    let $image = $this.ldata2["text_3"][index]["hand_touch_img"];
                    if($image != undefined && $image != ""){
                        $this.setHandTouchImg($image);
                    }else{
                        $(".img_click").hide()
                    }
                /*End function set dialog*/
            }

            // console.log(show_soal);
            if(show_soal == 1){
                // alert('show soal');
                $($clone).find(".btn-global").hide();

                $($clone).find(".btn_next_dialog").show();
                $($clone).find(".btn_next_dialog").unbind().click(function(){
                    $(this).hide();
                    if(!$(this).hasClass('unclickable')){
                        //clear interval
                        // clearInterval($this.play_video_interval);

                        $(this).addClass('unclickable');
                        //hide dialog element
                        $($clone).find(".item_dialog_text").hide();
                        $($clone).find(".div_name_label").hide();

                        //pause video
                        // $this.pauseVideo();

                        //check if question_video exist
                        if($this.ldata2["question_video"] != undefined){
                            if($this.ldata2["question_video"] != ""){
                                //set video question
                                let src_2 = $this.ldata2["question_video"];
                                $this.setVideo_2(src_2);
                            }
                        }

                        //set soal
                        // show soal element
                        $(".txt_question").show();
                        // alert("showHideSoal 99");
                        $this.showHideSoal('show');
                        $this.setSoalVideo($clone, index);
                    }
                });
            }else{
                console.log('showVideo');
                let index_2 = index + 1;

                $(".btn_next_dialog").show();
                $($clone).find(".btn_next_dialog").unbind().click(function(){
                    $(this).hide();

                    //clear interval
                    // clearInterval($this.play_video_interval);

                    // alert('btn_next_dialog');
                    $($clone).find(".item_dialog_text").hide();
                    $($clone).find(".div_name_label").hide();
                    $this.showVideo(index_2, $clone);
                });
            }

            $("#video").on("ended",function(e){
                $(this).off();
                // $this.pauseVideo();

                //call function set video, to call again this video
                // clearInterval($this.play_video_interval);
                // console.log($this.play_video_interval);
                // $this.play_video_interval = setInterval(function() {
                    // console.log($this.play_video_interval);
                    // $(this).loop = true;
                    // $this.playVideo_loop();
                    // var vid = document.getElementById("video");
                // },200);
            });
        }
    });
};

quizVisnov.prototype.setVideo_2 = function(src) {
    // alert("setVideo_2");
    var $this = this;
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    // console.log($(".img_video"));
    // $(".img_video").show();
    $("#video").hide();
    $("#video")[0].load();

    game.showLoading();
    $("#video").on("canplay",function(e){
        game.hideLoading();
        // $(".img_video").hide();
        $("#video").show();
        $this.playVideo();

        $(".item_dialog_text").hide();
        $(".btn_dialog_wrapper .btn_dialog").hide();
        $(".div_name_label").hide();
        $(".btn-global").hide();

        $("#video").on("ended",function(e){
            $(this).off();
            // $this.pauseVideo();

            //call function set video, to call again this video
            // $this.play_video_interval_step = setInterval(function() {
            //     $this.playVideo();
            // },200);

            $this.playVideo_loop();
        });
    });
};

quizVisnov.prototype.setVideoFeedback = function($clone = '', src, index, benar, last_index = '') {
    console.log("setVideoFeedback");
    // alert("setVideo");
    var $this = this;
    // $(".img_video").show();
    // console.log($("#video").find("source"));
    // console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    // console.log($(".img_video"));
    $(".img_video").hide();
    $("#video").hide();
    $("#video")[0].load();

    game.showLoading();
    $this.pauseVideo();
    let flag_play_video = 0;
    $("#video").on("canplay",function(e){
        if(flag_play_video == 0){
            flag_play_video = 1;
            game.hideLoading();
            // $(".img_video").hide();
            $("#video").show();
            $this.playVideo_loop();

            //hide item dialog
            // console.log($($clone).find(".item_dialog_text"));
            $($clone).find(".item_dialog_text").hide();

            if(benar == 0){
                var arr_dialog = $this.ldata2["feedback_false"];
                var name_character = $this.ldata2["feedback_false"][index]['text_2'];
                console.log(arr_dialog);

                $($clone).find('.item_dialog_feedback_false_text').hide();
                if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                    $($clone).find('#item_dialog_feedback_false_text-'+index).show();
                    $(".btn_dialog_wrapper #btn_dialog-1").show();
                }else{
                    $(".btn_dialog_wrapper .btn_dialog").hide();
                }

                //play audio dialog
                var audio = $this.ldata2['feedback_false'][index]['audio'];
                if(audio != undefined){
                    //clear interval
                    // clearInterval($this.play_video_interval_feedback);

                    var src_audio_2 = "assets/audio/"+audio;
                    $this.playDialogSound(src_audio_2);
                }
            }else{
                var arr_dialog = $this.ldata2["feedback"];
                var name_character = $this.ldata2["feedback"][index]['text_2'];

                $($clone).find('.item_dialog_feedback_text').hide();
                if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                    $($clone).find('#item_dialog_feedback_text-'+index).show();
                    $(".btn_dialog_wrapper #btn_dialog-1").show();
                }else{
                    $(".btn_dialog_wrapper .btn_dialog").hide();
                }

                //play audio dialog
                var audio = $this.ldata2['feedback'][index]['audio'];
                if(audio != undefined){
                    //clear interval
                    // clearInterval($this.play_video_interval_feedback);

                    var src_audio_2 = "assets/audio/"+audio;
                    $this.playDialogSound(src_audio_2);
                }
            }

            var name_character = arr_dialog[index]['text_2'];

            //call function set label name
            let $label_text = name_character;
            let $label_style = arr_dialog[index]["label_name_style"];
            let $label_position = arr_dialog[index]["text_2_position"]; 
            let $suara_batin = arr_dialog[index]["suara_batin"];
            let $label_icon = arr_dialog[index]["label_name_icon"];
            let $label_img = arr_dialog[index]["text_2_img"];
            // alert("setLabelNameDialog");
            $this.setLabelNameDialog($clone, $label_text, $label_style, $label_position, $suara_batin, $label_icon, $label_img);

            //call function set hand touch image
            let $image = arr_dialog[index]["hand_touch_img"];
            if($image != undefined && $image != ""){
                $this.setHandTouchImg($image);
            }else{
                $(".img_click").hide();
            }


            //remove class unclickable di class btn_next_dialog
            // $(".btn_next_dialog").removeClass('unclickable');

            $($clone).find(".btn_next_dialog-2").show();
            $($clone).find(".btn_next_dialog-2").unbind().click(function(){
                // console.log("btn_next_dialog-2");
                //clear interval
                // clearInterval($this.play_video_interval_feedback);

                // console.log(last_index);
                if(last_index == 1){
                    let index_2 = index + 1;
                    $this.settingDialogFeedbackVideo_2($clone, benar, index_2);
                }else{
                    let index_2 = index + 1;
                    $this.showVideoFeedback($clone, benar, index_2);
                }
            });

            $("#video").on("ended",function(e){
                $(this).off();
                // $this.pauseVideo();

                // $this.play_video_interval_feedback = setInterval(function() {
                //     $this.playVideo();
                // },200);

                // $this.playVideo_loop();
            });
        }
    });
};

quizVisnov.prototype.playVideo = function() {
    var $this = this;
    // console.log($("#video")[0]);
    $("#video")[0].play();
};

quizVisnov.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

quizVisnov.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};

//function set show or hide dialog feedback base on slide-content id
quizVisnov.prototype.showVideo = function(index, $clone = ''){
    var $this = this;
   
    if($clone == ''){
       
    }else{
        $($clone).find('.item_dialog_text').hide();
        var arr_dialog = $this.ldata2["text_3"];
        var index_dialog = arr_dialog[index];
        // console.log(index_dialog);
        let video = index_dialog['video'];
        // console.log(video);
        // console.log('index_dialog');
        // console.log(index_dialog);
        // console.log(index);
        if(index_dialog != undefined && arr_dialog.length > (index+1)){
            //setting video
            //call function set hand touch image
            let $image = index_dialog["hand_touch_img_video"];
            // console.log($image);
            if($image != undefined && $image != ""){
                //set hand touch image
                $this.setHandTouchImg($image);

                //Set cover video
                if(index_dialog["img_video"] != "" && index_dialog["img_video"] != undefined){
                    let cover_video = index_dialog["img_video"];
                    // console.log($this.path_image+'quiz/'+cover_video);
                    $($clone).find(".img_video").attr("src",$this.path_image+'quiz/'+cover_video);
                    $($clone).find(".img_video").show();
                }
                //End set cover video

                $($clone).find(".btn-global").hide();
                $($clone).find(".btn_next_dialog").show();
                $($clone).find(".btn_next_dialog").unbind().click(function(){
                    // alert("2");
                    $(this).hide();
                    // if(!$(this).hasClass('unclickable')){
                    //     $(this).addClass('unclickable');
                        $(".img_click").hide();
                        //Function set video
                        let show_soal = 0;
                        $this.setVideo($clone, video, show_soal, index);
                    // }
                });
            }else{
                // $(".img_click").hide();

                //Function set video
                let show_soal = 0;
                $this.setVideo($clone, video, show_soal, index);
            }
        }else{
            //play audio dialog
            var audio = index_dialog['audio'];
            if(audio != undefined){
                var src_audio_2 = "assets/audio/"+audio;
                // console.log(src_audio_2);
                $this.playDialogSound(src_audio_2);
            }

            //call function set hand touch image
            let $image = index_dialog["hand_touch_img_video"];
            if($image != undefined && $image != ""){
                //Set cover video
                if(index_dialog["img_video"] != "" && index_dialog["img_video"] != undefined){
                    let cover_video = index_dialog["img_video"];
                    console.log($this.path_image+'quiz/'+cover_video);
                    $(".img_video").attr("src",$this.path_image+'quiz/'+cover_video);
                    $(".img_video").show();
                }
                //End set cover video

                $($clone).find(".img_click").show();

                $($clone).find(".btn-global").hide();
                $($clone).find(".btn_next_dialog").show();
                $($clone).find(".btn_next_dialog").unbind().click(function(){
                     // alert("3");
                    $(this).hide();
                    // if(!$(this).hasClass('unclickable')){
                    //     $(this).addClass('unclickable');
                        //Function set video
                        let show_soal = 1;

                        $($clone).find(".img_click").hide();

                        $this.setVideo($clone, video, show_soal, index);
                    // }
                });
            }else{
                // $(".img_click").hide();

                //Function set video
                let show_soal = 1;
                $this.setVideo($clone, video, show_soal, index);
            }
            //pause sound
            if($this.audio_dialog != undefined){
                $this.audio_dialog.pause();
            }
        }
    }
};

quizVisnov.prototype.setSoalVideo = function($clone, index){
    var $this = this;
    console.log("setSoalVideo");
    var arr_dialog = $this.ldata2["text_3"];
    var index_dialog = arr_dialog[index];

    console.log($this.ldata2);
    $($clone).find(".pilihan_place .txt_question").html($this.ldata2["question"]);
    $('.modal-backdrop-cust').show();
    $($clone).find(".pilihan_place .div_question").addClass("float");

    // let item_div_n = 1;
    // let dialog_text = 
    // /*Function set css pilihan jawaban box*/
    //     if($this.ldata2['box_style'] != undefined){
    //         $clone.find("#item-"+item_div_n+" .div_question .txt_question").css($this.ldata2['box_style']);
    //     }else{
    //         $clone.find("#item-"+item_div_n+" .div_question .txt_question").removeAttr('style');
    //         // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
    //     }
    // /*End function set css dialog box*/
    // $clone.find("#item-"+item_div_n+" .div_question .txt_question").html(dialog_text);

    //setting btn_dialog_wrapper
    $(".btn_dialog_wrapper .btn_dialog").hide();
    if(index_dialog["text"] != undefined && index_dialog["text"] != ""){
        $(".btn_dialog_question_wrapper #btn_dialog_question-1").show();
    }else{
        $(".btn_dialog_question_wrapper .btn_dialog_question").hide();
    }

    /*Setting label name question*/
        let $label_text = $this.ldata2["label_question_text"];
        let $label_style = $this.ldata2["label_name_question_style"];
        let $label_position = $this.ldata2["label_question_position"]; 
        let $suara_batin = $this.ldata2["suara_batin"];
        let $label_icon = $this.ldata2["label_name_icon"];
        let $label_img = $this.ldata2["label_question_img"];
        $this.setLabelNameQuestion($clone, $label_text, $label_style, $label_position, $suara_batin, $label_icon, $label_img);
    /*End setting label name question*/

    // setTimeout(function() {
        // $('.div_pilihan').addClass("animated_custom");
        // $('.div_pilihan').addClass("fadeIn");
        $($clone).find(".pilihan_place .row_pilihan").show();
    // },500);

    if($this.isTimer){
        $this.startGameTimer();
    }else{
        $(".timer_quiz").hide();
    }
};

//function set tutorial
quizVisnov.prototype.setTutorial = function() {
    console.log("setTutorial");
    var $this = this;
    console.log(game.show_tutorial_visnov);
    if(game.show_tutorial_visnov == 0){
        $("#tutorial .tutorial.visnov").addClass("done");
        $("#tutorial .tutorial.visnov").addClass("active");
        $("#tutorial").modal({backdrop: 'static',keyboard: true,show: true});
        // $(".modal-backdrop.in").css("background","#fff");
        // $("#tutorial .tutorial.visnov").find("div").first().slick({
        //     dots: true,
        //     infinite: false,
        //     speed: 500,
        //     prevArrow: false,
        //     nextArrow: false
        // });
        $("#tutorial .tutorial.visnov").find(".start-game").click(function(e){
            game.show_tutorial_visnov = 1;
            $("#tutorial .tutorial.visnov").removeClass("done");
            $("#tutorial .tutorial.visnov").removeClass("active");
            $("#tutorial").modal('hide');

            // $this.stage_brankas();
            $this.mulai_game();
        });
    }else{
        // $this.stage_brankas();
        $this.mulai_game();
    }
};

/*Function get total soal from all stage*/
quizVisnov.prototype.get_total_soal = function() {
    console.log("get_total_soal");
    var $this = this;
    $this.total_soal = game.total_soal;
    // console.log($this.total_soal);
    // console.log($this.total_step);

    if($this.total_soal == 0){
        for (var i = 0; i < $this.total_step; i++) {
            // console.log(i);
            // console.log($this.current_settings["slide"]);
            let no = $this.current_settings["slide"] + i;
            const no_2 = i;
            // console.log("config/setting_quiz_slide_"+no+".json");
            $.get($this.json_prefix_name+no+".json",function(e3){
                console.log(e3);
                // console.log(game.scorm_helper.lmsConnected);
                //check lms connect
                // e3 = (game.scorm_helper.lmsConnected == true ? JSON.parse(e3) : e3);
                $this.total_soal += e3["list_question"].length;
                // console.log($this.total_soal);
                game.total_soal = $this.total_soal;

                // console.log($this.total_soal);
                // console.log(($this.total_step-1));
                // console.log(no_2);
                // console.log(($this.total_step-1) == no_2);
                // if(($this.total_step-1) == no_2){
                    // $this.mulai_game();
                // }
            },'json');
        }
        // console.log($this.total_soal);
    }else{
        // $this.mulai_game();
    }
};
/*End function get total soal from all stage*/ 

quizVisnov.prototype.setTutorialSlider = function() {
    var $this = this;
    let ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
    /*Generate content to tutorial*/
        // game.flag_tutorial_show = 1;
        $this.cloneLogoImage = $("#popupList-2 .logo_image img").first().clone();
        $this.cloneWrapper = $("#popupList-2 .point_wrapper").first().clone();
        $("#popupList-2").find(".logo_image").html("");
        $("#popupList-2").find(".slider_wrapper").html("");

        $this.tutorial_data = $this.question_datas[$this.curr_soal]["list_feedback_slider"];
        console.log($this.tutorial_data);
        if ($this.tutorial_data.length > 0) {
            $("#popupList-2").find(".slider_wrapper").html("");
            console.log($this.cloneWrapper.find(".point_desc"));
            for (var i = 0; i < $this.tutorial_data.length; i++) {
                var cWrapper = $($this.cloneWrapper).first().clone();
                var cLogoImage = $($this.cloneLogoImage).first().clone();
                // Setting image
                if($this.tutorial_data[i]["image"] != undefined){
                    cLogoImage.attr("id","logo_image-"+i);
                    cLogoImage.attr("src","assets/image/tutorial/"+$this.tutorial_data[i]["image"]);
                    
                    if(i>0){
                        cLogoImage.hide();
                    }
                }

                //Setting logo_image
                $(".logo_image").append(cLogoImage);

                // Setting title
                cWrapper.find(".title").html($this.tutorial_data[i]["title"]);

                //setting imga
                 cWrapper.find(".slider_image").attr("src","assets/image/tutorial/"+$this.tutorial_data[i]["image"]);

                // Setting desc
                console.log(cWrapper.find(".point_desc"));
                cWrapper.find(".point_desc").html($this.tutorial_data[i]["desc"]);

                // var cList = $($this.cloneList).first().clone();
                // $(cList).find(".point_desc").html($this.listSlider[parseInt($(this).closest(".list_slider").attr("data-slick-index"))]["click_and_show_image"][parseInt($(this).attr("index"))]["list"][m][n]);
                // $(cWrapper).append(cList);

                if((i+1) < $this.tutorial_data.length){
                    cWrapper.find(".button_wrapper").hide();
                }else{
                    cWrapper.find(".button_wrapper").show();
                }

                $("#popupList-2").find(".slider_wrapper").append(cWrapper);
            }
        }
    /*End generate content to tutorial*/

    $("#popupList-2").modal({backdrop: 'static',keyboard: true,show: true});
    $this.sliderPopup();

    $("#popupList-2 .start-game-quiz").click(function(e){
        $("#popupList-2").modal('hide');
        $("#popupList-2").find(".slider_wrapper").slick('unslick');
        // $this.mulai_game();
        // console.log($this.curr_soal);
        // console.log($this.question_datas.length);
        // let curr_soal = ldata["answer"];
        if(ldata["answer"].length == $this.question_datas.length && ldata["answer"].indexOf(0) == -1){
            $this.nextSoalAtLast();
        }else{
            $this.nextSoal();
        }
    });
};

quizVisnov.prototype.sliderPopup = function() {
    var $this = this;

    $("#popupList-2").find(".slider_wrapper").not('.slick-initialized').slick({
        slidesToShow: 1,
        dots: true,
        infinite: false,
        speed: 500,
        arrows: false,
        variableWidth: true
    });

    console.log($("#popupList-2").find(".slider_wrapper"));
    let slider_length = $("#popupList-2").find(".slider_wrapper").length;
    console.log(slider_length);
    if(slider_length == 1){
        $("#popupList-2 .logo_image img").show();
        $("#popupList-2 .start-game-quiz").show();
    }
    $("#popupList-2").find(".slider_wrapper").on("afterChange", function(event, slick, currentSlide, nextSlide){
        console.log(event);
        console.log(slick);
        console.log(slick["slideCount"]);

        console.log("currentSlide: "+currentSlide);
        $("#popupList-2").find(".logo_image img").hide();
        $("#popupList-2").find("#logo_image-"+currentSlide).show();

        if((slick["slideCount"] - 1) == currentSlide){
            $(this).find(".start-game-quiz").show();
        }else{
            $(this).find(".start-game-quiz").hide();
        }
    });

    console.log($("#popupList-2").find(".slider_wrapper"));
    console.log($("#popupList-2").find(".slider_wrapper")[0]);
    $("#popupList-2").find(".slider_wrapper")[0].slick.refresh();

    $('.modal#popupList-2').on('shown.bs.modal', function (e) {
        $("#popupList-2").find(".slider_wrapper").resize();
    });
};