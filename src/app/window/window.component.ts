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
  // 0 off  +
  // 1 drag +
  // 2 resizeT
  // 3 resizeB +
  // 4 resizeR +
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

  normalize(value: number, offset: number, size: number): number {
    // координата изменения - коор относительно чего - разрешение
    return (value - offset) / size;
  }

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

    this.dragWinToggle();
    this.resizeWinToggle();
  }

  dragWinMove() {
    let desktopSizes = this.desktop?.getBoundingClientRect();
    let windowSizes = this.windowComp?.getBoundingClientRect();

    this.funcLink = (event: MouseEvent) => {
      if (
        this.trackType === 1 &&
        this.windowComp &&
        desktopSizes &&
        windowSizes
      ) {
        // Против... для распл окна
        let WRelativityOpposite =
          this.normalize(this.AnalX, desktopSizes.left, desktopSizes.width) *
          this.width;
        let HRelativityOpposite =
          this.normalize(this.AnalY, desktopSizes.top, desktopSizes.height) *
          this.height;

        // Расположение относительно сцены
        let WRelativity =
          this.normalize(
            event.clientX + 2,
            desktopSizes.left,
            desktopSizes.width
          ) * this.width;
        let HRelativity =
          this.normalize(event.clientY, desktopSizes.top, desktopSizes.height) *
          this.height;

        // Расположение указателя относительно шапки
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

    this.desktop?.addEventListener('mousemove', this.funcLink);
  }

  dragWinToggle() {
    if (this.winHeader) {
      this.winHeader.addEventListener('mousedown', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;

        this.trackType = 1;
        this.dragWinMove();
      });

      this.winHeader.addEventListener('mouseup', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;
        this.trackType = 0;
        this.desktop?.removeEventListener('mousemove', this.funcLink);
      });
    }
  }

  resizeWinMove() {
    let desktopSizes = this.desktop?.getBoundingClientRect();
    let windowSizes = this.windowComp?.getBoundingClientRect();

    this.funcLink = (event: MouseEvent) => {
      if (this.windowComp && desktopSizes && windowSizes) {
        this.AnalX = event.clientX;

        this.windowComp.style.width = `${
          this.normalize(
            event.clientX + 2,
            windowSizes.left,
            desktopSizes.width
          ) *
            this.width -
          5
        }px`;
      }
    };

    this.desktop?.addEventListener('mousemove', this.funcLink);
  }

  resizeWinToggle() {
    if (this.siteR && this.windowComp) {
      this.siteR.addEventListener('mousedown', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;
        this.trackType = 4;
        console.log('mousedown siteR');

        this.resizeWinMove();
      });

      this.windowComp.addEventListener('mouseup', (event: MouseEvent) => {
        this.AnalY = event.clientY;
        this.AnalX = event.clientX;
        this.trackType = 0;
        console.log('mouseup siteR');
        this.desktop?.removeEventListener('mousemove', this.funcLink);
      });
    }
  }
}
