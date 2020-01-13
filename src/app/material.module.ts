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
  MatListModule
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
    MatListModule
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
    MatListModule
  ]
})
export class MaterialModule {}