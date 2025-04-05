import { Component } from '@angular/core';
import { RenderService } from '../service/render.service';

@Component({
  selector: 'app-window',
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
})
export class WindowComponent {
  // Тип треккер
  private trackType: number = 0;
  private funcLink!: (event: MouseEvent) => any;
  // 0 off
  // 1 drag
  // 2 resizeT
  // 3 resizeB
  // 4 resizeR
  // 5 resizeL

  // Положение мышки при клике
  private AnalX: number = 0;
  private AnalY: number = 0;

  // Размеры screen HTML главного обьекта, передаем статикой ибо мне похуй я заебался блять с этими 3д хуями
  private width: number = 1600;
  private height: number = 1000;

  // HTML компоненты
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
    // Получение HTML компонентов для работы winHeader
    this.screen = document.querySelector('.screen'); // Главный экран весь
    this.desktop = document.querySelector('.desktop'); // Рабочий стол конкретно
    this.windowComp = document.querySelector('.window'); // Окно
    this.winHeader = document.querySelector('.winHeader'); // Шторка Окна
    this.siteT = document.querySelector('.sideT'); // сторона Окна
    this.siteB = document.querySelector('.sideB'); // сторона Окна
    this.siteL = document.querySelector('.sideL'); // сторона Окна
    this.siteR = document.querySelector('.sideR'); // сторона Окна

    this.dragWindowToggleActive();

    console.log(this.siteT);
  }

  dragWindowMove() {
    let desktopSizes = this.desktop?.getBoundingClientRect();
    let windowSizes = this.windowComp?.getBoundingClientRect();
    console.log(windowSizes);

    this.funcLink = (event: MouseEvent) => {
      if (
        this.trackType === 1 &&
        this.windowComp &&
        desktopSizes &&
        windowSizes
      ) {
        let WRelativityOpposite =
          this.normalize(this.AnalX, desktopSizes.left, desktopSizes.width) *
          this.width;
        let HRelativityOpposite =
          this.normalize(this.AnalY, desktopSizes.top, desktopSizes.height) *
          this.height;

        let WRelativity =
          this.normalize(event.clientX, desktopSizes.left, desktopSizes.width) *
          this.width;
        let HRelativity =
          this.normalize(event.clientY, desktopSizes.top, desktopSizes.height) *
          this.height;

        let WWinRelativity =
          this.normalize(
            windowSizes.left,
            desktopSizes.left,
            windowSizes.width
          ) *
          this.width *
          0.5;
        let HWinRelativity =
          this.normalize(
            windowSizes.top,
            desktopSizes.top,
            windowSizes.height
          ) *
          this.height *
          0.5;

        this.windowComp.style.left = `${
          WRelativity - WRelativityOpposite + WWinRelativity
        }px`;
        this.windowComp.style.top = `${
          HRelativity - HRelativityOpposite + HWinRelativity
        }px`;
      }
    };

    if (this.funcLink) {
      this.desktop?.addEventListener('mousemove', this.funcLink);
    }
  }

  normalize(value: number, offset: number, size: number): number {
    return (value - offset) / size;
  }

  dragWindowToggleActive() {
    if (this.winHeader) {
      this.winHeader.addEventListener('mousedown', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;

        this.trackType = 1;
        this.dragWindowMove();
        console.log('mousedown');
      });

      this.winHeader.addEventListener('mouseup', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;
        this.trackType = 0;
        console.log('mouseup');
        this.desktop?.removeEventListener('mousemove', this.funcLink);
      });
    }
  }
}
