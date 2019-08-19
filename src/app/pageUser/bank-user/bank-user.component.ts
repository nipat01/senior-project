import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bank-user',
  templateUrl: './bank-user.component.html',
  styleUrls: ['./bank-user.component.css']
})
export class BankUserComponent implements OnInit {
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

}
