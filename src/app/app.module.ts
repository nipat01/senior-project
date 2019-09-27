import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseService } from './services/firebase-service.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AddWikiComponent } from './manage-employees/add-wiki/add-wiki.component';
import { HomeComponent } from './manage-employees/home/home.component';
import { AddCarComponent } from './manage-car/add-car/add-car.component';
import { CarComponent } from './manage-car/car/car.component';

import { LoginComponent } from './forms/login/login.component';
import { NavbarComponent } from './forms/navbar/navbar.component';
import { ProfileComponent } from './forms/profile/profile.component';
import { SignupComponent } from './forms/signup/signup.component';

import { JobComponent } from './jobs/job/job.component';
import { AddjobComponent } from './jobs/addjob/addjob.component';
import { CheckdataJobComponent } from './jobs/checkdata-job/checkdata-job.component';
import { CheckpaymentJobComponent } from './jobs/checkpayment-job/checkpayment-job.component';
import { PendingJobComponent } from './jobs/pending-job/pending-job.component';
import { ProceedJobComponent } from './jobs/proceed-job/proceed-job.component';
import { ProceededJobComponent } from './jobs/proceeded-job/proceeded-job.component';

import { AboutUserComponent } from './pageUser/about-user/about-user.component';
import { BankUserComponent } from './pageUser/bank-user/bank-user.component';
import { CartypeUserComponent } from './pageUser/cartype-user/cartype-user.component';
import { HomepageUserComponent } from './pageUser/homepage-user/homepage-user.component';
import { PortfolioUserComponent } from './pageUser/portfolio-user/portfolio-user.component';
import { ServiceUserComponent } from './pageUser/service-user/service-user.component';

import { AboutComponent } from './pageAdmin/about/about.component';
import { BankComponent } from './pageAdmin/bank/bank.component';
import { CartypeComponent } from './pageAdmin/cartype/cartype.component';
import { HomepageComponent } from './pageAdmin/homepage/homepage.component';
import { PortfolioComponent } from './pageAdmin/portfolio/portfolio.component';
import { ServiceComponent } from './pageAdmin/service/service.component';

import { OverviewComponent } from './overview/overview.component';
// Guard
import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthService } from './services/auth.service';


// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchJobComponent } from './jobs/search-job/search-job.component';

// import { AgmCoreModule } from '@agm/core';


import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProfileUserComponent } from './forms/profile-user/profile-user.component';

import { NotificationJobComponent } from './jobs/notification-job/notification-job.component';
import { NotificationJobDriverComponent } from './jobs/driver/notification-job-driver/notification-job-driver.component';
import { PendingJobDriverComponent } from './jobs/driver/pending-job-driver/pending-job-driver.component';
import { ProceedJobDriverComponent } from './jobs/driver/proceed-job-driver/proceed-job-driver.component';
import { ProceededJobDriverComponent } from './jobs/driver/proceeded-job-driver/proceeded-job-driver.component';
import { JobDriverComponent } from './jobs/driver/job-driver/job-driver.component';

import { CheckStatusUserComponent } from './jobs/user/check-status-user/check-status-user.component';
import { ReviceUserComponent } from './jobs/user/revice-user/revice-user.component';
import { ShowStatusComponent } from './jobs/user/show-status/show-status.component';
import { CheckLocitionComponent } from './jobs/user/check-locition/check-locition.component';
import { SideNavComponent } from './forms/side-nav/side-nav.component';
import { AgmCoreModule } from '@agm/core';
import { InvoiceComponent } from './overview/invoice/invoice.component';

