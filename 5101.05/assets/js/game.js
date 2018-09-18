var Game = function(){
    console.log('game declaration');
    var $this = this;
    this.isLocal = false;
    this.audio = new Audio();
    this.score = 0;
    this.max_score = 100;
    this.min_score = 75;
    this.total_soal = 0;
    this.total_sub_soal = 0;
    this.attemp=0;
    this.max_file_upload=3;
    this.current_challenge= 1;
    this.date_server;
    /*
        game_data = {}
    */
    /*param:
        category_game: "", //last category game
        curr_challenge: "", //last challenge
        curr_score: "", //last score
        curr_sub_challenge: "" //last sub challenge in day challenge,
        start_date: "2018-09-14" //last start palying game
    */

    this.game_data = {};
    this.isDebug = true;
    this.temp = 0;
    this.username = "mita@digimasia.com";
    this.module_id = 1354;
    this.image_path = 'assets/image/';
    
    $.get("config/templete_content.json",function(e){
        $this.arr_content = e["list_slide"];
        $this.curr_module = e["module"];
        $this.curr_course = e["course"];
        $this.scorm_helper = new ScormHelper();
        var game_data = $this.scorm_helper.getSingleData('game_data');
        console.log(game_data);

        if(!$this.isLocal){
            $this.username = $this.scorm_helper.getUsername();
            $this.username = 'elim@digimasia.com';
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

        var url = game.base_url+"get_date.php";
        var async = false; // set asyncron false
        var getDate = $this.requestGet(url, async);
        $this.date_server = getDate.date;
        // console.log(getDate);
       
        // (game_data == 1 ? $this.game_data = {} : '');
        $this.game_data["category_game"] = 'sales';
        $this.game_data["start_date"] = '2018-09-17';
        console.log($this.game_data);
        if($this.game_data == 1){
            $this.game_data = {};
            game.setSlide(0);
            return;
        }else{
            if($this.game_data["category_game"]){
                game.setSlide(3);
                return;
            }
        }

        console.log('test game');
        $this.create_slide();
    },'json');
}

Game.prototype.create_slide = function() {
    console.log('create_slide');
    var $this = this;
    var current = $this.scorm_helper.getCurrSlide();
    // var current = 5;

    //ajax setup
    $.ajaxSetup({
        timeout: 20000 //Time in milliseconds, set timeout in 20 second
    });

    $.get($this.arr_content[current]["file"],function(e){
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
    console.log(game.date_server);
    var newDate = new Date(game.date_server);  
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
    var data = game.scorm_helper.getSingleData('category_game');
    game.game_data['category_game'] = data;
    data = 'sales';
    if(data == 1){
        game.setSlide(0);
    }

    return data;
}

/*
    upload file to server
    @param: activityid, file
*/
Game.prototype.uploadFile = function(activityid, file, newFileName,callback){
    var formData = new FormData();
    formData.append('user_id',game.username);
    formData.append('cmid',game.module_id);
    formData.append('activityid', activityid);
    formData.append('file', file, newFileName);
    // $(form).find("#progress").css({"display":"block"});
    console.log(formData);
    try{
     $.ajax({
         xhr: function() {
             var xhr = new window.XMLHttpRequest();
             xhr.upload.addEventListener("progress", function(evt) {
                 if (evt.lengthComputable) {
                     var percentComplete = evt.loaded / evt.total;
                     //Do something with upload progress here
                     $(".progress-bar").css({"width":(percentComplete*100)+"%"});
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
         async: false, // next process wait untul this ajax finish
         success: function(data) {
            console.log(data);
             // if(data["status"] == "success"){
                callback(data);
                 // $(form).find(".loader_image").css({"display":"none"});
                 // $(form).find("#progress").css({"display":"none"});
                 // $(form).find(".upload_wrapper").css({"display":"none"});

                 // $(form).find(".img_result img").attr("src",game.base_url+data["message"]+"?lastmod="+new Date());
                 // var grade_by_id;
                 // if($this.sc_data[$(form).attr("index")] == null || $this.sc_data[$(form).attr("index")] == undefined || $this.sc_data[$(form).attr("index")] === void 0){
                 //     grade_by_id = null;
                 // }
                 // else{
                 //     grade_by_id = $this.sc_data[$(form).attr("index")]["grade_by_id"];
                 // }

                 // var res = {
                 //     activityid:$this.ldata[$(form).attr("index")]["activityid"],
                 //     activity_title:$this.ldata[$(form).attr("index")]["activity_title"],
                 //     activity_type:$this.ldata[$(form).attr("index")]["activity_type"],
                 //     activity_question:$this.ldata[$(form).attr("index")]["activity_question"],
                 //     activity_response:game.base_url+data["message"],
                 //     grade:-1,
                 //     pass_grade:$this.ldata[$(form).attr("index")]["pass_grade"],
                 //     grade_type:$this.ldata[$(form).attr("index")]["grade_type"],
                 //     grade_by_id:grade_by_id,
                 //     reviewtype:2
                 // };

                 // $this.sc_data[$(form).attr("index")] = res;
                 // console.log($this.sc_data);

                 // game.scorm_helper.setAnsData("game1",$this.sc_data);
             // }
         }/*,fail: function(data) {
            console.log(data);
         }*/
     }); 
    }catch(e){
        console.log(e);
        alert(e);
    }
}

Game.prototype.requestGet = function(url, async){
    console.log('requestGet');
    var res = '';
    $.ajax({
        url: url,
        type: "GET",           // Type of request to be send, called as method
        data: '',         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
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

Game.prototype.requestPost = function(url, async, formdata = ''){
    console.log('requestPost');
    var res = '';
    $.ajax({
        url: url,
        type: "POST",           // Type of request to be send, called as method
        data: formdata,         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
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
