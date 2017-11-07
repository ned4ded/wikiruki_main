const customCarousel = $('.bilboard__slider').slick({
  arrows: false,
  dots: true,
  dotsClass: 'bilboard__slider-dots',
  appendDots: $('.bilboard'),
  pauseOnHover: false,
  pauseOnDotsHover: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 4000
});

$('document').ready(function(){
  customCarousel.slick('slickPlay');
});
