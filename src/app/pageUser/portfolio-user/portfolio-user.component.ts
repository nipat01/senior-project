import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';



@Component({
  selector: 'app-portfolio-user',
  templateUrl: './portfolio-user.component.html',
  styleUrls: ['./portfolio-user.component.css']
})
export class PortfolioUserComponent implements OnInit {
  imageList: any[];//list
  rowIndexArray: any[];//list
  constructor(private storage: AngularFireStorage,
    private service: ImageService) { }

  ngOnInit() {
    this.service.getImageDetailPortfolioList();
    this.service.imageDetaiPortfoliolList.snapshotChanges().subscribe(
      list => {
        this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());

        console.log('value', this.imageList, 'imageListLength', this.imageList.length);
        console.log('array', this.rowIndexArray, 'rowIndexArrayLength', this.rowIndexArray.length);
      }
    );


  }

}
