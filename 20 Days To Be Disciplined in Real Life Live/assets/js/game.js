var Game = function(){
    console.log('game declaration');
    console.log('v1.0.13 20 days disciplined');
    var $this = this;
    this.isLocal = false;
    this.audio = new Audio();
    this.score = 80;
    this.max_score = 400;
    this.min_score = 80;
    this.total_soal = 20; //total soal
    this.total_sub_soal = 0;
    this.max_file_upload=3;
    this.current_challenge= 1;
    this.localDate = false;
    this.date_server;
    this.attemp = 1; //status attemp sekarang
    this.scorm_attempt = 1; //get scorm attemp sekarang, default 1
    this.newAttemp = false; //status attemp baru. set di game_map
    /*
        game_data = {}
    */
    /*param:
        category_game: "", //last category game
        curr_challenge: "", //last challenge
        curr_score: "", //last score
        curr_sub_challenge: "" //last sub challenge in day challenge,
        start_date: "2018-09-14" //last start palying game,
        onReview: false, //if true, maka akan langsung diarahkan ke page review berdasarkan challenge tersebut,
        interval_days: 20, interval days from start_data to current date
    */

    this.game_data = {};
    this.isDebug = true;
    this.temp = 0;
    this.username = "elim@digimasia.com";
    this.userid;
    this.module_id = 340; //cimbtes.cimbniaga.co.id
    // this.module_id = 340; //uat
    // this.module_id = 506; //BCA
    // this.module_id = 1443; //module_id mobilelearning.cimbniaga.co.id
    // this.module_id = 1409; //module_id mobilelearning.cimbniaga.co.id
    // this.module_id = 368; //module_id cimbtes.digimasia.com
    this.image_path = 'assets/image/';
    this.challenge_on_weekend = true; //if true, on weekend stay increment challenge
    this.next_challenge_until_played = false; //if true, challenge will passed based on interval day
    this.total_challenge = 20;
    this.total_subchallenge_per_challenge = 20;
    this.deadline_challenge = true; //true or false, mode deadline challenge
    this.arr_badges = [[100,199],[200,299],[300,399],[400,400]]; //badges per score, yang didapat
    this.mode_reviewer = 1;

    /*Setting page game map*/
    this.show_modal_curr_day_score = 0;
    /*End setting page game map*/

    /*Setting limit selected peer*/
    this.limit_choose_reviewer_peer = 10; //limit ketika pilih reviewer "peer"
    this.amount_choose_reviewer_peer = 0;
    /*End setting limit selected peer*/

    /*Setting array upload*/
    this.activity_response_url = true;
    /*End setting array upload*/

    this.amount_try_again = 0;//untuk hitung jumlah sudah berapa kali user tersebut try again
    this.max_try_again = 1;
    this.manual_date_server; //set date server

    // this.modeInterval = 1; //mode interval step, calculate range day from date_server to start_date
    this.modeInterval = 2; //mode interval step, go to next step if date_server > last_submit_date and minimal submit 1 sub_category
    
    this.error_request_global = "Breathe. It's just a bad connection, not a bad life. Please find a better place for a better connection. But close this module first!";
    $.get("config/templete_content.json",function(e){
        $this.arr_content = e["list_slide"];
        $this.curr_module = e["module"];
        $this.curr_course = e["course"];
        $this.scorm_helper = new ScormHelper();
        console.log($this.scorm_helper);
        var game_data = $this.scorm_helper.getSingleData('game_data');
        console.log(game_data);
        var attemp = $this.scorm_helper.getSingleData('attemp');
        // var attemp = 2;
        console.log(attemp);

        if(!$this.isLocal){
            $this.username = $this.scorm_helper.getUsername();
            $this.base_url = "https://mobilelearning.cimbniaga.co.id/challange/";
            $this.base_url_2 = "https://mobilelearning.cimbniaga.co.id/";

            // $this.base_url = "http://app-dev.digimasia.com/challange/";
            // $this.base_url_2 = "http://app-dev.digimasia.com/";
            
            //sengaja api-nya arahin ke dev
            var modeDev = false;
            if(modeDev == true){
                $this.user_controller_file = 'user_controller_dev.php';
                $this.submit_review_file = "submit_review_dev.php";
                $this.get_config_file = "get_config_2.php";
                $this.upload_file = "upload2.php";
                $this.get_challenge_review_file = "get_challenge_review_dev.php";
            }else{
                $this.user_controller_file = 'user_controller.php';
                $this.submit_review_file = "submit_review.php";
                $this.get_config_file = "get_config.php";
                $this.upload_file = "upload2.php";
                $this.get_challenge_review_file = "get_challenge_review.php";
            }
        }
        else{
            $this.base_url = "http://localhost/cimbniaga/challange/";
        }
        
        //set attemp
        if(attemp != undefined){
            $this.attemp = attemp;
        }

        // if(game_data == 1){
        //     $this.username = 'CN020810';
        //     var url = game.base_url+game.user_controller_file+"?request=get_scorm_scoes_track_last_attempt_by_moduleid&username="+$this.username+"&module_id="+$this.module_id+"&element_scoes_track=cmi.suspend_data";
        //     var async = false; // set asyncron false

        //     var res = $this.requestGet(url,async);
        //     console.log(res);
        // }

        var modeTest = 0;
        // $this.username = 'elim@digimasia.com';
        if(modeTest == 1){
            $this.username ='nabilah@digimasia.com';
            // $this.attemp = 1;
            
            // game_data = {
            //     "start_date":"2019-03-11",
            //     // "interval_days":21,
            //     // "curr_challenge":20,
            //     // "curr_score":148,
            //     // "curr_sub_challenge":"96",
            //     // "amount_choose_reviewer_peer":10,
            //     "on_review":true
            // };

            // "game_data":{"start_date":"2019-04-21"}
            // "game_data":{"start_date":"2019-04-29","curr_challenge":2}
            // game_data={
            //     "start_date":"2019-04-01",
            //     // "interval_days":7,
            //     // "curr_challenge":8,
            //     // "curr_score":12,
            //     // "curr_sub_challenge":"35",
            //     "date_last_submit":"2019-03-28",
            //     // "on_review":true
            // }

            // game_data={
            //     "start_date":"2019-04-24",
            //     "interval_days":1,
            //     "curr_challenge":2,
            //     "curr_score":20,
            //     "curr_sub_challenge":"10",
            //     "date_last_submit":"2019-04-25",
            //     "amount_choose_reviewer_peer":1,
            //     "on_review":true
            // };
        }
        console.log($this.scorm_helper.ldata);
        var mode = 2;
        if(mode == 1){
            if(game_data == 1){
                $this.game_data = {};
                game.setSlide(0);
                return;
            }else{
                $this.game_data = game_data;
                if($this.game_data["start_date"]){
                    // alert('go to game map');
                    game.setSlide(3);
                    return;
                }
            }
            $this.create_slide();
        }else if(mode == 2){
            var url = $this.base_url+$this.user_controller_file+"?request=get_scorm_scoes_track_last_attempt_by_moduleid&element_scoes_track=cmi.suspend_data&username="+game.username+"&module_id="+game.module_id+"&element_scoes_track=cmi.suspend_data";

            $(".loader_image_index").show();
            var async = false; // set asyncron false
            //request data scorm scoes track
            var timeout = 20000;
            // var url_ext = 1;
            var res = game.requestGet(url, async, timeout, error_text = 0);
            console.log(res);
            if(res != 'error'){
                //if game_data get from internet or scorm offline
                // game_data={
                //     "start_date":"2019-04-24"
                // };
                if(game_data != 1){
                    if(res['data'] != null){
                        if(res['data']['element'] == 'cmi.suspend_data' && res['data']['value'] != undefined){
                            var value = JSON.parse(res['data']['value']);
                            // console.log(value);
                            console.log(value['game_data']);
                            if(value['game_data'] != undefined){
                                // console.log('cuan');
                                var game_data_2 = value['game_data'];
                                // console.log(game_data);
                                var game_data_scorm = game_data;
                                // console.log(game_data_scorm);
                                //if start_date not equal start_date
                                // if(game_data_2['start_date'] != game_data_scorm['start_date']){
                                    $this.game_data = value['game_data'];
                                // }
                            }else{
                                $this.game_data = {};
                            }
                        }
                    }
                }else{ //jika suspend_data 1
                    // return 0;
                    // alert('suspend_data tidak ditemukan, anda get dari scorm offline atau baru pertama main');
                    var text = 'suspend_data tidak ditemukan';
                    // game.popupText(text);
                    if(res['data'] != null){
                        if(res['data']['element'] == 'cmi.suspend_data' && res['data']['value'] != undefined){
                            var value = JSON.parse(res['data']['value']);
                            // console.log(value);
                            // console.log(value['game_data']);
                            if(value['game_data'] != undefined){
                                $this.game_data = value['game_data'];
                            }
                        }
                    }
                }
            }else{
                alert("Breathe. It's just a bad connection, not a bad life. Please find a better place for a better connection. But close this module first!");

                try{
                    var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
                    btn_back.click();
                }
                catch(e){
                    top.window.close();
                }
            }

            console.log($this.game_data);
            console.log($this.game_data['start_date']);

            if($this.game_data['start_date']){
                game.setSlide(3);
                return;
            }else{
                game.setSlide(0);
                return;
            }

        }else{
            var url = game.base_url+game.user_controller_file+"?request=get_scorm_scoes_track_last_attempt_by_moduleid&username="+$this.username+"&module_id="+$this.module_id;
            var async = false; // set asyncron false

            //request data scorm scoes track
            var get_scorm_attempt = $this.requestGet(url, async);
            console.log(get_scorm_attempt);
            if(get_scorm_attempt['status'] == 200){

                $this.scorm_attempt = get_scorm_attempt['data']['attempt'];
                var userid = get_scorm_attempt['data']['userid'];
                if(userid != undefined){
                    $this.userid = userid;
                }
            }

            if($this.scorm_attempt != undefined){
                if(game_data == 1){
                    var url = game.base_url+game.user_controller_file+"?request=get_user_module_data_by_attempt&user_id="+$this.userid+"&module_id="+$this.module_id+"&attempt="+$this.scorm_attempt;
                    var async = false;

                    var res = $this.requestGet(url, async);
                    console.log(res);
                    if(res['status'] == 200){ //if found game data in user_module_data
                        if(res['data'] != undefined){
                            var data_2 = res['data']['value'];
                            if(data_2 != undefined){
                                var value = JSON.parse(res['data']['value']);
                                $this.game_data = value['game_data'];
                                if($this.game_data["start_date"]){
                                    game.setSlide(3);
                                    return;
                                }else{
                                    $this.game_data = {};
                                    game.setSlide(0);
                                    return;
                                }
                            }
                        }
                    }else{
                        $this.game_data = {};
                        game.setSlide(0);
                        return;
                    }
                }else{
                    $this.game_data = game_data;
                    console.log($this.game_data);
                    if($this.game_data["start_date"]){
                        // alert('go to game map');
                        game.setSlide(3);
                        return;
                    }
                }
                // console.log($this.game_data);
                // console.log('test game');

                $this.create_slide();
            }else{
                console.log('Error get attempt scorm!');
                return;
            }
        }
    },'json');
}

