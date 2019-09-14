import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
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
  constructor(
    private storage: AngularFireStorage,
    private service: ImageService) { }

  ngOnInit() {
     //colum1

     this.service.getImageDetailCarType1();
     this.service.imageDetailList.snapshotChanges().subscribe(
       list => {
         this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
         this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
       }
     );
     //coloum2

     this.service.getImageDetailCarType2();
     this.service.imageDetailList.snapshotChanges().subscribe(
       list => {
         this.imageList2 = list.map(item => ({ key: item.key, value: item.payload.val() }));
         this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList2.length + 1) / 3)).keys());
       }
     );
     //colum3

     this.service.getImageDetailCarType3();
     this.service.imageDetailList.snapshotChanges().subscribe(
       list => {
         this.imageList3 = list.map(item => ({ key: item.key, value: item.payload.val() }));
         this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList3.length + 1) / 3)).keys());
       }
     );
  }

}
