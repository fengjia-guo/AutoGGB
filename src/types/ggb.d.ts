declare global {
  interface Window {
    ggbApplet: {
      evalCommand: (cmd: string) => void;
      getBase64: () => string;
    };
    GGBApplet: new (params: any, async: boolean) => {
      inject: (elementId: string) => void;
    };
  }
}
export {};
  