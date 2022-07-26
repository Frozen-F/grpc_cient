interface Reply {
    privateKey: string;
    certificate: string;
}
declare const parsePfx: (path: string, password?: string) => Promise<Reply>;
export { parsePfx };
