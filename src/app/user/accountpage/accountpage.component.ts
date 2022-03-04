import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/doctor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-accountpage',
  templateUrl: './accountpage.component.html',
  styleUrls: ['./accountpage.component.css']
})
export class AccountpageComponent implements OnInit {


  accountDetails: any;
  wallet:number=0;
  value: number = 0;
  valueFromInput: number;
  payment: boolean = false;

  constructor(public serviceObj: DoctorService, public userserviceObj: UserService, public routerObj: Router, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.accountDetails = this.serviceObj.getAccountPageDetails().getValue()
  }

  successfulPayment() {
    if (this.wallet >= this.accountDetails.consultationFee) {
      this.payment = true
      this.wallet = this.wallet - this.accountDetails.consultationFee
      alert("Payment Successful!")
      console.log(this.accountDetails, "from accountoage after succeseful");
      //to add the appointment details to the backend
      this.userserviceObj.addAppointmentDetails(this.accountDetails).subscribe({
        next: (res) => {
          this.routerObj.navigateByUrl('/userdashboard/appoint')
        },
        error: (err) => {
          console.log(err);
        }
      })
      //to update the wallet balance to wallet variable in backend
      this.userserviceObj.updateWallet(this.accountDetails).subscribe({
        next: (res) => { console.log(res); },
        error: (err) => { err }
      })
      //update the wallet balance after successful payment
      
    }
    else {
      this.payment = false
      alert("Insuficient Balance!")
    }
  }

  addToInput(valuefromButton) {
    this.value = this.value + valuefromButton;
  }


  AddMOney = this.fb.group({
    addMoney: ['']
  })


  addToWallet() {
    this.valueFromInput = this.AddMOney.value.addMoney
    console.log(this.AddMOney.value.addMoney);
    this.accountDetails.wallet = this.accountDetails.wallet + this.valueFromInput
  }


}