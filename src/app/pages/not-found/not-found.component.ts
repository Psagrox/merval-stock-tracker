import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterLinkWithHref,
    MatButtonModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {

}
