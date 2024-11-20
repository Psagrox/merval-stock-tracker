import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
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
  defaultPortfolioData
} from '@models/stock.model'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { lastValueFrom, Subscription } from 'rxjs';


@Component({
  selector: 'app-stock-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss',
})

export class StockTableComponent implements OnInit {
  stockInput: StockInputData = defaultStockInputData;
  stockPrice: StockPrice = defaultStockPrice;
  ticket: string = '';
  inputDate: string = '';
  columnNames = ColumNames;
  private subscription: Subscription;

  protected loading = false;

  displayedColumns: string[] = tableConfig.displayColumns;
  config: TableConfig= {displayColumns: []};
  dataSource: MatTableDataSource<StockPrice>;

  @ViewChild('fileInput')fileInput!: ElementRef;

  constructor(
    private stockService: StockService,
    private portfolioService: PortafolioService,
    private calculationsService: CalculationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.dataSource = new MatTableDataSource<StockPrice>(defaultPortfolioData);
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.portfolioService.portfolio$.subscribe(
      data => {
        this.dataSource.data = [...data];
      },
      error => {
        console.error('Error en la suscripción del portfolio:', error);
        this.showSnackBar('Error al actualizar la tabla');
      }
    );

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  confirmDelete(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar stock',
        message: '¿Estás seguro que deseas eliminar esta acción de tu portafolio?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeStock(index);
        this.showSnackBar('Acción eliminada correctamente');
      }
    });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(StockDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del formulario:', result);
        this.stockInput = result;
        this.ticket = result.ticket
        this.stockPrice = result;
        this.inputDate =this.stockInput.startDate.toString();
        this.updateStockData(this.ticket);
      }
    });
  }


  async updateStockData(ticket: string) {
    this.loading = true;

    this.stockService.getStockData(ticket).subscribe({
      next: (stockData) => {

        //MEP recent quote
        this.stockService.dolarUpdate().subscribe({
          next: (dolarData) => {
            const dolarMep = dolarData.venta;
            const startDate = this.stockInput.startDate;
            const formattedDate = startDate.toISOString().split('T')[0].replace(/-/g, '/');

            this.stockService.historicDolarUpdate(formattedDate).subscribe({
              next: (historicDolarData) => {
                const historicDolarMep = historicDolarData.venta;

                const { adjustedPrice, totalPurchasePrice, totalCurrentPrice, percentageChange } =
                this.calculationsService.calculateStockPrice(
                  stockData.data.price,
                  dolarMep,
                  historicDolarMep,
                  this.stockInput.priceType,
                  this.stockInput.totalPurchasePrice,
                  this.stockInput.quantity,
                );

                const newStock: StockPrice = {
                  ...this.stockPrice,
                  name: stockData.data.name,
                  currentPrice: adjustedPrice,
                  percentageChange: percentageChange,
                  totalPurchasePrice: totalPurchasePrice,
                  totalCurrentPrice: totalCurrentPrice,
                };


                this.portfolioService.addStock(newStock);
                this.loading = false;
              },
              error: (error) => {
                console.error('Error actualizando la cotización historica del dólar:', error);
                this.loading = false;
                this.showSnackBar('Error en la cotización histórica (asegurese de seleccionar un día laboral)');
              },
            })

          },
          error: (error) => {
            console.error('Error actualizando la cotización del dólar:', error);
            this.loading = false;
            this.showSnackBar('Error al obtener cotización actual del dólar');
          },
          complete: () => {
            console.log('Actualización de la cotización completada');
          }
        });
      },
      error: (error) => {
        console.error('Error buscando la stock data:', error);
        this.loading = false;
        this.showSnackBar('Error al obtener datos de la acción');
      },
      complete: () => {
        console.log('Petición completada');
        console.log('Datos del stock actualizados:', this.stockPrice);
      }
    });
  }

    removeStock(position: number){
      this.portfolioService.removeStock(position);
    }

    downloadPortfolio() {
      const csvContent = this.portfolioService.exportToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'portfolio.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    uploadPortfolio() {
      this.fileInput.nativeElement.click();
    }

    handleFileInput(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        try {
          const csvData = reader.result as string;
          this.processPortfolioData(csvData);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          this.showSnackBar('Error al procesar el archivo CSV');
        }
      };

      reader.onerror = () => {
        this.showSnackBar('Error al leer el archivo');
      };
    }

    private async parseCSVWithCalculations(lines: string[], dolarMep: number): Promise<StockPrice[]> {
      const result: StockPrice[] = [];
      const dataLines = lines[0].includes('N°') ? lines.slice(1) : lines;

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        const values = line.split(',');
        if (values.length < 9) continue;

        try {

          const priceType = values[8].toLowerCase() === 'true';
          const quantity = parseInt(values[3]);
          const totalPurchasePrice = parseFloat(values[4].replace(',', '.'));
          const currentPrice = parseFloat(values[5].replace(',', '.'));


          let startDate: Date;
          try {

            const dateStr = values[2];
            startDate = new Date(dateStr);

            if (isNaN(startDate.getTime())) {
              const match = dateStr.match(/(\w+)\s+(\w+)\s+(\d+)\s+(\d+)/);
              if (match) {
                const [_, day, month, date, year] = match;
                startDate = new Date(`${month} ${date} ${year}`);
              } else {
                throw new Error('Formato de fecha inválido');
              }
            }
          } catch (dateError) {
            console.error('Error parsing date:', dateError);
            continue;
          }

          const formattedDate = startDate.toISOString().split('T')[0].replace(/-/g, '/');

          try {
            const historicDolarData = await this.stockService.historicDolarUpdate(formattedDate).toPromise();
            const historicDolarMep = historicDolarData.venta;

            const {
              adjustedPrice,
              percentageChange,
              totalCurrentPrice,
              totalPurchasePrice: adjustedTotalPurchasePrice
            } = this.calculationsService.calculateStockPrice(
              currentPrice,
              dolarMep,
              historicDolarMep,
              priceType,
              totalPurchasePrice,
              quantity
            );

            const stock: StockPrice = {
              name: values[0],
              ticket: values[1],
              startDate: startDate,
              quantity: quantity,
              totalPurchasePrice: totalPurchasePrice,
              currentPrice: adjustedPrice,
              totalCurrentPrice: totalCurrentPrice,
              percentageChange: percentageChange,
              priceType: priceType,
            };

            console.log('Procesando línea:', {
              originalValue: values[4],
              parsedValue: totalPurchasePrice,
              stockData: stock
            });

            result.push(stock);
          } catch (error) {
            console.error(`Error procesando datos históricos para línea ${i + 1}:`, error);
            continue;
          }
        } catch (error) {
          console.error(`Error procesando línea ${i + 1}:`, error);
          continue;
        }
      }

      if (result.length === 0) {
        throw new Error('No se pudieron procesar los datos del portafolio');
      }

      return result;
    }

    private processPortfolioData(csv: string) {
      const lines = csv.split('\n');
      if (lines.length < 1) {
        this.showSnackBar('El archivo CSV está vacío');
        return;
      }

      this.stockService.dolarUpdate().subscribe({
        next: async (dolarData) => {
          const dolarMep = dolarData.venta;
          try {
            const portfolio = await this.parseCSVWithCalculations(lines, dolarMep);

            if (portfolio.some(stock => stock.totalPurchasePrice === 0)) {
              console.warn('Advertencia: Algunos stocks tienen precio de compra 0:',
                portfolio.filter(stock => stock.totalPurchasePrice === 0));
            }

            this.portfolioService.setPortfolio(portfolio);
            this.showSnackBar('Portafolio importado correctamente');
          } catch (error) {
            console.error('Error procesando el portafolio:', error);
            this.showSnackBar('Error al procesar el portafolio: ' + error);
          }
        },
        error: (error) => {
          console.error('Error obteniendo cotización del dólar:', error);
          this.showSnackBar('Error al obtener la cotización del dólar');
        }
      });
    }

    savePortfolio() {
      const currentPortfolio = this.dataSource.data;
      this.portfolioService.setPortfolio(currentPortfolio);
      this.showSnackBar('Portafolio guardado correctamente');
    }

    async refreshInfo(){
      this.loading = true;
      const currentPortfolio = this.dataSource.data;
      const updatedPortfolio: StockPrice[] = [];

      try {
        const dolarData = await lastValueFrom(this.stockService.dolarUpdate());
        const currentDolarMep = dolarData.venta;

        for (const stock of currentPortfolio) {
          try {
            const stockData = await lastValueFrom(this.stockService.getStockData(stock.ticket));


            const currentPrice = stock.priceType ?
              stockData.data.price / currentDolarMep :
              stockData.data.price;

            const totalCurrentPrice = currentPrice * stock.quantity;
            const percentageChange = ((totalCurrentPrice - stock.totalPurchasePrice) / stock.totalPurchasePrice) * 100;


            const updatedStock: StockPrice = {
              ...stock,
              currentPrice: currentPrice,
              totalCurrentPrice: totalCurrentPrice,
              percentageChange: percentageChange
            };

            updatedPortfolio.push(updatedStock);
          } catch (error) {
            console.error(`Error actualizando ${stock.ticket}:`, error);
            updatedPortfolio.push(stock);
            this.showSnackBar(`Error al actualizar ${stock.ticket}`);
          }
        }

        this.portfolioService.setPortfolio(updatedPortfolio);
        this.showSnackBar('Portafolio actualizado correctamente');
      } catch (error) {
        console.error('Error en la actualización del portafolio:', error);
        this.showSnackBar('Error al actualizar el portafolio');
      } finally {
        this.loading = false;
      }
    }

  }
