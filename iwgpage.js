//Dust Particles Simulation by bionicoz based on
//Basic Particle Animation
//Author: Nilesh Thorath
$(function () {
	var W,
		H,
		canvas,
		ctx, //ctx stands for context and is the "curso" of our canvas element.
		particleCount = 300,  // The number of particles to be generated.
		particles = []; //this is an array which will hold our particles Object/Class

	W = window.innerWidth;
	H = window.innerHeight;

	canvas = $("#canvas").get(0); //this "get(0) will pull the underlying non-jquery wrapped dom element from our selection
	canvas.width = W;
	canvas.height = H;

	ctx = canvas.getContext("2d"); // settng the context to 2d rather than the 3d WEBGL
	ctx.globalCompositeOperation = "lighter";
	console.log(ctx);
	var mouse = {
		x: 0,
		y: 0,
		rx: 0,
		ry: 0,
		speed: 45,
		delta: 0
	};

	document.addEventListener(
		"mousemove",
		function (e) {
			mouse.x = e.clientX || e.pageX;
			mouse.y = e.clientY || e.pageY;
			mouse.x -= W / 2;
			mouse.y -= H / 2;
		},
		false
	);

	function randomNorm(mean, stdev) {
		return (
			Math.abs(
				Math.round(
					Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)
				) * stdev
			) + mean
		);
	}

	//Setup particle class
	function Particle() {
		//using hsl is easier when we need particles with similar colors
		this.h = parseInt(240);
		this.s = parseInt(500 * Math.random() + 1);
		this.l = parseInt(20 * Math.random() + 1);
		this.a = 5 * Math.random();



        // H represents hue (color type).
        // S represents saturation (color intensity).
        // L represents lightness (brightness).
        // A represents alpha (transparency).

		this.color =
			"hsla(" + this.h + "," + this.s + "%," + this.l + "%," + this.a + ")";
		this.shadowcolor =
			"hsla(" +
			this.h +
			"," +
			this.s +
			"%," +
			this.l +
			"%," +
			parseFloat(this.a - 1) +         
			")";

            // parseFloat used for blur effect

		this.x = Math.random() * W;
		this.y = Math.random() * H;
		this.direction = {
			x: -1 + Math.random() * 2,
			y: -1 + Math.random() * 2
		};
		//this.radius = 9 * ((Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1)+3);
		this.radius = randomNorm(1, 1);    //size of circles
		this.scale = 0.1* Math.random() + 0.9;    //shape of circle
		this.rotation = (Math.PI / 4) * Math.random();


		this.grad = ctx.createRadialGradient(
			this.x,
			this.y,
			this.radius,
			this.x,
			this.y,
			0
		);
		this.grad.addColorStop(0, this.color);
		this.grad.addColorStop(1, this.shadowcolor);

		this.vx = (2 * Math.random() + 4) * 0.01 * this.radius;
		this.vy = (2 * Math.random() + 4) * 0.01 * this.radius;

		this.valpha = 0.01 * Math.random() - 0.02;

		this.move = function () {
			this.x += this.vx * this.direction.x;
			this.y += this.vy * this.direction.y;
			this.rotation += this.valpha;
			//this.radius*= Math.abs((this.valpha*0.01+1));
		};
		this.changeDirection = function (axis) {
			this.direction[axis] *= -1;
			this.valpha *= -1;
		};





        this.draw = function () {
            ctx.save();
            ctx.translate(
                this.x + (mouse.rx / -40) * this.radius,
                this.y + (mouse.ry / -40) * this.radius
            );
            ctx.rotate(this.rotation);
            ctx.scale(1, this.scale);
        
            // Set stroke style for the circle border
            ctx.strokeStyle = 'lightblue'; // Choose color for the border
            ctx.lineWidth = 1; // Choose the width of the border
        
            // Draw the border of the circle
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
        
            // Create gradient for filling the circle
            this.grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, 0);
            this.grad.addColorStop(1, this.color);
            this.grad.addColorStop(0, this.shadowcolor);
        
            // Fill the circle with gradient
            ctx.fillStyle = this.grad;
            ctx.fill();
            ctx.restore();
        };




		// this.draw = function () {
		// 	ctx.save();
		// 	ctx.translate(
		// 		this.x + (mouse.rx / -20) * this.radius,
		// 		this.y + (mouse.ry / -20) * this.radius
		// 	);
		// 	ctx.rotate(this.rotation);
		// 	ctx.scale(1, this.scale);

		// 	this.grad = ctx.createRadialGradient(0, 0, this.radius, 0, 0, 0);
		// 	this.grad.addColorStop(1, this.color);
		// 	this.grad.addColorStop(0, this.shadowcolor);
		// 	ctx.beginPath();
		// 	ctx.fillStyle = this.grad;
		// 	ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		// 	ctx.fill();
		// 	ctx.restore();
		// };
		this.boundaryCheck = function () {
			if (this.x >= W * 1.2) {
				this.x = W * 1.2;
				this.changeDirection("x");
			} else if (this.x <= -W * 0.2) {
				this.x = -W * 0.2;
				this.changeDirection("x");
			}
			if (this.y >= H * 1.2) {
				this.y = H * 1.2;
				this.changeDirection("y");
			} else if (this.y <= -H * 0.2) {
				this.y = -H * 0.2;
				this.changeDirection("y");
			}
		};
	} //end particle class

	function clearCanvas() {
		ctx.clearRect(0, 0, W, H);
	} //end clear canvas

	function createParticles() {
		for (var i = particleCount - 1; i >= 0; i--) {
			p = new Particle();
			particles.push(p);
		}
	} // end createParticles

	function drawParticles() {
		for (var i = particleCount - 1; i >= 0; i--) {
			p = particles[i];
			p.draw();
		}
	} //end drawParticles

	function updateParticles() {
		for (var i = particles.length - 1; i >= 0; i--) {
			p = particles[i];
			p.move();
			p.boundaryCheck();
		}
	} //end updateParticles

	function initParticleSystem() {
		createParticles();
		drawParticles();
	}

	function animateParticles() {
		clearCanvas();
		setDelta();
		update();
		drawParticles();
		updateParticles();
		requestAnimationFrame(animateParticles);
	}


	initParticleSystem();
	requestAnimationFrame(animateParticles);


    setInterval(function () {
        particles.forEach(function (p) {
            p.toggleVisibility(); // Toggle visibility of each particle
        });
    }, 500);

	function setDelta() {
		this.now = new Date().getTime();
		mouse.delta = (this.now - this.then) / 1000;
		this.then = this.now;
	}
	function update() {
		if (isNaN(mouse.delta) || mouse.delta <= 0) {
			return;
		}

		var distX = mouse.x - mouse.rx,
			distY = mouse.y - mouse.ry;

		if (distX !== 0 && distY !== 0) {
			mouse.rx -= (mouse.rx - mouse.x) / mouse.speed;
			mouse.ry -= (mouse.ry - mouse.y) / mouse.speed;
		}
	}
});





