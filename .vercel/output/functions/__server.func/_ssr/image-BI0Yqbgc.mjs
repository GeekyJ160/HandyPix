//#region node_modules/.nitro/vite/services/ssr/assets/image-BI0Yqbgc.js
async function fileToDataUrl(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not read that photo");
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .72);
}
async function urlToDataUrl(url) {
	const blob = await (await fetch(url)).blob();
	return fileToDataUrl(new File([blob], "sample.jpg", { type: blob.type || "image/jpeg" }));
}
//#endregion
export { urlToDataUrl as n, fileToDataUrl as t };
