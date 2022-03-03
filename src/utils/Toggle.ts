const debugToggle = process.env.DEBUG_LOG;

export const isDebugOn = (): boolean =>
  !!debugToggle && debugToggle.toLowerCase().trim() === 'true';
