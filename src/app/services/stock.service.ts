import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * API call for the stock information.
 */
@Injectable({
  providedIn: 'root',
})
export class StockService {
  dolarMep: number = 1187
  private apiUrl = 'https://real-time-finance-data.p.rapidapi.com/stock-quote';
  private headers  = new HttpHeaders({
      'x-rapidapi-key': '9dbcc0870amsh393bb195ebc30b3p1e6dfajsncf1f1953e403',
      'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com',
    });


  constructor(
    private http: HttpClient
  ) {}

  /**
   * Obtain the stock information from a symbol.
   * @param symbol The symbol that has to be search.
   * @returns An obersable with the information of the stock.
   */
  getStockData(symbol: string): Observable<any> {
    const url = `${this.apiUrl}?symbol=${symbol}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      catchError((error) => {
        console.log('Error buscando la stock data:', error);
        throw error;
      })
    )
  }

  /**
   * Obtain the last dolar MEP quote.
   * @returns An uptdate of the dolarMep value.
   */
  dolarUpdate(): Observable<any> {
    const url = 'https://dolarapi.com/v1/dolares/bolsa';
    return this.http.get(url).pipe(
      catchError((error) => {
        console.log('Error actualizando cotizacion:', error);
        throw error;
      })
    )
  }

}
