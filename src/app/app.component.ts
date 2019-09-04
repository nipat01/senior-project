import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'myjistig';

  // constructor(private db: AngularFireDatabase){}
  // addWiki(data: NgForm){
  //   console.log(data.value);
  //   this.db.list("/wikis").push(data.value);
  //   }


  ngOnInit() {}

}


