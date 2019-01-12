import {Component, Input} from '@angular/core';

export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export function OnChange<T = any>(callback: (value: T, simpleChange?: SimpleChange<T>) => void) {
  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();
  return (target: any, key: PropertyKey) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        // change status of "isFirstChange"
        if (this[isFirstChangeKey] === undefined) {
          this[isFirstChangeKey] = true;
        }
        if (this[isFirstChangeKey] === true) {
          this[isFirstChangeKey] = false;
        }
        // No operation if new value is same as old value
        if (!this[isFirstChangeKey] && this[cachedValueKey] === value) {
          return;
        }
        const oldValue = this[cachedValueKey];
        this[cachedValueKey] = value;
        const simpleChange: SimpleChange<T> = {
          firstChange: this[isFirstChangeKey],
          previousValue: oldValue,
          currentValue: this[cachedValueKey],
          isFirstChange: () => this[isFirstChangeKey],
        };
        callback.call(this, this[cachedValueKey], simpleChange);
      },
      get: function () {
        return this[cachedValueKey];
      },
    });
  };
}

@Component({
  selector: 'app-child',
  template: `
    <h4>Title: {{title}}</h4>
    <h4>Count: {{count}}</h4>
    <button (click)="changeTitle()">Change Title</button>`
})
export class ChildComponent {

  foo = 'bar';

  @OnChange<string>(function (value, simpleChange) {
    console.log(`title is changed to: ${value}`);
    console.log(`Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
  })
  title: string;

  @OnChange<number>(onCountChange)
  @Input()
  count: number;

  changeTitle() {
    this.title = this.title === 'hello' ? 'world' : 'hello';
  }

}

function onCountChange(value, simpleChange) {
  console.log(`count is changed to: ${value}`);
  console.log(`Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
}

