var Tebak2 = function(){

}

Tebak2.prototype.init = function(current_settings) {
  var $this = this;
     $this.current_settings = current_settings;
     $this.question_data = [];
     $this.curr_soal=0;
     $this.isAppend=0;
     $this.attemp=0;
     $this.count_benar=0;
     $this.curr_list_soal=1;
     $this.count_soal=0;     
     $this.isRandom = false;
     $this.modulreview = true;
     $this.arr_alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M"];
     $this.$pilihan_clone = $("#game_quiz_popup").find(".pilihan").first().clone();
    
    $this.setTutorial();
    /* console.log('current_settings');
     console.log($this.current_settings["slide"]);
     console.log('current_settings');*/
     
     $.get("config/setting_quiz_slide_"+$this.current_settings["slide"]+".json",function(e){
        //setting_quiz_slide_5.json
        $this.quiz = e;
        $this.question_data = e["list_question"];
        console.log('question_data di ambil dari json');
        console.log($this.question_data);
        console.log('question_data di ambil dari json');
        setTimeout(function(){
           $this.mulai_game();
        },1000);
     },'json');
     
     
};

Tebak2.prototype.setTutorial = function() {
  setTimeout(function() {
    $("#tutorial_tebak2 .tutorial.snake").addClass("done");
    $("#tutorial_tebak2 .tutorial.snake").addClass("active");
    $("#tutorial_tebak2").modal('show');
    $("#tutorial_tebak2 .tutorial.snake").find("div").first().slick({
        dots: true,
        infinite: false,
        speed: 500,
        prevArrow: false,
        nextArrow: false
    });
  
  },1000);  
    
  $("#tutorial_tebak2 .tutorial.snake").find(".start-game").click(function(e){
    $("#tutorial_tebak2").modal('hide');
   });
};

//START GAME
Tebak2.prototype.mulai_game = function() {
  var $this = this;
  var ldata = game.scorm_helper.getLastGame("game_slide_"+$this.current_settings["slide"]);
  game.temp = game.scorm_helper.getSingleData("temp");
  
  console.log('START ldata');
  console.log(ldata);
  console.log('START ldata');
  console.log('START GAME');
  console.log(game.temp);
  console.log(ldata["answer"]);
  
  console.log($this.question_data.length);
  console.log('START GAME');
   if(game.temp == 1 || 
      ldata["answer"]== undefined || 
    ldata["answer"]== null || 
    (game.temp == 0 && ldata["answer"].length < $this.question_data.length)
  ){
      console.log('START GAME IF');
       game.scorm_helper.setSingleData("temp",0);
       var sdata = game.scorm_helper.setQuizData("game_slide_"+$this.current_settings["slide"],$this.getQuestion(),ldata);

       $this.list_soal = sdata["list_question"];
       $this.curr_soal = sdata["answer"].length;
     
    console.log('START getQuestion');
    console.log($this.getQuestion());
    console.log('START getQuestion');
    console.log('START sdata');
    console.log(sdata);
    console.log('START sdata'); 
    
       $this.show_question();
   }
   else{
       game.debug("complete game");
       game.scorm_helper.setSingleData("temp",1);
       game.nextSlide();
   }
};

Tebak2.prototype.getQuestion = function() {
    var $this = this;
    var arr_quest = [];
    var arr_rand = [];
    var returnQuest = [];

    for (var i = 0; i < $this.question_data.length; i++) {
      arr_quest.push(i);
    }
  // console.log('question_data di ambil index dari element-nya');
  // console.log(arr_quest);
  // console.log('question_data di ambil index dari element-nya');
  if($this.isRandom == true || ($this.type == "popup" && $this.popupType == "random")){
      do{
        var rand = Math.ceil(Math.random()*(arr_quest.length-1));
        arr_rand.push(arr_quest[rand]);
        arr_quest.splice(rand,1);
      }while(arr_quest.length>0);

      returnQuest = arr_rand;
    }
    else{
      returnQuest = arr_quest;
    }

    var start = returnQuest.length-(returnQuest.length-$this.totalQuestion);
    var end = returnQuest.length-$this.totalQuestion;
    returnQuest.splice(start,end);

    return returnQuest;
};

