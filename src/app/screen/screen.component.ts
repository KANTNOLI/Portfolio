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
    const screen = this.elementRef.nativeElement.querySelector('.screen');
    const site = this.elementRef.nativeElement.querySelector('.site');

    site.addEventListener('click', () => {
      console.log('CLICK 2');
    });

    this.render.init(screen, site);
  }
}
