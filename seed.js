// ===============================================================
// Execution: docker exec -it <container_name> mongosh "mongodb://localhost:27017" --file seed.js
// ===============================================================

db = db.getSiblingDB('mongo-catalog');
db.dropDatabase();
// --- Create Collections ---
const collectionsToAdd = ['products', 'categories', 'recentlyAdded', 'users'];
collectionsToAdd.forEach(collectionName => {
    if(collectionName === 'recentlyAdded') {
        db.createCollection(collectionName, {
            capped: true,
            size: 524288, // 0.5 MB
            max: 8 // Maximum of 8 documents
        });
        print(`Collection "${collectionName}" was created as a Capped Collection.`);
    } else {
        db.createCollection(collectionName);
        print(`Collection "${collectionName}" was created.`);
    }
});

// --- Data Templates ---
const categoryData = {
    'Smartphones': {
        brands: ['Samsung', 'Apple', 'Google', 'Xiaomi', 'OnePlus'],
        models: ['Galaxy S2{X} Ultra', 'iPhone 1{X} Pro', 'Pixel {X} Pro', '1{X} Pro', 'Mi {YYY}'],
        priceRange: [600, 1800],
        requiredAttributes: ['RAM (GB)', 'Storage (GB)', 'Display (inches)', 'Operating System'],
        attributes: { "RAM (GB)": [8, 12, 16], "Storage (GB)": [128, 256, 512, 1024], "Display (inches)": [6.1, 6.5, 6.7, 6.8], "Operating System": ["Android", "iOS"], "Main Camera (MP)": [50, 108, 200], "Battery (mAh)": [4500, 5000, 5500], "Processor": ["Snapdragon 8 Gen 3", "Apple A17 Pro", "Google Tensor G3"], "Refresh Rate (Hz)": [120, 144], "Water Resistance": ["IP68", "IP67", "None"], "Connectivity": ["5G", "Wi-Fi 6E", "NFC", "Bluetooth 5.4"], "Dual SIM": ["Yes", "No (eSIM)"], "Color": ["Black", "White", "Titanium", "Blue"], "Frame Material": ["Aluminum", "Titanium", "Stainless Steel"], "Weight (g)": [188, 201, 221, 240], "Fast Charging (W)": [25, 45, 67, 120], "Wireless Charging": ["Yes", "No"], "Screen Type": ["Dynamic AMOLED 2X", "Super Retina XDR", "OLED"], "Fingerprint Scanner": ["In-display", "Side-mounted"], "Speakers": ["Stereo", "Mono"], "Screen Protection": ["Gorilla Glass Victus 2", "Ceramic Shield"] }
    },
    'TVs': {
        brands: ['LG', 'Samsung', 'Sony', 'Philips', 'TCL'],
        models: ['OLED{XX}G4', 'Neo QLED QN{XX}D', 'Bravia XR A95L', 'OLED90{X}', 'C845 MiniLED'],
        priceRange: [700, 6000],
        requiredAttributes: ["Diagonal (inches)", "Resolution", "Panel Technology", "Refresh Rate (Hz)"],
        attributes: { "Diagonal (inches)": [55, 65, 77, 83], "Resolution": ["4K UHD", "8K"], "Panel Technology": ["OLED evo", "QLED", "MiniLED", "QD-OLED"], "Smart TV": ["webOS", "Tizen", "Google TV"], "HDR": ["Dolby Vision", "HDR10+", "HLG"], "Refresh Rate (Hz)": [100, 120, 144], "HDMI Ports": [3, 4], "HDMI Standard": ["2.1", "2.0"], "Energy Class": ["F", "G"], "Speaker Power (W)": [20, 40, 60, 70], "Ambilight": ["Yes, 3-sided", "Yes, 4-sided", "No"], "Image Processor": ["α9 Gen 7 AI", "Neural Quantum 8K", "Cognitive Processor XR"], "Tuner": ["DVB-T2/HEVC", "DVB-S2", "DVB-C"], "Frame Color": ["Black", "Silver", "Titanium"], "VESA Mount": ["300x200 mm", "400x300 mm"], "Weight (kg)": [18.9, 25.4, 34.8] }
    },
    'Laptops': {
        brands: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'],
        models: ['XPS 13 {YY}', 'Spectre x360 {YY}', 'ThinkPad X1 Carbon {YY}', 'MacBook Pro {YY}', 'ZenBook 14 {YY}'],
        priceRange: [800, 3500],
        requiredAttributes: ["RAM (GB)", "Storage (GB)", "Display Size (inches)", "Processor"],
        attributes: { "RAM (GB)": [8, 16, 32], "Storage (GB)": [256, 512, 1024, 2048], "Display Size (inches)": [13.3, 14.0, 15.6], "Processor": ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"], "Graphics Card": ["Integrated", "NVIDIA GeForce MX450", "NVIDIA GeForce RTX 3050"], "Battery Life (hours)": [10, 12, 15], "Weight (kg)": [1.2, 1.4, 1.8], "Operating System": ["Windows 11", "macOS", "Linux"], "Ports": ["USB-C", "Thunderbolt 4", "HDMI", "SD Card Reader"], "Backlit Keyboard": ["Yes", "No"], "Fingerprint Reader": ["Yes", "No"], "Color": ["Silver", "Black", "Space Gray"], "Audio": ["Stereo Speakers", "Dolby Atmos"] }
    },
    'Tablets': {
        brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Huawei'],
        models: ['iPad Pro {YY}', 'Galaxy Tab S8 {YY}', 'Surface Pro 9 {YY}', 'Tab P11 Plus {YY}', 'MatePad Pro {YY}'],
        priceRange: [300, 2000],
        requiredAttributes: ["RAM (GB)", "Storage (GB)", "Display Size (inches)", "Operating System"],
        attributes: { "RAM (GB)": [4, 8, 16], "Storage (GB)": [64, 128, 256, 512], "Display Size (inches)": [10.2, 11.0, 12.9], "Operating System": ["iPadOS", "Android", "Windows 11", "HarmonyOS"], "Processor": ["Apple M1", "Snapdragon 8cx Gen 3", "Intel Core i5"], "Battery Life (hours)": [10, 12, 15], "Weight (kg)": [0.5, 0.6, 0.8], "Ports": ["USB-C", "Thunderbolt", "MicroSD Card Slot"], "Stylus Support": ["Yes", "No"], "Keyboard Support": ["Yes", "No"], "Color": ["Silver", "Black", "Gold"], "Audio": ["Stereo Speakers", "Quad Speakers"] }
    },
    'Smartwatches': {
        brands: ['Apple', 'Samsung', 'Garmin', 'Fossil', 'Huawei'],
        models: ['Apple Watch Series {YY}', 'Galaxy Watch {YY}', 'Fenix {YY} Solar', 'Gen 6 Hybrid HR {YY}', 'Watch GT 3 Pro {YY}'],
        priceRange: [200, 1500],
        requiredAttributes: ["Display Size (inches)", "Battery Life (days)", "Water Resistance", "Operating System"],
        attributes: { "Display Size (inches)": [1.2, 1.4, 1.5], "Battery Life (days)": [1, 2, 5, 14], "Water Resistance": ["IP68", "5 ATM", "None"], "Operating System": ["watchOS", "Wear OS", "Garmin OS", "LiteOS"], "Health Features": ["Heart Rate Monitor", "GPS", "ECG", "Blood Oxygen"], "Connectivity": ["Bluetooth", "Wi-Fi", "NFC"], "Material": ["Aluminum", "Stainless Steel", "Titanium"], "Band Material": ["Silicone", "Leather", "Metal"], "Color": ["Black", "Silver", "Gold"], "Weight (g)": [30, 40, 50] }
    },
    'Headphones': {
        brands: ['Sony', 'Bose', 'Apple', 'Sennheiser', 'Jabra'],
        models: ['WH-1000XM5', 'QuietComfort 45', 'AirPods Max', 'Momentum 4', 'Elite 85h'],
        priceRange: [100, 600],
        requiredAttributes: ["Battery Life (hours)", "Noise Cancellation", "Connectivity", "Water Resistance"],
        attributes: { "Battery Life (hours)": [20, 30, 40, 60], "Noise Cancellation": ["Active", "Passive", "Adaptive"], "Connectivity": ["Bluetooth", "Wired", "USB-C"], "Water Resistance": ["IPX4", "IPX5", "None"], "Sound Quality": ["Hi-Res Audio", "LDAC", "AAC"], "Microphone": ["Built-in", "External"], "Weight (g)": [250, 300, 350], "Color": ["Black", "White", "Silver", "Blue"], "Controls": ["Touch Controls", "Physical Buttons"] }
    },
    'Smart Home Devices': {
        brands: ['Amazon', 'Google', 'Apple', 'Philips Hue', 'TP-Link'],
        models: ['Echo Dot 5th Gen', 'Nest Hub 2nd Gen', 'HomePod mini', 'Hue White and Color Ambiance', 'Kasa Smart Plug'],
        priceRange: [20, 300],
        requiredAttributes: ["Connectivity", "Compatibility", "Voice Assistant", "Power Source"],
        attributes: { "Connectivity": ["Wi-Fi", "Bluetooth", "Zigbee"], "Compatibility": ["Alexa", "Google Assistant", "Apple HomeKit"], "Voice Assistant": ["Built-in", "External"], "Power Source": ["Battery", "AC Adapter"], "Audio Quality": ["Mono", "Stereo"], "Color": ["Black", "White", "Gray"], "Weight (g)": [100, 200, 300], "Dimensions (mm)": ["100x100x50", "150x150x75"] }
    }
};

async function seedDB() {
    // --- ADD CATEGORIES ---
    const categoryNames = Object.keys(categoryData);
    const categoriesToInsert = categoryNames.map(name => ({ name, createdAt: new Date(), updatedAt: new Date() }));
    await db.categories.insertMany(categoriesToInsert);
    print(`Inserted ${categoriesToInsert.length} categories.`);

    // --- GET CATEGORY IDs ---
    const insertedCategories = await db.categories.find().toArray();
    const categoryMap = new Map();
    insertedCategories.forEach(cat => categoryMap.set(cat.name, cat._id));
    print('Created a map of category names to their IDs.');

    // --- ADD PRODUCTS ---
    const productsToInsert = [];
    print('Generating products with correct category IDs...');

    for (const [categoryName, data] of Object.entries(categoryData)) {
        const categoryId = categoryMap.get(categoryName);
        if (!categoryId) {
            print(`Warning: No ID found for category: ${categoryName}. Skipping products.`);
            continue;
        }

        for (let i = 1; i <= 8; i++) {
            const brand = data.brands[Math.floor(Math.random() * data.brands.length)];
            let model = data.models[Math.floor(Math.random() * data.models.length)];

            model = model.replace('{X}', () => [5, 7, 9][Math.floor(Math.random() * 3)]);
            model = model.replace('{XX}', () => [30, 40, 55, 65, 70][Math.floor(Math.random() * 5)]);
            model = model.replace('{YYY}', () => [13, 12, 11, 9][Math.floor(Math.random() * 4)] + ['400', '600', '700', '900'][Math.floor(Math.random() * 4)]);
            model = model.replace('{YY}', () => [7, 6][Math.floor(Math.random() * 2)]);

            const name = `${brand} ${model} v${i}`;
            const price = parseFloat((Math.random() * (data.priceRange[1] - data.priceRange[0]) + data.priceRange[0]).toFixed(2));

            const attributes = {};
            if (data.requiredAttributes) {
                for (const key of data.requiredAttributes) {
                    const values = data.attributes[key];
                    attributes[key] = values[Math.floor(Math.random() * values.length)];
                }
            }
            for (const key of Object.keys(data.attributes)) {
                if (!(data.requiredAttributes || []).includes(key) && Math.random() > 0.5) {
                    const values = data.attributes[key];
                    attributes[key] = values[Math.floor(Math.random() * values.length)];
                }
            }
            let singularCategory;
            switch(categoryName) {
                case 'Smartphones':
                    singularCategory = 'Smartphone';
                    break;
                case 'TVs':
                    singularCategory = 'TV';
                    break;
                case 'Laptops':
                    singularCategory = 'Laptop';
                    break;
                case 'Tablets':
                    singularCategory = 'Tablet';
                    break;
                case 'Smartwatches':
                    singularCategory = 'Smartwatch';
                    break;
                case 'Headphones':
                    singularCategory = 'Headphone';
                    break;
                case 'Smart Home Devices':
                    singularCategory = 'Smart Home Device';
                    break;
            }
            const searchTerms = `${singularCategory}+${brand}`;
            const imageUrl = `https://placehold.co/400x300/EFEFEF/333333?text=${searchTerms}`;
            const reviewAuthors = ['John D.', 'Jane S.', 'Mike P.', 'Emily R.', 'Chris B.', 'Sarah W.', 'Tom H.'];
            const reviewData = {
                5: [
                    "Amazing product, works perfectly!",
                    "Excellent quality, highly recommended!",
                    "Five stars! Would buy again.",
                    "Exceeded my expectations. Truly a fantastic item.",
                    "Couldn't be happier with this purchase. Flawless!"
                ],
                4: [
                    "Good value for the price.",
                    "Great design and very user-friendly.",
                    "A solid product, works well with only minor issues.",
                    "Very good, but not perfect. Almost there.",
                    "I'm happy with it, does what it's supposed to do."
                ],
                3: [
                    "Not bad, but could be better.",
                    "It's okay, does the job.",
                    "Decent, but there are better options out there.",
                    "The battery life is shorter than advertised.",
                    "Average quality. You get what you pay for."
                ],
                2: [
                    "I'm very disappointed with this.",
                    "Struggled to get it to work properly.",
                    "Wouldn't buy this again. Poor build quality.",
                    "Arrived damaged, and customer service was not helpful."
                ],
                1: [
                    "Waste of money. Would not recommend.",
                    "Broke after just a week of use. Terrible.",
                    "Completely useless. Do not buy.",
                    "This is the worst product I have ever purchased."
                ]
            };

            const reviews = [];
            const numReviews = Math.floor(Math.random() * (22 - 3 + 1)) + 3; // 3 to 22 reviews
            let totalRating = 0;

            for (let j = 0; j < numReviews; j++) {
                const rating = Math.floor(Math.random() * 5) + 1; // 1 to 5 stars
                const possibleComments = reviewData[rating];
                const comment = possibleComments[Math.floor(Math.random() * possibleComments.length)];

                reviews.push({
                    _id: new ObjectId(),
                    name: reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)],
                    rating: rating,
                    comment: comment,
                    // Random date in the last 30 days
                    createdAt: new Date(new Date() - Math.random() * 30 * 24 * 60 * 60 * 1000)
                });
                totalRating += rating;
            }

            const averageRating = numReviews > 0 ? parseFloat((totalRating / numReviews).toFixed(2)) : 0;
            const isPromotional = Math.random() > 0.9;

            productsToInsert.push({
                name,
                price,
                description: `Best quality ${categoryName} ${name}. An excellent choice for demanding customers.`,
                imageUrl,
                category: categoryId,
                details: attributes,
                isPromotional: isPromotional,
                promotionalPrice: isPromotional ? parseFloat((price * (Math.random() * 0.5 + 0.5)).toFixed(2)) : null,
                reviews: reviews,
                rating: averageRating,
                numReviews: numReviews,
                createdAt: new Date(),
            });
        }
    }

    if (productsToInsert.length > 0) {
        await db.products.insertMany(productsToInsert);
        print(`Inserted ${productsToInsert.length} products.`);
    }

    print('Adding products to the "recentlyAdded" collection...');
    const recentProducts = await db.products.find().sort({ createdAt: -1 }).limit(4).toArray();

    if (recentProducts.length > 0) {
        const recentlyAddedDocs = recentProducts.map(p => ({
            product: p._id,
            createdAt: p.createdAt
        }));
        await db.recentlyAdded.insertMany(recentlyAddedDocs);
        print(`Added ${recentlyAddedDocs.length} newest products to 'recentlyAdded'.`);
    }

    print('Adding root user...');
    const adminUser = {
        name: 'root',
        email: 'mail@example.com',
        password: '$2a$10$1pHSPqz2abRdiAjUeYf5XOHIa24DCHiJFrXLMMKsuTHPBTsPJqS.C', // root
        isAdmin: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    await db.users.insertOne(adminUser);
    print('\n\nLogin credentials: \nEmail: mail@example.com\nPassword: root\n\n');

    print('Seeding complete.');
}

seedDB().catch(print);