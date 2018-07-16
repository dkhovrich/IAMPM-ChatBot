export default function (fn: any) {
    return function (req: any, res: any, next: any, ...args: any[]) {
        const result = fn(req, res, next, ...args);
        return Promise.resolve(result).catch(next);
    };
}