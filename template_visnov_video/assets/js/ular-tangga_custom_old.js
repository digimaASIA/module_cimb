var UlarTanggaCustom = function(){
   
}
   
UlarTanggaCustom.prototype.init = function(current_settings) {
    console.log("ular-tangga");
    var $this = this;

    $this.current_settings = current_settings;
    $this.question_data = [];
    $this.curr_soal=0;
    $this.isAppend=0;
    $this.attemp=0;
    $this.count_benar=0;
    $this.curr_list_soal=1;
    $this.count_soal=0;     
    $this.isRandom = true;
    $this.modulreview = true;
    $this.feedback = false; //
    $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M"];
    $this.$pilihan_clone = $("#game_quiz_popup_ulartangga").find(".pilihan").first().clone();
    $this.drop = $(".drop").first().clone();
    $this.drag = $(".drag").first().clone();
    console.log(game.game_data);
    $this.game_data = game.game_data;
    $this.life = ($this.game_data["last_life"] != undefined ? $this.game_data["last_life"] : game.life_max);
    game.pause_timer_global = false;
    $this.hide_start_step = true;
    // $this.total_step = game.total_step;
    // game.game_data["curr_step"] = 5; //step ke-2
    // game.game_data["slide"] = 7;

    // game.game_data = {
    //   "category_game": "0",
    //   "curr_soal": "0",
    //   "curr_step": "5",
    //   "last_score": "7",
    //   "slide": "7",
    //   "total_answer_true": "1",
    //   "total_soal_current_slide": "1"
    // }

    $this.curr_step = game.game_data["curr_step"] != undefined ? game.game_data["curr_step"] : 0;
    // $this.curr_step = 2;
    $this.hide_icon_complete_bar = game.hide_icon_complete_bar;

    //step game
    $this.clone = $(".map_wrapper").clone();
    $this.clone_step = $($this.clone).find(".button.btn-1");
    $(".step_wrapper").html("");
    $this.start_step_clone = $(".button.start_state").clone();
    $this.finish_step_clone = $(".button.finish_state").clone();
    $(".start_step_wrapper").html("");
    $(".finish_step_wrapper").html("");

    $this.popup_slick = 0;

    // $.get("config/setting_quiz_slide_"+$this.current_settings["slide"]+".json",function(e){
    //     $this.quiz = e;
    //     $this.question_data = e["list_question"];
    //     $this.list_logo_quiz = e["logo_soal"];

        $.get("config/setting_ular_tangga_custom.json",function(e2){
          console.log(e2);

          $this.start_step = e2["start_step"];
          $this.finish_step = e2["finish_step"];
          $this.step_data = e2["list_step"];
          $this.total_step = $this.step_data.length;
          game.total_step = $this.total_step;
          $this.tutorial_data = e2["list_tutorial"];

          console.log($this.step_data);

          /*Function get total soal from all stage*/
            // $this.total_soal = 0;
            // console.log($this.total_step);
            // for (var i = 0; i < $this.total_step; i++) {
            //   let no = $this.current_settings["slide"] + (i+1);
            //   console.log("config/setting_quiz_slide_"+no+".json");
            //   $.get("config/setting_quiz_slide_"+no+".json",function(e3){
            //       $this.total_soal += e3["list_question"].length;
            //       console.log($this.total_soal);
            //       game.total_soal = $this.total_soal;
            //   },'json');
            //   console.log($this.total_soal);

            // }
          /*End function get total soal from all stage*/

          // if($this.arr_content[current]["slide"] == 3){
              if(game.time_global == true){
                  if(game.start_timer_global == 0){
                      game.startTimerGlobal();
                  }
              }else{
                  $(".timer").hide();
              }
          // }
          
          console.log(game.setting_global);
          console.log(game.setting_global["flag_tutorial_ular_tangga"]);
          if(game.setting_global["show_tutorial_ular_tangga"] == true && game.setting_global["flag_tutorial_ular_tangga"] == 0){
              // game.flag_tutorial_show = 1;
              game.setting_global["flag_tutorial_ular_tangga"] = 1;

              //show modal
              $this.setTutorial_ulartangga();

              $(".start-game-snake").click(function(){
                  $('.modal#tutorial').modal("hide");
                  $('.tutorial.mc').removeClass('active');
              });
          }else{
            
          }

          setTimeout(function(){
              $this.get_total_soal();
          },1000);
        },'json');
    // },'json');
 };

 /*Function get total soal from all stage*/
