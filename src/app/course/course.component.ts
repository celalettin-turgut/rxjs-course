import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import {
  merge,
  fromEvent,
  Observable,
  concat,
  pipe,
  combineLatest,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId;
  course$?: Observable<Course>;
  lessons$?: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input?: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    this.course$ = <Observable<Course>>(
      createHttpObservable(`api/courses/${this.courseId}`)
    );
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }

  ngAfterViewInit() {
    // const searchLessons$ = fromEvent<any>(
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      startWith(""),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((searchTerm) => this.loadLessons(searchTerm))
    );

    // const initialLessons$ = this.loadLessons();
    //this.lessons$ = concat(initialLessons$, searchLessons$);

    // this.lessons$ = concat(
    //   initialLessons$.pipe(
    //     tap((res) =>
    //       res.forEach((x) =>
    //         console.log("Initial Lesson Result:-->" + x.description)
    //       )
    //     )
    //   ),
    //   searchLessons$.pipe(
    //     tap((res) =>
    //       res.forEach((x) => console.log("search result: -->" + x.description))
    //     )
    //   )
    // ).pipe(
    //   tap((res) =>
    //     res.forEach((x) => console.log("Concat Result:-->" + x.description))
    //   )
    // );
  }
}
