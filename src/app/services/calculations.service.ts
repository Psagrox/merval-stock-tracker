import { Injectable } from '@angular/core';
import { PriceType, StockPrice } from '@models/stock.model';

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
    historicDolarMep: number,
    priceType: boolean,
    totalPurchasePrice: number,
    quantity: number,
  ) {
    try {
      let adjustedTotalPurchasePrice =
        totalPurchasePrice / historicDolarMep;

      let totalCurrentPrice = priceType ?
        (quantity * currentPrice) / dolarMep :
        (quantity * currentPrice);

      const adjustedPrice = priceType ?
        currentPrice / dolarMep :
        currentPrice;

      const percentageChange = ((totalCurrentPrice - adjustedTotalPurchasePrice) * 100) / adjustedTotalPurchasePrice;

      return {
        adjustedPrice: adjustedPrice,
        totalPurchasePrice: adjustedTotalPurchasePrice,
        totalCurrentPrice,
        percentageChange: Number(percentageChange.toFixed(2))
      };
    } catch (error) {
      console.error('Error en cálculo:', error);
      throw new Error('Error al calcular precios de stock');
    }
  }
}
