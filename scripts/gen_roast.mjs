import fs from 'fs';

async function generate(promptText, filename, seed = Math.floor(Math.random() * 100000)) {
  const prompt = encodeURIComponent(promptText);
  const url = `https://image.pollinations.ai/prompt/${prompt}?model=flux&seed=${seed}&width=1024&height=1024&nologo=true`;
  console.log(`Generating ${filename} with prompt: ${promptText.slice(0, 60)}...`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed ${filename}:`, res.status);
    return false;
  }
  const buf = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buf));
  console.log(`Saved ${filename} (${buf.byteLength} bytes)`);
  return true;
}

async function main() {
  const target = process.argv[2];
  if (target === 'neon') {
    await generate(
      'A real wedding neon sign with illuminated cursive letters spelling "Better Together" in warm white light, mounted on a lush dark green plant hedge wall, crisp clear legible English typography, cinematic wedding photography, 8k resolution, award winning shot',
      'src/assets/catalog/fiesta-neon-sign.jpg',
      4219
    );
  } else if (target === 'welcome') {
    await generate(
      'An elegant wooden wedding welcome sign on a dark wood tripod easel stand with white calligraphic lettering that clearly reads "Welcome to Our Beginning", decorated with white roses and eucalyptus greenery at the entrance of a luxury wedding venue, 8k photo',
      'src/assets/catalog/fiesta-welcome-easel.jpg',
      9912
    );
  } else if (target === 'clock') {
    await generate(
      'A modern geometric laser cut wooden wall clock made of natural oak wood with intricate hexagonal lattice cutouts and black metal hands, hanging on a minimalist white plaster wall, studio interior design photography, sharp crisp details',
      'src/assets/catalog/wood-wall-clock.jpg',
      5531
    );
  } else if (target === 'coasters') {
    await generate(
      'A set of 6 hexagonal laser cut natural walnut wood drink coasters with intricate geometric sacred geometry mandala engravings, stacked neatly on a clean marble coffee table next to a glass tumbler, crisp macro product photography',
      'src/assets/catalog/wood-geometric-coasters.jpg',
      8812
    );
  } else if (target === 'organizer') {
    await generate(
      'A premium handcrafted solid oak desktop organizer caddy with phone docking slot, pen holders, business card grove, and valet tray for keys and watch, sitting on a modern clean computer desk, architectural digest product photo',
      'src/assets/catalog/wood-desk-organizer.jpg',
      3311
    );
  } else if (target === 'lamp') {
    await generate(
      'A minimalist Scandinavian warm LED night lamp with laser-cut curved plywood layers and soft diffused warm ambient glow, placed on a bedside table, warm cozy mood lighting, sharp product photo',
      'src/assets/catalog/wood-night-lamp.jpg',
      1124
    );
  } else if (target === 'donuts') {
    await generate(
      'A bakery display of 6 gourmet artisanal baked keto gluten-free donuts with dark chocolate glaze, pistachios, and salted caramel drizzle, displayed on a rustic slate board in a luxury cafe, mouth-watering food photography, 8k macro',
      'src/assets/catalog/dessert-baked-donuts.jpg',
      7731
    );
  } else if (target === 'energy') {
    await generate(
      'A bowl of organic no-bake protein energy balls coated in shredded coconut, chia seeds, and raw cacao powder, on a clean wooden table with almonds and dates around, healthy gourmet fitness snack photography',
      'src/assets/catalog/dessert-energy-balls.jpg',
      6641
    );
  } else if (target === 'centerpiece') {
    await generate(
      'An exquisite luxury wedding table floral centerpiece with dusty rose peonies, white ranunculus, and eucalyptus in a gold compote vase, arranged with taper candles on a banquet dining table, luxury event photography',
      'src/assets/catalog/fiesta-floral-centerpiece.jpg',
      2291
    );
  } else if (target === 'photocall') {
    await generate(
      'A giant custom laser-cut wooden Polaroid photocall frame for wedding guests, with crisp engraved English text "Best Day Ever" at the bottom, surrounded by romantic floral blooms and fairy lights at a party venue, high quality photography',
      'src/assets/catalog/fiesta-photocall-frame.jpg',
      4410
    );
  } else if (target === 'favors') {
    await generate(
      'A set of 12 luxury laser cut kraft paper gift favor boxes with delicate floral filigree cutouts and satin blush ribbon bows, arranged on a party dessert table, sharp crisp macro event details',
      'src/assets/catalog/fiesta-favor-boxes.jpg',
      8820
    );
  } else if (target === 'dino') {
    await generate(
      'A vibrant dual-color rainbow silk PLA 3D printed articulated flexi dinosaur toy with movable segments, sitting on a clean designer workbench with a 3D printer visible softly in background, sharp toy photography',
      'src/assets/catalog/toy-flexi-dino.jpg',
      5519
    );
  } else if (target === 'cube') {
    await generate(
      'A metallic titanium-colored 3D printed infinity cube fidget toy unfolded in hand on a modern dark desk, showing intricate mechanical hinges and clean layer lines, high-tech EDC gear photography',
      'src/assets/catalog/toy-infinity-cube.jpg',
      9931
    );
  } else if (target === 'robot') {
    await generate(
      'A vintage retro-futuristic articulated robot figurine 3D printed in matte grey and orange accent filament with mechanical joints, posing heroically on an acrylic display stand, collector toy photography',
      'src/assets/catalog/toy-retro-robot.jpg',
      1283
    );
  } else if (target === 'gyro') {
    await generate(
      'A 3D printed precision kinetic triple-ring gimbal gyroscope spinner toy with smooth ball bearings, spinning motion blur effect, futuristic desk gadget photography',
      'src/assets/catalog/toy-kinetic-gyro.jpg',
      8841
    );
  } else if (target === 'statue') {
    await generate(
      'A detailed resin 3D printed fantasy guardian knight figurine miniature in dynamic pose with cape and sword, painted with subtle zenithal shading, tabletop RPG tabletop photography, 8k resolution',
      'src/assets/catalog/toy-guardian-statue.jpg',
      7712
    );
  }
}

main();