// ========== gravity button start========
// var magnets = document.querySelectorAll(".btnn1");
// var strength = 50;

// magnets.forEach((magnet) => {
//   magnet.addEventListener("mousemove", moveMagnet);
//   magnet.addEventListener("mouseout", function (event) {
//     TweenMax.to(event.currentTarget, 1, { x: 0, y: 0, ease: Power4.easeOut });
//   });
// });

// function moveMagnet(event) {
//   var magnetButton = event.currentTarget;
//   var bounding = magnetButton.getBoundingClientRect();

//   //console.log(magnetButton, bounding)

//   TweenMax.to(magnetButton, 1, {
//     x:
//       ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
//       strength,
//     y:
//       ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
//       strength,
//     ease: Power4.easeOut
//   });

//   //magnetButton.style.transform = 'translate(' + (((( event.clientX - bounding.left)/(magnetButton.offsetWidth))) - 0.5) * strength + 'px,'+ (((( event.clientY - bounding.top)/(magnetButton.offsetHeight))) - 0.5) * strength + 'px)';
// }


// gravity button end ======================



var video = document.getElementById("video1");
video.addEventListener("mouseover", function() {
    video.contentWindow.postMessage('{"method":"play"}', '*');
});

video.addEventListener("mouseout", function() {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
});

// // ==============================================


var videoo = document.getElementById("video2");

videoo.addEventListener("mouseover", function() {
    videoo.contentWindow.postMessage('{"method":"play"}', '*');
});

videoo.addEventListener("mouseout", function() {
    videoo.contentWindow.postMessage('{"method":"pause"}', '*');
});


// // =============================================================



var videooo = document.getElementById("video3");

videooo.addEventListener("mouseover", function() {
    videooo.contentWindow.postMessage('{"method":"play"}', '*');
});

videooo.addEventListener("mouseout", function() {
    videooo.contentWindow.postMessage('{"method":"pause"}', '*');
});



// // ==============================================================



var videoooo = document.getElementById("video4");

videoooo.addEventListener("mouseover", function() {
    videoooo.contentWindow.postMessage('{"method":"play"}', '*');
});

videoooo.addEventListener("mouseout", function() {
    videoooo.contentWindow.postMessage('{"method":"pause"}', '*');
});




// var video1 = document.getElementById("video1");
// var video2 = document.getElementById("video2");
// var video3 = document.getElementById("video3");
// var video4 = document.getElementById("video4");

// // Pause the videos when the page loads
// video1.pause();
// video2.pause();
// video3.pause();
// video4.pause();

// // Add event listeners to start/pause videos on hover
// video1.addEventListener("mouseover", function() {
//     if (video1.paused) {
//         video1.play();
//     }
// });

// video1.addEventListener("mouseout", function() {
//     if (!video1.paused) {
//         video1.pause();
//     }
// });

// video2.addEventListener("mouseover", function() {
//     if (video2.paused) {
//         video2.play();
//     }
// });

// video2.addEventListener("mouseout", function() {
//     if (!video2.paused) {
//         video2.pause();
//     }
// });

// video3.addEventListener("mouseover", function() {
//     if (video3.paused) {
//         video3.play();
//     }
// });

// video3.addEventListener("mouseout", function() {
//     if (!video3.paused) {
//         video3.pause();
//     }
// });

// video4.addEventListener("mouseover", function() {
//     if (video4.paused) {
//         video4.play();
//     }
// });

// video4.addEventListener("mouseout", function() {
//     if (!video4.paused) {
//         video4.pause();
//     }
// });