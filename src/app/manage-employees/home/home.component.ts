import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWikiComponent } from '../add-wiki/add-wiki.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // wikiList: Observable<any>;
  wiki: any = {};
  title: string = "Add Wiki";
  id;
  wikis: { key: string; value: unknown; }[];


  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalService: NgbModal,
            ) {}
  // constructor(private db: AngularFireDatabase, private router: Router) {}
  ngOnInit() {

    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;

    });
  }

  buildForm() {
    throw new Error("Method not implemented.");
  }
  getWikiByKey(id: any) {
    throw new Error("Method not implemented.");
  }

  editWiki(data) {
    this.router.navigate([`/editWiki/${data.key}`]);
    }

  delWiki(data) {
    this.firebaseService.removeWiki(data.key);
  }
  open() {
    const modalRef = this.modalService.open(AddWikiComponent);
    modalRef.componentInstance.name = 'World';
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
