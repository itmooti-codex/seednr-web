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
        'mentorship_interest',
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
      renderMenteeRoleDescription(),
      renderWhatMentoringLooksLike(),
      renderWhatMentorsOffer(),
      renderMentorRoleDescription(),
      renderWhatMentoringIsNot(),
      renderSupportAndCare(),
      renderBeyondOneToOne(),
      renderWhyThisMatters(),
      renderApplySection(),
      renderCtaSection(contact),
    ].join('');

    bindCtaButtons();
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
      '<p class="mt-4">This is mentoring that is relational, practical, and deeply human — designed to support people and projects to thrive, not just survive.</p>'
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

  function renderMenteeRoleDescription() {
    return section(
      'For Mentees: What to Expect',
      '<p class="mb-5">As a mentee, you bring your real questions, current challenges, and genuine openness. Mentoring works best when you take an active role in shaping the relationship.</p>' +
      '<h3 class="font-semibold mb-3 mt-5" style="color:#1A3C36; font-size:1.05rem;">What mentoring can help you with</h3>' +
      '<ul class="space-y-3 mb-6">' +
      listItem('Clarify your goals and priorities') +
      listItem('Build confidence and trust in your own leadership') +
      listItem('Reflect on your challenges and explore new perspectives') +
      listItem('Strengthen your organisational foundations') +
      listItem('Access light coaching and a thinking partner') +
      listItem('Feel less alone in the work') +
      '</ul>' +
      '<h3 class="font-semibold mb-3 mt-5" style="color:#1A3C36; font-size:1.05rem;">What you bring as a mentee</h3>' +
      '<ul class="space-y-3 mb-6">' +
      listItem('<strong>Arrive prepared</strong> — come with a focus area, question, or update to each session') +
      listItem('<strong>Be open and honest</strong> — your mentor can only help with what you share') +
      listItem('<strong>Take an active role</strong> — the agenda is yours to lead') +
      listItem('<strong>Follow through</strong> — act on what you commit to between sessions') +
      listItem('<strong>Communicate openly</strong> — if something isn\'t working, say so') +
      '</ul>' +
      '<p class="text-sm" style="color:#4A4A4A;">Mentoring is not a passive experience — the more you bring to it, the more you\'ll get from it. Seed Northern Rivers is here to support the relationship from the background, not to direct it.</p>'
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

  function renderWhatMentoringLooksLike() {
    return section(
      'What Mentoring Looks Like',
      '<p class="mb-6">Mentoring is offered as 1:1 support, shaped collaboratively by the mentor and mentee.</p>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">' +
      featureCard('3–6 Sessions', 'Spread over 1–6 months, shaped to your needs and pace.') +
      featureCard('Online or In-Person', 'Sessions may be online, in-person, or a mix depending on needs and location.') +
      featureCard('Mentee-Led Agenda', 'A light structure with focus areas agreed together at the outset and revisited as needed.') +
      featureCard('Renewable', 'Sessions may be renewed by mutual agreement when both parties wish to continue.') +
      '</div>' +
      '<p style="color:var(--brand-text-muted);">Rather than a fixed curriculum, the mentoring relationship responds to what is alive for the organisation or leader at that moment — offering space to reflect, sense-make, and take practical next steps.</p>'
    );
  }

  function renderWhatMentorsOffer() {
    return section(
      'What Mentors Offer',
      '<p class="mb-4">Mentors are volunteers drawn primarily from the Seed Giving Circle, Seed Northern Rivers members, and the broader local ecosystem. They bring lived experience, generosity, and a commitment to walking alongside others.</p>' +
      '<ul class="space-y-3">' +
      listItem('Strategic reflection and sounding-board support') +
      listItem('Sense-making and perspective') +
      listItem('Sharing of their experience and stories') +
      listItem('Light guidance and signposting to relevant resources or networks') +
      listItem('Accountability only where explicitly agreed') +
      '</ul>' +
      '<p class="mt-4 text-sm" style="color:var(--brand-text-muted);">Mentors are not expected to have all the answers — their role is to support clarity, confidence, action and learning.</p>'
    );
  }

  function renderWhatMentoringIsNot() {
    return '<section class="mb-10 p-8" ' +
      'style="background:var(--brand-error-bg); border-radius:12px; border-left:4px solid var(--brand-error);">' +
      '<h2 class="text-2xl font-bold mb-4" ' +
      'style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
      'What Mentoring Is Not' +
      '</h2>' +
      '<p class="mb-4" style="color:var(--brand-text);">To ensure healthy boundaries and sustainable relationships, the mentoring program does not include:</p>' +
      '<ul class="space-y-3">' +
      boundaryItem('Doing operational work on behalf of the organisation') +
      boundaryItem('Holding board-level governance responsibility') +
      boundaryItem('Crisis management, counselling, or therapy') +
      boundaryItem('Legal, financial, or clinical advice') +
      '</ul>' +
      '<p class="mt-4 text-sm" style="color:var(--brand-text-muted);">Where needs arise outside the scope of mentoring, participants may be supported to connect with appropriate external services.</p>' +
      '</section>';
  }

  function renderSupportAndCare() {
    return section(
      'Support, Care and Boundaries',
      '<p class="mb-4">Seed Northern Rivers provides light-touch coordination and support to ensure mentoring relationships feel safe, constructive, and aligned.</p>' +
      '<ul class="space-y-3 mb-4">' +
      listItem('If a mentoring match isn\'t working, participants are encouraged to contact the Seed coordinator to discuss next steps or explore a re-match.') +
      listItem('Any issues or concerns are ideally worked through between mentor and mentee first, with Seed available to support if needed.') +
      listItem('Seed Northern Rivers holds overall program coordination and duty of care, providing clear pathways for support, feedback, and escalation where appropriate.') +
      '</ul>' +
      '<p class="text-sm" style="color:var(--brand-text-muted);">Our aim is to create conditions of trust, clarity, and mutual respect — recognising that strong boundaries are what allow meaningful relationships to flourish.</p>'
    );
  }

  function renderBeyondOneToOne() {
    return section(
      'Beyond 1:1 Mentoring',
      '<p class="mb-4">In addition to individual mentoring, the program includes shared learning and connection opportunities:</p>' +
      '<ul class="space-y-3 mb-6">' +
      listItem('A community mentor gathering at the start of each mentoring cycle') +
      listItem('A mid-point check-in to share reflections and insights') +
      listItem('A closing gathering to harvest learning and celebrate contributions') +
      '</ul>' +
      '<p class="mb-3">Participants may also be supported through:</p>' +
      '<ul class="space-y-3">' +
      listItem('A curated directory of external supports (e.g. funding, governance, systems, business and employment programs)') +
      listItem('Light evaluation and reflection processes to help Seed learn what\'s working and continue to strengthen the program over time') +
      '</ul>'
    );
  }

  function renderWhyThisMatters() {
    return '<section class="mb-10 px-8 py-12" ' +
      'style="background:#1A3C36; color:white; border-radius:12px;">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Why It Matters</p>' +
      '<h2 class="text-3xl font-bold mb-6" ' +
      'style="font-family:var(--font-heading); color:#ffffff;">' +
      'Nurturing the people behind the change' +
      '</h2>' +
      '<p class="mb-4 text-base leading-relaxed" style="color:#91CFAA;">Across the Northern Rivers, changemakers are carrying enormous responsibility with limited resources — often navigating complex systems while responding to climate disruption, funding uncertainty, and community need.</p>' +
      '<p class="mb-8 text-base leading-relaxed" style="color:#91CFAA;">By pairing pooled community funding with relational support, we\'re not just backing projects — we\'re nurturing the people and connections that make lasting, systemic change possible.</p>' +
      '<ul class="space-y-4">' +
      whyItem('Strengthen the foundations of changemakers and their organisations') +
      whyItem('Reduce isolation and burnout among changemakers') +
      whyItem('Grow skills, confidence, and collective capacity') +
      whyItem('Create a multiplier effect as today\'s mentees become tomorrow\'s mentors') +
      '</ul>' +
      '</section>';
  }

  var EOI_MENTOR_URL = 'https://seednorthernrivers.org.au/mentor-eoi';
  var EOI_MENTEE_URL = 'https://seednorthernrivers.org.au/mentee-eoi';

  function renderApplySection() {
    return '<section class="mb-10 p-8 sm:p-12" ' +
      'style="background:#1A3C36; border-radius:12px;">' +
      '<div class="max-w-2xl mx-auto text-center">' +
      '<p class="text-sm font-semibold tracking-widest uppercase mb-4" style="color:#FFC709;">Get Involved</p>' +
      '<h2 class="text-2xl sm:text-3xl font-bold mb-3" ' +
      'style="font-family:var(--font-heading); color:#ffffff;">' +
      'Ready to join the program?' +
      '</h2>' +
      '<p class="mb-8" style="color:#91CFAA;">Whether you\'re looking for support or ready to offer it — we\'d love to hear from you.</p>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
      '<a href="' + EOI_MENTEE_URL + '" ' +
      'class="block px-6 py-5 font-semibold text-center" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:12px; text-decoration:none; font-size:1rem;">' +
      '<div class="text-2xl mb-2">&#127807;</div>' +
      '<div class="font-bold text-lg mb-1">Apply as a Mentee</div>' +
      '<div class="text-sm font-normal" style="color:#3a2a00;">I\'m a Changemaker looking for support</div>' +
      '</a>' +
      '<a href="' + EOI_MENTOR_URL + '" ' +
      'class="block px-6 py-5 font-semibold text-center" ' +
      'style="background:rgba(255,255,255,0.08); color:#ffffff; border-radius:12px; text-decoration:none; font-size:1rem; border:1px solid rgba(145,207,170,0.4);">' +
      '<div class="text-2xl mb-2">&#127775;</div>' +
      '<div class="font-bold text-lg mb-1">Apply as a Mentor</div>' +
      '<div class="text-sm font-normal" style="color:#91CFAA;">I\'d like to volunteer as a mentor</div>' +
      '</a>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function renderCtaSection(contact) {
    var interest = contact ? (contact.mentorship_interest || '') : null;
    var inner = '';

    if (!contact) {
      inner = '<h2 class="text-2xl font-bold mb-3" ' +
        'style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
        'Interested in mentoring?' +
        '</h2>' +
        '<p style="color:var(--brand-text-muted);">Sign in to your Seed Northern Rivers account to register your interest.</p>';
    } else if (interest === 'Yes') {
      inner = '<div class="text-4xl mb-3">&#127807;</div>' +
        '<h2 class="text-2xl font-bold mb-2" style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
        'You\'re in! We\'ve noted your interest.' +
        '</h2>' +
        '<p class="mb-6" style="color:var(--brand-text-muted);">If you haven\'t already, complete an expression of interest form below and we\'ll be in touch when matching opens.</p>' +
        '<div class="flex flex-wrap justify-center gap-3 mb-5">' +
        '<a href="' + EOI_MENTEE_URL + '" class="px-6 py-3 font-semibold" ' +
        'style="background:#FFC709; color:#1A3C36; border-radius:30px; text-decoration:none; font-size:1rem;">Mentee EOI</a>' +
        '<a href="' + EOI_MENTOR_URL + '" class="px-6 py-3 font-semibold" ' +
        'style="background:#289A47; color:#ffffff; border-radius:30px; text-decoration:none; font-size:1rem;">Mentor EOI</a>' +
        '</div>' +
        '<button data-interest="" class="text-sm underline" style="color:var(--brand-text-muted);">Change my response</button>';
    } else if (interest === 'Maybe') {
      inner = '<h2 class="text-2xl font-bold mb-3" style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
        'We understand — no pressure.' +
        '</h2>' +
        '<p class="mb-6" style="color:var(--brand-text-muted);">If you\'d like to confirm or step back, just let us know.</p>' +
        '<div class="flex flex-wrap justify-center gap-3">' +
        btnPrimary('Yes', 'Yes, count me in') +
        btnOutline('Not Right Now', 'Not right now') +
        '</div>';
    } else if (interest === 'Not Right Now') {
      inner = '<h2 class="text-2xl font-bold mb-3" style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
        'No problem — thanks for letting us know.' +
        '</h2>' +
        '<p class="mb-6" style="color:var(--brand-text-muted);">The program will still be here when the time is right.</p>' +
        btnOutline('Maybe', 'Actually, let me reconsider');
    } else {
      inner = '<h2 class="text-2xl font-bold mb-3" style="font-family:var(--font-heading); color:var(--brand-primary-dark);">' +
        'Are you interested in mentoring?' +
        '</h2>' +
        '<p class="mb-6" style="color:var(--brand-text-muted);">Let us know and we\'ll be in touch when matching opens.</p>' +
        '<div class="flex flex-wrap justify-center gap-3">' +
        btnPrimary('Yes', 'Yes, I\'m interested') +
        btnSecondary('Maybe', 'Maybe') +
        btnOutline('Not Right Now', 'Not right now') +
        '</div>';
    }

    return '<section id="section-cta" class="mb-10 p-8 sm:p-12 text-center" ' +
      'style="background:#E6F8EB; border-radius:12px; border:1px solid #91CFAA;">' +
      inner +
      '</section>';
  }

  // ── CTA interaction ───────────────────────────────────────────

  function bindCtaButtons() {
    var ctaSection = utils.byId('section-cta');
    if (!ctaSection) return;

    ctaSection.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-interest]');
      if (!btn) return;
      var value = btn.getAttribute('data-interest');
      if (value === '') {
        _contact = Object.assign({}, _contact, { mentorship_interest: '' });
        rerenderCta();
      } else {
        updateInterest(value);
      }
    });
  }

  function updateInterest(value) {
    if (!_contactId || !_plugin) return;

    utils.showPageLoader('Updating your interest\u2026');

    var mut = _plugin.switchTo('SeednrContact').mutation();
    mut.update(function (q) {
      q.where('id', _contactId).set({ mentorship_interest: value });
    });
    mut
      .execute(true)
      .toPromise()
      .then(function () {
        _contact = Object.assign({}, _contact, { mentorship_interest: value });
        rerenderCta();
        utils.showToast('Your interest has been updated.', 'success');
      })
      .catch(function (err) {
        utils.showToast('Something went wrong. Please try again.', 'error');
        console.error('Interest update failed:', err);
      })
      .finally(function () {
        utils.hidePageLoader();
      });
  }

  function rerenderCta() {
    var old = utils.byId('section-cta');
    if (!old) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = renderCtaSection(_contact);
    var newSection = wrapper.firstElementChild;
    old.parentNode.replaceChild(newSection, old);
    bindCtaButtons();
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

  function boundaryItem(text) {
    return '<li class="flex items-start gap-3">' +
      '<span class="font-bold flex-shrink-0" style="color:var(--brand-error); margin-top:2px;">&#10005;</span>' +
      '<span>' + utils.escapeHtml(text) + '</span>' +
      '</li>';
  }

  function whyItem(text) {
    return '<li class="flex items-start gap-3">' +
      '<span class="flex-shrink-0 font-bold" style="color:#FFC709; margin-top:2px;">&#10003;</span>' +
      '<span style="color:#91CFAA;">' + utils.escapeHtml(text) + '</span>' +
      '</li>';
  }

  function btnPrimary(interest, label) {
    return '<button data-interest="' + interest + '" ' +
      'class="px-7 py-3 font-semibold" ' +
      'style="background:#FFC709; color:#1A3C36; border-radius:30px; border:none; font-size:1rem;">' +
      label + '</button>';
  }

  function btnSecondary(interest, label) {
    return '<button data-interest="' + interest + '" ' +
      'class="px-7 py-3 font-semibold" ' +
      'style="background:#289A47; color:#ffffff; border-radius:30px; border:none; font-size:1rem;">' +
      label + '</button>';
  }

  function btnOutline(interest, label) {
    return '<button data-interest="' + interest + '" ' +
      'class="px-7 py-3 font-semibold" ' +
      'style="background:transparent; color:#1A3C36; border-radius:30px; border:2px solid #1A3C36; font-size:1rem;">' +
      label + '</button>';
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
