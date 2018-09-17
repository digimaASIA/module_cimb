var quizCheckList = function(){
    this.avaPrev = false;
    game.isStartGame = true;
}

quizCheckList.prototype.initialize = function(ldata, par1 = []) {
    console.log('setupSlider initialize');
    var $this = this;

    var current = game.scorm_helper.getCurrSlide();
    // var mode_review = localStorage.getItem("mode_review");
    // console.log("mode_review: "+mode_review);
    // if(mode_review == 1){
    //     game.setSlide(6);
    // }
    // current = 6;
    console.log(current);
    // if(current == 0){
    //     /*show modal in index.html*/
    //     console.log($(".modal-tutorial"));
    //     $(".modal-tutorial").addClass("open");
    //     game.openModal('modal-tutorial');
    //     /*end show modal in index.html*/
    // }

    if(current == 6){
        game.get_challenge();
    }

    var divisi_game = false;
    if(divisi_game){
        var arr_badge_division = [];
        $.get('config/setting_quiz_division.json', function(response) {
            arr_badge_division = response;
            if(ldata!=undefined && ldata!=null){
                var data = ldata["list"];
                $("#content").attr("class",ldata["classContent"]);
                $(".dynamic_ribbon").html(ldata["ribbon"]);

                // clone
                var clone_item  = $(".item").first().clone();
                // var clone_modal = $(".owl-carousel2 #item_modal_1").first().clone();
                // console.log(clone_modal);
                var clone_btn = $(".dynamic_button a").first().clone();
                // kosongkan
                $(".owl-carousel").html("");
                $(clone_item).find(".dynamic_button").html("");
                // set ava image
                if(data[0]["image"]){
                    $(".ava img").attr("src","assets/images/"+data[0]["image"]);
                }

                // set title of page
                // console.log(ldata);
                if(ldata["text_header"] != undefined){
                    // console.log($(clone_item).find(".dynamic_text_header"));
                    $(clone_item).find(".dynamic_text_header").html(ldata["text_header"]);
                    // console.log($(clone_item).find(".dynamic_text_header"));
                }

                // set item slider
                for (var i = 0; i < data.length; i++) {
                  var clone = $(clone_item).clone();
                  var clone2 = $(clone_modal).clone();
                    
                    if(data[i]["image2"]!=undefined){
                        $(clone).find(".dynamic_img").last().attr("src","assets/images/"+data[i]["image2"]);
                    }

                    if(data[i]["image"]){
                        if(data[i]["image"]!="false"){
                            $(clone).find(".video_content").remove();
                            $(clone).attr("data-avatar",data[i]["image"]);
                            $(clone).find(".dynamic_img").first().attr("src","assets/images/"+data[i]["image"]);
                        }else{
                            $(clone).find(".video_content").remove();
                            $(clone).find(".image").remove();
                            $(clone).find(".caption").css("height","100%");
                        }
                    }
                    else{
                        $(clone).find(".dynamic_cover").attr("src","assets/images/"+data[i]["cover_video"]);
                        $(clone).addClass("video_wrapper");
                        $(clone).find(".img_wrapper span").css({"vertical-align":"middle"});
                        $(clone).find(".dynamic_img").first().hide();
                        $("video source").attr('src',"assets/video/"+data[i]["video"]);
                        $("video")[0].load();

                        $(clone).find(".video_content").click(function(e){
                            if(!$(".modal-video").hasClass("open")){
                                $(".modal-video").addClass("open");
                                $("video")[0].play();
                            }
                        });

                        $(".modal-video .btn-close").click(function(e){
                            $(".modal-video").removeClass("open");
                            $("video")[0].pause();
                        });
                        
                    }
                  
                  if(data[i]["avaClick"]){
                    console.log("avaClick");
                    /*$(clone).find(".dynamic_img").attr("onclick","game.setSlide("+parseInt(data[i]["avaClick"])+");");*/            
                    $(clone).find(".dynamic_img").first().attr("onclick","game.openModal('modal-alert-slider');");
                    $(clone).find(".dynamic_img").last().attr("onclick","game.openModal('modal-alert-slider');");
                    $(clone).find(".dynamic_img").last().click(function(e){
                        $(clone).find(".dynamic_img").first().parents().css("z-index","99");
                        $(clone).find(".dynamic_img").last().hide();
                    });
                    $(clone).find("#division").click(function(e){
                        console.log('division');
                    });
                  }
                 
                  if(data[i]["text"] == undefined){
                     $(clone).find(".text-box").hide();
                  }else{
                    //set text in json file key and class dynamic_text
                    // console.log(clone);
                    // $(clone).find(".dynamic_text").html(data[i]["text"]);
                    if(data[i]["text"].indexOf("[first name]") != -1){
                        var txt_name = data[i]["text"];
                        var name = game.scorm_helper.getName();
                        var firstname = name.split(", ");
                        var real_name = txt_name.replace("[first name]","<span style='color:blue;'>"+firstname[1]+"</span>");
                        $(clone).find(".dynamic_text").html(real_name);
                    }else{
                        $(clone).find(".dynamic_text").html(data[i]["text"]);
                    }
                  }
                    if(data[i]["label"]){
                        $(clone).find(".dynamic_label").html(data[i]["label"]);
                    }
                    else{
                        $(clone).find(".dynamic_label").remove();
                    }

                    if(data[i]["button"]){
                        for (var j = 0; j<data[i]["button"].length; j++) {
                            var clone2 = $(clone_btn).clone();
                            $(clone2).html(data[i]["button"][j]["text"]);
                            if(j>0 && j==data[i]["button"].length - 1){
                                $(clone2).addClass("btn-grey");
                                $(clone2).removeClass("btn-secondary");                           
                            }
                            if(typeof data[i]["button"][j]["class"] != "undefined"){
                                $(clone2).addClass(data[i]["button"][j]["class"]);
                            }

                            if(!data[i]["video"]){
                                if(data[i]["button"][j]["gotoSlide"] != ""){
                                    if(data[i]["button"][j]["gotoSlide"] < 0){
                                        $(clone2).attr("onclick","closeWindows()");
                                    }else{
                                        $(clone2).attr("onclick","game.setSlide("+data[i]["button"][j]["gotoSlide"]+")");
                                    }    
                                }                    
                            }
                            else{
                                $(clone2).attr("onclick","game.openModal('modal-alert-video');");
                            }
                            
                            $(clone).find(".dynamic_button").append(clone2);
                        }
                    }

                    //content owl-carousel-2
                    // if(data[i]["image_modal"]){
                    //     if(data[i]["image_modal"]!="false"){
                    //         // $(clone).find(".video_content").remove();
                    //         // $(clone).attr("data-avatar",data[i]["image"]);
                    //         console.log("assets/images/"+data[i]["image_modal"]);
                    //         console.log($(clone2).find(".dynamic_img_modal").first());
                    //         $(".dynamic_img_modal").first().attr("src","assets/images/"+data[i]["image_modal"]);
                    //         console.log($(clone2).find(".dynamic_img_modal").first());
                    //     }
                    // }

                    //check arr badge division
                    console.log(arr_badge_division);

                    $(".owl-carousel").append(clone);
                    // $(".owl-carousel2").append('test');

                    $(".btn-exit").click(function(e){
                        console.log("btn-exit click");
                        game.audio.audioButton.play();
                        var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
                        btn_back.click();
                    });
                }

                //set content modal
                if(ldata["list_2"] != undefined){
                    var data2 = ldata["list_2"];
                    for (var i = 0; i < data2.length; i++) {
                        var id = data2[i]["id"];
                        var clone_modal = $(".owl-carousel2 #item_modal_"+id).first().clone();
                        $("#owl-carousel2_"+data2[i]['id']).html("");
                        // console.log(clone_modal);
                        var clone2 = $(clone_modal).clone();
                        // console.log(clone2);
                        // console.log(clone2[0]['outerHTML']);
                         //content owl-carousel-2
                        if(data2[i]["image"]){
                            if(data2[i]["image"]!="false"){
                                // console.log(".dynamic_img_modal_"+id);
                                $(clone2).find(".dynamic_img_modal_"+id).first().attr("src","assets/images/"+data2[i]["image"]);
                                // console.log(clone2.find(".dynamic_img_modal_"+id));
                            }
                        }

                        if(data2[i]["text"] == undefined){
                            $(clone2).find(".dynamic_text_modal_"+id).hide();
                        }else{
                            $(clone2).find(".dynamic_text_modal_"+id).html(data2[i]["text"]);
                        }

                        if(data2[i]["image2"]){
                            if(data2[i]["image2"]!="false"){
                                $(clone2).find(".dynamic_img_modal2_"+id).first().attr("src","assets/images/"+data2[i]["image2"]);
                            }
                        }

                        if(data2[i]["text2"] == undefined){
                            $(clone2).find(".dynamic_text_modal2_"+id).hide();
                        }else{
                            // console.log($(clone2).find(".dynamic_text_modal2_"+id))
                            $(clone2).find(".dynamic_text_modal2_"+id).html(data2[i]["text2"]);
                        }

                        // console.log(clone2);
                        $("#owl-carousel2_"+id).append(clone2);
                    }
                }
            }
        }, 'json');
    }else{
        var slider_prev_next = true;
        if(ldata!=undefined && ldata!=null){
            var data = ldata["list"];
            $("#content").attr("class",ldata["classContent"]);
            $(".dynamic_ribbon").html(ldata["ribbon"]);

            if(ldata["slider_prev_next"] != undefined && ldata["slider_prev_next"] == false){
                slider_prev_next = false;
            }
            // clone
            var clone_item  = $(".item").first().clone();
            // var clone_modal = $(".owl-carousel2 #item_modal_1").first().clone();
            // console.log(clone_modal);
            var clone_btn = $(".dynamic_button a").first().clone();
            // kosongkan
            $(".owl-carousel").html("");
            $(clone_item).find(".dynamic_button").html("");
            // set ava image
            if(data[0]["image"]){
                $(".ava img").attr("src","assets/images/"+data[0]["image"]);
            }

            // set title of page
            // console.log(ldata);
            if(ldata["text_header"] != undefined){
                // console.log($(clone_item).find(".dynamic_text_header"));
                $(clone_item).find(".dynamic_text_header").html(ldata["text_header"]);
                // console.log($(clone_item).find(".dynamic_text_header"));
            }

            // set item slider
            for (var i = 0; i < data.length; i++) {
              var clone = $(clone_item).clone();
              var clone2 = $(clone_modal).clone();
                
                if(data[i]["image2"]!=undefined){
                    $(clone).find(".dynamic_img").last().attr("src","assets/images/"+data[i]["image2"]);
                }

                if(data[i]["image"]){
                    if(data[i]["image"]!="false"){
                        $(clone).find(".video_content").remove();
                        $(clone).attr("data-avatar",data[i]["image"]);
                        $(clone).find(".dynamic_img").first().attr("src","assets/images/"+data[i]["image"]);
                    }else{
                        $(clone).find(".video_content").remove();
                        $(clone).find(".image").remove();
                        $(clone).find(".caption").css("height","100%");
                    }
                }
                else if(data[i]["video"]){
                    $(clone).find(".dynamic_cover").attr("src","assets/images/"+data[i]["cover_video"]);
                    $(clone).addClass("video_wrapper");
                    $(clone).find(".img_wrapper span").css({"vertical-align":"middle"});
                    $(clone).find(".dynamic_img").first().hide();
                    $("video source").attr('src',"assets/video/"+data[i]["video"]);
                    $("video")[0].load();

                    $(clone).find(".video_content").click(function(e){
                        if(!$(".modal-video").hasClass("open")){
                            $(".modal-video").addClass("open");
                            $("video")[0].play();
                        }
                    });

                    $(".modal-video .btn-close").click(function(e){
                        $(".modal-video").removeClass("open");
                        $("video")[0].pause();
                    });
                    
                }
              
              if(data[i]["avaClick"]){
                console.log("avaClick");
                /*$(clone).find(".dynamic_img").attr("onclick","game.setSlide("+parseInt(data[i]["avaClick"])+");");*/            
                $(clone).find(".dynamic_img").first().attr("onclick","game.openModal('modal-alert-slider');");
                $(clone).find(".dynamic_img").last().attr("onclick","game.openModal('modal-alert-slider');");
                $(clone).find(".dynamic_img").last().click(function(e){
                    $(clone).find(".dynamic_img").first().parents().css("z-index","99");
                    $(clone).find(".dynamic_img").last().hide();
                });
                $(clone).find("#division").click(function(e){
                    console.log('division');
                });
              }
             
              if(data[i]["text"] == undefined || data[i]["text"] == false){
                 $(clone).find(".text-box").hide();
              }else{
                //set text in json file key and class dynamic_text
                // console.log(clone);
                // $(clone).find(".dynamic_text").html(data[i]["text"]);

                if(data[i]["text"].indexOf("[first name]") != -1){
                    var txt_name = data[i]["text"];
                    var name = game.scorm_helper.getName();
                    var firstname = name.split(", ");
                    var real_name = txt_name.replace("[first name]","<span style='color:blue;'>"+firstname[1]+"</span>");
                    $(clone).find(".dynamic_text").html(real_name);
                }else{
                    $(clone).find(".dynamic_text").html(data[i]["text"]);
                }
              }
                if(data[i]["label"]){
                    $(clone).find(".dynamic_label").html(data[i]["label"]);
                }
                else{
                    $(clone).find(".dynamic_label").remove();
                }

                if(data[i]["button"]){
                    for (var j = 0; j<data[i]["button"].length; j++) {
                        var clone2 = $(clone_btn).clone();
                        $(clone2).html(data[i]["button"][j]["text"]);

                        console.log(data[i]["button"]["type"]);
                        if(typeof(data[i]["button"][j]["type"]) != undefined){
                            console.log(data[i]["button"][j]["type"]);
                            if(data[i]["button"][j]["type"] == "waiting"){
                                $(clone2).addClass("btn-waiting");
                                $(clone2).removeClass("btn-secondary");
                            }
                        }

                        if(j>0 && j==data[i]["button"].length - 1){
                            $(clone2).addClass("btn-grey");
                            $(clone2).removeClass("btn-secondary");                           
                        }

                        // console.log(data[i]["button"][j]["class"]);
                        if(typeof data[i]["button"][j]["class"] != "undefined"){
                            // console.log(clone2);
                            // console.log(data[i]["button"][j]["class"]);
                            $(clone2).addClass(data[i]["button"][j]["class"]);
                        }

                        if(!data[i]["video"]){
                            if(data[i]["button"][j]["type"] == "waiting"){

                            }else if(data[i]["button"][j]["type"] == "validate"){
                                $(clone2).attr("onclick",data[i]["button"][j]["function"]);
                            }else{
                                if(data[i]["button"][j]["gotoSlide"] < 0){
                                    $(clone2).attr("onclick","closeWindows()");
                                }else{
                                    $(clone2).attr("onclick","game.setSlide("+data[i]["button"][j]["gotoSlide"]+")");
                                }   
                            }  


                        }
                        else{
                            $(clone2).attr("onclick","game.openModal('modal-alert-video');");
                        }
                        
                        $(clone).find(".dynamic_button").append(clone2);
                    }
                }

                //content owl-carousel-2
                // if(data[i]["image_modal"]){
                //     if(data[i]["image_modal"]!="false"){
                //         // $(clone).find(".video_content").remove();
                //         // $(clone).attr("data-avatar",data[i]["image"]);
                //         console.log("assets/images/"+data[i]["image_modal"]);
                //         console.log($(clone2).find(".dynamic_img_modal").first());
                //         $(".dynamic_img_modal").first().attr("src","assets/images/"+data[i]["image_modal"]);
                //         console.log($(clone2).find(".dynamic_img_modal").first());
                //     }
                // }

                //check arr badge division
                console.log(par1);
                if(par1.length > 0){
                    console.log(par1);
                    for (var i = 0; i < par1.length ; i++) {
                        var curr_question = 0;
                        var data_length = par1[i]['data'].length;
                        console.log("#dynamic_btn_text_"+(i+1));
                        $(clone).find("#dynamic_btn_text_"+(i+1)).text(curr_question+'/'+data_length);
                    }
                }   

                $(".owl-carousel").append(clone);
                // $(".owl-carousel2").append('test');
            }

            //set content modal
            if(ldata["list_2"] != undefined){
                var data2 = ldata["list_2"];
                for (var i = 0; i < data2.length; i++) {
                    var id = data2[i]["id"];
                    var clone_modal = $(".owl-carousel2 #item_modal_"+id).first().clone();
                    $("#owl-carousel2_"+data2[i]['id']).html("");
                    // console.log(clone_modal);
                    var clone2 = $(clone_modal).clone();
                    // console.log(clone2);
                    // console.log(clone2[0]['outerHTML']);
                     //content owl-carousel-2
                    if(data2[i]["image"]){
                        if(data2[i]["image"]!="false"){
                            // console.log(".dynamic_img_modal_"+id);
                            $(clone2).find(".dynamic_img_modal_"+id).first().attr("src","assets/images/"+data2[i]["image"]);
                            // console.log(clone2.find(".dynamic_img_modal_"+id));
                        }
                    }

                    if(data2[i]["text"] == undefined){
                        $(clone2).find(".dynamic_text_modal_"+id).hide();
                    }else{
                        $(clone2).find(".dynamic_text_modal_"+id).html(data2[i]["text"]);
                    }

                    if(data2[i]["image2"]){
                        if(data2[i]["image2"]!="false"){
                            $(clone2).find(".dynamic_img_modal2_"+id).first().attr("src","assets/images/"+data2[i]["image2"]);
                        }
                    }

                    if(data2[i]["text2"] == undefined){
                        $(clone2).find(".dynamic_text_modal2_"+id).hide();
                    }else{
                        // console.log($(clone2).find(".dynamic_text_modal2_"+id))
                        $(clone2).find(".dynamic_text_modal2_"+id).html(data2[i]["text2"]);
                    }

                    // console.log(clone2);
                    $("#owl-carousel2_"+id).append(clone2);
                }
            }
        }

         $(".img_wrapper_2").click(function(){
            console.log("img_wrapper_2 click");
            // $this.arr_challenge = [1];
            // game.setChallenge($this.arr_challenge);
            game.setSlide(6);
        });

        $(".btn-exit").click(function(e){
            console.log("btn-exit click");
            game.audio.audioButton.play();
            var btn_back = parent.top.document.getElementsByClassName("back-button")[0];
            btn_back.click();
        });

        $(".btn-bottom .btn-secondary").click(function(){
            $this.validate_filled();
        });
    }

    $this.owlCarouselRun($('.owl-carousel'), slider_prev_next);

    // console.log($('.owl-carousel2'));
    // $this.owlCarouselRun2($('.owl-carousel2'));
};

