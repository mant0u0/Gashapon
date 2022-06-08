var menuState = 0;
$(".function-menu .btn-menu").click(function() {
  a = $(".menu-box").attr("class")

  if(menuState == 1){
    closeMenu();
  }else{
    openMenu();
  }
});

function closeMenu(){
  if(menuState == 1){
    $(".btn-menu-icon").css("transform","");
    $(".gashapon").css("opacity","");
    $(".hint-text ").css("opacity","");
    $(".menu-box").addClass("close");
    $(".menu-box").removeClass("open");
    setTimeout(function(){
      $(".btn-import, .btn-instruction, .btn-about, .btn-share").css("opacity","0");
      menuState = 0
    }, 0.5*1000 );
  }
}

function openMenu(){
  if(menuState == 0){
    $(".btn-menu-icon").css("transform","rotate(180deg)");
    $(".gashapon").css("opacity","0.5");
    $(".hint-text ").css("opacity","0.5");
  
    $(".menu-box").addClass("open");
    $(".menu-box").removeClass("close");
    setTimeout(function(){
      $(".btn-import, .btn-instruction, .btn-about, .btn-share").css("opacity","1");
      menuState = 1
    }, 0.5*1000 );
  }
}

