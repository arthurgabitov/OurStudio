import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule}     from '@angular/forms';
import { AppComponent }   from './app.component';
import {DraggableModule} from 'ng2-draggable/src';
@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        DraggableModule
    ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }