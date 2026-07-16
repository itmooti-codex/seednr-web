// seednr-web — Seed Giving Circle: Shortlisted Projects Page
(function () {
  'use strict';

  var utils = window.AppUtils;

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

  var GRANT_RECIPIENTS = [
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
      description: 'Identifies and maps Northern Rivers\' low-carbon building materials — including soils, invasive weeds, agricultural by-products, and waste streams — sharing findings through public resources and workshops.',
      website: null,
      imageSrc: 'https://file.ontraport.com/media/a1f71581de6b486e8e6899a7d1f87460.phpkk8una?Expires=4929134506&Signature=P0qAgtbFXpctJGx1H-RUuEJntN9cjUvd4fnSMAqv8hZU0UKFpDoKDE3JmXPmL790Fn4ciKv-3IKIqlAjPmrifHriIzsPQX1X5xy9rZC-eB8YXDV8nUmzZFdSUZum32jUAoT1aV2BAMsv6KxCjn5rqX8SF4nmTNqRSlbifUZzYvqVahVRJO2CQu9VmjEVvbLQTjiR-KKN8NDNzbwAev~Dp4Ui~Cfy3VXfr0geILZdjSjXn4gFyfmt7Gou9M2M-JLgNHiq3ky2AO886JvEpqfTFZQMOfAF9GOnGko73xT9Pebw-ftbJUSgDhurXxP1z8DWKsYoKFxJVwp3YRXo8njMcw__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA',
      imageAlt: 'Local Address',
    },
  ];

  var SHORTLISTED_PROJECTS = [
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
  ];

  // ── Render ───────────────────────────────────────────────────

  function renderPage() {
    var el = utils.byId('app-content');
    if (!el) return;

    el.innerHTML = [
      renderHero(),
      renderAboutRound(),
      renderGrantRecipients(),
      renderShortlistedProjects(),
      renderWhyWeExist(),
    ].join('');
  }

  function renderHero() {
    return '<section class="px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 mb-10 text-white text-center" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<div class="max-w-3xl mx-auto">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Seed Giving Circle</p>' +
      '<h1 class="font-bold leading-tight mb-5" ' +
      'style="font-family:var(--font-heading); font-size:clamp(2.2rem,5vw,3.5rem); color:#ffffff;">' +
      'Shortlisted Projects<br>2025 Grant Round' +
      '</h1>' +
      '<div style="width:48px;height:3px;background:#FFC709;margin:0 auto 1.5rem;border-radius:2px;"></div>' +
      '<p class="text-lg sm:text-xl" style="color:#91CFAA; max-width:600px; margin:0 auto;">' +
      'Community-led funding for Northern Rivers changemakers' +
      '</p>' +
      '</div>' +
      '</section>';
  }

  function renderAboutRound() {
    return section(
      'About the 2026 Grant Round',
      '<p>This year, Seed Giving Circle members awarded grants from seven shortlisted Northern Rivers initiatives — chosen from 28 applications reviewed by an independent Grants Committee.</p>' +
      '<p class="mt-4">Applications were assessed against criteria including environmental impact, community leadership, inclusion, collaboration, systems thinking, and readiness to deliver. Members then voted to determine the top three recipients.</p>' +
      '<div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">' +
      statCard('28', 'Applications Reviewed') +
      statCard('7', 'Shortlisted Projects') +
      statCard('3', 'Grants Awarded') +
      '</div>' +
      '<p class="mt-6">In addition to financial grants, Seed Northern Rivers is developing mentoring and capacity-building support for all seven shortlisted projects — pairing pooled community funding with relational support for the people behind the change.</p>'
    );
  }

  function renderGrantRecipients() {
    var cards = GRANT_RECIPIENTS.map(function (p) {
      return renderRecipientCard(p);
    }).join('');

    return '<section class="mb-8">' +
      '<h2 class="text-2xl font-bold mb-6" ' +
      'style="font-family:var(--font-heading); color:#1A3C36;">' +
      '2025 Grant Recipients' +
      '</h2>' +
      '<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">' +
      cards +
      '</div>' +
      '</section>';
  }

  function renderRecipientCard(project) {
    var badge = '<span class="inline-block px-3 py-1 text-xs font-semibold mb-3" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:20px;">' +
      project.label + ' — ' + project.amount +
      '</span>';

    var websiteLink = project.website
      ? '<a href="' + project.website + '" target="_blank" rel="noopener noreferrer" ' +
        'class="inline-flex items-center gap-1 text-sm font-medium mt-4" ' +
        'style="color:#289A47; text-decoration:none;">' +
        'Visit website ↗' +
        '</a>'
      : '';

    return '<div class="bg-white overflow-hidden" ' +
      'style="border-radius:12px; border:1px solid #e8e8e8; box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
      '<div style="height:180px; overflow:hidden;">' +
      '<img src="' + project.imageSrc + '" alt="' + utils.escapeHtml(project.imageAlt) + '" ' +
      'style="width:100%; height:100%; object-fit:cover;" ' +
      'onerror="this.style.display=\'none\'; this.parentElement.style.background=\'#E6F8EB\';" />' +
      '</div>' +
      '<div class="p-6">' +
      badge +
      '<h3 class="font-bold mb-2" style="font-family:var(--font-heading); color:#1A3C36; font-size:1.2rem;">' +
      utils.escapeHtml(project.name) +
      '</h3>' +
      '<p class="text-sm leading-relaxed" style="color:#2a2a2a;">' +
      utils.escapeHtml(project.description) +
      '</p>' +
      websiteLink +
      '</div>' +
      '</div>';
  }

  function renderShortlistedProjects() {
    var cards = SHORTLISTED_PROJECTS.map(function (p) {
      var imageHtml = p.imageSrc
        ? '<img src="' + p.imageSrc + '" alt="' + utils.escapeHtml(p.imageAlt) + '" ' +
          'style="width:100%; height:100%; object-fit:cover;" ' +
          'onerror="this.style.display=\'none\'; this.parentElement.style.background=\'#E6F8EB\';" />'
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
        '<div style="height:160px; overflow:hidden; background:#E6F8EB;">' +
        imageHtml +
        '</div>' +
        '<div class="p-6">' +
        '<h3 class="font-bold mb-2" style="font-family:var(--font-heading); color:#1A3C36; font-size:1.1rem;">' +
        utils.escapeHtml(p.name) +
        '</h3>' +
        '<p class="text-sm leading-relaxed" style="color:#2a2a2a;">' +
        utils.escapeHtml(p.description) +
        '</p>' +
        websiteLink +
        '</div>' +
        '</div>';
    }).join('');

    return section(
      'Shortlisted Projects — Mentoring Recipients',
      '<p class="mb-6">All seven shortlisted projects will receive mentoring and capacity-building support from Seed Northern Rivers as part of our commitment to nurturing the people behind the change.</p>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">' +
      cards +
      '</div>'
    );
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
      'Because the people closest to the work — and the place — are often best placed to decide what\'s needed.' +
      '</p>' +
      '<p class="max-w-xl mx-auto mb-8" style="color:#91CFAA; opacity:0.85;">' +
      'The Seed Giving Circle offers a community-led alternative to top-down philanthropy, grounded in trust, transparency and care for the Northern Rivers.' +
      '</p>' +
      '<a href="https://seednorthernrivers.org.au/giving-circle" ' +
      'class="inline-block px-10 py-4 font-bold text-lg" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none;">' +
      'Join the Seed Giving Circle' +
      '</a>' +
      '</section>';
  }

  // ── HTML helpers ─────────────────────────────────────────────

  function section(title, bodyHtml) {
    return '<section class="mb-8 bg-white p-8" ' +
      'style="border-radius:12px; border:1px solid #e8e8e8; box-shadow:0 1px 4px rgba(0,0,0,0.06);">' +
      '<h2 class="text-2xl font-bold mb-4" ' +
      'style="font-family:var(--font-heading); color:#1A3C36;">' +
      title +
      '</h2>' +
      '<div class="leading-relaxed" style="color:#2a2a2a;">' +
      bodyHtml +
      '</div>' +
      '</section>';
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
