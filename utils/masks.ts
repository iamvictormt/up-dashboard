export const applyPhoneMask = (value: string): string => {
  value = value.replace(/\D/g, '');

  if (value.length === 0) return '';
  if (value.length <= 2) return `(${value}`;
  if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
  if (value.length <= 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
};

export const applyRgMask = (value: string) => {
  value = value.replace(/\D/g, '');

  if (value.length > 9) value = value.slice(0, 9);

  if (value.length > 7) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}-${value.slice(8)}`;
  } else if (value.length > 4) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
  } else if (value.length > 2) {
    return `${value.slice(0, 2)}.${value.slice(2)}`;
  }

  return value;
};

export const applyDocumentMask = (value: string) => {
  value = value.replace(/\D/g, '');

  if (value.length > 14) value = value.slice(0, 14);

  if (value.length <= 11) {
    if (value.length > 9) {
      return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      return `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    return value;
  } else {
    if (value.length > 12) {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
    } else if (value.length > 8) {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`;
    } else if (value.length > 5) {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    } else if (value.length > 2) {
      return `${value.slice(0, 2)}.${value.slice(2)}`;
    }
    return value;
  }
};

export const applyDocumentCnpjMask = (value: string) => {
  value = value.replace(/\D/g, '');

  if (value.length > 14) value = value.slice(0, 14);

  if (value.length > 12) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
  } else if (value.length > 8) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`;
  } else if (value.length > 5) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
  } else if (value.length > 2) {
    return `${value.slice(0, 2)}.${value.slice(2)}`;
  }
  return value;
};

export const applyZipCodeMask = (value: string): string => {
  value = value.replace(/\D/g, '');
  if (value.length === 0) return '';
  if (value.length <= 5) return value;
  return `${value.slice(0, 5)}-${value.slice(5, 8)}`;
};

export const applyHouseNumberMask = (value: string): string => {
  value = value.replace(/\D/g, '');
  return value;
};
