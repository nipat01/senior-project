import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // wikiList: Observable<any>;
  wikiList: AngularFireList<any>;
  wikis: any[];

  constructor(private db: AngularFireDatabase, private firebaseService: FirebaseService, private router: Router ) { }
  // constructor(private db: AngularFireDatabase, private router: Router) {}
  ngOnInit() {




    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;

    });






  }

  editWiki(data) {
    this.router.navigate([`/editWiki/${data.key}`]);
    }

  delWiki(data) {
    this.firebaseService.removeWiki(data.key);
  }

}



// import { Component, OnInit } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Router } from '@angular/router';
// import { Action } from 'rxjs/internal/scheduler/Action';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {
//   wikiList: AngularFireList<any>;
//   wikis: any[];
//   constructor(private db: AngularFireDatabase, private router: Router) {
//     this.wikiList = db.list('wikis');
//   }
//   ngOnInit() {
//     this.wikiList.snapshotChanges().map(actions => {
//       return actions.map(action => ({key: action.payload, value: action.payload.val() }));
//     }).subscribe(wikis => {
//       console.log(wikis)
//       this.wikis = wikis;

//     });
//   }



//   editWiki(data) {
//     this.router.navigate([`/editWiki/${data.key}`]);
//   }
//   delWiki(data) {
//     this.wikiList.remove(data.key);
//   }
// }
