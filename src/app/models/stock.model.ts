export interface StockInputData {
  ticket: string;
  startDate: Date;
  quantity: number;
  totalPurchasePrice: number;
  priceType: boolean;
}

export const defaultStockInputData: StockInputData = {
  ticket: '',
  startDate: new Date(),
  quantity: 0,
  totalPurchasePrice: 0,
  priceType: false,
};

export interface StockPrice extends StockInputData{
  currentPrice: number;
  percentageChange: number;
  name: string;
}

export const defaultStockPrice: StockPrice = {
  ...defaultStockInputData,
  currentPrice: 0,
  percentageChange: 0,
  name: '',
};

export type PortfolioData = StockPrice[];

export const defaultPosition: number = 0;


/**
 * All Column Display Names for the table.
 * This is Case sensitive.
 */

export enum ColumNames {
  POSITION = 'N°',
  NAME = 'Nombre',
  TICKET = 'Ticket',
  QUANTITY = 'Quantity',
  PURCHASE_PRICE = 'Precio total de compra',
  STARTDATE = 'Fecha de compra',
  ACTUAL_PRICE = 'Precio actual',
  PERCENTAGE_CHANGE = 'Variacion porcentual',
}

export interface TableConfig {
  displayColumns: string[];
}

/**
 * Table config
 */


export const tableConfig: TableConfig = {
  displayColumns:  [
    ColumNames.POSITION,
    ColumNames.NAME,
    ColumNames.TICKET,
    ColumNames.QUANTITY,
    ColumNames.PURCHASE_PRICE,
    ColumNames.STARTDATE,
    ColumNames.ACTUAL_PRICE,
    ColumNames.PERCENTAGE_CHANGE,

  ]
};


/**
 * Mock data for portfolio
 */

export const defaultPortfolioData: PortfolioData = [
  {
    name: 'Apple',
    ticket: 'AAPL',
    startDate: new Date(),
    quantity: 10,
    totalPurchasePrice: 1500,
    currentPrice: 150.0,
    priceType: false,
    percentageChange: 3.45,
  },
  {
    name: 'GOOGL',
    ticket: 'GOOGL',
    startDate: new Date(),
    quantity: 10,
    totalPurchasePrice: 1500,
    currentPrice: 150.0,
    priceType: false,
    percentageChange: 3.45,
  },
  {
    name: 'AMZN',
    ticket: 'AMZN',
    startDate: new Date(),
    quantity: 10,
    totalPurchasePrice: 1500,
    currentPrice: 150.0,
    priceType: false,
    percentageChange: 3.45,
  },
];
