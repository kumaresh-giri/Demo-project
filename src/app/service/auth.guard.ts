import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 constructor(
        private commonservice: CommonService,
        private router: Router) { }   
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var isAuthenticated = this.commonservice.getAuthStatus();
    if (!isAuthenticated) {
        this.router.navigate(['/']);
    }
    return isAuthenticated;
  }
  
}
