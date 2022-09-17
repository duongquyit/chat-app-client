const emotionsCode = [];
for (let i = 128512; i <= 128567; i++) {
  emotionsCode.push(`&#${i};`);
}

for (let i = 128577; i <= 128580; i++) {
  emotionsCode.push(`&#${i};`);
}

for (let i = 129296; i <= 129301; i++) {
  emotionsCode.push(`&#${i};`);
}

for (let i = 129312; i <= 129327; i++) {
  emotionsCode.push(`&#${i};`);
}

const listIconMessageReaction = ['&#128517;', '&#128525;', '&#128546;', '&#128512;', '&#128544;'];

export { emotionsCode, listIconMessageReaction };