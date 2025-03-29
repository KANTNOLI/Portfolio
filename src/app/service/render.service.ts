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
  private renderGL = Engine.WebGLEngine();
  private renderCSS = Engine.CSS3DEngine();
  private sceneGL = new OtherScripts.CreateScene();
  private sceneCSS = new OtherScripts.CreateScene();

  private camera: THREE.PerspectiveCamera = Cameras.DefaultCameraSettings();
  private cube: THREE.Mesh | null = null;

  constructor(private ngZone: NgZone) {}

  init(container: HTMLElement): void {
    if (this.sceneGL.scene) console.log('scene test');
    this.sceneGL.scene.background = null;
    this.camera.position.z = 5;

    this.renderCSS.domElement.appendChild(this.renderGL.domElement);
    // 3. Создаем рендерер и добавляем в DOM
    container.appendChild(this.renderCSS.domElement);

    // 4. Создаем 3D-объекты
    this.createCube();

    // 5. Запускаем анимацию
    this.startAnimation();
  }

  private createCube(): void {
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   wireframe: false,
    // });
    // this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(this.cube);
  }

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        if (this.cube) {
          this.cube.rotation.x += 0.01;
          this.cube.rotation.y += 0.01;
        }
        this.renderCSS?.render(this.sceneCSS.scene!, this.camera!);
        this.renderGL?.render(this.sceneGL.scene!, this.camera!);
      };
      animate();
    });
  }
}
