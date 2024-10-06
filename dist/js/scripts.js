setTheme();
initMenus();

document.querySelector('.backdrop').addEventListener('click', () => {
    document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
    document.querySelector('.backdrop').classList.remove('is-active');
});

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        e.currentTarget.querySelector('[type="submit"]').innerText = 'Submitting...';
        let type = e.currentTarget.dataset.form;

        switch(type) {
            case 'add-site':
                submitSite(e.currentTarget);
                break;
            case 'add-tags':
                submitTags(e.currentTarget);
                break;
            case 'add-character':
                submitCharacter(e.currentTarget);
                break;
            case 'add-partner':
                submitPartner(e.currentTarget);
                break;
            case 'add-thread':
                submitThread(e.currentTarget);
                break;
            case 'edit-character':
                updateCharacter(e.currentTarget);
                break;
            case 'edit-partner':
                updatePartner(e.currentTarget);
                break;
            case 'edit-thread':
                updateThread(e.currentTarget);
                break;
            default:
                break;
        }
    });
});

document.querySelectorAll('select#site').forEach(el => {
    initSiteSelect(el);
});
document.querySelectorAll('.ships select#partner').forEach(el => {
    initSiteSelect(el);
});
document.querySelectorAll('select#site').forEach(el => {
    el.addEventListener('change', e => {
        initPartnerSelect(e.currentTarget, 'refresh');
        document.querySelectorAll('.accordion.tags').forEach(el => {
            initTags(el, e.currentTarget.options[e.currentTarget.selectedIndex].innerText.trim().toLowerCase());
        });
        if(document.querySelector('select#character')) {
            initCharacterSelect(e.currentTarget);
        }
    });
});
document.querySelectorAll('.accordion.sites').forEach(el => {
    initTagSites(el);
    initAccordion();
});