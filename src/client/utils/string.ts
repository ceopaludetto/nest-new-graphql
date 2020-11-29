export function removeMask(val: string) {
  return val.replace(/[^\d]+/g, "");
}

export function splitPhone(val: string) {
  const [ddd, number] = val.split(" ");

  return {
    ddd: removeMask(ddd),
    number: removeMask(number),
  };
}

export function mergePhone(phone?: { ddd: string; number: string }) {
  if (!phone) {
    return "";
  }

  return `${phone.ddd} ${phone.number}`;
}

export function retrieveTo(val: string | string[] | undefined) {
  if (!val) {
    return "";
  }

  return Array.isArray(val) ? val[0] : val;
}

export const hasPathname = (to: { pathname: string } | string): to is { pathname: string } => typeof to !== "string";
