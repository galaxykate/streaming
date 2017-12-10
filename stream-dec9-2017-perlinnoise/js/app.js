// Runs as soon as JS file is loaded
console.log("Hello, Stream!")


// 
$(document).ready(function() {

	let noise = new SimplexNoise(Math.random);

	// Runs once the whole page is loaded
	console.log("Loaded")
	let tileSize, tilesX, tilesY;

	createProcessing($("#view"),
		// On update
		() => {},


		// On Draw, running every frame
		(g, time) => {
			let t = time.current;
			//console.log(t);

			tileSize = 15;
			tilesX = Math.round(g.width / tileSize);
			tilesY = Math.round(g.height / tileSize);

			//console.log("DRAW RAINBOWS")

			g.noStroke();
			for (let i = 0; i < tilesX; i++) {
				for (let j = 0; j < tilesY; j++) {

					// Polar offset noise


					let x = i * tileSize - g.width / 2;
					let y = j * tileSize - g.height / 2;

					// Remap noise to [0, 1]
					let scale = .003;

					let thetaScale = .001 + .001*Math.sin(t);
					let theta = noise.noise3D(x * thetaScale, y * thetaScale, t*.2) * 10;
					let r = .2;

					let v = noise.noise2D(x * scale + r * Math.cos(theta),
						y * scale + r * Math.sin(theta)) * .5 + .5;

					//	v = Math.abs(v - .5)*2;
					//	v = Math.abs(v - .5)*2;



					// Saturation and brightness go [0, 1]
					let hue = v;
					g.fill(v * .5 + .4, 1.4 - v, v)



					g.rect(x, y, tileSize, tileSize);
				}
			}


		},

		// On start, once
		(g) => {

		})

})



//=======================================================
/// Create Processing

function createProcessing(holder, onUpdate, onDraw, onStart) {
	var time = {
		current: 0,
		lastUpdate: -.1,
		elapsed: .1,
		frames: 0
	};

	var canvas = $("<canvas/>").appendTo(holder).css({
		width: "100%",
		height: "100%"
	});


	var processingInstance = new Processing(canvas.get(0), function(g) {

		// Set the size of processing so that it matches that size of the canvas element
		var w = canvas.width();
		var h = canvas.height();
		time.start = new Date().getTime() * .001;

		g.size(w, h);
		g.colorMode(g.HSB, 1);
		g.ellipseMode(g.CENTER_RADIUS);
		if (onStart) {
			g.pushMatrix();
			g.translate(w / 2, h / 2);
			onStart(g);
			g.popMatrix();
		}

		g.draw = function() {
			time.current = new Date().getTime() * .001 - time.start;
			time.elapsed = time.current - time.lastUpdate;
			time.frames++;

			onUpdate(time);
			time.lastUpdate = time.current;


			g.pushMatrix();
			g.translate(w / 2, h / 2);

			onDraw(g, time);
			g.popMatrix();

		};
	});

}