const routes: Routes = [
  { path: 'addWiki', component: AddWikiComponent, canActivate: [AdminAuthGuard] },
  // { path: '', component: HomeComponent },
  { path: 'editWiki/:id', component: AddWikiComponent, canActivate: [AdminAuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AdminAuthGuard] },
  { path: 'car', component: CarComponent, canActivate: [AdminAuthGuard] },
  { path: 'addcar', component: AddCarComponent, canActivate: [AdminAuthGuard] },
  { path: 'login', component: LoginComponent, },
  // { path: 'signup', component: SignupComponent },


  { path: 'overview', component: OverviewComponent, canActivate: [AdminAuthGuard] },

  { path: 'job', component: JobComponent, canActivate: [AdminAuthGuard] },
  { path: 'addjob', component: AddjobComponent },

  { path: 'checkdatajob', component: CheckdataJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'checkpaymentjob', component: CheckpaymentJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'notificationjob', component: NotificationJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'pendingjob', component: PendingJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'proceedjob', component: ProceedJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'proceededjob', component: ProceededJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'searchjob', component: SearchJobComponent, canActivate: [AdminAuthGuard] },
  { path: 'editjob/:id', component: AddjobComponent, canActivate: [AdminAuthGuard] },
  { path: 'checkstatus', component: CheckStatusUserComponent },

  { path: 'notificationjobdriver', component: NotificationJobDriverComponent, canActivate: [AuthGuard] },
  { path: 'pendingjobdriver', component: PendingJobDriverComponent, canActivate: [AuthGuard] },
  { path: 'proceedjobdriver', component: ProceedJobDriverComponent, canActivate: [AuthGuard] },
  { path: 'proceededjobdriver', component: ProceededJobDriverComponent, canActivate: [AuthGuard] },


  // { path: 'homepage', component: HomepageComponent },
  { path: 'edithomepage/:id', component: HomepageComponent },

  { path: 'homepageadmin', component: HomepageComponent, canActivate: [AdminAuthGuard] },
  { path: 'serviceadmin', component: ServiceComponent, canActivate: [AdminAuthGuard] },
  { path: 'cartypeadmin', component: CartypeComponent, canActivate: [AdminAuthGuard] },
  { path: 'portfolioadmin', component: PortfolioComponent, canActivate: [AdminAuthGuard] },
  { path: 'bankadmin', component: BankComponent, canActivate: [AdminAuthGuard] },
  { path: 'aboutadmin', component: AboutComponent, canActivate: [AdminAuthGuard] },

  { path: 'profileuser', component: ProfileUserComponent },
  { path: 'homepageuser', component: HomepageUserComponent },
  { path: 'serviceuser', component: ServiceUserComponent },
  { path: 'cartypeuser', component: CartypeUserComponent },
  { path: 'portfoliouser', component: PortfolioUserComponent },
  { path: 'bankuser', component: BankUserComponent },
  { path: 'aboutuser', component: AboutUserComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'invoice/:id', component: InvoiceComponent },

  { path: '', redirectTo: '/homepageuser', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }






];



@NgModule({
  declarations: [
    AppComponent,
    AddWikiComponent,
    HomeComponent,
    CarComponent,
    AddCarComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    SignupComponent,
    JobComponent,
    AddjobComponent,
    HomepageComponent,
    CheckdataJobComponent,
    CheckpaymentJobComponent,
    PendingJobComponent,
    ProceedJobComponent,
    ProceededJobComponent,
    AboutUserComponent,
    BankUserComponent,
    CartypeUserComponent,
    HomepageUserComponent,
    PortfolioUserComponent,
    AboutComponent,
    BankComponent,
    CartypeComponent,
    PortfolioComponent,
    ServiceComponent,
    ServiceUserComponent,

    SearchJobComponent,
    ProfileUserComponent,
    NotificationJobComponent,
    NotificationJobDriverComponent,
    PendingJobDriverComponent,
    ProceedJobDriverComponent,
    ProceededJobDriverComponent,
    JobDriverComponent,
    OverviewComponent,
    CheckStatusUserComponent,
    ReviceUserComponent,
    ShowStatusComponent,
    CheckLocitionComponent,
    SideNavComponent,
    InvoiceComponent






  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(routes),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    AngularFireStorageModule,

    NgbModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleMapsKey }),
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    AccordionModule,


  ],
  providers: [AuthService,
    AngularFireAuthModule,
    AuthGuard,
    AdminAuthGuard,
    FirebaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
