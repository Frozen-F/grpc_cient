declare const parsePfx: (path: string, password?: string) => Promise<Record<'privateKey' | 'certificate', string>>;
export { parsePfx };
