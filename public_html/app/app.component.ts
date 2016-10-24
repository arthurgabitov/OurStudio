import { Component } from '@angular/core';
export class Hero {
    id: number;
    name: string;
}
const HEROES: Hero[] = [
    {id: 11, name: 'Shadow Demon'},
    {id: 12, name: 'Vengeful Spirit'},
    {id: 13, name: 'Windranger'},
    {id: 14, name: 'Witch Doctor'},
    {id: 15, name: 'Lion'},
    {id: 16, name: 'Skywrath Mage'}
];
@Component({
    selector: 'my-app',
    template: '' +
    '<h1>{{title}}</h1>' +
    '<h2>My Heroes</h2>' +
    '<ul class="heroes">' +
    '   <li *ngFor="#Hero of heroes">' +
    '   <span class="badge">{{Hero.id}}</span> {{Hero.name}}' +
    '   </li>' +
    '</ul>' +
    '<h2>{{Hero.name}}</h2>' +
    '<div>' +
    '<label>Номер: </label>{{hero.id}}' +
    '</div>' +
    '<div>' +
    '<label>Имя: </label>' +
    '<input [(ngModel)]="hero.name" placeholder="Имя">' +
    '</div>'
})

export class AppComponent {
    public title = 'Саппорты в доте';
    heroes = HEROES;
}
