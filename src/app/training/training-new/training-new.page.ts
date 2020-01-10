import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training-new',
  templateUrl: './training-new.page.html',
  styleUrls: ['./training-new.page.scss'],
})
export class TrainingNewPage implements OnInit {

  // maxDate: Date;
  today = new Date();

  constructor() { }

  ngOnInit() {
  }

}
