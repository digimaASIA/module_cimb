var Game = function(){
    var $this = this;
    this.audio = new Audio();
    this.score = 0;
    this.max_score = 100;
    this.min_score = 75;
    this.startGame = 0;
    this.total_soal = 20; //total soal
    this.attemp = 1; //status attemp sekarang
    this.newAttemp = false; //status attemp baru. set di game_map
    this.game_data = {};
    this.temp = 0;
    this.image_path = 'assets/image/';
    this.isViewVideo = false;
    this.life_max = 3; //set max life
    this.video_duration = 0;
    this.cmid = 1435;
    
    $.get("config/templete_content.json",function(e){
        $this.arr_content = e["list_slide"];
        $this.curr_module = e["module"];
        $this.curr_course = e["course"];
        $this.scorm_helper = new ScormHelper();
        if($this.scorm_helper.getSingleData('game_data') != undefined){
            $this.game_data = $this.scorm_helper.getSingleData('game_data');
        }
        var attemp = $this.scorm_helper.getSingleData('attemp');
        if(attemp != undefined){
            $this.attemp = attemp;
        }

        var modeTest = 0;
        if(modeTest == 1){
            $this.username = 'elim@digimasia.com';
            // $this.attemp = 1;
            // game_data = {
            //     "category_game":"sales",
            //     "start_date":"2018-09-20",
            //     "curr_challenge":1,
            //     "curr_sub_challenge":"2"
            // };
            // $this.scorm_helper.ldata['quiz'] = [
            //     [
            //         {
            //             "index":0,
            //             "answer":[[1,1],[1,1],[1,1],[1,0],[1,0]],
            //             "list_question":[[1,0],[1,0],[1,0],[1,0],[1,0]],
            //             "start_date":"18 Oktober 2018 16:40:53",
            //             "end_date":"",
            //             "is_complete":false,
            //             "attemp":1
            //         }
            //     ]
            // ];

            // "quiz":[
            //     [
            //         {
            //             "index":"game_1_1",
            //             "answer":[0],
            //             "list_question":[0],
            //             "start_date":"9 November 2018 13:17:34",
            //             "end_date":"9 November 2018 13:17:58",
            //             "is_complete":true
            //         },
            //         {
            //             "index":"game_1_2",
            //             "answer":[1,0,0,0],
            //             "list_question":[1,2,3,0],
            //             "start_date":"9 November 2018 13:18:10",
            //             "end_date":"9 November 2018 13:18:37",
            //             "is_complete":true
            //         },{
            //             "index":"game_1_3",
            //             "answer":[0],
            //             "list_question":[0],
            //             "start_date":"9 November 2018 13:18:43",
            //             "end_date":"9 November 2018 13:19:50",
            //             "is_complete":true
            //         },{
            //             "index":"game_2_1",
            //             "answer":[0,0,1],
            //             "list_question":[1,3,2,7,6,5,4,0],
            //             "start_date":"9 November 2018 13:19:54",
            //             "end_date":"",
            //             "is_complete":false
            //         }
            //     ]
            // ];
        }

        $this.create_slide();
    },'json');
}

Game.prototype.create_slide = function() {
    var $this = this;
    var current = $this.scorm_helper.getCurrSlide();
    //ajax setup
    $.ajaxSetup({
        timeout: 20000 //Time in milliseconds, set timeout in 20 second
    });

    if(current == 3){
        game.current_challenge = (game.game_data['last_challenge'] != undefined ? game.game_data['last_challenge'] : 0);
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
            $this.curr_class = new window[$this.arr_content[current]["class"]];
            $this.curr_class.init($this.arr_content[current]);
        }

        $(".next_page").click(function(e){
            $this.audio.audioButton.play();
            $this.nextSlide();
        });

        $(".close-popup").click(function(e){

        });
    });
};

Game.prototype.setSlide = function(idx_slide) {
    this.audio.audioButton.play();
    this.scorm_helper.setSlide(parseInt(idx_slide)-1);
    this.nextSlide();
};

Game.prototype.nextSlide = function() {
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