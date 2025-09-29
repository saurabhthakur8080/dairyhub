
export const calibrationStandardizationContent = {
  hi: {
    mainTitle: "Calibration और Standardization",
    description: "Dairy प्रयोगशाला में sateek maap sunishchit karne ke liye ek guide.",
    backToTopics: "Topics पर वापस जाएं",
    intro_p1: "<strong>Calibration</strong> का मतलब है किसी measuring equipment की तुलना एक standard equipment से करना जिसका maap pehle से ही सही maana गया हो। इससे यह पता चलता है कि हमारा equipment कितना sateek (accurate) है। इसमें adjustment शामिल नहीं होता, लेकिन यह adjustment की zaroorat को दिखा सकता है।",
    intro_p2: "Dairy plant में, milk की संरचना (fat, SNF, आदि) और quality को swagat से लेकर dispatch tak kai baar analyze kiya jaata hai. यह product की sahi keemat, processing ke liye uski upyuktata, और legal standards को poora karne ke liye zaroori hai. इसलिए, analysis में उपयोग होने से pehle glassware (butyrometer, pipette, आदि) और chemicals का calibration और standardization बहुत महत्वपूर्ण है, ताकि galat parinaamon se bacha ja sake.",
    tabs: {
        definitions: "मुख्य परिभाषाएं",
        pipette: "Pipette Calibration",
        butyrometer: "Butyrometer Calibration",
        lactometer: "Lactometer Calibration",
        other: "अन्य Glassware",
        thermometer: "Thermometer Calibration",
        balance: "Weighing Balance"
    },
    definitions: {
        title: "मुख्य परिभाषाएं",
        reagent: "अभिकर्मक (Reagent)",
        reagent_desc: "एक पदार्थ जो दूसरे पदार्थ के साथ प्रतिक्रिया करके रासायनिक बदलाव लाता है।",
        solution: "घोल (Solution)",
        solution_desc: "Solution दो या दो से अधिक padarthon का एक homogeneous mishran है। जिसमें एक solute (जो kam matra में हो) और एक solvent (जो adhik matra में हो) होता है।",
        dilute_sol: "<strong>Dilute Solution:</strong> जिसमें solute की matra kam हो।",
        concentrated_sol: "<strong>Concentrated Solution:</strong> जिसमें solute की matra adhik हो।",
        saturated_sol: "<strong>Saturated Solution:</strong> जिसमें एक nishchit taapman पर और solute na ghul sake.",
        standard_sol: "Standard Solution",
        standard_sol_desc: "एक ऐसा solution jiski shakti ya concentration bilkul sahi pata ho.",
        normal_sol: "Normal Solution (Normality - N)",
        normal_sol_desc: "यह 1 litre solution में ghule hue solute के gram equivalent की संख्या है। <code>N = gram equivalent of solute / volume of solution (L)</code>।",
        normal_sol_formula: "Gram equivalent weight = <code>Molar mass / n-factor</code>। (n-factor acid के लिए H+ ions की संख्या और base के लिए OH- ions की संख्या होती है)।",
        molar_sol: "Molar Solution (Molarity - M)",
        molar_sol_desc: "यह 1 litre solution में ghule hue solute के moles की संख्या है। <code>M = moles of solute / volume of solution (L)</code>।",
        molal_sol: "Molal Solution (Molality - m)",
        molal_sol_desc: "यह 1000g (1 kg) solvent में ghule hue solute के moles की संख्या है। <code>m = No. of moles of solute / weight of solvent (kg)</code>।",
        note: "Note: Normality और Molarity taapman पर nirbhar karti hain kyunki volume taapman ke saath badalta hai, jabki Molality taapman se swatantra hai."
    },
    pipette: {
        title: "Milk Pipette का Calibration",
        comparison: {
            title: "(ए) Comparison Method",
            desc: "Is method में, एक नई pipette से दूध का fat test करके uski tulna ek purani, pehle se calibrated pipette ke parinaam se ki jaati hai. Yadi dono ka parinaam samaan aata hai, toh nayi pipette sahi maani jaati hai. Yeh sabse aasan lekin kam sateek tareeka hai."
        },
        bis: {
            title: "(बी) BIS Method (Gravimetric Method)",
            desc: "यह सबसे सटीक विधि है। इसमें यह जांचा जाता है कि पिपेट 27°C पर <strong>10.75 ± 0.03 मिलीलीटर</strong> आसुत जल वितरित करती है या नहीं।",
            steps: [
                "Pipette को saaf karke 27°C distilled water से nishaan ke upar tak bharein.",
                "Meniscus को nishaan par adjust karein.",
                "Paani ko ek pehle se tole hue beaker mein vitrit karein.",
                "Paani ke saath beaker ko tolein aur paani ka vajan (mass) nikalein.",
                "Volume ki ganana karein: <code>Volume = Mass / Density</code>। 27°C par paani ka density 0.99654 g/mL hota hai.",
                "Yadi ganana kiya gaya volume 10.72 milliliter se 10.78 milliliter ke beech hai, toh pipette sahi hai."
            ]
        },
        mathematical: {
            title: "(सी) Mathematical Method",
            desc: "Is method mein pipette ke stem ki prati unit lambai ka volume ganana kiya jaata hai aur phir do asthayi binduon ke maap ke aadhar par 10.75 milliliter ka sahi bindu nirdharit karke ek sthayi nishaan lagaya jaata hai."
        }
    },
    butyrometer: {
        title: "Butyrometer का Calibration",
        principle: {
            title: "Siddhant",
            desc: "Butyrometer calibration का mukhya siddhant yeh hai ki iske stem (patli nali) par bane nishaan ek nishchit volume ko darshate hain. <strong>Milk Butyrometer</strong> ke liye, har ek <strong>1% fat ka nishaan 0.125 milliliter</strong> ke aantarik volume ke barabar hota hai. Isliye, 0 से 10% tak ki poori scale ka volume 1.25 milliliter hona chahiye. Calibration mein hum isi volume ki jaanch karte hain. Iske liye aam taur par shuddh para (mercury) ka upyog kiya jaata hai kyunki yeh kaanch se nahi chipakta hai aur iska density bahut adhik hota hai."
        },
        methods: {
            title: "Calibration के विभिन्न तरीके",
            comparison: {
                title: "1. Comparison Method",
                desc: "Yeh sabse aasan tareeka hai. Ismein ek hi doodh ke namoone ka fat do alag-alag butyrometer mein test kiya jaata hai:",
                points: ["एक pehle se calibrated (standard) butyrometer.", "एक naya butyrometer jise calibrate karna hai."],
                conclusion: "Yadi dono butyrometer mein fat ki reading samaan aati hai, toh naye butyrometer ko sahi maan liya jaata hai. Lekin yeh vidhi bahut sateek nahi hai kyunki purana (standard) butyrometer bhi sahi nahi ho sakta hai."
            },
            bis: {
                title: "2. BIS Method (Mercury Pipette Method)",
                desc: "Yeh ek adhik sateek aur standard tareeka hai. Ismein ek vishesh prakaar ki automatic mercury pipette ka upyog kiya jaata hai jo ek baar mein theek <strong>0.3125 milliliter</strong> mercury vitrit karti hai. Yeh volume butyrometer ke <strong>2.5% fat scale</strong> ke barabar hota hai.",
                steps: [
                    "Butyrometer ko saaf karke sukha lein.",
                    "Butyrometer ko 10% ke nishaan tak mercury se bharein. Ise hum aadhaar (zero) bindu maante hain.",
                    "Mercury pipette se 0.3125 milliliter mercury butyrometer mein daalein. Mercury ka star 10% se 7.5% tak aa jaana chahiye.",
                    "Is prakriya ko 3 baar aur dohraayein. Har baar mercury 2.5% scale ko bharega (7.5% -> 5.0% -> 2.5% -> 0%).",
                    "Yadi 4 baar mercury daalne par butyrometer ka scale 0 se 10% tak poori tarah se sahi-sahi bhar jaata hai, toh butyrometer calibrated maana jaata hai."
                ]
            },
            gravimetric: {
                title: "3. Gravimetric Method (by weighing Mercury)",
                desc: "Yeh sabse sateek tareeka hai. Ismein alag-alag nishaanon ke beech mercury ka vajan karke volume nikala jaata hai.",
                steps: [
                    "Ek saaf, sukhe butyrometer ko tolein.",
                    "Usmein 10% ke nishaan tak mercury bharein aur dobara tolein.",
                    "Ab 9% ke nishaan tak mercury bharein aur phir tolein. Dono vajanon ke antar se 9% aur 10% ke beech mercury ka vajan pata chal jayega.",
                    "Mercury ke density (jo taapman par nirbhar karta hai) ka upyog karke, is vajan ko volume mein badalein: <code>Volume = Mass / Density</code>.",
                    "Yeh volume <strong>0.125 ± 0.001 milliliter</strong> ke beech hona chahiye (1% fat ke liye).",
                    "Isi prakaar, butyrometer ke scale par 2-3 alag-alag binduon (jaise 5-6% aur 1-2%) par is test ko dohraayein taaki poore scale ki sateekta jaanchi jaa sake."
                ]
            }
        },
        table: {
            caption: "Table 6.1: विभिन्न उत्पादों के लिए ब्यूटिरोमीटर के प्रकार",
            header1: "Scale Range (%)",
            header2: "उत्पाद (Product)",
            rows: [
                { scale: "0–0.5", product: "Skimmed milk" },
                { scale: "0–4", product: "Partly skimmed milk, buttermilk" },
                { scale: "0–10", product: "Whole milk, evaporated milk (unsweetened)" },
                { scale: "0–20", product: "Dry milk powder" },
                { scale: "0–40", product: "Ice cream, condensed milk, cheese" },
                { scale: "0–70", product: "Cream" },
                { scale: "0–90", product: "Butter" }
            ]
        }
    },
    lactometer: {
        title: "Lactometer का Calibration",
        principle: {
            title: "Siddhant",
            desc1: "Lactometer <strong>Archimedes के siddhant</strong> par kaam karte hain: jab koi vastu kisi taral mein duboyi jaati hai, toh us par upar ki ore ek bal lagta hai jo us vastu dwara hataye gaye taral ke bhaar ke barabar hota hai. Lactometer taral ke specific gravity ko maapta hai. Doodh jitna gaadha hoga (adhik SNF), lactometer utna hi kam doobega aur reading adhik aayegi. Paani milane par doodh patla ho jaata hai, jisse lactometer adhik doobta hai aur reading kam aati hai.",
            desc2: "Aam taur par 3 prakaar ke lactometer ka upyog kiya jaata hai, jo alag-alag taapman par calibrated hote hain:",
            types: ["<strong>Quevenne’s Lactometer:</strong> 15.5°C par calibrated.", "<strong>BIS Lactometer:</strong> 27°C par calibrated.", "<strong>Zeal Lactometer:</strong> 29.4°C par calibrated."],
            desc3: "Ek standard BIS lactometer mein 1.020 se 1.035 tak ki specific gravity seema hoti hai, jise scale par 20 se 35 ke roop mein darshaya jaata hai."
        },
        methods: {
            title: "Calibration के विभिन्न तरीके",
            comparison: {
                title: "1. Comparison Method",
                desc: "Yeh sabse aasan tareeka hai. Ismein ek hi doodh ke namoone mein do lactometer (ek naya aur ek pehle se calibrated standard lactometer) ek saath duboye jaate hain. Yadi dono ki reading samaan aati hai, toh naye lactometer ko sahi maan liya jaata hai."
            },
            bis: {
                title: "2. BIS Method (Standard Solution Method)",
                desc: "Yeh ek sateek tareeka hai jismein jyat specific gravity wale solutions ka upyog kiya jaata hai. Aam taur par, anhydrous sodium carbonate ya sodium chloride ke solutions banaye jaate hain.",
                steps: [
                    "Table ke anusaar, alag-alag specific gravity (jaise 1.025, 1.030) ke liye nirdharit matra mein anhydrous sodium carbonate ko distilled water mein gholein.",
                    "Is solution ka surface tension doodh ke barabar laane ke liye thoda ethyl alcohol milayein.",
                    "Solution ko ek lactometer jar mein daalein aur taapman ko lactometer ke calibration taapman (jaise BIS ke liye 27°C) par laayein.",
                    "Lactometer ko dheere se solution mein duboye aur sthir hone dein.",
                    "Reading note karein. Aapki reading standard solution ke specific gravity se mel khani chahiye. BIS ke anusaar, 0.0005 se adhik ka antar nahi hona chahiye."
                ]
            }
        }
    },
    other_glassware: {
        title: "अन्य Glassware का Calibration",
        intro: "Volumetric flasks, measuring cylinders, और beakers jaise glassware ko calibrate karna utna hi mahatvapurna hai jitna ki pipettes aur butyrometers ko. Inka calibration bhi gravimetric method (vajan maapkar) se kiya jaata hai.",
        principle: {
            title: "Siddhant",
            desc: "Is vidhi ka siddhant bahut saral hai: hum glassware mein aane wale distilled water ke vajan (mass) ko ek nishchit taapman par tolkar uske volume ka pata lagaate hain, kyunki har taapman par paani ka density jyat hota hai (<code>Volume = Mass / Density</code>). Is nikale gaye volume ki tulna glassware par likhi hui kshamata se ki jaati hai."
        },
        procedure: {
            title: "Volumetric Flask/Measuring Cylinder/Beaker की Calibration विधि",
            steps: [
                "Ek saaf aur poori tarah se sukhe volumetric flask (ya cylinder/beaker) ko ek sateek weighing balance par tolein. Is vajan ko <strong>W1</strong> ke roop mein note karein.",
                "Ab, us flask mein nishchit taapman (aam taur par 27°C) wala distilled water uske graduation nishaan tak dheere-dheere bharein. Meniscus ka nichla hissa nishaan par hona chahiye.",
                "Paani se bhare flask ko dobara tolein. Is vajan ko <strong>W2</strong> ke roop mein note karein.",
                "Paani ka vajan (mass) nikalein: <strong>Mass of Water = W2 - W1</strong>.",
                "Ab is vajan se paani ka volume ganana karein: <strong>Volume (ml) = Mass of Water (g) / 27°C par paani ka density (0.99654 g/ml)</strong>.",
                "Ganana kiye gaye volume ki tulna flask par likhi hui kshamata (jaise 100 ml, 250 ml) se karein.",
                "Har glassware ki ek tolerance seema hoti hai (Class A ke liye kam, Class B ke liye adhik). Yadi ganana kiya gaya volume is seema ke bheetar hai, toh glassware sahi hai, anyatha use asweekar kar diya jaata hai."
            ]
        }
    },
    thermometer: {
        title: "Thermometer का Calibration",
        intro: "Thermometer ko do nishchit binduon par calibrate kiya jaata hai, jisse unki sateekta sunishchit ho sake:",
        ice_point: {
            title: "1. Ice Point (0°C)",
            steps: [
                "Ek beaker mein shuddh, kuchli hui barf bharein.",
                "Usmein thoda thanda, distilled water daalein taaki barf poori tarah geeli ho jaaye, lekin taire nahi.",
                "Is barf-paani ke mishran ko acchi tarah milayein.",
                "Jis thermometer ko calibrate karna hai, use is mishran mein daalein. Dhyan rahe ki thermometer ka bulb beaker ke neeche ya kinaron se na takraye.",
                "Thermometer ko sthir hone tak prateeksha karein (lagbhag 3-4 minute).",
                "Reading note karein. Ek sahi calibrated thermometer par yeh <strong>0°C</strong> dikhana chahiye. Yadi koi antar hai, toh use truti ke roop mein note kar lein."
            ]
        },
        boiling_point: {
            title: "2. Boiling Point (100°C)",
            steps: [
                "Ek flask mein distilled water lein aur use ubaalna shuru karein.",
                "Thermometer ko flask mein is tarah rakhein ki uska bulb ubalte paani ke theek upar, bhaap mein rahe, paani ko na chue.",
                "Jab thermometer ki reading sthir ho jaaye, toh use note karein.",
                "Standard vayumandaliya dabav (760 mm Hg) par, paani <strong>100°C</strong> par ubalta hai. Yadi dabav alag hai, toh sudhar ki avashyakta ho sakti hai.",
                "Yadi reading 100°C se alag hai, toh us antar ko truti ke roop mein note karein."
            ]
        }
    },
    balance: {
        title: "Weighing Balance का Calibration",
        intro: "Weighing balance ko standard, pramanit vajanon ka upyog karke calibrate kiya jaata hai. Iske liye teen mukhya test kiye jaate hain:",
        tests: [
            "<strong>Eccentricity Test:</strong> Ismein standard vajan ko weighing pan ke alag-alag konon par rakhkar dekha jaata hai ki reading badal toh nahi rahi hai.",
            "<strong>Repeatability Test:</strong> Ismein ek hi vajan ko baar-baar rakhkar jaancha jaata hai ki balance har baar samaan reading de raha hai ya nahi.",
            "<strong>Linearity Test:</strong> Ismein balance ki poori maapne ki seema (jaise, 0g se 200g) mein alag-alag standard vajan (jaise, 20g, 50g, 100g, 150g) rakhkar sateekta jaanchi jaati hai."
        ]
    }
},
en: {
    mainTitle: "Calibration and Standardization",
    description: "A guide to ensuring accurate measurements in the dairy laboratory.",
    backToTopics: "Back to Topics",
    intro_p1: "<strong>Calibration</strong> means comparing a measuring instrument to a standard instrument whose measurement is already considered accurate. This determines how accurate our instrument is. It does not involve adjustment but may indicate the need for adjustment.",
    intro_p2: "In a dairy plant, the composition (fat, SNF, etc.) and quality of milk are analyzed multiple times from reception to dispatch. This is essential for correct pricing of the product, its suitability for processing, and meeting legal standards. Therefore, calibration and standardization of glassware (butyrometers, pipettes, etc.) and chemicals used in analysis are very important before use to avoid incorrect results.",
    tabs: {
        definitions: "Key Definitions",
        pipette: "Pipette Calibration",
        butyrometer: "Butyrometer Calibration",
        lactometer: "Lactometer Calibration",
        other: "Other Glassware",
        thermometer: "Thermometer Calibration",
        balance: "Weighing Balance"
    },
    definitions: {
        title: "Key Definitions",
        reagent: "Reagent",
        reagent_desc: "A substance that brings about a chemical change by reacting with another substance.",
        solution: "Solution",
        solution_desc: "A solution is a homogeneous mixture of two or more substances, consisting of a solute (in smaller quantity) and a solvent (in larger quantity).",
        dilute_sol: "<strong>Dilute Solution:</strong> Contains a small amount of solute.",
        concentrated_sol: "<strong>Concentrated Solution:</strong> Contains a large amount of solute.",
        saturated_sol: "<strong>Saturated Solution:</strong> No more solute can be dissolved at a given temperature.",
        standard_sol: "Standard Solution",
        standard_sol_desc: "A solution whose strength or concentration is precisely known.",
        normal_sol: "Normal Solution (Normality - N)",
        normal_sol_desc: "It is the number of gram equivalents of solute dissolved in 1 liter of solution. <code>N = gram equivalent of solute / volume of solution (L)</code>.",
        normal_sol_formula: "Gram equivalent weight = <code>Molar mass / n-factor</code>. (n-factor is the number of H+ ions for an acid and OH- ions for a base).",
        molar_sol: "Molar Solution (Molarity - M)",
        molar_sol_desc: "It is the number of moles of solute dissolved in 1 liter of solution. <code>M = moles of solute / volume of solution (L)</code>.",
        molal_sol: "Molal Solution (Molality - m)",
        molal_sol_desc: "It is the number of moles of solute dissolved in 1000g (1 kg) of solvent. <code>m = No. of moles of solute / weight of solvent (kg)</code>.",
        note: "Note: Normality and Molarity depend on temperature as volume changes with temperature, whereas Molality is independent of temperature."
    },
    pipette: {
        title: "Calibration of Milk Pipette",
        comparison: {
            title: "(a) Comparison Method",
            desc: "In this method, a fat test of milk is performed with a new pipette and its result is compared with that of an old, previously calibrated pipette. If both results are the same, the new pipette is considered correct. This is the easiest but least accurate method."
        },
        bis: {
            title: "(b) BIS Method (Gravimetric Method)",
            desc: "This is the most accurate method. It checks whether the pipette dispenses <strong>10.75 ± 0.03 ml</strong> of distilled water at 27°C.",
            steps: [
                "Clean the pipette and fill it with distilled water at 27°C above the mark.",
                "Adjust the meniscus to the mark.",
                "Dispense the water into a pre-weighed beaker.",
                "Weigh the beaker with the water and find the mass of the water.",
                "Calculate the volume: <code>Volume = Mass / Density</code>. The density of water at 27°C is 0.99654 g/mL.",
                "If the calculated volume is between 10.72 ml and 10.78 ml, the pipette is correct."
            ]
        },
        mathematical: {
            title: "(c) Mathematical Method",
            desc: "In this method, the volume per unit length of the pipette stem is calculated, and then based on the measurement of two temporary points, the correct point for 10.75 ml is determined and a permanent mark is made."
        }
    },
    butyrometer: {
        title: "Calibration of Butyrometer",
        principle: {
            title: "Principle",
            desc: "The main principle of butyrometer calibration is that the markings on its stem represent a certain volume. For a <strong>milk butyrometer</strong>, each <strong>1% fat mark is equivalent to an internal volume of 0.125 ml</strong>. Therefore, the total volume of the scale from 0 to 10% should be 1.25 ml. In calibration, we verify this volume. Pure mercury is commonly used for this because it does not stick to glass and has a very high density."
        },
        methods: {
            title: "Different Calibration Methods",
            comparison: {
                title: "1. Comparison Method",
                desc: "This is the easiest method. In this, the fat of the same milk sample is tested in two different butyrometers:",
                points: ["One previously calibrated (standard) butyrometer.", "One new butyrometer to be calibrated."],
                conclusion: "If the fat reading in both butyrometers is the same, the new butyrometer is considered correct. But this method is not very accurate as the old (standard) butyrometer may also not be correct."
            },
            bis: {
                title: "2. BIS Method (Mercury Pipette Method)",
                desc: "This is a more accurate and standard method. It uses a special type of automatic mercury pipette that dispenses exactly <strong>0.3125 ml</strong> of mercury at a time. This volume is equivalent to the <strong>2.5% fat scale</strong> of the butyrometer.",
                steps: [
                    "Clean and dry the butyrometer.",
                    "Fill the butyrometer with mercury up to the 10% mark. We consider this the base (zero) point.",
                    "Add 0.3125 ml of mercury from the mercury pipette into the butyrometer. The mercury level should come down from 10% to 7.5%.",
                    "Repeat this process 3 more times. Each time the mercury will fill a 2.5% scale (7.5% -> 5.0% -> 2.5% -> 0%).",
                    "If the butyrometer scale from 0 to 10% is filled correctly after adding mercury 4 times, the butyrometer is considered calibrated."
                ]
            },
            gravimetric: {
                title: "3. Gravimetric Method (by Weighing Mercury)",
                desc: "This is the most accurate method. In this, the volume is calculated by weighing the mercury between different marks.",
                steps: [
                    "Weigh a clean, dry butyrometer.",
                    "Fill it with mercury up to the 10% mark and weigh again.",
                    "Now fill with mercury up to the 9% mark and weigh again. The difference between the two weights will give the weight of mercury between 9% and 10%.",
                    "Using the density of mercury (which depends on temperature), convert this weight to volume: <code>Volume = Mass / Density</code>.",
                    "This volume should be between <strong>0.125 ± 0.001 ml</strong> (for 1% fat).",
                    "Similarly, repeat this test at 2-3 different points on the butyrometer scale (e.g., 5-6% and 1-2%) to check the accuracy of the entire scale."
                ]
            }
        },
        table: {
            caption: "Table 6.1: Types of Butyrometers for Different Products",
            header1: "Scale Range (%)",
            header2: "Product",
            rows: [
                { scale: "0–0.5", product: "Skimmed milk" },
                { scale: "0–4", product: "Partly skimmed milk, buttermilk" },
                { scale: "0–10", product: "Whole milk, evaporated milk (unsweetened)" },
                { scale: "0–20", product: "Dry milk powder" },
                { scale: "0–40", product: "Ice cream, condensed milk, cheese" },
                { scale: "0–70", product: "Cream" },
                { scale: "0–90", product: "Butter" }
            ]
        }
    },
    lactometer: {
        title: "Calibration of Lactometer",
        principle: {
            title: "Principle",
            desc1: "Lactometers work on <strong>Archimedes' principle</strong>: when an object is immersed in a liquid, it is buoyed up by a force equal to the weight of the liquid displaced by the object. The lactometer measures the specific gravity of the liquid. The denser the milk (more SNF), the less the lactometer will sink, and the reading will be higher. Adding water makes the milk thinner, causing the lactometer to sink more and the reading to be lower.",
            desc2: "Commonly 3 types of lactometers are used, which are calibrated at different temperatures:",
            types: ["<strong>Quevenne’s Lactometer:</strong> calibrated at 15.5°C.", "<strong>BIS Lactometer:</strong> calibrated at 27°C.", "<strong>Zeal Lactometer:</strong> calibrated at 29.4°C."],
            desc3: "A standard BIS lactometer has a specific gravity range from 1.020 to 1.035, which is represented as 20 to 35 on the scale."
        },
        methods: {
            title: "Different Calibration Methods",
            comparison: {
                title: "1. Comparison Method",
                desc: "This is the easiest method. In this, two lactometers (one new and one previously calibrated standard lactometer) are immersed together in the same milk sample. If both give the same reading, the new lactometer is considered correct."
            },
            bis: {
                title: "2. BIS Method (Standard Solution Method)",
                desc: "This is an accurate method that uses solutions of known specific gravity. Typically, solutions of anhydrous sodium carbonate or sodium chloride are made.",
                steps: [
                    "According to the table, dissolve a specified amount of anhydrous sodium carbonate in distilled water for different specific gravities (e.g., 1.025, 1.030).",
                    "Add a little ethyl alcohol to bring the surface tension of this solution equal to that of milk.",
                    "Pour the solution into a lactometer jar and bring the temperature to the lactometer's calibration temperature (e.g., 27°C for BIS).",
                    "Gently immerse the lactometer in the solution and let it stabilize.",
                    "Note the reading. Your reading should match the specific gravity of the standard solution. According to BIS, the difference should not be more than 0.0005."
                ]
            }
        }
    },
    other_glassware: {
        title: "Calibration of Other Glassware",
        intro: "Calibrating glassware like volumetric flasks, measuring cylinders, and beakers is just as important as calibrating pipettes and butyrometers. Their calibration is also done by the Gravimetric Method (by measuring weight).",
        principle: {
            title: "Principle",
            desc: "The principle of this method is very simple: we find the volume of distilled water contained in the glassware by weighing it at a certain temperature, as the density of water at every temperature is known (<code>Volume = Mass / Density</code>). This calculated volume is compared with the capacity written on the glassware."
        },
        procedure: {
            title: "Calibration Method for Volumetric Flask/Measuring Cylinder/Beaker",
            steps: [
                "Weigh a clean and completely dry volumetric flask (or cylinder/beaker) on an accurate weighing balance. Note this weight as <strong>W1</strong>.",
                "Now, slowly fill that flask with distilled water at a certain temperature (usually 27°C) up to its graduation mark. The lower part of the meniscus should be on the mark.",
                "Weigh the flask filled with water again. Note this weight as <strong>W2</strong>.",
                "Calculate the weight (mass) of the water: <strong>Mass of Water = W2 - W1</strong>.",
                "Now calculate the volume of water from this weight: <strong>Volume (ml) = Mass of Water (g) / Density of water at 27°C (0.99654 g/ml)</strong>.",
                "Compare the calculated volume with the capacity written on the flask (e.g., 100 ml, 250 ml).",
                "Every glassware has a tolerance limit (less for Class A, more for Class B). If the calculated volume is within this limit, the glassware is correct, otherwise, it is rejected."
            ]
        }
    },
    thermometer: {
        title: "Calibration of Thermometer",
        intro: "Thermometers are calibrated at two fixed points to ensure their accuracy:",
        ice_point: {
            title: "1. Ice Point (0°C)",
            steps: [
                "Fill a beaker with pure, crushed ice.",
                "Add a little cold, distilled water to it so that the ice is completely wet but not floating.",
                "Mix this ice-water mixture well.",
                "Immerse the thermometer to be calibrated in this mixture. Ensure the thermometer's bulb does not touch the bottom or sides of the beaker.",
                "Wait for the thermometer to stabilize (about 3-4 minutes).",
                "Note the reading. A correctly calibrated thermometer should show <strong>0°C</strong>. If there is any difference, note it as an error."
            ]
        },
        boiling_point: {
            title: "2. Boiling Point (100°C)",
            steps: [
                "Take distilled water in a flask and start boiling it.",
                "Place the thermometer in the flask in such a way that its bulb is just above the boiling water, in the steam, not touching the water.",
                "When the thermometer's reading stabilizes, note it.",
                "At standard atmospheric pressure (760 mm Hg), water boils at <strong>100°C</strong>. If the pressure is different, a correction may be needed.",
                "If the reading is different from 100°C, note that difference as an error."
            ]
        }
    },
    balance: {
        title: "Calibration of Weighing Balance",
        intro: "Weighing balances are calibrated using standard, certified weights. Three main tests are performed for this:",
        tests: [
            "<strong>Eccentricity Test:</strong> In this, the standard weight is placed on different corners of the weighing pan to see if the reading changes.",
            "<strong>Repeatability Test:</strong> In this, the same weight is placed repeatedly to check if the balance gives the same reading every time.",
            "<strong>Linearity Test:</strong> In this, the accuracy is checked across the entire measuring range of the balance (e.g., 0g to 200g) by placing different standard weights (e.g., 20g, 50g, 100g, 150g)."
        ]
    }
}
}

    

    