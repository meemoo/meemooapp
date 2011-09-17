void setup() {
  size(300, 300);
  colorMode(HSB, 360, 100, height);
  noStroke();
  background(0);
}

void draw () {
}

void mousePressed () {
  fill(random(360), 180, 300);
  triangle(random(width), random(height), 100, 100, 200, 200);
}
