import type { NuxtAxiosInstance } from "@nuxtjs/axios";

export default async (axios: NuxtAxiosInstance, userID: string): Promise<string> => {
	// Get raw
	// https://stackoverflow.com/questions/41846669/download-an-image-using-axios-and-convert-it-to-base64
	const data = await (await axios.get(`/users/${userID}/picture`, { responseType: "arraybuffer" })).data;

	// Load raw byte string into buffer
	const buffer = Buffer.from(data, "latin1");

	// Convert bytes to base64
	const pic = buffer.toString("base64");

	// Theorically useless prefix (modern browser will just discard it and look at magic bytes)
	const imgHTMLPrefix =
		JSON.stringify([137, 80, 78, 71, 13, 10, 26, 10]) === JSON.stringify(Array.from(buffer.slice(0, 8)))
			? "data:image/png;base64, "
			: "data:image/jpeg;base64, ";

	// Set displayed img src
	return `${imgHTMLPrefix}${pic}`;
};
