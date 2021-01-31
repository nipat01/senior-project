import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { database } from 'firebase';
import { AuthService } from '../../../services/auth.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
@Component({
  selector: 'app-proceeded-job-driver',
  templateUrl: './proceeded-job-driver.component.html',
  styleUrls: ['./proceeded-job-driver.component.css']
})
export class ProceededJobDriverComponent implements OnInit, OnChanges {

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
  job1: any[];

  carList: AngularFireList<any>;
  car: any[];
  id;
  imgSrc2;
  selectedImage2;
  checkImageUrlNoBill = true;
  isSubmitted: boolean;

  checkImageUrlBill = true;

  formBillNoImageUrl: FormGroup = new FormGroup({
    billNoImageUrl: new FormControl()
  })

  constructor(private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private modalService: NgbModal,
    // private auth: AuthService
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
    this.db.list('job').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(job => {
      console.log(job)
      this.job = job.filter((data: any) => data.value.status === 'proceeded'
        && data.value.emailDriver === this.auth.username);
      // this.job = job

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

  openBill(data, content, contentEdit) {
    console.log('open content');

    this.modalService.open(content, { size: 'xl' });

  }

  openDeleteBill2(content) {
    console.log('delete2');
    this.modalService.open(content);

  }

  checkImageFalse() {
    this.checkImageUrlNoBill = true;
    this.resetForm();
  }
  resetForm() {
    this.formBillNoImageUrl.reset();
    this.imgSrc2 = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.isSubmitted = false;
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

  uploadbillNoImage(formValue, dataFormJob) {

    console.log('upload billNoImageUrl', dataFormJob);

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
  }

}
