import { join, dirname } from "path";
import { fileURLToPath } from "url";

// https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#what-do-i-use-instead-of-__dirname-and-__filename
export const __dirname = (meta: ImportMeta) => dirname(fileURLToPath(meta.url));

// https://byteofdev.com/posts/how-to-use-esm/
// export const __dirname = (meta: ImportMeta) => new URL(".", meta.url).pathname;

// other references
// https://github.com/uscreen/common-esm
// https://github.com/fisker/esm-utils
