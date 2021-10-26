var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log(buttons);
            toggleClass(buttons, this);
        });
    });

    function toggleClass(buttons, buttonToActivate) {
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });
        buttonToActivate.classList.add('active');
    }