import { Injectable } from '@angular/core';

import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
  group
} from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class AnimationsService {
}

export const fadeInStagger = trigger('fadeInStagger', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger(100, [
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ opacity: 0 }))
  ])
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),

    query(':enter', [style({ left: '100%', opacity: 0 })], { optional: true }),
    query(':leave', [style({ left: '0%', opacity: 1 })], { optional: true }),

    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '-100%', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
