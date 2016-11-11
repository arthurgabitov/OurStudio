import { Component } from '@angular/core';
export class Hero {
    id: number;
    name: string;
}
const HEROES: Hero[] = [
    { id: 1, name: 'хуй' },
    { id: 2, name: 'пизда' },
    { id: 3, name: 'Bombasto' },
    { id: 4, name: 'Celeritas' },
    { id: 5, name: 'Magneta' },
    { id: 6, name: 'RubberMan' },
    { id: 7, name: 'Dynama' },
    { id: 8, name: 'Dr IQ' },
    { id: 9, name: 'Magma' },
    { id: 10, name: 'Tornado1' }
];

@Component({
    selector: 'my-app',
    template: '<h1>{{title}}</h1>' +
    '<h2>Список</h2>' +
    '<ul class="heroes">' +
    '<li *ngFor="let hero of heroes">' +
    '<div [draggable]><span>{{hero.id}}</span> {{hero.name}}</div>' +
    '</li>' +
    '</ul>',
    directives: [Draggable],
    styles:[`
      .selected {
        background-color: #CFD8DC !important;
        color: white;
      }
      .heroes {
        margin: 0 0 2em 0;
        list-style-type: none;
        padding: 0;
        width: 15em;
      }
      .heroes li {
        cursor: pointer;
        position: relative;
        left: 0;
        background-color: #EEE;
        margin: .5em;
        padding: .3em 0;
        height: 1.6em;
        border-radius: 4px;
      }
    `]
})

export class AppComponent {
    public title = 'Черти вонючие';
    heroes = HEROES;
}
