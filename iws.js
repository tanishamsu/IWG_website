gsap.registerPlugin(ScrollTrigger);
// debugger
const tl= gsap.timeline({


scrollTrigger : {
    trigger: ".container",
    start: "100% 100%",
    end : "+=500%",
    // markers: true,
    scrub: 1,
    pin: true,
    // toggleActions: 'play reverse play reverse',
}
});



tl.from(".box",{
// x:"50vw",
y:"80vh",
// x:"50vw",
duration:5,
pin: true,
})

 .to(".box",{
    pin: true,
    duration:5,
 })




// ==================letter i ============


    .to(".box",
    {
        y:-250,
        x:-505,
        duration: 5,
        scale: 0.5,
        pin: true,

    })
    tl.from("#letter-I",{
        x:-410,
        duration:8,
        scale: 0.5,
        
    })

// ==================letter w ============


.to(".box",
{
    // y:-320,
    x:170,
    duration: 5,
    scale: 0.5,
    pin: true,

})
tl.from("#letter-W",{
    y:600,
    duration:8,
    // delay:1,
})


// ==================letter g============


.to(".box",
{
    x:644,
    y:-80,
    // x: 500,
    duration: 5,
    // scale: 0,
    pin: true,

})
tl.from("#letter-G",{
    x:512,
    duration:8,
    // delay:2,
})


