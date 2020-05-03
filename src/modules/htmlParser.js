function replaceAll(target, search) {
  const match = target && target.match && target.match(search);
  if (match && match.length > 1) {
    return target.replace(
      search,
      `${match[0]} style="color: ${match[1]} !important"`
    );
  }
  return target;
}

export default function(dangerousHtml) {
  let parsedHtml = dangerousHtml;
  parsedHtml = replaceAll(parsedHtml, /color="([^"]*)"/);

  return parsedHtml;
}
