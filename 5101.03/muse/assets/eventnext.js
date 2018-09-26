var sc_data;
var unloaded = false;
var curr_slide = 0;
var scorm = pipwerks.SCORM;
var lmsConnected;
var isLocal = false;
var onceClick = false;
audioButton = document.createElement('audio');
audioButton.setAttribute('src', 'assets/sound_button.wav');

$( document ).ready(function() {

  try{
    lmsConnected = scorm.init();  
  }catch(e){
    isLocal = true;
  }

  if(!isLocal){
    sus_data = scorm.get("cmi.suspend_data");
    sc_data = JSON.parse(sus_data);
  }

  if(sc_data == null){
    sc_data = {};
  }
  else{
    curr_slide = sc_data["curr_slide"];
  }
  
  $('.Button.btn_video').click(function(j){
    j.preventDefault();
    $("#video").show();
    $("video").get(0).play();

    $("#video .btn-close").click(function(o){
      o.preventDefault();
      $("video")[0].pause();
        $("video")[0].currentTime = 0;
      $("#video").hide();
    });
  });

    
    $(".Button.btn_popup_video").click(function(e){
        console.log("a");
        e.preventDefault();
        $("#popupAlert").css({"display":"table"});
        $("#popupAlert .popupalert-yes").click(function(h){
          $("#popupAlert .popupalert-yes").off();
          $("#popupAlert .popupalert-no").off();
          curr_slide = parseInt(curr_slide)+1;
          console.log("curr_slide : "+curr_slide);
          gotoSlide(curr_slide);
        });
        $("#popupAlert .popupalert-no").click(function(s){
          $("#popupAlert .popupalert-yes").off();
          $("#popupAlert .popupalert-no").off();
          $("#popupAlert").hide();
        });
    });

   $(".Button.btn_popup_assessment").click(function(e){
        console.log("tes");
        e.preventDefault();
        $("#popupAlert2").css({"display":"table"});
        $("#popupAlert2 .popupalert-assessment-yes").click(function(h){
          $(".Button.btn_popup_assessment").removeClass("Button");
          $("#popupAlert2 .popupalert-assessment-yes").off();
          $("#popupAlert2 .popupalert-assessment-no").off();
          curr_slide = parseInt(curr_slide) + 1;
          gotoSlide(curr_slide,$(this).attr("href"));
        });
        $("#popupAlert2 .popupalert-assessment-no").click(function(s){
          ("#popupAlert2 .popupalert-assessment-yes").off();
          $("#popupAlert2 .popupalert-assessment-no").off();
          $("#popupAlert2").hide();
        });
    });
    
    $(".pilihan").click(function(m){
      if (typeof onceClick4 === 'undefined' || onceClick4 === null) {
        onceClick4 = true;
        console.log("tes");
        $(".piilihan").off();
        $(this).addClass("active");
        $("#popupJawaban .modal_res_slider").addClass($(this).attr("index"));
        $("#popupJawaban").css({"display":"table"});
          $("#popupJawaban .start-game").click(function(h){
            curr_slide = parseInt(curr_slide) + 1;
            sc_data["curr_slide"] = curr_slide;
            sc_data["temp"]=1;

            scorm.set("cmi.suspend_data", JSON.stringify(sc_data));
            pipwerks.SCORM.save();
            $("#popupJawaban").css({"display":"none"});
            window.location="after_slide_choice.html";
          });
        }
    });
    

    $(".Button.next_page").click(function(e){ 
      $(".Button.next_page").removeClass("Button");
      e.preventDefault();
      $(this).off();
      
      curr_slide = parseInt(curr_slide)+1;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

     $(".Button.next_next_page").click(function(e){ 
      $(".Button.next_next_page").removeClass("Button");
      e.preventDefault();
      $(this).off();
      curr_slide = parseInt(curr_slide)+2;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

     $(".Button.next_next_next_page").click(function(e){
      $(".Button.next_next_next_page").removeClass("Button"); 
      e.preventDefault();
      $(this).off();
      curr_slide = parseInt(curr_slide)+3;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

    $(".Button.prev_page").click(function(e){ 
      $(".Button.prev_page").removeClass("Button"); 
      e.preventDefault();
      $(this).off();
      
      curr_slide = parseInt(curr_slide)-1;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

    $(".Button.prev_prev_page").click(function(e){ 
      $(".Button.prev_prev_page").removeClass("Button"); 
      e.preventDefault();
      $(this).off();
      
      audioButton.play();
      console.log(isLocal);

      
     curr_slide = parseInt(curr_slide)-2;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

    $(".Button.reset_page").click(function(e){ 
      $(".Button.reset_page").removeClass("Button"); 
      e.preventDefault();
      $(this).off();
      
      audioButton.play();
      console.log(isLocal);
      
      curr_slide = 0;
      gotoSlide(curr_slide,$(this).attr("href"));
    });

    function gotoSlide(slide,href){
      audioButton.play();
      console.log(isLocal);

      sc_data["curr_slide"] = slide;
      sc_data["temp"]=1;
      console.log("NEXT");
      console.log(sc_data);
      scorm.set("cmi.suspend_data", JSON.stringify(sc_data));
      pipwerks.SCORM.save();
    
      if(href != null && href != undefined && href != ""){
        window.location = href;
      }
      else{
        localStorage.setItem("tempSlide",slide);
        var milliseconds = new Date().getTime();
        window.location = "../index.html?cache="+milliseconds;
      }
    }

});