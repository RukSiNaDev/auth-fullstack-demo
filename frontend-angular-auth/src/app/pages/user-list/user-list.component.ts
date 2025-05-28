import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SharedDataService } from '../../core/services/shared-data.services';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userList: any[] = []

  constructor(
    private usersService: UsersService,
    private sharedDataService: SharedDataService
  ) {

  }

  ngOnInit(): void {
    if (this.sharedDataService._isMock) {
      const usersJson = localStorage.getItem('mockUsers');
      if (usersJson) {
        this.userList = JSON.parse(usersJson);
      }
    } else {
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
}
