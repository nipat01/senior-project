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
  checkImageUrl = true;
  car: any[];
  constructor(private db: AngularFireDatabase,
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    private service: ImageService,
    private firebaseService: FirebaseService
  ) { }

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    filePath: new FormControl(),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    lastMaintenance: new FormControl('', Validators.required),

  })
  editFormTemplate = new FormGroup({
    // imageUrl: new FormControl(),
    filePath: new FormControl(),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    lastMaintenance: new FormControl('', Validators.required),

  })

  editimageUrl = new FormGroup({
    imageUrl: new FormControl(),
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
    this.resetForm();
  }
  editCarTest(data) {
    console.log(data.value);

  }

  editCar(editFormTemplate, data) {
    // this.checkImageUrl = true;
    console.log('update editFormTemplate', editFormTemplate.value, data.value);
    // console.log('update:', data.key, editFormTemplate.value);
    // if (data.value.imageUrl === '') {
    //   console.log('!editCar', editFormTemplate.value, data);
    //   this.isSubmitted = true;
    //   if (this.editFormTemplate.valid) {
    //     var filePath = `imageCar/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    //     const fileRef = this.storage.ref(filePath);
    //     this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
    //       finalize(() => {
    //         fileRef.getDownloadURL().subscribe((url) => {
    //           editFormTemplate.value['imageUrl'] = url;
    //           const addValue = {
    //             ...editFormTemplate.value,
    //             filePath: filePath
    //           }
    //           this.firebaseService.editCar(data.key, addValue);
    //           // this.resetForm();
    //         })
    //       })
    //     ).subscribe();
    //   }
    //   console.log('filePath', filePath);
    // }
    this.firebaseService.editCar(data.key, editFormTemplate.value);
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
      var filePath = `imageCar/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue.value['imageUrl'] = url;
            formValue.value = {
              ...formValue.value,
              filePath: filePath
            }
            const addValue = formValue.value
            this.service.insertCar(addValue);
            this.resetForm();
          })
        })
      ).subscribe();
    }
    console.log('filePath', filePath);
  }



  checkImageFalse() {
    this.checkImageUrl = true;
    this.resetForm();

  }

  showPreview(event: any) {
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

  resetForm() {
    this.formTemplate.reset();
    this.editimageUrl.reset();

    this.imgSrc = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.isSubmitted = false;
  }

  resetEditForm() {
    this.editFormTemplate.reset();
  }

  delete(data) {
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removeCar(data.key);

  }

  uploadimage(editFormTemplate, data) {
    console.log('update:', data.key, editFormTemplate.value);

    console.log('!editCar', editFormTemplate.value, data);
    this.isSubmitted = true;
    if (this.editFormTemplate.valid) {
      var filePath = `imageCar/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            editFormTemplate.value['imageUrl'] = url;
            const addValue = {
              ...editFormTemplate.value,
              filePath: filePath
            }
            this.firebaseService.editCar(data.key, addValue);
            // this.resetForm();
          })
        })
      ).subscribe();
    }
    console.log('filePath', filePath);
  }

  deleteImage(data) {
    console.log('deleteImage');

    this.checkImageUrl = false;
    console.log(data.value);
    this.storage.ref(data.value.filePath).delete();
    data.value = {
      ...data.value,
      imageUrl: '',
    }
    const editUrl = data.value
    this.firebaseService.editCar(data.key, editUrl);
  }
}
