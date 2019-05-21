export class NotAuthorizedError extends Error {
    constructor() {
        super('Not authorized');
    }
}
export class PermissionDeniedError extends Error {
    constructor() {
        super('Permission denied');
    }
}
export class InvalidOperationError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}