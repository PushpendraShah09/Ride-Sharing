import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-riderpage',
  templateUrl: './riderpage.component.html',
  styleUrls: ['./riderpage.component.scss']
})
export class RiderpageComponent implements OnInit,AfterViewInit  {

  bsModalRef: BsModalRef | undefined; // Declare bsModalRef property

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    //his.openModalOnInit();
  }

  

  openModalOnInit() {
    // Use Renderer2 to programmatically trigger the modal's 'show' method
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.renderer.addClass(modalElement, 'show');
      this.renderer.setStyle(modalElement, 'display', 'block');
    }
  }

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

  // ngOnInit(): void {
  //   $('#myModal').modal('show');
    
  // }

 

}
