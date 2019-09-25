import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static COLOR='';
  static DEFAULTCOLOR = '#abc';
  title = 'myjistig';
  selectedColor: string;


  // constructor(private db: AngularFireDatabase){}
  // addWiki(data: NgForm){
  //   console.log(data.value);
  //   this.db.list("/wikis").push(data.value);
  //   }

  constructor() {}

  ngOnInit() {}


}


