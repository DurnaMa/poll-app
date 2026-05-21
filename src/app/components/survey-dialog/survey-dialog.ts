import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-survey-dialog',
  imports: [
    MatButton,
    MatFormField,
    MatCheckbox,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatHint,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyDialog {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() {}
}
