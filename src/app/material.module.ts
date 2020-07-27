import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatTabsModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatExpansionModule,
  MatSelectModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class MaterialModule {}