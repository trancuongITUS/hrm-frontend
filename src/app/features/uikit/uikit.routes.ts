import { Routes } from '@angular/router';
import { ButtonDemo } from './components/buttondemo';
import { ChartDemo } from './components/chartdemo';
import { FileDemo } from './components/filedemo';
import { FormLayoutDemo } from './components/formlayoutdemo';
import { InputDemo } from './components/inputdemo';
import { ListDemo } from './components/listdemo';
import { MediaDemo } from './components/mediademo';
import { MessagesDemo } from './components/messagesdemo';
import { MiscDemo } from './components/miscdemo';
import { PanelsDemo } from './components/panelsdemo';
import { TimelineDemo } from './components/timelinedemo';
import { TableDemo } from './components/tabledemo';
import { OverlayDemo } from './components/overlaydemo';
import { TreeDemo } from './components/treedemo';
import { MenuDemo } from './components/menudemo';

export default [
    { path: 'button', data: { breadcrumb: 'Button' }, component: ButtonDemo },
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'file', data: { breadcrumb: 'File' }, component: FileDemo },
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    { path: 'media', data: { breadcrumb: 'Media' }, component: MediaDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    { path: 'table', data: { breadcrumb: 'Table' }, component: TableDemo },
    { path: 'overlay', data: { breadcrumb: 'Overlay' }, component: OverlayDemo },
    { path: 'tree', data: { breadcrumb: 'Tree' }, component: TreeDemo },
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
