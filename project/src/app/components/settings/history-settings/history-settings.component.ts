import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { forkJoin } from 'rxjs';
import { History } from 'src/app/models/history';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-history-settings',
  templateUrl: './history-settings.component.html',
  styleUrls: ['./history-settings.component.css']
})
export class HistorySettingsComponent implements OnInit {
  history?: History[];
  dataSource = new MatTableDataSource<History>();
  displayedColumns: string[] = 
  [
    'position', 
    'entry', 
    'type',
    'date'
   ];
  
  loading: boolean = false;

  ngOnInit() {
    this.loading = true;
    this.getHistory();
  }

  constructor(private service: AppService) {

  }

  getHistory() {
    forkJoin([
      this.service.getHistory()
    ]).subscribe((res) => {
      this.history = res[0];
      this.dataSource = new MatTableDataSource(this.history);
    })

    this.loading = false;
  }
}