Game.prototype.create_slide = function() {
    console.log('create_slide');
    var $this = this;
    var current = $this.scorm_helper.getCurrSlide();
    // var current = 5;

    //if slide game_map, get date
    if(current == 3){
        var getDate = $this.getDate2();
        $this.date_server = getDate;
        // alert('date_server: '+$this.date_server);
        console.log('date_server: '+$this.date_server);
        //if date not local, use server date
        if($this.localDate == false){
            var url = game.base_url+game.get_config_file;
            var async = false; // set asyncron false

            //request config from server
            console.log(url);
            var getConfig = $this.requestGet(url, async);
            /*Hardcode by elim*/
            // getConfig = {
            //     'date':'2019-04-23',
            //     'challenge_on_weekend':false
            // };
            /*End hardcode by elim*/
            console.log(getConfig);

            //if request error return blank
            if(getConfig == 'error'){
                alert('Date server not found, please restart modul and check your internet connection !');
                game.setSlide(-1);
            }else{
                //set varibel value from request
                if(game.manual_date_server != undefined){
                    $this.date_server = game.manual_date_server;
                    // game.manual_date_server = undefined;
                }else{
                    $this.date_server = getConfig.date;
                    // alert('game.js: '+$this.date_server);
                }
                
                $this.challenge_on_weekend = getConfig.challenge_on_weekend;
            }

        }
        console.log('$this.date_server: '+$this.date_server);
    }


    //ajax setup
    $.ajaxSetup({
        timeout: 20000 //Time in milliseconds, set timeout in 20 second
    });

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
    // alert('newDate: '+newDate);
    // alert('date_server: '+game.date_server);
    (game.date_server != undefined ? newDate = new Date(game.date_server) : '');
    // alert('newDate: '+newDate);
    var d = newDate.getDate(); 
    (d < 10 ? d = '0'+d : '');
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
    console.log(file);
    var formData = new FormData();
    formData.append('user_id',game.username);
    formData.append('cmid',game.module_id);
    formData.append('activityid', activityid);
    formData.append('file', file, newFileName);
    console.log(game.username);
    console.log(game.module_id);
    var url = game.base_url+game.upload_file;
   
    try{
        console.log($('.loader_image_index'));
        $.ajax({
         xhr: function() {
             var xhr = new window.XMLHttpRequest();
             xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with upload progress here
                    // $(".progress-bar").css({"width":(percentComplete*100)+"%"});
                }
            }, false);

            return xhr;
         },
         url: url,
         type: "POST",           // Type of request to be send, called as method
         data: formData,         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
         contentType: false,     // The content type used when sending data to the server.
         cache: false,           // To unable request pages to be cached
         processData:false,      // To send DOMDocument or non processed data file it is set to false
         dataType: 'json',
         async: asycn, // next process wait untul this ajax finish
        beforeSend: function( xhr ) {
            console.log(xhr);
            $('.loader_image_index').show();
        },
        success: function(data) {
            $('.loader_image_index').hide();
            console.log(data);
             // if(data["status"] == "success"){
                callback(data);
             // }
        },error: function(data) {
            $('.loader_image_index').hide();
            console.log(data);
            // alert('Cannot request to server !');
            game.popupText('Cannot request to server !');
        }
     }); 
    }catch(e){
        // $('.loader_image_index').hide();
        console.log(e);
        alert(e);
    }
}

