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

  openWindow() {
    const desktop = document.querySelector('.desktop');

    const windowHTML = `
      <div class="window">
        <div class="winHeader">
          <p class="winHeaderTitle">Google Paint</p>
          <img src="/winMinimize.png" alt="winMinimize" class="winHeadeImg" />
          <img src="/winRestore.png" alt="winRestore" class="winHeadeImg" />
          <img src="/winClose.png" alt="winClose" class="winHeadeImg2" />
        </div>
        <div class="winBody"></div>
      </div>

    `;

    if (desktop) {
      desktop.innerHTML = desktop.innerHTML + windowHTML;

      // 3. Находим winBody и вставляем компонент
      const winBody = desktop.querySelector('.winBody:last-child');

      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(TestingComponent);
      const componentRef =
        this.viewContainerRef.createComponent(componentFactory);

      if (winBody) {
        winBody.appendChild(componentRef.location.nativeElement);
      }
    }
    // 2. Добавляем окно в desktop
  }
}
