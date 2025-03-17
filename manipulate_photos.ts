import fs from 'fs';

// Read creators.json file
const creatorsData = JSON.parse(fs.readFileSync('creators.json', 'utf8'));

// Start ID from 129 as requested
let nextId = 129;

// Transform the data
const transformedData = Object.entries(creatorsData).map(([name, data]: [string, any]) => {
    return {
        id: nextId++,
        url: data.imageUrl,
        alt: `UGC Avatar ${name}`,
        name: name
    };
});

// Create the output JSON as a pretty-printed string
const outputJson = JSON.stringify(transformedData, null, 4);

// Write to a new file
fs.writeFileSync('transformed_creators.json', outputJson);

console.log(`Transformation complete! Created ${transformedData.length} entries.`);
console.log('Output saved to transformed_creators.json');

// Also log to console for immediate viewing
console.log('\nOutput JSON:');
console.log(outputJson);
