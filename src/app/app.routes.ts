import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppComponent } from './app.component';
import { StockTableComponent } from './components/stock-table/stock-table.component';


export const routes: Routes = [
  { path: '', component: StockTableComponent  },
  { path: '**', component: NotFoundComponent }
];
