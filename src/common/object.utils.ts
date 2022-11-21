export class ObjectUtils {

  public static isObject(value: any): boolean {
    return typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null;
  }
}
