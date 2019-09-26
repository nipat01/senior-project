import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cartype',
  templateUrl: './cartype.component.html',
  styleUrls: ['./cartype.component.css']
})
export class CartypeComponent implements OnInit, OnChanges  {


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;

  imageList: any[];//list
  imageList2: any[];//list
  imageList3: any[];//list
  rowIndexArray: any[];//list

  formTemplate = new FormGroup({
    // caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required)
  })

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private storage: AngularFireStorage,
    private service: ImageService,
    private firebaseService: FirebaseService,
    private modalService: NgbModal,) { }

  ngOnInit() {
    //colum1
    this.resetForm();
    this.service.getImageDetailCarType1();
    this.service.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());
      }
    );
    //coloum2
    this.resetForm();
    this.service.getImageDetailCarType2();
    this.service.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.imageList2 = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList2.length + 1) / 3)).keys());
      }
    );
    //colum3
    this.resetForm();
    this.service.getImageDetailCarType3();
    this.service.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.imageList3 = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList3.length + 1) / 3)).keys());
      }
    );


  }

  openDeleteImage(deleteImg) {
    console.log('deleteImg', deleteImg);
    this.modalService.open(deleteImg)
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            const addPath = {
              ...formValue,
              filePath: filePath
            }
            this.service.insertImageDetails(addPath);
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();

    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  deleteImageType1(data) {
    console.log(data);
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removCartype1(data.key);
  }
  deleteImageType2(data) {
    console.log(data);
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removCartype2(data.key);
  }
  deleteImageType3(data) {
    console.log(data);
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removCartype3(data.key);
  }


}
