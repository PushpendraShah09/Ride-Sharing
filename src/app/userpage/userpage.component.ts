import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent implements OnInit {
  userLocation: any;
  userLocationMarker: any;
  searchQuery: string = '';
  routeControl: any;
  searchLocationMarker: any;
  // routeControl: L.Routing.Control | null = null;

  constructor(public hs: HeroService, public router: Router) {}

  map!: L.Map;
  markers: L.Marker[] = [];
 

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 26.895905, lng: 75.726973 },
        draggable: true,
      },
      {
        position: { lat: 26.895705, lng: 75.726567 },
        draggable: false,
      },
      {
        position: { lat: 26.896123, lng: 75.726467 },
        draggable: true,
      },
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker
        .addTo(this.map)
        .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker);
    }
  }

  generateMarker(data: any, index: number) {
    return L.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: L.Map) {
    debugger;
    this.map = $event;
    // this.initMarkers();
  }

  mapClicked($event: any) {
    debugger;
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    debugger;
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

  ngOnInit(): void {
    this.map = L.map('map').setView([0, 0], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.getUserLocation();
    this.initMarkers();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Current Location: Lat: ${lat}, Lng: ${lng}`);
        const userLocation = { lat, lng };

        this.map.setView([lat, lng], 16);

        if (this.userLocationMarker) {
          this.map.removeLayer(this.userLocationMarker);
        }
        this.userLocationMarker = L.marker(userLocation).addTo(this.map);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  returnToCurrentLocation() {
    if (this.userLocationMarker) {
      const markerLatLng = this.userLocationMarker.getLatLng();
      this.map.setView(markerLatLng, 16);
    }
  }

  searchLocation() {
    debugger;
    const searchEndpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery}&limit=1`;

    fetch(searchEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);

          this.map.setView([lat, lon], 16);

          this.searchLocationMarker = L.marker([lat, lon]).addTo(this.map);
        } else {
          console.error('Location not found');
        }
      })
      .catch((error) => {
        console.error('Error searching for location:', error);
      });
  }


  distanceInKilometersString: string = '';
  bikepriceInRupeesString: string ='';
  AutopriceInRupeesString: string ='';
  cabpriceInRupeesString: string ='';
  createRoute() {
    debugger;
    if (this.userLocationMarker && this.searchLocationMarker) {
      const userLatLng = this.userLocationMarker.getLatLng();
      const searchLatLng = this.searchLocationMarker.getLatLng();

      var routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLatLng.lat, userLatLng.lng),
          L.latLng(searchLatLng.lat, searchLatLng.lng),
        ],
        routeWhileDragging: true,
        showAlternatives: true,  
        
      })
      .on('routesfound', (e) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {

          // for getting distance of route
          const distanceInMeters = routes[0].summary.totalDistance; 
          const distanceInKilometers = distanceInMeters / 1000; 
          this.distanceInKilometersString = distanceInKilometers.toFixed(2) + ' km';
          console.log('Total Distance:', distanceInKilometers.toFixed(2), 'km');

        // Calculate the price for bike
        const BikepriceInRupees = (distanceInMeters / 1000) * 5;
        this.bikepriceInRupeesString = BikepriceInRupees.toFixed(2) + '₹';
        console.log('Price:', BikepriceInRupees.toFixed(2), '₹');

        // Calculate the price for Auto
        const AutopriceInRupees = (distanceInMeters / 1000) * 8;
        this.AutopriceInRupeesString = AutopriceInRupees.toFixed(2) + '₹';

        // Calculate the price for cab
        const CabpriceInRupees = (distanceInMeters / 1000) * 12;
        this.cabpriceInRupeesString = CabpriceInRupees.toFixed(2) + '₹';
        }
      }).addTo(this.map);

      const bounds = L.latLngBounds(
        L.latLng(userLatLng.lat, userLatLng.lng),
        L.latLng(searchLatLng.lat, searchLatLng.lng)
      );
      this.map.fitBounds(bounds);
      this.map.setView(bounds.getCenter());
    } else {
      console.error('Both user and search location markers must be set.');
    }
  }
  
}
