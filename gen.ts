import fs from "fs";

const urls = `https://ugcfarm.b-cdn.net/photos/001.webp
https://ugcfarm.b-cdn.net/photos/002.webp
https://ugcfarm.b-cdn.net/photos/003.webp
https://ugcfarm.b-cdn.net/photos/004.webp
https://ugcfarm.b-cdn.net/photos/005.webp
https://ugcfarm.b-cdn.net/photos/006.webp
https://ugcfarm.b-cdn.net/photos/007.webp
https://ugcfarm.b-cdn.net/photos/008.webp
https://ugcfarm.b-cdn.net/photos/009.webp
https://ugcfarm.b-cdn.net/photos/010.webp
https://ugcfarm.b-cdn.net/photos/011.webp
https://ugcfarm.b-cdn.net/photos/012.webp
https://ugcfarm.b-cdn.net/photos/013.webp
https://ugcfarm.b-cdn.net/photos/014.webp
https://ugcfarm.b-cdn.net/photos/015.webp
https://ugcfarm.b-cdn.net/photos/016.webp
https://ugcfarm.b-cdn.net/photos/017.webp
https://ugcfarm.b-cdn.net/photos/018.webp
https://ugcfarm.b-cdn.net/photos/019.webp
https://ugcfarm.b-cdn.net/photos/020.webp
https://ugcfarm.b-cdn.net/photos/021.webp
https://ugcfarm.b-cdn.net/photos/022.webp
https://ugcfarm.b-cdn.net/photos/023.webp
https://ugcfarm.b-cdn.net/photos/024.webp
https://ugcfarm.b-cdn.net/photos/025.webp
https://ugcfarm.b-cdn.net/photos/026.webp
https://ugcfarm.b-cdn.net/photos/027.webp
https://ugcfarm.b-cdn.net/photos/028.webp
https://ugcfarm.b-cdn.net/photos/029.webp
https://ugcfarm.b-cdn.net/photos/030.webp
https://ugcfarm.b-cdn.net/photos/031.webp
https://ugcfarm.b-cdn.net/photos/032.webp
https://ugcfarm.b-cdn.net/photos/033.webp
https://ugcfarm.b-cdn.net/photos/034.webp
https://ugcfarm.b-cdn.net/photos/035.webp
https://ugcfarm.b-cdn.net/photos/036.webp
https://ugcfarm.b-cdn.net/photos/037.webp
https://ugcfarm.b-cdn.net/photos/038.webp
https://ugcfarm.b-cdn.net/photos/039.webp
https://ugcfarm.b-cdn.net/photos/040.webp
https://ugcfarm.b-cdn.net/photos/041.webp
https://ugcfarm.b-cdn.net/photos/042.webp
https://ugcfarm.b-cdn.net/photos/043.webp
https://ugcfarm.b-cdn.net/photos/064.webp
https://ugcfarm.b-cdn.net/photos/065.webp
https://ugcfarm.b-cdn.net/photos/066.webp
https://ugcfarm.b-cdn.net/photos/067.webp
https://ugcfarm.b-cdn.net/photos/068.webp
https://ugcfarm.b-cdn.net/photos/069.webp
https://ugcfarm.b-cdn.net/photos/070.webp
https://ugcfarm.b-cdn.net/photos/071.webp
https://ugcfarm.b-cdn.net/photos/072.webp
https://ugcfarm.b-cdn.net/photos/073.webp
https://ugcfarm.b-cdn.net/photos/074.webp
https://ugcfarm.b-cdn.net/photos/075.webp
https://ugcfarm.b-cdn.net/photos/076.webp
https://ugcfarm.b-cdn.net/photos/077.webp
https://ugcfarm.b-cdn.net/photos/078.webp
https://ugcfarm.b-cdn.net/photos/079.webp
https://ugcfarm.b-cdn.net/photos/080.webp
https://ugcfarm.b-cdn.net/photos/081.webp
https://ugcfarm.b-cdn.net/photos/082.webp
https://ugcfarm.b-cdn.net/photos/083.webp
https://ugcfarm.b-cdn.net/photos/086.webp
https://ugcfarm.b-cdn.net/photos/087.webp
https://ugcfarm.b-cdn.net/photos/088.webp
https://ugcfarm.b-cdn.net/photos/089.webp
https://ugcfarm.b-cdn.net/photos/090.webp
https://ugcfarm.b-cdn.net/photos/091.webp
https://ugcfarm.b-cdn.net/photos/092.webp
https://ugcfarm.b-cdn.net/photos/093.webp
https://ugcfarm.b-cdn.net/photos/094.webp
https://ugcfarm.b-cdn.net/photos/095.webp
https://ugcfarm.b-cdn.net/photos/096.webp
https://ugcfarm.b-cdn.net/photos/097.webp
https://ugcfarm.b-cdn.net/photos/098.webp
https://ugcfarm.b-cdn.net/photos/099.webp
https://ugcfarm.b-cdn.net/photos/100.webp
https://ugcfarm.b-cdn.net/photos/101.webp
https://ugcfarm.b-cdn.net/photos/102.webp
https://ugcfarm.b-cdn.net/photos/103.webp
https://ugcfarm.b-cdn.net/photos/104.webp
https://ugcfarm.b-cdn.net/photos/109.webp
https://ugcfarm.b-cdn.net/photos/110.webp
https://ugcfarm.b-cdn.net/photos/111.webp
https://ugcfarm.b-cdn.net/photos/112.webp
https://ugcfarm.b-cdn.net/photos/113.webp
https://ugcfarm.b-cdn.net/photos/114.webp
https://ugcfarm.b-cdn.net/photos/115.webp
https://ugcfarm.b-cdn.net/photos/116.webp
https://ugcfarm.b-cdn.net/photos/117.webp`

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
