( function(Iframework) {

  var template = $(
    '<button onclick="TowTruck(this); return false;">Start TowTruck</button>'
  );

  // Add menu
  Iframework.addMenu("towtruck", template, "icon-globe-1");

  yepnope({
    load: "https://towtruck.mozillalabs.com/towtruck.js"
  });

}(Iframework) );
