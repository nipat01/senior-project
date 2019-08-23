import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AddCarComponent } from '../add-car/add-car.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  carList: Observable<any>;
  // wikiList: AngularFireList<any>;
  car: any[];
  constructor(private db: AngularFireDatabase,
    private modalService: NgbModal
    ) {
    // this.wikiList = db.list('wikis');

  }
  ngOnInit() {
    this.db.list('car').valueChanges().subscribe(car => {
      console.log(car);
      this.car = car;
    }, error => {
      console.log(error);
    });
  }
  open() {
    const modalRef = this.modalService.open(AddCarComponent);
    modalRef.componentInstance.name = 'World';
  }



}
