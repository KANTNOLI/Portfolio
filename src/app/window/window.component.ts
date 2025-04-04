import { Component } from '@angular/core';
import { RenderService } from '../service/render.service';

@Component({
  selector: 'app-window',
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
})
export class WindowComponent {
  private trackFlag: boolean = false;

  private AnalX: number = 0;
  private AnalY: number = 0;

  private screen: HTMLElement | null = null;
  private desktop: HTMLElement | null = null;
  private windowComp: HTMLElement | null = null;
  private winHeader: HTMLElement | null = null;
  private siteT: HTMLElement | null = null;
  private siteB: HTMLElement | null = null;
  private siteL: HTMLElement | null = null;
  private siteR: HTMLElement | null = null;

  constructor(private renderService: RenderService) {}

  ngAfterContentInit() {
    // Размеры screen HTML главного обьекта, передаем статикой ибо мне похуй я заебался блять с этими 3д хуями
    const width = 1600;
    const height = 1000;

    // Получение HTML компонентов для работы winHeader
    this.screen = document.querySelector('.screen'); // Главный экран весь
    this.desktop = document.querySelector('.desktop'); // Рабочий стол конкретно
    this.windowComp = document.querySelector('.window'); // Окно
    this.winHeader = document.querySelector('.winHeader'); // Шторка Окна
    this.siteT = document.querySelector('.sideT'); // сторона Окна
    this.siteB = document.querySelector('.sideB'); // сторона Окна
    this.siteL = document.querySelector('.sideL'); // сторона Окна
    this.siteR = document.querySelector('.sideR'); // сторона Окна

    // Получение ширину окна относительно сцены без погрешностей (Т.к. 1600 -> rand)
    let desktopSizes = this.desktop?.getBoundingClientRect();

    this.siteT?.addEventListener('mousedown', (event: MouseEvent) => {
      this.AnalY = event.clientY;
      this.AnalX = event.clientX;

      console.log(event.clientX, event.clientY);

      this.trackFlag = true;
    });

    console.log(this.siteT);

    if (this.trackFlag && this.desktop) {
      this.desktop.addEventListener('mousemove', (event: MouseEvent) => {
        if (this.windowComp && desktopSizes) {
          let WRelativityOpposite =
            (this.AnalX - desktopSizes.left) / desktopSizes.width;
          let HRelativityOpposite =
            (this.AnalY - desktopSizes.top) / desktopSizes.height;

          let HRelativity =
            (event.clientY - desktopSizes.top) / desktopSizes.height;
          let WRelativity =
            (event.clientX - desktopSizes.left) / desktopSizes.width;

          this.windowComp.style.top = `${
            HRelativity * height - HRelativityOpposite * height
          }px`;
          this.windowComp.style.left = `${
            WRelativity * width - WRelativityOpposite * width
          }px`;
        }
      });
    }
  }
}
