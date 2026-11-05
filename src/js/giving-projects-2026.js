// seednr-web — Seed Giving Circle: Giving Projects page (2026 round + past rounds)
//
// DRAFT. The live page still loads giving-projects.js (the 2025 page). Point the
// Ontraport footer at this file once Simon/Techa approve it.
//
// To announce winners (about two weeks after voting opens):
//   1. set STAGE to 'winners'
//   2. move the three winners from CURRENT_ROUND.shortlisted into CURRENT_ROUND.winners,
//      adding `amount` and `label` to each
(function () {
  'use strict';

  var utils = window.AppUtils;

  // 'voting'  = shortlist is out, Giving Circle members are voting
  // 'winners' = grants announced: winners first, remaining shortlisted below
  var STAGE = 'voting';

  // A page can force a stage without a code change, so the winners layout can be
  // previewed on its own Ontraport draft page before the winners are known:
  //   footer:  <script>window.GIVING_PROJECTS_STAGE = 'winners';</script>
  //   or URL:  ?stage=winners
  var stageOverride = window.GIVING_PROJECTS_STAGE ||
    (window.location.search.match(/[?&]stage=(voting|winners)\b/) || [])[1];
  if (stageOverride === 'voting' || stageOverride === 'winners') STAGE = stageOverride;

  // Shown in the winners layout until the real winners are filled in.
  var WINNER_PLACEHOLDERS = [1, 2, 3].map(function () {
    return {
      name: 'Winner to be announced',
      description: 'This project will be announced once Seed Giving Circle voting closes.',
      label: 'Grant winner',
      placeholder: true,
    };
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    showContent();
    renderPage();
  }

  // ── Data ─────────────────────────────────────────────────────

  // Descriptions are each project's own answer to "In a snapshot, what will this
  // grant help make possible?" from their application (applicants were told it
  // would be published if shortlisted).
  var CURRENT_ROUND = {
    year: '2026',
    applications: 16,
    winners: [],
    // Alphabetical so no project is favoured by position while members vote.
    // { name, project (title, shown when it differs), description, website, imageSrc, imageAlt }
    shortlisted: [
      {
        name: "Bread & Roses",
        project: "Gatherings with Purpose: Building Community Capacity for Change",
        description: "Great change starts when people come together. Gatherings with Purpose will equip 20-30 Northern Rivers environmental and community changemakers with the skills to design gatherings that build connection, inspire participation and turn shared concerns into collective action.",
        website: null,
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/bread-and-roses.jpg",
        imageAlt: "Bread & Roses",
      },
      {
        name: "Generous Earth Co-op",
        project: null,
        description: "This grant will help with startup costs and repair and restoration of the nursery space, including irrigation, tables, gravel, water tanks and associated infrastructure.",
        website: "https://generousearth.com.au",
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/generous-earth-logo.jpg",
        imageAlt: "Generous Earth Co-op",
      },
      {
        name: "Institute of Deep Ecology, Northern Rivers",
        project: null,
        description: "Seed the Institute for Deep Ecology across 3 physical hubs in the Northern Rivers and launch them with a January workshop at Balaya Buyul Community, building practical skills, ecological belonging and resilient communities of care for Country.",
        website: null,
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/deep-ecology.jpg",
        imageAlt: "Institute of Deep Ecology, Northern Rivers",
      },
      {
        name: "Roots and Rivers Collective",
        project: "Know Your Roots",
        description: "Taro, cassava and sweet potato thrive in our climate and keep without power, but few of us know how to cook them. Know Your Roots brings people to five Northern Rivers gardens and farms to harvest, cook, share stories and eat together, so these climate-ready crops become everyday food.",
        website: "https://sites.google.com/ethosglobal.org.au/roots-and-rivers-collective/home",
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/roots-and-rivers.jpg",
        imageAlt: "Roots and Rivers Collective",
      },
      {
        name: "Saltwater Creek Action Team (SCAT)",
        project: null,
        description: "Six hands-on working bees on Saltwater Creek, Mullumbimby, across 2027. Together we'll pull invasive purple taro, plant a native canopy that shades it out for good, and grow a community of creek carers restoring a flood-prone waterway on Bundjalung Country.",
        website: null,
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/scat-team.jpg",
        imageAlt: "Saltwater Creek Action Team (SCAT)",
      },
      {
        name: "The Bushcraft Village",
        project: null,
        description: "Our events involve a lot of time in remote areas, so having our staff equipped and trained to handle emergency situations is important, while elevating First Nations elders is necessary in shifting cultural paradigms towards honouring and protecting the earth.",
        website: null,
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/bushcraft-village.jpg",
        imageAlt: "The Bushcraft Village",
      },
      {
        name: "The Elder Tree & Mullumbimby Men's Shed",
        project: "Plants, People & Place: Educational Signage at Mullum Gardens Eco Hub",
        description: "Bundjalung art and language, hand-built signs and hands-on learning materials that turn The Elder Tree's Educational Medicine Garden and the Men's Shed at Mullum Gardens Eco Hub into a free, self-guided outdoor classroom, made by both groups' volunteers.",
        website: "https://www.theeldertree.org",
        imageSrc: "https://itmooti-codex.github.io/seednr-web/images/giving-2026/elder-tree.jpg",
        imageAlt: "The Elder Tree & Mullumbimby Men's Shed",
      },
    ],
  };

  var PAST_ROUNDS = [
    {
      year: '2025',
      applications: 28,
      intro: [
        'Seed Giving Circle members awarded grants from seven shortlisted Northern Rivers initiatives, chosen from 28 applications reviewed by an independent Grants Committee.',
        'Applications were assessed against criteria including environmental impact, community leadership, inclusion, collaboration, systems thinking, and readiness to deliver. Members then voted to determine the top three recipients.',
      ],
      winners: [
        {
          name: 'Bundjalung Bush Food Alliance',
          amount: '$5,000',
          label: 'Major Grant',
          description: 'A Bundjalung-led initiative creating a native bush food nursery in Mullumbimby. Providing training and employment for Indigenous women and youth, plus retail sales supporting native plants and bush foods.',
          website: 'https://www.thereturning.com.au/',
          imageSrc: 'https://file.ontraport.com/media/517df83e0ad54fcc86f60f25795385ef.phpscwwj5?Expires=4929134549&Signature=U6hpHqzCV2tKqymYUwaEnu9GKTTpBCjBEGDa~bZdxA-L2ctPxaRTuWGNX18wU8yHCnAk2ISuVec2~VJdFALiXXHoaLm8ZuC1VmVScapNRoqSMN-XMsCka0wPqWvk7RRjOghXEqfh3fPW9ZNVuh5zj~xk7jC6OBkhtLqyDNG2Eb61FDTnA1Yv1-6V0st0BXBb4gqIjmTGbGIDWaejk1an0nqKW~YycZcuM13zbX3ItiIq7oIvKpo13jr8VOJBTw4lTQib~N72ONgWJj75-kap9Xo3PNjnTaCtjjISbdTTbK5CHN~~uDDBHs7bmS4gUwI57qUlsYAdk6opjAd2yGYsow__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'Bundjalung Bush Food Alliance',
        },
        {
          name: 'Save Wallum',
          amount: '$2,500',
          label: 'Grant',
          description: 'Protects the rare Wallum ecosystem in Brunswick Heads from inappropriate development, safeguarding old-growth trees, threatened species, and sacred Country.',
          website: 'https://www.savewallum.com/',
          imageSrc: 'https://seednorthernrivers.org.au/d/Save%2BWollum.jpeg',
          imageAlt: 'Save Wallum',
        },
        {
          name: 'Local Address',
          amount: '$2,500',
          label: 'Grant',
          description: 'Identifies and maps Northern Rivers\' low-carbon building materials (including soils, invasive weeds, agricultural by-products, and waste streams), sharing findings through public resources and workshops.',
          website: null,
          imageSrc: 'https://file.ontraport.com/media/a1f71581de6b486e8e6899a7d1f87460.phpkk8una?Expires=4929134506&Signature=P0qAgtbFXpctJGx1H-RUuEJntN9cjUvd4fnSMAqv8hZU0UKFpDoKDE3JmXPmL790Fn4ciKv-3IKIqlAjPmrifHriIzsPQX1X5xy9rZC-eB8YXDV8nUmzZFdSUZum32jUAoT1aV2BAMsv6KxCjn5rqX8SF4nmTNqRSlbifUZzYvqVahVRJO2CQu9VmjEVvbLQTjiR-KKN8NDNzbwAev~Dp4Ui~Cfy3VXfr0geILZdjSjXn4gFyfmt7Gou9M2M-JLgNHiq3ky2AO886JvEpqfTFZQMOfAF9GOnGko73xT9Pebw-ftbJUSgDhurXxP1z8DWKsYoKFxJVwp3YRXo8njMcw__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'Local Address',
        },
      ],
      shortlisted: [
        {
          name: 'The Paddock Project',
          description: 'Expands sustainable gardening programs building community resilience through syntropic food gardens.',
          website: 'https://www.paddockproject.com/',
          imageSrc: 'https://file.ontraport.com/media/5c125e3a30074fbabceb09fff494f047.phpki1fqn?Expires=4929134537&Signature=W6KuM8~0dInOcFFIhVpCqZfpkyZkP6cNoQF-05FP61Rd9flXe-m7b-iLh2sWNYf90Q4-0a0DMYuebuvD9YSEiCyuf5oZpARmaLIVfte8EttJH8wwpK~P~S8Sv9d9QxJHFkIKV-d8VbmVVEfPNnq1Age-fj52x0DSPWJk8YljyOAXpvAzMtVVQ~e1TSkoluBch7MjYMZqxKdyB6o6Ejka36TW8GQGx6sI69-86PxgG9RjC-PAeu1gaPL~bch-2i42pGKCB2YYdJvsKGrk8kQtk~vu5~xixtQSqwDAyv9U6UXGih-JdNq-ZEYWKBIJUe5Er08~DzFaIKpkZtfh-NXGtQ__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'The Paddock Project',
        },
        {
          name: 'Surfers for Climate',
          description: 'Action-research with Indigenous leadership on coastal regeneration and climate care.',
          website: 'https://surfersforclimate.org.au/',
          imageSrc: 'https://file.ontraport.com/media/8d6c2c3a487d4ca3a4ae5519f4a175f9.php1qbkqq?Expires=4929134574&Signature=eK5PD9-pyRHJDZC1to6CyUrxQ95IDxp-3jnGnb7q4oH4XAtTdddAwQsIFW9yBp87AY2K-wWrJ2zFx-w7PQ5dh8aNQkr6XtQriz6AQ1pk6VXQu1sOCW49UJXtOmIetjRXxeEJWNbAydVpeL2T24DXMH0pJWoHX8NWhVYM-oNl4L5tKlEBdMR~wsmuaOyfgVmrj5opuUWfJJZ24EougE3vjLoWi9T6aqmnzPdWG5O6l9-P81iLsen6IxmXr3PmqDM0oSqE9z1cSv1s1bbSQRGJ4lv6lZ3SJLXiaqcvOwQtGyfqoYTcsalXIeaaCttNyLxwv~xDdJ9PJ5~lHV9oCtDd5w__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'Surfers for Climate',
        },
        {
          name: 'Mullum Food Coop',
          description: 'Converts tarp-material food delivery bags into durable shopping bags, diverting plastic waste from landfills.',
          website: 'https://www.mullumfoodcoop.com/',
          imageSrc: 'https://file.ontraport.com/media/97f95f3a2a48494b923c082f8bdceca7.php8larqi?Expires=4929134617&Signature=SToVfov3UIntzh~xcTt3rssBHN-bRp5gKwSYKkQdxVkYh-U79RLWLiJvXqIy~pMOC99eejNu-5RZOtZu4yjnwUuKq5o9SQqsaS-nvPeIf6r11CTNGOyT7Hm1YXxdpeqRZh7LfBOqJ6d7xLsMw9kw7g8jeOVc3pv9LbcNpTeuxfzWEPVgVIbbGeYSYFzSAMWuccGHDduu-jbEM5okE2Bwh-orOgx-TgLZPjASFJxuru~8zDI3U6cyM6NZWhOhQVP20KZ6ur8FRLoaE9-2rEnJkm-zhMrDzR1Ij1SKkhejELEyswV6ZWXFc4qQOBPB7Aw2dCUVJNZpaajL7GZU2uJuEA__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'Mullum Food Coop',
        },
        {
          name: 'Young Farmers Connect',
          description: 'Offers regenerative farming workshops connecting young and small-scale farmers.',
          website: 'https://www.youngfarmersconnect.com/',
          imageSrc: 'https://file.ontraport.com/media/93cc788c6f5043d0bed86a47b8fcf3b7.phpceumh3?Expires=4929134604&Signature=gKUD6H8DhANyKCRdBMjYWwEy7UAlo63Exvkkj4f6bMkUWg6Jr7Dz1AHH6vfU~qTC9lqNfWP0ey-RkcLthQhq6L7p5VHUsY8kqz~XCFAuhiia82ohSXI6sdculAKYMBTkzhC-2mrSXFsrG-~A6-LbySrjMe5lkAJHwNypeHuhyynT5MhIDV9GOF22OKg3rPJ-DrRRc492i2-kZArf7B8UuVn51AQyXL7xGLsZoxpTk4JIzGBmu1PanS-cZBXwbz3VEzGpTSNU35JFbIjWZuKmyDiFfpEC8hmedTKEyMtATbSmV8P2nTcgurquSCU0c6L34s7TDCZmVjeA2P-b4p2dIQ__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
          imageAlt: 'Young Farmers Connect',
        },
      ],
    },
  ];

  var GIVING_CIRCLE_URL = 'https://seednorthernrivers.org.au/giving-circle';
  // Members sign in here (emailed login link), open the 2026 round and press Vote Now.
  var VOTE_URL = 'https://grants.seednorthernrivers.org.au';

  // ── Render ───────────────────────────────────────────────────

  function renderPage() {
    var el = utils.byId('app-content');
    if (!el) return;

    var r = CURRENT_ROUND;
    var parts = STAGE === 'winners'
      ? [
          renderHero('Grant Winners<br>' + r.year + ' Grant Round', 'Community-led funding for Northern Rivers changemakers'),
          renderAboutCurrent(),
          renderWinners('Grant winners', r.winners.length ? r.winners : WINNER_PLACEHOLDERS),
          renderShortlisted('Grant shortlisted', r.shortlisted, shortlistedNote()),
        ]
      : [
          renderHero('Shortlisted Projects<br>' + r.year + ' Grant Round', 'Seed Giving Circle members are now voting'),
          renderAboutCurrent(),
          renderShortlisted('The shortlisted projects', r.shortlisted, null),
          renderVoteBanner(),
        ];

    parts.push(renderPastRounds(), renderWhyWeExist());
    el.innerHTML = parts.join('');
  }

  function renderHero(title, subtitle) {
    return '<section class="px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 mb-10 text-white text-center" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<div class="max-w-3xl mx-auto">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Seed Giving Circle</p>' +
      '<h1 class="font-bold leading-tight mb-5" ' +
      'style="font-family:var(--font-heading); font-size:clamp(2.2rem,5vw,3.5rem); color:#ffffff;">' +
      title +
      '</h1>' +
      '<div style="width:48px;height:3px;background:#FFC709;margin:0 auto 1.5rem;border-radius:2px;"></div>' +
      '<p class="text-lg sm:text-xl" style="color:#91CFAA; max-width:600px; margin:0 auto;">' +
      subtitle +
      '</p>' +
      '</div>' +
      '</section>';
  }

  function renderAboutCurrent() {
    var r = CURRENT_ROUND;
    var n = r.shortlisted.length + r.winners.length;
    var appsText = r.applications ? r.applications + ' applications' : 'this year\'s applications';
    var stats = (r.applications ? statCard(String(r.applications), 'Applications Reviewed') : '') +
      statCard(String(n || 7), 'Shortlisted Projects') +
      statCard(STAGE === 'winners' ? String(r.winners.length || 3) : '3', STAGE === 'winners' ? 'Grants Awarded' : 'Grants to Award');

    var body = STAGE === 'winners'
      ? '<p>Seed Giving Circle members have voted, and three Northern Rivers projects will receive grants this round. They were chosen from seven shortlisted initiatives, selected from ' + appsText + ' by an independent Grants Committee.</p>'
      : '<p>An independent Grants Committee reviewed ' + appsText + ' against criteria including environmental impact, community leadership, inclusion, collaboration, systems thinking, and readiness to deliver. These seven projects made the shortlist.</p>' +
        '<p class="mt-4">Seed Giving Circle members are now voting to decide which projects receive this round\'s grants. Every Giving Circle member gets a vote.</p>';

    var cta = STAGE === 'voting' ? voteButtons() : '';

    return section(
      'About the ' + r.year + ' Grant Round',
      body +
      '<div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">' + stats + '</div>' +
      cta
    );
  }

  function voteButtons() {
    return '<div class="mt-6 flex flex-wrap gap-3">' +
      '<a href="' + VOTE_URL + '" target="_blank" rel="noopener" class="inline-block px-6 py-3 font-bold" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none;">Members: cast your vote</a>' +
      '<a href="' + GIVING_CIRCLE_URL + '" class="inline-block px-6 py-3 font-bold" ' +
      'style="border:2px solid #1A3C36; color:#1A3C36; border-radius:30px; text-decoration:none;">Not a member? Join the Giving Circle</a>' +
      '</div>';
  }

  function renderVoteBanner() {
    return '<section class="mb-8 p-8 text-center text-white" style="background:#1A3C36; border-radius:12px;">' +
      '<h2 class="text-2xl font-bold mb-3" style="font-family:var(--font-heading); color:#ffffff;">Giving Circle members, have your say</h2>' +
      '<p class="mb-6" style="color:#91CFAA;">Sign in to the Giving Circle portal with your email, open the ' + CURRENT_ROUND.year + ' Grant Round and press Vote Now.</p>' +
      '<a href="' + VOTE_URL + '" target="_blank" rel="noopener" class="inline-block px-6 py-3 font-bold" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none;">Cast your vote</a>' +
      '</section>';
  }

  function shortlistedNote() {
    return '<p class="mb-6">All seven shortlisted projects will receive mentoring and capacity-building support from Seed Northern Rivers as part of our commitment to nurturing the people behind the change.</p>';
  }

  function renderWinners(title, projects) {
    if (!projects.length) return '';
    return '<section class="mb-8">' +
      '<h2 class="text-2xl font-bold mb-6" style="font-family:var(--font-heading); color:#1A3C36;">' + title + '</h2>' +
      '<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">' +
      projects.map(function (p) { return projectCard(p, true); }).join('') +
      '</div>' +
      '</section>';
  }

  function renderShortlisted(title, projects, noteHtml) {
    var cards = projects.length
      ? projects.map(function (p) { return projectCard(p, false); }).join('')
      : '<p class="text-sm" style="color:#4A4A4A;">Projects coming soon.</p>';
    return section(
      title,
      (noteHtml || '') +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">' + cards + '</div>'
    );
  }

  // ── Past rounds (archive dropdown) ───────────────────────────

  function renderPastRounds() {
    if (!PAST_ROUNDS.length) return '';
    var items = PAST_ROUNDS.map(function (r) {
      return '<details class="gp-round mb-4 bg-white" ' +
        'style="border-radius:12px; border:1px solid #e8e8e8; box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
        '<summary class="cursor-pointer select-none px-6 py-5 font-bold flex items-center justify-between" ' +
        'style="font-family:var(--font-heading); color:#1A3C36; font-size:1.25rem; list-style:none;">' +
        '<span>Check out the ' + r.year + ' Grant Round</span>' +
        '<span class="gp-chevron" aria-hidden="true" style="color:#289A47; transition:transform .2s;">&#9662;</span>' +
        '</summary>' +
        '<div class="px-6 pb-6">' +
        r.intro.map(function (t, i) {
          return '<p class="leading-relaxed' + (i ? ' mt-4' : '') + '" style="color:#2a2a2a;">' + utils.escapeHtml(t) + '</p>';
        }).join('') +
        '<div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">' +
        statCard(String(r.applications), 'Applications Reviewed') +
        statCard(String(r.winners.length + r.shortlisted.length), 'Shortlisted Projects') +
        statCard(String(r.winners.length), 'Grants Awarded') +
        '</div>' +
        subHeading('Grant winners') +
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">' +
        r.winners.map(function (p) { return projectCard(p, true); }).join('') +
        '</div>' +
        subHeading('Grant shortlisted') +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">' +
        r.shortlisted.map(function (p) { return projectCard(p, false); }).join('') +
        '</div>' +
        '</div>' +
        '</details>';
    }).join('');

    return '<section class="mb-8">' +
      '<style>.gp-round summary::-webkit-details-marker{display:none}.gp-round[open] .gp-chevron{transform:rotate(180deg)}</style>' +
      '<h2 class="text-2xl font-bold mb-2" style="font-family:var(--font-heading); color:#1A3C36;">Past grant rounds</h2>' +
      '<p class="mb-6" style="color:#4A4A4A;">The projects the Seed Giving Circle has supported so far.</p>' +
      items +
      '</section>';
  }

  function renderWhyWeExist() {
    return '<section class="mb-10 p-8 sm:p-12 text-center" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Our Approach</p>' +
      '<h2 class="text-2xl sm:text-3xl font-bold mb-5" ' +
      'style="font-family:var(--font-heading); color:#ffffff;">' +
      'Why the Seed Giving Circle Exists' +
      '</h2>' +
      '<p class="text-lg max-w-2xl mx-auto mb-4" style="color:#91CFAA;">' +
      'Because the people closest to the work, and the place, are often best placed to decide what\'s needed.' +
      '</p>' +
      '<p class="max-w-xl mx-auto mb-8" style="color:#91CFAA; opacity:0.85;">' +
      'The Seed Giving Circle offers a community-led alternative to top-down philanthropy, grounded in trust, transparency and care for the Northern Rivers.' +
      '</p>' +
      '<a href="' + GIVING_CIRCLE_URL + '" ' +
      'class="inline-block px-10 py-4 font-bold text-lg" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none;">' +
      'Join the Seed Giving Circle' +
      '</a>' +
      '</section>';
  }

  // ── HTML helpers ─────────────────────────────────────────────

  function projectCard(p, isWinner) {
    var badge = isWinner && (p.amount || p.label)
      ? '<span class="inline-block px-3 py-1 text-xs font-semibold mb-3" ' +
        'style="background:#FFC709; color:#1A3C36; border-radius:20px;">' +
        utils.escapeHtml(p.amount ? p.label + ': ' + p.amount : p.label) +
        '</span>'
      : '';

    var image = p.imageSrc
      ? '<img src="' + p.imageSrc + '" alt="' + utils.escapeHtml(p.imageAlt || p.name) + '" ' +
        'style="width:100%; height:100%; object-fit:cover;" ' +
        'onerror="this.style.display=\'none\';" />'
      : '';

    var org = p.project && p.project !== p.name
      ? '<p class="text-sm font-medium mb-2" style="color:#289A47;">' + utils.escapeHtml(p.project) + '</p>'
      : '';

    var websiteLink = p.website
      ? '<a href="' + p.website + '" target="_blank" rel="noopener noreferrer" ' +
        'class="inline-flex items-center gap-1 text-sm font-medium mt-4" ' +
        'style="color:#289A47; text-decoration:none;">' +
        'Visit website ↗' +
        '</a>'
      : '';

    return '<div class="bg-white overflow-hidden" ' +
      'style="border-radius:12px; border:1px solid #e8e8e8; box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
      '<div style="height:' + (isWinner ? 180 : 160) + 'px; overflow:hidden; background:#E6F8EB;">' + image + '</div>' +
      '<div class="p-6">' +
      badge +
      '<h3 class="font-bold mb-2" style="font-family:var(--font-heading); color:#1A3C36; font-size:' + (isWinner ? '1.2rem' : '1.1rem') + ';">' +
      utils.escapeHtml(p.name) +
      '</h3>' +
      org +
      '<p class="text-sm leading-relaxed" style="color:#2a2a2a;">' + utils.escapeHtml(p.description) + '</p>' +
      websiteLink +
      '</div>' +
      '</div>';
  }

  function section(title, bodyHtml) {
    return '<section class="mb-8 bg-white p-8" ' +
      'style="border-radius:12px; border:1px solid #e8e8e8; box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
      '<h2 class="text-2xl font-bold mb-4" style="font-family:var(--font-heading); color:#1A3C36;">' + title + '</h2>' +
      '<div class="leading-relaxed" style="color:#2a2a2a;">' + bodyHtml + '</div>' +
      '</section>';
  }

  function subHeading(text) {
    return '<h3 class="text-xl font-bold mt-8 mb-4" style="font-family:var(--font-heading); color:#1A3C36;">' + text + '</h3>';
  }

  function statCard(value, label) {
    return '<div class="text-center p-5" ' +
      'style="background:#E6F8EB; border-radius:12px; border:1px solid #91CFAA;">' +
      '<div class="text-3xl font-bold mb-1" style="font-family:var(--font-heading); color:#1A3C36;">' + value + '</div>' +
      '<div class="text-sm" style="color:#4A4A4A;">' + label + '</div>' +
      '</div>';
  }

  // ── UI state helpers ─────────────────────────────────────────

  function showContent() {
    var loading = utils.byId('app-loading');
    var content = utils.byId('app-content');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');
  }

})();
