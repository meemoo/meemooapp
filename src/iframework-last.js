$(function(){

  // Start
  Iframework.allLoaded();

  // Bind shortcuts
  Mousetrap.bind(['command+a', 'ctrl+a'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      e.preventDefault();
      Iframework.shownGraph.view.selectAll();
    }
  });

  Mousetrap.bind(['command+x', 'ctrl+x'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.cut();
    }
  });

  Mousetrap.bind(['command+c', 'ctrl+c'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.copy();
    }
  });

  Mousetrap.bind(['command+v', 'ctrl+v'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.paste();
    }
  });

  // Mousetrap.bind('del', function(e) {
  //   if (Iframework.shownGraph && Iframework.shownGraph.view) {
  //     e.preventDefault();
  //     Iframework.shownGraph.view.deleteSelected();
  //   }
  // });

});