Tebak2.prototype.show_question = function() {
   var $this = this;

   var $clone = $("#tutorial_tebak2");
   console.log('curr_list_soal');
   console.log(game.scorm_helper.getSingleData("curr_list_soal"));
   console.log('curr_list_soal');
   if(game.scorm_helper.getSingleData("curr_list_soal")!=undefined){
    $this.curr_list_soal = game.scorm_helper.getSingleData("curr_list_soal");
   }else{
    $this.curr_list_soal = 1;
   }
   
   // soal ke ? dari jumlah soal ?
   console.log('soal ke ? dari jumlah soal ?');
   console.log($this.curr_list_soal);
   console.log('soal ke ? dari jumlah soal ?');

   console.log('soal ke ? dari jumlah soal ?2');
   console.log($this.quiz);
   console.log($this.count_soal);
   console.log($this.quiz["num_quest"][$this.count_soal]);
   console.log('soal ke ? dari jumlah soal ?2');

   console.log('soal ke ? dari jumlah soal ?22');
   console.log($this.question_data[$this.list_soal[$this.curr_soal]]["type"]);
   console.log('soal ke ? dari jumlah soal ?22');

   $($clone).addClass($this.question_data[$this.list_soal[$this.curr_soal]]["type"]);
   $($clone).attr("curr_soal",$this.curr_soal);
   $clone.find(".curr_soal").html(parseInt($this.curr_list_soal));
   $clone.find(".total_soal").html($this.quiz["num_quest"][$this.count_soal]);
   
   $clone.find(".pilihan_wrapper").html("");
   $clone.find(".category_wrapper").html("");
   $(".drop_wrapper").html("");
   $(".drag_wrapper").html("");
   
  console.log('curr_soal type');
  console.log($this.question_data[$this.list_soal[$this.curr_soal]]["type"]);
  console.log('curr_soal type');
   
   // judul pertanyaan
   $clone.find(".text_question").html($this.question_data[$this.list_soal[$this.curr_soal]]["question"]);
   console.log('list_soal image');
   console.log($this.question_data[$this.list_soal[$this.curr_soal]]["image"]);
   console.log('list_soal image');
   $clone.find(".row.image").css("display","none");

   // soal2
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

   $this.setEvent($clone);
   
};


Tebak2.prototype.setEvent = function($clone) {
  var $this = this;
  console.log('list_soal curr_soal type');
  console.log($this.question_data[$this.list_soal[$this.curr_soal]]["type"]);
  console.log('list_soal curr_soal type');
  if($this.question_data[$this.list_soal[$this.curr_soal]]["type"] == "mc"){
    $clone.find(".btn-submit").hide();
    $clone.find(".pilihan").click(function(e){

      $clone.find(".pilihan").off();
      $($clone).find(".next-soal").show();

      if(!$(this).hasClass("active")){
        $(this).addClass("active"); 
      }
      else{
        $(this).removeClass("active");  
      }
      $this.cek_jawaban($clone,"mc");
    });
  }
  
  // $("#tutorial_tebak2").modal("show");

};

Tebak2.prototype.cek_jawaban = function($clone,$type) {
   var $this = this;
   var $flag=0;
   var count = 0;

   console.log('cek_jawaban type');
   console.log($type);
   console.log('cek_jawaban type');
   if($type != "dad"){
      $($clone).find(".pilihan").each(function(index){
         if($(this).hasClass("active")){
            console.log('hasClass = ' + $(this).hasClass("active"))
             $(this).removeClass("active");
             
             var $cek=1;
             for (var i = 0; i < $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length; i++) {
                 if($this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"][i] != $(this).attr("index")){
                     $cek=0;
                     break;
                 }
             }
              console.log('cek');
              console.log('cek = ' + $cek);
              console.log('cek');
             /*
             if($cek == 0){
              if($this.modulreview){
                 $(this).addClass("wrong");
              }
             }else{
               if($this.modulreview){
                 count++;
                 $(this).addClass("right");
               }
             } 
             */
             $(this).addClass("active"); 
         }
      });
    
      if(count == $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length){
         console.log('count if = ' + $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["jawaban"].length);
         $flag=0;
      }
   }
   //
   if($flag==0){
       var response = $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["question"];
       game.scorm_helper.pushAnswer(1,response);
       
       $this.curr_list_soal = parseInt($this.curr_list_soal)+1;
       $this.curr_soal = parseInt($this.curr_soal)+1;
       game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
   }
   else{
       var response = $this.question_data[$this.list_soal[parseInt($($clone).attr("curr_soal"))]]["question"];
       game.scorm_helper.pushAnswer(0,response);
       
       $this.curr_list_soal = parseInt($this.curr_list_soal)+1;
       $this.curr_soal = parseInt($this.curr_soal)+1;
       game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
   }
   //

   if($this.curr_list_soal != parseInt($this.quiz["num_quest"][$this.count_soal])+1){
      console.log('curr_list_soal if = ' + parseInt($this.quiz["num_quest"][$this.count_soal])+1)
      $clone.removeClass($type);
      var soalku = $this.curr_soal;
      if(soalku<2){
        console.log('soalku');
        console.log(soalku);
        console.log('soalku');
        $this.show_question();
      }else{
        console.log('selesai = ' + $this.curr_soal);
      }

      
    }else{
      console.log('curr_list_soal else = ' + parseInt($this.quiz["num_quest"][$this.count_soal])+1)
      //$clone.removeClass($type);
      //$("#tutorial_tebak2").modal("hide");
      /*$("#modal_slider").modal("show");
      $this.curr_list_soal = 1;
      $this.count_soal = parseInt($this.count_soal)+1;
      game.scorm_helper.setSingleData("curr_list_soal",$this.curr_list_soal);
      game.scorm_helper.setSingleData("count_soal",$this.count_soal);
      $this.setButton();*/
    }

   $(".button_next_page").addClass("active");
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}