function carregarImagens() {
  new Progressive({
    el: '#appImg1',
    lazyClass: 'lazy',
    removePreview: true,
    scale: true
  }).fire()
  new Progressive({
    el: '#appImg2',
    lazyClass: 'lazy',
    removePreview: true,
    scale: true
  }).fire()

  new Progressive({
    el: '#appImg3',
    lazyClass: 'lazy',
    removePreview: true,
    scale: true
  }).fire()
}

function sendEmail() {
  var email = $('#email').val();
  var subject = $('#subject').val();
  var name = $('#name').val();
  var message = $('#message').val();
  sendEmailGmail(email, name, subject, message);
}

function sendEmailGmail(email, name, subject, message) {
  $('.loading').show();
  var url = '/email';
  $.post( url, {
    "email":  email,
    "subject": subject,
    'name' : name,
    "message": message
  }, 'json').done(function() {
    $('.loading').hide();
    $('.alert-success').show();
    setTimeout(() => {
      $('.alert-success').hide();
    }, 10000);
    // alert('Sent Contact :)');
  });
}
