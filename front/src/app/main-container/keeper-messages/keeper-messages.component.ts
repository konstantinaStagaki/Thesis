import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Message } from 'src/app/models/message.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-keeper-messages',
  templateUrl: './keeper-messages.component.html',
  styleUrl: './keeper-messages.component.css'
})
export class KeeperMessagesComponent {
  @ViewChild('messageList') private messageList: ElementRef = new ElementRef(null);
  keeper: User = new User();
  keeper_id: number = 0;
  messages: Message[] = [];
  currMessages: Message[] = [];
  newMessage: string = '';
  selectedUser: User = new User();
  owners: User[] = [];

  constructor(private userService: UserServiceService,
    private route : ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('user_id') ;
      this.keeper_id = parseInt(userId || '0', 10);
      this.userService.getKeeper(this.keeper_id).subscribe(
        data => {
          this.keeper = data; 
          this.userService.getMessagesByName(this.keeper.username).subscribe(
            data => {
              this.messages = data; 
              this.userService.GetOwnersByKeeperMessages(this.keeper_id).subscribe(
                data => {
                  this.owners = data;
                  this.selectUser(this.owners[0]);
                },
                error => {
                  console.error('Error fetching owners data', error);
                }
              );
            },
            error => {
              console.error('Error fetching keeper data', error);
            }
          );
        },
        error => {
          console.error('Error fetching keeper data', error);
        }
      );
    });

    
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.filterMessages();
  }

  filterMessages() {
    if (this.selectedUser) {
      this.currMessages = this.messages.filter(message => 
        (message.from_id === this.keeper_id && message.to_id === this.selectedUser.id) ||
        (message.from_id === this.selectedUser.id && message.to_id === this.keeper_id)
      );
    }
    this.newMessage = '';
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const message = new Message();
      message.from_id = this.keeper_id;
      message.to_id = this.selectedUser.id;
      message.from_name = this.keeper.username;
      message.to_name = this.selectedUser.username;
      message.content = this.newMessage;
      message.date = new Date().toISOString();
      this.userService.sendMessage(message).subscribe(
        data => {
          this.messages.push(data);
          this.filterMessages();
        },
        error => {
          console.error('Error sending message', error);
        }
      );
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('message-container');
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }, 10);
  }

  onLogout() {
    this.authService.logout();
  }

}
