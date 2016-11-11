import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Renderer } from 'angular2/angular2';
import { Observable, Subscription, Subscriber } from '@reactivex/rxjs';

export class Position {
    constructor(public left?: number, public top?: number) { }
}

export class DragEvent {
    public cancelled: boolean = false;
    constructor(public mouseDown: UIEvent, public mouseMove: UIEvent, public position: Position, public offset: Position) {
    }
}

const makeInputObservable =
    (node: Node, eventName: string, useCapture?: boolean): Observable<UIEvent> =>
        Observable.fromEventPattern<MouseEvent>(
            (handler) => { node.addEventListener(eventName, <EventListener>handler, useCapture); },
            (handler) => { node.removeEventListener(eventName, <EventListener>handler, useCapture); }
        );

@Directive({
    selector: '[draggable]',
    inputs: ['config:draggable'],
    outputs: ['drag', 'dragStart', 'dragStop']
})
export class Draggable implements OnDestroy, OnInit {
    public drag: EventEmitter = new EventEmitter();
    public dragStart: EventEmitter = new EventEmitter();
    public dragStop: EventEmitter = new EventEmitter();

    private _dragSubscription: Subscription<DragEvent>;
    private _isDragging: boolean = false;
    private _axis: string;
    private _config: any;
    private _mouseDelay: number = 50;
    private _mouseDelayMet: boolean;
    private _mouseDelayTimer: number;
    private _mouseDistance: number = 5;
    private _mouseDistanceMet: boolean = false;
    private _containment: ClientRect = null;
    private _dragOffsetX: number;
    private _dragOffsetY: number;
    private _elementStartX: number;
    private _elementStartY: number;
    private _model: any;

    set config(value: any) {
        this._config = value;
        this.setConfig(this._config);
    }

    public constructor(private _element: ElementRef, private _renderer: Renderer) {
    }

    public setConfig(config: any): void {
        for (let key in config) {
            var value = config[key];
            switch (key) {
                case 'axis':
                    this._axis = value;
                    break;
                case 'delay':
                    this._mouseDelay = parseInt(value);
                    break;
                case 'distance':
                    this._mouseDistance = parseInt(value);
                    break;
                case 'containment':
                    this._containment = value;
                    break;
                case 'model':
                    this._model = value;
                    break;
            }
        }
    }

    private _generatePosition(event: MouseEvent): Position {
        var posX = (this._axis == 'y') ? this._elementStartX : this._elementStartX + this._dragOffsetX;
        var posY = (this._axis == 'x') ? this._elementStartY : this._elementStartY + this._dragOffsetY;
        return new Position(posX, posY);
    }

    private _start(): void {
        this._isDragging = false;
        this._mouseDelayMet = this._mouseDelay == 0;
        this._mouseDistanceMet = this._mouseDistance == 0;
        this._elementStartX = this._element.nativeElement.offsetLeft;
        this._elementStartY = this._element.nativeElement.offsetTop;
        if (!this._mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(() => {
                this._mouseDelayMet = true;
            }, this._mouseDelay);
        }
    }

    private _update(mouseDownEvent: MouseEvent, mouseMoveEvent: MouseEvent): void {
        this._dragOffsetX = mouseMoveEvent.clientX - mouseDownEvent.clientX;
        this._dragOffsetY = mouseMoveEvent.clientY - mouseDownEvent.clientY;
        this._mouseDistanceMet = Math.abs(this._dragOffsetX) > this._mouseDistance || Math.abs(this._dragOffsetY) > this._mouseDistance
        if (!this._isDragging && this._mouseDelayMet && this._mouseDistanceMet) {
            this.dragStart.next(event);
            this._isDragging = true;
        }
    }

    public onInit(): void {
        var mouseDownObservable = Observable.fromEvent(this._element.nativeElement, 'mousedown').filter((md: MouseEvent) => md.which == 1);
        var mouseMoveObservable = Observable.fromEvent(this._element.nativeElement.ownerDocument, 'mousemove');
        var mouseUpObservable = Observable.fromEvent(this._element.nativeElement.ownerDocument, 'mouseup');
        var clickObservable = makeInputObservable(this._element.nativeElement.ownerDocument, 'click', true);
        var dragObservable = mouseDownObservable.flatMap<DragEvent>((mouseDownEvent: MouseEvent) => {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();
            this._start();
            return mouseMoveObservable
                .map((mouseMoveEvent: MouseEvent) => {
                    this._update(mouseDownEvent, mouseMoveEvent);
                    return new DragEvent(mouseDownEvent, mouseMoveEvent, this._generatePosition(mouseMoveEvent), new Position(this._dragOffsetX, this._dragOffsetY));
                })
                .filter(() => this._isDragging)
                .takeUntil(mouseUpObservable
                    .map((mouseUpEvent) => {
                        clearInterval(this._mouseDelayTimer);
                        if (this._isDragging)
                            this.dragStop.next(mouseUpEvent);
                    })
                    .zip(clickObservable.map((clickEvent: MouseEvent) => {
                        if (this._isDragging) {
                            clickEvent.stopPropagation();
                            this._isDragging = false;
                        }
                    }))
                );
        });

        this._dragSubscription = dragObservable.subscribe((event) => {
            this.drag.next(event);
            setTimeout(() => {
                if (!event.cancelled) {
                    this._setStyle('top', event.position.top + 'px');
                    this._setStyle('left', event.position.left + 'px');
                }
            });
        });
    }

    private _setStyle(styleName: string, styleValue: string) {
        if (this._model) {
            this._model[styleName] = styleValue
        } else {
            this._renderer.setElementStyle(this._element, styleName, styleValue);
        }
    }

    public onDestroy(): void {
        this._dragSubscription.unsubscribe();
    }
}