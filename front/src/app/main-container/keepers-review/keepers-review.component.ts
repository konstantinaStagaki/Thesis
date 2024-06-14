import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

interface Days {
  days: number;
}

interface Bookings {
  bookings: number;
}

@Component({
  selector: 'app-keepers-review',
  templateUrl: './keepers-review.component.html',
  styleUrls: ['./keepers-review.component.css']
})
export class KeepersReviewComponent implements OnInit {

  user = new User();
  owners: User[] = [];
  keeper: User = new User();
  reviews: any;
  days: number = 0;
  bookings: number = 0;

  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }




  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     this.userService.getOwners().subscribe(
  //       data => {
  //         this.owners = data;
  //       },
  //       error => {
  //         console.error('Error fetching owner data', error);
  //       }
  //     );

  //     const userId = params.get('user_id');
  //     if (userId) {
  //       this.loadKeeperData(parseInt(userId, 10));
  //     }
  //   });
  // }


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

      }
    });
        this.userService.getOwners().subscribe(
          data => {
            this.owners = data;
          },
          error => {
            console.error('Error fetching owner data', error);
          }
        );
  
        this.route.paramMap.subscribe(params => {
          const userId = params.get('user_id');
          if (userId) {
            this.loadKeeperData(parseInt(userId, 10));
          }
        }

    
       ); 
        
    }

   
  
  
  loadKeeperData(userId: number) {
    this.userService.GetReviewsByKeeper(userId).subscribe(
      data => {
        this.reviews = data;
      },
      error => {
        console.error('Error fetching reviews', error);
      }
    );

    this.userService.GetPetKeepersDays(userId).subscribe(
      data => {
        this.days = data;
      },
      error => {
        console.error('Error fetching days', error);
      }
    );

    this.userService.GetPetKeepersBookings(userId).subscribe(
      data => {
        this.bookings = data;
      },
      error => {
        console.error('Error fetching bookings', error);
      }
    );
  }

  getOwnerName(id: number) {
    return this.owners.find(owner => owner.id === id)?.first_name;
  }

  onLogout() {
    this.authService.logout();
  }

  
  
}
