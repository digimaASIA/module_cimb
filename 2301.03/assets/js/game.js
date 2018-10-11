var Game = function(){
    console.log('game declaration');
    var $this = this;
    this.isLocal = false;
    this.audio = new Audio();
    this.score = 0;
    this.max_score = 100;
    this.min_score = 75;
    this.total_soal = 20; //total soal
    this.total_sub_soal = 0;
    this.max_file_upload=3;
    this.current_challenge= undefined;
    this.localDate = false;
    this.date_server;
    this.attemp = 1; //status attemp sekarang
    this.newAttemp = false; //status attemp baru. set di game_map
    /*
        game_data = {}
    */
    /*param:
        category_game: [1,2,3], //last category game
        last_challenge: 1, //last challenge
        last_score: [0,100], //last score
        start_date: "2018-09-14" //last start palying game,
        last_life: 5 //last life from game,
        status: ['win','lose'] //status from last playing games until finish
        game_log : [{
            "category_game" : game.game_data['category_game'],
            "score"         : game.game_data['last_score'],
            "start_date"    : game.game_data['start_date'],
            "last_life"     : game.game_data['last_life']
        }]; //arr log game
    */

    this.game_data = {};
    this.isDebug = true;
    this.temp = 0;
    this.username = "elim@digimasia.com";
    this.module_id = 1374;
    this.image_path = 'assets/image/';
    this.challenge_on_weekend = true; //if true, on weekend stay increment challenge
    // Store
    // localStorage.setItem("isViewVideo", false);//if true, video has played before
    this.isViewVideo = false;
    this.life_max = 5; //set max life
    this.video_duration = 0;
    
    $.get("config/templete_content.json",function(e){
        $this.arr_content = e["list_slide"];
        $this.curr_module = e["module"];
        $this.curr_course = e["course"];
        $this.scorm_helper = new ScormHelper();
        console.log($this.scorm_helper);
        var game_data = $this.scorm_helper.getSingleData('game_data');
        console.log(game_data);
        // if(game_data != undefined){
        //     game_data = JSON.parse(game_data);
        // }
        var attemp = $this.scorm_helper.getSingleData('attemp');
        // var attemp = 2;
        console.log(attemp);

        if(!$this.isLocal){
            $this.username = $this.scorm_helper.getUsername();
            // $this.username = 'elim@digimasia.com';
            $this.base_url = "http://demo.digimasia.com/cimbniaga/challange/";
            // var gamedata = $this.scorm_helper.getSingleData('game_data');
            // console.log(gamedata);
            // if(gamedata != undefined){
            //     $this.game_data = gamedata;
            // }
        }
        else{
            $this.base_url = "http://localhost/cimbniaga/challange/";
        }

        //set date
        // var getDate = $this.getDate2();
        // $this.date_server = getDate;
        // //if date not local, use server date
        // if($this.localDate == false){
        //      var url = game.base_url+"get_date.php";
        //     var async = false; // set asyncron false
        //     getDate = $this.requestGet(url, async);

        //     //if request error return blank
        //     if(getDate == 'error'){
        //         return 0;
        //     }
        //     $this.date_server = getDate.date;

        // }
        // console.log(getDate);
        
        //set attemp
        if(attemp != undefined){
            $this.attemp = attemp;
        }
        
        // (game_data == 1 ? $this.game_data = {} : '');
        // game_data["category_game"] = 'sales';
        // game_data["start_date"] = '2018-09-15';
        // game_data = {
        //     "category_game":'sales',
        //     'start_date':'2018-09-15'
        // };

        var modeTest = 0;
        if(modeTest == 1){
            $this.username = 'elim@digimasia.com';
            $this.attemp = 1;
            // game_data = {
            //     "category_game": 1, //last category game
            //     "last_challenge": 4, //last challenge
            //     "last_life" : 5,
            //     // "last_score": 100, //last score win
            //     "last_score": 100, //last score lose
            //     "start_date": "2018-10-05", //last start palying game
            //     "status":"win",
            //     "game_log"  : [
            //         {
            //         "category_game" : 1,
            //         "score"         : 100,
            //         "start_date"    : '2018-10-9',
            //         "last_life"     : 3
            //         },  
            //         {
            //         "category_game" : 2,
            //         "score"         : 100,
            //         "start_date"    : '2018-10-10',
            //         "last_life"     : 3
            //         },
            //         {
            //         "category_game" : 3,
            //         "score"         : 100,
            //         "start_date"    : '2018-10-10',
            //         "last_life"     : 3
            //         }
            //     ]
            // };

            /*game_data go to final*/
            game_data = {
                "category_game": undefined, //last category game
                "last_challenge": undefined, //last challenge
                "last_life" : 5,
                // "last_score": 100, //last score win
                "last_score": undefined, //last score lose
                "start_date": "2018-10-05", //last start palying game
                "status":"win",
                "game_log"  : [
                    {
                    "category_game" : 1,
                    "score"         : 100,
                    "start_date"    : '2018-10-9',
                    "last_life"     : 3
                    },  
                    {
                    "category_game" : 2,
                    "score"         : 100,
                    "start_date"    : '2018-10-10',
                    "last_life"     : 3
                    },
                    {
                    "category_game" : 3,
                    "score"         : 100,
                    "start_date"    : '2018-10-10',
                    "last_life"     : 3
                    }
                ]
            };
        }
        console.log(game_data);
        if(game_data == 1){
            $this.game_data = {};
            game.setSlide(0);
            return;
        }else{
            console.log('test');
            $this.game_data = game_data;
            console.log($this.game_data["category_game"]);
            if($this.game_data["category_game"] != undefined){
                alert('go to game map');
                game.setSlide(2);
                return;
            }
        }
        console.log($this.game_data);
        console.log('test game');
        $this.create_slide();
    },'json');
}

