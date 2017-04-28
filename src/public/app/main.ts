import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();

console.log(`Running uomi on the ${process.env.TARGET} target.`);
if(process.env.TARGET === 'production') {
	enableProdMode();
}

platform.bootstrapModule(AppModule);
