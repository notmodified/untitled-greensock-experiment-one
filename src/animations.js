import 'gsap';

export function intro (ref, onComplete) {
  TweenMax.set(ref, {clearProps:"all"});

  const countDown = new TimelineMax({});
  countDown
    .to('#three', 1, {repeat: true, yoyo: true, css: {fontSize: 400}})
    .to('#two', 1, {repeat: true, yoyo: true, css: {fontSize: 400}})
    .to('#one', 1, {repeat: true, yoyo: true, css: {fontSize: 400}})

  const t1 = new TimelineMax({onComplete});

  t1
    .add(TweenMax.staggerTo(ref, 1.5, {css: {rotationY: "+=180"}, ease: Power2.easeInOut}, 0.2))
    .add(countDown)
    .add(TweenMax.staggerTo(ref, 1,
                            {
                              css: {rotationY: "+=180"},
                              ease: Power2.easeInOut,
                              delay: 0,
                              onComplete: _ => console.log('front')
                            },
                            0.2
                           ))
}

export function flip (element, onComplete) {
  let tl = new TimelineMax({onComplete});
  tl.to(element, 1.5, {
    css:{rotationY:"+=180", x:"-=100%",
    transformOrigin:"right center"},
    ease:Power2.easeInOut
  })
  ;
}

export function noMatch([first, second], onComplete) {
  let tl = new TimelineMax({onComplete});
  tl
    .staggerTo([first, second], 1, {css:{rotationY:"-=180",x:"+=100%"}, ease:Power2.easeInOut}, 0.1)
   // .to([first, second], 1, {css:{rotationX:"-=80"}, transformOrigin:"", ease:Power2.easeInOut})
}

export function match([first, second], onComplete) {
  let tl = new TimelineMax({onComplete});
  tl
    .staggerTo([first, second], 1.5, {css:{rotationX:"-=" + ((360*2)+90)}, ease:Sine.easeIn}, 0.2)
}

