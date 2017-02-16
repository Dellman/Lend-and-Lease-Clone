// Global variables
var myLoc;
var toolboxMarker;
var bookMarker;
var gameMarker
var toolbox = "Images/toolbox.png";
var books = "Images/books.png"
var games = "Images/games.png";
var contentString;
var typeInput;
var nameInput;
var myLat;
var myLng;
var locations = [];

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 60, lng: 20},
    zoom: 5
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myLat = position.coords.latitude;
      myLng = position.coords.longitude;
      var myPos = {
        lat: myLat,
        lng: myLng
      };
      console.log("User's Latitude: " + myLat);
      console.log("User's Longitude: " + myLng);
      myLoc = new google.maps.Marker({
        position: myPos,
        map: map,
      });
      // console.log(myLoc.myPos.lat);
      var tbPos = {
        lat: myPos.lat + 0.0002,
        lng: myPos.lng + 0.0009,
      };
      toolboxMarker = new google.maps.Marker({
        position: tbPos,
        icon: toolbox,
        map: map,
        title: "Toolbox",
        description: "An assortment of tools!"
      });
      var bPos = {
        lat: myPos.lat + 0.00025,
        lng: myPos.lng + 0.00012,
      };
      bookMarker = new google.maps.Marker({
        position: bPos,
        icon: books,
        map: map,
        title: "book",
        description: "Some books!"
      });
      var gPos = {
        lat: myPos.lat - 0.00015,
        lng: myPos.lng + 0.0010,
      };
      gameMarker = new google.maps.Marker({
        position: gPos,
        icon: games,
        map: map,
        title: "games",
        description: "A collection of fun games!"
      });
      map.setZoom(17);
      map.setCenter(myPos);

       locations.push(toolboxMarker);
       locations.push(bookMarker);
       locations.push(gameMarker);

      //  console.log(locations);

      //  google.maps.event.addListener(locations, 'click', function(){
      //    console.log("test");
      //  });

      // gameMarker.addListener('click', function(){
      //   infowindow.open(map, gameMarker);
      // });

      // Add onclick functions
      // toolboxMarker.addListener('click', showInfo(toolboxMarker));
      // bookMarker.addListener('click', showInfo(bookMarker));

      // Happens on load preventing "this" from working
      // gameMarker.addListener('click', showInfo(this));
      // gameMarker.addListener('click', showInfo(gameMarker));

      gameMarker.addListener('click', function(){
        contentString = "<h2 class='center'>" + gameMarker.title.toUpperCase() + "<h2><p>" + gameMarker.description + "</p>";
        popUp(gameMarker);
      });

      bookMarker.addListener('click', function(){
        contentString = "<h2 class='center'>" + bookMarker.title.toUpperCase() + "<h2><p>" + bookMarker.description + "</p>";
        popUp(bookMarker);
      });

      toolboxMarker.addListener('click', function(){
        contentString = "<h2 class='center'>" + toolboxMarker.title.toUpperCase() + "<h2><p>" + toolboxMarker.description + "</p>";
        popUp(gameMarker);
      });

      // new google.maps.event.trigger(gameMarker, 'click');

      // Custom functions

      // function showInfo(markerName)
      //   console.log(markerName);
      //   contentString = "<h2>" + markerName.title.toUpperCase() + "<h2><p>" + markerName.description + "</p>";
      //   console.log("Title: " + markerName.title);
      //   console.log("Description: " + markerName.description);
      //   infowindow.open(map, markerName);
      // }

      function popUp(marker){
        var infowindow = new google.maps.InfoWindow({
           content: contentString
         });
        infowindow.open(map, marker);
        console.log(contentString);
      }

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }



  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      // var icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      // Create a marker for each place.
      // markers.push(new google.maps.Marker({
      //   map: map,
      //   icon: icon,
      //   title: place.name,
      //   position: place.geometry.location
      // }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // End of init function
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }
