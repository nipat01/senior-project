import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
  selector: 'app-cartype-user',
  templateUrl: './cartype-user.component.html',
  styleUrls: ['./cartype-user.component.css']
})
export class CartypeUserComponent implements OnInit {
  imageList: any[];//list
  imageList2: any[];//list
  imageList3: any[];//list
  rowIndexArray: any[];//list
  carType;
  car;
  constructor(
    private storage: AngularFireStorage,
    private service: ImageService,
    private db: AngularFireDatabase, ) { }

  ngOnInit() {
    //  //colum1

    //  this.service.getImageDetailCarType1();
    //  this.service.imageDetailList.snapshotChanges().subscribe(
    //    list => {
    //      this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //      this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
    //    }
    //  );
    //  //coloum2

    //  this.service.getImageDetailCarType2();
    //  this.service.imageDetailList.snapshotChanges().subscribe(
    //    list => {
    //      this.imageList2 = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //      this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList2.length + 1) / 3)).keys());
    //    }
    //  );
    //  //colum3

    //  this.service.getImageDetailCarType3();
    //  this.service.imageDetailList.snapshotChanges().subscribe(
    //    list => {
    //      this.imageList3 = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //      this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList3.length + 1) / 3)).keys());
    //    }
    //  );



    this.db.list('carType').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(carType => {
      this.carType = carType;
    });

    // //colum1
    // this.service.getImageDetailCarType1();
    // this.service.imageDetailList.snapshotChanges().subscribe(
    //   list => {
    //     this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
    //     let imageTypeList = [];
    //     for (let index = 0; index < this.carType.length; index++) {
    //       this.carType[index].value = {
    //         ...this.carType[index].value,
    //         count: 0
    //       }
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
    //     for (let index = 0; index < this.carType.length; index++) {
    //       let count = Array.from(Array(Math.ceil((this.carType[index].value.count) / 3)).keys());

    //       this.carType[index].value = {
    //         ...this.carType[index].value,
    //         count2: count
    //       }

    //     }
    //     console.log('this.carType', this.carType);
    //     console.log('this.imageList', this.imageList);

    //     this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());;
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
            if (this.carType[index].key === this.car[index2].value.carType && this.car[index2].value.status ==='พร้อมใช้งาน') {
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

}
