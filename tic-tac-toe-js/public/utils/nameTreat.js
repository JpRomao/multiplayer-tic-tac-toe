function upperFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function treatName(name) {
  const nameArray = name.split(" ");

  let treatedName = nameArray.map((name) => upperFirstLetter(name)).join(" ");

  treatedName = treatedName.trim();

  treatName = treatedName.replace(/[^a-zA-Z0-9 ]/g, "");

  return treatedName;
}
