import {Component, Input} from '@angular/core';

export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export function OnChange<T = any>(callback: (value: T, simpleChange?: SimpleChange<T>) => void) {
  let _cachedValue: T;
  let _isFirstChange = true;
  return (target: any, key: PropertyKey) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        const oldValue = _cachedValue;
        _cachedValue = value;
        const simpleChange: SimpleChange<T> = {
          firstChange: _isFirstChange,
          previousValue: oldValue,
          currentValue: _cachedValue,
          isFirstChange: () => _isFirstChange,
        };
        _isFirstChange = false;
        callback.call(this, _cachedValue, simpleChange);
      },
      get: function () {
        return _cachedValue;
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

