import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/user-list/user-list.component';
// import { LifecycleDemoComponent } from './pages/lifecycle-demo/lifecycle-demo.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'user-list',
                component: UserListComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin']
                }
            },
            {
                path: 'welcome',
                component: WelcomeComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'user']
                }
            }
        ]
    }
];
