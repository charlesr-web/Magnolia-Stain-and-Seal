$(function () {
  'use strict';

  $('[data-toggle="offcanvas"]').on('click', function () {
    $('.offcanvas-collapse').toggleClass('open');
  });

  // If the comparison slider is present on the page lets initialise it, this is good you will include this in the main js to prevent the code from running when not needed
  if ($(".comparison-slider")[0]) {
    const compSlider = $(".comparison-slider");
  
    //let's loop through the sliders and initialise each of them
    compSlider.each(function() {
      const compSliderWidth = $(this).width() + "px";
      $(this).find(".resize img").css({ width: compSliderWidth });
      drags($(this).find(".divider"), $(this).find(".resize"), $(this));
    });
  
    //if the user resizes the windows lets update our variables and resize our images
    $(window).on("resize", function() {
      const compSliderWidth = compSlider.width() + "px";
      compSlider.find(".resize img").css({ width: compSliderWidth });
    });
  }

  // This is where all the magic happens
  // This is a modified version of the pen from Ege Görgülü - https://codepen.io/bamf/pen/jEpxOX - and you should check it out too.
  function drags(dragElement, resizeElement, container) {
    
    // This creates a variable that detects if the user is using touch input insted of the mouse.
    const touched = false;
    window.addEventListener('touchstart', function() {
      touched = true;
    });
    window.addEventListener('touchend', function() {
      touched = false;
    });
    
    // clip the image and move the slider on interaction with the mouse or the touch input
    dragElement.on("mousedown touchstart", function(e) {
        
      //add classes to the emelents - good for css animations if you need it to
      dragElement.addClass("draggable");
      resizeElement.addClass("resizable");
      //create vars
      const startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
      const dragWidth = dragElement.outerWidth();
      const posX = dragElement.offset().left + dragWidth - startX;
      const containerOffset = container.offset().left;
      const containerWidth = container.outerWidth();
      const minLeft = containerOffset + 10;
      const maxLeft = containerOffset + containerWidth - dragWidth - 10;
      
      //add event listner on the divider emelent
      dragElement.parents().on("mousemove touchmove", function(e) {
        
        // if the user is not using touch input let do preventDefault to prevent the user from slecting the images as he moves the silder arround.
        if ( touched === false ) {
          e.preventDefault();
        }
        
        const moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
        const leftValue = moveX + posX - dragWidth;

        // stop the divider from going over the limits of the container
        if (leftValue < minLeft) {
          leftValue = minLeft;
        } else if (leftValue > maxLeft) {
          leftValue = maxLeft;
        }

        const widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";

        $(".draggable").css("left", widthValue).on("mouseup touchend touchcancel", function() {
          $(this).removeClass("draggable");
          resizeElement.removeClass("resizable");
        });
        
        $(".resizable").css("width", widthValue);
        
      }).on("mouseup touchend touchcancel", function() {
        dragElement.removeClass("draggable");
        resizeElement.removeClass("resizable");
        
      });
    
    }).on("mouseup touchend touchcancel", function(e) {
      // stop cliping the image and move the slider
      dragElement.removeClass("draggable");
      resizeElement.removeClass("resizable");
    
    });
  
  }
});
