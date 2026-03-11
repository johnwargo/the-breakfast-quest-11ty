/********************************************************************
 * Gallery Image Shortcode
 * 
 ********************************************************************/

// https://www.bash.lk/posts/tech/1-elventy-image-gallery/
// https://photoswipe.com/getting-started/

// https://github.com/11ty/eleventy/issues/1784

import sharp from 'sharp';
import Image from '@11ty/eleventy-img';

const GALLERY_IMAGE_WIDTH = 256;
const LANDSCAPE_LIGHTBOX_IMAGE_WIDTH = 1280;
const PORTRAIT_LIGHTBOX_IMAGE_WIDTH = 1024;
const PLUGIN_NAME = 'galleryImageShortcode';

async function galleryImageShortcode(src, alt) {

    console.log(`[${PLUGIN_NAME}] ${src}`);

    const metadata = await sharp(src).metadata();
    let lightboxImageWidth = metadata.width > metadata.height ? LANDSCAPE_LIGHTBOX_IMAGE_WIDTH : PORTRAIT_LIGHTBOX_IMAGE_WIDTH;

    const options = {
        widths: [GALLERY_IMAGE_WIDTH, lightboxImageWidth],
        formats: ['jpeg'],
        // urlPath: "/img/",
        outputDir: './_site/img/'
    }
    
    const genMetadata = await Image(src, options);

    // Refactored this
    // return `<a href="${genMetadata.jpeg[1].url}" data-pswp-width="${genMetadata.jpeg[1].width}" data-pswp-height="${genMetadata.jpeg[1].height}" target="_blank"><img src="${genMetadata.jpeg[0].url}" alt="${alt}" /></a>`.replace(/(\r\n|\n|\r)/gm, "");
    // to this so it would be easier to read during this troubleshooting
    let returnVal = `<a href="${genMetadata.jpeg[1].url}" `;
    returnVal += `data-pswp-width="${genMetadata.jpeg[1].width}" `;
    returnVal += `data-pswp-height="${genMetadata.jpeg[1].height}" `;
    returnVal += 'target="_blank">';
    returnVal += `<img src="${genMetadata.jpeg[0].url}" alt="${alt}" eleventy:ignore />`;
    returnVal += '</a>';
    return returnVal.replace(/(\r\n|\n|\r)/gm, "");
}

function galleryShortcode(content, name) {
    console.log(`[${PLUGIN_NAME}] "${name}"`);
    return `<div>
        <div class="pswp-gallery" id="gallery-${name}">
            ${content}
        </div>
        <script type="module">
            import PhotoSwipeLightbox from '/assets/js/photoswipe-lightbox.esm.min.js';
            import PhotoSwipe from '/assets/js/photoswipe.esm.min.js';
            const lightbox = new PhotoSwipeLightbox({
                gallery: '#gallery-${name}',
                children: 'a',
                showHideAnimationType: 'zoom',
                pswpModule: PhotoSwipe
            });
            lightbox.init();
        </script>
      </div>`
        .replace(/(\r\n|\n|\r)/gm, "");
}

export default function (eleventyConfig) {
    eleventyConfig.addPairedLiquidShortcode('gallery', galleryShortcode);
    eleventyConfig.addLiquidShortcode('galleryImage', galleryImageShortcode);
}
