import fs from "fs";

export function generateImageData(variant: number, min: number, max: number) {
    const images = [];

    if (variant === 1) {
        for (let i = min; i <= max; i++) {
            images.push({
                img_url: process.env.NEXT_PUBLIC_CDN_URL + "/photos/" + i.toString() + ".webp",
                rotation: [-1, 0, 1][Math.floor(Math.random() * 3)]
            });
        }
    } else if (variant === 2) {
        for (let i = min; i <= max; i++) {
            images.push({
                id: i,
                url: process.env.NEXT_PUBLIC_CDN_URL + "/photos/" + i.toString() + ".webp?class=landing",
                alt: "UGC Avatar " + i
            });
        }
    }

    return images;
}

const imageData = generateImageData(2, 1, 42);

fs.writeFile("image_data.json", JSON.stringify(imageData, null, 2), (err) => {
    if (err) throw err;
});
