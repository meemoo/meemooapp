$( function () {

  var template = $(
    '<div>'+
      '<div class="controls">'+
        '<form class="addbyurl">'+
          '<input class="addbyurlinput" name="addbyurlinput" placeholder="search or url" type="text" />'+
          '<button class="addbyurlsubmit icon-ok" type="submit">load</button>'+
        '</form>'+
      '</div>'+
      '<div class="listing">'+
      '</div>'+
    '</div>'
  );

  // Add menu
  Iframework.addMenu("library", template, "icon-plus");

  Iframework.loadLibrary = function (library) {

    var autocompleteData = [];

    var accordion = $("<div></div>");

    for (var category in library) {
      if (!library.hasOwnProperty(category)){continue;}
      var section = $('<div class="library-section"></div>');

      // section title
      section.append( $('<h3><a href="#">'+category+"</a></h3>") );

      // section items
      var sectionDiv = $("<div></div>");
      var modules = library[category];
      for (var i = 0; i<modules.length; i++) {
        var module = new Iframework.Module(modules[i]);
        // this.Library.add(module);

        module.initializeView();
        sectionDiv.append(module.view.$el);

        var autocompleteDataItem = {
          value: module.get("src"),
          label: module.get("info").title + " - " + module.get("info").description + " - " + module.get("src"),
          title: module.get("info").title,
          description: module.get("info").description + " - " + module.get("src")
        };
        autocompleteData.push(autocompleteDataItem);
      }
      section.append( sectionDiv );
      accordion.append( section );
    }

    template.find('.listing').append(accordion);
    accordion.children(".library-section")
      .accordion({
        animate: false,
        header: "h3",
        heightStyle: "content",
        collapsible: true,
        active: false
      });

    template.find('.addbyurlinput')
      .autocomplete({
        minLength: 1,
        source: autocompleteData,
        select: function( event, ui ) {
          _.defer(function(){
            Iframework.addByUrl();
          });
        }
      })
      .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        // Custom display
        return $( "<li>" )
          .append( '<a><span style="font-size:120%;">' + item.title + "</span><br>" + item.description + "</a>" )
          .appendTo( ul );
      };
  };

  var addByUrl = Iframework.addByUrl = function() {
    var addByUrlInput = Iframework.$(".addbyurlinput");
    addByUrlInput.blur();

    var url = addByUrlInput.val();
    if (url !== "") {
      var graphEl = Iframework.$(".graph");
      Iframework.shownGraph.addNode({
        "src": url,
        "x": Math.floor(graphEl.scrollLeft() + graphEl.width()/2) - 100,
        "y": Math.floor(graphEl.scrollTop() + graphEl.height()/2) - 100
      });
      addByUrlInput
        .val("")
        .attr("placeholder", "loading...");
      window.setTimeout(function(){
        addByUrlInput
          .attr("placeholder", "search or url");
      }, 1000);
    }
    return false;
  };

  // Form submit action
  template.find(".addbyurl").submit(function(){
    addByUrl();
    return false;
  });

 
  // var library = $('<ul class="dataflow-plugin-library" style="list-style:none; padding-left:0" />');

  // var addNode = function(node, x, y) {
  //   return function(){
  //     // Deselect others
  //     Iframework.currentGraph.view.$(".node").removeClass("ui-selected");
  //     // Find vacant id
  //     var id = 1;
  //     while (Iframework.currentGraph.nodes.get(id)){
  //       id++;
  //     }
  //     // Position
  //     if (x===undefined) {
  //       x = window.scrollX - 100 + Math.floor($(window).width()/2);
  //     }
  //     if (y===undefined) {
  //       y = window.scrollY - 100 + Math.floor($(window).height()/2);
  //     }
  //     // Add node
  //     var newNode = new node.Model({
  //       id: id,
  //       x: x,
  //       y: y,
  //       parentGraph: Iframework.currentGraph
  //     });
  //     Iframework.currentGraph.nodes.add(newNode);
  //     // Select and bring to top
  //     newNode.view.select();
  //   };
  // };

  // var update = function(options){
  //   options = options ? options : {};
  //   options.exclude = options.exclude ? options.exclude : ["base", "base-resizable"];

  //   library.empty();
  //   _.each(Iframework.nodes, function(node, index){
  //     if (options.exclude.indexOf(index) === -1) {
  //       var addButton = $('<a class="button">+</a>')
  //         .attr("title", "click or drag")
  //         .draggable({
  //           helper: function(){
  //             return $('<div class="node helper" style="width:100px; height:100px">'+index+'</div>');
  //           },
  //           stop: function(event, ui) {
  //             addNode(node, ui.position.left, ui.position.top).call();
  //           }
  //         })
  //         .click(addNode(node));
  //       var item = $("<li />")
  //         .append(addButton)
  //         .append(index);
  //         // .append(drag);
  //       library.append(item);
  //     }
  //   });
  // };
  // update();

  // Iframework.addPlugin("library", library);

  // Iframework.plugins.library.update = update;

} );
