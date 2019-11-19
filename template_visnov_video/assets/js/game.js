var Game = function(){
    var $this = this;
    this.audio = new Audio();
    this.setting = new Setting();

    //variabel setting global
    this.setting_global = new Setting();
    
    this.score = 0;
    // this.startGame = 0;
    this.total_soal = 0; //total soal dari semua step
    this.attemp = 1; //status attemp sekarang
    this.newAttemp = false; //status attemp baru. set di game_map
    // this.temp = 0;
    this.image_path = 'assets/image/';
    this.isViewVideo = false; //flag sudah lihat video
    this.video_duration = 0;
    // this.cmid = 668; // cmid uat
    this.cmid = 600; // cmid live
    // this.show_tutorial_ular_tangga = true; //show hide tutorial
    // this.flag_tutorial_show = 0;
    this.audio_backsound_per_stage;
    this.time_backsound_per_stage;
    this.game_data = {};
    // this.curr_step = 1; //variabel yang mendefinisikan step sekarang, default step 1

    /*Setting able variable*/
        this.max_score = this.setting["max_score"];;
        this.min_score = this.setting["min_score"];
        this.image_path = this.setting["image_path"];
        this.show_tutorial_ular_tangga = this.setting["show_tutorial_ular_tangga"]; //show hide tutorial
        // this.curr_step = 1; //variabel yang mendefinisikan step sekarang, default step 1

        /*Setting life*/
        this.mode_life = this.setting["mode_life"];
        this.life_max = this.setting["life_max"]; //set max life
        /*End setting life*/

        this.auto_next_dialog = this.setting["auto_next_dialog"];
        this.time_auto_next = this.setting["time_auto_next"];
        this.tryagain_question_false_answer = this.setting["tryagain_question_false_answer"]; //default true, jika answer salah ulang soal terakhir
        //setting timer
        this.time_global = this.setting["time_global"];
        this.timer_global = this.setting["timer_global"]; //milisecond timer global
        this.pause_timer_global = this.setting["pause_timer_global"]; //pause timer global default false
        $this.hide_icon_complete_bar = this.setting["hide_icon_complete_bar"];
        this.complete_bar_type = this.setting["complete_bar_type"]; //tipe complete bar [1,2]
        $this.text_complete_bar;
        this.slide_result_per_step = this.setting["slide_result_per_step"]; //variabel untuk menentukan slide pertama result step
        this.slide_result = this.setting["slide_result"]; //variabel untuk menentukan slide result
        this.slide_game_map = this.setting["slide_game_map"];
        /*
            game_data ={
                category_game: 2 //array n dari list soal di json, default 0
                curr_soal: 0 //soal terakhir dari soal di json, default 0
                last_score: 0 //skor terakhir dari game, default 0,
                slide: undefined //mendefinisikan slide terakhir
                last_life: 5 //mendefinisikan life terakhir
            };
        */

        this.orientation_landscape = this.setting["orientation_landscape"];
    /*End setting able variable*/

    /*Setting page map*/
        this.total_step = this.setting["total_step"];
        this.hide_step_connector = this.setting["hide_step_connector"];
    /*End setting page map*/
    
    $.get("config/templete_content.json",function(e){
        $this.arr_content = e["list_slide"];
        $this.curr_module = e["module"];
        $this.curr_course = e["course"];
        $this.scorm_helper = new ScormHelper();
        if($this.scorm_helper.getSingleData('game_data') != undefined){
            $this.game_data = $this.scorm_helper.getSingleData('game_data');
            $this.total_soal = ($this.game_data["total_soal"] != undefined ? $this.game_data["total_soal"] : 0);
        }
        var attemp = $this.scorm_helper.getSingleData('attemp');
        if(attemp != undefined){
            $this.attemp = attemp;
        }

        //set orientation landscape
        if($this.orientation_landscape == true){
            try {
                //call function orientation landscape
                moleawiz.sendCommand("cmd.force_orientation");
            }
            catch(err) {
                console.log(err);
            }

        }
        
        var modeTest = 0;
        if(modeTest == 1){
            $this.username = 'elim@digimasia.com';
            // $this.attemp = 1;
            // $this.game_data = {
            //     "category_game":0,
            //     "start_date":"22 November 2018",
            //     "last_challenge":4,
            //     "last_life": 2,
            //     "last_score": 2
            // };

            $this.game_data = {
                "last_score":1,
                "category_game":0,
                "start_date":"20 Juni 2019"
            };

            // $this.scorm_helper.ldata['quiz'] = [
            //     {
            //         "index":"game_slide_2_0",
            //         "answer":[[4,1],[3,1],[2,1],[1,0],[5,0]], //[index,isTrue]
            //         "list_question":[[0],[1],[2],[3],[4]],
            //         "start_date":"22 November 2018 17:55:30",
            //         "end_date":"",
            //         "is_complete":true,
            //         "last_life": 3,
            //         "last_score": 5
            //     }
            //     ,{
            //         "index":"game_slide_2_1",
            //         "answer":[[4,1],[3,1],[2,1],[1,0],[5,0]], //[index,isTrue]
            //         "list_question":[[0],[1],[2],[3],[4]],
            //         "start_date":"22 November 2018 17:55:30",
            //         "end_date":"",
            //         "is_complete":true,
            //         "last_life": 3,
            //         "last_score": 5
            //     }
                // ,{
                //     "index":"game_slide_2_2",
                //     "answer":[[4, 1],[3, 1],[2, 1],[1, 1],[5, 0]], //[index,isTrue]
                //     "list_question":[[0,0],[1,1],[2,2],[3,3],[4,4]],
                //     "start_date":"27 November 2018 17:55:30",
                //     "end_date":"28 November 2018 13:19:19",
                //     "is_complete":true,
                //     "last_life": 3,
                //     "last_score": 5
                // }
                // ,{
                //     "index":"game_slide_2_3",
                //     "answer":[], //[index,isTrue]
                //     "list_question":[[0,0],[1,1],[2,2],[3,3],[4,4]],
                //     "start_date":"27 November 2018 17:55:30",
                //     "end_date":"28 November 2018 13:19:19",
                //     "is_complete":true,
                //     "last_life": 3,
                //     "last_score": 5
                // }
            //     ,{
            //         "index":"game_slide_2_4",
            //         "answer":[[4, 1],[3, 1],[2, 1],[1, 1]], //[index,isTrue]
            //         "list_question":[[0,0],[1,1],[2,2],[3,3],[4,4]],
            //         "start_date":"27 November 2018 17:55:30",
            //         "end_date":"28 November 2018 13:19:19",
            //         "is_complete":true,
            //         "last_life": 3,
            //         "last_score": 5
            //     }
            // ];
        }

        // if($this.game_data['category_game'] != undefined){
        //     game.setSlide(2);
        //     return;
        // }
        console.log('call create_slide');
        $this.create_slide();
    },'json');
}

