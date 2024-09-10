// sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarExpandedSource = new BehaviorSubject<boolean>(false);
  isSidebarExpanded$ = this.isSidebarExpandedSource.asObservable();

  toggleSidebar() {
    this.isSidebarExpandedSource.next(!this.isSidebarExpandedSource.value);
  }
}
