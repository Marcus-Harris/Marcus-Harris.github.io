import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Investment } from '../models/investment';
import { InvestmentType } from '../models/investment-type';
import { History } from '../models/history';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private investmentURI = "Investment";
  private investmentTypeURI = "InvestmentType";
  private historyURI = "History";

  constructor(private http: HttpClient) { }

  public getInvestments() : Observable<Investment[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }

    return this.http.get<Investment[]>(`${environment.apiURL}${this.investmentURI}`, headerDict);
  }

  public getOneInvestment(id: number) : Observable<Investment> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.get<Investment>(`${environment.apiURL}${this.investmentURI}/${id}`, headerDict);
  }

  public addInvestment(investment: Investment) : Observable<Investment[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.post<Investment[]>(`${environment.apiURL}${this.investmentURI}`, investment, headerDict);
  }

  public updateInvestment(investment: Investment) : Observable<Investment[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.put<Investment[]>(`${environment.apiURL}${this.investmentURI}`, investment, headerDict);
  }

  public deleteInvestment(id: number) : Observable<Investment[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.delete<Investment[]>(`${environment.apiURL}${this.investmentURI}/${id}`, headerDict);
  }

  public getInvestmentTypes() : Observable<InvestmentType[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.get<InvestmentType[]>(`${environment.apiURL}${this.investmentTypeURI}`, headerDict);
  }

  public getOneInvestmentType(id: number) : Observable<InvestmentType> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.get<InvestmentType>(`${environment.apiURL}${this.investmentTypeURI}/${id}`, headerDict);
  }

  public addInvestmentType(investmentType: InvestmentType) : Observable<InvestmentType[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.post<InvestmentType[]>(`${environment.apiURL}${this.investmentTypeURI}`, investmentType, headerDict);
  }

  public updateInvestmentType(investmentType: InvestmentType) : Observable<InvestmentType[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.put<InvestmentType[]>(`${environment.apiURL}${this.investmentTypeURI}`, investmentType, headerDict);
  }

  public deleteInvestmentType(id: number) : Observable<InvestmentType[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }
    
    return this.http.delete<InvestmentType[]>(`${environment.apiURL}${this.investmentTypeURI}/${id}`, headerDict);
  }

  public getHistory() : Observable<History[]> {
    const headerDict = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    }

    return this.http.get<History[]>(`${environment.apiURL}${this.historyURI}`, headerDict);
  }
}