UlarTanggaCustom.prototype.get_total_soal = function() {
    var $this = this;
    $this.total_soal = game.total_soal;
    console.log($this.total_soal);

    if($this.total_soal == 0){
        for (var i = 0; i < $this.total_step; i++) {
          console.log(i);
          let no = $this.current_settings["slide"] + (i+1);
          const no_2 = i;
          console.log("config/setting_quiz_slide_"+no+".json");
          $.get("config/setting_quiz_slide_"+no+".json",function(e3){
              console.log(e3);
              console.log(game.scorm_helper.lmsConnected);
              // e3 = (game.scorm_helper.lmsConnected == true ? JSON.parse(e3) : e3);
              $this.total_soal += e3["list_question"].length;
              console.log($this.total_soal);
              game.total_soal = $this.total_soal;

              game.game_data["total_soal"] = game.total_soal;
              console.log($this.total_soal);
              console.log(($this.total_step-1));
              console.log(no_2);
              console.log(($this.total_step-1) == no_2);
              if(($this.total_step-1) == no_2){
                  $this.mulai_game_ulartangga();
              }
          },'json');
        }
    }else{
        $this.mulai_game_ulartangga();
    }
};
 

 UlarTanggaCustom.prototype.getQuestion_ulartangga = function() {
    var $this = this;
    var arr_quest = [];
    var arr_rand = [];
    var other = [];
    var returnQuest = [];

    for (var i = 0; i < $this.question_data.length; i++) {
      arr_quest.push(i);
    }

    if($this.isRandom == true || ($this.type == "popup" && $this.popupType == "random")){
      do{
        var rand = Math.ceil(Math.random()*(arr_quest.length-1));
        arr_rand.push(arr_quest[rand]);
        arr_quest.splice(rand,1);
      }while(arr_quest.length>0);

      if(!$this.modulreview){
        for (var j = 0; j < $this.question_data.length; j++) {
          if(j<game.total_soal){
            returnQuest.push(arr_rand[j]);
          }else{
            other.push(arr_rand[j]);
          }
        }
        game.scorm_helper.setSingleData("other",other);
      }else{
        returnQuest = arr_rand;
      }
    }
    else{
      if(!$this.modulreview){
        for (var j = 0; j < $this.question_data.length; j++) {
          if(j<game.total_soal){
            returnQuest.push(arr_quest[j]);
          }else{
            other.push(arr_quest[j]);
          }
        }
        game.scorm_helper.setSingleData("other",other);
      }else{
        returnQuest = arr_quest;
      }
    }

    var start = returnQuest.length-(returnQuest.length-$this.totalQuestion);
    var end = returnQuest.length-$this.totalQuestion;
    returnQuest.splice(start,end);

    return returnQuest;
};
 
//START GAME
UlarTanggaCustom.prototype.mulai_game_ulartangga = function() {
  var $this = this;

  //show header element
  $(".header").show();

  if(game.mode_life == true){
    /*call function show life*/
    $this.show_life();
    /*End call function show life*/
  }

   /*call function setProgressBar*/
   // $this.setProgresBar();
   /*call function setProgressBar*/

   /*Function show step*/
   $this.showStep();
   /*End function show step*/

  var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
  console.log(ldata);
  game.temp = game.scorm_helper.getSingleData("temp");

  game.scorm_helper.setSingleData("game_data", game.game_data);
  // console.log(game.scorm_helper.getSingleData('game_data'));

    // console.log($this.curr_step);
    // console.log(game.total_step);
   if($this.curr_step <= game.total_step){
       // game.scorm_helper.setSingleData("temp",0);
       // var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion_ulartangga(),ldata);
       // console.log(sdata);
       // $this.list_soal = sdata["list_question"];
       // $this.curr_soal = sdata["answer"].length;

       console.log($this.game_data);

       $this.setButton_ulartangga();
   }
   else{
       game.debug("complete game");
       game.scorm_helper.setSingleData("temp",1);
       game.setSlide(9);
   }
};

