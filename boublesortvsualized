var numeros = [];
var x = 0;
var y = 0;
var aux;
var spd;
var slider;


function setup() {
  createCanvas(800, 600);
  for (var i = 0; i < width; i++) {
    numeros[i] = new float;
    numeros[i] = map(i, 0, width, 0, height);
  }
  slider = createSlider(0, width, 1, 1);
}

function draw() {
  background(20);
  stroke(255);
  spd = slider.value();

  if (keyCode === ENTER) {
    for (var i = 0; i < 15; i++) {
      var t = floor(random(width));
      var u = floor(random(width));
      var aux = numeros[t];
      numeros[t] = numeros[u];
      numeros[u] = aux;
      x = 0;
      y = 0;
    }
  } else {
    for (var j = 0; j < spd; j++) {
      if (y < width) {
        if (x < width - y) {
          if (numeros[x] > numeros[x + 1]) {
            aux = numeros[x];
            numeros[x] = numeros[x + 1];
            numeros[x + 1] = aux;
          }
          x++;
        } else {
          x = 0;
          y++;
        }
      }
    }
  }
  for (var i = 0; i < width; i++) {
    line(i, height, i, height - numeros[i]);
  }

}
