import { importProvidersFrom, ApplicationConfig } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(OverlayModule, DialogModule),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-PT' },
  ],
};
