export type OptionGroup =
  | "Layout"
  | "Slides"
  | "Text"
  | "Motion & controls"
  | "Button"
  | "Links"
  | "Motion"
  | "Controls"
  | "Photos"
  | "Top bar"
  | "Logo"
  | "Header bar"
  | "Over the hero"
  | "Scrolling"
  | "Right side"
  | "Drawer";

export type Option =
  | {
      kind: "choice";
      key: string;
      label: string;
      group: OptionGroup;
      choices: { value: string; label: string }[];
    }
  | {
      kind: "multi";
      key: string;
      label: string;
      group: OptionGroup;
      choices: { value: string; label: string }[];
    }
  | {
      kind: "range";
      key: string;
      label: string;
      group: OptionGroup;
      min: number;
      max: number;
      step: number;
      unit?: string;
    }
  | {
      kind: "toggle";
      key: string;
      label: string;
      group: OptionGroup;
    }
  | {
      kind: "text";
      key: string;
      label: string;
      group: OptionGroup;
      placeholder?: string;
      maxLength: number;
    }
  | {
      kind: "color";
      key: string;
      label: string;
      group: OptionGroup;
      allowOriginal?: boolean;
    };

export interface Section<T = unknown> {
  id: "home-hero" | "site-header";
  title: string;
  options: Option[];
  defaults: T;
  validate: (cfg: unknown) => T;
}
