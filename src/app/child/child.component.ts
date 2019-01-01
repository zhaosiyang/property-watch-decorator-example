import {Component, Input} from '@angular/core';
// import {OnChange} from 'property-watch-decorator';

// This decorator function is now available in npm registry 'property-watch-decorator'
export function OnChange<T>(observer: (value: T) => void) {
  let _cachedValue: T;
  return (target: any, key: PropertyKey) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        _cachedValue = value;
        observer.call(this, _cachedValue);
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

  @OnChange(function (value) {
    console.log(`title is changed to: ${value}     `, 'Others:', 'this.foo', this.foo, 'this.title', this.title, 'this.count', this.count);
  })
  title: string;

  // equivalent if replace "this.count" with "value"
  @OnChange(function (value) {
    console.log(`count is changed to: ${value}     `, 'Others:', 'this.foo', this.foo, 'this.title', this.title, 'this.count', this.count);
  })
  @Input()
  count: number;

  changeTitle() {
    this.title = this.title === 'hello' ? 'world' : 'hello';
  }

}

