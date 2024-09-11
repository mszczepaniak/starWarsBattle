import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { battleReducer } from './app/store/battle-reducer';
import { BattleEffects } from './app/store/battle-effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideStore({ battle: battleReducer }),
    provideEffects(BattleEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
});
