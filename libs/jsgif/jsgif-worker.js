importScripts('LZWEncoder.js', 'NeuQuant.js', 'GIFEncoder.js'); 

self.onmessage = function(event) {
  var frames = event.data.frames;

  var encoder = new GIFEncoder();
  encoder.setRepeat(0); // loop
  encoder.setQuality(10); // 1 slow and good, 10 ok, 20 fast and bad
  encoder.setSize(event.data.frames[0].width, event.data.frames[0].height);
  encoder.setDelay(event.data.delay);
  // TODO transparent

  var startTime = Date.now();

  encoder.start();

  var framesLength = frames.length;
  for (var i = 0; i<framesLength; i++) {
    encoder.addFrame(frames[i].data, true);
    self.postMessage( {type: "progress", data: Math.round( (i+1)/framesLength*100 ) } );
  }

  encoder.finish();

  self.postMessage({
    type: "gif", 
    data: encoder.stream().getData(),
    frameCount: framesLength,
    encodeTime: Math.round( (Date.now()-startTime)/10 ) / 100
  });
};