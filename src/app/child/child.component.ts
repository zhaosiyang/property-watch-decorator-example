import {Component, Input} from '@angular/core';

export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export interface CallBackFunction<T> {
  (value: T, change?: SimpleChange<T>): void;
}

export function OnChange<T = any>(callback: CallBackFunction<T> | string) {

  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();

  return (target: any, key: PropertyKey) => {

    const callBackFn: CallBackFunction<T> = typeof callback === 'string' ? target[callback] : callback;
    if (!callBackFn) {
      throw new Error(`Cannot find method ${callback} in class ${target.constructor.name}`);
    }

    Object.defineProperty(target, key, {
      set: function (value) {

        // change status of "isFirstChange"
        this[isFirstChangeKey] = this[isFirstChangeKey] === undefined;

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
        callBackFn.call(this, this[cachedValueKey], simpleChange);
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

  @OnChange<number>('onCountChange2')
  @Input()
  count: number;

  changeTitle() {
    this.title = this.title === 'hello' ? 'world' : 'hello';
  }

  onCountChange2(value, simpleChange) {
    console.log(`2count is changed to: ${value}`);
    console.log(`2Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
  }

}

function onCountChange(value, simpleChange) {
  console.log(`count is changed to: ${value}`);
  console.log(`Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
}

