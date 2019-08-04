import { ArrayType, Base64PrimitiveType, BoolPrimitiveType, BytesPrimitiveType, CepPrimitiveType, CnpjPrimitiveType, CpfPrimitiveType, DatePrimitiveType, DateTimePrimitiveType, EmailPrimitiveType, EnumType, FloatPrimitiveType, HexPrimitiveType, IntPrimitiveType, LatLngPrimitiveType, MoneyPrimitiveType, OptionalType, PhonePrimitiveType, SafeHtmlPrimitiveType, StringPrimitiveType, StructType, Type, TypeReference, UIntPrimitiveType, UrlPrimitiveType, UuidPrimitiveType, VoidPrimitiveType, XmlPrimitiveType } from "../../ast";

export function generateTypescriptInterface(type: StructType) {
    return `export interface ${type.name} {
${type.fields.map(field => `    ${field.name}: ${generateTypescriptTypeName(field.type)}`).join("\n")}
}\n`;
}

export function generateTypescriptEnum(type: EnumType) {
    return `export type ${type.name} = ${type.values.map(x => `"${x}"`).join(" | ")};\n`;
}

export function clearForLogging(path: string, type: Type): string {
    if (type instanceof TypeReference) {
        return clearForLogging(path, type.type);
    } else if (type instanceof OptionalType) {
        const code = clearForLogging(path, type.base);
        if (code)
            return `if (${path} !== null && ${path} !== undefined) { ${code} }`;
        else
            return "";
    } else if (type instanceof ArrayType) {
        const code = clearForLogging("el", type.base);
        if (code)
            return `for (const el of ${path}) { ${code} }`;
        else
            return "";
    } else if (type instanceof StructType) {
        const codes: string[] = [];
        for (const field of type.fields) {
            if (field.secret) {
                codes.push(`${path}.${field.name} = "<secret>";`);
            } else {
                const code = clearForLogging(`${path}.${field.name}`, field.type);
                if (code)
                    codes.push(code);
            }
        }
        return codes.join(" ");
    } else {
        return "";
    }
}

export function generateTypescriptTypeName(type: Type): string {
    if (type instanceof StringPrimitiveType) {
        return "string";
    } else if (type instanceof IntPrimitiveType) {
        return "number";
    } else if (type instanceof UIntPrimitiveType) {
        return "number";
    } else if (type instanceof FloatPrimitiveType) {
        return "number";
    } else if (type instanceof DatePrimitiveType) {
        return "Date";
    } else if (type instanceof DateTimePrimitiveType) {
        return "Date";
    } else if (type instanceof BoolPrimitiveType) {
        return "boolean";
    } else if (type instanceof BytesPrimitiveType) {
        return "Buffer";
    } else if (type instanceof MoneyPrimitiveType) {
        return "number";
    } else if (type instanceof CpfPrimitiveType) {
        return "string";
    } else if (type instanceof CnpjPrimitiveType) {
        return "string";
    } else if (type instanceof EmailPrimitiveType) {
        return "string";
    } else if (type instanceof PhonePrimitiveType) {
        return "string";
    } else if (type instanceof CepPrimitiveType) {
        return "string";
    } else if (type instanceof LatLngPrimitiveType) {
        return "{lat: number, lng: number}";
    } else if (type instanceof UrlPrimitiveType) {
        return "string";
    } else if (type instanceof UuidPrimitiveType) {
        return "string";
    } else if (type instanceof HexPrimitiveType) {
        return "string";
    } else if (type instanceof Base64PrimitiveType) {
        return "string";
    } else if (type instanceof SafeHtmlPrimitiveType) {
        return "string";
    } else if (type instanceof XmlPrimitiveType) {
        return "string";
    } else if (type instanceof VoidPrimitiveType) {
        return "void";
    } else if (type instanceof OptionalType) {
        return generateTypescriptTypeName(type.base) + " | null";
    } else if (type instanceof ArrayType) {
        return generateTypescriptTypeName(type.base) + "[]";
    } else if (type instanceof StructType) {
        return type.name;
    } else if (type instanceof EnumType) {
        return type.name;
    } else if (type instanceof TypeReference) {
        return generateTypescriptTypeName(type.type);
    } else {
        throw new Error(`BUG: generateTypescriptTypeName with ${type.constructor.name}`);
    }
}