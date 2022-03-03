import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpClientObj: HttpClient) { }
  loginDoctor(userObj: any): Observable<any> {
    return this.httpClientObj.post("http://localhost:4200/doctor/login", userObj);
  }
  addDoctorToDatabase(userObj: any): Observable<any> {
    return this.httpClientObj.post("http://localhost:4200/doctor/createdoctor", userObj);
  }

  //get doctor values based on book appointment button selection
  doctorBehaviourSubject = new BehaviorSubject(null);
  logoutdoctorBehaviourSubject = new BehaviorSubject(null);
  getDoctorData() {
    return this.doctorBehaviourSubject
  }
  //get appointment details after successfull payment
  appointmentBehaviourSubject = new BehaviorSubject(null);
  getAppointmentDetails() {
    return this.appointmentBehaviourSubject
  }
  //getAccountPageDetails
  accountBehaviourSubject = new BehaviorSubject(null);
  getAccountPageDetails() {
    return this.accountBehaviourSubject
  }
  // getDoctorList
  getDoctorList(): Observable<any> {
    return this.httpClientObj.get<any>("http://localhost:4200/doctor/getdoctors")
  }
  getDoctorName(){
    return this.logoutdoctorBehaviourSubject;
  }
  doctorLogout(){
    localStorage.removeItem("token")
    
    this.logoutdoctorBehaviourSubject.next(null)
  }

}
