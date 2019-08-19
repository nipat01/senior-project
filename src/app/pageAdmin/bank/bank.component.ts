import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  bank: any[];
  // constructor() { }
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit() {
    this.db.list('bank').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(bank => {
      console.log(bank)
      this.bank = bank;

    });
  }


  addBank(data) {
    console.log(this.db.list('bank').snapshotChanges().subscribe());
    console.log(this.bank);
    if (this.bank.length === 0) {
      this.db.list("/bank").push(data.value);
    } else {
      console.log('updating');
      console.log(this.bank[0].key);
      const key = this.bank[0].key;
      this.firebaseService.editBank(key,data.value);
    }
  }
}
