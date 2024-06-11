import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { Booking } from 'src/app/models/booking.model';
import { Pet } from 'src/app/models/pet.model';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-keeper-bookings',
  templateUrl: './keeper-bookings.component.html',
  styleUrls: ['./keeper-bookings.component.css']
})
export class KeeperBookingsComponent implements OnInit {

  message: string = '';
  messageVisible: boolean = false;
  keeper: User = new User();
  owner: User = new User();
  owners: User[] = [];
  pet: Pet = new Pet();
  bookings: Booking[] = [];
  user: User = new User();

  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('user_id'); // convert id to a number
      if (userId) {
        this.userService.getKeeper(parseInt(userId, 10)).subscribe(
          data => {
            this.keeper = data; // Assign the emitted value to user
            this.user = data; // Assign to user for navigation
            console.log(data);
          },
          error => {
            console.error('Error fetching keeper data', error);
          }
        );
        this.userService.GetBookingsByKeeperId(parseInt(userId, 10)).subscribe(
          data => {
            this.bookings = data; // Assign the emitted value to user
            console.log(data);
          },
          error => {
            console.error('Error fetching bookings', error);
          }
        );
      }
    });

    this.userService.getOwners().subscribe(
      data => {
        this.owners = data; // Assign the emitted value to user
        console.log(data);
      },
      error => {
        console.error('Error fetching owner data', error);
      }
    );
  }

  onAccept(booking: Booking) {
    if (booking.status !== 'requested') {
      alert('You can only accept a requested booking');
      return;
    }
    booking.status = 'accepted';
    console.log(booking);

    this.userService.UpdateBooking(booking).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error accepting booking', error);
      }
    );
  }

  onReject(booking: Booking) {
    if (booking.status !== 'requested') {
      alert('You can only reject a requested booking');
      return;
    }
    booking.status = 'rejected';

    this.userService.UpdateBooking(booking).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error rejecting booking', error);
      }
    );
  }

  getOwnerName(id: number): string {
    return this.owners.find(o => o.id === id)?.first_name || '';
  }

  getPetType(id: number): string {
    const owner = this.owners.find(o => o.id === id);
    for (const pet of owner?.pets || []) {
      console.log(pet);
      if (pet.id === id) {
        console.log(pet.type);
        return pet.type;
      }
    }
    return '';
  }

  SendMessage(booking: Booking) {
    if (booking.status !== 'accepted') {
      alert('You can only send messages to accepted bookings');
      return;
    }
    this.userService.getOwner(booking.owner_id).subscribe(
      data => {
        const owner = data;
        this.userService.getKeeper(booking.keeper_id).subscribe(
          data => {
            const keeper = data;
            const message = new Message(keeper.username, owner.username, this.message);
            message.from_id = keeper.id;
            message.to_id = owner.id;

            this.userService.sendMessage(message).subscribe(
              data => {
                console.log(data);
                alert('Message sent successfully');
              },
              error => {
                console.error('Error sending message', error);
                alert('Error sending message');
              }
            );
          },
          error => {
            console.error('Error fetching keeper data', error);
          }
        );
      },
      error => {
        console.error('Error fetching owner data', error);
      }
    );
  }

  showDialogMessage() {
    this.messageVisible = true;
  }

  onLogout() {
    this.authService.logout();
  }
}
