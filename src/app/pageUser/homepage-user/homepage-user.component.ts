import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from "../../services/auth.service";
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-homepage-user',
  templateUrl: './homepage-user.component.html',
  styleUrls: ['./homepage-user.component.css']
})
export class HomepageUserComponent implements OnInit ,OnChanges{

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }
  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  homepage: any[];
  home: any = {};
  video: any[];
  linkVideo;
  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public auth: AuthService
  ) { }
  // constructor() { }

  ngOnInit() {
    this.db.list('homepage').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(homepage => {
      console.log(homepage)
      this.homepage = homepage;
      console.log(this.homepage[0].value.video);
      this.linkVideo = this.getVdoUrl('https://www.youtube.com/embed/' + `${this.homepage[0].value.video}`);
    });

    this.db.list('video').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(video => {
      console.log(video)
      this.video = video;

    });
  }
  getVdoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

// }
