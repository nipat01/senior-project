import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  public isCollapsed = false;
  // public isCollapsed = true;
  closeResult: string;
  selectedColor: string;
  constructor(
    public auth: AuthService,
    //  private auth: AuthService,
    private modalService: NgbModal
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
