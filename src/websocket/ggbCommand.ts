export const executeGeoGebra = (ggbApplet: any, commands: string[], valuesToGet: string[]): Promise<{ [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    if (!ggbApplet) {
      reject(new Error("GeoGebra applet is not available."));
      return;
    }

    try {
      commands.forEach(command => {
        if (typeof command === 'string' && command.trim() !== '') {
          ggbApplet.evalCommand(command);
        }
      });

      const results: { [key: string]: any } = {};
      valuesToGet.forEach(valueName => {
        if (typeof valueName === 'string' && valueName.trim() !== '') {
          results[valueName] = ggbApplet.getValue(valueName);
        }
      });

      resolve(results);
    } catch (error: any) {
      reject(error);
    }
  });
};