Game.prototype.create_slide = function() {
    console.log('create_slide');
    var $this = this;
    var current = $this.scorm_helper.getCurrSlide();
    // current = 3;
    console.log("current: "+current);
    console.log($this.game_data);
    //ajax setup
    $.ajaxSetup({
        timeout: 20000 //Time in milliseconds, set timeout in 20 second
    });

    if(current >= 2 && current < 7){
        /*Funtion set text complete bar*/
            console.log($this.arr_content[current]["text_complete_bar"]);
            if($this.arr_content[current]["text_complete_bar"] != undefined){
                $this.text_complete_bar = $this.arr_content[current]["text_complete_bar"];
            }
        /*End funtion set text complete bar*/

        $this.setProgresBar();
    }

    $.get($this.arr_content[current]["file"],function(e){
        $this.curr_slide = $(e).clone();
        $this.curr_slide.find(".title-course").html($this.curr_course);
        $this.curr_slide.find(".title-module").html($this.curr_module);
        $("#content").html($this.curr_slide);

        /*if($(".next_page").length){
            $this.scorm_helper.pushCompleteSlide();
        }*/

        if($this.arr_content[current]["hasClass"]){
            console.log(current);
            console.log($this.arr_content);
            $this.curr_class = new window[$this.arr_content[current]["class"]];
            $this.curr_class.init($this.arr_content[current]);
        }

        $(".next_page").click(function(e){
            console.log(".next_page");
            $this.audio.audioButton.play();
            $this.nextSlide();
        });

        $(".close-popup").click(function(e){

        });

        /*Function timer global*/
        // if($this.arr_content[current]["slide"] == 3){
        //     if($this.time_global == true){
        //         if($this.start_timer_global == 0){
        //             $this.startTimerGlobal();
        //         }
        //     }
        // }
        /*End function timer global*/
    });
};

