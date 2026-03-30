let storedSites = [], storedPartners = [], storedCharacters = [], storedThreads = [], storedTags = [], storedRecords = [], storedFreeforms = [];
setTheme();
initMenus();

document.querySelectorAll('.backdrop').forEach(overlay => {
    overlay.addEventListener('click', () => {
        console.log('clicked');
        document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
        document.querySelectorAll('.threads--filter').forEach(el => el.classList.remove('is-active'));
        document.querySelectorAll('.backdrop').forEach(backdrop => backdrop.classList.remove('is-active'));
    });
});
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        let form = e.currentTarget;
        let type = form.dataset.form;

        switch(type) {
            case 'add-site':
                submitSite(form);
                break;
            case 'add-tags':
                submitTags(form);
                break;
            case 'add-character':
                submitCharacter(form);
                break;
            case 'add-app':
                submitApp(form);
                break;
            case 'add-partner':
                submitPartner(form);
                break;
            case 'add-thread':
                submitThread(form);
                break;
            case 'edit-tags':
                updateTags(form, storedTags);
                break;
            case 'edit-character':
                updateCharacter(form, storedCharacters);
                break;
            case 'edit-partner':
                updatePartner(form, storedPartners);
                break;
            case 'edit-thread':
                updateThread(form, storedThreads);
                break;
            case 'add-record':
                addRecord(form);
                break;
            default:
                break;
        }
    });
});
document.querySelectorAll('form:not([data-form="edit-partner"]) select#site').forEach(el => {
    el.addEventListener('change', e => {
        initPartnerSelect(e.currentTarget, storedPartners, 'refresh', '#site', true);
        document.querySelectorAll('.accordion.tags').forEach(el => {
            initTags(el, e.currentTarget.options[e.currentTarget.selectedIndex].innerText.trim().toLowerCase(), storedTags);
        });
        if(document.querySelector('select#character')) {
            initCharacterSelect(e.currentTarget, storedCharacters);
        }
    });
});
document.querySelectorAll('select#character').forEach(el => {
    if(document.querySelector('select#thread-auto')) {
        el.addEventListener('change', e => {
            initThreadSelect(e.currentTarget, storedThreads);
        });
    }
});
document.querySelectorAll('[data-form="edit-tags"] select#title').forEach(el => {
    el.addEventListener('change', e => {
        if(e.currentTarget.value !== '') {
            el.closest('form').querySelectorAll('.ifFound').forEach(child => child.classList.remove('hidden'));
            adjustTagSites(e.currentTarget);
        } else {
            el.closest('form').querySelectorAll('.ifFound').forEach(child => child.classList.add('hidden'));
        }
    })
});
document.querySelectorAll('[data-form="edit-partner"] select#site').forEach(el => {
    el.addEventListener('change', e => {
        initPartnerSelect(e.currentTarget, storedPartners, 'initial');
    });
})
document.querySelectorAll('.accordion.updates input').forEach(el => {
    el.addEventListener('change', e => {
        if(e.currentTarget.checked) {
            e.currentTarget.closest('form').querySelectorAll(`.${e.currentTarget.dataset.ifClass}`).forEach(item => item.classList.remove('hidden'));
        } else {
            e.currentTarget.closest('form').querySelectorAll(`.${e.currentTarget.dataset.ifClass}`).forEach(item => item.classList.add('hidden'));
        }
    });
});
document.querySelectorAll('.accordion.updates .siteSpecific').forEach(el => {
    el.addEventListener('change', e => {
        let siteInputs = Array.from(document.querySelectorAll('.accordion.updates .siteSpecific:checked'));
        if(siteInputs.length > 0) {
            let character = e.currentTarget.closest('form').querySelector('#character');
            e.currentTarget.closest('form').querySelectorAll('.ifSiteSpecific').forEach(item => item.classList.remove('hidden'));
            if(character.options[character.selectedIndex].value !== '') {
                console.log(e.currentTarget.closest('form').querySelectorAll('#characterSite option'));
                if(e.currentTarget.closest('form').querySelectorAll('#characterSite option').length <= 1) {
                    initCharacterSites(character);
                }
            } else {
                e.currentTarget.closest('form').querySelectorAll('.ifSiteSpecific option[value=""]').forEach(item => item.innerText = `Please select a character first.`);
            }
        } else {
            e.currentTarget.closest('form').querySelectorAll('.ifSiteSpecific').forEach(item => item.classList.add('hidden'));
        }
    });
});
document.querySelectorAll('.accordion.updates input[value="removeLinks"], .accordion.updates input[value="removeTags"], .accordion.updates input[value="removeShip"], .accordion.updates input[value="changeShip"]').forEach(el => {
    el.addEventListener('change', e => {
        initAutoPopulate(e.currentTarget);
    });
});
if(document.querySelector('[data-form="add-character"]')) {
    let imageURLField = document.querySelector('[data-form="add-character"] .imagePreview input');
    if(imageURLField.value !== '') {
        imageURLField.closest('.imagePreview').querySelector('img').setAttribute('src', imageURLField.value);
    }
    imageURLField.addEventListener('change', e => {
        e.currentTarget.closest('.imagePreview').querySelector('img').setAttribute('src', e.currentTarget.value);
    })
}
if(document.querySelector('[data-form="edit-character"]')) {
    document.querySelectorAll('[data-form="edit-character"] select#character, [data-form="edit-character"] select#characterSite').forEach(select => {
        select.addEventListener('change', e => {
            e.currentTarget.closest('form').querySelectorAll('input[value="removeLinks"]:checked, input[value="changeShip"]:checked, input[value="removeShip"]:checked, input[value="removeTags"]:checked, input[value="changeBasics"]:checked').forEach(item => {
                initAutoPopulate(item);
            });
        });
    });

    document.querySelector('[data-form="edit-character"] select#character').addEventListener('change', e => {
        initCharacterSites(e.currentTarget);
    });

    document.querySelector('[data-form="edit-character"] select#characterSite').addEventListener('change', e => {
        initTags(e.currentTarget.closest('form'), e.currentTarget.options[e.currentTarget.selectedIndex].innerText.trim().toLowerCase(), storedTags);
    });

    document.querySelectorAll('.accordion.updates input').forEach(el => {
        if(el.checked) {
            el.closest('form').querySelectorAll(`.${el.dataset.ifClass}`).forEach(item => item.classList.remove('hidden'));
        }
    });

    document.querySelectorAll('.accordion.updates .siteSpecific').forEach(el => {
        let siteInputs = Array.from(document.querySelectorAll('.accordion.updates .siteSpecific:checked'));
        if(siteInputs.length > 0) {
            el.closest('form').querySelectorAll('.ifSiteSpecific').forEach(item => item.classList.remove('hidden'));
            el.closest('form').querySelectorAll('.ifSiteSpecific option[value=""]').forEach(item => item.innerText = `Please select a character first.`);
        }
    });

    let imageURLField = document.querySelector('[data-form="edit-character"] .imagePreview input');
    if(imageURLField.value !== '') {
        imageURLField.closest('.imagePreview').querySelector('img').setAttribute('src', imageURLField.value);
    }
    imageURLField.addEventListener('change', e => {
        e.currentTarget.closest('.imagePreview').querySelector('img').setAttribute('src', e.currentTarget.value);
    })
}
if(document.querySelector('[data-form="add-thread"]')) {
    initThreadTags(document.querySelector('[data-form="add-thread"] .tags .multiselect'));
}
if(document.querySelector('[data-form="edit-thread"]')) {
    let form = document.querySelector('[data-form="edit-thread"]');
    let site = form.querySelector('#site');
    let currentTitle = form.querySelector('#title');
    site.addEventListener('change', () => {
        initThreadSelect(currentTitle, storedThreads)
    });

    if(currentTitle.options[currentTitle.selectedIndex].value !== '' && site.options[site.selectedIndex].value !== '') {
        handleTitleChange(currentTitle.options[currentTitle.selectedIndex].innerText.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toUppercase(), storedThreads);
    } else {
        document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
        document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
    }

    currentTitle.addEventListener('change', () => {
        if(currentTitle.options[currentTitle.selectedIndex].value !== '' && site.options[site.selectedIndex].value !== '') {
            handleTitleChange(currentTitle.options[currentTitle.selectedIndex].innerText.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toLowerCase(), storedThreads);
        } else {
            document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
            document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
        }
    });

    site.addEventListener('change', () => {
        if(currentTitle.value !== '' && site.options[site.selectedIndex].value !== '') {
            handleTitleChange(currentTitle.options[currentTitle.selectedIndex].innerText.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toLowerCase(), storedThreads);
        } else {
            document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
            document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
        }
    });

    document.querySelectorAll('.accordion.updates input').forEach(el => {
        if(el.checked) {
            el.closest('form').querySelectorAll(`.${el.dataset.ifClass}`).forEach(item => item.classList.remove('hidden'));
        }
    });
}