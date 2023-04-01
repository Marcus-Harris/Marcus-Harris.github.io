import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { forkJoin } from 'rxjs';
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

  totalCostArray: number[] = [];
  totalInvestmentsData: number[] = [];  
  currentPortfolioData: number[] = [];  
  netProfitData: number[] = [];  
  averageCostData: number[] = [];  

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
    this.investmentsLoading = true;

    this.chartOptions = {
      responsive: true,
    }

    this.getTotals();
  }
  
  public getTotals() {
    forkJoin([
      this.service.getInvestments(),
      this.service.getInvestmentTypes()
    ]).subscribe((res) => {
      this.investments = res[0];
      this.investmentTypes = res[1];
      this.totalInvestmentsData.length = res[1].length;
      this.currentPortfolioData.length = res[1].length;
      this.netProfitData.length = res[1].length;
      this.averageCostData.length = res[1].length;

      for(let i = 0; i < res[1].length; i++) {
        this.totalInvestmentsData[i] = 0;
        this.currentPortfolioData[i] = 0;
        this.netProfitData[i] = 0;
        this.averageCostData[i] = 0;
        this.totalCostArray[i] = 0;
      }

      res[1].forEach(type => {
        this.chartLabels.push(type.type);
      });

      for(let i = 0; i < this.investments.length; i++) {
        for(let j = 0; j < this.chartLabels.length; j++) {
          if (this.investments[i].type == this.chartLabels[j]) {
            this.totalInvestmentsData[j] = this.totalInvestmentsData[j] + 1;
            this.totalCostArray[j] = this.totalCostArray[j] + this.investments[i].cost;
            this.averageCostData[j] = this.totalCostArray[j] / this.totalInvestmentsData[j];
            if(this.investments[i].status == "Unsold") {
              this.currentPortfolioData[j] = this.currentPortfolioData[j] + this.investments[i].cost;
            }

            if(this.investments[i].status == "Sold") {
              this.netProfitData[j] = this.netProfitData[j] + this.investments[i].net_Profit!;
            }
          }
        }
      }

      this.totalInvestmentsBarChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.totalInvestmentsData,
            label: "Portfolio",
          }
        ],
      }

      this.currentPortfolioPieChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.currentPortfolioData
          }
        ],
      }

      this.netProfitPieChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.netProfitData
          }
        ],
      }

      this.averageCostBarChart = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.averageCostData,
            label: "Portfolio"
          }
        ],
      }

      this.investmentsLoading = false;
    })
  }
}
