import { writeFileSync } from "fs";
import { join } from "path";
import { __dirname } from "./esm";
import { format } from "date-fns";
import { init, isCuid } from "@paralleldrive/cuid2";
import { pathToFileURL } from "url";

const createSecret = init({ length: 16 });
const secret = createSecret();
const settings = {
  version: `#${format(new Date(), "yyyyMMddHHmm")}`,
  secret,
};

const bump = () => {
  writeFileSync(
    join(__dirname(import.meta), "settings.json"),
    JSON.stringify(settings)
  );
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("Bump");
  bump();
  console.log(settings);
  console.log("Done.");
}