Game.prototype.setSlide = function(idx_slide) {
    // console.log("idx_slide: "+idx_slide);
    this.audio.audioButton.play();
    this.scorm_helper.setSlide(parseInt(idx_slide)-1);
    this.nextSlide();
};

Game.prototype.nextSlide = function() {
    // console.log(this.scorm_helper.getCurrSlide());
    // console.log(this.arr_content.length-1);
    if(this.scorm_helper.getCurrSlide()<this.arr_content.length-1){
        this.scorm_helper.nextSlide();
        this.create_slide();
    }
};

Game.prototype.prev = function(prev) {
    var $this = this;
    if(prev){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", prev, {
            transition: "slide",
            reverse: true
        });
    }
};

Game.prototype.next = function(next) {
    var $this = this;
    if(next){
        $( ":mobile-pagecontainer" ).pagecontainer( "change", next, {
            transition: "slide"
        });
    }
};

Game.prototype.getDate = function() {
    var months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember" ];
    var dateString = "";
    var newDate = new Date();  
    dateString += newDate.getDate() + " "; 
    dateString += (months[newDate.getMonth()]) + " "; 
    dateString += newDate.getFullYear();

    return dateString;
};

Game.prototype.getFullDate = function() {
    var months = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember" ];
    var dateString = "";
    var newDate = new Date();  
    dateString += newDate.getDate() + " "; 
    dateString += (months[newDate.getMonth()]) + " "; 
    dateString += newDate.getFullYear() + " ";
    dateString += newDate.getHours()+":";
    dateString += newDate.getMinutes()+":";
    dateString += newDate.getSeconds();
    return dateString;
};

Game.prototype.openModal = function(target) {
    this.audio.audioButton.play();
    $('.modal.' + target).addClass('open');
};

Game.prototype.closeModal = function() {
    this.audio.audioButton.play();
    $('.modal').removeClass('open');
};

Game.prototype.debug = function(string) {
    console.log(string);
};

Game.prototype.getCategoryGame = function(){
    var data = JSON.parse(game.scorm_helper.getSingleData('game_data'));
    if(data == 1){
        game.setSlide(0);
    }
    return data['category_game'];
}

//function generate number between min and max, if num except value random again until not num except
Game.prototype.generateRandom = function(min, max, num_except = '') {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(min+' - '+max+' - '+num+' - '+num_except);
    return (num === num_except ) ? game.generateRandom(min, max, num_except) : num;
}

Game.prototype.audio_dynamis = function(src){
    var $this = this;
    console.log(src);
    this.audioDynamis = document.createElement('audio');
    this.audioDynamis.setAttribute('src', src);  
    this.audioDynamis.play(); 
}

Game.prototype.show_life = function() {
    console.log("show_life");
    var $this = this;
    var count_star = 0;
    // var $this.life = $this.game_data["last_life"];
    $(".star-wrapper .star").removeClass('active');
    // var time_star = setInterval(function() {
    //     count_star++;
    //     if(count_star <= game.life_max){
    //         console.log($this.life);
    //         if(count_star<=$this.life){
    //             $(".star-wrapper .star:nth-child("+count_star+")").addClass("active");  
    //         }
    //         $(".star-wrapper .star:nth-child("+count_star+")").fadeIn(1000);
    //         $(".star-wrapper .star:nth-child("+count_star+")").css({"display":"inline-block"});            
    //     }
    //     else{
    //         clearInterval(time_star);
    //     }
    // },200); 
}

