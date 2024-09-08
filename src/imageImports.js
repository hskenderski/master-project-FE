// src/imageLoader.js

const imageCache = new Map();

const loadImage = async (id) => {
    if (imageCache.has(id)) {
        return imageCache.get(id);
    }

    try {
        // Използвайте динамично import за зареждане на изображението
        const image = await import(`./upload/${id}`);
        imageCache.set(id, image.default);
        return image.default;
    } catch (error) {
        console.error(`Failed to load image for id ${id}`, error);
        return null; // или return 'path/to/placeholder/image' за запазване на резервно изображение
    }
};

export default loadImage;
