import os
from PIL import Image, ImageFilter, ImageDraw

def extract_flavor_scoops():
    im = Image.open('Experiência Sensorial Dolcevia.png').convert('RGBA')
    # Bounding boxes for the 4 scoops
    # 1. Frutas Vermelhas
    c1 = im.crop((122, 706, 252, 836))
    # 2. Pistache Siciliano
    c2 = im.crop((274, 706, 404, 836))
    # 3. Chocolate Belga
    c3 = im.crop((420, 706, 550, 836))
    # 4. Maracuja com Ninho
    c4 = im.crop((570, 706, 700, 836))

    # For each scoop, create a circular feathered soft mask to isolate the scoop with transparent background
    def feather_cutout(crop_img):
        w, h = crop_img.size
        mask = Image.new('L', (w, h), 0)
        draw = ImageDraw.Draw(mask)
        # Circle covering the scoop
        draw.ellipse([6, 6, w - 6, h - 6], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(radius=3))
        crop_img.putalpha(mask)
        return crop_img

    c1 = feather_cutout(c1)
    c2 = feather_cutout(c2)
    c3 = feather_cutout(c3)
    c4 = feather_cutout(c4)

    os.makedirs('public/images/hero', exist_ok=True)
    c1.save('public/images/hero/flavor-frutas-vermelhas.webp', 'WEBP', quality=95)
    c2.save('public/images/hero/flavor-pistache.webp', 'WEBP', quality=95)
    c3.save('public/images/hero/flavor-chocolate.webp', 'WEBP', quality=95)
    c4.save('public/images/hero/flavor-maracuja.webp', 'WEBP', quality=95)
    print("Flavor scoops saved successfully!")

def extract_flying_strawberry():
    im = Image.open('Experiência Sensorial Dolcevia.png').convert('RGBA')
    # Strawberry coordinates
    crop = im.crop((602, 360, 736, 480))
    w, h = crop.size
    
    # We want to isolate the strawberry from the dark blue background
    # The strawberry is red/green/white, while background is dark teal/blue (R < 30, G < 60, B < 85)
    pixels = crop.load()
    mask = Image.new('L', (w, h), 0)
    m_pixels = mask.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Red strawberry has high R (R > 80 and R > B * 1.3)
            # Green leaves have G > R and G > 70
            # White core has R,G,B > 180
            is_strawberry = (r > 70 and r > b * 1.2) or (g > 70 and g > b * 1.1) or (r > 160 and g > 160)
            if is_strawberry:
                m_pixels[x, y] = 255

    # Dilate/smooth mask to avoid jagged edges
    mask = mask.filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.5))
    crop.putalpha(mask)
    bbox = crop.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    crop.save('public/images/hero/strawberry-flying.webp', 'WEBP', quality=95)
    print("Strawberry saved successfully!")

def extract_flying_raspberry():
    im = Image.open('Experiência Sensorial Dolcevia.png').convert('RGBA')
    crop = im.crop((1135, 665, 1245, 775))
    w, h = crop.size
    pixels = crop.load()
    mask = Image.new('L', (w, h), 0)
    m_pixels = mask.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Raspberry is bright pink/red (R > 100, R > B)
            if r > 85 and r > g * 1.3:
                m_pixels[x, y] = 255

    mask = mask.filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))
    crop.putalpha(mask)
    bbox = crop.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    crop.save('public/images/hero/raspberry-flying.webp', 'WEBP', quality=95)
    print("Raspberry saved successfully!")

def extract_flying_blueberry():
    im = Image.open('Experiência Sensorial Dolcevia.png').convert('RGBA')
    crop = im.crop((1095, 792, 1180, 875))
    w, h = crop.size
    pixels = crop.load()
    mask = Image.new('L', (w, h), 0)
    m_pixels = mask.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Blueberry is dark blue/purple (different from background cyan/teal)
            # Blueberry has center around (45, 40)
            dx = x - 44
            dy = y - 42
            if (dx*dx + dy*dy) < 32*32:
                m_pixels[x, y] = 255

    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.5))
    crop.putalpha(mask)
    bbox = crop.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    crop.save('public/images/hero/blueberry-flying.webp', 'WEBP', quality=95)
    print("Blueberry saved successfully!")

if __name__ == '__main__':
    extract_flavor_scoops()
    extract_flying_strawberry()
    extract_flying_raspberry()
    extract_flying_blueberry()