Game.prototype.create_slide = function() {
    console.log('create_slide');
    var $this = this;
    var current = $this.scorm_helper.getCurrSlide();
    // var current = 5;

    //if slide game_map, get date

    //ajax setup
    $.ajaxSetup({
        timeout: 20000 //Time in milliseconds, set timeout in 20 second
    });

    if(current == 2){
        console.log(game.isViewVideo);
        //set current_challenge
        console.log(game.game_data['last_challenge']);
        game.current_challenge = (game.game_data['last_challenge'] != undefined ? game.game_data['last_challenge'] : 0);
    }

    $.get($this.arr_content[current]["file"],function(e){
        console.log($this.game_data);
        $this.curr_slide = $(e).clone();
        console.log('current slide: '+current);
        console.log('current file: '+$this.arr_content[current]["file"]);
        $this.curr_slide.find(".title-course").html($this.curr_course);
        $this.curr_slide.find(".title-module").html($this.curr_module);
        $("#content").html($this.curr_slide);

        if($(".next_page").length){
            $this.debug($(".next_page").length+"_tes");
            $this.scorm_helper.pushCompleteSlide();
        }

        if($this.arr_content[current]["hasClass"]){
            $this.curr_class = new window[$this.arr_content[current]["class"]];
            $this.curr_class.init();
        }

        $(".next_page").click(function(e){
            if($this.scorm_helper.cekCompleteNext()){
                console.log($this.audio.audioButton);
                $this.audio.audioButton.play();
                $this.nextSlide();
            }
        });

        $(".close-popup").click(function(e){

        });
    });
};

Game.prototype.setSlide = function(idx_slide) {
    console.log("setSlide");
    this.audio.audioButton.play();
    this.scorm_helper.setSlide(parseInt(idx_slide)-1);
    this.nextSlide();
};

