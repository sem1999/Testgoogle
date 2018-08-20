import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
 
export class HomePage {
	 public latitude: any;
    public longitude: any;
	Destination: any = '';
  MyLocation: any;
    map: any;
 
    constructor(public navCtrl: NavController, public geolocation: Geolocation) {
	}
	
    /* Initialize the map only when Ion View is loaded */
    ionViewDidLoad(){
        this.initializeMap();
		
	}
 
    initializeMap() {
 
        let locationOptions = {timeout: 10000, enableHighAccuracy: true};
 
        this.geolocation.getCurrentPosition(locationOptions).then((position) => {
 
            let options = {
              center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
 
            /* Show our lcoation */
            this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
 
            /* We can show our location only if map was previously initialized */
            this.showMyLocation();
 
        }).catch((error) => {
          console.log('Error getting location', error);
        });
    } 
 
  
    showMyLocation(){
		
 
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });
 
        let markerInfo = "<h4>You are here!</h4>";         
 
        let infoModal = new google.maps.InfoWindow({
            content: markerInfo
        });
 
        google.maps.event.addListener(marker, 'click', () => {
            infoModal.open(this.map, marker);
        });
    }
	
	 calculateAndDisplayRoute() {
    let that = this;
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    const map = new google.maps.Map(document.getElementById('map_canvas'), {
      zoom: 7,
          });
    directionsDisplay.setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        that.MyLocation = new google.maps.LatLng(pos);

      }, function() {

      });
    } else {
      // Browser doesn't support Geolocation
    }

    directionsService.route({
    origin: this.MyLocation,
    destination: this.Destination,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

     
}