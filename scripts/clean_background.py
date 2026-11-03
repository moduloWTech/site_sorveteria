from PIL import Image, ImageFilter, ImageDraw

def clean_hero_background():
    im = Image.open('Experiência Sensorial Dolcevia.png').convert('RGB')
    w, h = im.size
    
    # We will produce a pristine background by removing the text, buttons, and card overlays on the left.
    # The left background (x: 0 to 720) is a smooth atmospheric gradient with soft noise/particles.
    
    # Let's inspect the gradient profile from the clean left margin (x=20 to 60)
    bg_clean = im.copy()
    
    # 1. Clean the text areas on the left (x from 50 to 660, y from 170 to 650)
    # The background between x=0 and 650 is a smooth vertical/radial gradient:
    # Let's construct the base gradient for x: 0..660 based on clean column at x=40
    strip = im.crop((35, 0, 45, h)).resize((660, h), Image.Resampling.BILINEAR)
    
    # We only apply this to areas where text and buttons are located:
    # Header logo: x 100..260, y 40..135
    # Editorial text: x 100..660, y 180..650
    # Cards: x 100..730, y 660..870
    # Bottom scroll indicator: x 100..320, y 890..960
    # Right pagination '01 / 04': x 1410..1480, y 410..530
    
    # Let's create masks for these specific regions
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    
    # Logo area
    draw.rectangle([90, 40, 260, 135], fill=255)
    
    # Nav links in header: x 420..920, y 50..95
    # (Notice: nav links are over the top background, we can sample from y=25)
    draw.rectangle([410, 45, 930, 95], fill=255)
    
    # Header right buttons: x 1120..1430, y 35..105
    draw.rectangle([1120, 35, 1430, 105], fill=255)
    
    # Editorial text block
    draw.rectangle([90, 175, 620, 645], fill=255)
    
    # Cards block (Nossos Destaques + 4 cards)
    # Notice: behind the 4 cards at y: 660..870, x: 100..730
    draw.rectangle([90, 660, 720, 875], fill=255)
    
    # Scroll indicator
    draw.rectangle([90, 890, 320, 960], fill=255)
    
    # Right pagination indicator '01 / 04'
    draw.rectangle([1420, 410, 1485, 530], fill=255)
    
    # Blur the mask edges for smooth alpha blending
    mask_blurred = mask.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Replacement image for the left side (x < 720):
    # Smooth vertical gradient sampled from clean margin
    left_replacement = Image.new('RGB', (w, h))
    for y in range(h):
        # sample at x=30 and x=50
        c1 = im.getpixel((30, y))
        c2 = im.getpixel((50, y))
        color = ((c1[0] + c2[0]) // 2, (c1[1] + c2[1]) // 2, (c1[2] + c2[2]) // 2)
        # horizontal subtle lightening towards x=700
        for x in range(750):
            factor = 1.0 + (x / 750.0) * 0.25
            r = min(255, int(color[0] * factor))
            g = min(255, int(color[1] * factor))
            b = min(255, int(color[2] * factor))
            left_replacement.putpixel((x, y), (r, g, b))
            
    # For header nav (x 410..930, y 45..95), replace with smooth top gradient
    for y in range(35, 110):
        for x in range(400, 1450):
            # Sample y=25 or y=115
            cy = 20 if y < 70 else 115
            left_replacement.putpixel((x, y), im.getpixel((x, cy)))
            
    # For pagination (x 1420..1485, y 410..530), replace with background from x=1400, y
    for y in range(400, 540):
        for x in range(1410, 1495):
            left_replacement.putpixel((x, y), im.getpixel((1390, y)))

    # Composite using mask
    cleaned = Image.composite(left_replacement, im, mask_blurred)
    cleaned.save('/tmp/dolcevia_bg_cleaned.jpg', quality=95)
    cleaned.save('public/images/hero/hero-bg.webp', 'WEBP', quality=95)
    print("Cleaned background saved to public/images/hero/hero-bg.webp")

if __name__ == '__main__':
    clean_hero_background()
