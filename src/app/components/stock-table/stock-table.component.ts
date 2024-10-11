import {
  Component,
  input,
  Input,
  OnInit,
  SimpleChange,
} from '@angular/core';
import { StockService } from '@services/stock.service';
import { CalculationsService } from '@services/calculations.service';
import { PortafolioService } from '@services/portafolio.service';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog.component';
import {
  StockPrice,
  StockInputData,
  defaultStockInputData,
  defaultStockPrice,
  TableConfig,
  ColumNames,
  tableConfig,
  PortfolioData,
  defaultPortfolioData
} from '@models/stock.model'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss',
})

export class StockTableComponent {
  stockInput: StockInputData = defaultStockInputData;
  stockPrice: StockPrice = defaultStockPrice;
  ticket: string = '';
  columnNames = ColumNames;

  protected loading = false;


  displayedColumns: string[] = tableConfig.displayColumns;
  config: TableConfig= {displayColumns: []};
  dataSource: MatTableDataSource<StockPrice>;


  constructor(
    private stockService: StockService,
    private portfolioService: PortafolioService,
    private calculationsService: CalculationsService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<StockPrice>(defaultPortfolioData);
  }

  ngOnInit(): void {
    console.log('Data Source:', this.dataSource.data);
    this.displayedColumns = this.config.displayColumns.length > 0 ? this.config.displayColumns : tableConfig.displayColumns;
  }

  // ngOnChanges(changes: SimpleChange) {
  //   if(changes['data']) {
  //     this.dataSource = new MatTableDataSource<PortfolioData>(this.data);
  //   }
  // }


  openDialog() {
    const dialogRef = this.dialog.open(StockDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del formulario:', result);
        this.stockInput = result;
        this.ticket = result.ticket
        this.stockPrice = result;
        this.updateStockData(this.ticket);
      }
    });
  }


  async updateStockData(ticket: string) {

    this.stockService.getStockData(ticket).subscribe({
      next: (stockData) => {
        this.stockService.dolarUpdate().subscribe({
          next: (dolarData) => {
            const dolarMep = dolarData.venta;

            const { adjustedPrice, percentageChange } = this.calculationsService.calculateStockPrice(
              stockData.data.price,
              dolarMep,
              this.stockInput.priceType,
              this.stockInput.totalPurchasePrice,
              this.stockInput.quantity,
            );

            this.stockPrice = {
              ...this.stockPrice,
              name: stockData.data.name,
              currentPrice: adjustedPrice,
              percentageChange: percentageChange,
            };


            this.loading = false;


          },
          error: (error) => {
            console.error('Error actualizando la cotización del dólar:', error);
          },
          complete: () => {
            console.log('Actualización de la cotización completada');
          }
        });
      },
      error: (error) => {
        console.error('Error buscando la stock data:', error);
      },
      complete: () => {
        console.log('Petición completada');
        console.log('Datos del stock actualizados:', this.stockPrice);
      }
    });
  }

    removeStock(position: number){
      //this.portfolioService.removeStock(position);
      //to be made
    }



    // position
    // format values
    //add save localsote portafolioData
    //add dowload portafolioData
    //add header
    //publish
}


