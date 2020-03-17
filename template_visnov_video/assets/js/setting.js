var Setting = function(){
   var $this = this;
   this.mode_visual_novel = 'stage'; //['linear','stage']

   this.image_path = 'assets/image/';

   if(this.mode_visual_novel == 'linear'){
      /*Mode visual novel linear*/
         this.linear_visual_novel = true;
         this.show_tutorial_ular_tangga = true; //show hide tutorial
         this.total_step = 1;
      /*End mode visual novel*/
   }else if(this.mode_visual_novel == 'stage'){
      this.show_tutorial_ular_tangga = true; //show hide tutorial pada stage ular tangga
   }

   /*Setting able variable*/
      /*Setting score*/
      this.max_score = 100;
      this.min_score = 75;
      this.percent_correct_answer_per_stage = 80; //[1,100]
      /*End setting score*/

      /*Setting life*/
      this.mode_life = false; //[true, false], bar nyawa akan muncul dan untuk menang harus mempertahankan life yang ada
      this.life_max = 5; //set max life
      /*End setting life*/

      this.auto_next_dialog = false; //[true, false], jika set true, maka dialog pada visual novel akan click otomatis dan pindah ke dialog berikutnya
      this.time_auto_next = 2000;
      this.tryagain_question_false_answer = false; //jika true, jika answer salah ulang soal terakhir
      //setting timer
      this.time_global = false; //jika true, maka time global pada stage atau map akan muncul dan alur game mengikuti waktu dari time global
      this.timer_global = 1000; //milisecond timer global
      this.pause_timer_global = false; //pause timer global default false
      this.hide_icon_complete_bar = false; //jika true, maka complete bar akan disembunyikan
      this.complete_bar_type = 1; //tipe complete bar [1,2]
      this.slide_result_per_step = 6; //variabel untuk menentukan slide pertama result step
      this.slide_result = 9; //variabel untuk menentukan slide ke-n dari page result
      this.slide_game_map = 2; //variabel untuk menentukan slike ke-n dari page game map
      this.orientation_landscape = false; // *setting layar untuk orientasi landscape
      /*End setting able variable*/

   /*Setting page map*/
      this.hide_step_connector = true; //jika true, maka map ular tangga step konektor akan disembunyikan
   /*End setting page map*/

   /*Setting page quiz*/
      // this.hide_result_step_page = true; //variabel hide page result_step
    /*End setting page quiz*/
}