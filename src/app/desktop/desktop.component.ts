import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';



import { TestingComponent } from '../testing/testing.component';
import { WindowComponent } from '../window/window.component';
@Component({
  selector: 'app-desktop',
  imports: [WindowComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css',
})
export class DesktopComponent {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  openWindow() {
    const desktop = document.querySelector('.desktop');


    if (desktop) {
      desktop.innerHTML = desktop.innerHTML;

      const WindowFactory =
        this.componentFactoryResolver.resolveComponentFactory(WindowComponent); // создаем комп по переданому типу
      const WindowRef =
        this.viewContainerRef.createComponent(WindowFactory); // создаем ссылку на обьект

      desktop.appendChild(WindowRef.location.nativeElement); // вкладываем куда нужно

      const winBody = desktop.querySelector('.winBody'); // вкладываем в body


      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(TestingComponent); // создаем комп по переданому типу
      const componentRef =
        this.viewContainerRef.createComponent(componentFactory); // создаем ссылку на обьект
      if (winBody) {
        console.log(123);
        
        winBody.appendChild(componentRef.location.nativeElement); // вкладываем куда нужно
      }
    }
  }
}

let a = document.querySelector(".desktop")
if (a) {
  console.log(a);

  a.innerHTML = "asddasdas"
}