UlarTanggaCustom.prototype.setButton_ulartangga = function() {
  var $this = this;
  console.log($this.curr_step);
  if($this.curr_step !=undefined){
    $this.count_soal = $this.curr_step; //last soal
  }else{
    $this.count_soal = 0; //last soal
  }
    console.log($this.count_soal);


  $(".button").removeClass("active");
  $(".button.btn-"+parseInt($this.count_soal+1)).removeClass("disabled");
  $(".button.btn-"+parseInt($this.count_soal+1)).addClass("active");
  
  $this.curr_soal = $this.count_soal+1; //soal ke-n
  // $this.curr_soal = 2;
  // console.log($this.curr_soal);
  if($this.curr_soal!=0){
    $(".man").addClass("walk-"+$this.count_soal);
    $(".button").each(function(idx){
      // console.log($this.count_soal);
      // console.log(idx);
      // console.log($this.count_soal);
      if(idx<=$this.count_soal){
        if(idx!=0){
          if(!$(".man").hasClass("walk-"+idx)){
            $(".man").addClass("walk-"+idx);  
          }
          console.log($this.curr_soal);
          if(parseInt($this.curr_soal-1)>=0){
            // if($(".button.btn-"+parseInt($this.count_soal)).hasClass("disabled")){
            //   $(".button.btn-"+parseInt($this.count_soal)).removeClass("disabled");
            // }
            console.log(".button.btn-"+$this.count_soal);
            console.log($(".button.btn-"+$this.count_soal).hasClass("success"));
            $(".button.btn-"+idx).removeClass("disabled");
            if(!$(".button.btn-"+idx).hasClass("success") || !$(".button.btn-"+idx).hasClass("failed")){
                let find_array = -1; //variabel find array, default -1
                let class_add = 'success';
                if(game.game_data["failed_stage"] != undefined){
                  if(game.game_data["failed_stage"].length > 0){
                    let failed_stage = game.game_data["failed_stage"];
                    find_array = failed_stage.indexOf(idx);
                  }
                }

                if(find_array > -1){
                  class_add = 'failed';
                }
                $(".button.btn-"+idx).addClass(class_add);  
            }
          }
        }
        else{
          /*if($this.count_soal!=0){
            if(!$(".button.start_state").hasClass("disabled")){
              $(".button.start_state").addClass("disabled");  
            }
          }*/
        }
      }
    });
  }

  console.log($this.count_soal);
  $(".button.btn-"+parseInt($this.count_soal+1)).click(function(e){
    console.log($this.curr_step);
    console.log(game.total_step);
    console.log($this.curr_step != $this.total_step);
    if($this.curr_step != $this.total_step){
      $(this).off();
      // $this.show_question_ulartangga();
      // game.curr_step = $this.count_soal+1;
      console.log($this.game_data["slide"]);
      if($this.game_data["slide"] != undefined){
          game.setSlide(($this.game_data["slide"]+1));
      }else{
          game.nextSlide();
      }
    }
  });
  console.log($this.curr_soal);
  console.log($this.total_step);
  console.log(game.game_data);
  if($this.curr_soal > $this.total_step){
    console.log($this.count_soal);
    console.log(".button.btn-"+$this.count_soal);
    if(!$(".button.btn-"+$this.count_soal).hasClass("success") && !$(".button.btn-"+$this.count_soal).hasClass("failed")){

      // $(".button.btn-"+$this.count_soal).addClass("success");  
    }else{
      $(".button.finish_state").removeClass("disabled");
      $(".button.finish_state").addClass("active");
    }

    /*setTimeout(function(){
      $(".button.finish_state,.girl").addClass("active");
      game.nextSlide();      
    },1000);*/
    $(".button.finish_state, .girl").click(function(e){
      //$("#popupFinish").modal("show");
      $("#modal_feedback").modal("hide");
      $("#game_quiz_popup_ulartangga").modal("hide");
      game_data = $this.game_data;
      game.scorm_helper.setSingleData("game_data",game_data);
      game.setSlide(game.slide_result);
    });
  }
};
 
UlarTanggaCustom.prototype.show_question_ulartangga = function() {
  console.log("show_question_ulartangga");
   var $this = this;

   var $clone = $("#game_quiz_popup_ulartangga");
   if(game.scorm_helper.getSingleData("curr_list_soal")!=undefined){
    $this.curr_list_soal = game.scorm_helper.getSingleData("curr_list_soal");
   }else{
    $this.curr_list_soal = 1;
   }
   /*var $cloneQuizWrap = $clone.find(".question-wrapper").clone();
   $clone.find(".game_quiz_slider").html("");
   for(var i=0;i<$this.quiz["num_quest"][$this.curr_soal];i++){
    $clone.find(".curr_soal").html(i+1);
    $clone.find(".total_soal").html($this.quiz["num_quest"][$this.curr_soal]);
    $clone.find(".text_question").html($this.question_data[$this.list_soal[$this.curr_soal]]["question"]);
   }
   $("#game_quiz_popup").modal("show");
   $this.runSlick($(".game_quiz_slider"));*/
   $($clone).addClass($this.question_data[$this.list_soal[$this.curr_soal]]["type"]);
   $($clone).attr("curr_soal",$this.curr_soal);
   $clone.parent().find(".header_quiz").find("img").attr("src","assets/image/ular-tangga/"+$this.list_logo_quiz[$this.count_soal]);
   $clone.find(".curr_soal").html(parseInt($this.curr_list_soal));
   $clone.find(".total_soal").html($this.quiz["num_quest"][$this.count_soal]);
   
   $clone.find(".pilihan_wrapper").html("");
   $clone.find(".category_wrapper").html("");
   $(".drop_wrapper").html("");
   $(".drag_wrapper").html("");
   if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "dad"){
     $($this.drop).css({"display":"inline-block"});
     $($this.drag).css({"display":"inline-block"});
     $this.initDad($clone);
   }else{
     $clone.find(".text_question").html($this.question_data[$this.list_soal[$this.curr_soal]]["question"]);
     if($this.question_data[$this.list_soal[$this.curr_soal]]["image"]){
      $clone.find(".row.image").css("display","block");
      $clone.find(".row.image").attr("src","assets/image/ular-tangga/quiz-image/"+$this.question_data[$this.list_soal[$this.curr_soal]]["image"]);    
     }else{
      $clone.find(".row.image").css("display","none");
     }

     var arr = [];
     var arr_rand = [];

     for (var i = 0; i < $this.question_data[$this.list_soal[$this.curr_soal]]["pilihan"].length; i++) {
         arr.push(i);
     }

     for (var i = 0; i < $this.question_data[$this.list_soal[$this.curr_soal]]["pilihan"].length; i++) {
         var rand = Math.floor((Math.random() * (arr.length-1)));
         arr_rand.push(arr[rand]);
         arr.splice(rand, 1);
     }

     for (var i = 0; i < arr_rand.length; i++) {
         $app_pilihan = $this.$pilihan_clone.clone();

         $app_pilihan.find(".txt_pilihan").html($this.question_data[$this.list_soal[$this.curr_soal]]["pilihan"][arr_rand[i]]["text"]);
         $app_pilihan.attr("index",$this.question_data[$this.list_soal[$this.curr_soal]]["pilihan"][arr_rand[i]]["index"]);
         
         if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "mc"){
             $($app_pilihan).addClass("mc");
             $($app_pilihan).find(".bul_abjad").html($this.arr_alphabet[i]);
         }
         else if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "mmc"){
             $($app_pilihan).addClass("mmc");
         }

         $clone.find(".pilihan_wrapper").append($app_pilihan);
     }
      if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "dadsequence"){
         $clone.find(".pilihan_wrapper").sortable();
      }
      $this.setEvent($clone);
    }
};

UlarTanggaCustom.prototype.initDad = function(slider_content) {
  var $this = this;
  var start=0;
  var width=0;

  // get current soal
  var $current_soal = $this.question_data[$this.list_soal[$this.curr_soal]];

  $(slider_content).find(".row.image").css("display","none");

  var word = $current_soal["question"];
  for (var i = 0; i < $current_soal["jawaban"].length; i++) {
    var idx = word.toLowerCase().indexOf($current_soal["jawaban"][i].toLowerCase());
    
    if(idx!=0){
      var sub_str = word.substring(start, idx);
      $(slider_content).find(".drop_wrapper").append("<span>"+sub_str+"</span>");
    }

    var $clone_drop = $($this.drop).first().clone();
    $clone_drop.attr("index",i);
    $(slider_content).find(".drop_wrapper").append($clone_drop);

    if(width==0){
      width = $current_soal["jawaban"][i].length*8;
      width = width+40;
    }
    $clone_drop.css({"width":width+"px"});

    start = idx+($current_soal["jawaban"][i].length);
    
    if(start<word.length && i == $current_soal["jawaban"].length-1){
      var sub_str = word.substring(start, word.length);
      $(slider_content).find(".drop_wrapper").append("<span>"+sub_str+"</span>");
    }
  }

  for (var j = 0; j < $current_soal["pilihan"].length; j++) {
    var idx = -1;
    for (var k = 0; k < $current_soal["jawaban"].length; k++) {
      if($current_soal["pilihan"][j]["text"].toLowerCase() == $current_soal["jawaban"][k].toLowerCase()){
        idx = k;
        break;
      }
    }

    var $clone = $($this.drag).first().clone();
    $($clone).attr("index",idx);
    $($clone).find(".txt_drag").html($current_soal["pilihan"][j]["text"]);
    $($clone).css({"width":width+"px"});
    $(slider_content).find(".drag_wrapper").append($clone);
  }
  $(".drag").draggable({
    cursor: 'move',
    revert : function(event, ui) {
      if(!$this.isDrop){
        return true;
      }
      else{
        $(this).css({"top":"0","left":"0"});
      }
        },
    drag: function( event, ui ) {
      $(".drop").css({"z-index":0});
      $(this).parent().css({"z-index":1});
      $this.isDrop = false;
      $this.selectedDrag = $(this);
    }
    });

    $('.drop').droppable({
    drop: function( event, ui ) {
      $this.isDrop = true;
      if($(this).find(".drag").length>0){
        var target = $(this).find(".drag");
        $($clone).find(".drag_wrapper").append(target);
        $(this).append($this.selectedDrag); 
      }
      else{
        $(this).append($this.selectedDrag); 
      }
    }
  });
  $this.setEvent(slider_content);
};
 
