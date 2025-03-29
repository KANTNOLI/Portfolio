import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

import Engine from 'kgengine/engine';
import Cameras from 'kgengine/cameras';
import OtherScripts from 'kgengine/otherScripts';
import Action from 'kgengine/playerActions';
import Shaders from 'kgengine/shaders';
import Lighting from 'kgengine/lighting';
import { Snippets } from 'kgengine/objects';

interface Mapping {
  map: any;
}
@Injectable({ providedIn: 'root' })
export class RenderService {
  // Сцены и рендеры
  private renderGL = Engine.WebGLEngine();
  private renderCSS = Engine.CSS3DEngine();
  private sceneGL = new OtherScripts.CreateScene();
  private sceneCSS = new OtherScripts.CreateScene();

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

  private camera: THREE.PerspectiveCamera = Cameras.DefaultCameraSettings({
    x: 0,
    y: 0,
    z: 5,
  });

  private css3Object = Snippets.CreateCSS3(
    this.sceneGL.scene,
    this.sceneCSS.scene,
    { x: 0, y: 0, z: 0 },
    {
      height: 50,
      width: 50,
    }
  );
  private cameraHelper = Shaders.CamerasCuttingHelper(
    this.css3Object,
    this.camera,
    this.sceneGL.scene
  );
  private modelLaptop = new OtherScripts.CreateModel(
    '/default.glb',
    {
      posX: 0,
      posY: 0,
      posZ: 0,
      scaleHeight: 0.2,
      scaleLength: 0.2,
      scaleWidth: 0.2,
    },
    {}
  );

  private control = Action.OrbitControl(this.renderGL, this.camera);

  constructor(private ngZone: NgZone) {}

  // Бизнес логика всего проекта
  init(container: HTMLElement): void {
    // Констант настройки
    this.sceneGL.scene.background = null; // Очистка фона у WebGL - Object3D
    this.renderGL.localClippingEnabled = true;
    this.renderGL.setClearColor(0x000000, 0); // Очистка фона у WebGL - Object3D
    this.renderCSS.domElement.style.backgroundColor = 'gray'; // Делаем фон для сцены любого цвета поддерживаемого CSS
    this.renderCSS.domElement.appendChild(this.renderGL.domElement); // Накладываем 3Д обьекты на HTML для перерисовки
    container.appendChild(this.renderCSS.domElement); // Добавляем рендер на сайт

    this.sceneGL.addScene([this.shadow, this.drctLight]); // Работа с светом

    //model

    this.modelLaptop.setNodeParam((node) => {
      const originalMaterial = node.material as Mapping;

      console.log(node.material);
      let ShaderMaterial = Shaders.CuttingCustomBox({
        CoordLB: this.cameraHelper.Coords.CoordLB,
        CoordLT: this.cameraHelper.Coords.CoordLT,
        CoordRB: this.cameraHelper.Coords.CoordRB,
        CoordRT: this.cameraHelper.Coords.CoordRT,
        depth: this.cameraHelper.Coords.depth,
        startZ: this.cameraHelper.Coords.startZ,
        endZ: this.cameraHelper.Coords.endZ,
        positionWorld: this.cameraHelper.Coords.positionWorld,
        texture: originalMaterial.map,
        matrix: node.matrixWorld,
      });

      node.material = ShaderMaterial;
    });

    this.modelLaptop.addToScene(this.sceneGL.scene);

    this.modelLaptop.customEdit((model) => {
      console.log(model);
      this.drctLight.lookAt(model.position);
    });

    //ads

    this.startAnimation();
  }

  // Анимация перевызова дефолтного THREE
  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        this.cameraHelper = Shaders.UpdateCamCutHelper(
          this.cameraHelper.object,
          this.css3Object,
          this.camera,
          this.sceneGL.scene,
          true,
          50
        );

        this.modelLaptop.shaderUpdate(this.cameraHelper.Coords);

        this.renderCSS.render(this.sceneCSS.scene, this.camera);
        this.renderGL.render(this.sceneGL.scene, this.camera);
        this.control.update();
      };
      animate();
    });
  }
}
