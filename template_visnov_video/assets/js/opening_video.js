var timer_interval = 0;
var flag_item_click = 0;
var item_selected2 = undefined;
var time_backsound = 0;

var Opening = function(){
    
}

Opening.prototype.init = function(current_settings) {
    console.log('init modul');
    var $this = this;
    /*game data*/
    $this.current_settings = current_settings;
    
    $this.game_data = game.game_data;
    $this.category_game = 0;
    $this.curr_soal = 0;
    $this.life = game.life_max;
   
    $this.isViewVideo = game.isViewVideo;
    $this.question_data = [];
    $this.isAppend=0;
    $this.attemp_soal=0;
    $this.isRand = false;
    $this.isTimer = true;
    $this.countTime = 300;
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"];
    $this.slide_content = $(".slider-content").clone();
    $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();
    $this.video_path = 'assets/video/opening/';
    $this.path_image = "assets/image/";
    $this.play_video_interval_opening; //variabel interval play video

    // $this.mode = 1;
    // $this.currAnswer = 0;

    /*Setting visual novel*/
        $this.time = 0;
        $this.loading_timeout = 4200;//in milisecond
        $this.item_selected = undefined; //item yang dipilih untuk ditempatkan
        $this.video_feedback_false_answer = 1; //variabel untuk menentukan video_feedback_false
        $this.backsound = 1; //variabel enable or disable backsound [0,1]
        $this.time_backsound = 0; //time interval backsound
        $this.auto_next_dialog = game.auto_next_dialog;
        $this.time_auto_next = game.time_auto_next; //variabel time auto tap
        $this.interval_auto_next; //interval auto next
    /*End setting visual novel*/

    //slide number page
    $this.slide_result_per_step = 8;
    $this.slide_result = 9;
    $this.tryagain_question_false_answer = game.tryagain_question_false_answer;

    // console.log("config/setting_quiz_slide_"+$this.current_settings["slide"]+".json");
    $.get("config/setting_opening_slide_"+$this.current_settings["slide"]+".json",function(e){
        console.log(e);
        $this.ldatas = e;
        $this.settings = e["settings"];
        // console.log($this.category_game);
        $this.question_datas = e['list_question'];

        //set game data-prev
        $this.game_data["total_soal_current_slide"] = $this.question_datas.length;

        $this.question_data = e['list_question'][$this.category_game];
        // console.log($this.question_data);
        // setting timer game per soal
        $this.isTimer = (e["settings"]["duration"])?true:false;
        // $this.isTimer = ($this.question_data[$this.curr_soal]['duration'])?true:false;
        // console.log($this.isTimer);
        // $this.countTime = (e["settings"]["duration"])?e["settings"]["duration"]:$this.countTime;
        $this.countTime = $this.settings['duration'];
        $this.total_time = $this.settings['duration'];
       
        // console.log(e['settings']['sound_loading_bar']);
        if(e['settings']['sound_loading_bar'] != undefined){
            //play audio loading bar
            // var src_audio = "assets/audio/"+$this.question_data['audio'];
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

        $this.slide_content = $(".slider-content").clone();
        $this.pilihan_wrap = $this.slide_content.find(".div_pilihan").first().clone();

        $this.mulai_game();
    },'json');
};

Opening.prototype.mulai_game = function(){
    var $this = this;

     //show header element
    $(".header").hide();

    $('.modal-backdrop').hide();
    // ambil permainan terakhir user

    /*Function set progress bar*/
        let mode = 2; 
        // $this.setProgresBar(mode);
    /*End function set progress bar*/

    /*Function set timer global*/
    if(game.time_global == true){
        if(game.start_timer_global == 0){
            game.startTimerGlobal();
        }
    }else{
      $(".timer").hide();
    }
    /*End function set timer global*/

    //set background image
    var background_image = "url(assets/image/background/"+$this.question_data[$this.curr_soal]["background_image"]+")";
    console.log(background_image);
    $(".slider-content").css("background-image",background_image);

    //play backsound
    $this.playBacksound();

    // console.log("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
    console.log(ldata);
    // console.log($this.game_data);

    //show modal tutorial
    // baru pertama kali mulai
    // $this.curr_soal = 0;

    if(ldata == undefined || ldata["answer"] == undefined || ldata["answer"]== null || ldata["answer"].length < $this.question_data.length){
        console.log(ldata);
        // console.log($this.getQuestion());
        // var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game,$this.getQuestion(),ldata);
        // console.log(sdata);
        // ldata = sdata;
        console.log($this.question_data);
        $this.ldata2 = $this.question_data[$this.curr_soal];
        //hideo close video button
         $(".btn-close").hide(); 

        var flag_opening_video = 0;
        if($this.question_data[$this.curr_soal]['opening'] != undefined && flag_opening_video == 1){
            var arr_video = $this.question_data[$this.curr_soal]['opening'][0]['video'];
            var id_video = 1;

            // $('.video_div').html('');
            // var id_video = $this.curr_soal + 1;

            // var video1 = $('<video />', {
            //     id: 'video-'+id_video,
            //     src: 'assets/video/'+arr_video,
            //     type: 'video/mp4',
            //     controls: true
            // });
            // video1.appendTo($('.video_div'));
            // video1.css('display', 'none');

            // var video = document.getElementById("video-"+id_video);
      
            $this.addEvent();
        }else{
            if(game.mode_life == true){
                //show life
                $this.show_life();
                //show question
            }
            $this.showQuestion('video');
        }
    }
    else{ //resume game
        // $this.curr_soal = $this.category_game;
        console.log($this.curr_soal);
        console.log($this.question_data);
        console.log($this.question_data[$this.curr_soal]['type']);
        $this.ldata2 = $this.question_data[$this.curr_soal];
        console.log(ldata['answer']);
        console.log(ldata['answer'].length);
        console.log(ldata['list_question']);
        console.log(ldata['list_question'].length);
        $(".btn-close").hide(); 
        if(ldata['answer'].length == ldata['list_question'].length){
            // $this.close_feedback(1);
            // $('.icon_exit_feedback').click();
            game.game_data['category_game'] = $this.category_game + 1;
            if($this.audio_dynamic_2 != undefined){
                $this.audio_dynamic_2.pause();
            }

            if($this.audio_dialog != undefined){
                $this.audio_dialog.pause();
            }
            game.setSlide(2); //go to page quiz
        }else{
            console.log($this.curr_soal);
            console.log($this.life);
            
            if(game.mode_life == true){
                $this.show_life();
            }
          
            $this.showQuestion('video');
        }
    }

    $('.btn_tutorial_mc').click(function(e){
        console.log('btn_tutorial_mc click');
        $(this).off();
        game.audio.audioButton.play();
        $('.modal#tutorial').modal("hide");
        $('.tutorial.mc').removeClass('active');

        // console.log($this.question_data);
        var arr_before_game = $this.question_data[$this.curr_soal]['before_game'];
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

    //set current item info
    // alert('setCurrItem');
    // $this.setCurrItem(ldata['answer'].length, ldata['list_question'].length);
}

//fungsi menampilkan soal dan pertanyaan
Opening.prototype.showQuestion = function(mode = '') {
    var $this = this;
    var item_div_n = $this.category_game + 1;
    var $clone = $this.slide_content.clone();
    var $clone_dialog =  $('.item_dialog .item_dialog_text').clone();
    var $clone_dialog_feedback =  $('.item_dialog .item_dialog_feedback_text').clone();
    var $clone_dialog_feedback_false =  $('.item_dialog .item_dialog_feedback_false_text').clone();
    var $clone_img_character =  $('.item_character .img_item').clone();
    var $clone_div_label = $(".content_visnov .div_name_label").clone();
    var $clone_div_label_img = $(".content_visnov .div_label_img").clone();

    //sudah append slide_content sebelumnya
    // console.log($this.isAppend);
    if($this.isAppend == 1){
        console.log($this.question_data);
        $this.ldata2 = $this.question_data[$this.curr_soal];
    }else{
        $('.div_content').html('');
    }

    // random pilihan
    var arr = [];
    var arr_rand = [];

    if(mode == 'video'){
        //if type soal mc
        if($this.ldata2['type'] == 'mc'){
            $clone.find(".text_title").html($this.ldata2["text"]);
            $clone.find(".text_challenge_num").html($this.category_game + 1);


            var options = $this.ldata2["pilihan"];
            var question = $this.ldata2["question"];
            var item_div_n = 1;

            let dialog_text = question;
            /*Append question and option*/
                // console.log(question);
                // console.log("#item-"+item_div_n);
                // let max_string_length = 141;
                // console.log(question);
                // dialog_text = $this.substringText(dialog_text, max_string_length);
                // console.log(dialog_text);

                /*Function set css pilihan jawaban box*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_question").css($this.ldata2['box_style']);
                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css dialog box*/

                $clone.find("#item-"+item_div_n+" .div_question .txt_question").html(dialog_text);

                for (var i = 0; i < options.length; i++) {
                    arr.push(i);
                }

                arr_rand = arr;

                /*Function set css pilihan jawaban*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").css($this.ldata2["box_style_pilihan"]);

                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css pilihan jawaban*/

                // console.log(arr_rand);
                for (var i = 0; i < arr_rand.length; i++) {
                    var no = i+1;

                    //append options
                    $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").eq(i).attr('index',i);

                    //  Function substring string
                    let max_string_length = 45;
                    // console.log("test");
                    // let pilihan_text = $this.substringText_2(options[arr_rand[i]]['text'], max_string_length);
                    // $clone.find("#item-"+item_div_n+" .div_pilihan .txt_pilihan").eq(i).html(pilihan_text);
                }
            /*End append question and option*/

        }else{
            
        }

        /*Function Append dialog*/
            $clone.find('.item_dialog .item_dialog_wrapper').html('');
            var arr_dialog = $this.ldata2["text_3"];
            for (var i = 0; i < arr_dialog.length; i++) {
                console.log($clone_dialog);
                //append options
                $clone_dialog.attr('index',i);

                //substring text
                let max_string_length = 141;
                let dialog_text = $this.substringText(arr_dialog[i]['text'], max_string_length);
                // console.log(dialog_text);

                /*Function set css dialog box*/
                    if(arr_dialog[i]['box_style'] != undefined){
                        console.log(arr_dialog[i]);
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
                console.log($clone_dialog);
                $clone.find('.item_dialog .item_dialog_wrapper').append($($clone_dialog)[0]['outerHTML']);
            }
        /*End function append dialog*/

        //move div_name_label
        console.log($clone_div_label);
        $clone.find(".content_visnov .div_name_label").remove();
        $clone.find('.item_dialog .item_dialog_wrapper').append($clone_div_label);

        //move div_label_image
        $clone.find(".content_visnov .div_label_img").remove();
        $clone.find(".item_dialog .item_dialog_wrapper").append($clone_div_label_img);

        /*Function append content*/
            $($clone).addClass($this.ldata2["type"]);
            // console.log('append div_content');
            // console.log($clone);
            $(".div_content").append($clone);
            $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.category_game+"_"+$this.curr_soal);
            $($clone).attr("curr_soal",$this.curr_soal);
            // $('.slider-content').hide();
            // $($clone).show();
        /*End function append content*/

        //show video
        $this.showVideo(0, $clone);
    }else{        
        // console.log($this.ldata2);
        /*Append character*/
            var arr_img_character = $this.ldata2["img_character"];
            console.log($clone);
            $clone.find('.item_character').html('');

            for (var i = 0; i < arr_img_character.length; i++) {
               
                //append
                $clone_img_character.attr('index',i);
                $clone_img_character.attr('id','img_item-'+i);
                // console.log(arr_img_character[i]);
                var img_src = 'assets/image/character/'+arr_img_character[i];
                $clone_img_character.attr('src',img_src);
                // console.log('i: '+i);
                // console.log($($clone_img_character).html());
                // console.log($($clone_img_character)[0]['outerHTML']);
                // console.log($clone.find('.item_dialog'));
                $clone.find('.item_character').append($($clone_img_character)[0]['outerHTML']);
            }

            //function set image character and background become on gif
            $clone.find(".item_character").addClass("character_bg_one_gif");
        /*End append character*/

        /*Function set image max width*/
            // console.log($this.ldata2["img_max_width"]);
            if($this.ldata2["img_max_width"] != undefined){
                if($this.ldata2["img_max_width"].length > 0){
                    var arr_image_max_width = $this.ldata2["img_max_width"];
                    // console.log(arr_image_max_width);
                    for (var i = 0; i < arr_image_max_width.length; i++) {
                        // console.log('.item_character #img_item-'+arr_image_max_width[i]);
                        // console.log( $clone.find('.item_character #img_item-'+arr_image_max_width[i]));
                        $clone.find('.item_character #img_item-'+arr_image_max_width[i]).css({'max-width':'425px','width':'100%'});
                    }
                }
            }
        /*End function set image max width*/

        /*Function Append dialog*/
            $clone.find('.item_dialog').html('');
            var arr_dialog = $this.ldata2["text_3"];
            for (var i = 0; i < arr_dialog.length; i++) {
               
                //append options
                $clone_dialog.attr('index',i);
                let dialog_text = arr_dialog[i]['text'];
                //substring text
                // let max_string_length = 141;
                // dialog_text = $this.substringText(dialog_text, max_string_length);
                // console.log(dialog_text);

                /*Function set css dialog box*/
                    if(arr_dialog[i]['box_style'] != undefined){
                        console.log(arr_dialog[i]);
                        $clone_dialog.css(arr_dialog[i]['box_style']);
                    }else{
                        $clone_dialog.removeAttr('style');
                        $clone_dialog.css("display","none");
                    }
                /*End function set css dialog box*/

                $clone_dialog.html(dialog_text);
                $clone_dialog.attr('id','item_dialog_text-'+i);

                //function add class suara_batin
                if(arr_dialog[i]['suara_batin'] != undefined){
                    if(arr_dialog[i]['suara_batin'] == 1){
                        $clone_dialog.addClass('suara_batin');
                    }
                }else{
                    $clone_dialog.removeClass('suara_batin');
                }
                // console.log($clone_dialog);
                $clone.find('.item_dialog').append($($clone_dialog)[0]['outerHTML']);
            }
        /*End function append dialog*/
            
        /*Append dialog feedback true*/
            var arr_dialog_feedback = $this.ldata2["feedback"];
            for (var i = 0; i < arr_dialog_feedback.length; i++) {
               
                //append options
                $clone_dialog_feedback.attr('index',i);

                let dialog_text = arr_dialog_feedback[i]['text'];
                //substring text
                // let max_string_length = 141;
                // dialog_text = $this.substringText(dialog_text, max_string_length);

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
                if(arr_dialog_feedback[i]['suara_batin'] != undefined){
                    if(arr_dialog_feedback[i]['suara_batin'] == 1){
                        $clone_dialog_feedback.addClass('suara_batin');
                    }
                }else{
                    $clone_dialog_feedback.removeClass('suara_batin');
                }

                $clone.find('.item_dialog').append($($clone_dialog_feedback)[0]['outerHTML']);
            }
        /*End append dialog feedback true*/

        /*Append dialog feedback false*/
            var arr_dialog_feedback_false = $this.ldata2["feedback_false"];
            for (var i = 0; i < arr_dialog_feedback_false.length; i++) {
               
                //append options
                $clone_dialog_feedback_false.attr('index',i);

                let dialog_text = arr_dialog_feedback_false[i]['text'];
                //substring text
                // let max_string_length = 141;
                // dialog_text = $this.substringText(dialog_text, max_string_length);

                /*Function set css dialog box*/
                    if(arr_dialog[i]['box_style'] != undefined){
                        $clone_dialog_feedback_false.css(arr_dialog_feedback_false[i]['box_style']);
                    }else{
                        $clone_dialog_feedback_false.removeAttr('style');
                        $clone_dialog_feedback_false.css("display","none");
                    }
                /*End function set css dialog box*/

                $clone_dialog_feedback_false.html(dialog_text);
                $clone_dialog_feedback_false.attr('id','item_dialog_feedback_false_text-'+i);


                //function add class suara_batin
                if(arr_dialog_feedback_false[i]['suara_batin'] != undefined){
                    if(arr_dialog_feedback_false[i]['suara_batin'] == 1){
                        $clone_dialog_feedback_false.addClass('suara_batin');
                    }
                }else{
                    $clone_dialog_feedback_false.removeClass('suara_batin');
                }

                // console.log($clone_dialog_feedback_false);
                $clone.find('.item_dialog').append($($clone_dialog_feedback_false)[0]['outerHTML']);
            }
        /*End append dialog feedback false*/

        //if type soal mc
        if($this.ldata2['type'] == 'mc'){
            $clone.find(".text_title").html($this.ldata2["text"]);
            $clone.find(".text_challenge_num").html($this.category_game + 1);


            var options = $this.ldata2["pilihan"];
            var question = $this.ldata2["question"];
            var item_div_n = 1;

            let dialog_text = question;
            /*Append question and option*/
                // console.log(question);
                // console.log("#item-"+item_div_n);
                // let max_string_length = 141;
                // console.log(question);
                // dialog_text = $this.substringText(dialog_text, max_string_length);
                // console.log(dialog_text);

                /*Function set css pilihan jawaban box*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_question").css($this.ldata2['box_style']);
                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css dialog box*/

                $clone.find("#item-"+item_div_n+" .div_question .txt_question").html(dialog_text);

                for (var i = 0; i < options.length; i++) {
                    arr.push(i);
                }

                arr_rand = arr;

                /*Function set css pilihan jawaban*/
                    if($this.ldata2['box_style'] != undefined){
                        $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").css($this.ldata2["box_style_pilihan"]);

                    }else{
                        $clone.find("#item-"+item_div_n+" .div_question").removeAttr('style');
                        // $clone.find("#item-"+item_div_n+" .div_question").css("display","none");
                    }
                /*End function set css pilihan jawaban*/

                // console.log(arr_rand);
                for (var i = 0; i < arr_rand.length; i++) {
                    var no = i+1;

                    //append options
                    $clone.find("#item-"+item_div_n+" .div_pilihan .pilihan").eq(i).attr('index',i);

                    //  Function substring string
                    let max_string_length = 45;
                    // console.log("test");
                    // let pilihan_text = $this.substringText_2(options[arr_rand[i]]['text'], max_string_length);
                    // $clone.find("#item-"+item_div_n+" .div_pilihan .txt_pilihan").eq(i).html(pilihan_text);
                }
            /*End append question and option*/

        }else{
            
        }

        /*Function append content*/
            $($clone).addClass($this.ldata2["type"]);
            // console.log('append div_content');
            // console.log($clone);
            $(".div_content").append($clone);
            $($clone).attr("id","slide_"+$this.attemp_soal+"_"+$this.category_game+"_"+$this.curr_soal);
            $($clone).attr("curr_soal",$this.curr_soal);
            $('.slider-content').hide();
            $($clone).show();
        /*End function append content*/

        /*Event dialog*/
            $($clone).find('.btn_next_dialog').unbind().click(function(){
                console.log($this.interval_auto_next);
                if($this.interval_auto_next != undefined){
                    clearTimeout($this.interval_auto_next);
                }

                // console.log('btn_next_dialog click');
                var index = $(this).attr('index');
                // console.log(index);
                if(index == undefined){
                    index = 0;
                    $(this).attr('index', index);

                    //play audio dialog
                    // var audio = $this.ldata2['text_3'][index]['audio'];
                    // var src_audio_2 = "assets/audio/"+audio;
                    // console.log(src_audio_2);
                    // $this.playDialogSound(src_audio_2);
                }else{
                    index = parseInt(index) + 1;
                    $(this).attr('index', index);
                }

                //pause sound
                if($this.audio_dialog != undefined){
                    $this.audio_dialog.pause();
                }

                // console.log($(this));
                $('.item_dialog').hide();
                $($clone).find('.div_name_label').hide();
                console.log("showContent");

                $this.showContent(index, $clone);
            });
        /*End event dialog*/

        //set first image character and hide btn_next_dialog
        if($this.ldata2["first_img_character"] != undefined){
            var arr_first_img_character = $this.ldata2["first_img_character"];
            if($this.ldata2["first_img_character"].length > 1){
                for (var i = 0; i < arr_first_img_character.length; i++) {
                    if(i == 1){
                        $($clone).find('#img_item-'+arr_first_img_character[i]).css('right',0);
                    }
                    $($clone).find('#img_item-'+arr_first_img_character[i]).addClass('clickable');
                    $($clone).find('#img_item-'+arr_first_img_character[i]).addClass('cust');
                    $($clone).find('#img_item-'+arr_first_img_character[i]).show();
                }
            }else{
                $($clone).find('#img_item-'+arr_first_img_character[0]).addClass('clickable');
                $($clone).find('#img_item-'+arr_first_img_character[0]).css('position','unset');
                $($clone).find('#img_item-'+arr_first_img_character[0]).show();
                
            }
            $($clone).find('.btn_next_dialog').hide();
            $($clone).find('.img_item-2').unbind().click(function(){
                console.log("img_item-2 click");
                $(this).hide();
                $(".btn_next_dialog").show();
                $($clone).find('.btn_next_dialog').click();
            });

            // Function auto click img_item-2
            // console.log("auto_next_dialog: "+$this.auto_next_dialog);
            if($this.auto_next_dialog == true){
                let $element = ".img_item-2";
                $this.nextDialog($element);
            }
           
            $($clone).find('.img_item.clickable').unbind().click(function(){
                // console.log('img_item.clickable click');
                // console.log(this);
                if($(this).hasClass('clickable')){
                    $('.img_item').removeClass('clickable');
                    //hide image click
                    $('.img_item-2').hide();
                    $($clone).find('.btn_next_dialog').click();
                }
            });
        }else{
            $(".img_click.img_item-2").hide();
            $($clone).find('.btn_next_dialog').click();
        }
    
    }
    
    // console.log($this.isAppend);
    // panggil jquery mobile untuk setting swipe (di panggil saat pertama kali/1x)
    if($this.isAppend == 0){
        $this.isAppend = 1;
        // $this.setTutorial();
        $.getScript( "assets/js/jquery.mobile-1.4.5.min.js", function( data, textStatus, jqxhr ) {
            $this.settingPage($clone);
            $('.ui-loader').hide();
        });
    }
    else{
        $this.settingPage($clone);
    }
};

Opening.prototype.setCurrItem = function(curr_item, max_item){
    var $this = this;
    // alert(max_item);
    $('.curr_benda').html(curr_item+'/'+max_item);
}

Opening.prototype.getQuestion = function() {
    var $this = this;
    var arr_quest = [];
    var arr = [];
    // console.log($this.question_data);
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
    // console.log(arr_quest);
    return arr_quest;
};

Opening.prototype.settingPage = function($clone) {
    var $this = this;
    console.log('settingPage');
    // $this.curr_soal = 0;
    // setting prev
    if($this.curr_soal>0){
        $($clone).attr("data-prev","#slide_"+$this.attemp_soal+"_"+$this.category_game+"_"+(parseInt($this.curr_soal)-1));   
    }else{
        $($clone).attr("data-prev","");
    }
    // setting next
    if(parseInt($this.curr_soal)+1<$this.question_data.length){
        $($clone).attr("data-next","#slide_"+$this.attemp_soal+"_"+$this.category_game+"_"+(parseInt($this.curr_soal)+1));
    }
    else{
        $($clone).attr("data-next","#result");
    }

    // change to first question
    if($this.curr_soal == 0){
        $.mobile.changePage( "#slide_"+$this.attemp_soal+"_"+$this.category_game+"_"+$this.curr_soal, { transition: "none"} );
    }
    // swipe left
    $($clone).swipeleft(function( event ) {
        // $this.next();  
    });
    // click button next-soal
    $($clone).find(".next-soal").click(function(e){
        // $this.next();
    });

    // console.log($this.curr_soal);
    // jika tipe soalnya drag and drop sequence
    console.log($this.curr_soal);
    console.log($this.question_data);
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
Opening.prototype.cekJawaban = function($clone,$type) {
    console.log('cekJawaban');
    var $this = this;
    // console.log($this);
    var $flag=0;
    // akumulasi jumlah pilihan jawaban yang benar
    var count = 0;
    var item_div_n = $this.category_game + 1;
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
        response = $this.question_data[parseInt($($clone).attr("curr_soal"))]["question"];
        jawaban = $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"];
    }else{
        response = $this.question_data[$this.curr_soal]["question"];
        jawaban = $this.question_data[$this.curr_soal]["jawaban"];
    }
    var id_video = $this.item_selected;
    $($clone).find(".pilihan").each(function(index){
        // jika tipenya drag and drop sequence
        if($type == "dadswipe"){
            // jika urutannya salah
            if($(this).attr("index") != $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"][index]){
                $flag=1;
            }
        }
        else{
            if($type == "dad_item_and_place"){
                var folder = 'game_'+($this.category_game+1);
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
                // tipe lainnya jika punya class active
                if($(this).hasClass("active")){
                    if($this.ldata2['feedback'] != undefined){
                        console.log($(this).attr("index"));
                        console.log($this.ldata2['feedback'][$(this).attr("index")]);
                        if($this.ldata2['feedback'][$(this).attr("index")] != undefined){
                            if($this.ldata2['feedback'][$(this).attr("index")]['video'] != undefined){
                                var video_feedback = $('<video />', {
                                    id: 'video_feedback-1',
                                    src: 'assets/video/'+$this.ldata2['feedback'][$(this).attr("index")]["video"],
                                    type: 'video/mp4',
                                    controls: true
                                });
                                video_feedback.appendTo($('.video_div'));
                                video_feedback.css('display', 'none');
                                $(this).removeClass("active");
                            }
                        }
                    }

                    // var video_2 = document.getElementById("video_feedback-1");
                    // $(video_2).load();

                    // cek jika indexnya ada di list jawaban atau sesuai $cek=1 jika tidak $cek=0
                    var $cek=0;
                    console.log($this.question_data);
                    console.log(parseInt($($clone).attr("curr_soal")));
                    for (var i = 0; i < $this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"].length; i++) {
                        if($this.question_data[parseInt($($clone).attr("curr_soal"))]["jawaban"][i] == $(this).attr("index")){
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
        // console.log($this.question_data[$this.curr_soal]);
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
        if(count != $this.question_data[$this.curr_soal]["jawaban"].length){
            // $flag=1;
        }
    }

    var curr_soal = $this.curr_soal;
    // var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
    // var last_score = parseInt(quiz_result['score']);
    var last_score = $this.last_score;
    var benar = 1;
    
    // console.log('$flag: '+$flag);

    // $($clone).find('.pilihan_place').hide();
    $this.showHideSoal('hide');
    // jawabannya benar
    if($flag==0){
        var last_life = parseInt($this.life);
        var arr_temp = [];
        // arr_temp.push(parseInt($this.category_game));//key untuk index
        arr_temp.push(1);
        last_score += 1;
        $this.last_score = last_score;
        $this.game_data["last_score"] = $this.last_score;
        game.scorm_helper.pushAnswer(arr_temp,response,last_score,last_life);

        //set game data value total answer true of this slide
        console.log($this.game_data);
        console.log(($this.game_data["total_answer_true"] == undefined));
        $this.game_data["total_answer_true"] = ($this.game_data["total_answer_true"] == undefined ? 1 : ($this.game_data["total_answer_true"] + 1));
        console.log($this.game_data);
        // $this.setScore(last_score);
        game.audio.audioBenar.play();
        $(".alert").addClass("benar");
        // game.audio.audioButton.play();       
        // $this.resetValue();

        // $($clone).find('#item_dialog_feedback_text-0').show();
        // $($clone).find('.item_dialog').show();
        // $($clone).find('.btn_next_dialog-2').show();
        // $($clone).find('.pilihan_place').hide();

        //call function dialog feedback
        $this.showDialogFeedback(0,benar,$clone);
        $this.showHideSoal('hide');

        // var img_character_index = $this.ldata2['feedback'][0]['img_character'];
        // console.log(img_character_index);
        // $($clone).find('.img_item').hide();
        // $($clone).find('#img_item-'+img_character_index).show();
        // var img_char = $this.ldata2['img_character'][img_character_index];
        // console.log(img_char);
        // $this.showDialogFeedback(0,benar);
    }else{ 
        var last_life = parseInt($this.life);
        $this.setFalseAnswer();
        var arr_temp = [];
        // arr_temp.push(parseInt($this.category_game));//key untuk index
        arr_temp.push(0);

        // last_life -= 1;
        $this.count_life(false);

        if($this.life == 0){
            game.setSlide($this.slide_result);
        }

        if(game.mode_life == true){
            //show life
            $this.show_life();
        }

        //jika jawab salah lanjut ke soal berikutnya
        if($this.tryagain_question_false_answer == false){
            //push jawaban salah ke array ldata
            game.scorm_helper.pushAnswer(arr_temp,response,last_score,last_life);
        }
        game.audio.audioSalah.play();
        $(".alert").addClass("salah");
        benar = 0;

        // $($clone).find('#item_dialog_feedback_false_text-0').show();
        // $($clone).find('.item_dialog').show();
        // $($clone).find('.btn_next_dialog-2').show();

        //call function dialog feedback
        $this.showDialogFeedback(0,benar,$clone);
        // $($clone).find('.pilihan_place').hide();
        $this.showHideSoal('hide');

        var img_character_index = $this.ldata2['feedback_false'][0]['img_character'];
        // console.log(img_character_index);
        // $($clone).find('.img_item').hide();
        // $($clone).find('#img_item-'+img_character_index).show();
        //$this.close_feedback_2(benar);
        // $this.showDialogFeedback(0,benar);
    }

    setTimeout(function() {
        $(".alert").removeClass("benar");
        $(".alert").removeClass("salah");

        //click button in dialog feedback
        $($clone).find('.btn_next_dialog-2').unbind().click(function(){
            if($(this).text() == "Try Again"){
                $this.close_feedback_2(benar);
            }
          
            $this.audio_dialog.pause();

            var index = $(this).attr('index');
            if(index == undefined){
                index = 0;
            }
            index = parseInt(index) + 1;
            // console.log('benar: '+benar);
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
                        game.game_data['curr_soal'] = $this.curr_soal;
                        console.log('$this.curr_soal: '+$this.curr_soal);
                        console.log(game.game_data);
                        game.scorm_helper.setSingleData('game_data', game.game_data);
                        // $this.showQuestion();   
                    }else{
                        game.game_data['curr_soal'] = 0;
                        //game.game_data['last_life'] = game.life_max;

                        var category_game = $this.category_game + 1;
                        if(category_game < $this.question_datas.length){
                            $this.nextSoal();
                        }else{
                            $this.nextSoalAtLast();
                        }
                    }
                }else{
                    console.log(game.game_data);
                    game.scorm_helper.setSingleData('game_data', game.game_data);
                    $this.showDialogFeedback(index,benar,$clone);
                    $($clone).find('.btn_next_dialog-2').attr('index',index);
                }
            }else{
                //hide dialog feedback
                if(index == ($this.ldata2['feedback_false'].length)){
                    console.log("tryagain_question_false_answer: "+$this.tryagain_question_false_answer);
                    if($this.tryagain_question_false_answer == false){
                        var category_game = $this.category_game + 1;
                        if(category_game < $this.question_datas.length){
                            $this.nextSoal();
                        }else{
                            $this.nextSoalAtLast();
                        }
                    }else{
                        //hide name label
                        $($clone).find('.div_name_label').hide();

                        // console.log("showHideSoal cekJawaban");
                        // $this.showHideSoal('show');

                        game.nextSlide();

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
                    console.log(game.game_data);
                    game.scorm_helper.setSingleData('game_data', game.game_data);

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
        });

        // $('.next-soal-2').click(function(){
            // console.log('$this.curr_soal: '+$this.curr_soal);
            // $this.showModalFeedback_2(benar);
        // });

        //set game_data and send to scorm
        var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
        // game.game_data['last_challenge'] = ldata['answer'].length;
        // $this.setGameData();

        //function set dialog feedback

        //set current item info
        $this.setCurrItem(ldata['answer'].length, ldata['list_question'].length);

        // $(".alert").removeClass("benar");
        // $(".alert").removeClass("salah");
    },800);
};

Opening.prototype.next = function($clone,$type) {
    var $this = this;
    game.setSlide(3);
};

Opening.prototype.show_life = function() {
    console.log("show_life");
    var $this = this;
    var count_star = 0;
    $(".star-wrapper").show();
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

Opening.prototype.count_life = function(val) {
    var $this = this;
    if(val == false){
        $this.life -= 1;
    }

    $this.game_data['last_life'] = $this.life;
    game.game_data = $this.game_data;
    // game.scorm_helper.setSingleData('game_data', game.game_data);
}

Opening.prototype.startGameTimer = function() {
    console.log('startGameTimer');
    var $this = this;
    $(".timer").show();
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
                    clearInterval(timer_interval);
                    $this.time = null;
                    $(".timer_quiz .text_time").html("--:--");

                    //stop backsound
                    $this.stopBackSound();

                    // var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
                    // console.log(quiz_result);
                    // var last_score = $this.game_data["last_score"];

                    if(game.mode_life == true){
                        /*Call functoion count_life to and send parameter to minus life*/
                            $this.count_life(false);
                        /*End call functoion count_life to and send parameter to minus life*/

                        //call function show life
                        $this.show_life();
                    }

                    //set game_data and send to scorm
                    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
                    console.log(ldata);

                    /*Setting game data*/
                        $this.game_data['last_challenge'] = ldata['answer'].length;
                        $this.game_data['category_game'] = $this.category_game;
                        $this.game_data["curr_step"] = $this.curr_step;
                        game.game_data = $this.game_data;
                        game.scorm_helper.setSingleData('game_data', game.game_data);
                    /*End setting game data*/

                    //set current item info
                    // $this.setCurrItem(ldata['answer'].length, ldata['list_question'].length);

                    /*show modal feedback*/
                        console.log("icon_exit_feedback");
                        $(".icon_exit_feedback").show();
                        $this.showModalFeedback_2(0, timeout = 1);

                        $(".icon_exit_feedback").unbind().click(function(){
                            //hide modal
                            $('.modal#modal_feedback').modal('hide');
                            // $this.life = 0;
                            if($this.life == 0){
                                game.setSlide($this.slide_result);
                            }else{
                                let $clone = $(".slider-content");
                                let benar = 0;

                                //show last quiz
                                $this.showQuestion_2();

                                //play backsound
                                $this.playBacksound();

                                //start timer
                                $this.isStartTime = false;
                                $this.countTime = $this.settings['duration'];
                                $this.startGameTimer();
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

Opening.prototype.resetTimer = function(){
    clearInterval(timer_interval);
    $(".timer .text_time").html("--:--");
}

Opening.prototype.setQuizFalseAnswer = function(){
    var last_life = parseInt($this.life);
    $this.setFalseAnswer();
    var arr_temp = [];
    arr_temp.push(parseInt($this.item_selected));//key untuk index
    arr_temp.push(0);
    last_life -= 1;
    game.scorm_helper.pushAnswer(arr_temp,response,last_score,last_life);
}

Opening.prototype.setTimer = function() {
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

Opening.prototype.setTimerPercent = function(){
    $this = this;

    $this.countTime = $this.countTime-1;
    let percent =  $this.countTime / $this.total_time * 100;

    $(".timer_quiz .progress-bar").css("width",percent+"%");
};

Opening.prototype.showModal = function() {
    console.log('showModal');
    var $this = this;
    console.log($this.category_game);
    // if($this.category_game == 3 || $this.category_game == 4){
    //     $('.tutorial.dad .animated.fadeIn').html("Kali ini, kamu hanya diberikan <b>waktu 1 menit</b> dan <b>3 kesempatan salah</b>! Kamu siap?");
    // }
    
    $('.modal#tutorial').modal("show");
    $('.tutorial.mc').addClass('active');
};


// Opening.prototype.playVideo = function(id, type = '') {
//     $("#video").show();

//     //set prefix id video
//     var prefix_id = 'video';
//     if(type == 'feedback'){
//         prefix_id = 'video_feedback';
//     }
//     $("video#"+prefix_id+"-"+id).show();
//     console.log($("video#"+prefix_id+"-"+id));

//     var video = $("video#"+prefix_id+"-"+id)[0];
//     console.log(video);
//     var readyState = video.readyState;
//     console.log(readyState);
//     if(readyState > 0){
//         $("video#"+prefix_id+"-"+id)[0].play();
//     }
// };

Opening.prototype.playVideo_2 = function(id, type = '', callback) {
    $("#video").show();

    //set prefix id video
    var prefix_id = 'video';
    if(type == 'feedback'){
        prefix_id = 'video_feedback';
    }
    $("video#"+prefix_id+"-"+id).show();
    console.log($("video#"+prefix_id+"-"+id));

    var video = $("video#"+prefix_id+"-"+id)[0];
    console.log(video);
  
    var playPromise =  video.play();

    console.log(playPromise);
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Automatic playback started!
            // Show playing UI.
            // We can now safely pause video...
            // video.pause();
            callback(1);
        })
        .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            alert("Video can't be played!");
            callback(0);
        });
    }

    // playPromise.on('ready', event => {
    //     const instance = event.detail.plyr;
    //     console.log(instance['ready']);
    //     if(instance['ready'] == true){
    //         playPromise.play();
    //         callback(1);
    //     }else{
    //         callback(0);
    //     }
    // });
};

Opening.prototype.playVideo_plyr = function(video,type, callback) {
    console.log('playVideo_plyr');
    $("#video").show();
    //set prefix id video
    if(type == 'first'){
        $(".plyr").first().show();
    }else{
        $(".plyr").last().show();
    }
    
    try {
        //call function disabled pins out atau bisa tarik layar dengan dua tangan
        moleawiz.sendCommand("cmd.dis_user_inter");
    }
    catch(err) {
        console.log(err);
    }

     // $('.btn_play').show();
     // var flag_click = 0;
    // $('.btn_play').click(function(e){
         // $('.btn_play').hide();

        // if(flag_click == 0){
            // flag_click = 1;
            // alert('playVideo_plyr');
            console.log('play video');
            var playPromise = video.play();
            // video.play();
            // callback(1);

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                    // We can now safely pause video...
                    // video.pause();
                    // alert(playPromise);
                    callback(playPromise);
                })
                .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                    alert("Video can't be played!");
                    console.log(error);
                    callback(0);
                });
            }

            // if (playPromise !== undefined) {
            //   playPromise.then(function() {
            //     // Automatic playback started!
            //     callback(playPromise);
            //   }).catch(function(error) {
            //     // Automatic playback failed.
            //     // Show a UI element to let the user manually start playback.
            //     alert("Video can't be played!");
            //     console.log(error);
            //     callback(0);
            //   });
            // }
        // }
    // });
};

Opening.prototype.stopVideo = function(id, type = '') {
    $("#video").hide();

    if(type = 'feedback'){
        $("#video_feedback-"+id)[0].pause();
        $("#video_feedback-"+id)[0].currentTime = 0;
    }else{
        $("#video-"+id)[0].pause();
        $("#video-"+id)[0].currentTime = 0;
    }
};

Opening.prototype.stopVideo_plyr = function(video = '') {
    $("#video").hide();

    if(video != ''){
        if(type = 'feedback'){
            video.pause();
            video.currentTime = 0;
        }else{
            video.pause();
            video.currentTime = 0;
        }
    }
};

Opening.prototype.opacityVideo = function(val, id, type = '') {
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

Opening.prototype.showContentVideo = function(val) {
    if(val == 1){
        $('.video_btn_wrapper').show();
    }else{
        $('.video_btn_wrapper').hide();
    }
};

Opening.prototype.resetValue = function(){
    game.video_duration = 0;
    game.isViewVideo = false;
}

Opening.prototype.showModalFeedback = function(benar, timeout = 0){
    var $this = this;
    $(".modal#modal_feedback").find(".title_feedback_2").hide();
    console.log($(".modal#modal_feedback .modal_feedback_black"));
    $(".modal#modal_feedback .modal_feedback_black").show();

    var rand = Math.floor(Math.random() * 6);//random 0 sampai 5

    //hide img benar dan salah
    $(".modal#modal_feedback").find(".title_feedback").hide();
    if(benar==1){
        console.log($(".modal#modal_feedback").find(".text_dynamic"));
        console.log($this.question_data['feedback_true']);
        var feedback_true = $this.ldatas['feedback_true'][rand]['text'];

        // $(".modal#modal_feedback").find(".text_dynamic").html(feedback_true);
        $(".modal#modal_feedback").find(".benar").show();
        $('.modal#modal_feedback').modal('show');
        game.audio.audioWin.play();

    }else{
        var feedback_false = $this.ldatas['feedback_false'][rand]['text'];

        // $(".modal#modal_feedback").find(".text_dynamic").html(feedback_false);
        $(".modal#modal_feedback").find(".salah").show();
        $('.modal#modal_feedback').modal('show');
        game.audio.audioLose.play();

    }
}

Opening.prototype.showModalFeedback_2 = function(benar, timeout = 0){
    var $this = this;
    $(".modal#modal_feedback").find(".title_feedback_2").hide();
    console.log($(".modal#modal_feedback .modal_feedback_black"));
    // $(".modal#modal_feedback .modal_feedback_black").show();
    $(".modal#modal_feedback .modal_feedback").show();

    // var rand = Math.floor(Math.random() * 6);//random 0 sampai 5

    //hide img benar dan salah
    $(".modal#modal_feedback").find(".title_feedback").hide();
    if(benar==1){
        console.log($(".modal#modal_feedback").find(".text_dynamic"));
        console.log($this.ldata2['feedback']);
        var feedback_true = $this.ldata2['feedback'][$this.curr_soal]['text'];

        $(".modal#modal_feedback").find(".text_dynamic").html(feedback_true);
        // $(".modal#modal_feedback").find(".benar").show();
        $('.modal#modal_feedback').modal('show');
        game.audio.audioWin.play();

    }else{
        // var feedback_false = $this.ldatas['feedback_false'][rand]['text'];
        var feedback_false = $this.ldata2['feedback_false'][$this.curr_soal]['text'];

        if(timeout == 1){
            feedback_false = $this.ldatas["feedback_timeout"]["text"];
        }

        $(".modal#modal_feedback").find(".text_dynamic").html(feedback_false);
        // $(".modal#modal_feedback").find(".salah").show();
        $('.modal#modal_feedback').modal('show');
        game.audio.audioKalah.play();

    }
}

Opening.prototype.setFalseAnswer = function(){
    var $this = this;

    var response = $this.question_data[$this.curr_soal]["question"];
    // game.audio.audioSalah.play();
    game.audio.audioButton.play();
  
    //set flag view video
    game.isViewVideo = true;
};

Opening.prototype.close_feedback = function(benar, timeout = 0){
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
        // var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
        var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
        console.log(total);
        var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
        console.log($this.life);
        console.log(ldata);

        //set flag_item_click clickable
        flag_item_click = 0;

        if($this.life == 0){
            //set score lose
            $(this).hide();

            /*set result*/
            $(".img-menang").hide();
            $(".img-kalah").show();

            // $('.result .text_button_wrapper').html('Sayang sekali, kamu harus mengulangi tugas ini. Perhatikan dengan baik peletakan benda sesuai <i>Clean Desk Policy</i>!');
            if(timeout == 0){
                $('.result .text_button_wrapper').html('Sayang sekali, kamu harus mengulangi tugas ini. Perhatikan dengan baik peletakan benda sesuai <i>Clean Desk Policy</i>!');
            }else{
                $('.result .text_button_wrapper').html("Waktu habis! Perhatikan waktu pengerjaanmu agar dapat lulus dari tugas kali ini.");
            }

            $(".text_button_wrapper").show();
            $('.btn-next-result').hide();
            $('#video').show();
            $(".result").show();
            /*end set result*/

            // game.game_data['last_score'] = 0;
            game.audio.audioKalah.play();
            game.scorm_helper.setStatus("failed");

            var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
            var last_score = $this.last_score;
            game.scorm_helper.sendResult(last_score);
            $this.resetValue();
            $('.btn-next-tryagain').show();
            // $('.btn-next-result').show();

            //pause bacsound
            // $this.audio_dynamic_2.pause();
            // $this.audio_dynamic_2.currentTime = 0;

            $('.btn-next-tryagain').click(function(e){
                $(this).off();
                console.log('btn-next-tryagain');
                // $this.QuitModul();
                $this.resetCurrGame();
                game.setSlide(2);
            });

            //game.setSlide(3);
        }else{
            if(ldata["answer"].length == 1){
                var date = game.getDate();

                game.game_data['start_date'] = date;
                $this.game_data = game.game_data;
            }

            console.log(ldata["answer"].length);
            console.log(total["total_soal"]);
            if(ldata["answer"].length == total["total_soal"]){
                //set score win
                console.log($('#video'));
                // $(this).hide();
                // $('#video').attr('background','unset');

                if($this.category_game == 1){
                    $('.result .text_button_wrapper').html('Kamu berhasil menyelesaikan tugas kedua! Apakah kamu bisa menyelesaikan tugas ketiga?');
                }else if($this.category_game == 2){
                    $('.result .text_button_wrapper').html("Kamu berhasil menyelesaikan tugas ketiga dengan baik. Tugas berikutnya akan lebih sulit, bersiaplah!");
                }else if($this.category_game == 3){
                    $('.result .text_button_wrapper').html("Tugasmu hampir selesai! Apakah kamu siap menghadapi tugas terakhirmu?");
                }else if($this.category_game == 4){
                    $('.result .text_button_wrapper').html("Kamu berhasil menyelesaikan misi dengan baik! Selalu perhatikan Clean Desk Policy, jangan biarkan orang lain mengambil keuntungan dari keteledoranmu!");
                }

                $('#video').show();
                // game.game_data['last_score'] = 100;
                // $this.setGameData3();                    
                // $this.resetValue();
                $('.btn-next-tryagain').show();
                $('.btn-next-result').show();
                $(".result").show();
                game.audio.audioMenang.play();

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
                    console.log($this.category_game);
                    console.log($this.ldatas['list_question'].length);
                    if($this.category_game == $this.ldatas['list_question'].length - 1){
                        console.log('slide 3');
                        $('.result_2').show();
                        game.setSlide(3);

                        // $('.btn-next-tryagain-2').click(function(e){
                        //     game.scorm_helper.resetQuizDataByIndex("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
                        //     $this.resetGameData();
                        //     game.game_data["category_game"] = $this.category_game;
                        // });
                    }else{
                        $this.resetGameData();
                        game.game_data['category_game'] = $this.category_game + 1;
                        console.log(game.game_data);
                        game.setSlide(2); //go to page quiz
                    }
                });
                //game.setSlide(3);
            }else{
                $this.hideItemSelected($this.item_selected);
                // game.setSlide(2); //go to quiz page
                // $this.nextGamePickPlaceItem();
                // $this.stopVideo_plyr($this.video_plyr);
                $("#video").hide();

                if(game.mode_life == true){
                    $this.show_life();
                }

                //validasi game timer
                if($this.isTimer){
                    $this.isStartTime = false;
                    $this.startGameTimer();
                }else{
                    $(".timer_quiz").hide();
                }

                var rand = Math.floor(Math.random() * 6);//random 0 sampai 5
                if(benar==1){
                    //change html feedback_text
                    // console.log($this.ldata2);

                    // //if mode suara batin
                    // if($this.ldatas['feedback_true'][rand]['suara_batin'] != undefined){
                    //     if(arr_dialog[i]['suara_batin'] == 1){
                    //         console.log($clone.find('.item_dialog'));
                    //         $clone.find('.item_dialog').addClass('suara_batin');
                    //     }
                    // }else{
                    //     $clone.find('.item_dialog').removeClass('suara_batin');
                    // }

                    $(".feedback_text").html($this.ldatas['feedback_true'][rand]['text']);
                    //play sound
                    // var src_audio = "assets/audio/"+$this.ldatas['feedback_true'][rand]['sound'];
                    // game.audio_dynamis(src_audio);
                }else{
                    // if($this.ldatas['feedback_false'][rand]['suara_batin'] != undefined){
                    //     if(arr_dialog[i]['suara_batin'] == 1){
                    //         console.log($clone.find('.item_dialog'));
                    //         $clone.find('.item_dialog').addClass('suara_batin');
                    //     }
                    // }else{
                    //     $clone.find('.item_dialog').removeClass('suara_batin');
                    // }

                    //change html feedback_text
                    $(".feedback_text").html($this.ldatas['feedback_false'][rand]['text']);
                    //play sound
                    // var src_audio = "assets/audio/"+$this.ldatas['feedback_false'][rand]['sound'];
                    // game.audio_dynamis(src_audio);
                }
                //play backsound
                // $this.playBacksound();
            }
        }
       
        console.log(game.game_data);
    });
};

Opening.prototype.close_feedback_2 = function(benar, timeout = 0){
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

        game.scorm_helper.setSingleData('game_data', game.game_data);
        //if soal sudah sampai soal terakhir dari data di json
        // var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
        var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
        console.log(total);
        var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
        console.log($this.life);
        console.log(ldata);

        //set flag_item_click clickable
        // flag_item_click = 0;

        clearInterval($this.time_backsound);
        console.log($this.life);
        if($this.life == 0){
            //set score lose
            $(this).hide();

            // game.game_data['last_score'] = 0;
            game.audio.audioKalah.play();
            game.scorm_helper.setStatus("failed");

            var quiz_result = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
            var last_score = $this.last_score;
            game.scorm_helper.sendResult(last_score);

            //go to final page
            $this.audio_dynamic_2.pause();
            $this.audio_dialog.pause();
            game.setSlide(4);
        }else{
            if(ldata["answer"].length == 1){
                var date = game.getDate();

                game.game_data['start_date'] = date;
                $this.game_data = game.game_data;
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
                    console.log($this.category_game);
                    console.log($this.ldatas['list_question'].length);
                    if($this.category_game == $this.ldatas['list_question'].length - 1){
                        console.log('slide 3');
                        $('.result_2').show();
                        game.setSlide(3);
                    }else{
                        $this.resetGameData();
                        game.game_data['category_game'] = $this.category_game + 1;
                        console.log(game.game_data);
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
                // $this.hideItemSelected($this.item_selected);
                // game.setSlide(2); //go to quiz page
                // $this.nextGamePickPlaceItem();
                // $this.stopVideo_plyr($this.video_plyr);
                // $("#video").hide();\

                if(game.mode_life == true){
                    console.log('show_life');
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
       
        console.log(game.game_data);
    // });
};

Opening.prototype.resetCurrGame = function(){
    var $this = this;
    game.scorm_helper.resetQuizDataByIndex("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
    $this.resetGameData();
    game.game_data["category_game"] = $this.category_game;
}

Opening.prototype.hideItemSelected = function(item_id){
    var $this = this;
    var item_div_n = $this.category_game + 1;
    $('#item_div-'+item_div_n+' #item-'+item_id).hide();
}

Opening.prototype.nextGamePickPlaceItem = function(){
    var $this = this;
    console.log(video1);
    // $this.stopVideo_plyr(video1);
}

Opening.prototype.setScore = function(score){
    var $this = this;
    // var total = game.scorm_helper.getQuizResult(["game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game]);
    // console.log(total);
    $this.game_data['last_score'] = score;
    game.game_data['last_score'] = $this.game_data['last_score'];
}

//function show append conetent in video
Opening.prototype.showVideoFeedback = function(id_video_before, id_video, video){
    var $this = this;
    // $this.stopVideo(id_video_before);
    $this.opacityVideo(0, id_video, 'feedback');
    // $(".star-wrapper").hide();
    $('#content-video').hide();
    $('.icon_tutorial').hide();
    // $(".timer").hide();
    // $('video#video-'+id_video_before).hide();
    
    console.log(video);
    console.log(video.hasAttribute("controls"));
    if(video.hasAttribute("controls")) {
        console.log('removeAttribute');
        video.removeAttribute("controls");   
    } else {
        video.setAttribute("controls","controls");   
    }
    $this.playVideo(id_video, 'feedback');
};

Opening.prototype.showVideoFeedback_2 = function(id_video_before, id_video, video, callback){
    var $this = this;
    // $this.stopVideo(id_video_before);
    $this.opacityVideo(0, id_video, 'feedback');
    // $(".star-wrapper").hide();
    $('#content-video').hide();
    $('.icon_tutorial').hide();
    // $(".timer").hide();
    // $('video#video-'+id_video_before).hide();
    
    console.log(video);
    console.log(video.hasAttribute("controls"));
    if(video.hasAttribute("controls")) {
        console.log('removeAttribute');
        video.removeAttribute("controls");   
    } else {
        video.setAttribute("controls","controls");   
    }
    // $this.playVideo(id_video, 'feedback');

    $this.playVideo_2(id_video, 'feedback', function(res){
        console.log(res);
        if(res == 1){
            callback(1);
        }else{
            callback(0);
        }
    });
};


Opening.prototype.showVideoFeedback_plyr = function(id_video_before, id_video, video, callback){
    console.log('showVideoFeedback_plyr');
    var $this = this;
    // $this.stopVideo_plyr(video);
    $this.opacityVideo(0, id_video, 'feedback');
    //$(".star-wrapper").hide();
    // $(".video_header_wrapper").hide();
    $('#content-video').hide();
    $('.icon_tutorial').hide();
    // $(".timer").hide();
    $(".plyr").first().hide();
    $('video').hide();
    console.log($('#video_feedback-'+id_video));
    $('.plyr').show();
    $('#video_feedback-'+id_video).parent('video').show();
    // alert('showVideoFeedback_plyr');
    $this.playVideo_plyr(video,"last",function(res){
        console.log(res);
        // alert(res);
        callback(res);
    });
};

Opening.prototype.setGameData = function(){
    var $this = this;
    game.game_data['category_game'] = $this.category_game;
    game.scorm_helper.setSingleData('game_data', game.game_data);
}

Opening.prototype.resetGameData = function(){
    game.game_data["category_game"]=undefined,
    game.game_data["last_challenge"]=undefined,
    game.game_data["last_life"]=undefined,
    game.game_data["last_score"]=undefined;
    game.game_data["start_date"]=undefined;
}

Opening.prototype.setGameData2 = function(){
    var date = game.getDate();

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
Opening.prototype.setGameData3 = function(){
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

Opening.prototype.QuitModul = function() {
    try{
        var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
        btn_back.click();
    }
    catch(e){
        top.window.close();
    }
};

Opening.prototype.playBacksound = function() {
    var $this = this;
   
    //play sound 2
    // console.log($this.curr_soal);
    // console.log($this.question_data);
    // console.log($this.question_data[$this.curr_soal]);
    var src_audio_2 = "assets/audio/"+$this.question_data[$this.curr_soal]['audio'];
    // console.log('src_audio_2: '+src_audio_2);
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

Opening.prototype.playDialogSound = function(src) {
    var $this = this;
   
    //play sound 2
    // var src_audio_2 = "assets/audio/"+$this.question_data[$this.curr_soal]['audio'];
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

//function set show or hide dialog feedback base on slide-content id
Opening.prototype.showContent = function(index, $clone = ''){
    var $this = this;
    // console.log(index);
    // console.log($clone);

    if($clone == ''){
       
    }else{
        $($clone).find('.item_dialog_text').hide();
        var arr_dialog = $this.ldata2["text_3"];
        var index_dialog = arr_dialog[index];
        // console.log('index_dialog: '+index_dialog);
        if(index_dialog != undefined){
            $($clone).find('.item_dialog').show();
            $($clone).find('.btn_next_dialog').show();

            $($clone).find('.item_dialog').removeClass('suara_batins');
            if($($clone).find('#item_dialog_text-'+index).hasClass('suara_batin')){
                $($clone).find('.item_dialog').addClass('suara_batins');
            }

            // console.log($this.ldata2["text_3"][index]['background_image']);
            if($this.ldata2["text_3"][index]['background_image'] != undefined){
                //set background image
                var background_image = "url(assets/image/background/"+$this.ldata2["text_3"][index]['background_image']+")";
                // console.log(background_image);
                $(".slider-content").css("background-image",background_image);
            }

            //show hide dialog textand box
            console.log(arr_dialog[index]["text"]);
            if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                $($clone).find('#item_dialog_text-'+index).show();
                $(".btn_dialog_wrapper").show();
            }else{
                $(".btn_dialog_wrapper").hide();
            }

            //dari dialog menuju ke soal maka text berubah jadi start 
            if(index == (arr_dialog.length - 1)){
                // $($clone).find('.btn_next_dialog').text('Start');
            }

            var arr_img_character = $this.ldata2["text_3"][index]['img_character'];
            var name_character = $this.ldata2["text_3"][index]['text_2'];
            // console.log(arr_img_character);
            $($clone).find('.img_item').hide();
            $($clone).find('.img_item').css('right','unset');
            $($clone).find('.img_item').css('position','absolute');
            $($clone).find('.img_item').removeClass('cust');

            if(arr_img_character != undefined){
                if(arr_img_character.length > 0){
                    if(arr_img_character.length == 1){
                        $($clone).find('#img_item-'+arr_img_character[0]).css('position','unset');
                        $($clone).find('#img_item-'+arr_img_character[0]).show();
                    }else if(arr_img_character.length == 2){
                        $($clone).find('#img_item-'+arr_img_character[0]).addClass('cust');
                        $($clone).find('#img_item-'+arr_img_character[0]).show();
                        $($clone).find('#img_item-'+arr_img_character[1]).addClass('cust');
                        $($clone).find('#img_item-'+arr_img_character[1]).css('right',0);
                        $($clone).find('#img_item-'+arr_img_character[1]).show();
                    }
                    // alert('name_character: '+name_character);
                    if(name_character != undefined && name_character != ''){
                        //show label name
                        $($clone).find('.div_name_label .name_label_text').html(name_character);

                        //if mode suara batin
                        if($this.ldata2["text_3"][index]['suara_batin'] != undefined){
                            if($this.ldata2["text_3"][index]['suara_batin'] == 1){  
                                var img_html = ' <img src="assets/image/other/thinking_emoji.png" style="height: 100%;">';
                                $($clone).find('.div_name_label .name_label_text').append(img_html);
                            }
                        }

                        /*Function setting css position name_label_text*/
                        // console.log($this.ldata2["text_3"][index]['text_2_position']);
                        if($this.ldata2["text_3"][index]['text_2_position'] != undefined){
                            console.log("test");
                            $($clone).find('.div_name_label-2').css("float",$this.ldata2["text_3"][index]['text_2_position']);
                        }else{
                            $($clone).find('.div_name_label-2').css("float","left");
                        }
                        /*End function setting css name_label_text*/

                        /*Function change desain label name*/
                            if($this.ldata2["label_name_img"] != undefined){
                                // console.log("test");
                                $($clone).find('.div_name_label-2 .img_label').attr("src","assets/image/other/"+$this.ldata2["label_name_img"]);
                            }else{
                                
                            }
                        /*End function change desain label name*/

                        // $($clone).find('.div_name_label').show();
                    }

                    /* Function set text_header */
                    var text_header = $this.ldata2['text'];
                    var text_header_2 = $this.ldata2['text_3'][index]['text_header'];
                    if(text_header_2 != undefined){
                        $('.text_title').html(text_header_2);
                    }else{
                        $('.text_title').html(text_header);
                    }   
                    /* End function set text_header */
                }
            }

            //play audio dialog
            var audio = $this.ldata2['text_3'][index]['audio'];
            if(audio != undefined){
                var src_audio_2 = "assets/audio/"+audio;
                // console.log(src_audio_2);
                $this.playDialogSound(src_audio_2);
            }

            /*Function auto next dialog*/
                if($this.auto_next_dialog == true){
                    let $element = ".btn_next_dialog";
                    $this.nextDialog($element);
                }
            /*End function auto next dialog*/
        }else{
            // $($clone).find('.pilihan_place').show();
            // console.log("showHideSoal showContent");
            // $this.showHideSoal('show');

            if($this.isTimer){
                $this.startGameTimer();
            }else{
                $(".timer_quiz").hide();
            }

            $($clone).find('.btn_next_dialog').hide();

            //pause sound
            $this.audio_dialog.pause();
            $this.audio_dynamic_2.pause();

            game.nextSlide();
        }
    }
}

//function set show or hide dialog feedback base on slide-content id
Opening.prototype.showDialogFeedback = function(index, benar, $clone = ''){
    var $this = this;
    // console.log('showDialogFeedback');
    // console.log(index);
    // console.log('benar: '+benar);

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
        var index_dialog = arr_dialog[index];
        
        if(index_dialog != undefined){
            //setting name label
            $('.div_name_label').show();

            $($clone).find('.item_dialog').show();
            $($clone).find('.btn_next_dialog-2').show();
            // console.log(index);
            // console.log(arr_dialog);

            if(benar == 0){
                //if mode suara batin
                // if(arr_dialog[index]['suara_batin'] != undefined){
                //     if(arr_dialog[index]['suara_batin'] == 1){
                //         console.log($clone.find('.item_dialog'));
                //         $clone.find('.item_dialog').addClass('suara_batin');
                //     }
                // }else{
                //     $clone.find('.item_dialog').removeClass('suara_batin');
                // }

                $($clone).find('.item_dialog').removeClass('suara_batins');
                if($($clone).find('#item_dialog_feedback_false_text-'+index).hasClass('suara_batin')){
                    $($clone).find('.item_dialog').addClass('suara_batins');
                }

                if(index_dialog["text"] !=  undefined && index_dialog["text"] != ""){
                    $($clone).find('#item_dialog_feedback_false_text-'+index).show();
                    $(".btn_dialog_wrapper").show();
                }else{
                    $(".btn_dialog_wrapper").hide();
                }

                //play audio dialog
                var audio = $this.ldata2['feedback_false'][index]['audio'];
                if(audio != undefined){
                    var src_audio_2 = "assets/audio/"+audio;
                    // console.log(src_audio_2);
                    $this.playDialogSound(src_audio_2);
                }
            }else{
                $($clone).find('.item_dialog').removeClass('suara_batins');
                if($($clone).find('#item_dialog_feedback_text-'+index).hasClass('suara_batin')){
                    $($clone).find('.item_dialog').addClass('suara_batins');
                }

                if(index_dialog["text"] !=  undefined && index_dialog["text"] != ""){
                    $($clone).find('#item_dialog_feedback_text-'+index).show();
                    $(".btn_dialog_wrapper").show();
                }else{
                    $(".btn_dialog_wrapper").hide();
                }z

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
            // console.log(index+" - "+(arr_dialog.length - 1));
            if(index == (arr_dialog.length - 1)){
                if(benar == 1){
                    // $this.setTextButton('btn_next_dialog-2','Continue');
                }else{
                    // $this.setTextButton('btn_next_dialog-2','Try Again');
                }
            }else{
                // $this.setTextButton('btn_next_dialog-2','Next');
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

                if(name_character != undefined && name_character != ''){
                    //show label name
                    $($clone).find('.div_name_label .name_label_text').html(name_character);

                    //if mode suara batin
                    if(arr_dialog[index]['suara_batin'] != undefined){
                        if(arr_dialog[index]['suara_batin'] == 1){  
                            var img_html = ' <img src="assets/image/other/thinking_emoji.png" style="height: 100%; ">';
                            $($clone).find('.div_name_label .name_label_text').append(img_html);
                        }
                    }

                    /*Function setting css position name_label_text*/
                        console.log("text_2_style: "+JSON.stringify(arr_dialog[index]['text_2_style']));
                        if(arr_dialog[index]['text_2_position'] != undefined){
                            $($clone).find('.div_name_label-2').css("float",arr_dialog[index]['text_2_position']);
                        }else{
                            console.log($($clone).find('.div_name_label-2'));
                            $($clone).find('.div_name_label-2').css("float","left");
                            console.log($($clone).find('.div_name_label-2'));
                        }
                    /*End function setting css name_label_text*/

                    $($clone).find('.div_name_label').show();
                }

                // $(".btn_dialog_wrapper").show();
            }
        }

        //set style btn_next_dialog-2
        $(".btn_next_dialog").hide();
        $(".btn_next_dialog-2").show();
    }
}

Opening.prototype.setTextButton = function(class_name, text){
    if(text == 'Try Again'){
        // $('.'+class_name).css('width','70px');
        $('.'+class_name).html(text);
    }else if(text == 'Continue'){
        // $('.'+class_name).css('width','70px');
        $('.'+class_name).html(text);
    }else if(text == 'Next'){
        // $('.'+class_name).css('width','50px');
        $('.'+class_name).html(text);
    }
}

Opening.prototype.showHideSoal = function(mode){
    if(mode == 'show'){
        $('.modal-backdrop-cust').show();
        $('.pilihan_place').css('z-index',1041);
        $('.pilihan_place').css('position','fixed');
        $('.pilihan_place').show();

        //hide btn_dialog
        $('.btn_dialog_wrapper').hide();

    }else{
        $('.modal-backdrop-cust').hide();
        $('.pilihan_place').css('z-index','unset');
        $('.pilihan_place').css('position','unset');
        $('.pilihan_place').hide();
    }
}

//stop backsound
Opening.prototype.stopBackSound = function(){
    var $this = this;
    //pause sound
    $this.audio_dynamic_2.pause();
    $this.audio_dynamic_2.currentTime = 0;
}

Opening.prototype.substringText = function(string, max_string){
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

Opening.prototype.substringText_2 = function(string, max_string){
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

Opening.prototype.stripHtml = function (html){
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


Opening.prototype.getHtmltag = function (a){
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

Opening.prototype.showQuestion_2 = function($clone){
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

Opening.prototype.setProgresBar = function(mode = '') {
    var $this = this;

    let var_a;
    let var_b;
    if(mode == 2){
        var_a;
        var_b;
    }else{
        var_a = (game.game_data["curr_step"] != undefined ? game.game_data["curr_step"] : 0);
        var_b = game.total_step;
    }
    
    console.log(curr_step);
    console.log(total_step);
    var percent = (curr_step / total_step * 100);
    // percent = 100;
    $(".progress-bar").css("width",percent+"%");

    // game.complete_bar_type = 1;
    if(game.complete_bar_type == 2){
        $(".progress").hide();
        $(".progress_2").show();

        //hide icon complete bar
        if($this.hide_icon_complete_bar == true){
            $(".progress_2 .progress-value .fa").hide();
        }else{
            $(".progress_2 .progress-value .fa").hide();
            $(".progress_2 .progress-title").html($this.text_complete_bar);
            if(percent <= 49){
              $(".progress_2 .progress-value #icon-1").css("display","table");
            }else if(percent > 49 && percent <= 99){
              $(".progress_2 .progress-bar").css("background-color","#FFBC3E");
              $(".progress_2 .progress-value #icon-2").css("display","table");
            }else{
              $(".progress_2 .progress-bar").css("background-color","#8AEA2A");
              $(".progress_2 .progress-value #icon-3").css("display","table");
            }
        }

        //setting css life
        $(".header .life").css("padding-left","19.2%");
    }else{
        /*Function setting css progress-bar*/
            if(percent == 0){
                $(".complete_bar .progress-value").css("right", "-5.4vw");
            }
        /*End function setting css progress-bar*/

        //hide icon complete bar
        if($this.hide_icon_complete_bar == true){
            $(".progress-value .fa").hide();
        }else{
            $(".progress-value .fa").hide();
            if(percent <= 49){
              $(".progress-value #icon-1").css("display","table");
            }else if(percent > 49 && percent <= 99){
              $(".progress-bar").css("background-color","#FFBC3E");
              $(".progress-value #icon-2").css("display","table");
            }else{
              $(".progress-bar").css("background-color","#8AEA2A");
              $(".progress-value #icon-3").css("display","table");
            }
        }
    }
}

Opening.prototype.nextDialog = function($element) {
    var $this = this;
    console.log($element);
    $this.interval_auto_next = setTimeout(function() {
        $($element).click();
    },$this.time_auto_next);
}

//function setting next soal 
Opening.prototype.nextSoal = function(){
    var $this = this;
    $this.category_game += 1; 
    $this.game_data['category_game'] = $this.category_game;
    // console.log(game.game_data);
    game.game_data = $this.game_data;
    game.scorm_helper.setSingleData('game_data', game.game_data);
    var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]+"_"+$this.category_game);
    // console.log(ldata);

    //stop interval play sound
    clearInterval($this.time_backsound);
    $this.stopBackSound();

    game.setSlide($this.current_settings["slide"]);
    // $this.curr_soal += 1;
    // $this.isAppend = 0;
    // $this.showQuestion();
}

//functon setting next soal if current soal last soal
Opening.prototype.nextSoalAtLast = function(){
    var $this = this;
    console.log("nextSoalAtLast");
    // console.log(game.game_data);
    $this.curr_step += 1; 
    $this.game_data["category_game"] = 0;
    $this.game_data["curr_soal"] = 0;
    $this.game_data["curr_step"] = $this.curr_step;
    // console.log($this.game_data);
    game.game_data = $this.game_data;
    game.scorm_helper.setSingleData('game_data', game.game_data);
    // console.log(game.game_data);
    clearInterval($this.time_backsound);
    $this.audio_dynamic_2.pause();
    $this.audio_dialog.pause();
    // console.log(game.game_data);
    game.setSlide($this.slide_result_per_step);
}

Opening.prototype.addEvent = function(){

    $(".video").click(function(e){
        $(this).off();

    $(".btn-close").hide(); 
        
        video_duration = video.duration;
        contentTimeout = video_duration * 1000;
        if($this.isViewVideo == true){
            if(!isNaN(video_duration)){
                video.currentTime = video_duration - 0.1;
            }else{
                video.currentTime = game.video_duration;
            }
            contentTimeout = 100;
        }else{
            //set value
            game.video_duration = video_duration;
        }

        //play video
        // $this.playVideo(id_video);

        //show quiz content in decision time
        setTimeout(function(){ 
            $this.showContentVideo(1);
            $this.opacityVideo(1, id_video);
            $("video").get(0).pause();

            $('.video_header_wrapper').show();

            // start timer playing game 
            if($this.isTimer){
                $this.startGameTimer();
            }else{
                $(".timer").hide();
            }
        }, contentTimeout);

        $("#video .btn-close").click(function(e){
            $(this).off();
            $this.stopVideo(id_video);
            addEvent();
        });

        if(video.hasAttribute("controls")) {
            video.removeAttribute("controls")   
        } else {
            video.setAttribute("controls","controls")   
        }
        
        if(game.mode_life == true){
            $this.show_life();
        }
    });
}

// Opening.prototype.setVideo = function($clone = '', src, show_soal = '', index) {
//     console.log("setVideo");
//     var $this = this;
//     console.log($("#video").find("source"));
//     console.log($this.video_path+src);
//     $("#video").find("source").attr("src",$this.video_path+src);
//     $(".img_video").hide();
//     $("#video")[0].load();

//     game.showLoading();
//     $("#video").on("canplay",function(e){
//         game.hideLoading();
//         $this.playVideo();
//         $("#video").on("ended",function(e){
//             $(this).off();
//             // $this.pauseVideo();
//             // callback(1);
//             // if($this.soal[$this.index]["soal"]){
//             //     $(".bg_name_text_wrapper").show();
//             //     $this.setQuestion();
//             // }else{
//             //     game.nextSlide();   
//             // }

//             //remove class unclickable di class btn_next_dialog
//             $(".btn_next_dialog").removeClass('unclickable');

//             console.log(show_soal);
//             if(show_soal == 1){
//                 // $this.showHideSoal('show');

//                 //clear interval
//                 clearInterval($this.play_video_interval_opening);

//                 game.nextSlide();
//             }else{
//                 //clear interval
//                 clearInterval($this.play_video_interval_opening);
                
//                 console.log('showVideo');
//                 let index_2 = index + 1;
//                 $this.showVideo(index_2, $clone);
//             }

//             // $this.play_video_interval_opening = setInterval(function() {
//             //     $this.playVideo();
//             // },200);

//             $this.playVideo_loop();
//         });
//     });
// };

Opening.prototype.playVideo = function() {
    var $this = this;
    $("#video")[0].play();
};

Opening.prototype.playVideo_loop = function() {
    var $this = this;
    // console.log(/*$("#video")[0]*/);

    $("#video")[0].loop = true;
    $("#video")[0].play();
};

Opening.prototype.pauseVideo = function() {
    var $this = this;
    $("#video")[0].pause();
};

//function set show or hide dialog feedback base on slide-content id
Opening.prototype.showVideo = function(index, $clone = ''){
    var $this = this;
    console.log(index);
    console.log($clone);

    if($clone == ''){
       
    }else{
        $($clone).find('.item_dialog_text').hide();
        var arr_dialog = $this.ldata2["text_3"];
        var index_dialog = arr_dialog[index];
        // console.log(index_dialog);
        let video = index_dialog['video'];
        // console.log(video);
        console.log('index_dialog');
        console.log(index_dialog);
        console.log(index);
        if(index_dialog != undefined && arr_dialog.length > (index+1)){
            //setting video
            //call function set hand touch image
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

Opening.prototype.setVideo = function($clone = '', src, show_soal = '', index, flag_loop = 0) {
    console.log("setVideo");
    // alert("setVideo");
    var $this = this;
    console.log($("#video").find("source"));
    console.log($this.video_path+src);
    $("#video").find("source").attr("src",$this.video_path+src);
    console.log($(".img_video"));
    $(".img_video").hide();
    $("#video")[0].load();

    // alert("test");
    game.showLoading();
    $("#video").on("canplay",function(e){
        // alert("test 2");
        game.hideLoading();
        $this.playVideo();

        if(flag_loop == 0){
            var arr_dialog = $this.ldata2["text_3"];
            var name_character = $this.ldata2["text_3"][index]['text_2'];

            //show hide dialog text and box
            console.log(arr_dialog[index]["text"]);
            $($clone).find('.item_dialog_text').hide();
            if(arr_dialog[index]["text"] != undefined && arr_dialog[index]["text"] != ""){
                $($clone).find('#item_dialog_text-'+index).show();
                console.log($($clone).find(".btn_dialog_wrapper"));
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
        }

        // console.log(show_soal);
        if(show_soal == 1){
            // alert('show soal');
            $($clone).find(".btn-global").hide();

            $($clone).find(".btn_next_dialog").show();
            $($clone).find(".btn_next_dialog").unbind().click(function(){
                $(this).hide();
                if(!$(this).hasClass('unclickable')){
                    $(this).addClass('unclickable');
                    //hide dialog element
                    $($clone).find(".item_dialog_text").hide();
                    $($clone).find(".div_name_label").hide();

                    //set soal
                    // show soal element
                    // $(".txt_question").show();
                    // $this.showHideSoal('show');
                    // $this.setSoalVideo($clone, index);

                    //next slide
                    game.nextSlide();
                }
            });
        }else{
            console.log('showVideo');
            let index_2 = index + 1;

            $(".btn_next_dialog").show();
            $($clone).find(".btn_next_dialog").unbind().click(function(){
                $(this).hide();
                // alert('btn_next_dialog');
                $($clone).find(".item_dialog_text").hide();
                $($clone).find(".div_name_label").hide();
                clearInterval($this.play_video_interval_opening);
                $this.showVideo(index_2, $clone);
            });
        }

        $("#video").on("ended",function(e){
            $(this).off();
            // $this.pauseVideo();

            //call function set video, to call again this video
            // $this.play_video_interval_opening = setInterval(function() {
            //     $this.playVideo();
            // },200);

            $this.playVideo_loop();
        });
    });
};

Opening.prototype.setHandTouchImg = function($image){
    console.log("setHandTouchImg");
    console.log($image);
    if($image != undefined && $image != ""){
        $(".img_click").attr("src","assets/image/other/"+$image);
        $(".img_click").show();
    }
}

Opening.prototype.setLabelNameDialog = function($clone, $name_character, $label_style, $label_position, $suara_batin, $label_icon, $label_img, $label_bg_img = ""){
    var $this = this;

    $($clone).find('.div_name_label').hide();
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
            console.log($label_style);
            console.log($label_img);
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
