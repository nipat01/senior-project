import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
import { FirebaseService } from '../../services/firebase-service.service';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
hideImage = false;

  imageList: any[];//list
  rowIndexArray: any[];//list

  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    filePath: new FormControl()
  })

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(private storage: AngularFireStorage,
    private service: ImageService,
    private firebaseService: FirebaseService,
    private modalService: NgbModal, ) { }

  ngOnInit() {
    this.resetForm();
    // list
    this.service.getImageDetailServiceList();
    this.service.imageDetailServiceList.snapshotChanges().subscribe(
      list => {
        this.imageList = list.map(item => ({ key: item.key, value: item.payload.val() }));
        this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());

        console.log('value', this.imageList, 'imageListLength', this.imageList.length);
        console.log('array', this.rowIndexArray, 'rowIndexArrayLength', this.rowIndexArray.length);
      }
    );
  }

  openDeleteImage(deleteImg) {
    console.log('deleteImg', deleteImg);
    this.modalService.open(deleteImg)
  }

  showPreview(event: any) {
    console.log('event',event.target.files[0].type);
    // if (event.target.files[0].type === 'image/jpeg') {
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
    // }
    // else {
    // window.alert("Only Image Type = JPG");
    // this.imgSrc = '/assets/img/image_placeholder.jpg';

    // }

  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `image/Service/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            const addPath = {
              ...formValue,
              filePath: filePath
            }
            this.service.insertImageServiceDetails(addPath);
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
  deleteImage(data) {

    console.log(data);
    this.storage.ref(data.value.filePath).delete();
    this.firebaseService.removService(data.key);


  }


}
