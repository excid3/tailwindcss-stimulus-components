import {Controller} from '@hotwired/stimulus';

export class Alert extends Controller {
  close(): void;
  show(): void;
  hide(): void;
}

export class Autosave extends Controller {
  save(): void;
  success(): void;
  error(): void;
  setStatus(message: string): void;
}

export class ColorPreview extends Controller {
  update(): void;
  // `color` is a hex color string
  set preview(color: string);
  get color(): string;
}

export class Dropdown extends Controller {
  toggle(): void;
  show(): void;
  hide(event: Event): void;
  openValueChanged(): void;
  get activeTarget(): Element;
  get enterTimeout(): number[];
  get leaveTimeout(): number[];
}

export class Modal extends Controller {
  open(event: Event): void;
  close(event: Event): void;
  lockScroll(): void;
  unlockScroll(): void;
  saveScrollPosition(): void;
  restoreScrollPosition(): void;
}

export class Popover extends Controller {
  mouseOver(): void;
  mouseOut(): void;
  toggle(): void;
}

export class Slideover extends Dropdown {}

export class Tabs extends Controller {
  change(event: Event): void;
  showTab(): void;
  get index(): number;
  set index(value: number);
  get anchor(): string | null;
}

export class Toggle extends Controller {
  toggle(event: Event): void;
  hide(event: Event): void;
  show(event: Event): void;
  openValueChanged(): void;
}
