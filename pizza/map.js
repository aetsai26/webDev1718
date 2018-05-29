
      var map, infoWindow, bounds;
      var markers=[];
      var locations;
      
      function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 41.881832, lng: -87.623177},
          zoom: 5
        });
        infoWindow = new google.maps.InfoWindow;
        bounds = new google.maps.LatLngBounds();
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            initSearch(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
        initSearch(pos);
      }
      
      
      function initSearch(pos){
        map.setCenter(pos);
            var image = {
              url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
              // This marker is 20 pixels wide by 32 pixels high.
              size: new google.maps.Size(20, 32),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(0, 32)
            };
            var lMarker= new google.maps.Marker({
                map: map,
                position: pos,
                icon: image,
                draggable: true
            });
            findNearby(pos);
            google.maps.event.addListener(lMarker, 'mouseup', function() {
                for(var i=0; i<markers.length; i++){
                    markers[i].setMap(null);
                }
                markers=[];
                bounds= new google.maps.LatLngBounds();
                pos=lMarker.position;
                findNearby(pos);
            });
      }
      
      
      
      function findNearby(location){
        bounds.extend(location);
        var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: location,
                radius: 1500,
                type: ['restaurant'],
                keyword: 'pizza'
            }, callback);  
      }
      
      function callback(results, status) {
        console.log(results);
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            if(results[i].rating>0){
              createMarker(results[i]);
            }
          }
          map.fitBounds(bounds);
        }
      }
      function createMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        bounds.extend(place.geometry.location);
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(place.name);
          infoWindow.open(map, this);
          
        });
        markers.push(marker);
      }