-- TechVault Electronics Marketplace Seed Data
-- 15+ Brands, 15+ Categories, 50+ Products with Dynamic Specifications, Demo Users, Orders, Reviews, Coupons

USE techvault_db;

-- 1. SEED USERS
-- Password for all seed users is: Password123!
-- BCrypt hash: $2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu
INSERT INTO users (id, name, email, password, phone, role, status, avatar_url) VALUES
(1, 'Admin TechVault', 'admin@techvault.com', '$2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu', '+91 9876543210', 'ROLE_ADMIN', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Rahul Sharma', 'user@techvault.com', '$2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu', '+91 9876500001', 'ROLE_USER', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(3, 'Priya Patel', 'priya.patel@example.com', '$2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu', '+91 9876500002', 'ROLE_USER', 'ACTIVE', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(4, 'Ananya Verma', 'ananya.v@example.com', '$2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu', '+91 9876500003', 'ROLE_USER', 'ACTIVE', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
(5, 'Vikram Singh', 'vikram.s@example.com', '$2a$10$e8Zz2/o4iVj9rY.i9v5hku7rPz5pXW8Xz7UOz00F3iB76N17j44Iu', '+91 9876500004', 'ROLE_USER', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');

-- 2. SEED ADDRESSES
INSERT INTO addresses (id, user_id, full_name, phone, address_line, city, state, pincode, landmark, address_type, is_default) VALUES
(1, 2, 'Rahul Sharma', '+91 9876500001', 'Flat 402, Sunshine Heights, MG Road', 'Bengaluru', 'Karnataka', '560001', 'Near Trinity Metro', 'HOME', TRUE),
(2, 2, 'Rahul Sharma (Office)', '+91 9876500001', 'Tech Park Tower B, 6th Floor, Whitefield', 'Bengaluru', 'Karnataka', '560066', 'Opposite ITPL', 'WORK', FALSE),
(3, 3, 'Priya Patel', '+91 9876500002', '12B, Marine Drive Mansions', 'Mumbai', 'Maharashtra', '400020', 'Near Air India Building', 'HOME', TRUE);

-- 3. SEED BRANDS
INSERT INTO brands (id, name, slug, logo_url, description, active) VALUES
(1, 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'Pioneering technology devices, iPhones, MacBooks, and high-performance audio.', TRUE),
(2, 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 'Global leader in mobile innovation, OLED TVs, SSDs, and smart appliances.', TRUE),
(3, 'Sony', 'sony', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', 'Industry leading audio, PlayStation consoles, mirrorless cameras, and Bravia displays.', TRUE),
(4, 'ASUS', 'asus', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', 'Top gaming hardware, ROG gaming laptops, graphics cards, and motherboards.', TRUE),
(5, 'Dell', 'dell', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg', 'Engineered for power and productivity: XPS ultrabooks, Alienware, and UltraSharp displays.', TRUE),
(6, 'HP', 'hp', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_630x630.png', 'Reliable laptops, Omen gaming rigs, and high-precision peripherals.', TRUE),
(7, 'Lenovo', 'lenovo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg', 'Legendary ThinkPads, Legion gaming laptops, and high-versatility tablets.', TRUE),
(8, 'LG', 'lg', 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg', 'World class OLED displays, UltraGear gaming monitors, and smart home appliances.', TRUE),
(9, 'Bose', 'bose', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Bose_logo.svg', 'Acoustic excellence and world renowned active noise cancelling audio gear.', TRUE),
(10, 'Logitech', 'logitech', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Logitech_logo.svg', 'Precision mice, mechanical keyboards, webcams, and esports peripherals.', TRUE),
(11, 'NVIDIA', 'nvidia', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', 'GeForce RTX graphics cards powering ultra-high framerate gaming and AI computing.', TRUE),
(12, 'AMD', 'amd', 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', 'Ryzen processors and Radeon graphics delivering dominant desktop performance.', TRUE),
(13, 'Corsair', 'corsair', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Corsair_Components_logo.svg', 'Enthusiast PC power supplies, high-speed DDR5 RAM, AIO liquid coolers, and cases.', TRUE),
(14, 'OnePlus', 'oneplus', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_pos_2020.svg', 'Never Settle: flagship killer smartphones, oxygen OS fluidity, and fast charging.', TRUE),
(15, 'Razer', 'razer', 'https://upload.wikimedia.org/wikipedia/en/4/40/Razer_snake_logo.svg', 'For Gamers. By Gamers. Premium gaming peripherals, laptops, and blade designs.', TRUE);

-- 4. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, icon, display_order, active) VALUES
(1, 'Smartphones', 'smartphones', 'Next-generation flagship and performance mobile devices', 'Smartphone', 1, TRUE),
(2, 'Laptops', 'laptops', 'Ultra-portable notebooks, creator workstations, and gaming laptops', 'Laptop', 2, TRUE),
(3, 'Tablets', 'tablets', 'Versatile tablets for work, digital art, and entertainment', 'Tablet', 3, TRUE),
(4, 'TVs', 'tvs', '4K/8K OLED, QLED, and smart entertainment displays', 'Tv', 4, TRUE),
(5, 'Headphones', 'headphones', 'Over-ear active noise cancelling audiophile headphones', 'Headphones', 5, TRUE),
(6, 'Earbuds', 'earbuds', 'True wireless stereo earbuds with spatial audio', 'Disc', 6, TRUE),
(7, 'Smartwatches', 'smartwatches', 'Health tracking, GPS sports, and premium wearable tech', 'Watch', 7, TRUE),
(8, 'Cameras', 'cameras', 'Full-frame mirrorless cameras, vlog kits, and cine gear', 'Camera', 8, TRUE),
(9, 'Gaming Consoles', 'gaming-consoles', 'Next-gen gaming systems, controllers, and VR headsets', 'Gamepad2', 9, TRUE),
(10, 'PC Components', 'pc-components', 'CPUs, Motherboards, GPUs, RAM, PSUs, Cases and Coolers', 'Cpu', 10, TRUE),
(11, 'Monitors', 'monitors', 'High refresh rate gaming and color-accurate productivity monitors', 'Monitor', 11, TRUE),
(12, 'Keyboards & Mice', 'keyboards-mice', 'Mechanical keyboards, lightweight esports mice and desk pads', 'Keyboard', 12, TRUE),
(13, 'Speakers', 'speakers', 'Bluetooth portable speakers, soundbars, and home theatre systems', 'Volume2', 13, TRUE),
(14, 'Accessories', 'accessories', 'GaN fast chargers, Thunderbolt docks, cables, and sleeves', 'Plug', 14, TRUE),
(15, 'Networking', 'networking', 'Wi-Fi 7 / 6E mesh routers, high-speed switches, and NAS', 'Wifi', 15, TRUE);

-- 5. SEED PRODUCTS (50+ Real Electronics Products)
INSERT INTO products (id, name, slug, sku, short_description, description, brand_id, category_id, original_price, sale_price, discount_percent, stock, low_stock_threshold, status, rating, review_count, warranty, whats_in_box, main_image, is_featured, is_trending, is_flash_deal, is_new_arrival) VALUES
-- Smartphones
(1, 'Apple iPhone 16 Pro Max 256GB Desert Titanium', 'apple-iphone-16-pro-max-256gb', 'APL-IP16PM-256', 'Featuring titanium design, A18 Pro chip, 48MP Fusion camera system, and Camera Control.', 'The ultimate iPhone is here. Crafted in Grade 5 titanium with thin borders, the largest 6.9-inch Super Retina XDR display, breakthrough battery life, and pro camera controls with 5x telephoto optical zoom.', 1, 1, 144900.00, 137900.00, 5, 25, 5, 'IN_STOCK', 4.90, 38, '1 Year Apple Limited Warranty', 'iPhone 16 Pro Max, USB-C Charge Cable, Documentation', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', TRUE, TRUE, FALSE, TRUE),
(2, 'Samsung Galaxy S24 Ultra 5G 512GB Titanium Gray', 'samsung-galaxy-s24-ultra-512gb', 'SAM-S24U-512', 'Galaxy AI powered flagship with built-in S Pen, Snapdragon 8 Gen 3, and 200MP Quad Tele camera.', 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Built with Galaxy AI for effortless search, live translation, and note summarizing.', 2, 1, 139999.00, 124999.00, 11, 18, 4, 'IN_STOCK', 4.85, 42, '1 Year Comprehensive Samsung Warranty', 'Galaxy S24 Ultra, S Pen, Data Cable (Type-C to Type-C), Ejection Pin', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', TRUE, TRUE, TRUE, FALSE),
(3, 'OnePlus 12 5G 256GB Silky Black', 'oneplus-12-5g-256gb-black', 'OP-12-256-BLK', 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, and 5400mAh battery with 100W SUPERVOOC.', 'Experience elite performance with the OnePlus 12. Equipped with the latest Snapdragon 8 Gen 3 SoC, 2K 120Hz ProXDR display, dual cryo-velocity VC cooling, and 50W wireless charging.', 14, 1, 64999.00, 59999.00, 8, 30, 6, 'IN_STOCK', 4.70, 24, '1 Year Brand Warranty', 'OnePlus 12, 100W SUPERVOOC Power Adapter, Type-C Cable, Quick Guide, Case', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', FALSE, TRUE, FALSE, FALSE),
(4, 'Apple iPhone 15 128GB Blue', 'apple-iphone-15-128gb-blue', 'APL-IP15-128-BLU', 'Dynamic Island, 48MP Main camera, USB-C, and durable color-infused glass design.', 'iPhone 15 brings you the Dynamic Island, 48MP Main camera with 2x Telephoto, and all-day battery life in a durable color-infused glass and aluminum design with USB-C.', 1, 1, 79900.00, 65999.00, 17, 12, 5, 'IN_STOCK', 4.75, 56, '1 Year Apple Warranty', 'iPhone 15, USB-C Charge Cable, Documentation', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800', FALSE, FALSE, TRUE, FALSE),

-- Laptops
(5, 'Apple MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)', 'apple-macbook-pro-16-m3-max', 'APL-MBP16-M3MAX', 'M3 Max 14-core CPU, 30-core GPU, Liquid Retina XDR display, up to 22 hours battery life.', 'MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance for demanding workflows like 3D rendering, machine learning modeling, and 8K video editing.', 1, 2, 349900.00, 329900.00, 6, 8, 2, 'IN_STOCK', 4.95, 19, '1 Year Apple Limited Warranty', '16-inch MacBook Pro, 140W USB-C Power Adapter, USB-C to MagSafe 3 Cable (2 m)', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', TRUE, TRUE, FALSE, TRUE),
(6, 'ASUS ROG Zephyrus G16 (2024) OLED Gaming Laptop', 'asus-rog-zephyrus-g16-oled', 'ASUS-G16-RTX4080', 'Intel Core Ultra 9 185H, NVIDIA RTX 4080 12GB, 32GB LPDDR5X, 2TB SSD, 2.5K 240Hz OLED.', 'Precision machined aluminum chassis, ROG Nebula OLED 240Hz display, and dual-channel vapor chamber cooling. The undisputed king of ultraportable high-framerate gaming laptops.', 4, 2, 289990.00, 269990.00, 7, 6, 2, 'IN_STOCK', 4.88, 14, '2 Years Onsite Brand Warranty', 'ROG Zephyrus G16, 240W Adapter, ROG Impact Gaming Mouse, Sleeve', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', TRUE, TRUE, FALSE, TRUE),
(7, 'Dell XPS 14 (Core Ultra 7, 16GB RAM, 1TB SSD, OLED 3.2K)', 'dell-xps-14-core-ultra-7', 'DELL-XPS14-9440', 'Sleek CNC aluminum, 14.5-inch 3.2K OLED Touch, Intel Arc Graphics, Seamless glass touchpad.', 'Iconic minimalism meets high performance. Featuring an edge-to-edge glass touchpad with haptic feedback, capacitive touch function keys, and brilliant InfinityEdge OLED display.', 5, 2, 199990.00, 184990.00, 8, 10, 3, 'IN_STOCK', 4.68, 11, '1 Year Dell Premium Support', 'Dell XPS 14, 60W Type-C AC Adapter, USB-C to USB-A/HDMI dongle', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', FALSE, FALSE, FALSE, FALSE),
(8, 'Lenovo Legion Pro 7i Gen 9 (Intel i9-14900HX, RTX 4090 16GB)', 'lenovo-legion-pro-7i-gen-9', 'LEN-LEG7I-4090', 'Intel Core i9 14th Gen, RTX 4090 175W TGP, 32GB DDR5 5600MHz, 16" WQXGA 240Hz 500nits.', 'Engineered for competitive esports and extreme simulation. AI engine+ optimization, Legion ColdFront 5.0 vapor chamber, and TrueStrike RGB per-key mechanical keyboard.', 7, 2, 349990.00, 319990.00, 9, 4, 2, 'LOW_STOCK', 4.92, 16, '3 Years Legion Ultimate Support', 'Legion Pro 7i, 330W Slim Tip Power Adapter, Legion M300 RGB Gaming Mouse', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', TRUE, TRUE, TRUE, FALSE),

-- PC Components (CPUs, GPUs, Motherboards, RAM, PSUs)
(9, 'AMD Ryzen 7 7800X3D Desktop Processor (8-Core, 16-Thread)', 'amd-ryzen-7-7800x3d', 'AMD-RYZ7-7800X3D', 'The world''s best gaming processor with AMD 3D V-Cache technology. Socket AM5, up to 5.0GHz.', 'Dominant gaming CPU featuring 96MB of L3 3D V-Cache, Zen 4 5nm architecture, PCIe 5.0 readiness, and unmatched thermal and power efficiency for high FPS gameplay.', 12, 10, 44999.00, 38499.00, 14, 35, 8, 'IN_STOCK', 4.96, 75, '3 Years AMD Domestic Warranty', 'Ryzen 7 7800X3D Processor, Case Badge, Warranty Booklet', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800', TRUE, TRUE, FALSE, FALSE),
(10, 'ASUS ROG Strix GeForce RTX 4080 Super OC Edition 16GB GDDR6X', 'asus-rog-strix-rtx-4080-super-oc', 'ASUS-STX-4080S-OC', 'Ada Lovelace architecture, DLSS 3.5, 3.5-slot axial-tech fans, vented exoskeleton.', 'Delivers jaw-dropping ray-traced visuals and supercharged generative AI. Axial-tech fans scaled up for 23% more airflow and premium military-grade 15K capacitors.', 4, 10, 129999.00, 117999.00, 9, 7, 3, 'IN_STOCK', 4.91, 28, '3 Years ASUS Warranty', 'RTX 4080 Super Graphics Card, ROG Graphics Card Holder, ROG Velcro Hook-and-Loop, 16-pin Cable', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', TRUE, FALSE, FALSE, TRUE),
(11, 'Corsair Vengeance RGB DDR5 RAM 32GB (2x16GB) 6000MHz CL30', 'corsair-vengeance-rgb-ddr5-32gb-6000', 'COR-VENG-DDR5-32G', 'Optimized for Intel XMP & AMD EXPO with dynamic ten-zone RGB lighting and onboard voltage regulation.', 'Deliver higher frequencies and greater capacities of DDR5 technology in a compact, high-quality aluminum module with individually addressable RGB LEDs.', 13, 10, 14500.00, 11999.00, 17, 40, 10, 'IN_STOCK', 4.82, 33, 'Limited Lifetime Warranty', '2x 16GB Corsair DDR5 RAM Modules', 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800', FALSE, FALSE, FALSE, FALSE),
(12, 'Samsung 990 PRO NVMe M.2 SSD 2TB with Heatsink', 'samsung-990-pro-nvme-2tb-heatsink', 'SAM-SSD-990PRO-2TB', 'PCIe 4.0 NVMe speed up to 7450 MB/s read, 6900 MB/s write. PS5 and PC compatible.', 'Reach maximum performance with PCIe 4.0. The in-house controller''s smart heat control delivers top power efficiency while maintaining ferocious speed.', 2, 10, 24999.00, 18999.00, 24, 28, 5, 'IN_STOCK', 4.90, 51, '5 Years Manufacturer Warranty', 'Samsung 990 Pro 2TB SSD with Pre-installed Heatsink, User Manual', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800', FALSE, TRUE, TRUE, FALSE),
(13, 'Corsair RM1000x 1000W 80 PLUS Gold Fully Modular ATX Power Supply', 'corsair-rm1000x-power-supply', 'COR-PSU-RM1000X', 'Zero RPM fan mode, 105°C Japanese capacitors, PCIe 5.0 12VHPWR ready, fully modular cables.', 'Silent, efficient power for top-tier gaming rigs and AI workstations with ultra-low ripple noise and magnetic levitation cooling fan.', 13, 10, 19990.00, 16499.00, 17, 15, 4, 'IN_STOCK', 4.87, 22, '10 Years Corsair Warranty', 'RM1000x PSU, Modular Cable Pack, Cable Ties, Mounting Screws', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800', FALSE, FALSE, FALSE, FALSE),
(14, 'ASUS ROG Maximus Z790 Dark Hero Motherboard', 'asus-rog-maximus-z790-dark-hero', 'ASUS-MB-Z790-DHERO', 'LGA1700, PCIe 5.0, Wi-Fi 7, 20+1+2 Power Stages, 5x M.2 Slots, USB4 Thunderbolt 4.', 'Unbridled overclocking and robust power delivery tailored for Intel Core 14th and 13th Gen desktop processors.', 4, 10, 78990.00, 71990.00, 9, 8, 2, 'IN_STOCK', 4.79, 9, '3 Years ASUS Warranty', 'Motherboard, Wi-Fi 7 Antenna, SATA Cables, ROG Stickers, USB Driver Flash Drive', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', FALSE, FALSE, FALSE, FALSE),

-- Audio (Headphones & Earbuds & Speakers)
(15, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'sony-wh-1000xm5-silver', 'SNY-WH1000XM5-SLV', 'Industry-leading noise cancellation with 8 microphones, Auto NC Optimizer, 30 hours battery.', 'With two processors controlling 8 microphones, Auto NC Optimizer for automatically optimizing noise cancelling, and specially designed 30mm carbon fiber driver unit.', 3, 5, 34990.00, 26990.00, 23, 22, 5, 'IN_STOCK', 4.85, 89, '1 Year Sony India Warranty', 'Sony WH-1000XM5 Headphones, Collapsible Carrying Case, 3.5mm Cable, USB-C Charging Cable', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', TRUE, TRUE, TRUE, FALSE),
(16, 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones', 'bose-quietcomfort-ultra-black', 'BOS-QCU-BLK', 'Bose Immersive Audio spatialized sound, CustomTune technology, world-class active noise cancellation.', 'Groundbreaking spatial audio for more immersive listening that makes your music feel realer than ever before. Supreme comfort and luxe materials.', 9, 5, 35900.00, 31900.00, 11, 14, 4, 'IN_STOCK', 4.80, 31, '1 Year Bose Brand Warranty', 'Bose QC Ultra Headphones, Carry Case, Audio Cable, USB-C Cable', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', FALSE, TRUE, FALSE, TRUE),
(17, 'Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)', 'apple-airpods-pro-2nd-gen-usbc', 'APL-APP2-USBC', 'H2 chip, Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio.', 'Next-level Active Noise Cancellation and Transparency mode. Dynamic head tracking places sound all around you, with touch control swipe for volume adjustment.', 1, 6, 24900.00, 20999.00, 16, 45, 10, 'IN_STOCK', 4.92, 120, '1 Year Apple Warranty', 'AirPods Pro, MagSafe Charging Case (USB-C), Silicone ear tips (4 sizes), Braided USB-C Cable', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', TRUE, TRUE, FALSE, FALSE),
(18, 'Sony WF-1000XM5 True Wireless Noise Cancelling Earbuds', 'sony-wf-1000xm5-black', 'SNY-WF1000XM5-BLK', 'Dynamic Driver X, Integrated Processor V2 + HD Noise Cancelling Processor QN2e, LDAC Hi-Res Audio.', 'The best noise cancelling earbuds with premium sound quality and crystal-clear call quality through AI bone conduction sensors.', 3, 6, 29990.00, 21990.00, 27, 20, 5, 'IN_STOCK', 4.74, 46, '1 Year Sony Warranty', 'WF-1000XM5 Earbuds, Charging Case, Noise Isolation Earbud Tips (SS/S/M/L), USB-C Cable', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', FALSE, FALSE, TRUE, FALSE),

-- TVs & Displays & Monitors
(19, 'LG OLED evo C4 65-inch 4K Smart TV (2024 OLED65C4)', 'lg-oled-evo-c4-65-inch', 'LG-OLED65C4-2024', 'Self-lit OLED pixels, alpha 9 AI Processor 4K Gen7, 144Hz VRR, Dolby Vision & Atmos, webOS 24.', 'Experience vibrant pictures with brightness booster, infinite contrast, and ultra-smooth gaming with 0.1ms response time, NVIDIA G-Sync, and AMD FreeSync Premium.', 8, 4, 249990.00, 189990.00, 24, 7, 2, 'IN_STOCK', 4.93, 27, '3 Years Comprehensive LG Warranty', '65" C4 OLED TV, Magic Remote with Batteries, Power Cable, Stand, Wall Mount Brackets', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', TRUE, TRUE, FALSE, TRUE),
(20, 'Samsung 65-inch Neo QLED 4K QN90D Smart TV', 'samsung-65-neo-qled-qn90d', 'SAM-65QN90D-4K', 'Quantum Matrix Technology Mini LED, NQ4 AI Gen2 Processor, Neo Quantum HDR+, Anti-Glare.', 'Mini LED precision lighting provides spectacular details in both dark and bright scenes with AI-enhanced 4K upscaling and Dolby Atmos 3D object tracking sound.', 2, 4, 219990.00, 169990.00, 23, 9, 3, 'IN_STOCK', 4.81, 18, '2 Years Samsung Warranty', '65" QN90D TV, SolarCell Remote, Power Cable, Slim One Connect Stand', 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800', FALSE, FALSE, FALSE, FALSE),
(21, 'ASUS ROG Swift OLED PG32UCDM 32-inch 4K 240Hz Gaming Monitor', 'asus-rog-swift-oled-pg32ucdm', 'ASUS-PG32UCDM-OLED', '32" QD-OLED, 4K UHD (3840x2160), 240Hz, 0.03ms GTG, G-Sync compatible, Custom Heatsink.', 'The holy grail of gaming monitors: third-generation QD-OLED panel delivering razor-sharp text, 99% DCI-P3 gamut, Dolby Vision, and blazing 240Hz refresh rate with uniform brightness.', 4, 11, 149990.00, 134990.00, 10, 5, 2, 'LOW_STOCK', 4.97, 15, '3 Years Warranty with OLED Burn-in Coverage', 'ROG OLED Monitor, DisplayPort Cable, HDMI 2.1 Cable, USB 3.2 Cable, Power Cord, Color Calibration Report', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', TRUE, TRUE, FALSE, TRUE),
(22, 'Dell UltraSharp 32-inch 4K IPS Black Monitor (U3224KB 6K)', 'dell-ultrasharp-32-4k-ips-black', 'DELL-U3224KB-4K', 'IPS Black technology 2000:1 contrast ratio, 98% DCI-P3, 140W Thunderbolt 4 hub, 4K HDR webcam.', 'Designed for professionals demanding uncompromising color precision and connectivity. Built-in 4K Sony Starvis webcam and auto KVM switch.', 5, 11, 89990.00, 79990.00, 11, 11, 3, 'IN_STOCK', 4.76, 21, '3 Years Dell Advanced Exchange Service', 'Monitor Stand, Thunderbolt 4 Cable, DisplayPort Cable, Power Cable', 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800', FALSE, FALSE, FALSE, FALSE),

-- Gaming Consoles & Peripherals
(23, 'Sony PlayStation 5 Slim Console (1TB SSD Disc Edition)', 'sony-playstation-5-slim-disc', 'SNY-PS5-SLIM-DISC', 'Ultra-high speed 1TB SSD, Ray Tracing, 4K-TV Gaming up to 120fps, HDR technology, DualSense.', 'Slimmer design with more storage. Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and breathtaking new PS5 games.', 3, 9, 54990.00, 49990.00, 9, 30, 8, 'IN_STOCK', 4.94, 105, '1 Year Sony India Warranty', 'PS5 Console, DualSense Wireless Controller, 1TB SSD, 2 Horizontal Stand Feet, HDMI Cable, AC Power Cord', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800', TRUE, TRUE, FALSE, FALSE),
(24, 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse', 'logitech-g-pro-x-superlight-2-black', 'LOG-GPX-SL2-BLK', '60g ultra-lightweight, HERO 2 32K Sensor, LIGHTFORCE hybrid optical-mechanical switches, 95h battery.', 'Engineered with the world''s top esports pros to eliminate all barriers to victory. Features 44,000 DPI tracking and 2000Hz polling rate via LIGHTSPEED wireless.', 10, 12, 16995.00, 13995.00, 18, 25, 5, 'IN_STOCK', 4.89, 44, '2 Years Logitech Warranty', 'G PRO X Superlight 2 Mouse, LIGHTSPEED Wireless Receiver, USB-A to C Charging Cable, PTFE Foot with Grip Tape', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', TRUE, FALSE, TRUE, FALSE),
(25, 'Razer BlackWidow V4 Pro Mechanical Gaming Keyboard', 'razer-blackwidow-v4-pro-green-switch', 'RAZ-BW-V4PRO-GRN', 'Razer Green Clicky Switches, Command Dial, 8 dedicated macro keys, magnetic plush wrist rest with underglow.', 'The full-blown battle station hub. Take control with an advanced command dial, 8,000Hz hyperpolling rate, and vibrant 3-sided chassis lighting.', 15, 12, 24999.00, 20999.00, 16, 14, 4, 'IN_STOCK', 4.77, 19, '2 Years Razer Warranty', 'BlackWidow V4 Pro Keyboard, Detachable Type-C Cables, Magnetic Leatherette Wrist Rest', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', FALSE, FALSE, FALSE, FALSE),

-- Wearables & Cameras
(26, 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium', 'apple-watch-ultra-2-titanium', 'APL-WAT-ULTRA2-TI', 'S9 SiP chip, 3000 nits brightness display, 36-hour normal battery life, precision dual-frequency GPS.', 'The most capable and rugged Apple Watch. Built for endurance athletes, outdoor adventurers, and ocean divers with a 49mm aerospace-grade titanium case and Action Button.', 1, 7, 89900.00, 84900.00, 6, 12, 3, 'IN_STOCK', 4.90, 34, '1 Year Apple Warranty', 'Titanium Case, Trail Loop / Ocean Band, Apple Watch Magnetic Fast Charger to USB-C Cable', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', TRUE, FALSE, FALSE, TRUE),
(27, 'Samsung Galaxy Watch6 Classic 47mm LTE Black', 'samsung-galaxy-watch6-classic-47mm', 'SAM-WAT6-CLASSIC-47', 'Rotating physical bezel, Sapphire Crystal glass, Body Composition analysis, sleep coach.', 'A timeless icon with rotating bezel and a 20% larger display. Track workouts, sleep stages, ECG, and blood pressure on your wrist.', 2, 7, 43999.00, 32999.00, 25, 16, 4, 'IN_STOCK', 4.69, 29, '1 Year Samsung Warranty', 'Galaxy Watch6 Classic, Hybrid Eco-Leather Band, Wireless Fast Charger', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', FALSE, FALSE, TRUE, FALSE),
(28, 'Sony Alpha 7 IV Full-Frame Mirrorless Camera (Body Only)', 'sony-alpha-7-iv-camera-body', 'SNY-ILCE-7M4-BODY', '33MP Exmor R CMOS sensor, BIONZ XR processing, Real-time Eye AF for Humans/Animals/Birds, 4K 60p 10-bit.', 'The definitive hybrid camera. Groundbreaking still imaging and high-grade 4K cinematic video recording with S-Cinetone and 15+ stops dynamic range.', 3, 8, 242990.00, 209990.00, 14, 6, 2, 'IN_STOCK', 4.93, 23, '2 Years Sony India Warranty', 'Alpha 7 IV Body, Rechargeable Battery NP-FZ100, AC Adapter, Shoulder Strap, Body Cap, Shoe Cap', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', TRUE, TRUE, FALSE, FALSE);

-- 6. SEED PRODUCT SPECIFICATIONS (DYNAMIC KEY-VALUE SPEC SYSTEM)
INSERT INTO product_specifications (product_id, spec_group, spec_name, spec_value, is_highlighted, display_order) VALUES
-- iPhone 16 Pro Max specs
(1, 'General', 'Model', 'iPhone 16 Pro Max', TRUE, 1),
(1, 'General', 'Operating System', 'iOS 18', FALSE, 2),
(1, 'Performance', 'Processor', 'Apple A18 Pro (3nm)', TRUE, 3),
(1, 'Performance', 'RAM', '8GB Unified', TRUE, 4),
(1, 'Performance', 'Storage', '256GB NVMe', TRUE, 5),
(1, 'Display', 'Display Size', '6.9 inch Super Retina XDR OLED', TRUE, 6),
(1, 'Display', 'Refresh Rate', '120Hz ProMotion', TRUE, 7),
(1, 'Camera', 'Rear Camera', '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto', TRUE, 8),
(1, 'Camera', 'Front Camera', '12MP TrueDepth', FALSE, 9),
(1, 'Battery', 'Battery Capacity', '4685 mAh', FALSE, 10),
(1, 'Connectivity', '5G / Wi-Fi', '5G Sub-6/mmWave, Wi-Fi 7, Bluetooth 5.3', FALSE, 11),

-- Galaxy S24 Ultra specs
(2, 'General', 'Model', 'Galaxy S24 Ultra 5G', TRUE, 1),
(2, 'General', 'Operating System', 'Android 14, One UI 6.1 (7 Years OS Updates)', FALSE, 2),
(2, 'Performance', 'Processor', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)', TRUE, 3),
(2, 'Performance', 'RAM', '12GB LPDDR5X', TRUE, 4),
(2, 'Performance', 'Storage', '512GB UFS 4.0', TRUE, 5),
(2, 'Display', 'Display Size', '6.8 inch Dynamic AMOLED 2X Flat', TRUE, 6),
(2, 'Display', 'Peak Brightness', '2600 nits, 120Hz LTPO', TRUE, 7),
(2, 'Camera', 'Rear Camera', '200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP UW', TRUE, 8),
(2, 'Battery', 'Battery Capacity', '5000 mAh, 45W Wired Fast Charging', FALSE, 9),

-- MacBook Pro 16 M3 Max specs
(5, 'General', 'Model', 'MacBook Pro 16" (Late 2023)', TRUE, 1),
(5, 'Performance', 'Processor', 'Apple M3 Max (14-Core CPU, 30-Core GPU)', TRUE, 2),
(5, 'Performance', 'RAM', '36GB Unified Memory', TRUE, 3),
(5, 'Performance', 'Storage', '1TB High-Speed SSD', TRUE, 4),
(5, 'Display', 'Display', '16.2 inch Liquid Retina XDR (3456x2234), 1600 nits peak', TRUE, 5),
(5, 'Display', 'Refresh Rate', '120Hz ProMotion', TRUE, 6),
(5, 'Battery', 'Battery Life', 'Up to 22 hours Apple TV playback, 100Wh', TRUE, 7),
(5, 'Ports', 'I/O Ports', '3x Thunderbolt 4 (USB-C), HDMI 2.1, SDXC Slot, MagSafe 3', FALSE, 8),

-- Zephyrus G16 OLED specs
(6, 'General', 'Model', 'ROG Zephyrus G16 GU605', TRUE, 1),
(6, 'Performance', 'Processor', 'Intel Core Ultra 9 185H (16 Cores, 22 Threads, up to 5.1GHz)', TRUE, 2),
(6, 'Performance', 'GPU', 'NVIDIA GeForce RTX 4080 Laptop GPU 12GB GDDR6 (115W TGP)', TRUE, 3),
(6, 'Performance', 'RAM', '32GB LPDDR5X 7467MHz Dual Channel', TRUE, 4),
(6, 'Performance', 'Storage', '2TB PCIe 4.0 NVMe M.2 SSD', TRUE, 5),
(6, 'Display', 'Display', '16.0-inch 2.5K (2560x1600) ROG Nebula OLED, 240Hz, 0.2ms', TRUE, 6),
(6, 'Dimensions & Weight', 'Weight', '1.85 kg ultra-slim CNC chassis', FALSE, 7),

-- PC Components Specs (AMD Ryzen 7 7800X3D)
(9, 'General', 'Socket', 'AM5', TRUE, 1),
(9, 'Performance', 'Cores / Threads', '8 Cores, 16 Threads', TRUE, 2),
(9, 'Performance', 'Base / Boost Clock', '4.2 GHz / 5.0 GHz', TRUE, 3),
(9, 'Performance', 'L3 Cache', '96MB AMD 3D V-Cache + 8MB L2 (104MB total)', TRUE, 4),
(9, 'Thermal & Power', 'TDP', '120W', TRUE, 5),
(9, 'Memory Support', 'RAM Type', 'DDR5 Dual Channel', TRUE, 6),

-- RTX 4080 Super specs
(10, 'General', 'Architecture', 'NVIDIA Ada Lovelace (4N TSMC)', TRUE, 1),
(10, 'Performance', 'CUDA Cores', '10240 Cores', TRUE, 2),
(10, 'Performance', 'VRAM', '16GB GDDR6X 256-bit', TRUE, 3),
(10, 'Performance', 'Boost Clock', '2640 MHz (OC Mode)', TRUE, 4),
(10, 'Dimensions & Power', 'Dimensions', '357.6 x 149.3 x 70.1 mm (3.5 Slot)', TRUE, 5),
(10, 'Dimensions & Power', 'Recommended PSU', '850W minimum with 16-pin 12VHPWR', TRUE, 6),

-- Corsair DDR5 RAM specs
(11, 'General', 'Memory Type', 'DDR5 Desktop UDIMM', TRUE, 1),
(11, 'Performance', 'Capacity', '32GB Kit (2 x 16GB)', TRUE, 2),
(11, 'Performance', 'Speed', 'DDR5-6000 MHz', TRUE, 3),
(11, 'Performance', 'Timing / Latency', 'CL30 (30-36-36-76)', TRUE, 4),
(11, 'Power & Lighting', 'Voltage / RGB', '1.40V, Dynamic 10-Zone RGB, iCUE Compatible', FALSE, 5),

-- Sony WH-1000XM5 specs
(15, 'General', 'Form Factor', 'Over-Ear Wireless ANC', TRUE, 1),
(15, 'Audio', 'Driver Unit', '30mm Carbon Fiber Composite Dome', TRUE, 2),
(15, 'Audio', 'Frequency Response', '4 Hz - 40,000 Hz (Hi-Res Audio LDAC)', TRUE, 3),
(15, 'Noise Cancellation', 'Noise Cancelling', 'Dual Processors (V1 + QN1) & 8 Microphones', TRUE, 4),
(15, 'Battery', 'Battery Life', '30 hours with ANC ON (40 hours ANC OFF)', TRUE, 5),
(15, 'Connectivity', 'Bluetooth Version', 'Bluetooth 5.2 (Multipoint 2 Devices)', FALSE, 6),

-- LG OLED C4 specs
(19, 'Display', 'Screen Size', '65 inch (164 cm)', TRUE, 1),
(19, 'Display', 'Display Type', '4K Self-lit OLED evo (3840 x 2160)', TRUE, 2),
(19, 'Display', 'Refresh Rate', '144Hz Native VRR', TRUE, 3),
(19, 'Processing', 'Processor', 'alpha 9 AI Processor 4K Gen7', TRUE, 4),
(19, 'Gaming', 'Gaming Features', 'NVIDIA G-Sync, AMD FreeSync Premium, 0.1ms, 4x HDMI 2.1', TRUE, 5),
(19, 'Audio', 'Speaker System', '2.2 Channel 40W, Dolby Atmos, AI Sound Pro', FALSE, 6);

-- 7. SEED COUPONS
INSERT INTO coupons (id, code, discount_type, discount_value, minimum_order, maximum_discount, start_date, expiry_date, usage_limit, per_user_limit, times_used, active) VALUES
(1, 'WELCOME10', 'PERCENTAGE', 10.00, 2000.00, 2500.00, '2024-01-01 00:00:00', '2027-12-31 23:59:59', 10000, 1, 14, TRUE),
(2, 'TECHVAULT2000', 'FIXED', 2000.00, 25000.00, 2000.00, '2024-01-01 00:00:00', '2027-12-31 23:59:59', 5000, 1, 8, TRUE),
(3, 'GAMING5', 'PERCENTAGE', 5.00, 50000.00, 10000.00, '2024-01-01 00:00:00', '2027-12-31 23:59:59', 2000, 2, 5, TRUE),
(4, 'FESTIVE500', 'FIXED', 500.00, 5000.00, 500.00, '2024-01-01 00:00:00', '2027-12-31 23:59:59', 50000, 3, 22, TRUE);

-- 8. SEED ORDERS & PAYMENTS
INSERT INTO orders (id, order_number, user_id, address_id, shipping_full_name, shipping_phone, shipping_address_line, shipping_city, shipping_state, shipping_pincode, subtotal, discount_amount, tax_amount, shipping_fee, total_amount, status, payment_status, payment_method, coupon_code, tracking_number, carrier_name, estimated_delivery, created_at) VALUES
(1, 'ORD-2024-88391', 2, 1, 'Rahul Sharma', '+91 9876500001', 'Flat 402, Sunshine Heights, MG Road', 'Bengaluru', 'Karnataka', '560001', 26990.00, 500.00, 4768.20, 0.00, 31258.20, 'DELIVERED', 'PAID', 'CREDIT_CARD', 'FESTIVE500', 'TRK-BLR-99281', 'BlueDart Express', '2024-09-20 14:00:00', '2024-09-18 10:30:00'),
(2, 'ORD-2024-91204', 2, 1, 'Rahul Sharma', '+91 9876500001', 'Flat 402, Sunshine Heights, MG Road', 'Bengaluru', 'Karnataka', '560001', 137900.00, 2500.00, 24372.00, 0.00, 159772.00, 'SHIPPED', 'PAID', 'UPI', 'WELCOME10', 'TRK-EXP-44019', 'Delhivery Surface', '2024-09-29 18:00:00', '2024-09-25 15:45:00'),
(3, 'ORD-2024-95412', 3, 3, 'Priya Patel', '+91 9876500002', '12B, Marine Drive Mansions', 'Mumbai', 'Maharashtra', '400020', 20999.00, 0.00, 3779.82, 0.00, 24778.82, 'CONFIRMED', 'PAID', 'NET_BANKING', NULL, 'TRK-MUM-77182', 'BlueDart Express', '2024-10-01 12:00:00', '2024-09-26 11:20:00');

INSERT INTO order_items (id, order_id, product_id, product_name, product_image, sku, unit_price, quantity, total_price) VALUES
(1, 1, 15, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', 'SNY-WH1000XM5-SLV', 26990.00, 1, 26990.00),
(2, 2, 1, 'Apple iPhone 16 Pro Max 256GB Desert Titanium', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'APL-IP16PM-256', 137900.00, 1, 137900.00),
(3, 3, 17, 'Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', 'APL-APP2-USBC', 20999.00, 1, 20999.00);

INSERT INTO payments (id, order_id, user_id, amount, provider, transaction_id, status, payment_method, gateway_response) VALUES
(1, 1, 2, 31258.20, 'TECHVAULT_GATEWAY', 'TXN_BLR_9921827361', 'SUCCESS', 'CREDIT_CARD', '{"status":"captured","method":"visa","auth_code":"AUTH99281"}'),
(2, 2, 2, 159772.00, 'TECHVAULT_GATEWAY', 'TXN_BLR_8819273645', 'SUCCESS', 'UPI', '{"status":"captured","vpa":"rahul@okhdfcbank","auth_code":"UPI8829"}'),
(3, 3, 3, 24778.82, 'TECHVAULT_GATEWAY', 'TXN_MUM_7719283741', 'SUCCESS', 'NET_BANKING', '{"status":"captured","bank":"HDFC","auth_code":"NET9928"}');

-- 9. SEED REVIEWS
INSERT INTO reviews (id, product_id, user_id, rating, title, comment, is_verified_purchase, status) VALUES
(1, 15, 2, 5, 'Unmatched Noise Cancellation & Comfort', 'Upgraded from the XM3 and the difference in ANC and vocal isolation is astonishing! The battery lasts all week with my daily office commute.', TRUE, 'APPROVED'),
(2, 1, 2, 5, 'Peak Apple Engineering', 'The Desert Titanium finish looks subtle and gorgeous. Camera Control button makes switching exposure and zoom modes effortless during travel.', TRUE, 'APPROVED'),
(3, 6, 3, 5, 'Best gaming laptop display on the market', 'The 240Hz OLED is mind-blowing. Zero ghosting and vivid colors. Plays Cyberpunk 2077 with ray tracing smoothly above 90 fps.', TRUE, 'APPROVED'),
(4, 9, 4, 5, 'Unstoppable gaming FPS', 'Paired this 7800X3D with my RTX 4080 and 1% lows in Warzone and Valorant skyrocketed. Extremely cool power draw too.', TRUE, 'APPROVED'),
(5, 17, 3, 5, 'Adaptive Audio is magic', 'Seamlessly cuts construction noise on the street while keeping voices audible. The USB-C case is finally here!', TRUE, 'APPROVED');

-- 10. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, is_read, link) VALUES
(1, 2, 'Order Delivered Successfully!', 'Your order #ORD-2024-88391 containing Sony WH-1000XM5 has been delivered to your Bangalore address.', 'ORDER_UPDATE', TRUE, '/orders/1'),
(2, 2, 'Package In Transit', 'Order #ORD-2024-91204 has been dispatched via Delhivery. Tracking Number: TRK-EXP-44019.', 'ORDER_UPDATE', FALSE, '/orders/2'),
(3, 1, 'Low Stock Alert', 'Product "Lenovo Legion Pro 7i" stock dropped to 4 units (Threshold: 2). Restock recommended.', 'STOCK_ALERT', FALSE, '/admin/inventory'),
(4, 2, 'Welcome to TechVault!', 'Thank you for joining TechVault. Enjoy flat 10% off on your first order with coupon code WELCOME10.', 'PROMO', TRUE, '/');

-- 11. SEED CONTACT MESSAGES
INSERT INTO contact_messages (id, name, email, subject, message, status, admin_notes) VALUES
(1, 'Amit Deshmukh', 'amit.d@gmail.com', 'Bulk purchase inquiry for office workstations', 'Hello TechVault team, we are planning to procure 25 units of Dell XPS 14 laptops for our design studio. Could you share B2B quotation?', 'NEW', NULL),
(2, 'Sneha Rao', 'sneha.rao@outlook.com', 'Inquiry regarding warranty extension', 'I purchased the Sony WH-1000XM5 last week. How can I register for the additional 1-year extended warranty on Sony portal?', 'RESOLVED', 'Assisted customer with direct Sony India registration link via email.');
