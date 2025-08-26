export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidShortcode = (code) => {
  const regex = /^[a-zA-Z0-9]{5,20}$/;
  return regex.test(code);
};

export const isValidDuration = (duration) => {
  return Number.isInteger(duration) && duration > 0;
};