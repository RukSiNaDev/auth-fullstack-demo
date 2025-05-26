import { Component, inject } from '@angular/core';
import { Router,RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  router = inject(Router)

  Logout(){
    localStorage.removeItem("token")
    this.router.navigateByUrl("/login")
  }
}
