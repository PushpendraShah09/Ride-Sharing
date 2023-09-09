import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-riderpage',
  templateUrl: './riderpage.component.html',
  styleUrls: ['./riderpage.component.scss']
})
export class RiderpageComponent {
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: L.Map;
  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // Create the Leaflet map
    this.map = L.map(this.mapContainer.nativeElement).setView([51.505, -0.09], 13);

    // Add a base layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add the routing control
    L.Routing.control({
      waypoints: [
        L.latLng(51.505, -0.09), // Starting point
        L.latLng(51.51, -0.1)    // Ending point
      ],
    }).addTo(this.map);
  }

}
