import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { ProvincesService } from '../../services/provinces/provinces.service';
import { FirebaseService } from '../../services/firebase-service.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('navbar', changes.color.currentValue);
    const nav = document.querySelector('nav');
    // nav.classList.replace('bg-header', 'warning');
    console.log(nav.className)
  }

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  job;
  id;

  province;
  distictSource;
  distictDestination
  objCountrySource;
  objCountryDestination;

  latitudeSource;
  longitudeSource;
  latitudeDestination;
  longitudeDestination;

  checkInvoice = false;
  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private provincesService: ProvincesService,
    private firebaseService: FirebaseService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.searchJob(this.id);
    this.getProvince();
    this.getDistictAndSubDistict();
  }

  open(content) {
    this.modalService.open(content);
  }


  searchJob(data1) {
    console.log('data', data1);

    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      // console.log('job', job)
      this.job = job.filter((data: any) => data.key == data1 && data.value.statusDelete !== 'delete');
      this.distictSource = this.job[0].value.provinceSource;
      this.distictDestination = this.job[0].value.provinceDestination;
      this.objCountrySource = this.provincesService.getCountry(this.job[0].value.provinceSource, this.job[0].value.distictSource, this.job[0].value.subDistictSource);
      this.objCountryDestination = this.provincesService.getCountry(this.job[0].value.provinceDestination, this.job[0].value.distictDestination, this.job[0].value.subDistictDestination);
      console.log('objCountry', this.objCountrySource, this.objCountryDestination);
      console.log('this.job', this.job);
      for (let index = 0; index < this.job.length; index++) {
        console.log(`index[${index}]`, this.job[index]);
        this.job[index].value = {
          ...this.job[index].value,
          statusSendEmail: 'unsend',
        }

      }

    });
  }

  editJob(data) {
    console.log('data', data);

    if (this.latitudeSource && this.longitudeSource) {
      console.log('latitudeSource', this.latitudeSource, 'longtitudeSoure', this.longitudeSource);
      data.value = {
        ...data.value,
        sourceLatitude: this.latitudeSource,
        sourceLongitude: this.longitudeSource
      }

      this.latitudeSource = '';
      this.longitudeSource = '';
    }

    if (this.latitudeDestination && this.longitudeDestination) {
      console.log('latitudeDestination', this.latitudeDestination, 'longtitudeDestination', this.longitudeDestination);
      data.value = {
        ...data.value,
        destLatitude: this.latitudeDestination,
        destLongitude: this.longitudeDestination
      }
      this.latitudeDestination = '';
      this.longitudeDestination = '';
    }

    this.firebaseService.editJob(data.key, data.value);
    window.close()
  }

  getProvince() {
    this.province = this.provincesService.searchProvince();
    console.log('getProvince', this.province);
    // console.log('province', this.province);
    // this.distictSource = this.job[0].value.provinceSource;
    // this.distictDestination = this.job[0].value.provinceDestination;


  }

  changeProvnice(data, type) {
    console.log(data.target.value);
    if (type == 'source') {
      this.distictSource = data.target.value
      this.objCountrySource = this.provincesService.selectProvince(data.target.value);
      console.log('objCountry', this.objCountrySource);
    }

    if (type == 'destination') {
      this.distictDestination = data.target.value
      this.objCountryDestination = this.provincesService.selectProvince(data.target.value);
      console.log('objCountry', this.objCountryDestination);
    }

  }

  changeDistict(event, type) {
    if (type == 'source') {
      this.objCountrySource.dt = this.provincesService.selectDistict(this.distictSource, event.target.value);
      console.log('this.objCountry.dv[1]', this.objCountrySource.dt[1]);

    }
    if (type == 'destination') {
      this.objCountryDestination.dt = this.provincesService.selectDistict(this.distictDestination, event.target.value);
      console.log('this.objCountry.dv[1]', this.objCountryDestination.dt[1]);

    }
  }

  getDistictAndSubDistict() {
    console.log('121fasfsdfdfsdf');

    console.log(this.job[0]);


  }
  addInvoice() {
    this.checkInvoice = true;
  }


  markerDragEnd($event: MouseEvent) {
    console.log('$event', $event);
    this.latitudeSource = $event.coords.lat;
    this.longitudeSource = $event.coords.lng;
    console.log('latitudeSource', this.latitudeSource, 'longitudeSource', this.longitudeSource);
  };

  markerDragEnd2($event: MouseEvent) {
    console.log('$event', $event);
    this.latitudeDestination = $event.coords.lat;
    this.longitudeDestination = $event.coords.lng;
    console.log('latitudeDestination', this.latitudeDestination, 'longitudeDestination', this.longitudeDestination);
  };
}
