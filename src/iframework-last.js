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

});