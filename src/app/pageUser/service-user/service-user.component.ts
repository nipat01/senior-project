import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';


@Component({
  selector: 'app-service-user',
  templateUrl: './service-user.component.html',
  styleUrls: ['./service-user.component.css']
})
export class ServiceUserComponent implements OnInit {
  imageList: any[];//list
  rowIndexArray: any[];//list
  constructor(private storage: AngularFireStorage,
    private service: ImageService) { }


  ngOnInit() {
    this.service.getImageDetailServiceList();
    this.service.imageDetailServiceList.snapshotChanges().subscribe(
      list => {
        this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 4)).keys());
      }
    );
  }

}
