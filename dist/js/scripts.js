const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                font: {
                    family: 'Nunito Sans, sans-serif',
                    size: '8',
                    weight: 'bold'
                }
            }
        }
    }
};

const noLegend = {
    scales: {
        x: {
            ticks: {
                color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                font: {
                    family: 'Nunito Sans, sans-serif',
                    size: '8',
                    weight: 'bold'
                }
            }
        },
        y: {
            ticks: {
                color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                font: {
                    family: 'Nunito Sans, sans-serif',
                    size: '8',
                    weight: 'bold'
                }
            }
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
        }
    }
};

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
            case 'edit-tags':
                updateTags(e.currentTarget);
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

document.querySelectorAll('select#site, .ships select#partner').forEach(el => {
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
document.querySelectorAll('[data-form="edit-tags"] select#title').forEach(el => {
    initTagSelect(el);
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
        initPartnerSelect(e.currentTarget, 'initial');
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
if(document.querySelector('[data-form="edit-character"]')) {
    initEditCharacterSelect(document.querySelector('[data-form="edit-character"] #character'));
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
        initTags(e.currentTarget.closest('form'), e.currentTarget.options[e.currentTarget.selectedIndex].innerText.trim().toLowerCase());
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
}
if(document.querySelector('[data-form="add-thread"]')) {
    initThreadTags(document.querySelector('[data-form="add-thread"] .tags .multiselect'));
}
if(document.querySelector('[data-form="edit-thread"]')) {
    let form = document.querySelector('[data-form="edit-thread"]');
    let currentTitle = form.querySelector('#title');
    let site = form.querySelector('#site');

    if(currentTitle.value !== '' && site.options[site.selectedIndex].value !== '') {
        handleTitleChange(currentTitle.value.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toUppercase());
    } else {
        document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
        document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
    }

    currentTitle.addEventListener('change', () => {
        if(currentTitle.value !== '' && site.options[site.selectedIndex].value !== '') {
            handleTitleChange(currentTitle.value.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toLowerCase());
        } else {
            document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
            document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>Select a thread and site first.</p>`;
        }
    });

    site.addEventListener('change', () => {
        if(currentTitle.value !== '' && site.options[site.selectedIndex].value !== '') {
            handleTitleChange(currentTitle.value.trim().toLowerCase(), site.options[site.selectedIndex].innerText.trim().toLowerCase());
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