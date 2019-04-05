export function getTextColor(color: string) {
  const R = parseInt(color.slice(0, 2), 16);
  const G = parseInt(color.slice(2, 4), 16);
  const B = parseInt(color.slice(4, 6), 16);

  return (R * 0.299 + G * 0.587 + B * 0.114) > 186 ? 'black' : 'white';
}

export function getBorderColor(color: string) {
  let R = (Math.max(parseInt(color.slice(0, 2), 16) * .6, 16)).toString(16).slice(0, 2);
  let G = (Math.max(parseInt(color.slice(2, 4), 16) * .6, 16)).toString(16).slice(0, 2);
  let B = (Math.max(parseInt(color.slice(4, 6), 16) * .6, 16)).toString(16).slice(0, 2);

  return '#' + R + G + B;
}