UlarTanggaCustom.prototype.setEvent = function($clone) {
  var $this = this;

  if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "mc"){
    $clone.find(".btn-submit").hide();
    $clone.find(".btn-pass").hide();
    $clone.find(".pilihan").click(function(e){

      $clone.find(".pilihan").off();
      $($clone).find(".next-soal").show();

      if(!$(this).hasClass("active")){
        $(this).addClass("active"); 
      }
      else{
        $(this).removeClass("active");  
      }
      $this.cek_jawaban_ulartangga($clone,"mc");
    });
  }
  else if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "mmc"){
    $clone.find(".btn-submit").show();
    $clone.find(".btn-pass").hide();
    $clone.find(".pilihan").click(function(e){
      if(!$(this).hasClass("active")){
        $(this).addClass("active"); 
      }
      else{
        $(this).removeClass("active");  
      }
    });

    $($clone).find(".btn-submit").click(function(e){
      $(this).off();
      $clone.find(".pilihan").off();
      $this.cek_jawaban_ulartangga($clone,"mmc");
    });
  }else if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "dad"){
    $clone.find(".btn-submit").show();
    $clone.find(".btn-pass").hide();
    $($clone).find(".btn-submit").click(function(e){
      $(this).off();
      $this.cek_jawaban_ulartangga($clone,"dad");
    });
  }else if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "dadsequence"){
    $clone.find(".btn-submit").show();
    $clone.find(".btn-pass").hide();
    $($clone).find(".btn-submit").click(function(e){
      $(this).off();
      $clone.find(".pilihan_wrapper").sortable("disable");
      $this.cek_jawaban_ulartangga($clone,"dadsequence");
    });
  }

  $("#game_quiz_popup_ulartangga").modal({backdrop: 'static',keyboard: true,show: true});
  //$this.runSlick($(".game_quiz_slider"));
};

UlarTanggaCustom.prototype.runSlick = function(elem) {
  elem.slick({
      dots: true,
      infinite: false,
      speed: 500
  });
};
 
UlarTanggaCustom.prototype.prev = function(prev) {
   var $this = this;
   if(prev){
       $( ":mobile-pagecontainer" ).pagecontainer( "change", prev, {
           transition: "slide",
           reverse: true
       });
   }
};
 
UlarTanggaCustom.prototype.next = function() {
   var $this = this;
   var next = $(".ui-page-active").jqmData("next");

   $(".button_next_page").removeClass("active");
   var $this = this;

   if($this.curr_soal == $this.list_soal.length){
       game.nextSlide();
   }
   else{
       game.next(next);	
   }
   
};

