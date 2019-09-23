import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  closeResult: string;
  selectedColor: string;
  constructor(
<<<<<<< HEAD
     private auth: AuthService,
    private modalService: NgbModal
=======
     public auth: AuthService,
    //  private auth: AuthService,
>>>>>>> f68954274e9c21a100db6253785e094ef0122f10
     ) { }

  ngOnInit() {
  }

  changesColor() {
    // var x=document.getElementById("selectColor");
    // var themeColor= x.options[x.selectedIndex].value;
    // document.body.style.backgroundColor=themeColor;
    console.log(this.selectedColor);
  }
}
