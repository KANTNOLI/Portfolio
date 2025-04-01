import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-desktop',
  imports: [],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent {
  
  constructor(private elementRef: ElementRef) {}
  
  // ngAfterViewInit(): void {
  //   const icon = this.elementRef.nativeElement.querySelector('.icon');

  //   icon.addEventListener('click', (event: MouseEvent) => {
  //     console.log(21);
  //   });
    
  // }

}
