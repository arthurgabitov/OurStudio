import { Component, View, ElementRef, CORE_DIRECTIVES, EventEmitter, Renderer } from 'angular2/angular2';
import { DragEvent, Draggable } from "./draggable";

@Component({
    selector: '[resizable]',
    inputs: ['config:resizable'],
    outputs: ['resize', 'resizeStart', 'resizeStop']
})
@View({
    template: `
    <ng-content></ng-content>
    <div *ng-for="#handle of handles" [ng-class]="'resize-handle resize-handle-' + handle" draggable (drag)="onDrag($event, handle)" (drag-start)="onDragStart($event)" (drag-stop)="onDragStop($event)"></div>
    `,
    directives: [Draggable, CORE_DIRECTIVES]
})
export class Resizable {
    public resize: EventEmitter = new EventEmitter();
    public resizeStart: EventEmitter = new EventEmitter();
    public resizeStop: EventEmitter = new EventEmitter();

    private _handles: Array<string> = ['s', 'e', 'se'];
    private _originalWidth: number;
    private _originalHeight: number;
    private _originalLeft: number;
    private _originalTop: number;
    private _minWidth: number = 0;
    private _minHeight: number = 0;
    private _model: any;
    private _config: any;

    set config(value: any) {
        this._config = value;
        this.setConfig(this._config);
    }

    get handles(): Array<string> {
        return this._handles;
    }

    public setConfig(config: any): void {
        for (let key in config) {
            var value = config[key];
            switch (key) {
                case 'model':
                    this._model = value;
                    break;
                case 'handles':
                    this._handles = value;
                    break;
                case 'minWidth':
                    this._minWidth = parseFloat(value);
                    break;
                case 'minHeight':
                    this._minHeight = parseFloat(value);
                    break;
            }
        }
    }

    public constructor(private _element: ElementRef, private _renderer: Renderer) {
    }

    private _setStyle(styleName: string, styleValue: string) {
        if (this._model) {
            this._model[styleName] = styleValue
        } else {
            this._renderer.setElementStyle(this._element, styleName, styleValue);
        }
    }

    public onDrag(dragEvent: DragEvent, handle: string) {
        if (handle.indexOf('e') != -1) {
            this._setStyle('width', Math.max(this._minWidth, this._originalWidth + dragEvent.offset.left) + 'px');
        }
        if (handle.indexOf('s') != -1)
            this._setStyle('height', Math.max(this._minHeight, this._originalHeight + dragEvent.offset.top) + 'px');
        if (handle.indexOf('w') != -1) {
            this._setStyle('left', (this._originalLeft + dragEvent.offset.left) + 'px');
            this._setStyle('width', Math.max(this._minWidth, this._originalWidth - dragEvent.offset.left) + 'px');
        }
        if (handle.indexOf('n') != -1) {
            this._setStyle('top', (this._originalTop + dragEvent.offset.top) + 'px');
            this._setStyle('height', Math.max(this._minHeight, this._originalHeight - dragEvent.offset.top) + 'px');
        }
        dragEvent.cancelled = true;
        this.resize.next(dragEvent);
    }

    public onDragStart(event: Event) {
        this._originalWidth = this._element.nativeElement.offsetWidth;
        this._originalHeight = this._element.nativeElement.offsetHeight;
        this._originalLeft = this._element.nativeElement.offsetLeft;
        this._originalTop = this._element.nativeElement.offsetTop;
        this.resizeStart.next(event);
    }

    public onDragStop(event: Event) {
        this.resizeStop.next(event);
    }
}
