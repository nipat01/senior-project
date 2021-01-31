import { Component, OnInit, OnChanges } from '@angular/core';
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
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }
  carList: Observable<any>;

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  checkImageUrl = true;
  car: any[];
  carType: any[];

  // tap---------
  showAddCarType;
  trueFalseSelect;
  updateNameCarType = [];
  //checkSubmitAndDel
  checkSubmitAndDel = [];
  //
  editSubmitMaintenance = [];
  constructor(private db: AngularFireDatabase,
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    private service: ImageService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    filePath: new FormControl(),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    // lastMaintenance: new FormControl('', Validators.required),
    colorCar: new FormControl('', Validators.required),

  })
  editFormTemplate = new FormGroup({
    // imageUrl: new FormControl(),
    filePath: new FormControl(),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    // lastMaintenance: new FormControl('', Validators.required),
    datailMaintenance: new FormControl(),
    dayMaintenance: new FormControl()
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

    this.db.list('carType').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(carType => {
      // console.log('carType', carType[0].value)
      this.carType = carType;
    });

    this.db.list('car').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      // console.log(car)
      this.car = car;
      console.log(this.car);
      for (let index = 0; index < this.carType.length; index++) {
        for (let index2 = 0; index2 < this.car.length; index2++) {

          if (this.carType[index].key == this.car[index2].value.carType) {
            // console.log('this.carType[index]', this.carType[index].key);
            // console.log('this.car[index2]', this.car[index2].value.carType);
            this.car[index2].value = {
              ...this.car[index2].value,
              carType: this.carType[index].value.carType
            }
            // console.log('this.car[index2].value', this.car[index2].value);
          }

        }
      }
      this.car.sort(function (a, b) {
        if (a.value.carType < b.value.carType) { return -1; }
        if (a.value.carType > b.value.carType) { return 1; }
        return 0;
      });


    });


    // show img
    this.resetForm();
  }

  editCarTest(data) {
    console.log(data.value);
  }

  editCar(editFormTemplate, data) {
    // this.checkImageUrl = true;
    // console.log('update editFormTemplate', editFormTemplate.value);
    // console.log(data.value);
    let beforeCarType = data.value.carType
    for (let index = 0; index < this.carType.length; index++) {

      if (this.carType[index].value.carType == data.value.carType) {
        data.value = {
          ...data.value,
          carType: this.carType[index].key,
          datailMaintenance: '',
          dayMaintenance: '',

        }

        // console.log('after Data', data.value);
      }
    }

    // editFormTemplate.value = {
    //   ...editFormTemplate.value,
    //   filePath: data.value.filePath,
    //   imageUrl: data.value.imageUrl
    // }
    // console.log(editFormTemplate.value);

    this.firebaseService.editCar(data.key, data.value);
    data.value = {
      ...data.value,
      carType: beforeCarType,

    }
    // console.log('change Data', data.value);

  }

  // open() {
  //   const modalRef = this.modalService.open(AddCarComponent);
  //   modalRef.componentInstance.name = 'World';
  // }

  open(content, value) {
    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบข้อมูลหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }

  openBill(content) {
    console.log(111);
    this.modalService.open(content, { size: 'lg' });

  }
  openEditCar(content) {
    console.log(111);
    this.modalService.open(content, { size: 'lg' });

  }
  openData(con) {
    this.modalService.open(con, { size: 'lg' });
  }

  openDeleteImage(deleteImg) {
    console.log('deleteImg');
    this.modalService.open(deleteImg)

  }

  onSubmit(formValue) {
    console.log('form', formValue);
    formValue.value = {
      ...formValue.value,
      // lastMaintenance: `${formValue.value.lastMaintenance.year}/${formValue.value.lastMaintenance.month}/${formValue.value.lastMaintenance.day}`,
      purchaseDate: `${formValue.value.purchaseDate.year}/${formValue.value.purchaseDate.month}/${formValue.value.purchaseDate.day}`
    }
    console.log('after form', formValue.value);
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
            console.log('addValue', addValue);
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
              filePath: filePath,
              detail: ''
            }
            this.firebaseService.editCar(data.key, addValue);
            // this.resetForm();
          })
        })
      ).subscribe();
    }
    console.log('filePath', filePath);
  }

  addMaintenance(data, editFormTemplate) {
    console.log(editFormTemplate.value, data.value);
    //  if(){
    let arrayMaintenance = []
    if (data.value.detail) {
      arrayMaintenance = data.value.detail;
    }

    let objMaintenance = {
      datailMaintenance: editFormTemplate.value.datailMaintenance,
      dayMaintenance: editFormTemplate.value.dayMaintenance
    }

    arrayMaintenance.push((objMaintenance));
    console.log(arrayMaintenance);
    data.value = {
      ...data.value,
      detail: arrayMaintenance,
      datailMaintenance: '',
      dayMaintenance: '',
    }
    console.log(data.value);

    this.firebaseService.editCar(data.key, data.value);
    // }
  }

  editMaintenance(data, i) {
    console.log(data, i)
    // console.log(data.value.detail);
    this.editSubmitMaintenance[0] = '.'
    this.editSubmitMaintenance[1] = i
    data.value.dayMaintenance = data.value.detail[i].dayMaintenance
    data.value.datailMaintenance = data.value.detail[i].datailMaintenance
  }

  submitEditMaintenance(data, editFormTemplate, value) {
    if (value === 'clear') {
      console.log('clear');
      data.value.dayMaintenance = '';
      data.value.datailMaintenance = ''
      this.editSubmitMaintenance[0] = '';
    }
    else {
      this.editSubmitMaintenance[0] = '';
      data.value.detail[this.editSubmitMaintenance[1]].dayMaintenance
        = editFormTemplate.value.dayMaintenance;
      data.value.detail[this.editSubmitMaintenance[1]].datailMaintenance
        = editFormTemplate.value.datailMaintenance;
      console.log(data.value);

      data.value.dayMaintenance = '',
        data.value.datailMaintenance = ''
      this.firebaseService.editCar(data.key, data.value);
    }

  }

  deleteListMaintenance(data, i) {
    console.log(data);
    // console.log(data.value.detail);
    let index = data.value.detail.indexOf(data.value.detail[i])
    if (index > -1) {
      data.value.detail.splice(index, 1);
    }
    data.value = {
      ...data.value,
      detail: data.value.detail
    }
    console.log(data.value);
    console.log(data.value.detail);
    this.firebaseService.editCar(data.key, data.value);

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

  goToCarType(content) {
    // this.router.navigate([`/cartypeadmin`]);
    this.modalService.dismissAll(content);

    this.showAddCarType = true;
  }

  // tap2 -------------------
  openAddCarType() {
    this.showAddCarType = true;
  }

  updateCarType(data) {
    this.showAddCarType = true;
    this.trueFalseSelect = false;

    this.updateNameCarType[0] = data.key
    this.updateNameCarType[1] = data.value.carType
    this.updateNameCarType[2] = data.value.status
    console.log(' this.updateNameCarType', this.updateNameCarType);

  }

  addCarType(data) {
    console.log(this.updateNameCarType);

    if (this.updateNameCarType[0]) {
      this.firebaseService.editCarType(this.updateNameCarType[0], data.value);
    }
    else {
      console.log('data', data.value);
      this.db.list("/carType").push(data.value);
      this.updateNameCarType = [];

    }
  }

  resetCarType() {
    this.updateNameCarType = [];
  }

}
