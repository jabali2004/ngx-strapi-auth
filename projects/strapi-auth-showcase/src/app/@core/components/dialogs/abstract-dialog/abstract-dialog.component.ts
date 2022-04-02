import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-abstract-dialog',
  template: '',
})
export class AbstractDialogComponent implements OnInit {
  constructor(protected dialogRef: NbDialogRef<any>) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }
}
