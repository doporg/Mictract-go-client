import { Subject } from 'rxjs';
import { bind } from '@react-rxjs/core';
import { startWith } from "rxjs/operators";

const menuSelected$ = new Subject();
export const onMenuSelected = ({ keyPath }) => {
    menuSelected$.next(keyPath);
}

export const [useCurrentMenuKey, menuKey$] = bind(menuSelected$.pipe(
    startWith([ 'index' ])
));

menuKey$.subscribe();