UlarTanggaCustom.prototype.cek_jawaban_ulartangga = function($clone,$type) {
   var $this = this;
   var $flag=0;
   var count = 0;

   if($type != "dad"){
      $($clone).find(".pilihan").each(function(index){
         if($(this).hasClass("active")){
             $(this).removeClass("active");
             
             var $cek=1;
             for (var i = 0; i < $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length; i++) {
                 if($this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"][i] != $(this).attr("index")){
                     $cek=0;
                     break;
                 }
             }

             if($cek == 0){
                $(this).addClass("wrong");
             }
             else{
                count++;
                $(this).addClass("right");
             }	
         }
      });

      if(count == $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length){
         $flag=0;
      }
      else{
        $($clone).find(".pilihan").each(function(e){
           if($type != "dadsequence"){
             $flag=1;
             if(!$this.modulreview){
               for (var i = 0; i < $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length; i++) {
                   if($this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"][i] != $(this).attr("index")){
                       $(this).removeClass("right");
                       $(this).addClass("wrong");
                       $($clone).find(".num_pilihan.point-"+$(this).attr("index")).addClass("wrong");
                       $(this).find(".bul_ceklis").addClass("glyphicon-remove");
                   }else{
                       $(this).removeClass("wrong");
                       $(this).find(".bul_ceklis").removeClass("glyphicon-remove");
                       $(this).addClass("right");
                       $($clone).find(".num_pilihan.point-"+$(this).attr("index")).addClass("right");
                       break;
                   }
               }
             }
           }else{
             if($(this).attr("index") != $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"][e]){
               $flag=1;
             }
             if(!$this.modulreview){
               $clone.find(".pilihan_wrapper").html("");
               for (var i = 0; i < $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length; i++) {
                 $app_pilihan = $this.$pilihan_clone.clone();
                 $app_pilihan.find(".txt_pilihan").html($this.question_data[$this.curr_soal]["pilihan"][$this.question_data[$this.curr_soal]["jawaban"][i]]["text"]);
                 $clone.find(".pilihan_wrapper").append($app_pilihan);
               }
             }
           }
       });
      }
   }else{
    $($clone).find(".drop").each(function(e){
      if($(this).attr("index") != $(this).find(".drag").attr("index")){
        $flag=1;
      }
    });

    if(!$this.modulreview){
      $(".ui-page-active .drag").each(function(e){
        $($clone).find(".drag_wrapper").append($(this));
      });

      $($clone).find(".drop").each(function(e){
        var $that = $(this);
        $(".drag").each(function(f){
          if($that.attr("index") == $(this).attr("index")){
            $($that).html($(this));
          }
        });
      });
    }
    else{
      $($clone).find(".drop").each(function(e){
        $(this).find(".drag").addClass("right");
      });
    }
   }

   $("#modal_feedback").find(".modal_feedback").removeClass("salah");
   $("#modal_feedback").find(".modal_feedback").removeClass("benar");
   $("#modal_feedback").find(".modal_feedback .description p").html($this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["feedback"]);
       
   if($flag==0){
       var response = $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["question"];
       game.scorm_helper.pushAnswer(1,response);
       if(!$this.modulreview){
        game.audio.audioBenar.play();
        $(".alert").addClass("benar");
       }
       $("#modal_feedback").find(".modal_feedback").addClass("benar");
       $this.curr_list_soal = parseInt($this.curr_list_soal)+1;
       $this.curr_soal = parseInt($this.curr_soal)+1;
       game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
   }
   else{
       var response = $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["question"];
       if(!$this.modulreview){
         game.audio.audioSalah.play();
         $(".alert").addClass("salah");
         var arr_temp_soal = game.scorm_helper.getSingleData("other");
         $this.list_soal.splice($this.curr_soal,0,arr_temp_soal[0]);
         var temp2 = $this.list_soal[$this.list_soal.length-1];
         $this.list_soal.splice($this.list_soal.length-1,1);

         arr_temp_soal.splice(0,1);
         arr_temp_soal.push(temp2);

         game.scorm_helper.setSingleData("other",arr_temp_soal);
         game.scorm_helper.setUlangQuest($this.list_soal);
       }else{
        game.scorm_helper.pushAnswer(0,response);       
        $this.curr_soal = parseInt($this.curr_soal)+1;
       }
       $this.curr_list_soal = parseInt($this.curr_list_soal)+1;
       game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
       $("#modal_feedback").find(".modal_feedback").addClass("salah");
   }
  if($this.curr_list_soal != parseInt($this.quiz["num_quest"][$this.count_soal])+1){
    if(!$this.modulreview){
      setTimeout(function(){
        $clone.removeClass($type);
        $(".alert").removeClass("salah");
        $(".alert").removeClass("benar");
        if($this.feedback){
          $("#modal_feedback").modal({backdrop: 'static',keyboard: true,show: true});
          $("#game_quiz_popup_ulartangga").modal("hide");
          $("#modal_feedback").find(".btn-standard--submit").click(function(e){
            $(this).off();
            $("#modal_feedback").modal("hide");
            $("#game_quiz_popup_ulartangga").modal({backdrop: 'static',keyboard: true,show: true});
            $this.show_question_ulartangga();
          });
        }else{
          $this.show_question_ulartangga();
        }
      },800);
    }else{
      if($this.feedback){
        $("#modal_feedback").modal({backdrop: 'static',keyboard: true,show: true});
        $("#game_quiz_popup_ulartangga").modal("hide");
        $("#modal_feedback").find(".btn-standard--submit").click(function(e){
          $(this).off();
          $("#modal_feedback").modal("hide");
          $("#game_quiz_popup_ulartangga").modal({backdrop: 'static',keyboard: true,show: true});
          $clone.removeClass($type);
          $this.show_question_ulartangga();
        });
      }else{
        $clone.removeClass($type);
        $this.show_question_ulartangga();
      }
    }
  }else{
    if(!$this.modulreview){
      setTimeout(function(){
        $($this.curr_card).hide();
        $clone.removeClass($type);
        $(".alert").removeClass("salah");
        $(".alert").removeClass("benar");
        $("#game_quiz_popup_ulartangga").modal("hide");
        if($this.feedback){
          $("#modal_feedback").modal({backdrop: 'static',keyboard: true,show: true});
          $("#modal_feedback").find(".btn-standard--submit").click(function(e){
            $(this).off();
            $("#modal_feedback").modal("hide");
            $this.curr_list_soal = 1;
            if($flag == 0){
              $this.count_soal = parseInt($this.count_soal)+1;
            }
            game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
            game.scorm_helper.setSingleData("count_soal",$this.count_soal);
            $this.setButton_ulartangga();
          });
        }else{
          $this.curr_list_soal = 1;
          if($flag == 0){
            $this.count_soal = parseInt($this.count_soal)+1;
          }
          game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
          game.scorm_helper.setSingleData("count_soal",$this.count_soal);
          $this.setButton_ulartangga();
        }
      },800);
    }else{
      $clone.removeClass($type);
      if($this.feedback){
        $("#modal_feedback").modal({backdrop: 'static',keyboard: true,show: true});
        $("#game_quiz_popup_ulartangga").modal("hide");
        $("#modal_feedback").find(".btn-standard--submit").click(function(e){
          $(this).off();
          $("#modal_feedback").modal("hide");
          $this.curr_list_soal = 1;
          $this.count_soal = parseInt($this.count_soal)+1;
          game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
          game.scorm_helper.setSingleData("count_soal",$this.count_soal);
          $this.setButton_ulartangga();
        });
      }else{
        $("#game_quiz_popup_ulartangga").modal("hide");
        $this.curr_list_soal = 1;
        $this.count_soal = parseInt($this.count_soal)+1;
        game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
        game.scorm_helper.setSingleData("count_soal",$this.count_soal);
        $this.setButton_ulartangga();
      }
    }
  }

   $(".button_next_page").addClass("active");
};

