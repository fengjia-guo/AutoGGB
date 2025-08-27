declare global {
  interface Window {
    ggbApplet: {
      evalCommand: (cmd: string) => void;
      getValue: (objName: string) => number;
      reset: () => void;
      getBase64: () => string;
    };
    GGBApplet: new (params: any, async: boolean) => {
      inject: (elementId: string) => void;
    };
  }
}
export {};
  