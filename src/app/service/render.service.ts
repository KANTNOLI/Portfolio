import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

import Engine from 'kgengine/engine';
import Cameras from 'kgengine/cameras';
import OtherScripts from 'kgengine/otherScripts';
import Action from 'kgengine/playerActions';
import Shaders from 'kgengine/shaders';
import Lighting from 'kgengine/lighting';
import { Snippets } from 'kgengine/objects';

@Injectable({ providedIn: 'root' })
export class RenderService {
  // Сцены и рендеры
  private renderGL = Engine.WebGLEngine();
  private renderCSS = Engine.CSS3DEngine();
  private sceneGL = new OtherScripts.CreateScene();
  private sceneCSS = new OtherScripts.CreateScene();

  // Освещение и Камера (С действиями юзера)
  private camera: THREE.PerspectiveCamera = Cameras.DefaultCameraSettings({
    x: 0,
    y: 0,
    z: 14,
  });
  private control = Action.OrbitControl(this.renderGL, this.camera);
  private shadow = Lighting.ShadowCfg(this.sceneGL.scene);
  private drctLight = Lighting.DirectionalLightCfg(
    this.sceneGL.scene,
    {
      x: 2,
      y: 2,
      z: 0,
    },
    { intensity: 2 }
  );

  // Обьекты сцены и Модельки
  private css3Object = Snippets.CreateCSS3(
    this.sceneGL.scene,
    this.sceneCSS.scene,
    { x: 0, y: 0, z: 0 },
    {
      height: 1000,
      width: 1600,
    }
  );
  private cameraHelper = Shaders.CamerasCuttingHelper(
    this.css3Object,
    this.camera,
    this.sceneGL.scene,
    false
  );
  private modelLaptop = new OtherScripts.CreateModel(
    '/default.glb',
    {
      posX: 0,
      posY: 2,
      posZ: 20.98,
      scaleHeight: 1.3,
      scaleLength: 1.3,
      scaleWidth: 1.3,
      rotateX: 25,
    },
    {}
  );

  constructor(private ngZone: NgZone) {}

  // Сборка проекта
  init(container: HTMLElement, site: HTMLElement): void {
    this.initScene(container);
    this.initScreen(site);

    this.startAnimation();
    this.rerenderModels();
  }

  private initScreen(site: HTMLElement) {
    // Подставляем свой обьект HTML с стилями
    site.style.width = this.css3Object.HTMLElement.element.style.width;
    site.style.height = this.css3Object.HTMLElement.element.style.height;

    //this.css3Object.HTMLElement.element = site;
    this.css3Object.HTMLElement.element.innerHTML = '';
    this.css3Object.HTMLElement.element.appendChild(site);

    window.addEventListener('keyup', (event) => {
      this.toggleMode(event);
    });

    this.renderCSS.domElement.addEventListener('click', (event) => {
      let click = Action.TrackingClickItems(
        this.sceneGL.scene,
        this.camera,
        event
      );

      click.map((click) => {
        console.log(click.object.userData);
      });
    });
  }

  private toggleMode(event: KeyboardEvent) {
    console.log(event.key);
    // переключение правления HTML и 3D
    switch (event.key.toLowerCase()) {
      case 'q':
        this.renderGL.domElement.style.pointerEvents = 'auto';
        this.renderGL.domElement.style.touchAction = 'auto';
        break;
      case 'e':
        this.renderGL.domElement.style.pointerEvents = 'none';
        this.renderGL.domElement.style.touchAction = 'none';
        break;
      case 'у':
        this.renderGL.domElement.style.pointerEvents = 'none';
        this.renderGL.domElement.style.touchAction = 'none';
        break;
      case 'й':
        this.renderGL.domElement.style.pointerEvents = 'auto';
        this.renderGL.domElement.style.touchAction = 'auto';
        break;
    }
  }

  // Добавляем сцену и делаем дефолтные настройки
  private initScene(container: HTMLElement) {
    this.sceneGL.scene.background = null; // Очистка фона у WebGL сцены - Object3D
    //this.renderGL.localClippingEnabled = true;

    this.renderGL.setClearColor(0x000000, 0); // Очистка фона у WebGL рендера canvas- Object3D
    this.renderCSS.domElement.style.backgroundColor = 'gray'; // Делаем фон для сцены любого цвета поддерживаемого CSS
    this.renderCSS.domElement.appendChild(this.renderGL.domElement); // Накладываем 3Д обьекты на HTML для перерисовки
    container.appendChild(this.renderCSS.domElement); // Добавляем рендер на сайт

    this.sceneGL.addScene([this.shadow, this.drctLight]); // Работа с светом
  }

  // работа с моделями
  private rerenderModels() {
    // Добавляем шейдеры
    this.modelLaptop.shaderCreate(this.cameraHelper);
    this.modelLaptop.addToScene(this.sceneGL.scene);

    this.sceneGL.scene.remove(this.sceneGL.scene.children[2]); // удаление фантома

    // После загрузки модельки делаем что хотим
    this.modelLaptop.customEdit((model) => {
      //console.log(model);
      this.drctLight.lookAt(model.position);
    });

    this.modelLaptop.setNodeParam((node) => {
      node.userData = {
        TMF: true,
      };
    });

    // Рендеринг шейдеров со своей скоростью
    setInterval(() => {
      this.cameraHelper = Shaders.UpdateCamCutHelper(
        this.cameraHelper.object,
        this.css3Object,
        this.camera,
        this.sceneGL.scene,
        false,
        50
      );

      this.modelLaptop.shaderUpdate(this.cameraHelper.Coords);
    }, 1);
  }

  // Анимация перевызова дефолтного THREE
  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        //Обычная анимайия как в threejs
        requestAnimationFrame(animate);

        this.renderCSS.render(this.sceneCSS.scene, this.camera);
        this.renderGL.render(this.sceneGL.scene, this.camera);
        this.control.update();
      };
      animate();
    });
  }
}
