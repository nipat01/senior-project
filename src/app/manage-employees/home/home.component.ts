import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseService } from '../../services/firebase-service.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWikiComponent } from '../add-wiki/add-wiki.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { AppComponent } from 'src/app/app.component';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  // wikiList: Observable<any>;
  // wiki: any = {};
  wikis: any = []
  // wikis: { key: string; value: unknown; }[];


  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }


  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  formValue: any;

  checkImageUrl = true;

  formTemplate = new FormGroup({
    imageUrl: new FormControl(),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    // addressLat: new FormControl('', Validators.required),
    // addressLong: new FormControl('', Validators.required),
    currentAddress: new FormControl('', Validators.required),
    currentLat: new FormControl(),
    currentLong: new FormControl(),
    // role: new FormControl('', Validators.required),
    lineId: new FormControl('', Validators.required),
    citizenId: new FormControl('', Validators.required),
    phoneId: new FormControl('', Validators.required),
    hireDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    token: new FormControl('', Validators.required),
    filePath: new FormControl(),

  });
  editwikiForm = new FormGroup({
    email: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    // addressLat: new FormControl('', Validators.required),
    // addressLong: new FormControl('', Validators.required),
    currentAddress: new FormControl('', Validators.required),
    // currentLat: new FormControl('', Validators.required),
    // currentLong: new FormControl('', Validators.required),
    // role: new FormControl('', Validators.required),
    lineId: new FormControl('', Validators.required),
    citizenId: new FormControl('', Validators.required),
    phoneId: new FormControl('', Validators.required),
    hireDate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  editImageUrl = new FormGroup({
    imageUrl: new FormControl(),
  })


  constructor(
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
    private storage: AngularFireStorage,
    private service: ImageService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
  ) { }

  longitude: number;
  latitude: number;
  zoom: number;
  checkSubmitAndDel = [];

  ngOnInit() {
    // this.latitude = 14.0352539;
    // this.longitude = 100.7210703;
    // this.zoom = 8;

    this.db.list('wikis').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    }).subscribe(wikis => {
      console.log(wikis)
      this.wikis = wikis;

    });
    this.resetForm();

  }

  openAddEmployees(content) {
    this.setCurrentLocation();
    const modalRef = this.modalService.open(content, { size: 'lg' });
  }

  openData(contentData) {
    const modalRef = this.modalService.open(contentData, { size: 'lg' });
  }

  openCurrentAddress(contentCurrent) {
    const modalRef = this.modalService.open(contentCurrent);
  }
  openEditData(contentEditData) {
    const modalRef = this.modalService.open(contentEditData, { size: 'lg' });
  }

  openDeleteImage(deleteImg) {
    console.log('deleteImg');
    this.modalService.open(deleteImg)

  }

  open(content, value) {

    if (value === 'del') {
      this.checkSubmitAndDel[0] = "ต้องการลบข้อมูลหรือไม่";
      this.checkSubmitAndDel[1] = "ลบ";
    }
    this.modalService.open(content);
  }

  resetPassword(data) {
    this.auth.resetPassword(data.value.email)
  }

  deleteAccount(data2) {
    // console.log('data2',data2.value.email);
    // this.auth.deleteAccount(data2.value.email)
  }



  getCurentAddress() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        currentLat: '',
        currentLong: '',
        sendCoordinates: 'send!',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }

  }
  resetCoordinates() {
    this.wikis;
    console.log(this.wikis.length);
    // console.log(getDataWikis[0].key);
    for (let i = 0; i < this.wikis.length; i++) {
      console.log('test')
      const setCurrentWikis = {
        ...this.wikis[i],
      }
      let setCurrent = setCurrentWikis.value
      let setCur2 = {
        ...setCurrent,
        sendCoordinates: '',
      }
      console.log('setCurrent', setCurrent);
      console.log('setCur2', setCur2);
      // console.log('setCurrentWikis', setCurrentWikis);
      // console.log('showValue', this.wikis[i].key,);

      this.firebaseService.editWiki(this.wikis[i].key, setCur2);
    }
  }

  delWiki(data) {
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removeWiki(data.key);
  }

  deleteImage(data) {
    this.checkImageUrl = false;
    this.resetForm();
    console.log(data.value.filePath);
    this.storage.ref(data.value.filePath).delete();
    const editUrl = {
      ...data.value,
      imageUrl: '',
    }
    this.firebaseService.editWiki(data.key, editUrl);


  }

  checkImageFalse() {
    this.checkImageUrl = true;
    this.resetForm();

  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      // this.imgSrc = '/assets/img/image_placeholder.jpg';
      // this.selectedImage = null;
    }
  }
  starForm() {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.selectedImage2 = null;
    // this.isSubmitted = false;
  }



  onSubmit(formValue) {
    console.log(formValue.value);

    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `image/wikis/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue.value['imageUrl'] = url;
            const addValue = {
              ...formValue.value,
              filePath: filePath,
              currentLat: this.latitude,
              currentLong: this.longitude,
              hireDate: `${formValue.value.hireDate.day}/${formValue.value.hireDate.month}/${formValue.value.hireDate.year}`

            }
            this.service.creatWikis(addValue);
            this.auth.emailSignUp(this.formTemplate.value.email, this.formTemplate.value.password);
            this.resetForm();
          })
        })
      ).subscribe();
    }
    console.log('filePath', filePath);
  }

  editWiki(editwikiForm, data) {
    console.log('111');
    console.log('editwikiForm', editwikiForm.value);
    console.log('data', data.value);
    editwikiForm.value = {
      ...editwikiForm.value,
      ...data.value
    }
    // this.router.navigate([`/editWiki/${data.key}`]);
    console.log('editwikiForm', editwikiForm.value);
    this.firebaseService.editWiki(data.key, editwikiForm.value);
  }

  uploadImage(editImageUrl, data) {
    // console.log('update:', data.key, editImageUrl.value);
    // data.value.
    console.log('!editCar', editImageUrl.value, data);
    this.isSubmitted = true;
    if (this.editImageUrl.valid) {
      var filePath = `imageCar/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            data.value['imageUrl'] = url;
            data.value = {
              ...data.value,
              filePath: filePath
            }
            this.firebaseService.editWiki(data.key, data.value);
            // this.resetForm();
          })
        })
      ).subscribe();
    }
    console.log('filePath', filePath);
    this.checkImageUrl = true;
  }

  resetForm() {
    this.formTemplate.reset();
    this.editImageUrl.reset();
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    // this.selectedImage = null;
    // this.isSubmitted = false;
  }
  test(event) {
    console.log(event.target.value);
    if (event.target.value !== '') {
      console.log('testqqq');

    }

  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
    console.log(this.latitude, this.longitude);
    // window.alert('Geocoder failed due to: ');
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 18;
        console.log('lat,long', this.latitude, this.longitude);

        // this.getAddress(this.latitude, this.longitude);
      });
    }
  };

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
