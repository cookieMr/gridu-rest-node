import {isDebugOn} from "./Toggle";

export const Log = () => {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const targetMethod = descriptor.value;

    if (isAsync(targetMethod)) {
      descriptor.value = async function <T>(...args: any[]): Promise<T> {
        const currentTime = Date.now();
        const prefix = `${target.constructor.name} | ${propertyKey}`;
        isDebugOn() && console.log({ name: `Invocation of an async function | ${prefix}`, args });

        const data = await targetMethod.apply(this, args);

        const executionTime = `${Date.now() - currentTime}ms.`;
        isDebugOn() && console.log({ name: `Result of an async function invocation | ${prefix} | ${executionTime}`, data });
        return data;
      };
    } else {
      descriptor.value = function <T>(...args: any[]): T {
        const currentTime = Date.now();
        const prefix = `${target.constructor.name} | ${propertyKey}`;
        isDebugOn() && console.log({ name: `Invocation of a sync function | ${prefix}`, args });

        const data = targetMethod.apply(this, args);

        const executionTime = `${Date.now() - currentTime}ms.`;
        isDebugOn() && console.log({ name: `Result of a sync function invocation | ${prefix} | ${executionTime}`, data });
        return data;
      };
    }

    return descriptor;
  };
};

const isAsync = (fun: Function): boolean => /await/.test(fun.toString());
