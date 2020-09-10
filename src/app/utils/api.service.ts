import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../constants/user';
import { Agency } from '../entity/Agency';
import { Bus } from '../entity/Bus';
 
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private BASE_URL = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  //Api service
  postAuth(email, password) {
    var formData: any = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.http.post(`${this.BASE_URL}/login`, formData);
  }

  getAgencybyId(id){
    console.log('zzzz')
    return this.http.get<Agency>(`${this.BASE_URL}/getAgency?id=${id}`)
  }

  getUserbyId(id){
    return this.http.get<User>(`${this.BASE_URL}/getUserId?id=${id}`)
  }   

  editAgencybyId(id,agency){
    return this.http.post<Agency>(`${this.BASE_URL}/updateAgency-angular`,agency)
  }

  getBusbyId(id){
    return this.http.get<Bus>(`${this.BASE_URL}/getAllBus-angular?id=${id}`)
  }

  getAllBus(){
    return this.http.get<Bus>(`${this.BASE_URL}/getAllBus`)
  }

  getAllStop(id){
    return this.http.get(`${this.BASE_URL}/getAllStopAngular?id=${id}`)
  }

  postUpdateBus(body) {
    return this.http.post(`http://localhost:8080/api/updateBus-angular`, body);
  }

  postUpdateTrips(body) {
    return this.http.post(`http://localhost:8080/api/updateTripsAngular`, body);
  }
  
  getTripId(id){
    return this.http.get(`${this.BASE_URL}/getAllTrips-angular?id=${id}`)
  }

  editUserbyId(user){
    return this.http.post<User>(`${this.BASE_URL}/updateProfileAngular`,user)
  }

  register(registerRequest){
    return this.http.post(`${this.BASE_URL}/createNewAccount`,registerRequest)
  }

  postDeleteTrips(id) {
    return this.http.post(`http://localhost:8080/api/deleteTrips-angular`, id);
  }
  
  postDeleteBus(id) {
    return this.http.post(`http://localhost:8080/api/deleteBus-angular`, id);
  }
  
  addTrip(trip){
    return this.http.post(`${this.BASE_URL}/addTripAngular`,trip)
  }

  addBus(bus){
    return this.http.post(`${this.BASE_URL}/addBusAngular`,bus)
  }
}
