import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userBehaviourSubject=new BehaviorSubject(null)
  userTypeBehaviourSubject = new BehaviorSubject(null)
 
  loginStatus:boolean= false;
  constructor(public httpClientObj: HttpClient) {

  }
  addUserToDatabase(userObj: any) {
    return this.httpClientObj.post("http://localhost:4200/user/createuser", userObj);
  }

  loginUser(userObj: any): Observable<any> {
   
    return this.httpClientObj.post("http://localhost:4200/user/login", userObj);

  }
  /* getUser() {
    console.log(this.username)
    return this.httpClientObj.get("http://localhost:4200/user/getuser/:harish")
  } */
  getUsername(){
    return this.userBehaviourSubject;
  }
  getUserType(){
    return this.userTypeBehaviourSubject;
  }
  userLogout(){
    localStorage.removeItem("token")
   
    this.userBehaviourSubject.next(null)
  }
}
