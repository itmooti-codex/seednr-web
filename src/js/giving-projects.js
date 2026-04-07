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
      imageSrc: 'https://app.ontraport.com/images/opt_default_image.png',
      imageAlt: 'Bundjalung Bush Food Alliance',
    },
    {
      name: 'Save Wallum',
      amount: '$2,500',
      label: 'Grant',
      description: 'Protects the rare Wallum ecosystem in Brunswick Heads from inappropriate development, safeguarding old-growth trees, threatened species, and sacred Country.',
      website: 'https://www.savewallum.com/',
      imageSrc: 'https://app.ontraport.com/images/opt_default_image.png',
      imageAlt: 'Save Wallum',
    },
    {
      name: 'Local Address',
      amount: '$2,500',
      label: 'Grant',
      description: 'Identifies and maps Northern Rivers\' low-carbon building materials — including soils, invasive weeds, agricultural by-products, and waste streams — sharing findings through public resources and workshops.',
      website: null,
      imageSrc: 'https://app.ontraport.com/images/opt_default_image.png',
      imageAlt: 'Local Address',
    },
  ];

  var SHORTLISTED_PROJECTS = [
    {
      name: 'The Paddock Project',
      description: 'Expands sustainable gardening programs building community resilience through syntropic food gardens.',
      website: 'https://www.paddockproject.com/',
    },
    {
      name: 'Surfers for Climate',
      description: 'Action-research with Indigenous leadership on coastal regeneration and climate care.',
      website: 'https://surfersforclimate.org.au/',
    },
    {
      name: 'Mullum Food Coop',
      description: 'Converts tarp-material food delivery bags into durable shopping bags, diverting plastic waste from landfills.',
      website: 'https://www.mullumfoodcoop.com/',
    },
    {
      name: 'Young Farmers Connect',
      description: 'Offers regenerative farming workshops connecting young and small-scale farmers.',
      website: 'https://www.youngfarmersconnect.com/',
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
      'About the 2025 Grant Round',
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
    var items = SHORTLISTED_PROJECTS.map(function (p) {
      var websiteLink = p.website
        ? ' <a href="' + p.website + '" target="_blank" rel="noopener noreferrer" ' +
          'class="text-sm font-medium" ' +
          'style="color:#289A47; text-decoration:none; white-space:nowrap;">' +
          'Visit website ↗' +
          '</a>'
        : '';

      return '<li class="flex items-start gap-4 pb-5" style="border-bottom:1px solid #f0f0f0;">' +
        '<span class="flex-shrink-0 mt-1" style="width:10px;height:10px;border-radius:50%;background:#289A47;display:inline-block;"></span>' +
        '<div>' +
        '<span class="font-semibold" style="color:#1A3C36;">' + utils.escapeHtml(p.name) + '</span>' +
        '<span class="mx-2 text-gray-300">—</span>' +
        '<span class="text-sm" style="color:#2a2a2a;">' + utils.escapeHtml(p.description) + '</span>' +
        websiteLink +
        '</div>' +
        '</li>';
    }).join('');

    return section(
      'Shortlisted Projects — Mentoring Recipients',
      '<p class="mb-6">All seven shortlisted projects will receive mentoring and capacity-building support from Seed Northern Rivers as part of our commitment to nurturing the people behind the change.</p>' +
      '<ul class="space-y-4">' +
      items +
      '</ul>'
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
      '&ldquo;The people closest to the work — and the place — are often best placed to decide what\'s needed.&rdquo;' +
      '</p>' +
      '<p class="max-w-xl mx-auto" style="color:#91CFAA; opacity:0.85;">' +
      'A community-led alternative grounded in trust, transparency, and care for the Northern Rivers.' +
      '</p>' +
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