Game.prototype.nextSlide = function() {
    console.log('nextSlide');
    console.log(this.scorm_helper.getCurrSlide());
    console.log(this.arr_content.length-1);
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

Game.prototype.getDate2 = function() {
    // console.log('getDate2');
    var dateString = "";
    //date from date_server
    var newDate = new Date();  
    (game.date_server != undefined ? newDate = new Date(game.date_server) : '');
    var d = newDate.getDate(); 
    var m = newDate.getMonth() + 1; 
    // console.log(m);
    (m < 10 ? m = '0'+m : '');
    var y = newDate.getFullYear();
    dateString = y+'-'+m+'-'+d;
    // console.log(m);
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
    console.log("openModal");
    this.audio.audioButton.play();
    $('.modal.' + target).addClass('open');
};

Game.prototype.closeModal = function() {
    console.log(this);
    this.audio.audioButton.play();
    $('.modal').removeClass('open');
};

// Game.prototype.getScore = function() {
//     var curr_score = this.game_data['curr_score'];
// };

Game.prototype.debug = function(string) {
    if(this.isDebug){
        //alert(string);
        console.log(string);
    }
};

Game.prototype.getCategoryGame = function(){
    var data = JSON.parse(game.scorm_helper.getSingleData('game_data'));
    console.log(data);
    console.log(game.game_data);
    // (game.game_data['category_game'] == undefined ? game.game_data['category_game'] = data['category_game'] : '');
    // data = 'sales';
    if(data == 1){
        game.setSlide(0);
    }
    console.log(data['category_game']);
    return data['category_game'];
}

/*
    upload file to server
    @param: activityid, file
*/
Game.prototype.uploadFile = function(activityid, file, newFileName, asycn,callback){
    // $('.loader_image_index').show();
    // console.log($('.loader_image_index'));
    var formData = new FormData();
    formData.append('user_id',game.username);
    formData.append('cmid',game.module_id);
    formData.append('activityid', activityid);
    formData.append('file', file, newFileName);
    // $(form).find("#progress").css({"display":"block"});
    console.log(formData);
    // $('.loader_image_index').show();
    try{
        // $('.loader_image_index').show();
        console.log($('.loader_image_index'));
        $.ajax({
         xhr: function() {
            // console.log('xhr');
            // $('.loader_image_index').show();
            // console.log('loader_image_index show');
             var xhr = new window.XMLHttpRequest();
             xhr.upload.addEventListener("progress", function(evt) {
                // $('.loader_image_index').show();
                 if (evt.lengthComputable) {
                     var percentComplete = evt.loaded / evt.total;
                     //Do something with upload progress here
                     // $(".progress-bar").css({"width":(percentComplete*100)+"%"});
                 }
            }, false);

            return xhr;
         },
         url: game.base_url+"upload2.php",
         type: "POST",           // Type of request to be send, called as method
         data: formData,         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
         contentType: false,     // The content type used when sending data to the server.
         cache: false,           // To unable request pages to be cached
         processData:false,      // To send DOMDocument or non processed data file it is set to false
         dataType: 'json',
         async: asycn, // next process wait untul this ajax finish
        beforeSend: function( xhr ) {
            console.log(xhr);
            // $('.loader_image_index').show();
        },
        success: function(data) {
            // $('.loader_image_index').hide();
            console.log(data);
             // if(data["status"] == "success"){
                callback(data);
             // }
        },error: function(data) {
            // $('.loader_image_index').hide();
            console.log(data);
            alert('Cannot request to server !');
        }
     }); 
    }catch(e){
        // $('.loader_image_index').hide();
        console.log(e);
        alert(e);
    }
}

Game.prototype.requestGet = function(url, async){
    console.log('requestGet');
    var res = '';

    try{
        $.ajax({
            url: url,
            type: "GET",           // Type of request to be send, called as method
            data: '',         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,     // The content type used when sending data to the server.
            cache: false,           // To unable request pages to be cached
            processData:false,      // To send DOMDocument or non processed data file it is set to false
            dataType: 'json',
            async: async, // next process wait untul this ajax finish
            timeout: 20000,
            beforeSend: function( xhr ) {
                $('.loader_image_index').show();
            },
            success: function(data) {
                $('.loader_image_index').hide();
                console.log(data);
                res = data;
                // return 'haha';
             // if(data["status"] == "success"){
                 
             // }
            },fail: function(data) {
                $('.loader_image_index').hide();
                console.log(data);
                res = data;
                // return data;
            },error: function (request, status, error) {
                $('.loader_image_index').hide();
                console.log(request);
                console.log(status);
                console.log(error);
                res = status;
                alert("Cannot connect to server !");
            }
        });
    }catch(e){
        console.log(e);
        alert('requestGet: '+e);
    } 

    return res;
}

Game.prototype.requestPost = function(url, async, data = ''){
    console.log('requestPost');
    var formData = new FormData();
    formData.append('user_id', game.username);
    formData.append('cmid', game.module_id);
    var res = '';
    $.ajax({
        url: url,
        type: "POST",           // Type of request to be send, called as method
        data: formData,         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,     // The content type used when sending data to the server.
        cache: false,           // To unable request pages to be cached
        processData:false,      // To send DOMDocument or non processed data file it is set to false
        dataType: 'json',
        async: async, // next process wait untul this ajax finish
        beforeSend: function( xhr ) {
            $('.loader_image_index').show();
        },
        success: function(data) {
            $('.loader_image_index').hide();
            console.log(data);
            res = data;
            // return 'haha';
         // if(data["status"] == "success"){
             
         // }
        },fail: function(data) {
            $('.loader_image_index').hide();
            console.log(data);
            res = data;
            // return data;
        }
    }); 

    return res;
}
