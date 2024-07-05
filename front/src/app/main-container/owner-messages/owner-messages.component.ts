import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Message } from 'src/app/models/message.model';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-owner-messages',
  templateUrl: './owner-messages.component.html',
  styleUrl: './owner-messages.component.css'
})
export class OwnerMessagesComponent implements OnInit {
    @ViewChild('messageList') private messageList: ElementRef = new ElementRef(null);
    owner: User = new User();
    owner_id: number = 0;
    messages: Message[] = [];
    currMessages: Message[] = [];
    newMessage: string = '';
    selectedUser: User = new User();
    keppers: User[] = [];

    constructor(
      private userService: UserServiceService,
      private route : ActivatedRoute,
      private authService : AuthService
    ) { }

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const userId = params.get('user_id') ;
        this.owner_id = parseInt(userId || '0', 10);
        this.userService.getOwner(this.owner_id).subscribe(
          data => {
            this.owner = data; 
            this.userService.getMessagesByName(this.owner.username).subscribe(
              data => {
                this.messages = data; 
                this.userService.GetKeepersByOwnerMessages(this.owner_id).subscribe(
                  data => {
                    this.keppers = data;
                    this.selectUser(this.keppers[0]);
                  },
                  error => {
                    console.error('Error fetching keepers data', error);
                  }
                );
              },
              error => {
                console.error('Error fetching owner data', error);
              }
            );
          },
          error => {
            console.error('Error fetching owner data', error);
          }
        );

        
      });
    }

    filterMessages() {
      if (this.selectedUser) {
        this.currMessages = this.messages.filter(message => 
          (message.from_id === this.owner_id && message.to_id === this.selectedUser.id) ||
          (message.from_id === this.selectedUser.id && message.to_id === this.owner_id)
        );
      }
      this.newMessage = '';
      this.scrollToBottom(); 
    }

    selectUser(user: User) {
      this.selectedUser = user;
      console.log("[selectUser] selectedUser: ", this.selectedUser);
      this.filterMessages();
    }

    sendMessage() {
      if (this.newMessage.trim() && this.selectedUser) {
        const message = new Message();
        message.content = this.newMessage;
        message.from_id = this.owner_id;
        message.from_name = this.owner.username;
        message.to_id = this.selectedUser.id;
        message.to_name = this.selectedUser.username;
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

    private scrollToBottom(): void {
      try {
        this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom', err);
      }
    }

    onLogout() {
      this.authService.logout();
    }
  
}

