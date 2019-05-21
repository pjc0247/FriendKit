function reformer(key: string, value: any) {
    if (value && value.toExportable !== undefined) {
        return value.toExportable();
    }
    return value;
}
export default function toJSON(object: any) {
    return JSON.stringify(object, reformer, 2);
}