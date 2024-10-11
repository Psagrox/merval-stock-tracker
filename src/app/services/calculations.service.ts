import { Injectable } from '@angular/core';

/**
  * Calculate the currente stock price and the percentage change.
  * @param currentPrice Current stock price.
  * @param dolarMep Actual dolar MEP price.
  * @param priceType If is `true`, it converted to ARS, otherwise it stay in USD dollars.
  * @param totalPurchasePrice Total price for the stock purchase.
  * @param quantity Quantity of stock purchase.
  * @returns An object with the calculated price and the percentage change.
  */
@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  calculateStockPrice(
    currentPrice: number,
    dolarMep: number,
    priceType: boolean,
    totalPurchasePrice: number,
    quantity: number,
  ): { adjustedPrice: number, percentageChange: number } {
    if (priceType) {
      totalPurchasePrice /= dolarMep;
    }

    const adjustedPrice = priceType ? currentPrice / dolarMep : currentPrice;

    const percentageChange = ((adjustedPrice * quantity) * 100) / totalPurchasePrice;

    return {
      adjustedPrice,
      percentageChange
    };
  }

}