Game.prototype.requestGet = function(url, async = true, timeout = 20000, error_text = ''){
    var $this = this;
    console.log('requestGet');
    // if(url_ext != ''){
    //     if(url_ext == 1){
    //         // console.log(game.username);
    //         var username = $this.scorm_helper.getUsername();
    //         url += "&username="+username+"&module_id="+game.module_id+"&element_scoes_track=cmi.suspend_data";
    //     }
    // }
    console.log(url);
    console.log(async);
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
            async: async, // next process wait untul this ajax finish, if false become sync
            timeout: timeout,
            beforeSend: function( xhr ) {
                $('.loader_image_index').show();
            },
            success: function(data) {
                $('.loader_image_index').hide();
                console.log(data);
                // alert(JSON.stringify(data));
                res = data;
            },fail: function(data) {
                $('.loader_image_index').hide();
                console.log(data);
                res = data;
            },error: function (request, status, error) {
                $('.loader_image_index').hide();
                console.log(request);
                console.log(status);
                console.log(error);
                res = status;

                if(error_text == 0){

                }else if(error_text != ''){
                    alert(error_text);
                }else{
                    game.popupText(game.error_request_global);
                }
            }
        });
    }catch(e){
        console.log(e);
        alert('requestGet: '+e);
    } 

    return res;
}

