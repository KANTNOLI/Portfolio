import { Component } from '@angular/core';

type Side = {
  elRef: HTMLElement | null;
  roolsX: string | null;
  roolsY: string | null;
}

@Component({
  selector: 'app-window',
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.css'
})
export class WindowComponent {

  private ActiveSize: Side = {
    elRef: null,
    roolsX: null,
    roolsY: null
  }

  ngAfterContentInit() {
    let screen: HTMLElement | null = document.querySelector(".screen")
    let window: HTMLElement | null = document.querySelector(".window")
    let siteT: HTMLElement | null = document.querySelector(".sideT")

    if (window && siteT && screen) {
      siteT.addEventListener("mousedown", (event: MouseEvent) => {
        this.ActiveSize = {
          elRef: siteT,
          roolsX: "",
          roolsY: ""
        }
      })

      console.log(screen);

      screen.addEventListener("mousemove", (event: MouseEvent) => {
        if (window && this.ActiveSize.elRef) {

          window.style.top = `${event.clientY}px`
          console.log(event.movementX, event.movementY);
        }

      })

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


    // document.querySelector(".sideR")
    //   ?.addEventListener("click", () => {
    //     console.log("click");

    //   })
    // document.querySelector(".sideL")
    //   ?.addEventListener("click", () => {
    //     console.log("click");

    //   })
    // document.querySelector(".sideB")
    //   ?.addEventListener("click", () => {
    //     console.log("click");

    //   })

    console.log(document.querySelector(".window"));


  }
}