Game.prototype.startTimerGlobal = function() {
    console.log('startGameTimer');
    var $this = this;
    $(".timer").show();
    // console.log($this.isStartTime);
    if($this.time_global == true){
        if($this.timer_global != undefined){
            $this.start_timer_global = 1;
            // console.log($this.countTime);
            $this.timer_global_interval = setInterval(function() {
                // console.log('test');
                // console.log($this.countTime);
                if($this.timer_global>0){
                    if($this.pause_timer_global == false){
                        // console.log($this.setTimer());
                        $(".timer .text_time").html($this.setTimer());
                    }
                }else{
                    clearInterval($this.timer_global_interval);
                    // $this.time = null;
                    $(".timer .text_time").html("--:--");

                    //set value global timeout
                    game.game_data["global_timeout"] = 1;
                    //function go to page result
                    game.setSlide(9);
                }
            },1000);
        }
    }
}

Game.prototype.setTimer = function() {
    // console.log('setTimer');
    $this = this;
    // console.log($this.timer_global);
    $this.timer_global = $this.timer_global-1;
    var diffMunites = Math.floor($this.timer_global/60);
    var diffSec = Math.floor($this.timer_global%60);
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
}

Game.prototype.setProgresBar = function() {
    console.log("setProgresBar");
    var $this = this;

    let var_a;
    let var_b;
    console.log(game.game_data);
    console.log(game.total_soal);
    // console.log(mode);

    let mode = 2; //mode 1 berdasarkan total step; mode 2 berdasarkan total soal
    if(mode == 2){
        var_a = (game.game_data["last_score"] != undefined ? game.game_data["last_score"] : 0);
        var_b = game.total_soal;
    }else{
        var_a = (game.game_data["curr_step"] != undefined ? game.game_data["curr_step"] : 0);
        var_b = game.total_step;
    }
    
    console.log(var_a);
    console.log(var_b);
    var percent = (var_a / var_b * 100);
    console.log(percent);
    if(isNaN(percent)){
        percent = 0;
    }
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
            // console.log(percent);
            if(percent <= 69){
              $(".progress_2 .progress-value #icon-2").css("display","table");
              $(".progress_2 .progress-bar").css("background-color","#FFBC3E");
            }else if(percent > 69 && percent <= 99){
              $(".progress_2 .progress-bar").css("background-color","#FFBC3E");
              $(".progress_2 .progress-value #icon-3").css("display","table");
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
            if(percent <= 69){
              $(".progress-value #icon-2").css("display","table");
            }else if(percent > 69 && percent <= 99){
              $(".progress-bar").css("background-color","#FFBC3E");
              $(".progress-value #icon-3").css("display","table");
            }else{
              $(".progress-bar").css("background-color","#8AEA2A");
              $(".progress-value #icon-3").css("display","table");
            }
        }
    }
}

Game.prototype.playBacksound = function(src_audio, looping = true) {
    var $this = this;
   
    //play sound 2
    var src_audio_2 = "assets/audio/"+src_audio;
    console.log('src_audio_2: '+src_audio_2);
    $this.audio_backsound_per_stage = game.audio.audio_dynamic(src_audio_2);
    var promise = $this.audio_backsound_per_stage.play();

    if (promise !== undefined) {
         promise.then(_ => {
         // Autoplay started!
    }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      });
    }

    if(looping == true){
        $this.time_backsound_per_stage = setInterval(function() {
            var duration = $this.audio_backsound_per_stage.duration;
            var currentTime = $this.audio_backsound_per_stage.currentTime;
            // console.log(duration);
            // console.log(currentTime);
            if(duration <= currentTime){
                // clearInterval($this.time_backsound);

                // var contentTimeout = duration * 1000;
                //stop backsound
                // $this.stopBackSound();
                $this.audio_backsound_per_stage.pause();
                $this.audio_backsound_per_stage.currentTime = 0;

                setTimeout(function(){
                   
                    $this.audio_backsound_per_stage.play();
                    // $this.time_backsound = 800;
                },1000);
            }
        },800);    
     }else{
       
    }
};

Game.prototype.stopBacksound = function(){
    var $this = this;
    $this.audio_backsound_per_stage.pause();
    $this.audio_backsound_per_stage.currentTime = 0;
};


Game.prototype.showLoading = function (){
  $(".loader_image_index").show();
  $(".modal-backdrop in").show();
}

Game.prototype.hideLoading = function (){
  $(".loader_image_index").hide();
  $(".modal-backdrop in").hide();
}