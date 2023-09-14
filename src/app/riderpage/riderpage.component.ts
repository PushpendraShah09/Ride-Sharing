import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-riderpage',
  templateUrl: './riderpage.component.html',
  styleUrls: ['./riderpage.component.scss'],
})
export class RiderpageComponent implements OnInit {
  map!: L.Map;
  markers: L.Marker[] = [];
  RiderMarker: any;

  constructor(public hs: HeroService, public router: Router) {}

  UserName: any;
  ngOnInit(): void {

    this.UserName = localStorage.getItem('UserName');

    // this.getUserLocation()
    this.GetMap();
    this.GetRiderInfoBYName();

    debugger;
  }

  userLocationMarker:any;
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Current Location: Lat: ${lat}, Lng: ${lng}`);
        const userLocation = { lat, lng };
        //this.clearMarkers();

        // Set the map view and add a new user location marker
        this.map = L.map('map').setView([0, 0], 16);

        this.map.setView([lat, lng], 16);
        this.userLocationMarker = L.marker(userLocation).addTo(this.map);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  RiderInfo: any;
  GetRiderInfoBYName() {
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
      //this.RiderLocationMarker();
  }

  GetMap() {
    this.map = L.map('map').setView([0, 0], 16);
    this.map.setView([26.8849, 75.7675], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    // this.initMarkers();
    // this.RouteLocation();
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: this.GetRideForRider[0].fromlat, lng: this.GetRideForRider[0].fromlng },
        draggable: false,
      },
      {
        position: { lat: this.GetRideForRider[0].tolat, lng: this.GetRideForRider[0].tolng },
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

  RouteLocation() {
    // Add the routing control
    L.Routing.control({
      waypoints: [
        L.latLng(this.RiderInfo[0].lat, this.RiderInfo[0].lng), // Starting point
        L.latLng(this.GetRideForRider[0].fromlat, this.GetRideForRider[0].fromlng), // Mid point
        L.latLng(this.GetRideForRider[0].tolat, this.GetRideForRider[0].tolng), // End point
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

  // RiderLocationMarker() {
  //   const customMarkerIcon = L.icon({
  //     iconUrl: '../../assets/Images/bike.png',
  //     iconSize: [48, 48],
  //     iconAnchor: [20, 48],
  //   });

  //   this.map.setView([26.8849, 75.7675], 12);

  //   this.RiderMarker = L.marker([26.8849, 75.7675], {
  //     icon: customMarkerIcon,
  //   }).addTo(this.map);
  // }


  flag: boolean = false;
  GetRideForRider: any = '';
  GetRideByRider() {
    const that = this;
    debugger;
    this.hs
      .ajax(
        'GetRideByRider',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          RideStatus: 'pending',
          Vehiclecatogry: this.RiderInfo[0].vehiclecategory,
        }
      )
      .then((resp) => {
        this.GetRideForRider = this.hs.xmltojson(
          resp,
          'ride_transition_ridesharing'
        );
        console.log('GetRide ->', this.GetRideForRider);
        $('#exampleModal').modal('show');
      });
  }

  AccpectRide() {
    debugger;
    this.hs
      .ajax(
        'UpdateRide_transition_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              ride_transition_ridesharing: {
                transition_id: this.GetRideForRider[0].transition_id,
              },
            },
            new: {
              ride_transition_ridesharing: {
                riderid: this.RiderInfo[0].id,
                ridername: this.RiderInfo[0].name,
                ridermobileno: this.RiderInfo[0].mobileno,
                ridestatus: 'Accept',
                vehicletype: this.RiderInfo[0].vehiclecategory,
                vehicleno: this.RiderInfo[0].vehicleno,
                vehiclemodel: this.RiderInfo[0].vehiclemodel,
                temp1: 'Accept',
              },
            },
          },
        }
      )
      .then((resp) => {
        this.flag = true;
        console.log(resp);

    this.initMarkers();
    this.RouteLocation();

    this.hs.toast({
      title: 'Success!',
      text: 'Ride request accepted !',
      icon: 'success',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false,
    });
    
    this.SendMail();
      });
  }

  RejectRide() {
    debugger;
    this.hs
      .ajax(
        'UpdateRide_transition_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              ride_transition_ridesharing: {
                transition_id: this.GetRideForRider[0].transition_id,
              },
            },
            new: {
              ride_transition_ridesharing: {
                temp1: 'Reject',
              },
            },
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        this.hs.toast({
          title: 'Success!',
          text: 'Ride request rejected !',
          icon: 'info',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  }

  CompleteRide() {
    debugger;
    this.hs
      .ajax(
        'UpdateRide_transition_ridesharing',
        'http://schemas.cordys.com/WSAppServerPackageRS',
        {
          tuple: {
            old: {
              ride_transition_ridesharing: {
                transition_id: this.GetRideForRider[0].transition_id,
              },
            },
            new: {
              ride_transition_ridesharing: {
                ridestatus: 'complete',
              },
            },
          },
        }
      )
      .then((resp) => {
        console.log(resp);

        this.hs.toast({
          title: 'Success!',
          text: 'You have completed the ride successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
        });
        
        this.router.navigateByUrl('/riderpage');
        
      });
  }

  SendMail() {
    var MailBody =
      'Dear ' +
      this.GetRideForRider[0].username +
      '\nWelcome to RideShare, This mail is to inform you that your Ride from ' +this.GetRideForRider[0].fromlocation+ ' to ' +this.GetRideForRider[0].tolocation+ ' is Approved.\n\n' +
      'Your Rider : '+this.RiderInfo[0].name+ ' and contact no. : ' +this.RiderInfo[0].mobileno+ ' will reach to you in sometime\n\n'
      +
      'Thank you for choosing RideShare. We look forward to providing you with a seamless ride-sharing experience. Welcome aboard!\n\n' +
      'Best regards,\n' +
      'Ride Sharing\n';

    debugger;
    this.hs
      .ajax('SendMail', 'http://schemas.cordys.com/1.0/email', {
        to: {
          address: {
            emailAddress: 'pushpendras@adnatesolutions.com',
            displayName: this.GetRideForRider.username ,
          },
        },
        // cc: {
        //   address: {
        //     displayName: PARAMETER,
        //     emailAddress: PARAMETER,
        //   }
        // },
        // bcc: {
        //   address: {
        //     displayName: PARAMETER,
        //     emailAddress: PARAMETER,
        //   }
        // },
        subject: 'Ride Confirmation',
        body: MailBody,
        // attachments: {
        //   attachment: PARAMETER,
        // },
        from: {
          displayName: 'Ride Sharing',
          emailAddress: 'pushpendras@adnatesolutions.com',
          replyTo: 'It is a auto generated mail, You can not reply to it.',
        },
        // headers: {
        //   header: PARAMETER,
        // }
      })
      .then((resp) => {
        console.log(resp);
      });
  }
}
