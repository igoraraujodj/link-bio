/* Formulário sem backend: valida, monta a mensagem e entrega ao
   WhatsApp ou ao cliente de e-mail. Nada trafega por servidor nenhum. */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var wa = form.getAttribute('data-wa');
  var mail = form.getAttribute('data-email');
  var status = form.querySelector('[data-form-status]');
  var rows = form.querySelectorAll('[data-when]');

  /* Alterna os campos conforme a porta escolhida. */
  function mode() {
    var checked = form.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : 'client';
  }

  function syncRows() {
    var current = mode();
    rows.forEach(function (row) {
      var show = row.getAttribute('data-when') === current;
      row.hidden = !show;
      /* Campo escondido não deve ser enviado nem receber foco. */
      row.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.disabled = !show;
      });
    });
  }

  form.querySelectorAll('input[name="mode"]').forEach(function (radio) {
    radio.addEventListener('change', syncRows);
  });
  syncRows();

  /* ---- Validação ------------------------------------------------- */
  function validate() {
    var ok = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      var wrap = field.closest('.field');
      var error = wrap ? wrap.querySelector('[data-error]') : null;
      var empty = !field.value.trim();

      if (wrap) wrap.classList.toggle('is-invalid', empty);
      if (error) error.textContent = empty ? 'Preencha este campo' : '';
      field.setAttribute('aria-invalid', String(empty));

      if (empty && ok) { field.focus(); ok = false; }
    });

    return ok;
  }

  form.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('input', function () {
      if (!field.value.trim()) return;
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('is-invalid');
      var error = wrap ? wrap.querySelector('[data-error]') : null;
      if (error) error.textContent = '';
      field.setAttribute('aria-invalid', 'false');
    });
  });

  /* ---- Composição da mensagem ------------------------------------ */
  function value(name) {
    var field = form.elements[name];
    return field && !field.disabled ? String(field.value).trim() : '';
  }

  function compose() {
    var isClient = mode() === 'client';
    var lines = [];

    lines.push(isClient ? 'Olá, Igor! Tenho um projeto.' : 'Olá, Igor! Tenho uma oportunidade.');
    lines.push('');
    lines.push('Nome: ' + value('name'));
    if (value('company')) lines.push('Empresa: ' + value('company'));

    if (isClient) {
      if (value('scope')) lines.push('Projeto: ' + value('scope'));
      if (value('deadline')) lines.push('Prazo: ' + value('deadline'));
    } else {
      if (value('position')) lines.push('Vaga: ' + value('position'));
      if (value('model')) lines.push('Modelo: ' + value('model'));
    }

    lines.push('');
    lines.push(value('message'));

    return {
      subject: isClient ? 'Projeto — ' + value('name') : 'Oportunidade — ' + value('name'),
      body: lines.join('\n'),
    };
  }

  function send(channel) {
    if (!validate()) {
      if (status) status.textContent = 'Faltou preencher os campos obrigatórios.';
      return;
    }

    var msg = compose();
    var url =
      channel === 'email'
        ? 'mailto:' + mail + '?subject=' + encodeURIComponent(msg.subject) + '&body=' + encodeURIComponent(msg.body)
        : 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg.body);

    if (status) status.textContent = channel === 'email' ? 'Abrindo seu cliente de e-mail…' : 'Abrindo o WhatsApp…';

    if (channel === 'email') window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send('whatsapp');
  });

  var emailBtn = form.querySelector('[data-send="email"]');
  if (emailBtn) emailBtn.addEventListener('click', function () { send('email'); });
})();