UlarTanggaCustom.prototype.setTutorial_ulartangga = function() {
  var $this = this;
  // $this.popup_slick = 1;
  if($this.popup_slick == 1){
      $elementModal = $("#popupList");
      $this.cloneLogoImage = $("#popupList .logo_image img").first().clone();
      $this.cloneWrapper = $("#popupList .point_wrapper").first().clone();
      $elementModal.find(".logo_image").html("");
      $elementModal.find(".slider_wrapper").html("");

      // $this.countSlide = $this.tutorial_data.length;
      // if($this.listSlider[parseInt($(this).attr("index"))]["image_logo"]){
      //  $elementModallogo_image").find("img").attr("src","assets/image/slider/"+$this.listSlider[parseInt($(this).closest(".list_slider").attr("data-slick-index"))]["click_and_show_image"][parseInt($(this).attr("index"))]["image_logo"]);
      //  $elementModal.find(".logo_image").show();
      // }else{
      //  $elementModal.find(".logo_image").hide();
      // }

      /*Generate content to tutorial*/
        console.log($this.tutorial_data);
        if ($this.tutorial_data.length > 0) {
          $elementModal.find(".slider_wrapper").html("");
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

            $elementModal.find(".slider_wrapper").append(cWrapper);
          }
        }
      /*End generate content to tutorial*/

      $(".title.text_danger").hide();
      $elementModal.modal({backdrop: 'static',keyboard: true,show: true});
      // console.log($(this)[0]["tutorial_data"]);

      $this.sliderPopup($elementModal);

      $elementModal.find(".btn-standard--submit").click(function(e){
        // $this.startGameTimer();
        game.audio.audioButton.play();
            $elementModal.modal('hide');
            //remove slide slider wrapper, if slick call again slider old not appear
            $elementModal.find(".slider_wrapper .slick-track").remove();
      });

  }else{
      $("#tutorial .tutorial.snake").addClass("done");
      $("#tutorial .tutorial.snake").addClass("active");
      $("#tutorial").modal({backdrop: 'static',keyboard: true,show: true});
      $("#tutorial .tutorial.snake").find("div").first().slick({
          dots: true,
          infinite: false,
          speed: 500,
          prevArrow: false,
          nextArrow: false
      });
      $("#tutorial .tutorial.snake").find(".start-game-snake").click(function(e){
        $("#tutorial").modal('hide');
      });
  }
};

