import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  bank: any[];
  bank2: any;
  checkBank = true;
  buttonSubmit;
  checkSubmitAndDel  = [];
  // constructor() { }
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  formBank = new FormGroup({
    bank: new FormControl(),
    typeBank: new FormControl(),
    banch: new FormControl(),
    bankNo: new FormControl(),
    nameAccountBank: new FormControl(),
  })

  ngOnInit() {
    this.buttonSubmit = 'บันทึก';
    this.bank2 = {
      "key": "",
      "value": {
        "banch": "",
        "bank": "",
        "bankNo": "",
        "nameAccountBank": "",
        "typeBank": "",
      }
    }

    this.db.list('bank').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(bank => {
      console.log(bank)
      this.bank = bank;

    });

  }

  open(content, value) {

    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบข้อมูลหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }

  addBank(data) {
    console.log('data', data.key, data.value);
    console.log('this.bank2', this.bank2);

    this.checkBank = true;
    if (!this.bank2.key) {
      this.db.list("/bank").push(data.value);
      this.formBank.reset();
    }
    else {
      this.firebaseService.editBank(this.bank2.key, data.value);
      this.formBank.reset();
      this.buttonSubmit = 'บันทึก';

      this.bank2 = {
        "key": "",
        "value": {
          "banch": "",
          "bank": "",
          "bankNo": "",
          "nameAccountBank": "",
          "typeBank": "",
        }
      }
    }

    // if (this.bank.length === 0) {
    //   this.db.list("/bank").push(data.value);
    // } else {
    //   console.log('updating');
    //   console.log(this.bank[0].key);
    //   const key = this.bank[0].key;
    //   this.firebaseService.editBank(key, data.value);
    // }


  }

  editBank(data) {
    this.buttonSubmit = 'แก้ไข';
    console.log('data', data);
    this.bank2 = data
    console.log('bank2', this.bank2);
  }

  resetBank() {
    this.bank2 = {
      "key": "",
      "value": {
        "banch": "",
        "bank": "",
        "bankNo": "",
        "nameAccountBank": "",
        "typeBank": "",
      }
    }
    this.buttonSubmit = 'บันทึก';
    this.formBank.reset();
  }

  deleteBank(data) {
    this.firebaseService.removeBank(data.key);
  }

  selectValue(check) {
    console.log('data', check.target.value);
    if (check.target.value === 'other') {
      this.checkBank = false
    }

  }

}
