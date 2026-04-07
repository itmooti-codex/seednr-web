// seednr-web — Changemaker Collective Mentoring Program Page
(function () {
  'use strict';

  var utils = window.AppUtils;

  var _plugin = null;
  var _contact = null;
  var _contactId = null;

  document.addEventListener('DOMContentLoaded', function () {
    init();
  });

  function init() {
    window.VitalSync.connect()
      .then(function (plugin) {
        _plugin = plugin;
        _contactId = (window.AppConfig.CONTACT_ID || '').trim();

        if (!_contactId) {
          showContent();
          renderPage(null);
          return;
        }

        return fetchContact();
      })
      .catch(function (err) {
        showError();
        console.error('Mentoring page init failed:', err);
      });
  }

  function fetchContact() {
    return _plugin
      .switchTo('SeednrContact')
      .query()
      .select([
        'id',
        'first_name',
        'last_name',
        'email',
        'Giving_Circle_Donated',
        'date_became_giving_circle_member',
        'Affiliation_id',
      ])
      .where('id', '=', _contactId)
      .limit(1)
      .fetchOneRecord()
      .pipe(window.toMainInstance(true))
      .toPromise()
      .then(function (record) {
        _contact = record ? record.getState() : null;
        showContent();
        renderPage(_contact);
      })
      .catch(function (err) {
        showError();
        console.error('Mentoring fetch failed:', err);
      });
  }

  // ── Render ───────────────────────────────────────────────────

  function renderPage(contact) {
    var el = utils.byId('app-content');
    if (!el) return;

    var isEligible = contact ? checkEligibility(contact) : false;

    el.innerHTML = [
      renderHero(contact),
      renderProgramIntro(),
      renderWhoItsFor(isEligible),
      renderMentorRoleDescription(),
      renderApplySection(),
    ].join('');
  }

  function checkEligibility(contact) {
    var donated = parseFloat(contact.Giving_Circle_Donated) || 0;
    var gcMember = donated > 0 ||
      (!!contact.date_became_giving_circle_member &&
        contact.date_became_giving_circle_member !== '0');
    var seedMember = !!(contact.Affiliation_id && contact.Affiliation_id !== '0');
    return gcMember || seedMember;
  }

  function renderHero(contact) {
    var greeting = '';
    if (contact && contact.first_name) {
      greeting = '<p class="mt-5 text-base font-medium" style="color:#91CFAA; opacity:0.9;">Welcome, ' +
        utils.escapeHtml(contact.first_name) + '.</p>';
    }
    return '<section class="px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 mb-10 text-white text-center" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<div class="max-w-3xl mx-auto">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Seed Northern Rivers</p>' +
      '<h1 class="font-bold leading-tight mb-5" ' +
      'style="font-family:var(--font-heading); font-size:clamp(2.2rem,5vw,3.5rem); color:#ffffff;">' +
      'Changemaker Collective<br>Mentoring Program' +
      '</h1>' +
      '<div style="width:48px;height:3px;background:#FFC709;margin:0 auto 1.5rem;border-radius:2px;"></div>' +
      '<p class="text-lg sm:text-xl" style="color:#91CFAA; max-width:600px; margin:0 auto;">' +
      'Growing capacity, confidence and connection — from the ground up' +
      '</p>' +
      greeting +
      '</div>' +
      '</section>';
  }

  function renderProgramIntro() {
    return section(
      'About the Program',
      '<p>Seed Northern Rivers\' Changemaker Collective Mentoring Program offers 1:1 mentoring to leaders from not-for-profit and grassroots environmental organisations and initiatives — we call them Changemakers.</p>' +
      '<p class="mt-4">The program is designed to support Changemakers to strengthen their foundations, navigate complexity, and grow their impact with care. Grounded in Seed Northern Rivers\' commitment to community-led, place-based change, it pairs emerging and established leaders with experienced volunteer mentors from our local ecosystem.</p>' +
      '<p class="mt-4">This is mentoring that is relational, practical, and deeply human — designed to support people and projects to thrive, not just survive.</p>' +
      '<div class="mt-8 pt-6" style="border-top:1px solid #e8e8e8;">' +
      '<p class="font-semibold mb-3" style="color:#1A3C36;">Nurturing the people behind the change</p>' +
      '<p class="mb-4">Across the Northern Rivers, changemakers are carrying enormous responsibility with limited resources — often navigating complex systems while responding to climate disruption, funding uncertainty, and community need.</p>' +
      '<p class="mb-5">By pairing pooled community funding with relational support, we\'re not just backing projects — we\'re nurturing the people and connections that make lasting, systemic change possible.</p>' +
      '<ul class="space-y-3">' +
      listItem('Strengthen the foundations of changemakers and their organisations') +
      listItem('Reduce isolation and burnout among changemakers') +
      listItem('Grow skills, confidence, and collective capacity') +
      listItem('Create a multiplier effect as today\'s mentees become tomorrow\'s mentors') +
      '</ul>' +
      '</div>'
    );
  }

  function renderWhoItsFor(isEligible) {
    var eligibilityBadge = '';
    if (isEligible) {
      eligibilityBadge = '<div class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold mb-6" ' +
        'style="background:#FFC709; color:#1A3C36; border-radius:30px;">' +
        '<span>&#10003;</span> You\'re eligible for this program' +
        '</div>';
    }
    return section(
      'Who the Program Is For',
      eligibilityBadge +
      '<p class="mb-4">The mentoring program is currently offered to:</p>' +
      '<ul class="space-y-3 mb-6">' +
      listItem('Team leaders from organisations and initiatives that are <strong>Seed Giving Circle grant recipients</strong> or existing <strong>Seed NR members</strong>, as part of our commitment to pairing financial support with relational and capacity-building support.') +
      '</ul>' +
      '<p class="mb-4">More broadly, leaders from grassroots, not-for-profit and community-led organisations working in areas such as:</p>' +
      '<ul class="space-y-2 mb-6">' +
      listItem('Climate action') +
      listItem('Environmental protection and regeneration') +
      listItem('Landcare, conservation, and restoration') +
      listItem('Community resilience and regeneration') +
      '</ul>' +
      '<p class="text-sm" style="color:var(--brand-text-muted);">Mentoring may be extended to other Seed Northern Rivers member organisations as capacity allows. Participants typically range across a wide age spectrum and organisational stage — from early-stage initiatives to more established groups navigating growth, transition, or increased complexity.</p>'
    );
  }

  function renderMentorRoleDescription() {
    return section(
      'For Mentors: What\'s Involved',
      '<p class="mb-5">Mentors are volunteers who give their time, experience, and care to support the next generation of changemakers. You don\'t need to have all the answers — your lived experience and genuine presence are what matter most.</p>' +
      '<h3 class="font-semibold mb-3 mt-5" style="color:#1A3C36; font-size:1.05rem;">Your role as a mentor</h3>' +
      '<ul class="space-y-3 mb-6">' +
      listItem('Listen deeply and ask good questions') +
      listItem('Share your experience, stories, and perspective') +
      listItem('Help mentees make sense of complexity and find their own path') +
      listItem('Offer light guidance and signpost relevant resources or networks') +
      listItem('Provide accountability only where explicitly agreed') +
      listItem('Hold the relationship with care, trust, and appropriate boundaries') +
      '</ul>' +
      '<h3 class="font-semibold mb-3 mt-5" style="color:#1A3C36; font-size:1.05rem;">Time commitment</h3>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">' +
      featureCard('3–6 Sessions', 'Typically 60–90 minutes each, spread across 1–6 months.') +
      featureCard('Flexible Format', 'Online, in-person, or mixed — whatever works best for both of you.') +
      featureCard('Mentee-Led Agenda', 'You support the direction — you don\'t set it.') +
      featureCard('Renewable', 'By mutual agreement when both parties wish to continue.') +
      '</div>' +
      '<h3 class="font-semibold mb-3 mt-5" style="color:#1A3C36; font-size:1.05rem;">Support from Seed Northern Rivers</h3>' +
      '<ul class="space-y-3">' +
      listItem('Matching support to find a good fit') +
      listItem('A brief onboarding conversation and orientation resources') +
      listItem('Invitations to community gatherings across the mentoring cycle') +
      listItem('A Seed coordinator available if anything comes up that you\'d like to discuss') +
      '</ul>'
    );
  }

  var EOI_MENTOR_URL = 'https://seednorthernrivers.org.au/mentor-eoi';
  var EOI_MENTEE_URL = 'https://seednorthernrivers.org.au/mentee-eoi';

  function renderApplySection() {
    return '<section class="mb-10 p-8 sm:p-12 text-center" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Get Involved</p>' +
      '<h2 class="text-2xl sm:text-3xl font-bold mb-3" ' +
      'style="font-family:var(--font-heading); color:#ffffff;">' +
      'Ready to volunteer as a mentor?' +
      '</h2>' +
      '<p class="mb-8 max-w-lg mx-auto" style="color:#91CFAA;">We\'d love to hear from you. Fill in a short expression of interest and a Seed coordinator will be in touch.</p>' +
      '<a href="' + EOI_MENTOR_URL + '" ' +
      'class="inline-block px-10 py-4 font-bold text-lg" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none;">' +
      'Apply as a Mentor' +
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

  function featureCard(title, body) {
    return '<div class="p-5" ' +
      'style="background:#E6F8EB; border-radius:12px; border:1px solid #91CFAA;">' +
      '<div class="font-semibold mb-1" style="color:#1A3C36; font-size:1rem;">' + title + '</div>' +
      '<p class="text-sm" style="color:#4A4A4A;">' + body + '</p>' +
      '</div>';
  }

  function listItem(html) {
    return '<li class="flex items-start gap-3">' +
      '<span class="mt-1.5 flex-shrink-0" style="width:8px;height:8px;border-radius:50%;background:#289A47;display:inline-block;"></span>' +
      '<span>' + html + '</span>' +
      '</li>';
  }

  // ── UI state helpers ─────────────────────────────────────────

  function showContent() {
    var loading = utils.byId('app-loading');
    var content = utils.byId('app-content');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');
  }

  function showError() {
    var loading = utils.byId('app-loading');
    var errorEl = utils.byId('app-error');
    if (loading) loading.classList.add('hidden');
    if (errorEl) errorEl.classList.remove('hidden');
  }

})();
