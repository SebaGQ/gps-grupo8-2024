import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayText = false;
  data: any;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.fetchData();
  }

  toggleText() {
    this.displayText = !this.displayText;
  }

  fetchData() {
    this.httpService.get('avisos').subscribe(response => {
      this.data = response;
      console.log(this.data);
    });
  }
}
