import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockTableComponent } from './components/stock-table/stock-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    StockTableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'merval-tracker-app';
}
