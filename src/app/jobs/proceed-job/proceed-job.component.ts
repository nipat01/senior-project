import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { ProvincesService } from '../../services/provinces/provinces.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-proceed-job',
  templateUrl: './proceed-job.component.html',
  styleUrls: ['./proceed-job.component.css']
})
export class ProceedJobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  jobList: AngularFireList<any>
  job: any[];
  job1: any[];

  showEdit = true;

  carList: AngularFireList<any>;
  car: any[];
  id;
  checkSubmitAndDel = [];

  latitudeSource;
  longitudeSource;
  latitudeDestination;
  longitudeDestination;
  province;
  distictSource;
  distictDestination
  objCountrySource;
  objCountryDestination;

  //bill
  imgSrc;
  imgSrc2;
  selectedImage;
  selectedImage2;
  checkImageUrlBill = true;
  checkImageUrlNoBill = true;
  isSubmitted;
  // bill
  formTemplate: FormGroup = new FormGroup({
    totalPayment: new FormControl(),
    deposit: new FormControl(),
    bill: new FormControl(),
    billNo: new FormControl(),
  });

  formBillImageUrl: FormGroup = new FormGroup({
    billImageUrl: new FormControl()
  });

  formBillNoImageUrl: FormGroup = new FormGroup({
    billNoImageUrl: new FormControl()
  });

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }


  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private provincesService: ProvincesService,
    private storage: AngularFireStorage) { }


  ngOnInit() {
    this.starForm();
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceed' && data.value.statusDelete !== 'delete');
      // this.job = job

    });

    this.db.list('car').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;
    });

    this.getProvince();

  }
  delJob(data) {
    // this.firebaseService.removeJob(data.key);
    console.log(data.value);
    const jobData = {
      ...data.value,
      statusDelete: 'delete'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  editJob(data) {
    console.log(data.value);
    let jobData = {
      ...data.value,
      status: 'proceeded',
      statusSendEmail: 'send',
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);

    jobData = {
      ...jobData,
      statusSendEmail: 'unsend',
    }
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content, value) {
    if (value === 'submit') {
      this.checkSubmitAndDel[0] = "ต้องการยืนยันงานหรือไม่";
      this.checkSubmitAndDel[1] = "ยืนยัน";
    }
    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบการจ้างหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }

  openModal(con) {
    this.modalService.open(con);
  }

  openData(con, data) {
    console.log('showdataDialog', con);
    // console.log(dataOfDailog.key);

    this.modalService.open(con, { size: 'xl' });
    let provinceSource = data.value.provinceSource;
    let distictSource = data.value.distictSource;
    let subDistictSource = data.value.subDistictSource;
    let provinceDestination = data.value.provinceDestination;
    let distictDestination = data.value.distictDestination;
    let subDistictDestination = data.value.subDistictDestination;

    this.distictSource = provinceSource;
    this.distictDestination = provinceDestination;
    this.objCountrySource = this.provincesService.getCountry(provinceSource, distictSource, subDistictSource);
    this.objCountryDestination = this.provincesService.getCountry(provinceDestination, distictDestination, subDistictDestination);
    console.log('objCountry', this.objCountrySource, this.objCountryDestination);
  }

  editForm(data) {
    console.log('editForm', data.value);
    this.firebaseService.editJob(data.key, data.value);
  }

  buttonEdit(data) {
    console.log(data);
    if (data == 'edit') {

      this.showEdit = false;
    }
    if (data == 'closeEdit') {
      this.showEdit = true;

    }
  }

  getProvince() {
    this.province = this.provincesService.searchProvince();
    // console.log('getProvince', this.province);
    // console.log('province', this.province);
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

  // bill

  openBill(data, content, contentEdit) {
    console.log('open content');
    this.modalService.open(content, { size: 'lg' });
  }

  starForm() {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.selectedImage2 = null;
    // this.isSubmitted = false;
  }

  showPreview(event: any) {
    console.log('even', event.target.files, event.target.files[0]);
    this.imgSrc = '/assets/img/image_placeholder.jpg';

    console.log('showPreview', this.formBillImageUrl.get('billImageUrl').value);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  showPreview2(event2: any) {
    console.log(this.formBillNoImageUrl.get('billNoImageUrl').value);
    if (event2.target.files && event2.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc2 = e.target.result;
      reader.readAsDataURL(event2.target.files[0]);
      this.selectedImage2 = event2.target.files[0];
    }
    else {
      this.imgSrc2 = '/assets/img/image_placeholder.jpg';
      this.selectedImage2 = null;
    }
  }

  resetForm() {
    this.formBillImageUrl.reset();
    this.formBillNoImageUrl.reset();

    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.isSubmitted = false;
  }

  onSubmit(formValue, dataFormJob) {
    console.log('formValue', formValue.value);
    this.firebaseService.editJob(dataFormJob.key, formValue.value);
  }
  uploadbillImage(formValue, dataFormJob) {
    console.log('formValue', formValue.value, 'dataFormJob', dataFormJob.value);

    console.log('uploadData billImageUrl');
    this.isSubmitted = true;
    if (this.formBillImageUrl.valid) {
      var billFilePath = `image/imageJob/bill/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const billfileRef = this.storage.ref(billFilePath);
      this.storage.upload(billFilePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          billfileRef.getDownloadURL().subscribe((url) => {
            dataFormJob.value['billImageUrl'] = url;
            dataFormJob.value = {
              ...dataFormJob.value,
              billFilePath: billFilePath
            }
            this.firebaseService.editJob(dataFormJob.key, dataFormJob.value);
          })
        })
      ).subscribe();
    }
    this.checkImageUrlBill = true;

  }

  uploadbillNoImage(formValue, dataFormJob) {
    console.log('upload billNoImageUrl');

    this.isSubmitted = true;
    if (this.formBillNoImageUrl.valid) {
      var billNoFilePath = `image/imageJob/billNo/${this.selectedImage2.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const billNofileRef = this.storage.ref(billNoFilePath);
      this.storage.upload(billNoFilePath, this.selectedImage2).snapshotChanges().pipe(
        finalize(() => {
          billNofileRef.getDownloadURL().subscribe((url) => {
            // formValue.value['billNoImageUrl'] = url;
            // const addValue = {
            //   ...formValue.value,
            //   billNoFilePath: billNoFilePath
            // }
            // this.firebaseService.editJob(dataFormJob.key, addValue);

            dataFormJob.value['billNoImageUrl'] = url;
            dataFormJob.value = {
              ...dataFormJob.value,
              billNoFilePath: billNoFilePath
            }
            this.firebaseService.editJob(dataFormJob.key, dataFormJob.value);
          })
        })
      ).subscribe();
    }
    this.checkImageUrlNoBill = true;
  }

  deleteImageBill(data) {
    this.checkImageUrlBill = false;
    console.log('deleteImage111111111', data.value);
    data.value = {
      ...data.value,
      billImageUrl: '',
    }

    this.storage.ref(data.value.billFilePath).delete();
    const editUrl = data.value;
    this.firebaseService.editJob(data.key, editUrl);
    this.imgSrc = '/assets/img/image_placeholder.jpg';
  }

  deleteImageNoBill(data) {
    console.log('deleteImage', data.value);
    this.checkImageUrlNoBill = false;
    data.value = {
      ...data.value,
      billNoImageUrl: '',
    }
    this.storage.ref(data.value.billNoFilePath).delete();
    const editUrl = data.value
    this.firebaseService.editJob(data.key, editUrl);

    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
  }

  checkImageFalse() {
    this.checkImageUrlBill = true;
    this.checkImageUrlNoBill = true;
    this.resetForm();
  }


  newEditJob(data) {
    window.open(`/editjob/${data.key}`)
  }


}