quizCheckList.prototype.owlCarouselRun = function(el, slider_prev_next) {
    var $this = this;
    $startPosition = 0;
    slider_prev_next = true;
    if(slider_prev_next == false){
        slider_prev_next = false;
    }

    el.owlCarousel({
        /*items: 1,
        margin: 0,
        nav: true,
        navText: ["<img src='assets/images/owl-prev.png'/>","<img src='assets/images/owl-next.png'/>"],
        dots: true,
        autoHeight: false,
        autoWidth: false*/
        items: 1,
        margin: 0,
        nav: slider_prev_next,
        navText: ["<img src='assets/images/owl-prev.png'/>","<img src='assets/images/owl-next.png'/>"],
        dots: true,
        startPosition: $startPosition,
        autoHeight: false,
        autoHeightClass: 'owl-height',
        onInitialized: function(e) {
            // set avatar
            $this.avatarSet($(e.target).find('.owl-item.active .item').attr('data-avatar'));

            slideTotal = e.item.count;
            slideCurrent = e.item.index + 1;
            /*if (slideTotal > 1) {
                $(e.target).append('<div class="owl-number"><div><span>' + slideCurrent + '</span> / ' + slideTotal + '</div></div>');
            }*/
            
            // custom scroll bar
            mJs = $('.mini .caption .jscroll');
            if (mJs.length) {
                mJs.jScrollPane({
                    autoReinitialise: true
                });
            }
        },
        onTranslated: function(e) {
            // set avatar
            $this.avatarSet($(e.target).find('.owl-item.active .item').attr('data-avatar'));

            slideCurrent = e.item.index + 1;
            $(e.target).find('.owl-number span').html(slideCurrent);
        }
    });
};

