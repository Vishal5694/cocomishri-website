export type OptionGroup =
  | "Copy"
  | "Typography & layout"
  | "Fabric & watermark"
  | "Animation"
  | "Bottom mascot";

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
    };

export interface Section<T = unknown> {
  id: string;
  title: string;
  options: Option[];
  defaults: T;
  validate: (cfg: unknown) => T;
}
