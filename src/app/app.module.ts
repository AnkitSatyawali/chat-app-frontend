import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule ,HttpClient } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/chatpage/header/header.component';
import { UserlistComponent } from './components/chatpage/userlist/userlist.component';
import { ChatlistComponent } from './components/chatpage/chatlist/chatlist.component';
import { HomeComponent } from './components/home/home.component';
import { ChatpageComponent } from './components/chatpage/chatpage.component';
import { AuthComponent } from './components/auth/auth.component';
import { CookieService } from 'ngx-cookie-service';
import { ProfileComponent } from './components/profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent, 
    UserlistComponent,
    ChatlistComponent,
    HomeComponent,
    ChatpageComponent,
    AuthComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HttpClient,CookieService],
  bootstrap: [AppComponent],
  entryComponents: [AuthComponent]
})
export class AppModule { }
