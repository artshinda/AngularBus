import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/utils/api.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.component.html',
  styleUrls: ['./registrasi.component.css']
})
export class RegistrasiComponent implements OnInit {

  id: String;
  email: String;
  password: String;
  password2: String;
  firstName: String;
  lastName: String;
  contactNumber: String;
  agencyName: String;
  agencyDetail: String;
  createdDate: Date;
  updatedDate: Date;
constructor(
  private myRoute : Router,
  public auth: AuthService,
  private apiService: ApiService) { }

ngOnInit(): void {
}

register(){
  console.log(this.firstName,this.lastName,this.email,this.password,this.password2,this.agencyName,this.agencyDetail,this.contactNumber)
  this.apiService.register({id: uuidv4(),firstName:this.firstName, lastName:this.lastName,email:this.email, password:this.password,rePassword:this.password2,agencyName:this.agencyName,agencyDetail:this.agencyDetail,contsctNumber:this.contactNumber}).subscribe((data)=>{
    
      alert("Account Berhasil Dibuat")
    
})
}
}
