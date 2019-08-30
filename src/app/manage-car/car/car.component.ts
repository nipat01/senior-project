import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AddCarComponent } from '../add-car/add-car.component';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  carList: Observable<any>;

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  car: any[];
  constructor(private db: AngularFireDatabase,
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    private service: ImageService,
    private firebaseService: FirebaseService
  ) { }

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    lastMaintenance: new FormControl('', Validators.required),

  })

  ngOnInit() {
    // this.db.list('car').valueChanges().subscribe(car => {
    //   console.log(car);
    //   this.car = car;
    // }, error => {
    //   console.log(error);
    // });
    this.db.list('car').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;

    });





    // show img
    this.starForm()
  }
  editCar(formTemplate ,data) {
    console.log('update:',data.key, formTemplate.value);
    this.firebaseService.editCar(data.key, formTemplate.value);

  }
  // open() {
  //   const modalRef = this.modalService.open(AddCarComponent);
  //   modalRef.componentInstance.name = 'World';
  // }
  openBill(content) {
    console.log(111);
    this.modalService.open(content);

  }
  openEditCar(content) {
    console.log(111);
    this.modalService.open(content);

  }
  openData(con) {
    this.modalService.open(con);
  }
  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `image/Job/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue.value['imageUrl'] = url;
            this.service.insertImageJob(formValue.value);

          })
        })
      ).subscribe();
    }

  }
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      // this.imgSrc = '/assets/img/image_placeholder.jpg';
      // this.selectedImage = null;
    }
  }
  starForm() {
    this.imgSrc = '/assets/img/image_placeholder.jpg';

    // this.selectedImage = null;
    // this.selectedImage2 = null;
    // this.isSubmitted = false;
  }

}
