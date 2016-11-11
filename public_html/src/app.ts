import { Component, View, NgStyle, bootstrap } from 'angular2/angular2'
import { Resizable } from './resizable.ts'
import { Draggable } from './draggable.ts'

@Component({
  selector: 'my-app'
})
@View({
  template: `
    <div class="testbox resizable draggable" [draggable]="{model:widget}" [resizable]="{model:widget}" [ng-style]="widget">
      draggable & resizable with model
      <pre>
  top    : {{widget.top}}
  left   : {{widget.left}}
  width  : {{widget.width}}
  height : {{widget.height}}
      </pre>
    </div>
    <div class="testbox2 resizable draggable" draggable resizable>
      draggable & resizable without model
    </div>
    <div class="testbox3 resizable draggable" draggable resizable 
      (drag-start)="onDragStart()" (drag)="onDrag()" (drag-stop)="onDragStop()"
      (resize-start)="onResizeStart()" (resize)="onResize()" (resize-stop)="onResizeStop()">
      <div>draggable & resizable event handling</div>
      <div>status : {{status}}</div>
      <div>drags : {{drags}}</div>
      <div>resizes : {{resizes}}</div>
    </div>
  `,
  directives: [ Draggable, Resizable, NgStyle ]
})
export class App {
  widget = {
    top: '50px',
    left: '50px',
    height: '200px',
    width: '200px'
  };
  
  status = "idle";
  drags: 0;
  resizes: 0;
  
  public onDragStart() {
    this.status = "dragging";
  }
  
  public onDrag() {
    this.drags++;
  }
  
  public onDragStop() {
    this.status = "idle";
  }
  
  public onResizeStart() {
    this.status = "resizing";
  }
  
  public onResize() {
    this.resizes++;
  }
  
  public onResizeStop() {
    this.status = "idle";
  }
  
}

bootstrap(App)
  .catch(err => console.error(err));