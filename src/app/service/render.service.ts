import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })

export class RenderService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private cube: THREE.Mesh | null = null;
  private animationId: number | null = null;

  constructor(private ngZone: NgZone) {}

  init(container: HTMLElement): void {
    if (this.scene) return; // Если сцена уже есть — выходим

    // 1. Создаем сцену
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // 2. Настраиваем камеру
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // 3. Создаем рендерер и добавляем в DOM
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 4. Создаем 3D-объекты
    this.createCube();

    // 5. Запускаем анимацию
    this.startAnimation();
  }

  private createCube(): void {
    if (!this.scene) return;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: false,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        if (this.cube) {
          this.cube.rotation.x += 0.01;
          this.cube.rotation.y += 0.01;
        }
        this.renderer?.render(this.scene!, this.camera!);
      };
      animate();
    });
  }

  cleanup(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      const canvas = this.renderer.domElement;
      canvas.parentNode?.removeChild(canvas);
    }
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
  }
}
