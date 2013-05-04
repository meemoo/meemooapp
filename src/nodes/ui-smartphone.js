$(function(){

  var template = 
    '<div class="gamepad" style="display:none;"><img src="libs/muzzley-gamepad.jpg" style="max-width:100%;"></div>'+
    '<div><img class="muzzley-qr" style="max-width:100%;"></div>'+
    '<div class="muzzley-id"></div>'+
    '<div class="info"></div>';

  var muzzleyAppToken = "45aba5e8fe6165a5";

  Iframework.NativeNodes["ui-smartphone"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "smartphone",
      description: "iOS or Android smartphone gamepad controller via muzzley.com"
    },
    events: {
    },
    initializeModule: function(){
      if (window.muzzley) {
        this.setupMuzzley();
      } else {
        var self = this;
        yepnope({
          load: "libs/muzzley-client-0.2.0.min.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    setupMuzzley: function(){
      var self = this;

      muzzley.on('error', function(err) {
        self.$(".info").text('Muzzley service error :-( ' + err);
      });

      muzzley.connectApp(muzzleyAppToken, function(err, activity) {
        if (err) {
          self.$(".info").text('Muzzley connection error :-( ' + err);
          return;
        }

        // Show this Activity's QR code image and id
        // console.log(activity);
        self.$(".muzzley-qr")[0].src = activity.qrCodeUrl;
        self.$(".muzzley-id").text('Muzzley id: ' + activity.activityId);

        activity.on('participantQuit', function(participant) {
          // A participant quit
        });

        activity.on('participantJoin', function(participant) {

          // A participant joined. Tell him to transform into a gamepad.
          participant.changeWidget('gamepad', function (err) {
            if (err) {
              self.$(".info").text('Muzzley widget error :-( ' + err);
              self.$(".gamepad").hide();
              return;
            }
            self.$(".gamepad").show();
          });

          participant.on('action', function (action) {
            // The action object represents the participant's interaction.
            // In this case it might be "button 'a' was pressed".
            self.action(action);
          });

          participant.on('quit', function (action) {
            self.$(".gamepad").hide();
            // You can also check for participant quit events
            // directly in each participant object.
          });

        });
      });
    },
    action: function (a) {
      if (a.e === "release") { return; }
      switch (a.c) {
        case "jl":
          var angle = (90-a.v) / 360 % 1;
          this.send("joystick", angle);
          break;
        case "ba":
          this.send("button1", "!");
          break;
        case "bb":
          this.send("button2", "!");
          break;
        case "bc":
          this.send("button3", "!");
          break;
        case "bd":
          this.send("button4", "!");
          break;
        default:
          break;
      }
    },
    outputs: {
      joystick: {
        description: "joystick angle",
        type: "float"
      },
      button1: {
        type: "bang"
      },
      button2: {
        type: "bang"
      },
      button3: {
        type: "bang"
      },
      button4: {
        type: "bang"
      }
    }
  });
});
