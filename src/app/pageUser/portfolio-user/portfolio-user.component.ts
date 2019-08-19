import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';


@Component({
  selector: 'app-portfolio-user',
  templateUrl: './portfolio-user.component.html',
  styleUrls: ['./portfolio-user.component.css']
})
export class PortfolioUserComponent implements OnInit {
  imageList: any[];//list
  rowIndexArray: any[];//list
  constructor(private storage: AngularFireStorage, private service: ImageService) { }

  ngOnInit() {
    // list
    this.service.getImageDetailList();

    this.service.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.imageList = list.map(item => { return item.payload.val(); });
        console.log(this.imageList);
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
      }
    );

  }

}
