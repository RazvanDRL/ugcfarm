import fs from "fs";

export function generateImageData(min: number, max: number) {
    const images = [];

    for (let i = min; i <= max; i++) {
        images.push({
            img_url: process.env.NEXT_PUBLIC_CDN_URL + "/photos/" + i.toString() + ".webp",
            rotation: [-1, 0, 1][Math.floor(Math.random() * 3)]
        });
    }

    return images;
}

const imageData = generateImageData(1, 42);

fs.writeFileSync("image_data.json", JSON.stringify(imageData, null, 2));