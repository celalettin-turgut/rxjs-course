import { Component, OnInit } from "@angular/core";
import { concat, interval, of } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const source1$ = of(1, 3, 4);
    const source2$ = interval(1000);

    const concat$ = concat(source1$, source2$);
  }

  onClick() {}
}
