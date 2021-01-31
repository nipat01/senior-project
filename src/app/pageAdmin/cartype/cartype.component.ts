import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, count } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartype',
  templateUrl: './cartype.component.html',
  styleUrls: ['./cartype.component.css']
})
export class CartypeComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;

  imageList: any[];//list
  imageList2: any[];//list
  imageList3: any[];//list
  rowIndexArray: any[];//list

  checkSelect;
  carType1;
  carType2;
  carType3;
  //แสดง การเพิ่มข้อมูลประเภทรถ
  showAddCarType = false;
  //ที่เก็บประเภทรถ
  carType;
  car;
  imageCount: any[];

  updateNameCarType = [];
  formTemplate = new FormGroup({
    // caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required)
  })

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private service: ImageService,
    private firebaseService: FirebaseService,
    private modalService: NgbModal,
    private router: Router, ) { }

  ngOnInit() {

    this.updateNameCarType[0] = '';

    this.db.list('carType').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(carType => {
      // console.log('carType', carType[0].value)
      this.carType = carType;
    });

    // //colum1
    // this.resetForm();
    // this.service.getImageDetailCarType1();
    // this.service.imageDetailList.snapshotChanges().subscribe(
    //   list => {
    //     this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //     // console.log('imageList', this.imageList.length);
    //     // console.log('this.imageList', this.imageList);
    //     let imageTypeList = [];
    //     for (let index = 0; index < this.carType.length; index++) {
    //       this.carType[index].value = {
    //         ...this.carType[index].value,
    //         count: 0
    //       }
    //       // console.log(this.carType[index].value);
    //       let indexList = 0
    //       let Array2 = [];
    //       for (let index2 = 0; index2 < this.imageList.length; index2++) {
    //         if (this.carType[index].key === this.imageList[index2].value.category) {
    //           this.imageList[index2].value = {
    //             ...this.imageList[index2].value,
    //             count: 1,
    //             index: indexList,
    //             key: this.imageList[index2].key
    //           }
    //           indexList++
    //           // console.log(this.imageList[index2].value.count);
    //           // console.log((Array.from(Array(this.imageList[index2].value))));
    //           Array2.push((Array.from(Array(this.imageList[index2].value))));

    //           this.carType[index].value = {
    //             ...this.carType[index].value,
    //             count: this.carType[index].value.count + this.imageList[index2].value.count,
    //             list: Array2,
    //             length: Array2.length
    //           }


    //         }

    //       }
    //     }
    //     // console.log('this.carType', this.carType);
    //     for (let index = 0; index < this.carType.length; index++) {
    //       // console.log(this.carType[index].value.count);
    //       // let count = Array.from(Array(Math.ceil((this.carType[index].value.count).key())));
    //       let count = Array.from(Array(Math.ceil((this.carType[index].value.count) / 3)).keys());

    //       this.carType[index].value = {
    //         ...this.carType[index].value,
    //         count2: count
    //       }
    //       // console.log(this.carType[index].value);

    //     }
    //     console.log('this.carType', this.carType);
    //     console.log('this.imageList', this.imageList);



    //     // console.log(imageTypeList.reduce((x, y) => x.includes(y) ? x : [...x, y], []));

    //     // console.log(this.imageCount.push(obj));
    //     this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
    //     // console.log('row', this.rowIndexArray);
    //     // this.imageList = imageList.reduce((x, y) => x.includes(y) ? x : [...x, y], []);
    //   }
    // );

    this.db.list('car').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(car => {
      console.log(car)
      this.car = car;

      let imageTypeList = [];
      for (let index = 0; index < this.carType.length; index++) {
        this.carType[index].value = {
          ...this.carType[index].value,
          count: 0
        }
        let indexList = 0
        let Array2 = [];
        for (let index2 = 0; index2 < this.car.length; index2++) {
          if (this.carType[index].key === this.car[index2].value.carType && this.car[index2].value.status === 'พร้อมใช้งาน') {
            this.car[index2].value = {
              ...this.car[index2].value,
              count: 1,
              index: indexList,
              // key: this.car[index2].key
            }
            indexList++
            Array2.push((Array.from(Array(this.car[index2].value))));

            this.carType[index].value = {
              ...this.carType[index].value,
              count: this.carType[index].value.count + this.car[index2].value.count,
              list: Array2,
              length: Array2.length
            }


          }

        }
      }
      for (let index = 0; index < this.carType.length; index++) {
        let count = Array.from(Array(Math.ceil((this.carType[index].value.count) / 3)).keys());

        this.carType[index].value = {
          ...this.carType[index].value,
          count2: count
        }

      }
      console.log('this.carType', this.carType);
      console.log('this.car', this.car);

      this.rowIndexArray = Array.from(Array(Math.ceil((this.car.length + 1) / 3)).keys());;


    });


  }

  openDeleteImage(deleteImg) {
    console.log('deleteImg', deleteImg);
    this.modalService.open(deleteImg)
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

  onSubmit(formValue) {
    console.log('form', formValue);

    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `carType//${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            const addPath = {
              ...formValue,
              filePath: filePath,
            }
            this.service.insertImageDetails(addPath);
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();

    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  deleteImageType1(data) {
    console.log('delete', data);
    this.storage.ref(data[0].filePath).delete();
    this.firebaseService.removCartype1(data[0].key);
  }
  // deleteImageType2(data) {
  //   console.log(data);
  //   this.storage.ref(data.value.filePath).delete();
  //   this.firebaseService.removCartype2(data.key);
  // }
  // deleteImageType3(data) {
  //   console.log(data);
  //   this.storage.ref(data.value.filePath).delete();
  //   this.firebaseService.removCartype3(data.key);
  // }

  selectCheckValue(event) {
    this.checkSelect = event.target.value
    console.log('checkSelect', this.checkSelect);
  }

  openAddCarType() {
    this.showAddCarType = true;
  }

  addCarType(data) {
    console.log(this.updateNameCarType);

    if (this.updateNameCarType[0]) {
      this.firebaseService.editCarType(this.updateNameCarType[0], data.value);
      this.resetCarType();
      //update การแสดงรูปภาพ
      this.db.list('car').snapshotChanges().map(actions => {
        return actions.map(action => ({ key: action.key, value: action.payload.val() }));
      }).subscribe(car => {
        console.log(car)
        this.car = car;

        let imageTypeList = [];
        for (let index = 0; index < this.carType.length; index++) {
          this.carType[index].value = {
            ...this.carType[index].value,
            count: 0
          }
          let indexList = 0
          let Array2 = [];
          for (let index2 = 0; index2 < this.car.length; index2++) {
            if (this.carType[index].key === this.car[index2].value.carType && this.car[index2].value.status === 'พร้อมใช้งาน') {
              this.car[index2].value = {
                ...this.car[index2].value,
                count: 1,
                index: indexList,
                // key: this.car[index2].key
              }
              indexList++
              Array2.push((Array.from(Array(this.car[index2].value))));

              this.carType[index].value = {
                ...this.carType[index].value,
                count: this.carType[index].value.count + this.car[index2].value.count,
                list: Array2,
                length: Array2.length
              }


            }

          }
        }
        for (let index = 0; index < this.carType.length; index++) {
          let count = Array.from(Array(Math.ceil((this.carType[index].value.count) / 3)).keys());

          this.carType[index].value = {
            ...this.carType[index].value,
            count2: count
          }

        }
        console.log('this.carType', this.carType);
        console.log('this.car', this.car);

        this.rowIndexArray = Array.from(Array(Math.ceil((this.car.length + 1) / 3)).keys());;


      });



    }
    else {
      console.log('data', data.value);
      this.db.list("/carType").push(data.value);
    }
  }

  updateCarType(data) {
    this.showAddCarType = true;

    this.updateNameCarType[0] = data.key
    this.updateNameCarType[1] = data.value.carType
    this.updateNameCarType[2] = data.value.status
    console.log(' this.updateNameCarType', this.updateNameCarType);

  }

  resetCarType() {
    this.updateNameCarType = [];
  }

  goToManageCar() {
    this.router.navigate([`/car`]);
  }

}
