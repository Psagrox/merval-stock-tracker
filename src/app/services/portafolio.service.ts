import { Injectable } from '@angular/core';
import { StockPrice } from '@models/stock.model';
import { DataSource } from '@angular/cdk/collections';
import { ReplaySubject, Observable, of } from 'rxjs';

/**
 * Methods for change the portafolio.
 */
@Injectable({
  providedIn: 'root'
})
export class PortafolioService {


}

/*portfolioData: StockPrice[] = [];
  private portfolioDataSubject = new ReplaySubject<StockPrice[]>(1);

  portfolioDataObservable = this.portfolioDataSubject.asObservable();

  dataToDisplay = [...this.portfolioData];
  dataSource = new DataSourceClass(this.dataToDisplay);

  initializePortfolioData() {
    this.portfolioDataSubject.next(defaultPortfolioData);
  }

  addStock (stockToAdd: StockPrice): void{
    this.portfolioData.push({ ...stockToAdd });
    this.portfolioDataSubject.next(this.portfolioData);
    console.log('Portafolio:', this.portfolioData);
  }

  removeStock(index: number): void{
    this.portfolioData.splice(index, 1);
    console.log('Acción eliminada del portafolio:', this.portfolioData);
  }

  getPortfolio(): StockPrice[] {
    console.log('Tabla actualizada', this.portfolioData)
    return Object.values(this.portfolioData);
  }

  clearPortafolio(): void {
    this.portfolioData = [];
    console.log('Portafolio vaciado');
  } */
