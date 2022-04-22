import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { fromEvent, interval } from "rxjs";
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton?: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput?: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges.pipe(
      mergeMap((changes) => this.saveCourse(changes))
    );
  }

  ngAfterViewInit() {
    const obs$ = fromEvent(this.saveButton.nativeElement, "click")
      .pipe(
        exhaustMap(() => this.saveCourse(this.form.value)),
        tap((e) => console.log(e))
      )
      .subscribe();

    const interval$ = interval(1000);

    interval$.pipe(switchMap(() => this.saveCourse(this.form.value)));
  }

  close() {
    this.dialogRef.close();
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }
}
