import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/utils/api.service';
import { AuthService } from 'src/app/auth.service';
import { ColumnMode, DatatableComponent, id } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {

  bus: string;
  stop: string;
  stopDestination: string;
  duration: string;
  fare: string;
  temp: any;
  editing = {};
  rows : any = [];
  dataDropdownBus: any;
  dataDropdownStop: any;
  mydatatable: any;
  pureData: any;

  ColumnMode = ColumnMode;

  constructor(
    private api:ApiService,
    private auth: AuthService,
    private modalService: NgbModal
    ) {

  }

  open(content) {
    console.log('content', content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnInit(): void {
    this.fetchData();
    // let { agencyId } = this.auth.decodeJWT();
    // this.api.getBusbyId(agencyId).subscribe((bus) => {

    //   console.log('bus',bus)
    //   this.dataDropdownBus = bus;
    // })

    // this.api.getAllStop(agencyId).subscribe((stop) => {
    //     console.log('stop',stop)
    //     this.dataDropdownStop = stop;
    // })


    // this.api.getTripId(agencyId).subscribe((d : any) => {
    //   console.log(d)

    //   let tempDataHeder = d.map((v) =>({
    //     busName: v.bus.code,
    //     busId: v.bus.id,
    //     stop: v.stop.name,
    //     stopDestination: v.stopDestination.name,
    //     fare: v.fare,
    //     journeyTime: v.journeyTime
    //   })) 
    //   console.log('tempDataHeder', tempDataHeder)
    //   this.temp = tempDataHeder;
    //   this.rows = tempDataHeder;
    //   this.pureData = d;
    // })
  }
  
  fetchData() {
    let { agencyId } = this.auth.decodeJWT();
    this.api.getBusbyId(agencyId).subscribe((bus) => {
      console.log("bus", bus);
      this.dataDropdownBus = bus;
    });
    this.api.getAllStop(agencyId).subscribe((stop) => {
      console.log("stop", stop);
      this.dataDropdownStop = stop;
    });

    this.api.getTripId(agencyId).subscribe((d: any) => {
      console.log('d', d);

      let tempDataHeder = d.map((v) => ({
        id: v.id,
        busName: v.bus.code,
        busId: v.bus.id,
        stop: v.stop.name,
        stopDestination: v.stopDestination.name,
        fare: v.fare,
        journeyTime: v.journeyTime,
      }));
      console.log("tempDataHeder", tempDataHeder);
      this.temp = tempDataHeder;
      this.rows = tempDataHeder;
      this.pureData = d;
    });
  }

  updateValue(event, cell, rowIndex) {
    console.log("inline editing rowIndex", rowIndex);
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log("UPDATED! ROW", this.rows);
    console.log("UPDATED!", cell, this.rows[rowIndex][cell]);

    let copyBus = this.dataDropdownBus;
    const resultbus = copyBus.find(
      (x) => x.code === this.rows[rowIndex].busName
    );

    let copyStop = this.dataDropdownStop;
    const resultStop = copyStop.find(
      (x) => x.name === this.rows[rowIndex].stop
    );
    const resultStopDestination = copyStop.find(
      (x) => x.name === this.rows[rowIndex].stopDestination
    );

    console.log("result", resultStop);
    let copyDataByIndex = this.pureData[rowIndex];
    console.log("copyDataByIndex", copyDataByIndex);
    copyDataByIndex.busId = resultbus.id;
    copyDataByIndex.sourceStopId = resultStop.id;
    copyDataByIndex.destStopId = resultStopDestination.id;
    // copyDataByIndex[cell] = this.rows[rowIndex][cell];
    console.log("copyDataByIndex after", copyDataByIndex);
    this.api.postUpdateTrips(copyDataByIndex).subscribe();
    alert("Data Berhasil Di Update")
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    console.log('searh', val)
    // filter our data
    console.log('searhzz', this.rows)
    const temp = this.temp.filter(function (d) {
      return d.busName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.mydatatable.offset = 0;
  }

  saveTrip(){
    let { agencyId } = this.auth.decodeJWT();
    console.log(this.bus,this.stop,this.stopDestination,this.duration,this.fare);
    this.api.addTrip({busId:this.bus,sourceStopId:this.stop,destStopId:this.stopDestination,journeyTime:this.duration,fare:this.fare,agencyId:agencyId}).subscribe((d) => {
      this.fetchData();
      alert("Data Berhasil Bertambah")
    });
  }

  deleteTrips(id) {
    console.log("e", id);
    this.api.postDeleteTrips(id).subscribe((d) => {
      this.fetchData();
      alert("Data Berhasil Di Delete")
    });
  }


}
