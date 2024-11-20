export interface StockInputData {
  ticket: string;
  startDate: Date;
  quantity: number;
  totalPurchasePrice: number;
  priceType: boolean;  // true for ARS, false for USD
};

export const defaultStockInputData: StockInputData = {
  ticket: '',
  startDate: new Date(),
  quantity: 0,
  totalPurchasePrice: 0,
  priceType: false,
};

export interface StockPrice extends StockInputData {
  name: string;
  currentPrice: number;
  totalCurrentPrice: number;
  percentageChange: number;
  historicDolarMep?: number;
};

export const defaultStockPrice: StockPrice = {
  ...defaultStockInputData,
  currentPrice: 0,
  totalCurrentPrice: 0,
  percentageChange: 0,
  name: '',
  historicDolarMep: 0,
};

export interface StockApiResponse {
  data: {
    name: string;
    price: number;
    symbol: string;
  }
};

export interface DolarMepResponse {
  venta: number;
  compra: number;
  fecha: string;
}

export interface PriceType {
  ARS: true,
  USD: false,
}

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
  QUANTITY = 'Cantidad',
  PURCHASE_PRICE = 'Valor total de compra',
  STARTDATE = 'Fecha de compra',
  ACTUAL_PRICE = 'Precio actual',
  TOTAL_ACTUAL_PRICE = "Valor total actual ",
  PERCENTAGE_CHANGE = 'Variacion porcentual',
  ACTIONS = 'Acciones',
}

export interface TableConfig {
  displayColumns: string[];
}

export const CURRENCY_FORMAT = {
  USD: {
    locale: 'en-US',
    currency: 'USD',
    decimals: 2
  },
  ARS: {
    locale: 'es-AR',
    currency: 'ARS',
    decimals: 2
  }
};

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
    ColumNames.TOTAL_ACTUAL_PRICE,
    ColumNames.PERCENTAGE_CHANGE,
    ColumNames.ACTIONS
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
    totalCurrentPrice: 1500,
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
    totalCurrentPrice: 1500,
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
    totalCurrentPrice: 1500,
    priceType: false,
    percentageChange: 3.45,
  },
];
