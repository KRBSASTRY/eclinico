import { Component, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/doctor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {

  appointmentDetails: any[] = [];
  username: string;
  wallet:number=0;

  constructor(public serviceObj: UserService) { }

  ngOnInit(): void {
    this.username = this.serviceObj.getUsername().getValue().username
    this.serviceObj.getUserDetailsAfterPayment(this.username).subscribe({
      next: (userObj) => {
        this.appointmentDetails = userObj.payload.appointmentDetails
        this.wallet=userObj.payload.wallet
        this.serviceObj.getUpdateWallet().next(this.wallet)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}