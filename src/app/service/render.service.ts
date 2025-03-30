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

  private camera: THREE.PerspectiveCamera = Cameras.DefaultCameraSettings({
    x: 0,
    y: 0,
    z: 14,
  });

  // Освещение
  private shadow = Lighting.ShadowCfg(this.sceneGL.scene);
  private drctLight = Lighting.DirectionalLightCfg(
    this.sceneGL.scene,
    {
      x: 2,
      y: 2,
      z: 0,
    },
    { intensity: 2 },
    {
      bias: -0.0005,
    }
  );

  // HTML обьекты
  private css3Object = Snippets.CreateCSS3(
    this.sceneGL.scene,
    this.sceneCSS.scene,
    { x: 0, y: 0, z: 0 },
    {
      height: 1000,
      width: 1565,
    }
  );
  private cameraHelper = Shaders.CamerasCuttingHelper(
    this.css3Object,
    this.camera,
    this.sceneGL.scene,
    false
  );

  // Модели
  private modelLaptop = new OtherScripts.CreateModel(
    '/default.glb',
    {
      posX: 0,
      posY: 2,
      posZ: 21,
      scaleHeight: 1.3,
      scaleLength: 1.3,
      scaleWidth: 1.3,
      rotateX: 25,
    },
    {}
  );

  private control = Action.OrbitControl(this.renderGL, this.camera);

  constructor(private ngZone: NgZone) {}

  // Бизнес логика всего проекта
  init(container: HTMLElement, site: HTMLElement): void {
    // Констант настройки
    this.sceneGL.scene.background = null; // Очистка фона у WebGL - Object3D
    this.renderGL.localClippingEnabled = true;

    this.renderGL.setClearColor(0x000000, 0); // Очистка фона у WebGL - Object3D
    this.renderCSS.domElement.style.backgroundColor = 'gray'; // Делаем фон для сцены любого цвета поддерживаемого CSS
    this.renderCSS.domElement.appendChild(this.renderGL.domElement); // Накладываем 3Д обьекты на HTML для перерисовки
    container.appendChild(this.renderCSS.domElement); // Добавляем рендер на сайт

   //this.renderGL.domElement.style.pointerEvents = 'none';
   //this.renderGL.domElement.style.touchAction = 'none';

    this.sceneGL.addScene([this.shadow, this.drctLight]); // Работа с светом

    this.sceneGL.scene.remove(this.sceneGL.scene.children[2]);

    //console.log(this.sceneCSS.scene.children[0]);
    //container.appendChild(this.css3Object.HTMLElement.element);

    this.css3Object.HTMLElement.element.append(site);
    this.css3Object.HTMLElement.element.addEventListener('click', () => {
      console.log('CLICK');
    });
    this.renderCSS.domElement.addEventListener('click', (event) => {
      let test = Action.TrackingClickItems(
        this.sceneGL.scene,
        this.camera,
        event
      );
      console.log(test[0]);
      console.log(123);
    });
    // this.css3Object.HTMLElement.element.style.removeProperty;
    // this.css3Object.HTMLElement.element.style.backgroundColor = '';
    // this.css3Object.HTMLElement.element.classList.add('site');
    //ads

    this.startAnimation();
    this.rerenderModels();
  }

  private rerenderModels() {
    this.modelLaptop.shaderCreate(this.cameraHelper);
    this.modelLaptop.addToScene(this.sceneGL.scene);

    this.modelLaptop.customEdit((model) => {
      console.log(model);
      this.drctLight.lookAt(model.position);
    });

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
        requestAnimationFrame(animate);

        this.renderCSS.render(this.sceneCSS.scene, this.camera);
        this.renderGL.render(this.sceneGL.scene, this.camera);
        this.control.update();
      };
      animate();
    });
  }
}
