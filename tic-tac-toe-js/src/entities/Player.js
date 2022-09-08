import { generateRandomId } from "../utils/generateRandomId.js";

class Player {
  id;
  name;

  constructor(playerName) {
    this.id = generateRandomId(1, 99999);

    this.name = playerName;
  }
}

export default Player;
