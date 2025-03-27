import fs from "fs";

const urls = `https://cdn.ugc.farm/photos/001.webp
https://cdn.ugc.farm/photos/002.webp
https://cdn.ugc.farm/photos/003.webp
https://cdn.ugc.farm/photos/004.webp
https://cdn.ugc.farm/photos/005.webp
https://cdn.ugc.farm/photos/006.webp
https://cdn.ugc.farm/photos/007.webp
https://cdn.ugc.farm/photos/008.webp
https://cdn.ugc.farm/photos/009.webp
https://cdn.ugc.farm/photos/010.webp
https://cdn.ugc.farm/photos/011.webp
https://cdn.ugc.farm/photos/012.webp
https://cdn.ugc.farm/photos/013.webp
https://cdn.ugc.farm/photos/014.webp
https://cdn.ugc.farm/photos/015.webp
https://cdn.ugc.farm/photos/016.webp
https://cdn.ugc.farm/photos/017.webp
https://cdn.ugc.farm/photos/018.webp
https://cdn.ugc.farm/photos/019.webp
https://cdn.ugc.farm/photos/020.webp
https://cdn.ugc.farm/photos/021.webp
https://cdn.ugc.farm/photos/022.webp
https://cdn.ugc.farm/photos/023.webp
https://cdn.ugc.farm/photos/024.webp
https://cdn.ugc.farm/photos/025.webp
https://cdn.ugc.farm/photos/026.webp
https://cdn.ugc.farm/photos/027.webp
https://cdn.ugc.farm/photos/028.webp
https://cdn.ugc.farm/photos/029.webp
https://cdn.ugc.farm/photos/030.webp
https://cdn.ugc.farm/photos/031.webp
https://cdn.ugc.farm/photos/032.webp
https://cdn.ugc.farm/photos/033.webp
https://cdn.ugc.farm/photos/034.webp
https://cdn.ugc.farm/photos/035.webp
https://cdn.ugc.farm/photos/036.webp
https://cdn.ugc.farm/photos/037.webp
https://cdn.ugc.farm/photos/038.webp
https://cdn.ugc.farm/photos/039.webp
https://cdn.ugc.farm/photos/040.webp
https://cdn.ugc.farm/photos/041.webp
https://cdn.ugc.farm/photos/042.webp
https://cdn.ugc.farm/photos/043.webp
https://cdn.ugc.farm/photos/064.webp
https://cdn.ugc.farm/photos/065.webp
https://cdn.ugc.farm/photos/066.webp
https://cdn.ugc.farm/photos/067.webp
https://cdn.ugc.farm/photos/068.webp
https://cdn.ugc.farm/photos/069.webp
https://cdn.ugc.farm/photos/070.webp
https://cdn.ugc.farm/photos/071.webp
https://cdn.ugc.farm/photos/072.webp
https://cdn.ugc.farm/photos/073.webp
https://cdn.ugc.farm/photos/074.webp
https://cdn.ugc.farm/photos/075.webp
https://cdn.ugc.farm/photos/076.webp
https://cdn.ugc.farm/photos/077.webp
https://cdn.ugc.farm/photos/078.webp
https://cdn.ugc.farm/photos/079.webp
https://cdn.ugc.farm/photos/080.webp
https://cdn.ugc.farm/photos/081.webp
https://cdn.ugc.farm/photos/082.webp
https://cdn.ugc.farm/photos/083.webp
https://cdn.ugc.farm/photos/086.webp
https://cdn.ugc.farm/photos/087.webp
https://cdn.ugc.farm/photos/088.webp
https://cdn.ugc.farm/photos/089.webp
https://cdn.ugc.farm/photos/090.webp
https://cdn.ugc.farm/photos/091.webp
https://cdn.ugc.farm/photos/092.webp
https://cdn.ugc.farm/photos/093.webp
https://cdn.ugc.farm/photos/094.webp
https://cdn.ugc.farm/photos/095.webp
https://cdn.ugc.farm/photos/096.webp
https://cdn.ugc.farm/photos/097.webp
https://cdn.ugc.farm/photos/098.webp
https://cdn.ugc.farm/photos/099.webp
https://cdn.ugc.farm/photos/100.webp
https://cdn.ugc.farm/photos/101.webp
https://cdn.ugc.farm/photos/102.webp
https://cdn.ugc.farm/photos/103.webp
https://cdn.ugc.farm/photos/104.webp
https://cdn.ugc.farm/photos/109.webp
https://cdn.ugc.farm/photos/110.webp
https://cdn.ugc.farm/photos/111.webp
https://cdn.ugc.farm/photos/112.webp
https://cdn.ugc.farm/photos/113.webp
https://cdn.ugc.farm/photos/114.webp
https://cdn.ugc.farm/photos/115.webp
https://cdn.ugc.farm/photos/116.webp
https://cdn.ugc.farm/photos/117.webp`

export function generateImageData(variant: number, min: number, max: number) {
    const images = [];

    if (variant === 1) {
        for (let i = min; i <= max; i++) {
            let img = process.env.NEXT_PUBLIC_CDN_URL + "/photos/" + i.toString().padStart(3, '0') + ".webp"
            if (urls.includes(img)) {
                images.push({
                    img_url: img,
                    rotation: [-1, 0, 1][Math.floor(Math.random() * 3)]
                });
            }
        }
    } else if (variant === 2) {
        for (let i = min; i <= max; i++) {
            images.push({
                id: i,
                url: process.env.NEXT_PUBLIC_CDN_URL + "/photos/" + i.toString().padStart(3, '0') + ".webp?class=dashboard",
                alt: "UGC Avatar " + i
            });
        }
    }
    return images;
}

const imageData = generateImageData(1, 1, 117);

fs.writeFile("image_data.json", JSON.stringify(imageData, null, 2), (err) => {
    if (err) throw err;
});
