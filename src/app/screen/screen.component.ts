import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { RenderService } from '../service/render.service';
@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
})
export class ScreenComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef, private render: RenderService) {}

  ngAfterViewInit(): void {
    const container =
      this.elementRef.nativeElement.querySelector('.cube-container');
    if (container) {
      this.render.init(container);
    }
  }
}
