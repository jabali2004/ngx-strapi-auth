import { NbMenuItem } from '@nebular/theme';
import { Subject } from 'rxjs';

export const MENU_ITEMS_SUBJECT: Subject<NbMenuItem[]> = new Subject();

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
    hidden: false
  }
  // {
  //   title: 'Administration',
  //   icon: 'options-2-outline',
  //   link: '/pages/administration',
  //   hidden: true,
  //   pathMatch: 'prefix',
  //   data: {
  //     restrictedAccess: true
  //   }
  // }
];
