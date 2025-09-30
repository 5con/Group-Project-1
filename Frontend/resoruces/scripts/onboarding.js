/*
  Onboarding & Plan Generation (resoruces/scripts/onboarding.js)
  - First-time profile capture via modal
  - Basketball/Football positional assets and plans
  - Weekly plan generation and persistence
*/
;(function () {
  const SPORTS = ['Baseball', 'Basketball', 'Football', 'Golf', 'Running']
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

  const SPORT_POSITIONS = {
    Football: [
      { value: 'QB', label: 'Quarterback' },
      { value: 'WR', label: 'Wide Receiver' },
      { value: 'LB', label: 'Linebacker' },
      { value: 'CB', label: 'Cornerback' },
    ],
    Basketball: [
      { value: 'PG', label: 'Point Guard' },
      { value: 'Forward', label: 'Forward' },
      { value: 'Center', label: 'Center' },
    ],
  }

  // Star athlete assets (served locally from resoruces/images)
  const STAR_ATHLETES = {
    Baseball: { name: 'Shohei Ohtani', img: './resoruces/images/athlete-baseball.svg' },
    Basketball: { name: 'LeBron James', img: './resoruces/images/athlete-basketball.svg' },
    Football: { name: 'Patrick Mahomes', img: './resoruces/images/athlete-football.svg' },
    Golf: { name: 'Tiger Woods', img: './resoruces/images/athlete-golf.svg' },
    Running: { name: 'Eliud Kipchoge', img: './resoruces/images/athlete-running.svg' },
  }

  const FOOTBALL_ATHLETES = {
    QB: { name: 'Patrick Mahomes', img: './resoruces/images/athlete-qb.jpg.jpg' },
    WR: { name: 'Justin Jefferson', img: './resoruces/images/athlete-wr.jpg.jpg' },
    LB: { name: 'Fred Warner', img: './resoruces/images/athlete-lb.jpg.webp' },
    CB: { name: 'Patrick Surtain', img: './resoruces/images/athlete-cb.jpg.jpg' },
  }

  const BASKETBALL_POSITION_ATHLETES = {
    PG: { name: 'Stephen Curry', img: './resoruces/images/athlete-basketball.svg' },
    Forward: { name: 'Jayson Tatum', img: './resoruces/images/athlete-basketball.svg' },
    Center: { name: 'Nikola Jokic', img: './resoruces/images/athlete-basketball.svg' },
  }

  const DIET_TIPS = {
    Baseball: 'Lean protein, shoulder health, steady carbs.',
    Basketball: '6-8 g/kg carbs • 1.8 g/kg protein • Rehydrate 125% sweat loss.',
    Football: 'Protein: 1.6-2.0 g/kg/day • Carbs: 5-7 g/kg/day • Hydration: 3-5 L/day',
    Golf: 'Light steady energy; hydration; posture-support nutrients.',
    Running: 'Carbs: 6-10 g/kg/day • Protein: 1.2-1.7 g/kg/day • Hydration: 35-40 ml/kg/day',
  }

  const BASKETBALL_BLUEPRINTS = {
    PG: {
      label: 'Point Guard',
      athlete: {
        name: 'Stephen Curry',
        image: './resoruces/images/athlete-basketball.svg',
        inspiration: 'Stephen Curry off-season micro-dose work',
      },
      metrics: [
        { label: 'Release Speed', value: '0.55s', target: 'Goal: 0.50s', progress: 88 },
        { label: 'Lane Agility', value: '10.8s', target: 'Goal: 10.5s', progress: 84 },
        { label: 'Pull-up 3FG%', value: '42%', target: 'Goal: 45%', progress: 82 },
      ],
      macros: { protein: 170, carbs: 440, fat: 80 },
      hydration: {
        goal: '3.8L',
        notes: 'Sip 12-14oz every 20 minutes during court work.',
        electrolytes: '1.2g sodium target',
      },
      nutritionTips: [
        'Front-load 60-70g carbs 90 minutes before skill labs to sustain high rep volume.',
        'Pair vitamin D + omega-3 in the evening to protect joints after heavy shooting days.',
      ],
      sessions: {
        skillLab: {
          title: 'Curry Handle-to-Shot Lab',
          summary: 'Handle and shooting micro-dose inspired by Stephen Curry.',
          cardSummary: {
            Beginner: 'Curry handle ladder + form shooting circuit • 60 min.',
            Intermediate: 'Curry handle ladder + relocation 3s on the move • 70 min.',
            Advanced: 'Curry handle ladder + guided contact relocation 3s • 80 min + situational film.',
          },
          levelNotes: {
            Beginner: 'Stay on stationary combos, add 50 make spot shooting focus on mechanics.',
            Intermediate: 'Layer pace changes and relocation threes off movement.',
            Advanced: 'Add guided defender, deep range shots, and 10-minute film recap.',
          },
          duration: { Beginner: '60 min', Intermediate: '70 min', Advanced: '80-90 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: '2 basketballs • 8 cones • shooting gun optional',
          segments: [
            'Two-ball rhythm ladder (3 rounds beginner, 4 intermediate, 5 advanced with tennis-ball distraction).',
            'Pick-and-roll pace finishes with pad contact—add veer and hang dribbles for advanced.',
            'Relocation shooting circuit (50/60/80 makes by level, include drift + flare threes for advanced).',
          ],
          finisher: {
            Beginner: 'Free throw ladder: 3 rounds of 8 makes with diaphragmatic breathing.',
            Intermediate: 'Free throw ladder: 3 rounds of 10 makes; restart if two misses in a row.',
            Advanced: 'Free throw ladder: 4 rounds of 12 makes; heartbeat < 90 bpm before final set.',
          },
          doubleSession: {
            Advanced: 'PM: 45-min 0.5-second rule small-sided games + 30 logo makes under fatigue.',
          },
          notes: [
            'Track makes/misses to monitor hot and cold zones weekly.',
            'Keep hips loaded before every catch; no hop shooting on stationary reps.',
          ],
          inspiration: 'Modeled after Stephen Curry and trainer Brandon Payne off-season sessions.',
          film: 'Film: Curry vs Nuggets 2022 Game 2 — relocation out of slot pick-and-roll.',
          nutrition: {
            Beginner: {
              pre: 'Oats + whey + blueberries (65g carbs / 25g protein) 75 minutes pre-court.',
              during: 'Electrolyte drink (sodium 500mg) sipped between ladders.',
              post: '30g whey shake + banana + 12oz coconut water within 20 minutes.',
              evening: 'Salmon + jasmine rice + roasted veggies + tart cherry juice.',
            },
            Intermediate: {
              pre: 'Rice bowl (70g carbs) + 25g protein 90 minutes pre + 200mg caffeine optional.',
              during: 'Carb-electrolyte mix (30g carbs) split across segments.',
              post: 'Chocolate milk (30g carbs) + turkey wrap (30g protein).',
              evening: 'Greek yogurt parfait + granola + magnesium glycinate before sleep.',
            },
            Advanced: {
              pre: 'White rice + egg whites + avocado toast (80g carbs / 35g protein) 2h pre.',
              during: 'Isotonic drink (40g carbs + 800mg sodium) across session.',
              post: 'Grilled chicken + quinoa + pineapple + recovery shake (25g protein).',
              evening: 'Bison tacos + roasted potatoes + collagen + tart cherry concentrate.',
            },
          },
        },
        strength: {
          title: 'Curry Strength Micro-Dose',
          summary: 'Single-leg force, posterior chain strength, and anti-rotation core.',
          cardSummary: {
            Beginner: 'Lower-body strength + core anti-rotation • 45 min.',
            Intermediate: 'Contrast lower-body strength + med-ball power • 50 min.',
            Advanced: 'Heavy trap bar + velocity contrast + core work • 55 min.',
          },
          levelNotes: {
            Beginner: 'Focus on tempo goblet squats and bodyweight plyo to build positions.',
            Intermediate: 'Load trap bar to ~1.6x BW and add contrast jumps.',
            Advanced: 'Work up to 85% trap bar triples with VBT feedback and heavy Pallof holds.',
          },
          duration: { Beginner: '45 min', Intermediate: '50 min', Advanced: '55 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Trap bar • kettlebells • mini bands • med-ball',
          segments: [
            'Trap bar deadlift cluster (3x5 beginner @70%, 4x4 intermediate @80%, 5x3 advanced @85%).',
            'Single-leg pogo or split squat jumps (3x10 each level—add weighted vest for advanced).',
            'Half-kneeling cable anti-rotation + med-ball hook passes (progress load by level).',
          ],
          finisher: {
            Beginner: 'Core finisher: 3 rounds of 30s hollow hold + 12 bird dogs each side.',
            Intermediate: 'Core finisher: 4 rounds of Pallof press ISO (30s) + med-ball slams (10).',
            Advanced: 'Core finisher: 4 rounds of anti-rotation walkouts (20 steps) + rotational throws (12).',
          },
          notes: [
            'Track bar velocity (m/s) on heavy sets to maintain power output.',
            'Keep recovery windows ~90s; advanced athletes can superset with breathing reset.',
          ],
          inspiration: 'Borrowed from Stephen Curry x Carl Bergstrom lower-body micro-dose structure.',
          film: 'Film: Warriors playoff clips—note Curry balance out of screens.',
          nutrition: {
            Beginner: {
              pre: 'Greek yogurt + banana + honey drizzle 45 minutes pre-lift.',
              during: 'Water with pinch of sea salt.',
              post: 'Egg scramble + sweet potato hash + spinach.',
              evening: 'Lean burger bowl + quinoa + roasted Brussels sprouts.',
            },
            Intermediate: {
              pre: 'Protein shake + granola bar 60 minutes pre-lift.',
              during: '5g essential amino acids in water.',
              post: 'Ground turkey rice bowl + avocado.',
              evening: 'Seared tuna + soba noodles + broccoli.',
            },
            Advanced: {
              pre: 'Cream of rice + whey isolate (30g protein / 75g carbs) 90 minutes pre.',
              during: 'Carb powder (20g) + electrolytes at midpoint.',
              post: 'Steak + baked potato + charred peppers.',
              evening: 'Greek yogurt + berries + casein + omega-3 caps.',
            },
          },
        },
        conditioning: {
          title: 'Curry Change-of-Pace Conditioning',
          summary: 'Agility ladder, shuttle tempos, and VO2 micro-intervals.',
          cardSummary: {
            Beginner: 'Agility ladder + half-court tempos • 35 min.',
            Intermediate: 'Lane agility repeats + tempo sprints • 40 min.',
            Advanced: 'Reactive COD + on/off court intervals • 45 min.',
          },
          levelNotes: {
            Beginner: 'Stay submax on ladder; focus on shin angles and posture.',
            Intermediate: 'Add resisted first step and baseline-to-baseline tempos.',
            Advanced: 'Incorporate reaction cues and 15s on/15s off intervals.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Agility ladder • cones • resistance band • timer',
          segments: [
            'Ladder flow circuit (4/5/6 rounds by level) with cross-step and Icky shuffle variations.',
            'Lane-agility shuttle (3/4/5 reps) targeting sub 11s, add light sled for advanced.',
            'Court tempo runs (6/8/10 reps) with 1:2 work:rest; advanced add 6 x 15s bike sprints.',
          ],
          finisher: {
            Beginner: 'Cool-down jog 5 minutes + calf stretch.',
            Intermediate: 'Jog 6 minutes + hip flow + 5 diaphragmatic breaths.',
            Advanced: 'Jog 6 minutes + contrast showers + box breathing (3 minutes).',
          },
          notes: [
            'Record best shuttle time weekly.',
            'Stay nasal breathing through recoveries to keep HR < 150 before next rep.',
          ],
          inspiration: 'Pulled from Warriors change-of-pace conditioning blocks used in 2021 off-season.',
          film: 'Film: Curry pace shifts in 2021 play-in vs Lakers.',
          nutrition: {
            Beginner: {
              pre: 'Banana + 500ml electrolyte water 45 minutes pre.',
              during: 'Water + pinch sea salt.',
              post: 'Smoothie with whey, frozen fruit, spinach, and flax.',
              evening: 'Whole grain pasta + turkey meatballs.',
            },
            Intermediate: {
              pre: 'Rice cakes + almond butter + honey 60 minutes pre.',
              during: 'Electrolyte tabs every 15 minutes.',
              post: 'Protein shake + apple + handful of pretzels.',
              evening: 'Shrimp stir fry + brown rice.',
            },
            Advanced: {
              pre: 'Bagel + jam + 30g whey isolate 90 minutes pre.',
              during: 'Carb-electrolyte mix (30g carbs) across session.',
              post: 'Cottage cheese + pineapple + hydration salts.',
              evening: 'Salmon poke bowl + edamame + miso soup.',
            },
          },
        },
        iq: {
          title: 'Curry Film + Mobility Reset',
          summary: 'Film study, mobility, and nervous system reset.',
          cardSummary: {
            Beginner: 'Film study + 30 min mobility sequence.',
            Intermediate: 'Film + mobility + guided shooting walkthrough.',
            Advanced: 'Film block + contrast mobility + mindfulness reset.',
          },
          levelNotes: {
            Beginner: '40 minutes film on pick-and-roll reads; repeat key clips.',
            Intermediate: 'Add 20-min guided walk-through with light ball-handling.',
            Advanced: 'Add cognitive drills (light reaction ball) post film.',
          },
          duration: { Beginner: '50 min', Intermediate: '55 min', Advanced: '60 min' },
          intensity: { Beginner: 1, Intermediate: 2, Advanced: 2 },
          equipment: 'Tablet/laptop • foam roller • mini bands • yoga mat',
          segments: [
            'Film block: pick-and-roll reads vs drop + switch (20-30 minutes).',
            'Mobility flow: hips, ankles, thoracic spine (15-20 minutes).',
            'Reset: guided breathing + vagus nerve stimulation (10 minutes).',
          ],
          finisher: {
            Beginner: 'Static stretch + gratitude journaling (5 minutes).',
            Intermediate: 'Psoas release + 5 minutes of light form shooting.',
            Advanced: 'Neuromuscular primer—6 minutes jump rope + HRV check.',
          },
          notes: [
            'Take notes on counter options you want to rep Friday.',
            'Stay in nasal breathing through mobility flow.',
          ],
          inspiration: 'Mirrors Curry weekly recovery + film cadence between heavy workloads.',
          film: 'Film pack: Warriors vs Celtics 2022 Finals Game 4—late-game decision-making.',
          nutrition: {
            Beginner: {
              pre: 'Hydrate with herbal tea + citrus.',
              during: 'Water with electrolytes.',
              post: 'Greek yogurt + berries + walnuts.',
              evening: 'Light dinner: grilled fish + quinoa + salad.',
            },
            Intermediate: {
              pre: 'Matcha latte + collagen 30 minutes pre-film.',
              during: 'Electrolyte water.',
              post: 'Protein shake + rice cake + almond butter.',
              evening: 'Stir fried veggies + tofu + rice noodles.',
            },
            Advanced: {
              pre: 'Bone broth + electrolytes.',
              during: 'Hydration water (no extra carbs).',
              post: 'Recovery smoothie + creatine + magnesium.',
              evening: 'Sushi night with focus on lean fish + rice + seaweed salad.',
            },
          },
        },
        positionLab: {
          title: 'Curry Advantage Creation Lab',
          summary: 'Position-specific reads out of split cuts and high ball screens.',
          cardSummary: {
            Beginner: 'Handle into live passing windows + floater touch • 65 min.',
            Intermediate: 'Split-cut reads + skip passes + pull-up threes • 75 min.',
            Advanced: 'Live reads vs two defenders + drift + floater craft • 85 min.',
          },
          levelNotes: {
            Beginner: 'Work half-speed reads; 40 makes floater / 20 assisted threes.',
            Intermediate: 'Add weak-side drift passes, record makes vs movement.',
            Advanced: 'Add second defender; track decision-making speed on film.',
          },
          duration: { Beginner: '65 min', Intermediate: '75 min', Advanced: '85 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: '2 basketballs • partner/pad • 6 cones',
          segments: [
            'Split-cut read series (simple to complex; add live defender for advanced).',
            'Floater touch ladder (front / inside foot; add euro step to floater advanced).',
            'Corner drift + shake passes (10/15/20 reps each direction by level).',
          ],
          finisher: {
            Beginner: 'Make 20 free throws + 20 floaters (weak hand).',
            Intermediate: 'Make 30 free throws + 30 pull-up threes.',
            Advanced: 'Make 40 free throws + 40 pull-up threes off drag screens.',
          },
          doubleSession: {
            Advanced: 'Optional PM: 30-minute pick-and-roll situational film cutups.',
          },
          notes: [
            'Record touch on floaters; track make % on weak-hand finishes.',
            'Keep turnover goal < 2 per 5-minute live set.',
          ],
          inspiration: 'Inspired by Stephen Curry split-cut and drift progression days.',
          film: 'Film: Warriors split-cut package vs Celtics (2024 regular season).',
          nutrition: {
            Beginner: {
              pre: 'Bagel + peanut butter + banana 90 minutes pre.',
              during: 'Electrolyte drink + sips of sports drink.',
              post: 'Turkey sandwich + orange + hydration salts.',
              evening: 'Chicken stir fry + rice + veggies.',
            },
            Intermediate: {
              pre: 'Rice bowl + grilled chicken + fruit 2h pre.',
              during: 'Isotonic drink (35g carbs) + BCAAs.',
              post: 'Protein shake + sweet potato + greens.',
              evening: 'Pasta with lean beef + side salad.',
            },
            Advanced: {
              pre: 'Cream of rice + whey + almond butter (90g carbs / 35g protein).',
              during: 'Carb mix (45g) + electrolytes across session.',
              post: 'Salmon + couscous + mango salsa.',
              evening: 'Recovery bowl: quinoa + roasted veggies + seeds + kefir.',
            },
          },
        },
        combo: {
          title: 'Curry Combo Day (Skill + Load)',
          summary: 'Morning skill tune-up + evening competitive block for advanced.',
          cardSummary: {
            Beginner: 'Skill tune-up + mobility finisher • 60 min.',
            Intermediate: 'Skill tune-up + light lift • 70 min.',
            Advanced: 'AM skill + PM controlled scrimmage (two-a-day).',
          },
          levelNotes: {
            Beginner: 'Keep AM block to 45 minutes then mobility; no PM session.',
            Intermediate: 'Add 25-minute strength maintenance after skill.',
            Advanced: 'Two sessions: AM skill + PM 4x8-minute scrimmage with constraints.',
          },
          duration: { Beginner: '60 min', Intermediate: '70 min', Advanced: '100 min (split)' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • bands • dumbbells • heart-rate monitor',
          segments: [
            'AM: Spot up + drift + relocation shooting (volume scaled by level).',
            'AM: Quick-touch finishing and 1-dribble pull-ups.',
            'PM (advanced): Controlled scrimmage with touch limit and paint touches target.',
          ],
          finisher: {
            Beginner: 'Mobility flow 20 minutes + foam roll.',
            Intermediate: 'Contrast lift finisher (rear-foot split squat + med-ball slams).',
            Advanced: 'PM finisher: Ice bath 8 minutes + mindfulness 10 minutes.',
          },
          doubleSession: {
            Intermediate: 'Optional PM: 20-minute lift (split squats + RDL + core).',
            Advanced: 'Required PM: Controlled scrimmage w/ analytics tracking.',
          },
          notes: [
            'Keep overall RPE ≤ 7 to stay fresh for upcoming week.',
            'Log PM scrimmage stats: assist-to-turnover and paint-touch rate.',
          ],
          inspiration: 'Warriors Saturday two-block structure (skill AM, team concepts PM).',
          film: 'Film: Warriors 2018 mini-game (0.5s rule) breakdown.',
          nutrition: {
            Beginner: {
              pre: 'Whole grain toast + eggs + fruit.',
              during: 'Water + electrolytes.',
              post: 'Protein smoothie + granola.',
              evening: 'Baked chicken + potatoes + greens.',
            },
            Intermediate: {
              pre: 'Overnight oats + whey + berries.',
              during: 'Carb drink (20g) during AM + coconut water PM.',
              post: 'Rice bowl + lean beef + veggies.',
              evening: 'Sushi rolls + miso soup.',
            },
            Advanced: {
              pre: 'AM: Bagel + jam + turkey; PM: 50g carb + 20g protein snack.',
              during: 'AM: electrolyte mix; PM: sports drink + 500mg sodium.',
              post: 'PM: whey isolate + banana + rice cakes.',
              evening: 'Recovery plate: pasta + grilled salmon + beet salad.',
            },
          },
        },
        recovery: {
          title: 'Curry Recovery + Breath Work',
          summary: 'Active recovery, mobility, and nervous system reset.',
          cardSummary: {
            Beginner: 'Light mobility + 20-minute walk.',
            Intermediate: 'Mobility + pool or bike flush.',
            Advanced: 'Mobility, pool work, + HRV breath session.',
          },
          levelNotes: {
            Beginner: 'Keep heart rate < 120; focus on ankle mobility.',
            Intermediate: 'Add pool walking or easy bike 20 minutes.',
            Advanced: 'Add foam roll + psoas release + box breathing sets.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 1, Intermediate: 1, Advanced: 2 },
          equipment: 'Foam roller • mini bands • yoga mat',
          segments: [
            'Soft tissue + foam roll (8-10 minutes).',
            'Mobility flow: hips, t-spine, ankles (15 minutes).',
            'Breath work: 4-7-8 pattern + journaling (10 minutes).',
          ],
          finisher: {
            Beginner: 'Five-minute gratitude walk outside.',
            Intermediate: 'Contrast shower 5 minutes + legs up wall 5 minutes.',
            Advanced: 'Contrast hydrotherapy + HRV check-in + mindfulness journaling.',
          },
          notes: [
            'Stay off feet for rest of day; only light shooting if needed.',
            'Review weekly metrics and set focus for Monday.',
          ],
          inspiration: 'Mirrors Curry Sunday reset with emphasis on nervous system recovery.',
          film: 'Optional film: 15 minutes of prior week turnovers to correct.',
          nutrition: {
            Beginner: {
              pre: 'Hydrate on waking with lemon water.',
              during: 'Water + electrolytes.',
              post: 'Brunch: veggie omelette + fruit + whole grain toast.',
              evening: 'Slow cooker chicken + brown rice + salad.',
            },
            Intermediate: {
              pre: 'Collagen + vitamin C in water.',
              during: 'Coconut water + pinch salt.',
              post: 'Protein smoothie + oats + berries.',
              evening: 'Stir fry veggies + shrimp + rice noodles.',
            },
            Advanced: {
              pre: 'Hydration stack: 500ml water + electrolytes + adaptogens.',
              during: 'Low-calorie electrolyte drink.',
              post: 'Chia pudding + whey + banana.',
              evening: 'Grass-fed steak + quinoa + roasted veggies + chamomile tea.',
            },
          },
        },
      },
    },
    Forward: {
      label: 'Forward',
      athlete: {
        name: 'Jayson Tatum',
        image: './resoruces/images/athlete-basketball.svg',
        inspiration: 'Jayson Tatum off-season positional work',
      },
      metrics: [
        { label: 'Wing 3FG%', value: '38%', target: 'Goal: 40%', progress: 80 },
        { label: 'First Step Force', value: '2.6x BW', target: 'Goal: 2.8x', progress: 86 },
        { label: 'Slide Shuttle', value: '6.8s', target: 'Goal: 6.6s', progress: 84 },
      ],
      macros: { protein: 185, carbs: 470, fat: 85 },
      hydration: {
        goal: '4.1L',
        notes: 'Aim for clear urine by noon; add sodium in afternoon shake.',
        electrolytes: '1.4g sodium target',
      },
      nutritionTips: [
        'Refuel with 30g protein + 80g carbs within 30 minutes of combo days.',
        'Use beetroot or tart cherry before conditioning to enhance blood flow and recovery.',
      ],
      sessions: {
        skillLab: {
          title: 'Tatum Triple-Threat Lab',
          summary: 'Wing scoring versatility built around Jayson Tatum progressions.',
          cardSummary: {
            Beginner: 'Triple-threat scoring ladder + form finishing • 65 min.',
            Intermediate: 'Triple-threat scoring + step-back 3s + contact finishes • 75 min.',
            Advanced: 'Triple-threat to step-back + live defender ISO work • 85 min + film.',
          },
          levelNotes: {
            Beginner: 'Stay on jab-to-one-dribble pull-ups and pad-assisted finishes.',
            Intermediate: 'Add sidestep threes and contact finishing through pads.',
            Advanced: 'Add guided defender + double-team reads with skip passes.',
          },
          duration: { Beginner: '65 min', Intermediate: '75 min', Advanced: '85 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • pad • cones • resistance bands',
          segments: [
            'Heavy-ball warm-up into jab-series ladder (30/45/60 makes across spots).',
            'Mid-post footwork: fade, step-through, spin—add step-back counters for advanced.',
            'Catch-and-shoot into sidestep 3s + drift relocations (volume scaled by level).',
          ],
          finisher: {
            Beginner: '20 free throws + 20 controlled finishes (weak hand).',
            Intermediate: '30 free throws + 20 contested mid-post makes.',
            Advanced: '40 free throws + 30 contested mid-post makes vs pad.',
          },
          doubleSession: {
            Advanced: 'PM: 30-minute iso film + 15 contested makes off double-team kick-outs.',
          },
          notes: [
            'Use weighted ball for first 5 minutes to groove handle strength.',
            'Maintain 0.5-second decisions out of jab series.',
          ],
          inspiration: 'Modeled after Drew Hanlen x Jayson Tatum triple-threat labs.',
          film: 'Film: Celtics vs Heat 2023—Tatum isolation reads vs switch and zone.',
          nutrition: {
            Beginner: {
              pre: 'Peanut butter toast + banana + whey 90 minutes pre.',
              during: 'Electrolyte mix (500mg sodium).',
              post: 'Protein shake + fruit cup + pretzels.',
              evening: 'Grilled chicken + pesto pasta + asparagus.',
            },
            Intermediate: {
              pre: 'Oatmeal + berries + almond butter + whey 2h pre.',
              during: 'Carb drink (30g) across session.',
              post: 'Turkey burger + sweet potato wedges.',
              evening: 'Salmon + couscous + roasted veggies.',
            },
            Advanced: {
              pre: 'Cream of rice + whey + berries + beet juice shot.',
              during: 'Carb-electrolyte drink + 2g beta-alanine optional.',
              post: 'Bison bowl + jasmine rice + pineapple.',
              evening: 'Recovery: beef stir fry + white rice + tart cherry.',
            },
          },
        },
        strength: {
          title: 'Tatum Strength + Elastic Power',
          summary: 'Lower/upper strength waves with elastic contrast work.',
          cardSummary: {
            Beginner: 'Full-body strength + iso holds • 50 min.',
            Intermediate: 'Contrast strength with med-ball power • 55 min.',
            Advanced: 'Heavy trap bar + bench clusters + plyo contrast • 60 min.',
          },
          levelNotes: {
            Beginner: 'Focus on front squat pattern and tempo push-ups.',
            Intermediate: 'Add landmine press and loaded split squats.',
            Advanced: 'Use triphasic eccentrics + med-ball contrast throws.',
          },
          duration: { Beginner: '50 min', Intermediate: '55 min', Advanced: '60 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Trap bar • landmine • dumbbells • med-balls',
          segments: [
            'Trap bar deadlift or front squat (3x6 beginner, 4x5 intermediate, 5x4 advanced @80-85%).',
            'Bench press or landmine press + med-ball chest pass contrast.',
            'Rear-foot split squat + banded row superset (load increases by level).',
          ],
          finisher: {
            Beginner: 'Iso lunge hold 3x30s + farmer carry 3x20m.',
            Intermediate: 'Iso lunge hold 3x40s + sled push 4x20m.',
            Advanced: 'Iso lunge hold 4x45s + sled push 5x25m (heavy).',
          },
          notes: [
            'Track bar speed using rep-counter or app when possible.',
            'Maintain vertical shin on split squats to protect knees.',
          ],
          inspiration: 'Based on Tatum post-season strength blueprint under trainer Nick Friedman.',
          film: 'Film: Celtics wing post-up counters vs Milwaukee 2022.',
          nutrition: {
            Beginner: {
              pre: 'Greek yogurt + granola 45 minutes pre.',
              during: 'Water + electrolytes.',
              post: 'Chicken burrito bowl + guacamole.',
              evening: 'Shrimp tacos + mango salsa.',
            },
            Intermediate: {
              pre: 'Rice cakes + whey + banana 60 minutes pre.',
              during: 'Amino acids + creatine in water.',
              post: 'Steak + roasted potatoes + Brussels.',
              evening: 'Protein pancakes + berry compote.',
            },
            Advanced: {
              pre: 'High-carb shake (90g carbs) + 35g protein 90 minutes pre.',
              during: 'Carb-electrolyte drink (25g) + 5g creatine.',
              post: 'Poke bowl + edamame + miso soup.',
              evening: 'Bison meatballs + quinoa + spinach.',
            },
          },
        },
        conditioning: {
          title: 'Tatum Wing Agility Conditioning',
          summary: 'Defensive slide matrix, half-court pushes, plyo bounding.',
          cardSummary: {
            Beginner: 'Slide matrix + build-up sprints • 35 min.',
            Intermediate: 'Slide matrix + full-court tempos + bounds • 40 min.',
            Advanced: 'Reactive slide matrix + COD sprints + bounds • 45 min.',
          },
          levelNotes: {
            Beginner: 'Keep angles crisp—focus on hip drop and shin alignment.',
            Intermediate: 'Add resisted starts and lane sprints.',
            Advanced: 'Add reaction cues and live closeout recoveries.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Cones • resistance bands • slide board optional',
          segments: [
            'Defensive slide matrix (4/5/6 sets) with closeout + retreat.',
            'Half-court to full-court tempos (6/8/10 reps) with 1:2 rest.',
            'Single-leg bounds + depth jumps (volume scales by level).',
          ],
          finisher: {
            Beginner: 'Bike flush 5 minutes + static stretch.',
            Intermediate: 'Bike flush 6 minutes + hip cars + breath work.',
            Advanced: 'Pool recovery or VersaClimber 5 minutes + contrast shower.',
          },
          notes: [
            'Track best slide-matrix time weekly.',
            'Keep core braced—no folding at waist on slides.',
          ],
          inspiration: 'Borrowed from Celtics sports science COD sessions.',
          film: 'Film: Celtics 2023 defensive shell adjustments vs Heat.',
          nutrition: {
            Beginner: {
              pre: 'Banana + almond butter 45 minutes pre.',
              during: 'Electrolyte drink.',
              post: 'Protein smoothie + granola bar.',
              evening: 'Turkey chili + cornbread.',
            },
            Intermediate: {
              pre: 'Fruit smoothie + whey 60 minutes pre.',
              during: 'Isotonic beverage every 12 minutes.',
              post: 'Chicken quinoa bowl + veggies.',
              evening: 'Baked cod + sweet potato mash.',
            },
            Advanced: {
              pre: 'Bagel + honey + 30g whey + beetroot shot.',
              during: 'Carb-electrolyte mix (35g).',
              post: 'Greek yogurt + cereal + banana.',
              evening: 'Ribeye + jasmine rice + grilled peppers.',
            },
          },
        },
        iq: {
          title: 'Tatum Film + Mobility Reset',
          summary: 'Switch-coverage film, mobility, and mental reset.',
          cardSummary: {
            Beginner: 'Film study + 30 min mobility.',
            Intermediate: 'Film + walkthrough + recovery mobility.',
            Advanced: 'Film, walkthrough, and mindfulness + vision training.',
          },
          levelNotes: {
            Beginner: 'Focus film on reads vs late shot-clock switches.',
            Intermediate: 'Layer 20-minute walk-through of set counters.',
            Advanced: 'Add Stroop/vision drills after film to challenge cognition.',
          },
          duration: { Beginner: '50 min', Intermediate: '55 min', Advanced: '60 min' },
          intensity: { Beginner: 1, Intermediate: 2, Advanced: 2 },
          equipment: 'Tablet • foam roller • mini bands • reaction ball',
          segments: [
            'Film block: switch coverages + decision tree (20-25 minutes).',
            'Mobility: hips, thoracic spine, ankles (15-20 minutes).',
            'Mindfulness: box breathing, visualization, gratitude (10 minutes).',
          ],
          finisher: {
            Beginner: 'Static stretch hips + hamstrings.',
            Intermediate: 'Light handles on air + 10 free throws.',
            Advanced: 'Reaction ball tosses + HRV breathing check.',
          },
          notes: [
            'Document key counters you want Friday.',
            'Keep blue light filter on screens at night.',
          ],
          inspiration: 'Based on Celtics weekly film cadence for starting wings.',
          film: 'Film: Celtics vs Warriors 2024—wing isolations vs mismatches.',
          nutrition: {
            Beginner: {
              pre: 'Herbal tea + collagen.',
              during: 'Water.',
              post: 'Protein shake + apple + almonds.',
              evening: 'Mediterranean bowl + hummus + pita.',
            },
            Intermediate: {
              pre: 'Matcha + MCT oil + collagen.',
              during: 'Electrolyte water.',
              post: 'Smoothie bowl + chia seeds.',
              evening: 'Salmon salad + quinoa.',
            },
            Advanced: {
              pre: 'Adaptogen tea + glycine.',
              during: 'Mineral water.',
              post: 'Greek yogurt + berries + whey.',
              evening: 'Sushi + seaweed salad + miso.',
            },
          },
        },
        positionLab: {
          title: 'Tatum Elbow Creation Lab',
          summary: 'Elbow isolation, 45 cuts, and pick-and-pop sequencing.',
          cardSummary: {
            Beginner: 'Elbow jab ladder + 45 cuts • 70 min.',
            Intermediate: 'Elbow iso + downhill drives + skip pass reads • 80 min.',
            Advanced: 'Elbow iso + double team reads + live finishes • 90 min.',
          },
          levelNotes: {
            Beginner: 'Emphasize balance on jab jumpers; 30 contact finishes.',
            Intermediate: 'Add weak-hand downhill drive with bump finishes.',
            Advanced: 'Add live second defender to force skip passes or step-backs.',
          },
          duration: { Beginner: '70 min', Intermediate: '80 min', Advanced: '90 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • pad • partner • cones',
          segments: [
            'Elbow jab ladder (jab, cross, rip baseline—volume scaled by level).',
            'Downhill drive finishing vs pad + bump (add spin-back for advanced).',
            'Skip pass reads from nail—include live defender on advanced sets.',
          ],
          finisher: {
            Beginner: '20 free throws + 20 hook finishes.',
            Intermediate: '30 free throws + 24 floaters / runners.',
            Advanced: '40 free throws + 30 contested finishes (pad + shot clock).',
          },
          doubleSession: {
            Advanced: 'PM: 20-minute film on double-team reads + 15 contested pull-up makes.',
          },
          notes: [
            'Track make % on pull-ups from elbows and wings.',
            'Use 12-second shot clock to force fast decisions.',
          ],
          inspiration: 'Drawn from Tatum elbow iso + 45 cut packages.',
          film: 'Film: Celtics ATO elbow actions vs Sixers 2023.',
          nutrition: {
            Beginner: {
              pre: 'Bagel + turkey + cheese 90 minutes pre.',
              during: 'Electrolyte drink.',
              post: 'Protein shake + rice crackers + fruit.',
              evening: 'Chicken parmesan + whole grain pasta.',
            },
            Intermediate: {
              pre: 'Rice bowl + grilled salmon + fruit 2h pre.',
              during: 'Carb drink (35g).',
              post: 'Quinoa salad + rotisserie chicken.',
              evening: 'Thai curry + jasmine rice.',
            },
            Advanced: {
              pre: 'High-carb plate (90g carbs) + 35g protein + caffeine 2h pre.',
              during: 'Carb-electrolyte mix (40g) + sodium tabs.',
              post: 'Beef rice bowl + pineapple + recovery shake.',
              evening: 'Teriyaki salmon + noodles + greens.',
            },
          },
        },
        combo: {
          title: 'Tatum Combo Day',
          summary: 'AM shooting progression + PM controlled 3v3 sets.',
          cardSummary: {
            Beginner: 'AM skill + recovery flow • 65 min.',
            Intermediate: 'AM skill + light lift • 75 min.',
            Advanced: 'AM skill + PM 3v3 from Celtics sets.',
          },
          levelNotes: {
            Beginner: 'Keep AM to 45 minutes and finish with yoga.',
            Intermediate: 'Add 25-minute maintenance lift and isometrics.',
            Advanced: 'Two sessions: AM skill + PM 3v3 (Horns + zipper sets).',
          },
          duration: { Beginner: '65 min', Intermediate: '75 min', Advanced: '100 min (split)' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • dumbbells • bands • heart-rate monitor',
          segments: [
            'AM: 3-level shooting (rim / mid / three) with shot chart tracking.',
            'AM: Finishing circuit (Euro, bump, spin) with volume scaled by level.',
            'PM advanced: 3v3 controlled sets with paint-touch and pass-count constraints.',
          ],
          finisher: {
            Beginner: 'Yoga flow + foam roll 20 minutes.',
            Intermediate: 'Contrast lift finisher (iso holds + sled).',
            Advanced: 'PM cold plunge 8 minutes + guided breath session.',
          },
          doubleSession: {
            Intermediate: 'Optional PM: 25-minute strength maintenance (RDL, split squat, row).',
            Advanced: 'Required PM: Controlled 3v3 (4 x 8-minute quarters).',
          },
          notes: [
            'Track AM shooting percentages by zone.',
            'Keep PM scrimmage ATO focus on actual Celtics sets.',
          ],
          inspiration: 'Matches Boston Saturday rhythm (skill AM, team sets PM).',
          film: 'Film: Celtics horns stagger set breakdown 2024.',
          nutrition: {
            Beginner: {
              pre: 'Whole grain waffles + eggs + fruit.',
              during: 'Water + electrolytes.',
              post: 'Protein smoothie + oatmeal.',
              evening: 'Roasted chicken + potatoes + kale salad.',
            },
            Intermediate: {
              pre: 'Overnight oats + whey + berries.',
              during: 'Carb drink (20g) AM + coconut water PM.',
              post: 'Pasta + turkey meat sauce.',
              evening: 'Sushi + edamame + rice.',
            },
            Advanced: {
              pre: 'AM: bagel + smoked salmon + fruit; PM: 45g carb gel + 20g protein.',
              during: 'AM electrolyte mix; PM sports drink + sodium tab.',
              post: 'PM: whey shake + rice cakes + banana.',
              evening: 'Recovery bowl: steak + rice + veggies + tart cherry.',
            },
          },
        },
        recovery: {
          title: 'Tatum Recovery + Mobility',
          summary: 'Mobility, NormaTec, and breath work reset.',
          cardSummary: {
            Beginner: 'Mobility flow + walk • 35 min.',
            Intermediate: 'Mobility + bike flush + NormaTec • 40 min.',
            Advanced: 'Mobility + pool + HRV breath session • 45 min.',
          },
          levelNotes: {
            Beginner: 'Keep heart rate low; focus on hips and ankles.',
            Intermediate: 'Add 15-minute bike flush and NormaTec session.',
            Advanced: 'Add pool walk + diaphragm reset + mindfulness journaling.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 1, Intermediate: 1, Advanced: 2 },
          equipment: 'Foam roller • yoga mat • light band • NormaTec (if available)',
          segments: [
            'Soft tissue + foam roll (10 minutes).',
            'Mobility flow emphasizing hips, thoracic, ankles (15 minutes).',
            'Breath work and mindfulness (10 minutes).',
          ],
          finisher: {
            Beginner: 'Outdoor walk 10 minutes + gratitude list.',
            Intermediate: 'Bike flush 10 minutes + legs up wall 5 minutes.',
            Advanced: 'Pool walk 10 minutes + HRV check + meditation.',
          },
          notes: [
            'Limit screen time; focus on passive recovery midday.',
            'Review weekly performance KPIs before Monday.',
          ],
          inspiration: 'Derived from Celtics recovery protocols (NormaTec + mobility).',
          film: 'Optional: 15 minutes of personal defensive clips.',
          nutrition: {
            Beginner: {
              pre: 'Hydrate on waking with lemon water.',
              during: 'Water + electrolytes.',
              post: 'Smoothie bowl + granola + seeds.',
              evening: 'Roast chicken + brown rice + veggies.',
            },
            Intermediate: {
              pre: 'Collagen + vitamin C.',
              during: 'Coconut water + pinch salt.',
              post: 'Greek yogurt + honey + berries.',
              evening: 'Salmon + potato + spinach.',
            },
            Advanced: {
              pre: 'Hydration stack (water + electrolytes + adaptogens).',
              during: 'Low-calorie electrolyte drink.',
              post: 'Overnight oats + whey + chia.',
              evening: 'Grass-fed steak + quinoa + roasted vegetables + chamomile tea.',
            },
          },
        },
      },
    },
    Center: {
      label: 'Center',
      athlete: {
        name: 'Nikola Jokic',
        image: './resoruces/images/athlete-basketball.svg',
        inspiration: 'Nikola Jokic high-post playmaking blueprint',
      },
      metrics: [
        { label: 'Post PPP', value: '1.12', target: 'Goal: 1.18', progress: 88 },
        { label: 'Defensive Rebound %', value: '28%', target: 'Goal: 30%', progress: 92 },
        { label: 'Lane Shuttle', value: '11.2s', target: 'Goal: 10.8s', progress: 82 },
      ],
      macros: { protein: 205, carbs: 500, fat: 95 },
      hydration: {
        goal: '4.5L',
        notes: '2L before noon; add electrolytes to post-practice shake.',
        electrolytes: '1.6g sodium target',
      },
      nutritionTips: [
        'Anchor meals around 40g protein to support strength blocks.',
        'Add collagen + vitamin C pre-lift for joint integrity.',
      ],
      sessions: {
        skillLab: {
          title: 'Jokic High-Post Creation Lab',
          summary: 'DHO sequencing, short-roll passing, and low-post footwork.',
          cardSummary: {
            Beginner: 'High-post passing + touch finishes • 70 min.',
            Intermediate: 'High-post reads + DHO counters + Sombor shuffle • 80 min.',
            Advanced: 'High-post reads vs doubles + live DHO, trail 3s • 90 min.',
          },
          levelNotes: {
            Beginner: 'Focus on stationary DHO timing and hook finishes.',
            Intermediate: 'Add backside cut reads and trail threes.',
            Advanced: 'Add second defender, skip passes, and Sombor shuffle finishers.',
          },
          duration: { Beginner: '70 min', Intermediate: '80 min', Advanced: '90 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • partner • pad • cones',
          segments: [
            'High-post DHO sequencing (timing, fake hand-off, re-screen) scaled by level.',
            'Low-post counters (drop-step, up-and-under, Sombor shuffle).',
            'Short-roll passing to cutters + corner shooters (volume increases by level).',
          ],
          finisher: {
            Beginner: '20 hooks each hand + 15 elbow jumpers.',
            Intermediate: '25 hooks each hand + 20 trail threes.',
            Advanced: '30 hooks each hand + 25 trail threes under 0.5s decisions.',
          },
          doubleSession: {
            Advanced: 'PM: 30-minute film on Nuggets horns + high-low passing reads.',
          },
          notes: [
            'Track assist-to-turnover ratio in live DHO segments.',
            'Keep base wide and center of mass low on all counters.',
          ],
          inspiration: 'Nikola Jokic and Nuggets skill labs (DHO + high-low passing).',
          film: 'Film: Nuggets vs Wolves 2023—Jokic short-roll playmaking.',
          nutrition: {
            Beginner: {
              pre: 'Egg scramble + oats + fruit 2h pre.',
              during: 'Electrolyte drink + sips of sports drink.',
              post: 'Protein shake + banana + pretzels.',
              evening: 'Beef stew + potatoes + carrots.',
            },
            Intermediate: {
              pre: 'Rice bowl + chicken + veggies + fruit 2h pre.',
              during: 'Carb drink (35g).',
              post: 'Turkey sandwich + orange + hydration salts.',
              evening: 'Baked salmon + rice + roasted veggies.',
            },
            Advanced: {
              pre: 'High-carb plate (100g) + 40g protein + beet juice.',
              during: 'Carb-electrolyte mix (45g) + sodium tabs.',
              post: 'Bison burger + sweet potato + recovery shake.',
              evening: 'Slow cooker beef + noodles + kefir.',
            },
          },
        },
        strength: {
          title: 'Jokic Strength & Mobility Pillars',
          summary: 'Heavy strength, loaded carries, and mobility pairing.',
          cardSummary: {
            Beginner: 'Front squat + carries + mobility • 55 min.',
            Intermediate: 'Front squat + heavy carries + tempo eccentrics • 60 min.',
            Advanced: 'Heavy front squat + heavy carries + iso holds • 65 min.',
          },
          levelNotes: {
            Beginner: 'Keep tempo slow; focus on positions and breathing.',
            Intermediate: 'Add tempo eccentrics and heavier carries.',
            Advanced: 'Work to 85% front squat triples + 40m yoke carries.',
          },
          duration: { Beginner: '55 min', Intermediate: '60 min', Advanced: '65 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Barbell • sled • sandbag • kettlebells',
          segments: [
            'Front squat (3x5 beginner, 4x4 intermediate, 5x3 advanced @80-85%).',
            'Loaded carries (farmer / yoke) with distance scaled by level.',
            'Glute bridge or hip thrust + thoracic mobility superset.',
          ],
          finisher: {
            Beginner: 'Mobility flow 10 minutes + breathing drills.',
            Intermediate: 'Sled push 4x25m + breathing reset.',
            Advanced: 'Sled push 5x30m heavy + box breathing 5 minutes.',
          },
          notes: [
            'Track RPE on carries to manage fatigue.',
            'Keep heels rooted on front squats; elbows high.',
          ],
          inspiration: 'Based on Nuggets strength staff heavy/contrast philosophy.',
          film: 'Film: Jokic seal possessions vs Lakers 2023.',
          nutrition: {
            Beginner: {
              pre: 'Greek yogurt + granola + banana 60 minutes pre.',
              during: 'Water + electrolytes.',
              post: 'Chicken bowl + rice + veggies.',
              evening: 'Fish tacos + cabbage slaw.',
            },
            Intermediate: {
              pre: 'Bagel + eggs + fruit 90 minutes pre.',
              during: 'Creatine + electrolytes in water.',
              post: 'Steak + mashed potatoes + broccoli.',
              evening: 'Lamb gyro + couscous + salad.',
            },
            Advanced: {
              pre: 'Cream of rice + whey + banana + honey.',
              during: 'Carb-electrolyte mix (25g) + creatine.',
              post: 'Beef stir fry + white rice + pineapple.',
              evening: 'Turkey meatloaf + quinoa + roasted vegetables.',
            },
          },
        },
        conditioning: {
          title: 'Jokic Conditioning Circuit',
          summary: 'Lane sprints, sled drags, and bike tempo intervals.',
          cardSummary: {
            Beginner: 'Lane sprints + bike tempos • 35 min.',
            Intermediate: 'Lane sprints + sled drags + bike • 40 min.',
            Advanced: 'Reactive lane sprints + heavy drags + intervals • 45 min.',
          },
          levelNotes: {
            Beginner: 'Keep lane sprints submax; focus on length and foot strike.',
            Intermediate: 'Add sled drags and heavier bike resistance.',
            Advanced: 'Shorter rest (1:1) and add reactive cone cues.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Sled • sandbag • bike • cones',
          segments: [
            'Lane sprints (6/8/10 reps) with timed rest (2:1 beginner, 1.5:1 intermediate, 1:1 advanced).',
            'Sled drags forward/backward (4/5/6 sets) heavy for advanced.',
            'Bike or rower intervals (6 x 30s on / 60s off beginner, 8 x 30s on / 45s off advanced).',
          ],
          finisher: {
            Beginner: 'Mobility stretch + diaphragmatic breathing.',
            Intermediate: 'Mobility + cold shower contrast.',
            Advanced: 'Mobility + contrast shower + HRV breathing 5 minutes.',
          },
          notes: [
            'Track best lane time and average HR for intervals.',
            'Stay tall on sled drags; no collapse at waist.',
          ],
          inspiration: 'Mirrors Nuggets pace conditioning and sled work for bigs.',
          film: 'Film: Nuggets pace vs Suns 2023—big sprint lanes.',
          nutrition: {
            Beginner: {
              pre: 'Banana + peanut butter 45 minutes pre.',
              during: 'Electrolyte drink.',
              post: 'Protein shake + rice cakes.',
              evening: 'Chicken stir fry + noodles.',
            },
            Intermediate: {
              pre: 'Rice cakes + whey + honey 60 minutes pre.',
              during: 'Isotonic beverage every 12 minutes.',
              post: 'Greek yogurt + granola + berries.',
              evening: 'Shrimp fried rice + veggies.',
            },
            Advanced: {
              pre: 'Bagel + jam + 35g protein + beta-alanine.',
              during: 'Carb-electrolyte mix (40g).',
              post: 'Recovery shake + banana + salted pretzels.',
              evening: 'Pasta + pesto chicken + spinach.',
            },
          },
        },
        iq: {
          title: 'Jokic Film + Mobility Reset',
          summary: 'Film on high-low reads, mobility, diaphragmatic breathing.',
          cardSummary: {
            Beginner: 'Film + mobility circuit • 50 min.',
            Intermediate: 'Film + walk-through + mobility • 55 min.',
            Advanced: 'Film + walk-through + breath/vision reset • 60 min.',
          },
          levelNotes: {
            Beginner: 'Focus film on DHO timing and cutter spacing.',
            Intermediate: 'Add walk-through of split cut counters.',
            Advanced: 'Add vision + finger dexterity drills after film.',
          },
          duration: { Beginner: '50 min', Intermediate: '55 min', Advanced: '60 min' },
          intensity: { Beginner: 1, Intermediate: 2, Advanced: 2 },
          equipment: 'Tablet • mini bands • mobility tools',
          segments: [
            'Film block: horns / high-low reads (20-25 minutes).',
            'Mobility: hips, thoracic spine, ankles (15-20 minutes).',
            'Breath + visualization (10 minutes).',
          ],
          finisher: {
            Beginner: 'Static stretch + gratitude notes.',
            Intermediate: 'Light hook shots (20) + free throws (20).',
            Advanced: 'Reaction ball tosses + HRV measurement.',
          },
          notes: [
            'Capture cues you want to drill Saturday.',
            'Stay nasal breathing to drop HR below 60 before bed.',
          ],
          inspiration: 'Built from Jokic cognitive recovery routines (film + breathing).',
          film: 'Film: Nuggets horns split reads vs Heat 2023 Finals.',
          nutrition: {
            Beginner: {
              pre: 'Herbal tea + apple.',
              during: 'Water.',
              post: 'Protein shake + nuts.',
              evening: 'Salad bowl + grilled chicken.',
            },
            Intermediate: {
              pre: 'Bone broth + collagen + electrolytes.',
              during: 'Water + trace minerals.',
              post: 'Cottage cheese + fruit.',
              evening: 'Grilled fish + quinoa + veggies.',
            },
            Advanced: {
              pre: 'Adaptogen tea + glycine + magnesium.',
              during: 'Mineral water.',
              post: 'Greek yogurt + chia + walnuts.',
              evening: 'Sushi + miso soup + seaweed salad.',
            },
          },
        },
        positionLab: {
          title: 'Jokic Low-Post Craft + Trail 3 Lab',
          summary: 'Low-block counters, trail threes, and DHO timing.',
          cardSummary: {
            Beginner: 'Low-post touch + rim seals • 75 min.',
            Intermediate: 'Low-post counters + trail 3 reps • 85 min.',
            Advanced: 'Low-post vs doubles + live DHO + trail 3 volume • 95 min.',
          },
          levelNotes: {
            Beginner: 'Focus on deep seals and simple counters.',
            Intermediate: 'Add weak-side skip passes and trail threes.',
            Advanced: 'Add double-team reads and high-low passing to cutters.',
          },
          duration: { Beginner: '75 min', Intermediate: '85 min', Advanced: '95 min' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • pad • partner • cones',
          segments: [
            'Low-post counter series (jump hook, drop-step, counter spin).',
            'Trail 3 shooting (40/50/60 makes by level).',
            'High-low passing vs fronting defense (live partner).',
          ],
          finisher: {
            Beginner: 'Free throw ladder 3x10.',
            Intermediate: 'Free throw ladder 3x12 + 10 Sombor shuffle makes.',
            Advanced: 'Free throw ladder 4x12 + 20 Sombor shuffle makes.',
          },
          doubleSession: {
            Advanced: 'PM: 20-minute film review of doubles + 15 live post touches in 3v3.',
          },
          notes: [
            'Keep elbows high — no wasted dribbles in post.',
            'Track trail 3 percentage; target ≥ 37%.',
          ],
          inspiration: 'Derived from Nuggets low-post and trail shooting progression.',
          film: 'Film: Jokic trail 3s vs Lakers 2024 WCF.',
          nutrition: {
            Beginner: {
              pre: 'Bagel + ham + cheese 90 minutes pre.',
              during: 'Electrolyte drink.',
              post: 'Protein shake + banana + pretzels.',
              evening: 'Chicken alfredo + broccoli.',
            },
            Intermediate: {
              pre: 'Rice bowl + beef + veggies 2h pre.',
              during: 'Carb drink (35g).',
              post: 'Turkey wrap + fruit + hydration salts.',
              evening: 'Pork tenderloin + potatoes + veggies.',
            },
            Advanced: {
              pre: 'High-carb plate (100g) + 40g protein + caffeine 2h pre.',
              during: 'Carb-electrolyte mix (45g) + sodium tabs.',
              post: 'Bison steak + sweet potato + recovery shake.',
              evening: 'Goulash + noodles + kefir.',
            },
          },
        },
        combo: {
          title: 'Jokic Combo Day',
          summary: 'AM skill tune-up + PM 4v4 shell for advanced.',
          cardSummary: {
            Beginner: 'Skill tune-up + mobility • 70 min.',
            Intermediate: 'Skill tune-up + strength maintenance • 80 min.',
            Advanced: 'AM skill + PM 4v4 horns shell (two-a-day).',
          },
          levelNotes: {
            Beginner: 'Keep session short; focus on hook touch and free throws.',
            Intermediate: 'Add 25-minute strength maintenance block.',
            Advanced: 'Two sessions: AM high-low craft + PM 4v4 shell replicating Nuggets sets.',
          },
          duration: { Beginner: '70 min', Intermediate: '80 min', Advanced: '105 min (split)' },
          intensity: { Beginner: 3, Intermediate: 4, Advanced: 5 },
          equipment: 'Basketballs • sled • bands • teammates',
          segments: [
            'AM: Hook touch ladder + mid-post re-spot shooting.',
            'AM: High-low passing vs front + seal (increase defenders by level).',
            'PM advanced: 4v4 shell (horns, delay, Spain PnR) with constraints.',
          ],
          finisher: {
            Beginner: 'Mobility + foam roll 20 minutes.',
            Intermediate: 'Contrast lift finisher (RDL + sled drag).',
            Advanced: 'PM ice bath 8 minutes + breath ladder.',
          },
          doubleSession: {
            Intermediate: 'Optional PM: 20-minute lift (RDL, split squat, core).',
            Advanced: 'Required PM: 4v4 horns/delay shell to track assist-to-turnover.',
          },
          notes: [
            'Track hook make %, target 75%+, trail 3s 60% in AM block.',
            'Limit PM load to RPE 7 to stay fresh for next week.',
          ],
          inspiration: 'Matches Nuggets Saturday shell + skill format.',
          film: 'Film: Nuggets horns delay set breakdown 2024.',
          nutrition: {
            Beginner: {
              pre: 'Pancakes + eggs + fruit.',
              during: 'Water + electrolytes.',
              post: 'Protein shake + cereal.',
              evening: 'Roast beef + potatoes + veggies.',
            },
            Intermediate: {
              pre: 'Overnight oats + whey + berries.',
              during: 'Carb drink (25g) AM + coconut water PM.',
              post: 'Pasta + meat sauce + salad.',
              evening: 'Sushi + rice + miso.',
            },
            Advanced: {
              pre: 'AM: bagel + smoked salmon + fruit; PM: 60g carb + 25g protein snack.',
              during: 'AM electrolyte mix; PM sports drink + sodium.',
              post: 'PM: whey + banana + rice cakes.',
              evening: 'Recovery: lamb stew + potatoes + beet salad.',
            },
          },
        },
        recovery: {
          title: 'Jokic Recovery + Pool',
          summary: 'Pool work, mobility, and breath control.',
          cardSummary: {
            Beginner: 'Mobility + walk • 35 min.',
            Intermediate: 'Mobility + pool walk + breath work • 40 min.',
            Advanced: 'Mobility + pool work + contrast + HRV breath • 45 min.',
          },
          levelNotes: {
            Beginner: 'Easy pool walk or bike 10 minutes.',
            Intermediate: 'Add pool walk and diaphragmatic breathing.',
            Advanced: 'Add contrast therapy + HRV breath ladder.',
          },
          duration: { Beginner: '35 min', Intermediate: '40 min', Advanced: '45 min' },
          intensity: { Beginner: 1, Intermediate: 1, Advanced: 2 },
          equipment: 'Pool access • foam roller • yoga mat',
          segments: [
            'Soft tissue and foam roll (10 minutes).',
            'Mobility flow: hips, ankles, thoracic (15 minutes).',
            'Breath + mindfulness (10 minutes).',
          ],
          finisher: {
            Beginner: 'Outdoor walk 10 minutes.',
            Intermediate: 'Pool walk 10 minutes + legs up wall 5 minutes.',
            Advanced: 'Contrast shower + HRV breathing + gratitude note.',
          },
          notes: [
            'Prioritize sleep 9+ hours night before next microcycle.',
            'Review KPIs: rebound % and post PPP.',
          ],
          inspiration: 'Nuggets recovery day with pool emphasis and breathing work.',
          film: 'Optional: 10 minutes on defensive rebounding positioning.',
          nutrition: {
            Beginner: {
              pre: 'Hydration with lemon water.',
              during: 'Water + electrolytes.',
              post: 'Smoothie bowl + granola.',
              evening: 'Chicken stir fry + rice + veggies.',
            },
            Intermediate: {
              pre: 'Collagen + vitamin C.',
              during: 'Coconut water.',
              post: 'Protein smoothie + mixed nuts.',
              evening: 'Salmon + quinoa + spinach.',
            },
            Advanced: {
              pre: 'Hydration stack + adaptogens.',
              during: 'Electrolyte drink (low calorie).',
              post: 'Greek yogurt + berries + whey.',
              evening: 'Beef roast + potatoes + vegetables + chamomile tea.',
            },
          },
        },
      },
    },
  }

  const BASKETBALL_WEEK_TEMPLATE = [
    { title: 'Mon', type: 'skills', key: 'skillLab' },
    { title: 'Tue', type: 'strength', key: 'strength' },
    { title: 'Wed', type: 'conditioning', key: 'conditioning' },
    { title: 'Thu', type: 'iq', key: 'iq' },
    { title: 'Fri', type: 'skills', key: 'positionLab' },
    { title: 'Sat', type: 'combo', key: 'combo' },
    { title: 'Sun', type: 'rest', key: 'recovery' },
  ]

  function intensity(level) {
    switch (level) {
      case 'Beginner':
        return { vol: 'low', dur: 30 }
      case 'Intermediate':
        return { vol: 'moderate', dur: 45 }
      case 'Advanced':
        return { vol: 'high', dur: 60 }
      default:
        return { vol: 'moderate', dur: 40 }
    }
  }

  function sportBlocks(sport) {
    const common = {
      mobility: 'Mobility + activation',
      strength: 'Full-body strength',
      rest: 'Active recovery / rest',
      conditioning: 'Conditioning / cardio',
      skills: 'Skills + drills',
    }
    switch (sport) {
      case 'Baseball':
        return { ...common, skills: 'Hitting + fielding drills' }
      case 'Basketball':
        return { ...common, skills: 'Shooting + ball handling' }
      case 'Football':
        return { ...common, skills: 'Position-specific drills' }
      case 'Golf':
        return { ...common, skills: 'Swing mechanics + short game' }
      case 'Running':
        return { ...common, skills: 'Form drills + pace work' }
      default:
        return common
    }
  }

  function generateBasketballPlan(profile, weekStartDate) {
    const level = LEVELS.includes(profile.level) ? profile.level : 'Intermediate'
    const blueprint = BASKETBALL_BLUEPRINTS[profile.position]
    const plan = []
    for (let i = 0; i < BASKETBALL_WEEK_TEMPLATE.length; i++) {
      const block = BASKETBALL_WEEK_TEMPLATE[i]
      const dayDate = new Date(weekStartDate)
      dayDate.setDate(dayDate.getDate() + i)
      const session = blueprint?.sessions?.[block.key]
      const workoutSummary = session?.cardSummary?.[level] || `Basketball ${block.type} focus — ${level}`
      plan.push({
        date: window.AppStorage.getISODate(dayDate),
        day: block.title,
        workout: workoutSummary,
        type: block.type,
        key: block.key,
        athlete: blueprint?.athlete?.name || 'Elite Hooper',
        summary: session?.summary || '',
        inspiration: session?.inspiration || '',
      })
    }
    return plan
  }

  /** Generate one week plan using profile + templates */
  function generateWeeklyPlan(profile, weekStartDate) {
    if (profile.sport === 'Basketball' && profile.position) {
      return generateBasketballPlan(profile, weekStartDate)
    }

    const { sport, level } = profile
    const blocks = sportBlocks(sport)
    const it = intensity(level)
    const days = [
      { title: 'Mon', type: 'strength' },
      { title: 'Tue', type: 'skills' },
      { title: 'Wed', type: 'conditioning' },
      { title: 'Thu', type: 'strength' },
      { title: 'Fri', type: 'skills' },
      { title: 'Sat', type: 'mobility' },
      { title: 'Sun', type: 'rest' },
    ]
    const plan = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStartDate)
      d.setDate(d.getDate() + i)
      const block = days[i]
      plan.push({
        date: window.AppStorage.getISODate(d),
        day: block.title,
        workout: `${blocks[block.type]} — ${it.vol} • ${it.dur} min`,
        type: block.type,
      })
    }
    return plan
  }

  /** Ensure week plan exists; if not, generate and persist */
  function ensureWeekPlan(profile) {
    const start = window.AppStorage.startOfWeek(new Date())
    const key = window.AppStorage.getWeekKey(start)
    let p = window.AppStorage.getPlan(key)
    if (!p) {
      p = generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, p)
    }
    return { key, plan: p }
  }

  /** Open onboarding modal on first visit (no stored profile) */
  function openOnboardingModalIfNeeded() {
    const profile = window.AppStorage.getProfile()
    const modalEl = document.getElementById('onboardingModal')
    if (!modalEl) return
    const modal = new bootstrap.Modal(modalEl)
    if (!profile) modal.show()
  }

  function populatePositionOptions(positionSelect, options) {
    positionSelect.innerHTML = ''
    const placeholder = document.createElement('option')
    placeholder.value = ''
    placeholder.selected = true
    placeholder.disabled = true
    placeholder.textContent = 'Select position'
    positionSelect.appendChild(placeholder)
    options.forEach((opt) => {
      const node = document.createElement('option')
      node.value = opt.value
      node.textContent = opt.label
      positionSelect.appendChild(node)
    })
  }

  /** Handle onboarding form submit */
  function bindOnboardingForm() {
    const form = document.getElementById('onboardingForm')
    if (!form) return

    const sportSelect = document.getElementById('sport')
    const positionField = document.getElementById('positionField')
    const positionSelect = document.getElementById('position')

    sportSelect.addEventListener('change', function () {
      const options = SPORT_POSITIONS[this.value] || []
      if (options.length > 0) {
        positionField.style.display = 'block'
        positionSelect.required = true
        populatePositionOptions(positionSelect, options)
      } else {
        positionField.style.display = 'none'
        positionSelect.required = false
        positionSelect.value = ''
        positionSelect.innerHTML = ''
      }
    })

    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      const height = parseInt(document.getElementById('height').value, 10)
      const weight = parseInt(document.getElementById('weight').value, 10)
      const sport = document.getElementById('sport').value
      const level = document.getElementById('level').value
      const requiresPosition = (SPORT_POSITIONS[sport] || []).length > 0
      const positionValue = document.getElementById('position').value
      if (!height || !weight || !sport || !level) return
      if (requiresPosition && !positionValue) return
      const auth = window.AppStorage.isAuthenticated() ? JSON.parse(localStorage.getItem('ft_auth_v1')) : null
      const email = auth ? auth.email : null
      const profile = {
        height,
        weight,
        sport,
        level,
        position: requiresPosition ? positionValue : '',
        email,
      }
      window.AppStorage.setProfile(profile)
      try {
        if (window.AppConfig.USE_BACKEND_WHEN_AVAILABLE && email) {
          const user = await window.Api.upsertUserFromProfile(email, profile)
          const weekStart = window.AppStorage.getISODate(window.AppStorage.startOfWeek(new Date()))
          const generated = await window.Api.generatePlan(user.id, weekStart)
          const planDays = (generated.plan || []).map((p) => ({
            date: p.date,
            day: p.dayName,
            workout: p.workout,
            type: p.type,
            key: p.key,
          }))
          window.AppStorage.setPlan(weekStart, planDays)
        } else {
          ensureWeekPlan(profile)
        }
      } catch (err) {
        ensureWeekPlan(profile)
      }
      const modalEl = document.getElementById('onboardingModal')
      const modal = bootstrap.Modal.getInstance(modalEl)
      modal.hide()
      document.dispatchEvent(new CustomEvent('profile:updated', { detail: profile }))
    })
  }

  function getStarAthlete(sport, position = null) {
    if (sport === 'Football' && position && FOOTBALL_ATHLETES[position]) {
      return FOOTBALL_ATHLETES[position]
    }
    if (sport === 'Basketball' && position && BASKETBALL_POSITION_ATHLETES[position]) {
      return BASKETBALL_POSITION_ATHLETES[position]
    }
    return STAR_ATHLETES[sport] || { name: 'Athlete', img: './resoruces/images/athlete-generic.svg' }
  }

  function getDietTip(sport) {
    return DIET_TIPS[sport] || 'Eat whole foods, hydrate, and prioritize sleep.'
  }

  window.Onboarding = {
    SPORTS,
    LEVELS,
    SPORT_POSITIONS,
    BASKETBALL_BLUEPRINTS,
    getStarAthlete,
    getDietTip,
    generateWeeklyPlan,
    ensureWeekPlan,
    openOnboardingModalIfNeeded,
    bindOnboardingForm,
  }
})()


