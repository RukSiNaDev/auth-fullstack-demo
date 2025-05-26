import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from '../core/services/shared-data.services';

@Injectable({
    providedIn: 'root'
})


export class UsersService {
    private apiUrl = 'https://localhost:7050/api/User/';

    constructor(private http: HttpClient,
        private sharedDataService: SharedDataService
    ) {

    }

    getUser() {
        if (this.sharedDataService._isMock) {
            return new Observable(observer => {
                this.http.get('assets/users.json').subscribe(users => {
                    const userArray = users as any[];
                    if (userArray.length > 0) {
                        observer.next({ data: userArray }); // Return the first user for mock
                    } else {
                        observer.error({ status: 404, error: 'No users found.' });
                    }
                    observer.complete();
                }, error => {
                    observer.error(error);
                });
            });

        } else {
            return this.http.get(`${this.apiUrl + 'getUser'}`);
        }
    }

}
