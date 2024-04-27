import { format, parseISO } from "date-fns";

export const unique = (value: any, index: number, self: any[]): boolean =>
  self.indexOf(value) === index;

export function serialiseForm(formData: FormData) {
  const keys = [...formData.keys()].filter(unique);
  const result = {} as any;
  for (const key of keys) {
    const value = formData.getAll(key);
    result[key] = value.length == 1 ? value[0] : value;
  }
  return result;
}

export const renderDate = (date: Date): string => format(date, "yyyy-MM-dd");

export const renderDatetime = (
  datetime: Date | string | null | undefined
): string =>
  datetime
    ? format(
        typeof datetime == "string" ? parseISO(datetime) : datetime,
        "yyyy-MM-dd HH:mm"
      )
    : "";

export const { uuid } = new (class {
  private prefix = "2";
  private index = 0;
  public uuid = () =>
    [
      this.prefix,
      Math.floor((Date.now() - 1678599470087) / 0xfff),
      this.index++,
    ]
      .map((x) => x.toString(36))
      .join("")
      .toUpperCase();
})();

// export const range = (size: number): number[] => Array.from(Array(size).keys());

export const range = (r: number) => [...Array(r).keys()];

export const shuffle = () => Math.random() - 0.5;

export const arrify = (item: any) => (Array.isArray(item) ? item : [item]);

// export async function post(url: string, data: object) {
//   const response = await fetch(url, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
//   const text = await response.text();
//   return text;
// }

export const post = (url: string, body: object) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((r) => r.text());

export function safeParse(s: string): string | null {
  try {
    return JSON.parse(s);
  } catch (error) {}
  return null;
}
