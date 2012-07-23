$(function(){

  Iframework.NativeNodes["image-combine"] = Iframework.NativeNodes["image"].extend({

    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NativeNodes["image-combine-view"]({model:this});
      return this.view;
    }

  });


  Iframework.NativeNodes["image-combine-view"] = Iframework.NativeNodes["image-view"].extend({

    info: {
      title: "image-combine",
      description: "native module test"
    },
    inputimage: function (image) {
      // console.log(this, i, Meemoo);
    },
    inputbang: function (i) {
      this.$(".info").text("bang!");
    },
    inputs: {
      image: {
        type: "image"
      },
      bang: {
        type: "bang"
      }
    },
    outputs: {
      image: {
        type: "image"
      },
      bang: {
        type: "bang"
      }
    }

  });


});
