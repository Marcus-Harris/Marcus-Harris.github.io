import { InvestmentType } from "./investment-type";

export class Investment {
  public id: number;
  public name: string;
  public ticker?: string;
  public type: string;
  public date_Bought: Date;
  public date_Sold?: Date = undefined;
  public status: string;
  public cost: number;
  public revenue?: number = undefined;
  public dividends: number = 0;
  public net_Profit_Percentage?: number;
  public net_Profit?: number;

  constructor(id: number, name: string, type: InvestmentType, date_Bought: Date, status: string, cost: number) {
    this.id = id;
    this.name = name;
    this.type = type.type;
    this.date_Bought = date_Bought;
    this.status = status;
    this.cost = cost;
  }
}