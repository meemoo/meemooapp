// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var randomPlusOrMinus = function(range){
    return Math.random()*range*2-range;
  };

  Iframework.NativeNodes["image-particles"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "particles",
      description: "make a stream of particles from an image or spritesheet"
    },
    events: {
      "click .start" : "inputstart",
      "click .stop"  : "inputstop"
    },
    initializeModule: function(){
      // this.showResizer(20,20,0.5);
      this.particles = [];
      this.context.fillStyle = "black";

      this.$(".info").append(
        '<button class="start">start</button>'+
        '<button class="stop">stop</button>'
      );
      this.$("button").button();
    },
    _sizeChanged: false,
    inputwidth: function (w) {
      this._width = w;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    inputheight: function (h) {
      this._height = h;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    _xAccel: 0,
    _yAccel: 0,
    inputaccelAngle: function(angle){
      this._accelAngle = angle;
      this.calcAccel();
    },
    inputaccelSpeed: function(speed){
      this._accelSpeed = speed;
      this.calcAccel();
    },
    calcAccel: function(){
      var angle = (this._accelAngle-0.25)*2*Math.PI;
      this._xAccel = this._accelSpeed * Math.cos(angle);
      this._yAccel = this._accelSpeed * Math.sin(angle);      
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
      }
      if (edge.Target.id === "animation") {
        this._animation = null;
      }
    },
    _oneWidth: 0,
    _oneHeight: 0,
    inputimage: function(image){
      this._image = image;
      this._oneWidth = image.width;
      this._oneHeight = image.height;
    },
    _ms: 1000/12,
    inputanimation: function(a){
      this._animation = a;
      this._ms = 1000/a.fps;
      this._oneWidth = a.width;
      this._oneHeight = a.height;
    },
    _lastTime: 0,
    _spawnNext: 0,
    redraw: function(timestamp){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._sizeChanged) {
        if (this.canvas.width !== this._width) {
          this.canvas.width = this._width;
        }
        if (this.canvas.height !== this._height) {
          this.canvas.height = this._height;
        }
        this._sizeChanged = false;
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Time diff
      if (this._lastTime > 0) {
        // spawnRate is particles per second
        // var timeDiff = timestamp - this._lastTime;
        this._spawnNext += Math.min( this._spawnRate/10, (this._spawnRate*((timestamp-this._lastTime)/1000)) );
      }
      this._lastTime = timestamp;

      // Spawn new particles
      while (this.particles.length < this._maxParticles && this._spawnNext > 1) {
        var angle = (this._angle-0.25 + randomPlusOrMinus(this._angleSpread))*2*Math.PI;
        var velocity = this._speed + randomPlusOrMinus(this._speedSpread);
        // Offset initial position to center images
        var offsetX = 0;
        var offsetY = 0;
        if (this._image) {
          offsetX = Math.floor(this._image.width/2);
          offsetY = Math.floor(this._image.height/2);
        } else if (this._animation && this._animation.frames.length>0) {
          offsetX = Math.floor(this._animation.frames[0].width/2);
          offsetY = Math.floor(this._animation.frames[0].height/2);
        }
        this.particles.push({
          born: timestamp,
          x: this._x - offsetX + randomPlusOrMinus(this._xSpread),
          y: this._y - offsetY + randomPlusOrMinus(this._ySpread),
          xVel: velocity * Math.cos(angle),
          yVel: velocity * Math.sin(angle),
          angle: angle,
          frame: 0,
          lastFrame: timestamp
        });
        this._spawnNext-=1;
      }

      // Delete extra
      while (this.particles.length > this._maxParticles) {
        this.particles.pop();
      }

      for(var i=0; i<this.particles.length; i++) {
        var particle = this.particles[i];
        // Draw particles
        var draw = null;
        if (this._animation && this._animation.length>0) {
          if (timestamp-particle.lastFrame>=this._ms) {
            // Advance animation frame
            particle.frame++;
            if (particle.frame>=this._animation.length) {
              // Loop
              particle.frame = 0;
            }
            particle.lastFrame = timestamp;
          }
          draw = this._animation.frames[particle.frame];
        } else if (this._image) {
          draw = this._image;
        }

        this.context.translate(particle.x, particle.y);
        if (this._matchAngle) { this.context.rotate(particle.angle); }
        if (draw) {
          this.context.drawImage(draw, 0 - (this._oneWidth/2), 0 - (this._oneHeight/2));
        } else {
          this.context.fillRect(0-5, 0-5, 10, 10);
        }
        if (this._matchAngle) { this.context.rotate(-particle.angle); }
        this.context.translate(-particle.x, -particle.y);

        // Advance particles
        particle.x += particle.xVel;
        particle.y += particle.yVel;
        particle.xVel += this._xAccel;
        particle.yVel += this._yAccel;
        if (this._wander > 0) {
          particle.xVel += randomPlusOrMinus(this._wander);
          particle.yVel += randomPlusOrMinus(this._wander);
        }
        if (this._matchAngle) {
          particle.angle = Math.atan2(particle.yVel, particle.xVel); 
        }

        var kill = false;
        var halfW = this._oneWidth;
        var halfH = this._oneHeight;
        if (particle.x > this._width + halfW) {
          particle.x = 0 - halfW;
          kill = true;
        }
        if (particle.x < 0 - halfW) {
          particle.x = this._width + halfW;
          kill = true;
        }
        if (particle.y > this._height + halfH) {
          particle.y = 0 - halfH;
          kill = true;
        }
        if (particle.y < 0 - halfH) {
          particle.y = this._height + halfH;
          kill = true;
        }

        if (!this._loop) {
          if (this._life > 0 && timestamp-particle.born >= this._life) {
            kill = true;
          }
          if (kill) {
            // Kill it
            this.particles.splice(i, 1);
            i--;
          }
        }
      }

      this.send("image", this.canvas);
    },
    inputspawn: function(i){
      this._spawnNext = i;
    },
    inputspawnRate: function(r){
      this._spawnRate = r;
      this._spawnNext = 0;
    },
    inputlife: function(s){
      // Seconds to ms
      this._life = s*1000;
    },
    _running: false,
    inputstart: function(){
      this._running = true;
      this._spawnNext = 0;
    },
    inputstop: function(){
      this._running = false;
      this.particles = [];
    },
    _sendNext: false,
    inputsend: function(){
      this._sendNext = true;
    },
    renderAnimationFrame: function (timestamp) {
      if (this._running){
        this.redraw(timestamp);
        this._lastRedraw = timestamp;
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "make particles from image"
      },
      animation: {
        type: "animation",
        description: "make particles from animation"
      },
      width: {
        type: "int",
        description: "canvas width",
        min: 1,
        "default": 500
      },
      height: {
        type: "int",
        description: "canvas height",
        min: 1,
        "default": 500
      },
      x: {
        type: "float",
        description: "start x",
        "default": 250
      },
      y: {
        type: "float",
        description: "start y",
        "default": 250
      },
      xSpread: {
        type: "float",
        description: "start x spread",
        "default": 0
      },
      ySpread: {
        type: "float",
        description: "start y spread",
        "default": 0
      },
      angle: {
        type: "float",
        description: "start angle",
        "default": 0
      },
      angleSpread: {
        type: "float",
        description: "start angle variance",
        "default": 0.1
      },
      matchAngle: {
        type: "boolean",
        description: "turn sprite to match direction",
        "default": false
      },
      speed: {
        type: "float",
        description: "start speed",
        "default": 10
      },
      speedSpread: {
        type: "float",
        description: "start spread variance",
        "default": 0
      },
      wander: {
        type: "float",
        description: "randomize speed by this much every frame",
        "default": 0,
        min: 0
      },
      accelAngle: {
        type: "float",
        description: "acceleration angle",
        "default": 0.5
      },
      accelSpeed: {
        type: "float",
        description: "acceleration speed",
        "default": 1
      },
      spawn: {
        type: "float",
        description: "spawn this number of particles now",
        "default": 0
      },
      spawnRate: {
        type: "float",
        description: "emit speed in particles per second",
        "default": 10
      },
      maxParticles: {
        type: "int",
        description: "max particles in system",
        "default": 100
      },
      life: {
        type: "float",
        description: "particle lifetime in seconds (0 will live until off edge)",
        "default": 1
      },
      loop: {
        type: "boolean",
        description: "loop around to the other side (ignores life)",
        "default": false
      },
      start: {
        type: "bang",
        description: "start the particle animation"
      },
      stop: {
        type: "bang",
        description: "stop the particle animation"
      },
      send: {
        type: "bang",
        description: "send the next image"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
