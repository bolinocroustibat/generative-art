let seed;
let rects = [];

const colors = [
		"#a7ba42",
		"#95ccba",
		"#ffdede",
		"#fff0cb",
		"#f2cc84",
		"#9e6e5d",
		"#b8e5db",
		"#f8dcd2",
		"#ceb37c",
		"#9c99a5",
		"#ffe8b5",
		"#d3d0cb",
	]

function setup() {
  createCanvas(960, 960, WEBGL);
  smooth(16);
  pixelDensity(2);
  generate();
}

function draw() {
  // if (frameCount % 60 == 0) generate();
  // generate();
}

function keyPressed() {
  if (key === 's') saveImage();
  else {
    seed = floor(random(999999));
    generate();
  }
}

function generate() {
  background(0);
  randomSeed(seed);

  let fov = PI / random(1.4, 4);
  let cameraZ = (height / 2.0) / tan(fov / 2.0);
  perspective(fov, width / height, cameraZ / 100.0, cameraZ * 100.0);

  translate(width / 2, height / 2, -900);
  let ma = PI * 0.3;
  rotateX(random(-ma, ma));
  rotateY(random(-ma, ma));
  rotateZ(random(-ma, ma));

  let size = 5;
  rects = [];
  rects.push(createVector(-width * size * 0.5, -height * size * 0.5, width * size));
  let sub = floor(random(20, 1000));
  for (let i = 0; i < sub; i++) {
    let ind = floor(random(rects.length * random(1)));
    let r = rects[ind];
    let md = r.z * 0.5;
    rects.push(createVector(r.x, r.y, md));
    rects.push(createVector(r.x + md, r.y, md));
    rects.push(createVector(r.x + md, r.y + md, md));
    rects.push(createVector(r.x, r.y + md, md));
    rects.splice(ind, 1);
  }

  for (let i = 0; i < rects.length; i++) {
    let r = rects[i];
    rect(r.x, r.y, r.z, r.z);
    let hh = r.z * 1;
    let cx = r.x + r.z * 0.5;
    let cy = r.y + r.z * 0.5;
    let div = floor(random(2, 12));

    let xs = [r.x, r.x + r.z, r.x + r.z, r.x];
    let ys = [r.y, r.y, r.y + r.z, r.y + r.z];

    fill(100);
    stroke(255);

    noStroke();
    for (let j = 0; j < div; j++) {
      let v1 = map(j, 0, div, 0, 1);
      let v2 = map(j + 1, 0, div, 0, 1);

      for (let k = 0; k < 4; k++) {
        let x1 = lerp(xs[k], xs[(k + 1) % 4], v1);
        let y1 = lerp(ys[k], ys[(k + 1) % 4], v1);
        let x2 = lerp(xs[k], xs[(k + 1) % 4], v2);
        let y2 = lerp(ys[k], ys[(k + 1) % 4], v2);

        beginShape();
        fill(getRandomColor());
        vertex(cx, cy, hh * 0.5);
        fill(getRandomColor());
        vertex(x1, y1, hh);
        vertex(x2, y2, hh);
        endShape();

        beginShape();
        fill(getRandomColor());
        vertex(x1, y1, 0);
        vertex(x2, y2, 0);
        fill(getRandomColor());
        vertex(x2, y2, hh);
        vertex(x1, y1, hh);
        endShape();
      }
    }

  }
}

function saveImage() {
  let timestamp =
    year() +
    nf(month(), 2) +
    nf(day(), 2) +
    '-' +
    nf(hour(), 2) +
    nf(minute(), 2) +
    nf(second(), 2);
  saveCanvas(timestamp, 'png');
}

/**
 * Returns a random color from the palette
 */
function getRandomColor() {
  const palette = window.colorPalettes.royalTenenbaums;
  return color(palette[floor(random(palette.length))]);
}

/**
 * Returns an interpolated color based on a random position in the palette
 */
function getInterpolatedRandomColor() {
  const palette = window.colorPalettes.royalTenenbaums;
  return getInterpolatedColor(random(palette.length));
}

/**
 * Returns an interpolated color between two adjacent colors in the palette
 * @param {number} position - Position in the color palette (can be fractional)
 * @returns {p5.Color} Interpolated color
 */
function getInterpolatedColor(position) {
  const palette = window.colorPalettes.royalTenenbaums;
  position = abs(position);
  position = position % palette.length;
  let c1 = palette[floor(position % palette.length)];
  let c2 = palette[floor((position + 1) % palette.length)];
  return lerpColor(color(c1), color(c2), position % 1);
}
