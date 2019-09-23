import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  homepage: any[];
  video: any[];

  get videoUrl()  {
    return this.video;
  }


  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }
  // constructor(private db: AngularFireDatabase, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    // this.id = this.route.snapshot.paramMap.get("id");
    // if (this.id) {
    //   this.getHomepageByKey(this.id);
    // this.title = "Edit wiki";


    this.db.list('homepage').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(homepage => {
      console.log(homepage)
      this.homepage = homepage;

    });

    this.db.list('video').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(video => {
      console.log(video)
      this.video = video;

    });
  }


  addHomepage(data) {
    console.log(this.db.list('homepage').snapshotChanges().subscribe());
    console.log(this.homepage);
    if (this.homepage.length === 0) {
      this.db.list("/homepage").push(data.value);
    } else {
      console.log('updating');
      console.log(this.homepage[0].key);
      const key = this.homepage[0].key;
      this.firebaseService.editHomepage(key,data.value);
    }
  }

  addVideo(data){
    console.log(this.db.list('video').snapshotChanges().subscribe());
    console.log(this.video);
    if (this.video.length === 0) {
      this.db.list("/video").push(data.value);
    } else {
      console.log('updating');
      // console.log(this.video[0].key);
      const key = this.video[0].key;
      this.firebaseService.editVideo(key,data.value);
    }
  }

  getVdoUrl(url: string): SafeResourceUrl {
    // console.log('url',url);
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

