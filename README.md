# NgxStrapiAuth

[![build pipeline](https://github.com/jabali2004/ngx-strapi-auth/actions/workflows/build.yml/badge.svg)](https://github.com/jabali2004/ngx-strapi-auth/actions/workflows/build.yml)

> NgxStrapiAuth is a Angular library that implements all standard operations like logging in or registering a user for the headless CMS Strapi.

Services and guards are provided, as well as ready-made components.

The goal of this project is to implement standard functionalities so that a developer does not have to deal with these tasks unnecessarily.

## Features

Currently implemented functionalities:

* login / logout user
* register new user
* update user
* reset / request password reset
* authenticating requests using interceptor
* auth guard / token guard
* ready to use routing module
* translation using [ngx-translate](https://github.com/ngx-translate/core)  
* authentifikation providers
  * google
  * github
  * microsoft
  * facebook
  * twitter

Finished Angular components:

* login
* logout
* register
* request password
* reset password
* profile (update password or user info)

## Upcoming Features

Currently planned functionalities:

* add more auth providers
* finish and enhance auth interceptor
* add multiple styling options
* making components more dynamic
* add better error handling for services / components

## Installation / Integration

> NgxStrapiAuth uses Nebular, NgBootstrap for components and styling, and NgxTranslate for implementing multilingualism.

### Requirements

> The use of NodeJS v14 is highly recommended.

Minimum requirements:

* NodeJS v14
* Angular 11.1.1
* Strapi 3.4.0

### Install and set up NgxTranslate

<!-- TODO: Improve installation / integration documentation -->

For more information look at the official [documentation](https://github.com/ngx-translate/core).

Install ngx-translate:

```` bash
npm install @ngx-translate/core @ngx-translate/http-loader  --save
````

Integrate ngx-translate in app.module.ts:

```` typescript
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import {
  HttpClientModule,
  HttpClient,
} from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';


registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
      { provide: LOCALE_ID, useValue: 'de-DE' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
````

### Install Nebular and NgBootstrap

Nebular [(docs)](https://akveo.github.io/nebular/docs) :

```` bash
ng add @nebular/theme
````

NgBootstrap [(docs)](https://ng-bootstrap.github.io/#/home) :

```` bash
ng add @ng-bootstrap/ng-bootstrap
````

### Install ngx-strapi-auth

Install npm package:

```` bash
npm install --save ngx-strapi-auth
````

Register StrapiAuthModule in app.module:

```` typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    StrapiAuthModule.forRoot({
      strapi_base_url: 'http://localhost:1337', // environment.API_BASE_PATH
      auth_providers: ['github'], // github , microsoft , ....
      routes: { // override some default routing paths
        login: '/auth/login',
        register: '/auth/register',
        logoutRedirect: '/'
      }
    }),
  ],
    providers: [
    { // register AuthInterceptor
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {
    // Load all translations used in StrapiAuthModule
    this.authService.setDefaultTranslation(this.translate);
  }
}
````

Add routes for authentifikation and user handling to routing module:

app.routing.module (example)
```` typescript
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  }
````

Routes registered in StrapiAuthRoutingModule:

```` typescript
const routes: Routes = [
  {
    path: '',
    component: AuthComponentsComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'providers',
        canActivateChild: [TokenGuard],
        children: [
          {
            path: 'github'
          },
          {
            path: 'google'
          },
          {
            path: 'microsoft'
          }
        ]
      }
    ]
  }
];
````

Create AuthModule:

```` bash
ng g m Auth
````

Import StrapiAuthRoutingModule in auth.module:

```` typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, StrapiAuthRoutingModule } from 'ngx-strapi-auth';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
declarations: [],
imports: [CommonModule, StrapiAuthRoutingModule], // Import StrapiAuthRoutingModule
})
export class AuthModule {}
````

Activate user handling in app.component:

```` typescript
  constructor(private authService: AuthService) {}

  // Load user data if user is authenticated
  ngOnInit(): void {
    if (this.authService.isAuthenticated && !this.authService.getUser()) {
      this.authService.loadUser();
    }

    this.authService.AuthState.subscribe(() => {
      if (this.authService.isAuthenticated && !this.authService.getUser()) {
        this.authService.loadUser();
      }
    });
  }
````

Add proxy for developing:

proxy.conf.json

```` json
{
  "/api/*": {
    "target": "http://localhost:1337",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
````

Activate proxy in angular.json:

```` json
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "NgStrapiAuthTest:build",
      "proxyConfig": "src/proxy.conf.json"
    },
    "configurations": {
      "production": {
        "browserTarget": "NgStrapiAuthTest:build:production"
      }
    }
  },
````

### Override default components

The already implemented Angular components can be manually overridden by creating a custom component and extending it with a pre-implemented component.

```` typescript
export class ProfileComponent extends StrapiProfileComponent implements OnInit {}
````

## Project structure

```` bash
└── projects
    ├── strapi-auth library # library project
    │   └── src
    │       └── lib
    │           ├── components # pre-implemented components
    │           │   ├── auth-components
    │           │   │   ├── auth-block
    │           │   │   ├── login
    │           │   │   ├── logout
    │           │   │   ├── register
    │           │   │   ├── request-password
    │           │   │   └── reset-password
    │           │   └── profile
    │           ├── guards # auth and token guard
    │           ├── i18n # language files
    │           ├── interceptors
    │           ├── routing
    │           ├── services
    │           ├── styles
    │           └── types # interfaces and classes
    └── strapi-auth-showcase # test and showcase project
        ├── src
        │   ├── app
        │   │   ├── @core # core components
        │   │   │   ├── components
        │   │   │   ├── services
        │   │   │   └── utils
        │   │   ├── @theme # theme using nebular
        │   │   │   ├── components
        │   │   │   ├── directives
        │   │   │   ├── layouts
        │   │   │   ├── pipes
        │   │   │   └── styles
        │   │   └── pages # pages
        │   │       ├── auth
        │   │       ├── home
        │   │       └── miscellaneous
        │   │           └── not-found
        │   ├── assets
        │   └── environments
        └── strapi_backend # example strapi backend
            ├── api
            ├── build
            ├── config
            ├── exports
            ├── extensions
            └── public
````

<!-- TODO: Add development guide -->

## Development guide

### First start

Install needed global packages:

```` bash
   npm install -g strapi @angular/cli # install strapi, angular cli
````

Install local packages:

```` bash
npm install # Install all needed packages in repo
````

Start frontend and backend:

```` bash
npm start
````

Should Angular and Strapi be started separately:

```` bash
ng serve
````

```` bash
cd projects/strapi-auth-showcase/strapi_backend
strapi dev
````

## Contribute

1. Fork it <https://github.com/jabali2004/ngx-strapi-auth/fork>
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
