import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <app-child [count]="count"></app-child>
    <button (click)="changeCount()">Change Count</button>
  `,
})
export class ParentComponent {

  count = 0;

  changeCount() {
    this.count += 1;
  }
}
