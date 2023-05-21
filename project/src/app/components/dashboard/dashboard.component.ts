import { Component, OnInit, Inject } from '@angular/core';
import { Investment } from '../../models/investment';
import { InvestmentType } from '../../models/investment-type';
import { AppService } from '../../services/app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  investmentTypes?: InvestmentType[];
  investments?: Investment[];
  filteredArray?: Investment[];

  totalInvestments?: number;
  totalCost: number = 0;
  totalRevenue: number = 0;
  totalDividends: number = 0;
  totalNetProfitPercentage: number = 0;
  totalNetProfit: number = 0;
  highestPercentage: number = 0;
  highestProfit: number = 0;

  currentInvestment?: Investment;

  statusRadioButton: string = "";

  loading: boolean = false;
  showInvestmentForm: boolean = false;
  editMode: boolean = false;
  addMode: boolean = false;

  nameControl = new FormControl('', [Validators.required]);
  typeControl = new FormControl('', [Validators.required]);
  tickerControl = new FormControl('');
  dateBoughtControl = new FormControl('', [Validators.required]);
  dateSoldControl = new FormControl('');
  costControl = new FormControl('', [Validators.required]);
  revenueControl = new FormControl('');
  isInvestmentSoldYetControl = new FormControl('', [Validators.required])

  errorMessage?: string = '';
  searchFilter: string = '';

  dataSource = new MatTableDataSource<Investment>();
  displayedColumns: string[] = 
  [
    'position', 
    'name', 
    'type', 
    'purchase-date', 
    'sell-date', 
    'cost', 
    'revenue',
    'dividends',
    'percentage',
    'net-profit'
   ];

  constructor(
    private service: AppService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {
    this.showInvestmentForm = false;
  }

  ngOnInit() {
    this.loading = true;
    this.getTotals();
  }

  public getTotals() {
    forkJoin([
      this.service.getInvestments(),
      this.service.getInvestmentTypes()
    ]).subscribe((res) => {
      this.totalCost = 0;
      this.totalRevenue = 0;
      this.totalDividends = 0;
      this.totalNetProfitPercentage = 0;
      this.totalNetProfit = 0;
      this.highestPercentage = 0;
      this.highestProfit = 0;
      res[0].forEach(x => {
        if(x.status == "Sold") {
          this.totalCost = this.totalCost + x.cost;
          this.totalRevenue = this.totalRevenue + x.revenue!;
          this.totalDividends = this.totalDividends + x.dividends;
          this.totalNetProfitPercentage = (((this.totalRevenue + this.totalDividends) - this.totalCost) / this.totalCost) * 100;
          this.totalNetProfit = (this.totalRevenue + this.totalDividends) - this.totalCost;
        }
      })
      this.investments = res[0];
      this.investmentTypes = res[1];
      this.filteredArray = this.investments;
      this.dataSource = new MatTableDataSource(this.investments);
      this.dataSource.filterPredicate = (data: Investment, filter: string) => {
        return data.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
      };
      this.highestPercentage = Math.max(...res[0].map(o => o.net_Profit_Percentage!));
      this.highestProfit = Math.max(...res[0].map(o => o.net_Profit!));
      this.totalInvestments = res[0].length;
      this.loading = false;      
    })
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;

    this.filteredArray = this.dataSource.data.filter((item: Investment) => {
      return item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    });

    this.totalCost = 0;
    this.totalRevenue = 0;
    this.totalDividends = 0;
    this.totalNetProfitPercentage = 0;
    this.totalNetProfit = 0;
    this.highestPercentage = 0;
    this.highestProfit = 0;

    this.filteredArray.forEach(x => {
      if(x.status == "Sold") {
        this.totalCost = this.totalCost + x.cost;
        this.totalRevenue = this.totalRevenue + x.revenue!;
        this.totalDividends = this.totalDividends + x.dividends;
        this.totalNetProfitPercentage = (((this.totalRevenue + this.totalDividends) - this.totalCost) / this.totalCost) * 100;
        this.totalNetProfit = (this.totalRevenue + this.totalDividends) - this.totalCost;
      }
    })

    this.highestPercentage = Math.max(...this.filteredArray.map(o => o.net_Profit_Percentage!));
    this.highestProfit = Math.max(...this.filteredArray.map(o => o.net_Profit!));
    this.totalInvestments = this.filteredArray.length;
  }

  showAddMode() {
    this.resetControls();
    this.currentInvestment = new Investment(0, '', new InvestmentType(0, ''), new Date(moment().hour(0).second(0).millisecond(0).toDate()), '', 0);
    this.currentInvestment.date_Sold = new Date(moment().hour(0).second(0).millisecond(0).toDate());
    this.addMode = true;
    this.editMode = true;
    this.showInvestmentForm = true;
    this.statusRadioButton = '';
    this.showInvestment(this.currentInvestment);
  }

  showInvestment(investment: Investment) {
    if(investment.id != 0) {
      this.service.getOneInvestment(investment.id)
      .subscribe((result) => {
        this.currentInvestment = Object.assign({}, result);
        this.errorMessage = '';
        this.showInvestmentForm = true;
      })
    }
  }

  checkStatusOnEdit() {
    if(this.currentInvestment!.status == "Sold") {
      this.isInvestmentSoldChecker("yes");
      this.statusRadioButton = this.isInvestmentSoldYetControl.value!;
    } else {
      this.isInvestmentSoldChecker("no");
      this.statusRadioButton = this.isInvestmentSoldYetControl.value!;
    }
    this.editMode = true;
  }

  resetControls() {
    this.nameControl.markAsUntouched();
    this.nameControl.setErrors(null);

    this.typeControl.markAsUntouched();
    this.typeControl.setErrors(null);

    this.tickerControl.markAsUntouched();
    this.tickerControl.setErrors(null);

    this.dateBoughtControl.markAsUntouched();
    this.dateBoughtControl.setErrors(null);

    this.dateSoldControl.markAsUntouched();
    this.dateSoldControl.setErrors(null);

    this.costControl.markAsUntouched();
    this.costControl.setErrors(null);

    this.revenueControl.markAsUntouched();
    this.revenueControl.setErrors(null);

    this.isInvestmentSoldYetControl.markAsUntouched();
    this.isInvestmentSoldYetControl.setErrors(null);
  }

  resetInvestmentValues() {
    this.resetControls();
    if(this.currentInvestment!.id != 0) {
      this.service.getOneInvestment(this.currentInvestment!.id)
      .subscribe((result) => {
        this.currentInvestment = Object.assign({}, result);
      })
    }
    this.editMode = false;
    this.addMode = false;
    this.showInvestmentForm = false;
  }

  checkForErrors(): boolean {
    if(this.nameControl.errors || this.typeControl.errors || this.tickerControl.errors || this.dateBoughtControl.errors || this.dateSoldControl.errors || this.costControl.errors || this.revenueControl.errors || this.isInvestmentSoldYetControl.errors) {
      this.nameControl.markAsTouched();
      this.typeControl.markAsTouched();
      this.tickerControl.markAsTouched();
      this.dateBoughtControl.markAsTouched();
      this.dateSoldControl.markAsTouched();
      this.costControl.markAsTouched();
      this.revenueControl.markAsTouched();
      this.isInvestmentSoldYetControl.markAsTouched();

      return true;
    }
    return false;
  }

  isInvestmentSoldChecker(value: string) {
    this.isInvestmentSoldYetControl.setValue(value);

    if(this.isInvestmentSoldYetControl.value == "yes")
    {
      this.dateSoldControl.setValidators([Validators.required]);
      this.revenueControl.setValidators([Validators.required]);
      this.dateSoldControl.enable();
      this.revenueControl.enable();
    } else {
      this.dateSoldControl.clearValidators();
      this.revenueControl.clearValidators();

      this.dateSoldControl.disable();
      this.revenueControl.disable();

      this.dateSoldControl.setValue(null);
      this.revenueControl.setValue(null);
    }
  }

  isTickerNeeded() {
    if(this.typeControl.value != "Crypto Currency" && this.typeControl.value != "Stock") {
      this.tickerControl.clearValidators();
      this.tickerControl.disable();
    } else {
      this.tickerControl.setValidators([Validators.required]);
      this.tickerControl.enable();
    }
  }

  addInvestment() {
    if(this.checkForErrors()) {
      return;
    }

    if(this.currentInvestment) {
      this.service.addInvestment(this.currentInvestment)
        .subscribe(() => {
          this.snackBar.open("Investment Added!", "Close", { duration: 4000});

          this.addMode = false;
          this.editMode = false;
          this.showInvestmentForm = false;

          this.resetControls();
          this.getTotals();
        }, (error) => {
          this.errorMessage = error.errorMessage;
        }
      );
    }
  }

  updateInvestment() {
    if(this.checkForErrors()) {
      return;
    }

    if(this.currentInvestment) {
      this.service.updateInvestment(this.currentInvestment)
        .subscribe((result) => {
          this.currentInvestment = Object.assign({}, result.find(x => x.id = this.currentInvestment!.id));

          this.snackBar.open("Investment Updated!", "Close", { duration: 4000});

          this.addMode = false;
          this.editMode = false;
          this.showInvestmentForm = false;

          this.resetControls();
          this.getTotals();
        }, (error) => {
          this.errorMessage = error.errorMessage;
        }
      );
    }
  }

  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(InvestmentDialogDelete, {
      data: { investment: this.currentInvestment }
    });

    dialogRef.afterClosed().subscribe((result => {
      if(result) {
        if (this.currentInvestment) {
          this.service.deleteInvestment(this.currentInvestment.id)
          .subscribe(() => {
            this.getTotals();
          })
        this.addMode = false;
        this.editMode = false;
        this.showInvestmentForm = false;
        this.snackBar.open("Investment Deleted!", 'Close', { duration: 4000 });
        }
      }
    }))
  }
}

@Component({
  selector: 'investment-dialog-delete',
  templateUrl: './dialogs/investment-dialog-delete.html',
  styleUrls: ['./dialogs/investment-dialog-delete.css'],
})
export class InvestmentDialogDelete {
  public confirm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InvestmentDialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {  }

  public accept() {
    this.dialogRef.close(true);
  }

  public decline() {
    this.dialogRef.close(false);
  }
}

export interface DialogData {
  investment: Investment
}
