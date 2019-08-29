import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';

import { finalize } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from '../../services/image/image.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-proceeded-job',
  templateUrl: './proceeded-job.component.html',
  styleUrls: ['./proceeded-job.component.css']
})
export class ProceededJobComponent implements OnInit {
  jobList: AngularFireList<any>
  job: any[];

  carList: AngularFireList<any>;
  car: any[];



  imgSrc: string;
  imgSrc2: string;
  selectedImage: any = null;
  selectedImage2: any = null;
  isSubmitted: boolean;

  imageList: any[];//list
  rowIndexArray: any[];//list

  formTemplate: FormGroup = new FormGroup({
    totalPayment: new FormControl('', Validators.required),
    deposit: new FormControl('', Validators.required),
    bill: new FormControl('', Validators.required),
    billNo: new FormControl('', Validators.required),
    billImageUrl: new FormControl('', Validators.required),
    billNoImageUrl: new FormControl('', Validators.required)
  })

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private service: ImageService,
    private storage: AngularFireStorage) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceeded');
      // this.job = job



      this.starForm();



      this.service.getImageDetailServiceList();
      this.service.imageDetailServiceList.snapshotChanges().subscribe(
        list => {
          this.imageList = list.map(item => { return item.payload.val(); });
          this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
          console.log(this.imageList);
        }
      );
    });

    // this.db.list('car').snapshotChanges().map(action => {
    //   return action.map(action => ({ key: action.key, value: action.payload.val() }));
    // }).subscribe(car => {
    //   console.log(car)
    //   this.car = car;
    // })
  }
  delJob(data) {
    this.firebaseService.removeJob(data.key);
  }
  editJob(data) {
    console.log(data.value);
    const jobData = {
      ...data.value,
      status: 'proceeded'
    }
    console.log(jobData);
    this.firebaseService.editJob(data.key, jobData);
  }

  open(content) {
    console.log(111);
    this.modalService.open(content);

  }


  openData(con) {
    this.modalService.open(con);
  }

  openReview(review) {
    this.modalService.open(review);
  }





  onSubmit(formValue, dataFormJob) {

    this.firebaseService.editJob(dataFormJob.key, formValue.value);

    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var billFilePath = `image/imageJob/bill/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      var billNoFilePath = `image/imageJob/billNo/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;

      const billfileRef = this.storage.ref(billFilePath);
      const billNofileRef = this.storage.ref(billFilePath);

      this.storage.upload(billFilePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          billfileRef.getDownloadURL().subscribe((url) => {
            formValue.value['billImageUrl'] = url;
            this.firebaseService.editJob(dataFormJob.key, formValue.value);
          })
        })
      ).subscribe();
      this.storage.upload(billNoFilePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          billNofileRef.getDownloadURL().subscribe((url) => {
            formValue['billNoImageUrl'] = url;
            // this.service.insertImagePortfolioDetails(formValue);
            this.firebaseService.editJob(dataFormJob.key, formValue.value);
          })
        })
      ).subscribe();
    }
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
    console.log('showPreview', this.formTemplate.get('billImageUrl').value);
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
    console.log(this.formTemplate.get('billNoImageUrl').value);
    if (event2.target.files && event2.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc2 = e.target.result;
      reader.readAsDataURL(event2.target.files[0]);
      this.selectedImage = event2.target.files[0];
    }
    else {
      this.imgSrc2 = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

}
