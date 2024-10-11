import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule ,
} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import { StockInputData } from '@models/stock.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './stock-dialog.component.html',
  styleUrl: './stock-dialog.component.scss'
})
export class StockDialogComponent {
  stockForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<StockInputData>,
    private fb: FormBuilder
  ) {
    this.stockForm = this.fb.group({
      ticket: ['', Validators.required],
      startDate: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      totalPurchasePrice: [null, [Validators.required, Validators.min(1)]],
      priceType: [false],
    });
  }

  onSubmit() {
    if (this.stockForm.valid) {
      this.dialogRef.close(this.stockForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
