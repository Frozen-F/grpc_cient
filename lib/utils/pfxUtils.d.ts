interface Reply {
    key: string;
    certificate: string;
    attributes: Record<string, any>;
}
declare const parsePfx: (path: string, password?: string) => Promise<Reply>;
export { parsePfx };