quizCheckList.prototype.owlCarouselRun2 = function(el) {
    // console.log('owlCarouselRun2');
     el.owlCarousel({
            items: 1,
            margin: 0,
            nav: false,
            navText: "",
            dots: true,
            autoHeight: false,
            autoWidth: false,
            responsiveRefreshRate: 100,
            responsiveBaseElement: '.modal-alert-slider>div>div'
        });
        $(".btn").click(function(e){
            $(".dynamic_img").hide();
        });
}

quizCheckList.prototype.avatarSet = function(avatar,gotoSlide) {
    var $this = this;
    $(".ava img").off();
    if(gotoSlide!=undefined && gotoSlide!="" && gotoSlide!=null){
        $(".ava img").click(function(e){
            $(this).off();
            game.setSlide(parseInt(gotoSlide));
        });
    }

    if($this.avaPrev){
        $('.ava').animateCss('fadeOutLeft', function() {
            $this.setAvaIn(avatar);
        });
    }
    else{
        $this.setAvaIn(avatar);
    }
    
};

quizCheckList.prototype.setAvaIn = function(avatar) {
    if (avatar) {
       $('.ava img').attr('src','assets/images/' + avatar);
        
    }
};


quizCheckList.prototype.validate_filled = function(){
    console.log(game.getAllQuizFilled());
    // game.setSlide(6);
    if(game.getAllQuizFilled() == 1){
        game.setSlide(6);
    }else{
        game.setAllQuizFilled(2);
        game.setSlide(3);

    }
};