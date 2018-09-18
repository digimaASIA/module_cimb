$(document).ready(function(){
  //Config
  $( document ).ajaxStart(function() {
    $( "#overlay" ).show();
  });
  $( document ).ajaxStop(function() {
    $( "#overlay" ).hide();  
  });
  $( document ).ajaxError(function() {
    $( "#overlay" ).hide();  
  });
  $.ajaxSetup({
    beforeSend: function( xhr ) {
       xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
    }
  });
  window.setTimeout(function() {
    $('.sk-cube-grid').show();
  }, 500);
  $(window).load(function() {
    // When the page has loaded
    $(".page-header,.page-sidebar-wrapper,.page-content-wrapper,.page-footer").fadeIn(500);
    window.setTimeout(function() {
      $('.sk-cube-grid').hide();
    }, 700);
  });

  //Function
  $.extend({
    root:function(){
      return $('meta[name="root_url"]').attr('content');
    },cur_url:function(){
      return document.URL;
    },cur_url_whash:function(){
      return window.location.origin + window.location.pathname;
    },last_segment:function(){
      return this.cur_url().split('/').pop();
    },postformdata:function(url,formdata){
      data = $.ajax({
              url: url,
              type: "POST",
              data: formdata,
              contentType: false, 
              cache: false,
              processData:false,
          });
          return data;
    },postdata:function(url,formdata){
      // console.log(url);
      // console.log(formdata);
      data = $.ajax({
              url: url,
              type: "POST",
              data: formdata
          });
      // console.log(data);
          return data;
    },getdata:function(url){
      data = $.ajax({
              url: url,
              type: "GET"
          });
          return data;
    },base64image:function(inputElement){
      console.log('base64image');
      var deferred = $.Deferred();
      var files = inputElement;
      console.log(files);
      if (files && files[0]) {
          var fr= new FileReader();
          fr.onload = function(e) {
            console.log(e);
              deferred.resolve(e.target.result);
          };
          fr.readAsDataURL( files[0] );
      } else {
          deferred.resolve(undefined);
      }

      return deferred.promise();

    },settimeoutalert:function(){
      window.setTimeout(function() {
          $(".alert alert-remove").fadeTo(1500, 0).slideUp(500, function(){
            $(this).remove(); 
          });
      }, 2000);
    },notiferror:function(info){
      notif = "<div class='alert alert-remove alert-danger'>"+info+"<button type='button' class='close'></button></div>";
          $.settimeoutalert();
        return notif;
    },notifsuccess:function(info){
      notif = "<div class='alert alert-remove alert-success'>"+info+"<button type='button' class='close'></button></div>";
          $.settimeoutalert();
        return notif;
    },growl:function(){
      grw = $('.growl-alert');
      if(grw.length > 0){
        // $.bootstrapGrowl(grw.data('message'), {
        //   ele: 'body', // which element to append to
        //   type: grw.data('type'), // (null, 'info', 'danger', 'success', 'warning')
        //   offset: {
        //       from: 'top',
        //       amount: 100
        //   }, // 'top', or 'bottom'
        //   align: 'right', // ('left', 'right', or 'center')
        //   width: 250, // (integer, or 'auto')
        //   delay: 5000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        //   allow_dismiss: true, // If true then will display a cross to close the popup.
        //   stackup_spacing: 10 // spacing between consecutively stacked growls.
        // });
      }
    },growl_alert:function(text,type){
      // $.bootstrapGrowl(text, {
      //   ele: 'body', // which element to append to
      //   type: type, // (null, 'info', 'danger', 'success', 'warning')
      //   offset: {
      //       from: 'top',
      //       amount: 100
      //   }, // 'top', or 'bottom'
      //   align: 'right', // ('left', 'right', or 'center')
      //   width: 250, // (integer, or 'auto')
      //   delay: 5000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
      //   allow_dismiss: true, // If true then will display a cross to close the popup.
      //   stackup_spacing: 10 // spacing between consecutively stacked growls.
      // });
      // $.settimeoutalert();
    },validemail:function(email){
      var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
          return pattern.test(email);
    }, redirect:function(url){
      $(location).attr('href',url);
    }, tinymce:function(){
      //  tinymce.init({
      //   selector: ".editor",
      //   theme: "modern",
      //   height:300,
      //   resize: false,
      //   plugins: [
      //     "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      //     "searchreplace wordcount visualblocks visualchars code",
      //     "insertdatetime media nonbreaking save table contextmenu directionality",
      //     "emoticons template paste textcolor hr colorpicker "
      //   ],
      //   toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      //   toolbar2: "print preview media | forecolor backcolor emoticons hr blockquote",
      //   relative_urls: false,
      //   external_filemanager_path:this.root()+"../components/plugins/filemanager/",
      //   filemanager_title:"Image Path" ,
      //   plugin_preview_width: 1000,
      //   plugin_preview_height: 500,
      //   external_plugins: { "filemanager" : this.root()+"../components/plugins/filemanager/plugin.min.js"},
      //   templates: [
      //       {title: 'Test template 1', content: 'Test 1'},
      //       {title: 'Test template 2', content: 'Test 2'}
      //   ],
      //   content_css : [this.root()+'../components/plugins/bootstrap/css/bootstrap.min.css',this.root()+'../components/both/css/style.css']
      // });
    }, datetimerange: function(){
      // $('.datetimerange').daterangepicker({
      //   locale: {
      //     format: 'DD/MM/YYYY'
      //   },
      // });
    }, datepickers: function(){
      // $(".datepicker").datepicker({
      //     changeMonth: true,
      //     changeYear: true,
      //     dateFormat: 'dd-mm-yy',
      //     yearRange: "0:+90",
      //     showButtonPanel: true,
      //     minDate:0
      // });
    }, datetimepickers : function(){
      // $(".datetimepicker").datetimepicker({
      //   autoclose: true,
      //   format: "dd-mm-yyyy hh:ii:ss",
      //   todayBtn: true
      // });
    }, timepickers : function(){
      // $(".timepicker").timepicker({
      //   minuteStep: 10,
      //   showMeridian: false,
      // });
    }, colorpicker:function(){
      // $(".colorpickers").colorpicker({
      //   format: 'hex'
      // });
    }, disableinput:function(){
      $('input,select,textarea').prop('disabled',true);
    }, applyicheck:function(){
      $('input[type="checkbox"], input[type="radio"]').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'
      });
    }, select2:function(){
      // $(".select2").select2({
      //   placeholder: "--Select--"
      // });
      // $(".select2-tag").select2({
      //   placeholder: "--Select--",
      //   tags:true
      // });
    },sortable:function(){
      // $( ".sortable" ).sortable({
      //   placeholder: ""
      // });
      // $( ".sortable" ).disableSelection();
    }, initlogin:function(){
      // $('.login-bg').backstretch([
      //   "../components/back/images/web/bg1.jpg",
      //   "../components/back/images/web/bg2.jpg",
      //   "../components/back/images/web/bg3.jpg"
      //   ], {
      //     fade: 1000,
      //     duration: 8000
      //   }
      // );

      $('.forget-form').hide();
      $('#forget-password').click(function(){
        $('.login-form').hide();
        $('.forget-form').show();
      });

      $('#back-btn').click(function(){
        $('.login-form').show();
        $('.forget-form').hide();
      });
    }, formatRupiah:function(value){
        value = parseFloat(value.replace(/,/g, ""))
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    }, formatSeparatorToArray:function(val, separator){
        var arr   = val.split(separator);
        var res   = [];
        if((arr.length - 1) > 0){
            for(var j=0; j<(arr.length-1); j++){
                res.push(arr[j]);
            }
        }

        return res;
    }, imageCompressor:function(file, callback){ //array file from upload
        console.log(file);
        console.log(file.name);
        new ImageCompressor(file, {
          maxWidth: 800,
          maxHeight: 800,
          success(result) {
            console.log(result);
            callback(result);
          },
          error(e) {
            console.log(e.message);
            alert('imageCompressor: '+e.message);
          }
        });
    }, datediff:function(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }, deretAritmatika:function(a,b,n){
      /*
        a: suku pertama,
        b: beda tiap suku,
        n: suku ke-n
      */
      // console.log('a: '+a+' b: '+b+' n: '+n);
      var deret_n = a+(n-1)*b;
      return deret_n; 
    },
  });
  if($.last_segment() != 'login'){
    $.settimeoutalert();
    $.tinymce();
    $.datetimerange();
    $.datepickers();
    $.timepickers();
    $.datetimepickers();
    $.colorpicker();
    $.select2();
    $.sortable();
  }
  $.growl();
  $('[data-toggle="tooltip"]').tooltip(); 

  //Main
  // $('form').submit(function(){
  //   that  = this;
  //   ask   = $(this).data('ask');
  //   if(ask != 'n' || ask == undefined){
  //     swal({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#32c5d2',
  //       cancelButtonColor: '#cf1c28',
  //       confirmButtonText: 'Yes, Continue'
  //     }).then(function() {
  //       swal(
  //         'Confirmation',
  //         'Submit Data',
  //         'success'
  //       );
  //       $.bootstrapGrowl('Processing Form', {
  //         ele: 'body', // which element to append to
  //         type: 'info', // (null, 'info', 'danger', 'success', 'warning')
  //         offset: {
  //             from: 'top',
  //             amount: 100
  //         }, // 'top', or 'bottom'
  //         align: 'right', // ('left', 'right', or 'center')
  //         width: 250, // (integer, or 'auto')
  //         delay: 5000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
  //         allow_dismiss: true, // If true then will display a cross to close the popup.
  //         stackup_spacing: 10 // spacing between consecutively stacked growls.
  //       });
  //       setTimeout(function(){
  //         that.closest('form').submit();
  //       },1000);
  //     });
  //     return false;
  //   }
  // });

  //Manual Submit asking
  $(document).on('click','.ask',function(e){
    // that  = $(this);
    // url   = that.data('url');
    // swal({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#32c5d2',
    //   cancelButtonColor: '#cf1c28',
    //   confirmButtonText: 'Yes, Continue'
    // }).then(function() {
    //   swal(
    //     'Confirmation',
    //     'Submit Data',
    //     'success'
    //   );
    //   $.redirect(url);
    // });
    // return false;
  });

  //For Check all attribute
  $(document).on('click','.checkall',function(){
    a = $(this).data('target');
    $('.'+a).parent().addClass('checked').attr('aria-checked','true');
    $('.'+a).prop('checked','checked');
  });

  $(document).on('click','.uncheckall',function(){
    a = $(this).data('target');
    $('.'+a).parent().removeClass('checked').attr('aria-checked','false');
    $('.'+a).prop('checked','');
  });

  //For Data Table in index
  $(document).on('click','.sorting-data',function(){
    a = $(this).data('orderby');
    b = window.location.href.indexOf('?');
    c = '';
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    var cek = jQuery.inArray( "orderdata", vars );
    if (b > -1){
      if (cek > -1){
        if (vars['orderby'] == a){
          if (vars['orderdata'] == 'asc'){
            vars['orderdata'] = 'desc';
          }else{
            vars['orderdata'] = 'asc';
          }
        }else{
          vars['orderby'] = a;
          vars['orderdata'] = 'asc';
        }
      }else{
        vars.push('orderby');
        vars['orderby'] = a;
        vars.push('orderdata');
        vars['orderdata'] = 'asc';
      }
      $.each(vars,function(i,v){
        if (i == 0){
          c += '?'+v+'='+vars[v];
        }else{
          c += '&'+v+'='+vars[v];
        }
      });
    }else{
      c = '?q=s&orderby='+a+'&orderdata=asc';
    }
    d = $.cur_url_whash()+c; 
    $.redirect(d);
  });

  //Show search box in index
  $(document).on('click','.search-head',function(){
    $('.search-head-content').fadeIn();
  });

  //for Searching in index
  $(document).on('keydown','.search-data', function(e) {
    a = '<input type="hidden" name="q" value="s">';
    if(e.which == 13){
      $(".search-data").each(function(i) {
        a += '<input type="hidden" name="'+$(this).attr('name')+'" value="'+$(this).val()+'">';
      });
      $('#builder_form').append(a).submit();
    }
  });
  
  $(document).on('click','.submit-search',function(){
    a = '<input type="hidden" name="q" value="s">';
    $(".search-data").each(function(i) {
      a += '<input type="hidden" name="'+$(this).attr('name')+'" value="'+$(this).val()+'">';
    });
    $('#builder_form').append(a).submit();
  });

  //upload single image
  $(document).on('change','.single-image',function(res){
    if(res){
      name_method = $(this).attr('name');
      crop        = $(this).data('crop');
      target_crop = $('<img class="image-crop-data-'+name_method+'">');
      files       = this.files;
      ext         = files[0].name.split('.')[1].toLowerCase();
      size        = files[0].size;
      allow_ext   = ['jpg','gif','png','jpeg'];
      if($.inArray(ext,allow_ext) > -1){
        if(size <= 2000000){
          if(crop == undefined){
            $.base64image(files).done(function(res){
              file = "<img src='"+res+"' class='img-responsive thumbnail single-image-thumbnail'>";
              $('input[name="remove-single-image-'+name_method+'"]').val('n');
              $('.single-image-'+name_method).html(file);
            });
          }else{
            $('.container-crop-'+name_method).addClass('hidden');
            $('.waiting-crop-'+name_method).removeClass('hidden');
            $.base64image(files).done(function(res){
              $('#crop-modal-'+name_method).modal({show:true,backdrop: 'static', keyboard: false});      
              setTimeout(function(){
                $('.image-crop-data-'+name_method).cropper({
                  viewMode: 1,
                  moveable :false,
                  zoomable : false,
                  aspectRatio: 16 / 9,
                  cropBoxMovable: true,
                  cropBoxResizable: true
                }).cropper('replace', res);
                $('.waiting-crop').addClass('hidden');
                $('.container-crop').removeClass('hidden');
              }, 500);
            });
          }
        }else{
          alert("File size is to large");
        }
      }else{
        file = "<img src='"+$.root()+"../components/both/images/web/none.png' class='img-responsive thumbnail single-image-thumbnail'>";
        $(this).val(null);
        $('.single-image-'+name_method).html(file);
        $('input[name="remove-single-image-'+name_method+'"]').val('y');
        alert ("File must image");
      }
    }
  });

  $(document).on('change','.single-image-2',function(res){
        console.log('.single-image-2');
        if(res){
          name_method = $(this).attr('name');
          crop        = $(this).data('crop');
          target_crop = $('<img class="image-crop-data-'+name_method+'">');
          console.log(this);
          files       = this.files;
          console.log(this.files);
          ext         = files[0].name.split('.')[1].toLowerCase();
          size        = files[0].size;
          allow_ext   = ['jpg','gif','png','jpeg'];
          var width;
          var height;
          if($.inArray(ext,allow_ext) > -1){
            if(size <= 2000000){
              if(crop == 'croppie'){ //if select croppie image
                $.base64image(files).done(function(res){
                  file = "<img src="+res+" class='preview-"+name_method+" single-image-card upload-image_card'><button type='button' class='btn green btn greenask upload-result'>Simpan</button>";
                  $('input[name="remove-single-image-'+name_method+'"]').val('n');
                  $('.single-image-'+name_method).html(file);
                  
                  if(name_method == 'image_card'){
                    width = 1024;
                    height = 714;
                  }
                    var uploadCrop = $(".preview-"+name_method).croppie({
                      // enableExif: true,
                      // enforceBoundary: false,
                      viewport: {
                          'width': 1024,
                          'height': 714,
                      },
                      // boundary: {
                      //     width: width,
                      //     height: height,
                      // }
                   
                  });

                    // uploadCrop.croppie('bind', {
                    //     url: res,
                    //     point: [0,0,0,0],
                    // });

                    $('.upload-result').on('click', function (ev) {
                        console.log(ev);
                        uploadCrop.croppie('result', {
                            type: 'canvas',
                            size: 'viewport',
                            format: 'jpeg'
                        }).then(function (resp) {
                          console.log(resp);
                            console.log('name_method: '+name_method);
                            // console.log(resp);
                            $('#'+name_method+'_result').val(resp);
                            file = "<img src='"+resp+"' class='img-responsive thumbnail preview-"+name_method+" single-image-card upload-image_card'><button type='button' class='btn green btn greenask upload-result'> Simpan</button><button type='button' class='btn blue btn result'> Result</button>";
                            $('input[name="remove-single-image-'+name_method+'"]').val('n');
                            $('.single-image-'+name_method).html(file);
                            // $.base64image(resp).done(function(res){
                            //   console.log(res);
                            // });
                            // popupResult({
                            //   src: resp
                            // });
                        });
                    });

                });
              }else{
                // $('.container-crop-'+name_method).addClass('hidden');
                // $('.waiting-crop-'+name_method).removeClass('hidden');
                // $('.image-crop-data-image_card').addClass('hidden');
                // $('.image-crop-data-image_stamp').addClass('hidden');
                // $('#crop-image_card').addClass('hidden');
                // $('#crop-image_stamp').addClass('hidden');
                var minCropBoxWidth = $('#minCropBoxWidth-'+name_method).val();
                var minCropBoxHeight= $('#minCropBoxHeight-'+name_method).val();
                alert(minCropBoxWidth+'-'+minCropBoxHeight);
                $.base64image(files).done(function(res){
                  $('#crop-modal-'+name_method).modal('show');      
                  setTimeout(function(){
                    $('.image-crop-data-'+name_method).cropper({
                        aspectRatio: 0,
                        // preview: this.$avatarPreview.selector,
                        minCropBoxWidth: minCropBoxWidth,
                        minCropBoxHeight: minCropBoxHeight,
                        // viewMode: 1,
                        dragMode: 'move',
                        autoCropArea: 0,
                        restore: false,
                        guides: false,
                        highlight: false,
                        cropBoxMovable: false,
                        cropBoxResizable: false,
                    }).cropper('replace', res);
                    // $('.waiting-crop').addClass('hidden');
                    // $('.container-crop').removeClass('hidden');
                  }, 500);

                  $('#crop-'+name_method).on('click', function(e){
                    console.log(e);
                    var resp = $('.image-crop-data-'+name_method).cropper('getCroppedCanvas', {
                                  width: minCropBoxWidth,
                                  height: minCropBoxHeight
                                }).toDataURL('image/jpeg');
                    $('#'+name_method+'_result').val(resp);
                    file = "<img src='"+resp+"' class='img-responsive thumbnail preview-"+name_method+" single-image-thumbnail single-image-card upload-image_card'>";
                    $('input[name="remove-single-image-'+name_method+'"]').val('n');
                    $('.single-image-'+name_method).html(file);
                     $('#crop-modal-'+name_method).modal('hide');
                  });
                });
              }
            }else{
              alert("File size is to large");
            }
          }else{
            file = "<img src='"+$.root()+"../components/both/images/web/none.png' class='img-responsive thumbnail single-image-thumbnail'>";
            $(this).val(null);
            $('.single-image-'+name_method).html(file);
            $('input[name="remove-single-image-'+name_method+'"]').val('y');
            alert ("File must image");
          }
        }
      });

  //Save Cropping Image
  $(document).on('click','.save-crop',function(){
    name  = $(this).data('name');
    res = $('.image-crop-data-'+name).cropper('getCroppedCanvas');
    res = res.toDataURL('image/png');
    $('input[name="'+name+'-crop"]').val(res);
    $('.single-image-'+name+' > img').attr('src',res);
    $('.container-crop').addClass('hidden');
    $('.waiting-crop').removeClass('hidden');
    setTimeout(function(){
      $('#crop-modal-'+name).modal('hide');
    }, 500);
  });

  //Cancel Crop Image
  $(document).on('click','.cancel-crop',function(){
    name  = $(this).data('name');
    $('.container-crop').addClass('hidden');
    $('.waiting-crop').removeClass('hidden');
    setTimeout(function(){
      $('#crop-modal-'+name).modal('hide');
    }, 500);
  });

  //upload multiple image
  $(document).on('change','.multiple-image',function(res){
    if(res){
      crop        = $(this).data('crop');
      name        = $(this).attr('name');
      file_path   = $(this).data('file_path');
      url_temp    = $(this).data('upload');
      id          = $(this).data('id');
      files       = this.files;
      ext         = files[0].name.split('.')[1].toLowerCase();
      size        = files[0].size;
      allow_ext   = ['jpg','gif','png','jpeg'];
      if($.inArray(ext,allow_ext) > -1){
        if(size <= 2000000){
          if(crop == undefined){
            $('input[name='+name).attr('name','images_upload');
            formdata = new FormData($('form')[0]);
            formdata.append('id', id);
            formdata.append('file_path', file_path);
            $.postformdata(url_temp,formdata).success(function(data){
              $('#image_'+name).load($.cur_url()+' .tab-image-container',function(){
                $.sortable();
              });
            });
          }else{
            $('.container-crop-'+name).addClass('hidden');
            $('.waiting-crop-'+name).removeClass('hidden');
            $.base64image(files).done(function(res){
              $('#crop-modal-'+name).modal({show:true,backdrop: 'static', keyboard: false});      
              setTimeout(function(){
                $('.image-crop-data-'+name).cropper({
                  viewMode: 1,
                  moveable :false,
                  zoomable : false,
                  aspectRatio: 16 / 9,
                  cropBoxMovable: true,
                  cropBoxResizable: true
                }).cropper('replace', res);
                $('.waiting-crop').addClass('hidden');
                $('.container-crop').removeClass('hidden');
              }, 500);
            });
          }
        }else{
          alert("File size is to large");
        }
      }else{
        alert ("File must image");
      }
    }
  });

  //Save Cropping Multiple Image
  $(document).on('click','.save-multiple-crop',function(){
    name        = $(this).data('name');
    id          = $(this).data('id');
    file_path   = $(this).data('file_path');
    crop        = $(this).data('crop');
    res         = $('.image-crop-data-'+name).cropper('getCroppedCanvas');
    res         = res.toDataURL('image/png');
    formdata    = {id:id,file_path:file_path,images_upload_crop:res,crop:crop};
    $.postdata(url_temp,formdata).success(function(data){
      $('.container-crop').addClass('hidden');
      $('.waiting-crop').removeClass('hidden');
      $('#crop-modal-'+name).modal('hide');
      $('#image_'+name).load($.cur_url()+' .tab-image-container',function(){
        $.sortable();
      });
    });
  });

  //Remove Crop Multiple Image
  $(document).on('click','.cancel-multiple-crop',function(){
    name  = $(this).data('name');
    $('.container-crop').addClass('hidden');
    $('.waiting-crop').removeClass('hidden');
    setTimeout(function(){
      $('#crop-modal-'+name).modal('hide');
    }, 500);
  });
  

  //Delete Single Image
  $(document).on('click','.remove-single-image',function(){
    a = $(this).data('id');
    b = $(this).data('name');
    $('input[name="remove-'+a+'-'+b+'"]').val('y');
    $('.'+a+'-'+b+' > img').attr('src',$.root()+'../components/both/images/web/none.png');
    $('input[name="'+b+'"]').val(null);
  });

  //Delete Multiple Image
  $(document).on('click','.remove-multiple-image',function(){
    id          = $(this).data('id');
    url_temp    = $(this).data('delete');
    name        = $(this).data('name');
    files       = {id: id};
    $.postdata(url_temp,files).done(function(data){
      $('#image_'+name).load($.cur_url()+' .tab-image-container',function(){
        $.sortable();
      });
    });
  });

  //Change Status display in index
  $(document).on('click','.ajax-update',function(e){
    a = $(this).attr('href');
    b = this;
    $.postdata(a,'').done(function(data){
      // console.log(data);
      // console.log(b);
      if(data != 'no_access'){
        $(b).replaceWith(data);
      }
    });
    e.preventDefault();
  });

  //Change bulk data
  $(document).on('click','.ajax-bulk-update',function(e){
    that = $(this);
    z = that.data('alert');
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32c5d2',
      cancelButtonColor: '#cf1c28',
      confirmButtonText: 'Yes, Continue'
    }).then(function() {
      swal(
        'Confirmation',
        'Submit Data',
        'success'
      );
      a = that.data('href');
      b = that.data('action');
      c = $('.bulk_checkbox:checked').map(function(){
            return $(this).val();
          }).get();
      d = that.data('name');
      e = that.data('value');
      if(c.length > 0){
        f = {action:b,data:c ? c : '[]',name:d,value:e};
        $.postdata(a,f).done(function(data){
          location.reload();
        });
      }
    });
    return false;
  });

  //Force Submit Form
  $(document).on('change','.submit_form',function(){
    if ($(this).val() == ''){
      window.location = window.location.href.split('?')[0];
    }else{
      this.form.submit();
    }
  });
});

function cancelPreorder(id){
  $.ajax({
      type: "POST",
      url: $('meta[name="root_url"]').attr('content') + "cinemas/preorder/ext/cancel_preorder",
      data: { id: id } ,
  }).done(function(msg) {
    
  });
}

function updateStatus(id){
  var r = confirm("Update status?");

  if(r == true){
    $.ajax({
        type: "POST",
        url: $('meta[name="root_url"]').attr('content') + "cinemas/preorder/ext/update_preorder",
        data: { id: id } ,
    }).done(function(msg) {
      if(msg != "Update failed"){
        $(".wrapper-preorder_status-"+id).html(msg);
        alert("Update success");
      }
      else{
        alert(msg);
      }
    });
  }
}

var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        document.getElementById("expt").href = uri + base64(format(template, ctx));
        document.getElementById("expt").download = filename;
        document.getElementById("expt").click();

    }
})();