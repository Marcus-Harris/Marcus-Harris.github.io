import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { Investment } from 'src/app/models/investment';
import { InvestmentType } from 'src/app/models/investment-type';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  investmentTypes?: InvestmentType[];
  investments?: Investment[];

  totalCryptoInvestments?: number;
  totalStockInvestments?: number;
  totalRealEstateInvestments?: number;
  totalTreasuryBillInvestments?: number;
  totalIBondInvestments?: number;

  currentTotalCrpytoPortfolio?: number;
  currentTotalStockPortfolio?: number;
  currentTotalRealEstatePortfolio?: number;
  currentTotalTreasuryBillPortfolio?: number;
  currentTotalIBondPortfolio?: number;

  cryptoProfits?: number;
  stockProfits?: number;
  realEstateProfits?: number;
  treasuryBillProfits?: number;
  iBondProfits?: number;

  totalCryptoCost?: number;
  totalStockCost?: number;
  totalRealEstateCost?: number;
  totalTreasuryBillCost?: number;
  totalIBondCost?: number;

  averageCryptoCost?: number;
  averageStockCost?: number;
  averageRealEstateCost?: number;
  averageTreasuryBillCost?: number;
  averageIBondCost?: number;
  
  public totalInvestmentsBarChart: ChartData<'bar'> = {
    datasets: []
  }

  public currentPortfolioPieChart: ChartData<'pie'> = {
    datasets: []
  }

  public netProfitPieChart: ChartData<'pie'> = {
    datasets: []
  }

  public averageCostBarChart: ChartData<'bar'> = {
    datasets: []
  }

  public chartLabels: string[] = [];

  public pieChartType: ChartType = "pie";
  public barChartType: ChartType = "bar";
  public radarChartType: ChartType = "radar";
  public chartOptions: ChartConfiguration['options'] = {}

  errorMessage?: string = '';

  investmentsLoading: boolean = false;
  typesLoading: boolean = false;

  constructor(
    private service: AppService,
  ) {
    
  }

  ngOnInit() {
    this.chartOptions = {
      responsive: true,
    }

    this.getAllInvestments();
    this.getAllInvestmentTypes();
  }

  public getAllInvestments() {
    this.investmentsLoading = true;
    
    this.totalCryptoInvestments = 0;
    this.totalStockInvestments = 0;
    this.totalRealEstateInvestments = 0;
    this.totalTreasuryBillInvestments = 0;
    this.totalIBondInvestments = 0;

    this.currentTotalCrpytoPortfolio = 0;
    this.currentTotalStockPortfolio = 0;
    this.currentTotalRealEstatePortfolio = 0;
    this.currentTotalTreasuryBillPortfolio = 0;
    this.currentTotalIBondPortfolio = 0;

    this.cryptoProfits = 0;
    this.stockProfits = 0;
    this.realEstateProfits = 0;
    this.treasuryBillProfits = 0;
    this.iBondProfits = 0;

    this.totalCryptoCost = 0;
    this.totalStockCost = 0;
    this.totalRealEstateCost = 0;
    this.totalTreasuryBillCost = 0;
    this.totalIBondCost = 0;

    this.averageCryptoCost = 0;
    this.averageStockCost = 0;
    this.averageRealEstateCost = 0;
    this.averageTreasuryBillCost = 0;
    this.averageIBondCost = 0;

    this.service.getInvestments()
    .subscribe((res) => {
      this.investments = res;
      res.forEach(x => {
        if(x.type == "Crypto Currency") {
          this.totalCryptoInvestments = this.totalCryptoInvestments! + 1;
          this.totalCryptoCost = this.totalCryptoCost! + x.cost;
          this.averageCryptoCost = this.totalCryptoCost / this.totalCryptoInvestments;
        } else if(x.type == "Stock") {
          this.totalStockInvestments = this.totalStockInvestments! + 1;
          this.totalStockCost = this.totalStockCost! + x.cost;
          this.averageStockCost = this.totalStockCost / this.totalStockInvestments;
        } else if(x.type == "Real Estate") {
          this.totalRealEstateInvestments = this.totalRealEstateInvestments! + 1;
          this.totalRealEstateCost = this.totalRealEstateCost! + x.cost;
          this.averageRealEstateCost = this.totalRealEstateCost / this.totalRealEstateInvestments;
        } else if(x.type == "Treasury Bill") {
          this.totalTreasuryBillInvestments = this.totalTreasuryBillInvestments! + 1;
          this.totalTreasuryBillCost = this.totalTreasuryBillCost! + x.cost;
          this.averageTreasuryBillCost = this.totalTreasuryBillCost / this.totalTreasuryBillInvestments;
        } else if(x.type == "I-Bond") {
          this.totalIBondInvestments = this.totalIBondInvestments! + 1;
          this.totalIBondCost = this.totalIBondCost! + x.cost;
          this.averageIBondCost = this.totalIBondCost / this.totalIBondInvestments
        }
      })

      res.forEach(x => {
        if(x.status == "Unsold") {
          if(x.type == "Crypto Currency") {
            this.currentTotalCrpytoPortfolio = this.currentTotalCrpytoPortfolio! + x.cost;
          } else if(x.type == "Stock") {
            this.currentTotalStockPortfolio = this.currentTotalStockPortfolio! + x.cost;
          } else if(x.type == "Real Estate") {
            this.currentTotalRealEstatePortfolio = this.currentTotalRealEstatePortfolio! + x.cost;
          } else if(x.type == "Treasury Bill") {
            this.currentTotalTreasuryBillPortfolio = this.currentTotalTreasuryBillPortfolio! + x.cost;
          } else if(x.type == "I-Bond") {
            this.currentTotalIBondPortfolio = this.currentTotalIBondPortfolio! + x.cost;
          } 
        }
      })

      res.forEach(x => {
        if(x.status == "Sold") {
          if(x.type == "Crypto Currency") {
            this.cryptoProfits = this.cryptoProfits! + x.net_Profit!;
          } else if(x.type == "Stock") {
            this.stockProfits = this.stockProfits! + x.net_Profit!;
          } else if(x.type == "Real Estate") {
            this.realEstateProfits = this.realEstateProfits! + x.net_Profit!;
          } else if(x.type == "Treasury Bill") {
            this.treasuryBillProfits = this.treasuryBillProfits! + x.net_Profit!;
          } else if(x.type == "I-Bond") {
            this.iBondProfits = this.iBondProfits! + x.net_Profit!;
          } 
        }
      })

      this.totalInvestmentsBarChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: [this.totalCryptoInvestments!, this.totalStockInvestments!, this.totalIBondInvestments!, this.totalTreasuryBillInvestments!, this.totalRealEstateInvestments!],
            label: "Portfolio",
          }
        ],
      }

      this.currentPortfolioPieChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: [this.currentTotalCrpytoPortfolio!, this.currentTotalStockPortfolio!, this.currentTotalIBondPortfolio!, this.currentTotalTreasuryBillPortfolio!, this.currentTotalRealEstatePortfolio!]
          }
        ],
      }

      this.netProfitPieChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: [this.cryptoProfits!, this.stockProfits!, this.iBondProfits!, this.treasuryBillProfits!, this.realEstateProfits!]
          }
        ],
      }

      this.averageCostBarChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: [this.averageCryptoCost!, this.averageStockCost!, this.averageIBondCost!, this.averageTreasuryBillCost!, this.averageRealEstateCost!],
            label: "Portfolio"
          }
        ],
      }

      setTimeout(() => { this.investmentsLoading = false; }, 20);
    }, (error) => {
      this.errorMessage = error.errorMessage;
    });
  }

  public getAllInvestmentTypes() {
    this.typesLoading = true;
    this.service.getInvestmentTypes()
      .subscribe((res) => {
        this.investmentTypes = res;

        res.forEach(type => {
          this.chartLabels.push(type.type);
        });

        this.typesLoading = false;
      }, (error) => {
        this.errorMessage = error.errorMessage;
      });
  }
}
