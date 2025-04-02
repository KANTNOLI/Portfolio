import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';

import { TestingComponent } from '../testing/testing.component';
@Component({
  selector: 'app-desktop',
  imports: [],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css',
})
export class DesktopComponent {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openWindow(id: number) {
    let desktop = document.querySelector('.desktop');
    let window = document.createElement('div');
    window.classList.add('window');
    
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TestingComponent);
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    
    window.appendChild(componentRef.location.nativeElement);
    desktop?.appendChild(window);
  }


}
