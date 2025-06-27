function inferType(value: any): string {
  const type = typeof value;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (Array.isArray(value)) return `${inferType(value[0])}[]`;
  return "any";
}

function generateTypeName(pathParts: string[], name: string): string {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const clean = (s: string) =>
    s.replace(/[^a-zA-Z0-9]/g, " ")
      .split(/\s+/)
      .map(capitalize)
      .join("");
  const base = pathParts.join("-") || name;
  return clean(base) + "Params";
}

function toCamel(str: string): string {
  return str
    .replace(/[-_\/\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

function parseRawJsonWithComments(raw: string): Record<string, { value: any; optional: boolean }> {
  const result: Record<string, { value: any; optional: boolean }> = {};
  const lines = raw.split("\n");

  for (const line of lines) {
    const match = line.match(/"(.+?)"\s*:\s*(.+?)(\s*\/\/\s*(.*))?$/);
    if (!match) continue;

    const [, key, rawValue, , comment] = match;
    let value: any;
    try {
      value = JSON.parse(rawValue.endsWith(",") ? rawValue.slice(0, -1) : rawValue);
    } catch {
      value = rawValue.trim().replace(/,$/, "");
    }

    const optional = comment?.trim() === "?";
    result[key] = { value, optional };
  }

  return result;
}

export function generateApiFunctions(apiSpec: any): string {
  const lines: string[] = [];
  const typeNames = new Set<string>();

  function traverse(items: any[], groupNames: string[] = []) {
    for (const item of items) {
      if (item.item) {
        lines.push(`\n// ${[...groupNames, item.name].join(" / ")}\n`);
        traverse(item.item, [...groupNames, item.name]);
      } else if (item.request?.url?.path) {
        const name = item.name;
        const method = item.request.method;
        const url = item.request.url.raw?.replace("{{baseUrl}}/", "") ?? item.request.url.path.join("/");
        const title = name;
        const hasToken = item.request.header?.some((h: any) => h.key.toLowerCase() === "authorization");
        const bodyRaw = item.request.body?.raw;

        let params = "";
        let bodyArg = "";
        let typeName = "";

        try {
          const parsed = parseRawJsonWithComments(bodyRaw || "");
          const keys = Object.keys(parsed);

          if (keys.length === 0) {
            params = "";
            bodyArg = "";
          } else if (keys.length === 1) {
            const [k] = keys;
            const { value, optional } = parsed[k];
            const inferred = inferType(value);
            params = `${k}${optional ? "?" : ""}: ${inferred}${optional ? " | null" : ""}`;
            bodyArg = `{ ${k}: ${k} }`;
          } else {
            typeName = generateTypeName(url.split("/"), name);
            params = `params: ${typeName}`;
            bodyArg = "params";
            typeNames.add(typeName);
          }
        } catch {
          params = "";
          bodyArg = "";
        }

        const fnName = toCamel(url.split("/").join("_"));

        lines.push(`// ${[...groupNames, name].join(" / ")}`);
        lines.push(`
export async function ${fnName}(${params}) {
  return callDealerApi({
    title: "${title}",
    url: buildProxyUrl("${url}"),
    ${hasToken ? "withToken: true," : ""}
    ${bodyArg ? `body: ${bodyArg},` : ""}
    isCallPageLoader: true,
  });
}
        `.trim());
//         lines.push(`
// export async function ${fnName}(${params}) {
//   return callUserApi({
//     title: "${title}",
//     url: buildProxyUrl("${url}"),
//     ${hasToken ? "withToken: true," : ""}
//     ${bodyArg ? `body: ${bodyArg},` : ""}
//     isCallPageLoader: true,
//   });
// }
//         `.trim());
      }
    }
  }

  traverse(apiSpec, []);

  const importLines = [
    `import { callDealerApi } from "./callDealerApi";`,
    `import { buildProxyUrl } from "@/lib/config/apiHost";`,
  ];

  if (typeNames.size > 0) {
    importLines.push(
      `import { ${Array.from(typeNames).join(", ")} } from "./dealerApi.types";`
    );
  }
  // const importLines = [
  //   `import { callUserApi } from "./callUserApi";`,
  //   `import { buildProxyUrl } from "@/lib/config/apiHost";`,
  // ];

  // if (typeNames.size > 0) {
  //   importLines.push(
  //     `import { ${Array.from(typeNames).join(", ")} } from "./userApi.types";`
  //   );
  // }

  return [...importLines, "", ...lines].join("\n\n");
}
