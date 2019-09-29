import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChatpageComponent } from './components/chatpage/chatpage.component';
import { AuthGuard } from './services/auth-guard.service';
import { ProfileComponent } from './components/profile/profile.component';
const routes: Routes = [
   {path:'home',component:HomeComponent},
   {path:'chats',component:ChatpageComponent},
   {path:'profile',component:ProfileComponent},
   {path:'**',redirectTo:'home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
     AuthGuard
  ]
})
export class AppRoutingModule { }