UlarTanggaCustom.prototype.show_life = function() {
    console.log("show_life");
    var $this = this;
    var count_star = 0;
    $(".header .star-wrapper").show();
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


UlarTanggaCustom.prototype.setProgresBar = function() {
  var $this = this;
  console.log($this.curr_step);
  console.log($this.total_step);
  var percent = ($this.curr_step / $this.total_step * 100);
  // percent = 100;
  $(".progress-bar").css("width",percent+"%");

  /*Function setting css progress-bar*/
    if(percent == 0){
        $(".complete_bar .progress-value").css("right", "-5.4vw");
    }
  /*End function setting css progress-bar*/

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

  //hide icon complete bar
  if($this.hide_icon_complete_bar == true){
      $(".progress-value .fa").hide();
  }
}

UlarTanggaCustom.prototype.showModal = function() {
    console.log('showModal');
    var $this = this;
    console.log($this.category_game);
    // if($this.category_game == 3 || $this.category_game == 4){
    //     $('.tutorial.dad .animated.fadeIn').html("Kali ini, kamu hanya diberikan <b>waktu 1 menit</b> dan <b>3 kesempatan salah</b>! Kamu siap?");
    // }
    
    $('.modal#tutorial').modal("show");
    $('.tutorial.mc').addClass('active');
};

UlarTanggaCustom.prototype.showStep = function(){
  var $this = this;

  let clone = $this.clone;
  let clone_step = $this.clone_step;
  let start_step_clone = $this.start_step_clone;
  let finish_step_clone = $this.finish_step_clone;
  clone_step = $(clone_step).removeClass("btn-1");

  //generate start step
  if($this.hide_start_step != true){
      $(start_step_clone).find(".idle").attr("src","assets/image/ular-tangga/"+$this.start_step["image"]);
      $(start_step_clone).css($this.start_step["style"]);
      console.log(start_step_clone);
      $(".start_step_wrapper").append(start_step_clone);
  }else{
      $(".start_step_wrapper").hide();
  }

  //generate finsih step
  $(finish_step_clone).find(".idle").attr("src","assets/image/ular-tangga/"+$this.finish_step["image"]);
  $(finish_step_clone).css($this.finish_step["style"]);
  console.log(finish_step_clone);
  $(".finish_step_wrapper").append(finish_step_clone);

  console.log($this.step_data);
  for (var i = 0; i < $this.step_data.length; i++) {
      let clone_step_2 = $(clone_step).clone();
      $(clone_step_2).addClass("btn-"+(i+1));
      if(i != 0){
        $(clone_step_2).addClass("disabled");
      }
      $(clone_step_2).find(".idle").attr("src","assets/image/ular-tangga/"+$this.step_data[i]["image"]);
      $(clone_step_2).find(".success").attr("src","assets/image/ular-tangga/"+$this.step_data[i]["image_2"]);
      $(clone_step_2).find(".locked").attr("src","assets/image/ular-tangga/"+$this.step_data[i]["image_3"]);
      $(clone_step_2).find(".failed").attr("src","assets/image/ular-tangga/"+$this.step_data[i]["image_4"]);
      $(clone_step_2).css($this.step_data[i]["style"]);

      console.log(clone_step_2);
      $(".step_wrapper").append(clone_step_2);
  }
  // $(".")

  //setting show hide step connector
  if(game.hide_step_connector == true){
      $(".button").removeClass("change");
  }
};

UlarTanggaCustom.prototype.sliderPopup = function($elementModal) {
  var $this = this;

  $elementModal.find(".slider_wrapper").not('.slick-initialized').slick({
    slidesToShow: 1,
    dots: true,
        infinite: false,
        speed: 500,
        arrows: false,
        variableWidth: true
  });

  $elementModal.find(".slider_wrapper").on("afterChange", function(event, slick, currentSlide, nextSlide){
    //  if(currentSlide+1 == $this.countSlide){
    //    $("#popupList-2 .button_wrapper").show();
    //  }else{
    //    $("#popupList-2 .button_wrapper").hide();
    //  }

    console.log("currentSlide: "+currentSlide);
    $elementModal.find(".logo_image img").hide();
    $elementModal.find("#logo_image-"+currentSlide).show();
  });

  console.log($elementModal.find(".slider_wrapper"));
  console.log($elementModal.find(".slider_wrapper")[0]);
  $elementModal.find(".slider_wrapper")[0].slick.refresh();

  $('.modal').on('shown.bs.modal', function (e) {
    $elementModal.find(".slider_wrapper").resize();
  });
};