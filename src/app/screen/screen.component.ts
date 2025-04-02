import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { RenderService } from '../service/render.service';
import { PanelComponent } from '../panel/panel.component';
import { DesktopComponent } from '../desktop/desktop.component';
@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
  imports: [PanelComponent, DesktopComponent],
}) 
export class ScreenComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef, private render: RenderService) {}

  ngAfterViewInit(): void {
    const screen = this.elementRef.nativeElement.querySelector('.screen');
    const site = this.elementRef.nativeElement.querySelector('.site');

    site.addEventListener('click', (event: MouseEvent) => {
     // console.log(event.target);
    });

    this.render.init(screen, site);
  }
}
