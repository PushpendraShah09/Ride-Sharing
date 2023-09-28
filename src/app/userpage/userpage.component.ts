import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  NewSearchLocationMarker: any;
  searchResults: any[] = [];
  selectedLocation: any;
  activeDiv: string | null = null;
  // routeControl: L.Routing.Control | null = null;
  toggleActiveDiv(divName: string): void {
    this.activeDiv = this.activeDiv === divName ? null : divName;
  }
  cancelFlag:Boolean = true;
  bookRideFlag:Boolean = false;

  constructor(
    public hs: HeroService,
    public router: Router,
    private httpClient: HttpClient
  ) {}

  map!: L.Map;
  markers: L.Marker[] = [];

  // initMarkers() {
  //   const initialMarkers = [
  //     {
  //       position: { lat:  26.9117507, lng: 75.7515502 },
  //       draggable: true,
  //     },
  //     {
  //       position: { lat:  26.9117507, lng: 75.726567 },
  //       draggable: false,
  //     },
  //     {
  //       position: { lat:  26.9117507, lng: 75.7521542 },
  //       draggable: true,
  //     },
  //   ];
  //   for (let index = 0; index < initialMarkers.length; index++) {
  //     const data = initialMarkers[index];
  //     const marker = this.generateMarker(data, index);
  //     marker
  //       .addTo(this.map)
  //       .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
  //     this.map.panTo(data.position);
  //     this.markers.push(marker);
  //   }
  // }

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

  UserName: any;
  ngOnInit(): void {
    this.UserName = localStorage.getItem('UserName');
    console.log(this.UserName);

    this.GetUserInfoByUserName();
    //this.CurrentDate();

    this.map = L.map('map').setView([0, 0], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.getUserLocation();
    //this.initMarkers();
    //this.RiderLocationMarker();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Current Location: Lat: ${lat}, Lng: ${lng}`);
        const userLocation = { lat, lng };
        this.clearMarkers();

        // Set the map view and add a new user location marker
        this.map.setView([lat, lng], 16);
        this.userLocationMarker = L.marker(userLocation).addTo(this.map);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  // Add the following method to clear previous markers
  clearMarkers() {
    if (this.userLocationMarker) {
      this.map.removeLayer(this.userLocationMarker);
    }
    if (this.searchLocationMarker) {
      this.map.removeLayer(this.searchLocationMarker);
    }
    if (this.NewSearchLocationMarker) {
      this.map.removeLayer(this.NewSearchLocationMarker);
    }
    if (this.RiderMarker) {
      this.map.removeLayer(this.RiderMarker);
    }
  }

  latitude: number = 0;
  longitude: number = 0;
  currentLocation: string = '';

  returnToCurrentLocation() {
    this.getUserLocation();

    if (this.NewSearchLocationMarker) {
      this.NewSearchLocationMarker.remove();
      this.NewSearchLocationMarker = null;
      this.map.removeLayer(this.NewSearchLocationMarker);
    }

    if (this.userLocationMarker) {
      const markerLatLng = this.userLocationMarker.getLatLng();
      this.map.setView(markerLatLng, 16);
    }
    this.getLocation();
  }

  nativeCity: any;
  getLocation(): void {
    debugger;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // Call the Photon API without the 'format' query parameter
        const apiUrl = `https://photon.komoot.io/reverse?lat=${this.latitude}&lon=${this.longitude}`;

        this.httpClient.get(apiUrl).subscribe((data: any) => {
          debugger;
          // Access the address components you need from the response data
          this.currentLocation = data.features[0].properties.county;
          this.nativeCity = data.features[0].properties.city;
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  searchLocation(val: any) {

    const searchEndpoint = `https://photon.komoot.io/api/?q=${val}&limit=1`;

    fetch(searchEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          debugger;
          const result = data.features[0];
          const coordinates = result.geometry.coordinates; // [lon, lat]
          const lat = coordinates[1];
          const lon = coordinates[0];

          // Clear existing markers if needed
          if (this.searchLocationMarker) {
            this.map.removeLayer(this.searchLocationMarker);
          }

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

  NewsearchLocation(val: string) {
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
      this.userLocationMarker = null;
      this.map.removeLayer(this.userLocationMarker);
    }

    const searchEndpoint = `https://photon.komoot.io/api/?q=${val}&limit=1`;

    this.httpClient.get(searchEndpoint).subscribe(
      (data: any) => {
        if (data.features.length > 0) {
          const result = data.features[0];
          const coordinates = result.geometry.coordinates; // [lon, lat]
          const lat = coordinates[1];
          const lon = coordinates[0];
          this.nativeCity = data.features[0].properties.county;
          this.clearMarkers();

          this.map.setView([lat, lon], 16);

          if (this.NewSearchLocationMarker) {
            this.NewSearchLocationMarker.remove();
            this.NewSearchLocationMarker = null;
          }

          this.NewSearchLocationMarker = L.marker([lat, lon]).addTo(this.map);
        } else {
          console.error('Location not found');
        }
      },
      (error: any) => {
        console.error('Error searching for location:', error);
      }
    );
  }

  temp: number = 0;

  onKeyUp(event: Event): void {
    // Access the input value from the event object
    const inputElement = event.target as HTMLInputElement;
    this.currentLocation = inputElement.value;
    this.temp = 1;
    // Perform additional actions if needed
    //this.searchLocation(this.currentLocation);
  }

  distanceInKilometersString: string = '';
  bikepriceInRupeesString: string = '';
  AutopriceInRupeesString: string = '';
  cabpriceInRupeesString: string = '';
  routingControl: any;

  fromlocation: any = {};
  tolocation: any = {};
  createRoute() {
    debugger;

    if (this.userLocationMarker && this.searchLocationMarker) {
      debugger;
      var userLatLng = this.userLocationMarker.getLatLng();
      var searchLatLng = this.searchLocationMarker.getLatLng();

      this.fromlocation = userLatLng;
      this.tolocation = searchLatLng;

      // Check if there's an existing routing control, and remove it if it exists
      if (this.routingControl) {
        this.routingControl.setWaypoints([]);
      }

      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLatLng.lat, userLatLng.lng),
          L.latLng(searchLatLng.lat, searchLatLng.lng),
        ],
        routeWhileDragging: true,
        //showAlternatives: true,
      })
        .on('routesfound', (e) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            // for getting distance of route
            const distanceInMeters = routes[0].summary.totalDistance;
            const distanceInKilometers = distanceInMeters / 1000;
            // this.distanceInKilometersString =
            //   distanceInKilometers.toFixed(2) + ' km';
            this.distanceInKilometersString = distanceInKilometers.toFixed(2);
            console.log(
              'Total Distance:',
              distanceInKilometers.toFixed(2),
              'km'
            );

            // Calculate the price for bike
            const BikepriceInRupees = (distanceInMeters / 1000) * 5;
            // this.bikepriceInRupeesString = BikepriceInRupees.toFixed(2) + '₹';
            this.bikepriceInRupeesString = BikepriceInRupees.toFixed(2);
            console.log('Price:', BikepriceInRupees.toFixed(2), '₹');

            // Calculate the price for Auto
            const AutopriceInRupees = (distanceInMeters / 1000) * 8;
            // this.AutopriceInRupeesString = AutopriceInRupees.toFixed(2) + '₹';
            this.AutopriceInRupeesString = AutopriceInRupees.toFixed(2);

            // Calculate the price for cab
            const CabpriceInRupees = (distanceInMeters / 1000) * 12;
            // this.cabpriceInRupeesString = CabpriceInRupees.toFixed(2) + '₹';
            this.cabpriceInRupeesString = CabpriceInRupees.toFixed(2);
          }
        })
        .addTo(this.map);

      const bounds = L.latLngBounds(
        L.latLng(userLatLng.lat, userLatLng.lng),
        L.latLng(searchLatLng.lat, searchLatLng.lng)
      );
      this.map.fitBounds(bounds);
      this.map.setView(bounds.getCenter());
    } else if (this.NewSearchLocationMarker && this.searchLocationMarker) {
      debugger;
      var NewSearchLatLng = this.NewSearchLocationMarker.getLatLng();
      var searchLatLng = this.searchLocationMarker.getLatLng();
      this.fromlocation = NewSearchLatLng;
      this.tolocation = searchLatLng;

      // Check if there's an existing routing control, and remove it if it exists
      if (this.routingControl) {
        this.routingControl.setWaypoints([]);
      }

      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(NewSearchLatLng.lat, NewSearchLatLng.lng),
          L.latLng(searchLatLng.lat, searchLatLng.lng),
        ],
        routeWhileDragging: true,
        //showAlternatives: true,
      })
        .on('routesfound', (e) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            // for getting distance of route
            const distanceInMeters = routes[0].summary.totalDistance;
            const distanceInKilometers = distanceInMeters / 1000;
            // this.distanceInKilometersString =
            //   distanceInKilometers.toFixed(2) + ' km';
            this.distanceInKilometersString = distanceInKilometers.toFixed(2);
            console.log(
              'Total Distance:',
              distanceInKilometers.toFixed(2),
              'km'
            );

            // Calculate the price for bike
            const BikepriceInRupees = (distanceInMeters / 1000) * 5;
            // this.bikepriceInRupeesString = BikepriceInRupees.toFixed(2) + '₹';
            this.bikepriceInRupeesString = BikepriceInRupees.toFixed(2);
            console.log('Price:', BikepriceInRupees.toFixed(2), '₹');

            // Calculate the price for Auto
            const AutopriceInRupees = (distanceInMeters / 1000) * 8;
            // this.AutopriceInRupeesString = AutopriceInRupees.toFixed(2) + '₹';
            this.AutopriceInRupeesString = AutopriceInRupees.toFixed(2);

            // Calculate the price for cab
            const CabpriceInRupees = (distanceInMeters / 1000) * 12;
            // this.cabpriceInRupeesString = CabpriceInRupees.toFixed(2) + '₹';
            this.cabpriceInRupeesString = CabpriceInRupees.toFixed(2);
          }
        })
        .addTo(this.map);

      const bounds = L.latLngBounds(
        L.latLng(NewSearchLatLng.lat, NewSearchLatLng.lng),
        L.latLng(searchLatLng.lat, searchLatLng.lng)
      );
      this.map.fitBounds(bounds);
      this.map.setView(bounds.getCenter());
    } else {
      console.error('Both user and search location markers must be set.');
    }
  }

  /* Get user Info */
  UserInfo: any;
  GetUserInfoByUserName() {
    const that = this;
    debugger;
    this.hs
      .ajax(
        'GetUserInfoByUserName',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          UserName: this.UserName,
        }
      )
      .then((resp) => {
        this.UserInfo = this.hs.xmltojson(resp, 'user_master_ridesharing');
        console.log('User Info ->', this.UserInfo);
      });
  }

  /* Current Date In 01-01-2000 formate */
  // CurrentDate() {
  //   const currentDate = new Date();

  //   const day = String(currentDate.getDate()).padStart(2, '0');
  //   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  //   const year = currentDate.getFullYear();

  //   var formattedDate = `${day}-${month}-${year}`;
  //   console.log(formattedDate);
  //   return formattedDate;
  // }

  rideArr: any = [{ categ: '', distance: '', price: '' }];

  getDivData(category: any, dist: any, rate: any) {
    this.rideArr.categ = category;
    this.rideArr.dis = dist;
    this.rideArr.price = rate;

    if ( this.rideArr.categ = 'Two Wheeler') {
      this.RiderLocationMarker();
    }
  }

  /* Request For Ride by <button class="btn btn-primary mb-5">Book Ride </button> */
  RequestForRide() {
    // Current Date Start
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    var formattedDate = `${day}-${month}-${year}`;
    console.log(formattedDate);
    // Current Date End
    const that=this;
    debugger;
    this.hs
      .ajax(
        'UpdateRide_transition_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            new: {
              ride_transition_ridesharing: {
                userid: this.UserInfo[0].id,
                username: this.UserInfo[0].name,
                usermobileno: this.UserInfo[0].mobileno,
                currentcity: this.nativeCity,
                fromlocation: this.currentLocation,
                tolocation: this.searchQuery,
                date: formattedDate,
                ridefare: this.rideArr.price,
                distance: this.rideArr.dis,
                vehiclecatogry: this.rideArr.categ,
                ridestatus: 'pending',
                fromlat: this.fromlocation.lat,
                fromlng: this.fromlocation.lng,
                tolat: this.tolocation.lat,
                tolng: this.tolocation.lng,
              },
            },
          },
        }
      )
      .then((resp: any) => {
        console.log(resp);
        debugger;
        this.transID = resp.tuple.new.ride_transition_ridesharing.transition_id;  

        that.cancelFlag=false;
        that.bookRideFlag=true;

        this.hs.toast({
          title: 'Success!',
          text: 'Your Ride is in Queue!, Wait for sometime Your Rider will contact you.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 5000,
          showConfirmButton: false,
        });
      });
  }


  RiderMarker: any;
  RiderMarker1: any;
  RiderMarker2: any;
  RiderLocationMarker() {
    const customMarkerIcon = L.icon({
      iconUrl: '../../assets/Images/bike.png',
      iconSize: [48, 48],
      iconAnchor: [20, 48],
    });

    this.map.setView([26.8849, 75.7675], 12);

    this.RiderMarker = L.marker([26.8849, 75.7675], {
      icon: customMarkerIcon,
    }).addTo(this.map);

    this.RiderMarker1 = L.marker([26.9116, 75.7441], {
      icon: customMarkerIcon,
    }).addTo(this.map);
    

    this.RiderMarker2 = L.marker([26.9149, 75.7436], {
      icon: customMarkerIcon,
    }).addTo(this.map);
    // this.RiderMarker = L.marker([this.RiderInfo[0].lat, this.RiderInfo[0].lng], {
    //   icon: customMarkerIcon,
    // }).addTo(this.map);
  }

  
  transID: any;
  CancelRide() {
    debugger;
    this.hs
      .ajax(
        'UpdateRide_transition_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              ride_transition_ridesharing: {
                transition_id: this.transID,
              },
            },
            new: {
              ride_transition_ridesharing: {
                ridestatus: 'cancel',
              },
            },
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        this.routingControl.setWaypoints([]);

        this.router.navigateByUrl('/userpage');
        this.hs.toast({
          title: 'Success!',
          text: 'Your Ride is Canceled.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 5000,
          showConfirmButton: false,
        });

        this.searchQuery = '';
        this.distanceInKilometersString = '';
        this.bikepriceInRupeesString ='';
        this.AutopriceInRupeesString = '';
        this.cabpriceInRupeesString = '';

        this.RiderMarker.remove();
        this.RiderMarker1.remove();
        this.RiderMarker2.remove();
      // this.RiderMarker = null;
      // this.map.removeLayer(this.RiderMarker);

        this.searchLocationMarker.remove();

        this.cancelFlag=true;
        this.bookRideFlag=false;

      //this.clearMarkers();
      });
      
  }
}
