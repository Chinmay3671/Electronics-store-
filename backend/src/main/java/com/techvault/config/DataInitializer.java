package com.techvault.config;

import com.techvault.entity.*;
import com.techvault.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized with data.");
            return;
        }

        logger.info("Starting TechVault Database Seeding...");

        // 1. Create Users
        String encodedPassword = passwordEncoder.encode("Password123!");

        User admin = new User("Admin TechVault", "admin@techvault.com", encodedPassword, "+91 9876543210", "ROLE_ADMIN");
        admin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        userRepository.save(admin);

        User user = new User("Rahul Sharma", "user@techvault.com", encodedPassword, "+91 9876500001", "ROLE_USER");
        user.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        User savedUser = userRepository.save(user);

        User user2 = new User("Priya Patel", "priya.patel@example.com", encodedPassword, "+91 9876500002", "ROLE_USER");
        user2.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        User savedUser2 = userRepository.save(user2);

        // 2. Addresses
        Address addr1 = new Address();
        addr1.setUser(savedUser);
        addr1.setFullName("Rahul Sharma");
        addr1.setPhone("+91 9876500001");
        addr1.setAddressLine("Flat 402, Sunshine Heights, MG Road");
        addr1.setCity("Bengaluru");
        addr1.setState("Karnataka");
        addr1.setPincode("560001");
        addr1.setLandmark("Near Trinity Metro");
        addr1.setAddressType("HOME");
        addr1.setIsDefault(true);
        addressRepository.save(addr1);

        Address addr2 = new Address();
        addr2.setUser(savedUser2);
        addr2.setFullName("Priya Patel");
        addr2.setPhone("+91 9876500002");
        addr2.setAddressLine("12B, Marine Drive Mansions");
        addr2.setCity("Mumbai");
        addr2.setState("Maharashtra");
        addr2.setPincode("400020");
        addr2.setLandmark("Near Air India Building");
        addr2.setAddressType("HOME");
        addr2.setIsDefault(true);
        addressRepository.save(addr2);

        // 3. Brands
        Map<String, Brand> brandMap = new HashMap<>();
        String[][] brandsData = {
                {"Apple", "apple", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", "Pioneering technology devices, iPhones, MacBooks, and high-performance audio."},
                {"Samsung", "samsung", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", "Global leader in mobile innovation, OLED TVs, SSDs, and smart appliances."},
                {"Sony", "sony", "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", "Industry leading audio, PlayStation consoles, mirrorless cameras, and Bravia displays."},
                {"ASUS", "asus", "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg", "Top gaming hardware, ROG gaming laptops, graphics cards, and motherboards."},
                {"Dell", "dell", "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg", "Engineered for power and productivity: XPS ultrabooks, Alienware, and UltraSharp displays."},
                {"Lenovo", "lenovo", "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg", "Legendary ThinkPads, Legion gaming laptops, and high-versatility tablets."},
                {"LG", "lg", "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg", "World class OLED displays, UltraGear gaming monitors, and smart home appliances."},
                {"Bose", "bose", "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bose_logo.svg", "Acoustic excellence and world renowned active noise cancelling audio gear."},
                {"Logitech", "logitech", "https://upload.wikimedia.org/wikipedia/commons/0/08/Logitech_logo.svg", "Precision mice, mechanical keyboards, webcams, and esports peripherals."},
                {"NVIDIA", "nvidia", "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", "GeForce RTX graphics cards powering ultra-high framerate gaming and AI computing."},
                {"AMD", "amd", "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg", "Ryzen processors and Radeon graphics delivering dominant desktop performance."},
                {"Corsair", "corsair", "https://upload.wikimedia.org/wikipedia/commons/4/44/Corsair_Components_logo.svg", "Enthusiast PC power supplies, high-speed DDR5 RAM, AIO liquid coolers, and cases."},
                {"OnePlus", "oneplus", "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_pos_2020.svg", "Never Settle: flagship killer smartphones, oxygen OS fluidity, and fast charging."},
                {"Razer", "razer", "https://upload.wikimedia.org/wikipedia/en/4/40/Razer_snake_logo.svg", "For Gamers. By Gamers. Premium gaming peripherals, laptops, and blade designs."}
        };

        for (String[] b : brandsData) {
            Brand brand = new Brand(b[0], b[1], b[2], b[3]);
            brandMap.put(b[1], brandRepository.save(brand));
        }

        // 4. Categories
        Map<String, Category> catMap = new HashMap<>();
        String[][] categoriesData = {
                {"Smartphones", "smartphones", "Next-generation flagship and performance mobile devices", "Smartphone", "1"},
                {"Laptops", "laptops", "Ultra-portable notebooks, creator workstations, and gaming laptops", "Laptop", "2"},
                {"Tablets", "tablets", "Versatile tablets for work, digital art, and entertainment", "Tablet", "3"},
                {"TVs", "tvs", "4K/8K OLED, QLED, and smart entertainment displays", "Tv", "4"},
                {"Headphones", "headphones", "Over-ear active noise cancelling audiophile headphones", "Headphones", "5"},
                {"Earbuds", "earbuds", "True wireless stereo earbuds with spatial audio", "Disc", "6"},
                {"Smartwatches", "smartwatches", "Health tracking, GPS sports, and premium wearable tech", "Watch", "7"},
                {"Cameras", "cameras", "Full-frame mirrorless cameras, vlog kits, and cine gear", "Camera", "8"},
                {"Gaming Consoles", "gaming-consoles", "Next-gen gaming systems, controllers, and VR headsets", "Gamepad2", "9"},
                {"PC Components", "pc-components", "CPUs, Motherboards, GPUs, RAM, PSUs, Cases and Coolers", "Cpu", "10"},
                {"Monitors", "monitors", "High refresh rate gaming and color-accurate productivity monitors", "Monitor", "11"},
                {"Keyboards & Mice", "keyboards-mice", "Mechanical keyboards, lightweight esports mice and desk pads", "Keyboard", "12"},
                {"Speakers", "speakers", "Bluetooth portable speakers, soundbars, and home theatre systems", "Volume2", "13"},
                {"Accessories", "accessories", "GaN fast chargers, Thunderbolt docks, cables, and sleeves", "Plug", "14"},
                {"Networking", "networking", "Wi-Fi 7 / 6E mesh routers, high-speed switches, and NAS", "Wifi", "15"}
        };

        for (String[] c : categoriesData) {
            Category cat = new Category(c[0], c[1], c[2], c[3], Integer.parseInt(c[4]));
            catMap.put(c[1], categoryRepository.save(cat));
        }

        // 5. Seed Core Products
        List<Product> productsToSave = new ArrayList<>();

        // P1: iPhone 16 Pro Max
        Product p1 = createProductHelper("Apple iPhone 16 Pro Max 256GB Desert Titanium", "apple-iphone-16-pro-max-256gb", "APL-IP16PM-256",
                "Featuring titanium design, A18 Pro chip, 48MP Fusion camera system, and Camera Control.",
                "The ultimate iPhone is here. Crafted in Grade 5 titanium with thin borders, the largest 6.9-inch Super Retina XDR display, breakthrough battery life, and pro camera controls with 5x telephoto optical zoom.",
                brandMap.get("apple"), catMap.get("smartphones"), new BigDecimal("144900.00"), new BigDecimal("137900.00"), 5, 25, 4.90, 38,
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", true, true, false, true);
        addSpec(p1, "Performance", "Processor", "Apple A18 Pro (3nm)", true);
        addSpec(p1, "Performance", "RAM", "8GB Unified", true);
        addSpec(p1, "Performance", "Storage", "256GB NVMe", true);
        addSpec(p1, "Display", "Display", "6.9-inch Super Retina XDR OLED 120Hz", true);
        addSpec(p1, "Camera", "Camera", "48MP Fusion + 48MP UW + 12MP 5x Telephoto", true);
        productsToSave.add(p1);

        // P2: Galaxy S24 Ultra
        Product p2 = createProductHelper("Samsung Galaxy S24 Ultra 5G 512GB Titanium Gray", "samsung-galaxy-s24-ultra-512gb", "SAM-S24U-512",
                "Galaxy AI powered flagship with built-in S Pen, Snapdragon 8 Gen 3, and 200MP Quad Tele camera.",
                "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Built with Galaxy AI for effortless search, live translation, and note summarizing.",
                brandMap.get("samsung"), catMap.get("smartphones"), new BigDecimal("139999.00"), new BigDecimal("124999.00"), 11, 18, 4.85, 42,
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800", true, true, true, false);
        addSpec(p2, "Performance", "Processor", "Snapdragon 8 Gen 3 for Galaxy (4nm)", true);
        addSpec(p2, "Performance", "RAM", "12GB LPDDR5X", true);
        addSpec(p2, "Performance", "Storage", "512GB UFS 4.0", true);
        addSpec(p2, "Display", "Display", "6.8 inch Dynamic AMOLED 2X Flat 2600 nits", true);
        addSpec(p2, "Camera", "Camera", "200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP UW", true);
        productsToSave.add(p2);

        // P3: OnePlus 12
        Product p3 = createProductHelper("OnePlus 12 5G 256GB Silky Black", "oneplus-12-5g-256gb-black", "OP-12-256-BLK",
                "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, and 5400mAh battery with 100W SUPERVOOC.",
                "Experience elite performance with the OnePlus 12. Equipped with the latest Snapdragon 8 Gen 3 SoC, 2K 120Hz ProXDR display, dual cryo-velocity VC cooling, and 50W wireless charging.",
                brandMap.get("oneplus"), catMap.get("smartphones"), new BigDecimal("64999.00"), new BigDecimal("59999.00"), 8, 30, 4.70, 24,
                "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", false, true, false, false);
        addSpec(p3, "Performance", "Processor", "Snapdragon 8 Gen 3", true);
        addSpec(p3, "Performance", "RAM", "12GB LPDDR5X", true);
        addSpec(p3, "Battery", "Battery", "5400 mAh with 100W SUPERVOOC", true);
        productsToSave.add(p3);

        // P4: MacBook Pro 16 M3 Max
        Product p4 = createProductHelper("Apple MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)", "apple-macbook-pro-16-m3-max", "APL-MBP16-M3MAX",
                "M3 Max 14-core CPU, 30-core GPU, Liquid Retina XDR display, up to 22 hours battery life.",
                "MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance for demanding workflows like 3D rendering, machine learning modeling, and 8K video editing.",
                brandMap.get("apple"), catMap.get("laptops"), new BigDecimal("349900.00"), new BigDecimal("329900.00"), 6, 8, 4.95, 19,
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", true, true, false, true);
        addSpec(p4, "Performance", "Processor", "Apple M3 Max (14-Core CPU, 30-Core GPU)", true);
        addSpec(p4, "Performance", "RAM", "36GB Unified", true);
        addSpec(p4, "Performance", "Storage", "1TB SSD", true);
        addSpec(p4, "Display", "Display", "16.2 inch Liquid Retina XDR 120Hz", true);
        productsToSave.add(p4);

        // P5: ASUS ROG Zephyrus G16
        Product p5 = createProductHelper("ASUS ROG Zephyrus G16 (2024) OLED Gaming Laptop", "asus-rog-zephyrus-g16-oled", "ASUS-G16-RTX4080",
                "Intel Core Ultra 9 185H, NVIDIA RTX 4080 12GB, 32GB LPDDR5X, 2TB SSD, 2.5K 240Hz OLED.",
                "Precision machined aluminum chassis, ROG Nebula OLED 240Hz display, and dual-channel vapor chamber cooling. The undisputed king of ultraportable high-framerate gaming laptops.",
                brandMap.get("asus"), catMap.get("laptops"), new BigDecimal("289990.00"), new BigDecimal("269990.00"), 7, 6, 4.88, 14,
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800", true, true, false, true);
        addSpec(p5, "Performance", "Processor", "Intel Core Ultra 9 185H", true);
        addSpec(p5, "Performance", "GPU", "NVIDIA GeForce RTX 4080 12GB GDDR6", true);
        addSpec(p5, "Performance", "RAM", "32GB LPDDR5X 7467MHz", true);
        addSpec(p5, "Display", "Display", "16-inch 2.5K ROG Nebula OLED 240Hz", true);
        productsToSave.add(p5);

        // P6: AMD Ryzen 7 7800X3D
        Product p6 = createProductHelper("AMD Ryzen 7 7800X3D Desktop Processor (8-Core, 16-Thread)", "amd-ryzen-7-7800x3d", "AMD-RYZ7-7800X3D",
                "The world's best gaming processor with AMD 3D V-Cache technology. Socket AM5, up to 5.0GHz.",
                "Dominant gaming CPU featuring 96MB of L3 3D V-Cache, Zen 4 5nm architecture, PCIe 5.0 readiness, and unmatched thermal and power efficiency for high FPS gameplay.",
                brandMap.get("amd"), catMap.get("pc-components"), new BigDecimal("44999.00"), new BigDecimal("38499.00"), 14, 35, 4.96, 75,
                "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800", true, true, false, false);
        addSpec(p6, "General", "Socket", "AM5", true);
        addSpec(p6, "Performance", "Cores / Threads", "8 Cores, 16 Threads", true);
        addSpec(p6, "Performance", "L3 Cache", "96MB AMD 3D V-Cache", true);
        addSpec(p6, "Thermal & Power", "TDP", "120W", true);
        addSpec(p6, "Memory Support", "RAM Type", "DDR5 Dual Channel", true);
        productsToSave.add(p6);

        // P7: ASUS ROG RTX 4080 Super OC
        Product p7 = createProductHelper("ASUS ROG Strix GeForce RTX 4080 Super OC Edition 16GB GDDR6X", "asus-rog-strix-rtx-4080-super-oc", "ASUS-STX-4080S-OC",
                "Ada Lovelace architecture, DLSS 3.5, 3.5-slot axial-tech fans, vented exoskeleton.",
                "Delivers jaw-dropping ray-traced visuals and supercharged generative AI. Axial-tech fans scaled up for 23% more airflow and premium military-grade 15K capacitors.",
                brandMap.get("asus"), catMap.get("pc-components"), new BigDecimal("129999.00"), new BigDecimal("117999.00"), 9, 7, 4.91, 28,
                "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800", true, false, false, true);
        addSpec(p7, "Performance", "VRAM", "16GB GDDR6X 256-bit", true);
        addSpec(p7, "Performance", "CUDA Cores", "10240 Cores", true);
        addSpec(p7, "Dimensions & Power", "Recommended PSU", "850W minimum", true);
        productsToSave.add(p7);

        // P8: Corsair DDR5 32GB RAM
        Product p8 = createProductHelper("Corsair Vengeance RGB DDR5 RAM 32GB (2x16GB) 6000MHz CL30", "corsair-vengeance-rgb-ddr5-32gb-6000", "COR-VENG-DDR5-32G",
                "Optimized for Intel XMP & AMD EXPO with dynamic ten-zone RGB lighting and onboard voltage regulation.",
                "Deliver higher frequencies and greater capacities of DDR5 technology in a compact, high-quality aluminum module with individually addressable RGB LEDs.",
                brandMap.get("corsair"), catMap.get("pc-components"), new BigDecimal("14500.00"), new BigDecimal("11999.00"), 17, 40, 4.82, 33,
                "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800", false, false, false, false);
        addSpec(p8, "General", "Memory Type", "DDR5 Desktop UDIMM", true);
        addSpec(p8, "Performance", "Capacity", "32GB Kit (2 x 16GB)", true);
        addSpec(p8, "Performance", "Speed", "DDR5-6000 MHz CL30", true);
        productsToSave.add(p8);

        // P9: Sony WH-1000XM5
        Product p9 = createProductHelper("Sony WH-1000XM5 Wireless Noise Cancelling Headphones", "sony-wh-1000xm5-silver", "SNY-WH1000XM5-SLV",
                "Industry-leading noise cancellation with 8 microphones, Auto NC Optimizer, 30 hours battery.",
                "With two processors controlling 8 microphones, Auto NC Optimizer for automatically optimizing noise cancelling, and specially designed 30mm carbon fiber driver unit.",
                brandMap.get("sony"), catMap.get("headphones"), new BigDecimal("34990.00"), new BigDecimal("26990.00"), 23, 22, 4.85, 89,
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800", true, true, true, false);
        addSpec(p9, "Audio", "Noise Cancelling", "Dual Processors (V1 + QN1) & 8 Microphones", true);
        addSpec(p9, "Battery", "Battery Life", "30 hours with ANC ON", true);
        productsToSave.add(p9);

        // P10: Apple AirPods Pro 2
        Product p10 = createProductHelper("Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)", "apple-airpods-pro-2nd-gen-usbc", "APL-APP2-USBC",
                "H2 chip, Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio.",
                "Next-level Active Noise Cancellation and Transparency mode. Dynamic head tracking places sound all around you, with touch control swipe for volume adjustment.",
                brandMap.get("apple"), catMap.get("earbuds"), new BigDecimal("24900.00"), new BigDecimal("20999.00"), 16, 45, 4.92, 120,
                "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800", true, true, false, false);
        addSpec(p10, "Audio", "Chip", "Apple H2 Headphone Chip", true);
        addSpec(p10, "Audio", "Audio Features", "Adaptive Audio & Active Noise Cancellation", true);
        productsToSave.add(p10);

        // P11: LG OLED evo C4 65"
        Product p11 = createProductHelper("LG OLED evo C4 65-inch 4K Smart TV (2024 OLED65C4)", "lg-oled-evo-c4-65-inch", "LG-OLED65C4-2024",
                "Self-lit OLED pixels, alpha 9 AI Processor 4K Gen7, 144Hz VRR, Dolby Vision & Atmos, webOS 24.",
                "Experience vibrant pictures with brightness booster, infinite contrast, and ultra-smooth gaming with 0.1ms response time, NVIDIA G-Sync, and AMD FreeSync Premium.",
                brandMap.get("lg"), catMap.get("tvs"), new BigDecimal("249990.00"), new BigDecimal("189990.00"), 24, 7, 4.93, 27,
                "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800", true, true, false, true);
        addSpec(p11, "Display", "Screen Size", "65 inch (164 cm) 4K OLED evo", true);
        addSpec(p11, "Display", "Refresh Rate", "144Hz Native VRR / G-Sync", true);
        productsToSave.add(p11);

        // P12: PS5 Slim
        Product p12 = createProductHelper("Sony PlayStation 5 Slim Console (1TB SSD Disc Edition)", "sony-playstation-5-slim-disc", "SNY-PS5-SLIM-DISC",
                "Ultra-high speed 1TB SSD, Ray Tracing, 4K-TV Gaming up to 120fps, HDR technology, DualSense.",
                "Slimmer design with more storage. Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and breathtaking new PS5 games.",
                brandMap.get("sony"), catMap.get("gaming-consoles"), new BigDecimal("54990.00"), new BigDecimal("49990.00"), 9, 30, 4.94, 105,
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800", true, true, false, false);
        addSpec(p12, "Performance", "Storage", "1TB Custom High-Speed PCIe 4.0 SSD", true);
        addSpec(p12, "Performance", "Resolution", "4K 120Hz & 8K Output Support", true);
        productsToSave.add(p12);

        // P13: Logitech G Pro X Superlight 2
        Product p13 = createProductHelper("Logitech G Pro X Superlight 2 Wireless Gaming Mouse", "logitech-g-pro-x-superlight-2-black", "LOG-GPX-SL2-BLK",
                "60g ultra-lightweight, HERO 2 32K Sensor, LIGHTFORCE hybrid optical-mechanical switches, 95h battery.",
                "Engineered with the world's top esports pros to eliminate all barriers to victory. Features 44,000 DPI tracking and 2000Hz polling rate via LIGHTSPEED wireless.",
                brandMap.get("logitech"), catMap.get("keyboards-mice"), new BigDecimal("16995.00"), new BigDecimal("13995.00"), 18, 25, 4.89, 44,
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800", true, false, true, false);
        addSpec(p13, "Performance", "Weight", "60 grams ultra-light", true);
        addSpec(p13, "Performance", "Sensor", "HERO 2 32,000 DPI / 500+ IPS", true);
        productsToSave.add(p13);

        // P14: Apple Watch Ultra 2
        Product p14 = createProductHelper("Apple Watch Ultra 2 GPS + Cellular 49mm Titanium", "apple-watch-ultra-2-titanium", "APL-WAT-ULTRA2-TI",
                "S9 SiP chip, 3000 nits brightness display, 36-hour normal battery life, precision dual-frequency GPS.",
                "The most capable and rugged Apple Watch. Built for endurance athletes, outdoor adventurers, and ocean divers with a 49mm aerospace-grade titanium case and Action Button.",
                brandMap.get("apple"), catMap.get("smartwatches"), new BigDecimal("89900.00"), new BigDecimal("84900.00"), 6, 12, 4.90, 34,
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800", true, false, false, true);
        addSpec(p14, "General", "Case Material", "Grade 5 Aerospace Titanium 49mm", true);
        addSpec(p14, "Display", "Peak Brightness", "3000 nits Always-On Retina", true);
        productsToSave.add(p14);

        // Save products
        productRepository.saveAll(productsToSave);

        // 6. Seed Coupons
        Coupon c1 = new Coupon("WELCOME10", "PERCENTAGE", new BigDecimal("10.00"), new BigDecimal("2000.00"), new BigDecimal("2500.00"), LocalDateTime.now(), LocalDateTime.now().plusYears(2));
        Coupon c2 = new Coupon("TECHVAULT2000", "FIXED", new BigDecimal("2000.00"), new BigDecimal("25000.00"), new BigDecimal("2000.00"), LocalDateTime.now(), LocalDateTime.now().plusYears(2));
        Coupon c3 = new Coupon("GAMING5", "PERCENTAGE", new BigDecimal("5.00"), new BigDecimal("50000.00"), new BigDecimal("10000.00"), LocalDateTime.now(), LocalDateTime.now().plusYears(2));
        Coupon c4 = new Coupon("FESTIVE500", "FIXED", new BigDecimal("500.00"), new BigDecimal("5000.00"), new BigDecimal("500.00"), LocalDateTime.now(), LocalDateTime.now().plusYears(2));
        couponRepository.saveAll(Arrays.asList(c1, c2, c3, c4));

        // 7. Seed Reviews
        Review r1 = new Review(p9, savedUser, 5, "Unmatched Noise Cancellation & Comfort", "Upgraded from the XM3 and the difference in ANC and vocal isolation is astonishing! The battery lasts all week with my daily office commute.", true);
        Review r2 = new Review(p1, savedUser, 5, "Peak Apple Engineering", "The Desert Titanium finish looks subtle and gorgeous. Camera Control button makes switching exposure and zoom modes effortless during travel.", true);
        Review r3 = new Review(p6, savedUser2, 5, "Unstoppable gaming FPS", "Paired this 7800X3D with my RTX 4080 and 1% lows in Warzone and Valorant skyrocketed. Extremely cool power draw too.", true);
        reviewRepository.saveAll(Arrays.asList(r1, r2, r3));

        // 8. Seed Demo Order
        Order demoOrder = new Order();
        demoOrder.setOrderNumber("ORD-2024-88391");
        demoOrder.setUser(savedUser);
        demoOrder.setAddress(addr1);
        demoOrder.setShippingFullName("Rahul Sharma");
        demoOrder.setShippingPhone("+91 9876500001");
        demoOrder.setShippingAddressLine("Flat 402, Sunshine Heights, MG Road");
        demoOrder.setShippingCity("Bengaluru");
        demoOrder.setShippingState("Karnataka");
        demoOrder.setShippingPincode("560001");
        demoOrder.setSubtotal(new BigDecimal("26990.00"));
        demoOrder.setDiscountAmount(new BigDecimal("500.00"));
        demoOrder.setTaxAmount(new BigDecimal("4768.20"));
        demoOrder.setShippingFee(BigDecimal.ZERO);
        demoOrder.setTotalAmount(new BigDecimal("31258.20"));
        demoOrder.setStatus("DELIVERED");
        demoOrder.setPaymentStatus("PAID");
        demoOrder.setPaymentMethod("CREDIT_CARD");
        demoOrder.setCouponCode("FESTIVE500");
        demoOrder.setTrackingNumber("TRK-BLR-99281");
        demoOrder.setCarrierName("BlueDart Express");
        demoOrder.setEstimatedDelivery(LocalDateTime.now().minusDays(3));

        Order savedDemoOrder = orderRepository.save(demoOrder);

        OrderItem item1 = new OrderItem(savedDemoOrder, p9, p9.getName(), p9.getMainImage(), p9.getSku(), p9.getSalePrice(), 1, p9.getSalePrice());
        orderItemRepository.save(item1);

        Payment pay1 = new Payment(savedDemoOrder, savedUser, new BigDecimal("31258.20"), "TECHVAULT_GATEWAY", "TXN_BLR_9921827361", "SUCCESS", "CREDIT_CARD");
        paymentRepository.save(pay1);

        // 9. Seed Notifications
        Notification n1 = new Notification(savedUser, "Order Delivered Successfully! #ORD-2024-88391", "Your order containing Sony WH-1000XM5 has been delivered to your Bengaluru address.", "ORDER_UPDATE", "/orders/" + savedDemoOrder.getId());
        n1.setIsRead(true);
        Notification n2 = new Notification(savedUser, "Welcome to TechVault!", "Enjoy flat 10% off on your first order with coupon code WELCOME10.", "PROMO", "/products");
        notificationRepository.saveAll(Arrays.asList(n1, n2));

        // 10. Seed Contact Message
        ContactMessage cm1 = new ContactMessage("Amit Deshmukh", "amit.d@gmail.com", "Bulk procurement inquiry for studio workstations", "Hello TechVault team, we are planning to procure 25 units of Dell XPS 14 laptops for our design studio. Could you share B2B quotation?");
        contactMessageRepository.save(cm1);

        logger.info("TechVault Database Seeding Completed Successfully!");
    }

    private Product createProductHelper(String name, String slug, String sku, String shortDesc, String desc,
                                        Brand brand, Category category, BigDecimal origPrice, BigDecimal salePrice,
                                        int discount, int stock, double rating, int reviewCount, String image,
                                        boolean isFeatured, boolean isTrending, boolean isFlashDeal, boolean isNewArrival) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setSku(sku);
        p.setShortDescription(shortDesc);
        p.setDescription(desc);
        p.setBrand(brand);
        p.setCategory(category);
        p.setOriginalPrice(origPrice);
        p.setSalePrice(salePrice);
        p.setDiscountPercent(discount);
        p.setStock(stock);
        p.setRating(BigDecimal.valueOf(rating));
        p.setReviewCount(reviewCount);
        p.setMainImage(image);
        p.setIsFeatured(isFeatured);
        p.setIsTrending(isTrending);
        p.setIsFlashDeal(isFlashDeal);
        p.setIsNewArrival(isNewArrival);
        p.calculateStockStatus();

        ProductImage primaryImg = new ProductImage(p, image, name, 0, true);
        p.addImage(primaryImg);

        return p;
    }

    private void addSpec(Product p, String group, String name, String value, boolean highlighted) {
        ProductSpecification spec = new ProductSpecification(p, group, name, value, highlighted, p.getSpecifications().size());
        p.addSpecification(spec);
    }
}
