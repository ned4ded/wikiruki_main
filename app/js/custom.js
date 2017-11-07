console.log('hi timer');

console.log('hi carousel');
$('document').ready(function(){
  $('.bilboard__slider').slick({
    arrows: false,
    dots: true,
    dotsClass: 'bilboard__slider-dots',
    appendDots: $('.bilboard'),
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3000
  })
});
