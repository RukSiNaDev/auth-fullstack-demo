import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userList: any[] = []

  constructor(
    private usersService: UsersService
  ) {

  }

  ngOnInit(): void {
    this.usersService.getUser().subscribe({
      next: (res: any) => {
        this.userList = res.data;
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
