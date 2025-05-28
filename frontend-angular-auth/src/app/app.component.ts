import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from './services/users.service';
import { SharedDataService } from './core/services/shared-data.services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  title = 'AuthApp';
  isMock = false

  constructor(
    private usersService: UsersService,
    private sharedDataService: SharedDataService
  ) {

  }

  ngOnInit(): void {
    if (this.sharedDataService._isMock) {
      this.usersService.getUser().subscribe({
        next: (res: any) => {
          localStorage.setItem('mockUsers', JSON.stringify(res.data));
        },
        error: error => {
          if (error.status === 400) {
            alert("Invalid Body");
          } else if (error.status === 401) {
            alert("Wrong Credentials");
          } else if (error.status === 500) {
            alert(error.error);
          }
        }
      });
    }
  }
}
