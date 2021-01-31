import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';

import { finalize } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from '../../services/image/image.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/storage';
import { AppComponent } from 'src/app/app.component';
import { ProvincesService } from '../../services/provinces/provinces.service';
@Component({
  selector: 'app-proceeded-job',
  templateUrl: './proceeded-job.component.html',
  styleUrls: ['./proceeded-job.component.css']
})
export class ProceededJobComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  jobList: AngularFireList<any>
  job: any[];

  showEdit = true;

  carList: AngularFireList<any>;
  car: any[];



  imgSrc: string;
  imgSrc2: string;
  selectedImage: any = null;
  selectedImage2: any = null;
  isSubmitted: boolean;

  checkImageUrlBill = true;
  checkImageUrlNoBill = true;
  imageList: any[];//list
  rowIndexArray: any[];//list
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

  formTemplate: FormGroup = new FormGroup({
    totalPayment: new FormControl(),
    deposit: new FormControl(),
    bill: new FormControl(),
    billNo: new FormControl(),
    // billImageUrl: new FormControl('', Validators.required),
    // billNoImageUrl: new FormControl('', Validators.required)
  });

  formBillImageUrl: FormGroup = new FormGroup({
    billImageUrl: new FormControl()
  });

  formBillNoImageUrl: FormGroup = new FormGroup({
    billNoImageUrl: new FormControl()
  });

  formTemplateForEdit: FormGroup = new FormGroup({
    totalPayment: new FormControl('', Validators.required),
    deposit: new FormControl('', Validators.required),
    bill: new FormControl('', Validators.required),
    billNo: new FormControl('', Validators.required),

  });

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    // config: NgbModalConfig,
    config: NgbRatingConfig,
    private modalService: NgbModal,
    private service: ImageService,
    private storage: AngularFireStorage,
    private provincesService: ProvincesService) {
    // config.backdrop = 'static';
    // config.keyboard = false;
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.starForm();
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      // console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceeded' && data.value.statusDelete !== 'delete');
      console.log(this.job);


      this.job.sort(function (x, y) {

        let ax = x.value.workDate.split("/");
        let ay = y.value.workDate.split("/");
        // console.log(ax, ay);

        ax = new Date(ax[2], ax[1] - 1, ax[0])
        ay = new Date(ay[2], ay[1] - 1, ay[0])
        return ay - ax;
      });


      // this.job = job



      // this.service.getImageDetailServiceList();
      // this.service.imageDetailServiceList.snapshotChanges().subscribe(
      //   list => {
      //     this.imageList = list.map(item => { return item.payload.val(); });
      //     this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
      //     console.log(this.imageList);
      //   }
      // );
    });

    this.getProvince();
  }

  // delJob(data) {
  //   if (data.value.billFilePath) {
  //     this.storage.ref(data.value.billFilePath).delete();
  //   }

  //   if (data.value.billNoFilePath) {
  // this.storage.ref(data.value.billNoFilePath).delete();
  //   }
  //   this.firebaseService.removeJob(data.key);
  // }

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
    data.value = {
      ...data.value,
      status: 'proceeded',
      statusSendEmail: 'send',
    }
    // console.log(data.value);
    this.firebaseService.editJob(data.key, data.value);

    data.value = {
      ...data.value,
      statusSendEmail: 'unsend',
    }
    this.firebaseService.editJob(data.key, data.value);
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

  openBill(data, content, contentEdit) {
    // if (data.value.billImageUrl === '') {
    //   console.log('1111');
    //   this.modalService.open(content);
    // }
    // else this.modalService.open(contentEdit)
    // console.log('222');
    console.log('open content');

    this.modalService.open(content, { size: 'lg' });

  }

  openDeleteBill(content) {
    console.log('delete');
    this.modalService.open(content);

  }
  openDeleteBill2(content) {
    console.log('delete2');
    this.modalService.open(content);

  }

  openData(con, data) {
    this.modalService.open(con, { size: 'xl' }); let provinceSource = data.value.provinceSource;
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

  openReview(review) {
    this.modalService.open(review);
  }


  onSubmit(formValue, dataFormJob) {
    console.log('formValue', formValue.value);

    this.firebaseService.editJob(dataFormJob.key, formValue.value);
    // if (!dataFormJob.value.billImageUrl) {
    //   console.log('uploadData billImageUrl');
    //   this.isSubmitted = true;
    //   if (this.formTemplate.valid) {
    //     var billFilePath = `image/imageJob/bill/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    //     const billfileRef = this.storage.ref(billFilePath);
    //     this.storage.upload(billFilePath, this.selectedImage).snapshotChanges().pipe(
    //       finalize(() => {
    //         billfileRef.getDownloadURL().subscribe((url) => {
    //           formValue.value['billImageUrl'] = url;
    //           const addValue = {
    //             ...formValue.value,
    //             billFilePath: billFilePath
    //           }
    //           this.firebaseService.editJob(dataFormJob.key, addValue);
    //         })
    //       })
    //     ).subscribe();
    //   }
    // }


    // if (!dataFormJob.value.billNoImageUrl) {
    //   console.log('upload billNoImageUrl');

    //   this.isSubmitted = true;
    //   if (this.formTemplate.valid) {
    //     var billNoFilePath = `image/imageJob/billNo/${this.selectedImage2.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    //     const billNofileRef = this.storage.ref(billNoFilePath);
    //     this.storage.upload(billNoFilePath, this.selectedImage2).snapshotChanges().pipe(
    //       finalize(() => {
    //         billNofileRef.getDownloadURL().subscribe((url) => {
    //           formValue.value['billNoImageUrl'] = url;
    //           const addValue = {
    //             ...formValue.value,
    //             billNoFilePath: billNoFilePath
    //           }
    //           this.firebaseService.editJob(dataFormJob.key, addValue);
    //         })
    //       })
    //     ).subscribe();
    //   }
    // }


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
            // formValue.value['billImageUrl'] = url;
            // const addValue = {
            //   ...formValue.value,
            //   billFilePath: billFilePath
            // }
            // this.firebaseService.editJob(dataFormJob.key, addValue);

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



  editformTemplateFor(formTemplateForEdit, data) {
    console.log('formTemplateForEdit', formTemplateForEdit);

    this.firebaseService.editJob(data.key, formTemplateForEdit.value);
  }

  get formControls() {
    return this.formTemplate['controls'];
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

  deleteImageBill(data) {
    this.checkImageUrlBill = false;
    console.log('deleteImage111111111', data.value);
    data.value = {
      ...data.value,
      billImageUrl: '',
    }

    this.storage.ref(data.value.billFilePath).delete();
    // const editUrl = data.value;
    this.firebaseService.editJob(data.key, data.value);
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
    // const editUrl = data.value
    this.firebaseService.editJob(data.key, data.value);
    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
  }

  checkImageFalse() {
    this.checkImageUrlBill = true;
    this.checkImageUrlNoBill = true;
    this.resetForm();
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

  newEditJob(data) {
    window.open(`/editjob/${data.key}`)
  }
}
