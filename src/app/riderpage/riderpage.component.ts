import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-riderpage',
  templateUrl: './riderpage.component.html',
  styleUrls: ['./riderpage.component.scss']
})

export class RiderpageComponent implements OnInit {

  map!: L.Map;
  markers: L.Marker[] = [];
  RiderMarker:any;

constructor( public hs: HeroService, public router: Router ) {}
 
 UserName:any;
  ngOnInit(): void {
    this.UserName = localStorage.getItem('UserName');
    this.GetMap();

    this.GetRiderInfoBYName();
    debugger
    $('#exampleModal').modal('show');
  }



  RiderInfo:any;
  GetRiderInfoBYName(){
    const that = this;
    debugger;
    this.hs
      .ajax(
        'GetRiderInfoBYName',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          RiderName: this.UserName,
        }
      )
      .then((resp) => {
        this.RiderInfo = this.hs.xmltojson(resp, 'rider_master_ridesharing');
        console.log('Rider Info ->', this.RiderInfo);
      });
  }

GetMap(){
  this.map = L.map('map').setView([0, 0], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);


    this.RiderLocationMarker();
    this.initMarkers(); 
    this.RouteLocation() 

}


  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 26.8241, lng: 75.8059 },
        draggable: false,
      },
      {
        position: { lat: 26.9855, lng: 75.8513 },
        draggable: true,
      },
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      debugger;
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker
        .addTo(this.map)
        .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker);
    }  
  }
 
  RouteLocation(){
     // Add the routing control
     L.Routing.control({
      waypoints: [
        L.latLng(26.8849, 75.7675), // Starting point
        L.latLng(26.8241, 75.8059),    // Mid point
        L.latLng(26.9855, 75.8513)    // End point
      ],
    }).addTo(this.map);
  }

  generateMarker(data: any, index: number) {
    return L.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }


  markerClicked($event: any, index: number) {
    debugger;
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }


  RiderLocationMarker(){

    const customMarkerIcon = L.icon({
      iconUrl: '../../assets/Images/bike.png',
      iconSize: [48, 48], 
      iconAnchor: [20, 48], 
    });

    this.map.setView([26.8849, 75.7675], 12);

    this.RiderMarker = L.marker([26.8849, 75.7675],{ icon: customMarkerIcon }).addTo(this.map);
  }
}
