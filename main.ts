import { platformBrowserDynamic } from './project/node_modules/@angular/platform-browser-dynamic';
import { AppModule } from './project/src/app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