Game.prototype.requestPost = function(url, async, formData = {}, error_text = ''){
    console.log('requestPost');
    // var formData = new FormData();
    // formData.append('user_id', game.username);
    // formData.append('search', game.module_id);
    // formData = {'search' : 'elim'};
    var res = '';
    try{
        $.ajax({
            url: url,
            type: "POST",           // Type of request to be send, called as method
            data: formData,         // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,     // The content type used when sending data to the server.
            cache: false,           // To unable request pages to be cached
            processData:false,      // To send DOMDocument or non processed data file it is set to false
            dataType: 'json',
            async: async, // next process wait untul this ajax finish, default false
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
    }catch(e){
        $('.loader_image_index').hide();
        console.log(e);
        alert('requestGet: '+e);
    } 

    return res;
}

Game.prototype.popupText = function(text, action = '') {
    // popup gagal karena masih ada data yang kosong
    $("#popupalert2 .tutorial .description .desc_text").html(text);
    $("#popupalert2 .tutorial").show();
    $("#popupalert2").modal("show");

    if(action != ''){

    }else{
        $("#popupalert2 .closealert").click(function(e){
            $("#popupalert2").modal("hide");
        });
    }
    // console.log("masih ada data yang kosong");
};

//duplicate data quiz, to it's array
Game.prototype.duplicateDataQuiz = function(res){
    console.log(res);
    var arr = res[0];
    // var res2 = [];
    // res2.push(res[0]);
     // console.log(res2);
    arr2 = [];
    for (var i = 1; i < game.total_challenge; i++) {
        var id = i+1;
        // var arr_data = arr['data'];
        arr_data_2 = [];
        // console.log(arr['data']);
        for (var j = 0; j < arr['data'].length; j++) {
            // console.log(arr['data'][j]);
            var id2 = (i * arr['data'].length)+(j+1);
            arr_data_2_2={
                'activityid': id2,
                'image': arr['data'][j]['image'],
                'label': arr['data'][j]['label'],
                'label_2': arr['data'][j]['label_2'],
                'question': arr['data'][j]['question'],
                'text': arr['data'][j]['text'],
                'type': arr['data'][j]['type'],
                'reviewer': arr['data'][j]['reviewer']
            };
            // arr['data'][j]['activityid'] = i * arr['data'].length + 1;
            arr_data_2.push(arr_data_2_2);
        }

        arr2 = {
            'id':id,
            'label':arr['label'],
            'image': arr['image'],
            'desc':arr['desc'],
            'data':arr_data_2
        };

        // console.log(arr2);
        res.push(arr2);
    }
   
    return res;
}
