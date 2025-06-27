function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTypeName(pathParts: string[], name: string): string {
  const clean = (s: string) =>
    s.replace(/[^a-zA-Z0-9]/g, " ")
      .split(/\s+/)
      .map(capitalize)
      .join("");

  const base = pathParts.join("-") || name;
  return clean(base) + "Params";
}

function inferType(value: any): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    return `${inferType(value[0])}[]`;
  }
  if (value === null) return "any";
  const type = typeof value;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "object") return "{ " + Object.entries(value)
    .map(([k, v]) => `${k}: ${inferType(v)}`)
    .join("; ") + " }";
  return "any";
}

function parseRawJsonWithComments(raw: string): Record<string, { value: any; optional: boolean }> {
  let json: any;
  try {
    // 주석 제거
    const cleaned = raw.replace(/\/\/.*$/gm, "");
    json = JSON.parse(cleaned);
  } catch {
    return {};
  }

  function walk(obj: any): Record<string, { value: any; optional: boolean }> {
    const result: Record<string, { value: any; optional: boolean }> = {};
    for (const key in obj) {
      const value = obj[key];
      // 옵션 여부는 주석에서 추출하는 대신, 값이 undefined면 optional로 처리
      const optional = false;
      result[key] = { value, optional };
    }
    return result;
  }

  return walk(json);
}

function inferTypeWithOptional(value: any, optional: boolean): string {
  const baseType = inferType(value);
  return optional ? `${baseType} | null` : baseType;
}

export function generateApiCode(apiSpec: any): string {
  const lines: string[] = [];

  function traverse(items: any[], groupNames: string[] = []) {
    if (!Array.isArray(items)) return;

    for (const item of items) {
      if (item.item) {
        lines.push(`\n// ${item.name}\n`);
        traverse(item.item, [...groupNames, item.name]);
      } else if (item.request?.body?.raw) {
        const raw = item.request.body.raw;
        let parsed: Record<string, { value: any; optional: boolean }>;

        try {
          parsed = parseRawJsonWithComments(raw);
        } catch {
          continue;
        }

        const typeName = generateTypeName(item.request.url?.path || [], item.name);
        const fields = Object.entries(parsed)
          .map(([key, { value, optional }]) =>
            `  ${key}${optional ? "?" : ""}: ${inferTypeWithOptional(value, optional)};`
          )
          .join("\n");

        lines.push(`export type ${typeName} = {\n${fields}\n};\n`);
      }
    }
  }

  traverse(apiSpec.item);
  return lines.join("\n").trim();
}
