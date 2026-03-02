exports.getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts.at(-1).split(".")[0];
  const folder = parts.at(-2);
  return `${folder}/${filename}`;
};
