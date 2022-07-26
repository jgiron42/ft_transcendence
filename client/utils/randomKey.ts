export default (len: number): string => {
	const buf = [];
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	const charlen = chars.length;

	for (let i = 0; i < len; ++i) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}

	return buf.join("");
};

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
