import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { Observable } from 'rxjs';
import { ProvincesService } from '../../services/provinces/provinces.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-checkpayment-job',
  templateUrl: './checkpayment-job.component.html',
  styleUrls: ['./checkpayment-job.component.css']
})
export class CheckpaymentJobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  jobList: AngularFireList<any>
  job: any[];

  showEdit = true;
  carList: AngularFireList<any>;
  wikis: any[];

  car: any[];
  carType;
  selectedNameDriver = [];
  selectedEmailDriver = [];
  selectedTokenlDriver = [];
  //car
  selectedCarModel = [];
  selectedCarId = [];
  carModelAndId = [];
  checkIndexCar;

  //checkSubmitAndDel
  checkSubmitAndDel = [];

  Addrres = false;
  currentAddrres = false;

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

  formBill = new FormGroup({
    deposit: new FormControl(),
    totalPayment: new FormControl(),
  });

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

  myObs$: Observable<any>;

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private provincesService: ProvincesService,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.starForm();
    this.myObs$ = this.db.list('job').valueChanges();
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'checkpayment' && data.value.statusDelete !== 'delete');
    });

    this.db.list('wikis').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;
    });
    this.db.list('car').snapshotChanges().map(action => {
      return action.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      // console.log(car)
      this.car = car.filter((data: any) => data.value.status === 'พร้อมใช้งาน');
    });

    this.db.list('carType').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(carType => {
      // console.log(carType)
      // console.log('carType', carType[0].value)
      this.carType = carType.filter((data: any) => data.value.status === 'พร้อมใช้งาน');
    });


    this.getProvince();
  }
  editBill(data) {
    console.log('testeditjob');

    // console.log(data.value);
    data.value = {
      ...data.value,


    }
    const billData = data.value
    console.log('billData', billData);
    this.firebaseService.editJob(data.key, billData);
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

  editJob(data, index, formBill) {
    console.log('testeditjob');
    console.log(formBill.value);

    if (this.selectedNameDriver[index] &&
      this.selectedCarModel[index] &&
      this.selectedCarId[index]) {

      // console.log(data.value);
      data.value = {
        ...data.value,
        status: 'notification',
        statusDriver: 'รอการยืนยัน',
        driver: this.selectedNameDriver[index],
        emailDriver: this.selectedEmailDriver[index],
        tokenDriver: this.selectedTokenlDriver[index],
        carModel: this.selectedCarModel[index],
        carId: this.selectedCarId[index],
        statusSendEmail: 'send',

      }
      console.log(data.value);
      this.firebaseService.editJob(data.key, data.value);

      data.value = {
        ...data.value,
        statusSendEmail: 'unsend',

      }
      // console.log(data.value);
      this.firebaseService.editJob(data.key, data.value);
    }
    // else {
    //   window.alert("กรุณาเลือกพนักงานขับรถ หรือ รถให้เรียบร้อย");
    // }
  }

  selectValue(driver, index) {
    console.log('showValue', driver.target.value.split(","));
    const getDriver = driver.target.value.split(",");
    const driverEmail = getDriver[0];
    const driverFirstname = getDriver[1];
    const driverToken = getDriver[2];

    this.selectedEmailDriver[index] = driverEmail;
    this.selectedNameDriver[index] = driverFirstname;
    this.selectedTokenlDriver[index] = driverToken;
    // console.log('index', index);
    console.log('data', driver.target.value);

  }
  selectCarType(car, index, data) {
    console.log('data', car.target.value, index);
    this.checkIndexCar = data.key
    // console.log('showValue', car.target.value.split(","));
    // const getCar = car.target.value.split(",");
    // const carModel = getCar[0];
    // const carId = getCar[1];

    let carModel = car.target.value;
    // this.selectedCarModel[index] = carModel;
    // this.selectedCarId[index] = carId;
    // console.log(carModel);
    this.carModelAndId = [];
    for (let i = 0; i < this.car.length; i++) {

      if (carModel === this.car[i].value.carType) {
        console.log(this.car[i].value.carId);
        this.carModelAndId.push([this.car[i].value.carId, this.car[i].value.carModel])

      }
    }

  }
  selectCar(car, index) {
    console.log('showValue', car.target.value.split(","));
    const getCar = car.target.value.split(",");
    const carModel = getCar[0];
    const carId = getCar[1];
    this.selectedCarModel[index] = carModel;
    this.selectedCarId[index] = carId;
    console.log(this.selectedCarModel[index], this.selectedCarId[index]);

  }

  open(content, value, data, contBill, index) {
    // console.log(data.value);

    if (
      this.selectedEmailDriver[index]
      && this.selectedTokenlDriver[index]
      && this.selectedCarModel[index]
      && this.selectedCarId[index]) {
      if (data) {
        console.log('11111111');

        if (!data.value.totalPayment && !data.value.deposit) {
          // this.modalService.open(contBill)
          this.modalService.open(contBill, { size: 'lg' });
        }
        else
          this.modalService.open(contBill, { size: 'lg' });
        // this.modalService.open(contBill);
        // this.modalService.open(content);

      }
      else {

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
    }
    else if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบการจ้างหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
      this.modalService.open(content);

    }
    else {
      // this.checkSubmitAndDel[0] = "กรุณากรอกข้อมูลให้ครบถ้วน";
      // this.checkSubmitAndDel[1] = "ยืนยัน";
      // this.modalService.open(content);
      window.alert("กรุณาเลือกพนักงานขับรถ หรือ รถให้เรียบร้อย");
    }


  }

  openModal(con) {
    this.modalService.open(con);
  }

  openBill(content) {
    // this.modalService.open(content);
    this.modalService.open(content, { size: 'lg' });
  }

  openData(con, data) {
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

  getCurentAddress() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        currentLat2: '',
        currentLong2: '',
        sendCoordinates: 'send!',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }

  }

  showCurrentAddress(checkAddress) {
    console.log('currentMap', checkAddress);
    if (checkAddress === 'addressEmp') {
      console.log('111');

      this.currentAddrres = false;
      this.Addrres = true;
    }
    if (checkAddress == 'currentAddressEmp') {
      console.log('222');
      this.currentAddrres = true;
      this.Addrres = false;
    }
    if (checkAddress == 'clearAddressEmp') {
      console.log('333');
      this.currentAddrres = false;
      this.Addrres = false;
    }
  }

  resetCoordinates() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        sendCoordinates: '',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }
  }

  // bill
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
