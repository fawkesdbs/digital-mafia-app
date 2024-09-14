import { Component } from '@angular/core';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [UserListComponent, ChatComponent],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css',
})
export class MessagingComponent {
  selectedUser: any;

  onUserSelected(user: any): void {
    this.selectedUser = user;
  }
}
