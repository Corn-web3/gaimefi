export function fixed(num, decimal) {
    const reg = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`);
    const matched = num.toString().match(reg);
    return matched ? matched[0] : num;
  }