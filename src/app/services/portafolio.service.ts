import { Injectable } from '@angular/core';
import { ColumNames, defaultPortfolioData, StockPrice } from '@models/stock.model';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * Methods for change the portafolio.
 */
@Injectable({
  providedIn: 'root'
})
export class PortafolioService {
  private readonly STORAGE_KEY = 'portfolio';
  private portfolioData: StockPrice[] = [];
  private portfolioSubject = new BehaviorSubject<StockPrice[]>([]);

  // Public observable
  public portfolio$ = this.portfolioSubject.asObservable();

  constructor() {
    this.loadPortfolio();
  }

  private loadPortfolio(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const portfolio = JSON.parse(savedData);
        this.portfolioSubject.next(portfolio);
      }
    } catch (error) {
      console.error('Error cargando portfolio:', error);
      this.portfolioSubject.next([]);
    }
  }

  private updatePortfolio(portfolio: StockPrice[]): void {
    this.portfolioSubject.next([...portfolio]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(portfolio));
  }



  addStock(stock: StockPrice): void {
    const currentPortfolio = this.portfolioSubject.value;
    const updatedPortfolio = [...currentPortfolio, stock];
    this.updatePortfolio(updatedPortfolio);
  }

  removeStock(index: number): void {
    const currentPortfolio = this.portfolioSubject.value;
    if (index >= 0 && index < currentPortfolio.length) {
      const updatedPortfolio = currentPortfolio.filter((_, i) => i !== index);
      this.updatePortfolio(updatedPortfolio);
    }
  }

  updateStock(index: number, updatedStock: StockPrice): void {
    const currentPortfolio = this.portfolioSubject.value;
    if (index >= 0 && index < currentPortfolio.length) {
      const updatedPortfolio = currentPortfolio.map((stock, i) =>
        i === index ? { ...updatedStock } : stock
      );
      this.updatePortfolio(updatedPortfolio);
    }
  }

  getPortfolio(): StockPrice[] {
    return [...this.portfolioData];
  }

  clearPortfolio(): void {
    this.updatePortfolio([]);
  }

  // Export as CSV
  exportToCSV(): string {
    const headers = Object.values(ColumNames).join(',');
    const rows = this.portfolioSubject.value.map(stock => {
      return [
        stock.name,
        stock.ticket,
        stock.startDate,
        stock.quantity,
        stock.totalPurchasePrice,
        stock.currentPrice,
        stock.totalCurrentPrice,
        stock.percentageChange,
        stock.priceType,
      ].join(',');
    });
    return [headers, ...rows].join('\n');
  }

  setPortfolio(portfolio: StockPrice[]) {
    this.updatePortfolio(portfolio);
  }

}

