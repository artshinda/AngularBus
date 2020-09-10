import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/utils/api.service';
import { AuthService } from 'src/app/auth.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.css']
})

export class BusesComponent implements OnInit {
  code:String;
  capacity:number;
  make:String;
  temp: any;
  editing = {};
  rows : any = [];
  mydatatable: any;
  ColumnMode = ColumnMode;

  constructor(
    private api:ApiService,
    private auth: AuthService,
    private modalService: NgbModal
    ) {

  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    let { agencyId } = this.auth.decodeJWT();
    this.api.getBusbyId(agencyId).subscribe((d) => {
      this.temp = d;
      console.log(d);
      this.rows = d;
    });
  }

  open(content) {
    console.log('content', content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED! ROW', this.rows);
    console.log('UPDATED!', this.rows[rowIndex]);
    this.api.postUpdateBus(this.rows[rowIndex]).subscribe();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    console.log('searh', val)
    // filter our data
    console.log('searhzz', this.rows)
    const temp = this.temp.filter(function (d) {
      return d.code.toLowerCase().indexOf(val) !== -1 || !val;
    });
    
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.mydatatable.offset = 0;
  }

  deleteBus(id) {
    console.log("e", id);
    this.api.postDeleteBus(id).subscribe((d) => {
      this.fetchData();
      alert('Data Berhasil Di Delete')
    });
  }

  saveBus(){
    let { agencyId } = this.auth.decodeJWT();
    console.log('add bus', this.code,this.capacity,this.make,agencyId)
    this.api.addBus({make:this.make,code:this.code,capacity:this.capacity,agencyId:agencyId}).subscribe((bus)=>{ 
      alert("Data Bus Berhasil Bertambah");      // this.itemEdit.expiredDate = (new Date(this.dpick.year, this.dpick.month-1, this.dpick.day )).getTime() / 1000
      this.api.getBusbyId(agencyId).subscribe((d) => {
        this.temp = d;
        console.log(d)
        this.rows = d;
      })
    });
  }
}
