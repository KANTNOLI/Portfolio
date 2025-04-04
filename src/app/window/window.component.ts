import { Component } from '@angular/core';
import { RenderService } from '../service/render.service';

type Side = {
  elRef: HTMLElement | null;
  roolsX: string | null;
  roolsY: string | null;
};

@Component({
  selector: 'app-window',
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
})
export class WindowComponent {
  private ActiveSize: Side = {
    elRef: null,
    roolsX: null,
    roolsY: null,
  };

  private AnalX: number = 0;
  private AnalY: number = 0;

  constructor(private renderService: RenderService) {}

  ngAfterContentInit() {
    let desktop: HTMLElement | null = document.querySelector('.desktop');
    let screen: HTMLElement | null = document.querySelector('.screen');
    let windowComp: HTMLElement | null = document.querySelector('.window');
    let siteT: HTMLElement | null = document.querySelector('.sideT');

    const height = 1000;
    const width = 1600;
    let desktopSizes = desktop?.getBoundingClientRect();

    if (windowComp && siteT && screen && desktop) {
      siteT.addEventListener('mousedown', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;

        console.log(event.clientX, event.clientY);

        this.ActiveSize = {
          elRef: siteT,
          roolsX: '',
          roolsY: '',
        };
      });

      desktop.addEventListener('mousemove', (event: MouseEvent) => {
        if (windowComp && this.ActiveSize.elRef && desktopSizes) {
          console.log(this.AnalX - desktopSizes.left);

          let HRelativity =
            (event.clientY - desktopSizes.top) / desktopSizes.height;
          let WRelativity =
            (event.clientX - desktopSizes.left) / desktopSizes.width;

          console.log(event.clientY, this.AnalY);
          windowComp.style.top = `${HRelativity * height}px`;
          windowComp.style.left = `${
            WRelativity * width - (this.AnalX - desktopSizes.left) / desktopSizes.width
          }px`;
        }
      });

      // document.querySelector(".sideT")
      //   ?.addEventListener("mouseup", (event) => {

      //     console.log("click");

      //   })

      // siteT?.addEventListener("mousemove", (event: MouseEventInit) => {

      //   if (window && event.clientY && event.movementY) {
      //     window.style.top = `${event.clientY + event.movementY - 30}px`;
      //   }

      //   console.log(event.clientX, event.clientY);
      //   // console.log(window.x);

      //   console.log("click");

      // })
    }
  }
}
