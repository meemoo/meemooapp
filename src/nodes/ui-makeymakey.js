$(function(){

  var template = 
    '<img src="img/makeymakey.jpg" style="max-width:100%;" />'+
    '<div class="info"></div>'+
    '<label><input type="checkbox" class="active" checked /> active</label>';

  Iframework.NativeNodes["ui-makeymakey"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "makeymakey",
      description: "makeymakey board"
    },
    events: {
      "change .active": "changeActive"
    },
    initializeModule: function(){
      var self = this;

      Mousetrap.bind('space', function () {
        if (self._active) {
          self.sendSpace();
        }
      });

      Mousetrap.bind('up', function () {
        if (self._active) {
          self.sendUp();
        }
      });

      Mousetrap.bind('down', function () {
        if (self._active) {
          self.sendDown();
        }
      });

      Mousetrap.bind('right', function () {
        if (self._active) {
          self.sendRight();
        }
      });

      Mousetrap.bind('left', function () {
        if (self._active) {
          self.sendLeft();
        }
      });

      $(window).click(function (event) {
        if (self._active) {
          self.sendClick(event);
        }
      });
    },
    _active: true,
    changeActive: function(event){
      if (event.target.checked) {
        this._active = true;
      } else {
        this._active = false;
      }
    },
    sendSpace: function() {
      this.send("space", "bang");
      this.$(".info").text('Space!');
    },
    sendClick: function(evt) {
      this.send("click", "bang");
      this.$(".info").text('Click!');
    },
    sendUp: function() {
      this.send("up", "bang");
      this.$(".info").text('Up!');
    },
    sendDown: function() {
      this.send("down", "bang");
      this.$(".info").text('Down!');
    },
    sendLeft: function() {
      this.send("left", "bang");
      this.$(".info").text('Left!');
    },
    sendRight: function() {
      this.send("right", "bang");
      this.$(".info").text('Right!');
    },
    remove: function() {
      var keys = ['space', 'up', 'down', 'left', 'right'];
      for (var key in keys) {
        Mousetrap.unbind(key, 'keydown');
      }
      $(window).unbind('click');
    },
    outputs: {
      space: {
        type: "bang"
      },
      click: {
        type: "bang"
      },
      up: {
        type: "bang"
      },
      down: {
        type: "bang"
      },
      left: {
        type: "bang"
      },
      right: {
        type: "bang"
      }
    }
  });
});
