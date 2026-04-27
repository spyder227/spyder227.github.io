/***** INITIALIZATION *****/
function toggleTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        setTheme();
    } else {
        localStorage.setItem('theme', 'dark');
        setTheme();
    }
}
function setTheme() {
    if(localStorage.getItem('theme') !== null) {
        switch(localStorage.getItem('theme')) {
            case 'light':
                document.querySelector('body').classList.remove('theme--dark');
                document.querySelector('body').classList.add('theme--light');
                break;
            case 'dark':
            default:
                document.querySelector('body').classList.add('theme--dark');
                document.querySelector('body').classList.remove('theme--light');
                break;
        }
    } else {
        document.querySelector('body').classList.add('theme--dark');
        document.querySelector('body').classList.remove('theme--light');
        localStorage.setItem('theme', 'dark');
    }
}
function initMenus() {
    fetch(`https://opensheet.elk.sh/${sheetID}/Sites`)
    .then((response) => response.json())
    .then((data) => {
        storedSites = [...data];

        data.sort((a, b) => {
            if(a.Close === '' && b.Close !== '') {
                return -1;
            } else if (b.Close === '' && a.Close !== '') {
                return 1;
            } else if(a.Site < b.Site) {
                return -1;
            } else if (a.Site > b.Site) {
                return 1;
            } else {
                return 0;
            }
        });

        data.forEach((site, i) => {
            let prefix = `..`;
            if (document.querySelector('body').classList.contains('index')) {
                prefix = '.';
            }
            if(i === 0) {
                document.querySelector('.subnav[data-menu="sites"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${site.URL}" target="_blank" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="characters"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/characters/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="threads"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/threads/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="stats"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/stats/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="writing"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/writing/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
            } else if(site.Status !== data[i - 1].Status) {
                document.querySelector('.subnav[data-menu="sites"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${site.URL}" target="_blank" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="characters"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/characters/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="threads"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/threads/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="stats"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/stats/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="writing"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<strong>${site.Status}</strong><a href="${prefix}/writing/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
            } else {
                document.querySelector('.subnav[data-menu="sites"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<a href="${site.URL}" target="_blank" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="characters"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<a href="${prefix}/characters/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="threads"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<a href="${prefix}/threads/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="stats"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<a href="${prefix}/stats/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
                document.querySelector('.subnav[data-menu="writing"] .subnav--inner')
                    .insertAdjacentHTML('beforeend', `<a href="${prefix}/writing/${site.ID}.html" class="${site.Status}">${site.Site}</a>`);
            }
        });
    }).then(() => {
        //add partner form ONLY needs this so run this in that instance instead of in-situ
        if(document.querySelector('[data-form="add-partner"]')) {
            initSiteSelects();
            document.querySelector('#loading').remove();
        }
        //same for add tag form
        if(document.querySelector('[data-form="add-tags"]')) {
            document.querySelectorAll('.accordion.sites').forEach(el => {
                initTagSites(el, storedSites);
                initAccordion();
            });
            document.querySelector('#loading').remove();
        }
        if(document.querySelector('body.index')) {
            initIndex([...storedSites]);
        }
    });
}
function initAccordion(target = '.accordion') {
    document.querySelectorAll(target).forEach(accordion => {
        let triggers = accordion.querySelectorAll(':scope > .accordion--trigger');
        let contents = accordion.querySelectorAll(':scope > .accordion--content');
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-active'));
            contents.forEach(trigger => trigger.classList.remove('is-active'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-active')) {
                    alreadyOpen = true;
                }
                triggers.forEach(trigger => trigger.classList.remove('is-active'));
                contents.forEach(trigger => trigger.classList.remove('is-active'));
                if(alreadyOpen) {
                    e.currentTarget.classList.remove('is-active');
                    e.currentTarget.nextElementSibling.classList.remove('is-active');
                    alreadyOpen = false;
                } else {
                    e.currentTarget.classList.add('is-active');
                    e.currentTarget.nextElementSibling.classList.add('is-active');
                }
            });
        })
    })
}
function initIndex(sites) {
    sites.sort((a, b) => {
        if(a.Close === '' && b.Close !== '') return -1;
        else if(a.Close !== '' && b.Close === '') return 1;
        else if(a.Site < b.Site) return -1;
        else if(a.Site > b.Site) return 1;
        else return 0;
    });
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((characterData) => {
        storedCharacters = [...characterData];

        fetch(`https://opensheet.elk.sh/${sheetID}/Threads`)
        .then((response) => response.json())
        .then((threadData) => {
            storedThreads = [...threadData];

            fetch(`https://opensheet.elk.sh/${sheetID}/Writing`)
            .then((response) => response.json())
            .then((recordData) => {
                storedRecords = [...recordData];


                let html = ``;
                sites.forEach((site, i) => {
                    let siteCharacters = storedCharacters.filter(item => item.Sites.includes(site.Site));
                    let siteThreads = storedThreads.filter(item => item.Site === site.Site);
                    let siteRecords = storedRecords.filter(item => item.Site === site.Site);
                    
                    if(i === 0) {
                        html += `<h2 class="h2">Active</h2><div class="grid">`;
                    } else if(sites[i - 1].Close === '' && site.Close !== '') {
                        html += `</div><h2 class="h2">Inactive</h2><div class="grid">`;
                    }
                    html += formatSiteBlock(site, siteCharacters, siteThreads, siteRecords);
                    if(sites.length - 1 === i) {
                        html += `</div>`;
                    }
                });
                document.querySelector('main').innerHTML = html;
            });
        });
    });
}
function formatSiteBlock(site, characters, threads, records) {
    return `<div class="site">
        <div class="site--stats">
            <div class="site--stat"><a href="./characters/${site.ID}.html">Characters</a></div>
            <div class="site--stat"><a href="./threads/${site.ID}.html">Threads</a></div>
            <div class="site--stat"><a href="./stats/${site.ID}.html">Stats</a></div>
            <div class="site--stat"><a href="./writing/${site.ID}.html">Records</a></div>
        </div>
        <div class="site--title">
            <a href="${site.URL}">${capitalize(site.Site, [' ', '-'])}</a>
            ${site.Tagline && site.Tagline !== '' ? `<p>${site.Tagline}</p>` : ''}
        </div>
        <div class="site--stats">
            <div class="site--stat"><b>${characters.length}</b> Characters</div>
            <div class="site--stat"><b>${threads.length}</b> Threads</div>
            <div class="site--stat"><b>${records.length}</b> Recorded Posts</div>
            ${site.Close && site.Close !== '' ? `<div class="site--stat">Open from ${site.Open} to ${site.Close}</div>` : `<div class="site--stat">Opened ${site.Open}</div>`}
            
        </div>
    </div>`;
}

/***** FORM INITS *****/
function initSiteSelects() {
    document.querySelectorAll('select#site').forEach(el => {
        let sites = [...storedSites];
    
        sites.sort((a, b) => {
            if(a.Close === '' && b.Close !== '') {
                return -1;
            } else if (a.Close !== '' && b.Close === '') {
                return 1;
            } else if(a.Site < b.Site) {
                return -1;
            } else if (a.Site > b.Site) {
                return 1;
            } else {
                return 0;
            }
        });
    
        let html = ``;
        sites.forEach((site, i) => {
            if(i === 0) {
                html += `<optgroup label="Active">`;
                html += `<option value="${site.ID}">${capitalize(site.Site, [' ', '-'])}</option>`;
            } else if (sites[i - 1].Close === '' && site.Close !== '') {
                html += `</optgroup>`;
                html += `<optgroup label="Inactive">`;
                html += `<option value="${site.ID}">${capitalize(site.Site, [' ', '-'])}</option>`;
            } else {
                html += `<option value="${site.ID}">${capitalize(site.Site, [' ', '-'])}</option>`;
            }
            if(sites.length - 1 === i) {
                html += `</optgroup>`;
            }
        });
        el.insertAdjacentHTML('beforeend', html);
    });
}
function initPartnerSelect(el, data, type = 'initial', siteField = '#site', hasNPC = false) {
    let site = el.closest('form').querySelector(siteField).options[el.closest('form').querySelector(siteField).selectedIndex].innerText.trim().toLowerCase();
    let partners = data.filter(item => item.Site === site && item.Status !== 'inactive');

    partners.sort((a, b) => {
        if(a.Writer < b.Writer) {
            return -1;
        } else if(a.Writer > b.Writer) {
            return 1;
        } else {
            return 0;
        }
    });
    
    el.closest('form').querySelectorAll('select#partner').forEach(select => {
        if(el.closest('form').dataset.form !== 'edit-partner') {
            if(hasNPC) {
                select.addEventListener('change', e => {
                    let target = e.currentTarget;
                    let unselected = select.closest('.row').querySelector('.ifUnselected');
                    let played = select.closest('.row').querySelector('.ifPlayed');
                    let npc = select.closest('.row').querySelector('.ifNPC');
                    if(target.options[target.selectedIndex].value === '') {
                        unselected && unselected.classList.remove('hidden');
                        played && played.classList.add('hidden');
                        npc && npc.classList.add('hidden');
                    } else if(target.options[target.selectedIndex].value === 'npc') {
                        played && played.classList.add('hidden');
                        npc && npc.classList.remove('hidden');
                        unselected && unselected.classList.add('hidden');
                    } else {
                        initShipSelect(e.currentTarget, siteField, data);
                        played && played.classList.remove('hidden');
                        npc && npc.classList.add('hidden');
                        unselected && unselected.classList.add('hidden');
                    }
                });
            } else {
                if(select.closest('.row').querySelector('.ifPlayed')) {
                    select.closest('.row').querySelector('.ifPlayed').classList.remove('hidden');
                }
                select.addEventListener('change', e => {
                    initShipSelect(e.currentTarget, siteField, data);
                });
            }
        }
        if(select.options.length < 2 || type === 'refresh') {
            if(el.closest('form').dataset.form !== 'edit-partner') {
                select.closest('.row').querySelector('#character').innerHTML = `<option value="">(select)</option>${hasNPC ? `<option value="npc">NPC</option>` : ``}`;
            }
            let html = `<option value="">(select)</option>`;
            if(hasNPC) {
                html += `<option value="npc">NPC</option>`;
            }
            partners.forEach(partner => {
                html += `<option value="${partner.WriterID}">${capitalize(partner.Writer)}</option>`;
            });
            select.innerHTML = html;
        }
    });
}
function initShipSelect(e, siteField, data) {
    let html = `<option value="">(select)</option>`;
    let site = e.closest('form').querySelector(siteField).options[e.closest('form').querySelector(siteField).selectedIndex].innerText.trim().toLowerCase();
    let partnerId = e.options[e.selectedIndex].value;
    let filteredData = data.filter(el => el.Site === site && el.WriterID === partnerId);
    let characterList = filteredData.length > 0 ? JSON.parse(filteredData[0].Characters) : [{name: 'NPC', id: '0'}];
    let characterSelects = e.closest('.row').querySelectorAll('#character');

    characterList.sort((a, b) => {
        if(a.name < b.name) {
            return -1;
        } else if(a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    });

    characterList.forEach(character => {
        html += `<option value="${character.id}">${capitalize(character.name)}</option>`;
    });
    characterSelects.forEach(select => {
        select.innerHTML = html;
    });
}
function initTags(el, site, data) {
    let activeTags = data.filter(item => JSON.parse(item.Sites).includes(site) || JSON.parse(item.Sites.includes('all')));
    let html = ``;

    activeTags.forEach(tag => {
        html += `<div class="accordion--trigger">${tag.Tag}</div>
            <div class="accordion--content">
                <div class="multiselect">
                    ${JSON.parse(tag.Set).map(item => {
                        return `<label>
                            <span><input type="${tag.Type === 'single' ? 'radio' : 'checkbox'}" class="tag" name="${tag.Tag.replace(' ', '')}" value="${item}" /></span>
                            <b>${capitalize(item)}</b>
                        </label>`;
                    }).join('')}
                </div>
            </div>`;
    });

    el.querySelector('.clip-tags').innerHTML = html;
    initAccordion('.accordion .clip-tags');
}
function initTagSites(el, data) {
    data.sort((a, b) => {
        if(a.Site < b.Site) {
            return -1;
        } else if (a.Site > b.Site) {
            return 1;
        } else {
            return 0;
        }
    });

    el.querySelector('.multiselect').insertAdjacentHTML('beforeend', `<label>
            <span><input type="checkbox" name="site" value="all" /></span>
            <b>All</b>
        </label>`);

    data.forEach(site => {
        el.querySelector('.multiselect').insertAdjacentHTML('beforeend', `<label>
                <span><input type="checkbox" name="site" value="${site.Site}" /></span>
                <b>${site.Site}</b>
            </label>`);
    });
}
function initCharacterSelect(el, data) {
    data.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    let selectedSite = el.closest('form').querySelector('#site');
    let html = `<option value="">(select)</option>`;
    data.forEach(character => {
        JSON.parse(character.Sites).forEach(site => {
            if(site.site === selectedSite.options[selectedSite.selectedIndex].innerText.trim().toLowerCase()) {
                html += `<option value="${site.id}">${capitalize(character.Character)}</option>`;
            }
        })
    });
    el.closest('form').querySelector('#character').innerHTML = html;
}
function initThreadSelect(el, data) {
    data.sort((a, b) => {
        if(a.Title < b.Title) {
            return -1;
        } else if (a.Title > b.Title) {
            return 1;
        } else {
            return 0;
        }
    });
    let selectedSite = el.closest('form').querySelector('#site').options[el.closest('form').querySelector('#site').selectedIndex].value;
    let selectedCharacter = el.closest('form').querySelector('#character') ? el.closest('form').querySelector('#character').options[el.closest('form').querySelector('#character').selectedIndex].value : null;
    let threads = [];

    if(selectedCharacter) {
        threads = [...data.map(item => ({
            ...item,
            Character: JSON.parse(item.Character)
        }))].filter(item => parseInt(item.Character.id) === parseInt(selectedCharacter) && item.SiteID === selectedSite);
    } else {
        threads = [...data].filter(item => item.SiteID === selectedSite);
    }

    let html = `<option value="">(select)</option>`;
    if(selectedCharacter) {
        threads.sort((a, b) => {
            if((a.Status !== 'complete' && a.Status !== 'archived') && (b.Status === 'complete' || b.Status === 'archived')) {
                return -1;
            } else if ((b.Status !== 'complete' && b.Status !== 'archived') && (a.Status === 'complete' || a.Status === 'archived')) {
                return 1;
            } else if(a.Title < b.Title) {
                return -1;
            } else if(a.Title > b.Title) {
                return 1;
            } else {
                return 0;
            }
        });
        threads.forEach((thread, i) => {
            if(i === 0) {
                html += `<optgroup label="${thread.Status !== 'complete' && thread.Status !== 'archived' ? 'Active' : 'Inactive'}">`;
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-'])}</option>`;
            } else if(threads[i - 1].Status !== 'complete' && threads[i - 1].Status !== 'archived' && (thread.Status === 'complete' || thread.Status === 'archived')) {
                html += `</optgroup>`;
                html += `<optgroup label="${thread.Status !== 'complete' && thread.Status !== 'archived' ? 'Active' : 'Inactive'}">`;
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-', '.'])}</option>`;
            } else {
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-', '.'])}</option>`;
            }
            if(threads.length - 1 === i) {
                html += `</optgroup>`;
            }
        });
    } else {
        threads.sort((a, b) => {
            if(JSON.parse(a.Character).name < JSON.parse(b.Character).name) {
                return -1;
            } else if(JSON.parse(a.Character).name > JSON.parse(b.Character).name) {
                return 1;
            } else if((a.Status !== 'complete' && a.Status !== 'archived') && (b.Status === 'complete' || b.Status === 'archived')) {
                return -1;
            } else if ((b.Status !== 'complete' && b.Status !== 'archived') && (a.Status === 'complete' || a.Status === 'archived')) {
                return 1;
            } else if(a.Title < b.Title) {
                return -1;
            } else if(a.Title > b.Title) {
                return 1;
            } else {
                return 0;
            }
        });
        threads.forEach((thread, i) => {
            if(i === 0) {
                html += `<optgroup label="${capitalize(JSON.parse(thread.Character).name)}">`;
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-'])}</option>`;
            } else if(JSON.parse(threads[i - 1].Character).name !== JSON.parse(thread.Character).name) {
                html += `</optgroup>`;
                html += `<optgroup label="${capitalize(JSON.parse(thread.Character).name)}">`;
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-', '.'])}</option>`;
            } else {
                html += `<option value="${thread.ThreadID}">${capitalize(thread.Title, [' ', '-', '.'])}</option>`;
            }
            if(threads.length - 1 === i) {
                html += `</optgroup>`;
            }
        });
    }

    if(el.closest('form').querySelector('#thread-auto')) {
        el.closest('form').querySelector('#thread-auto').innerHTML = html;
    } else {
        el.innerHTML = html;
    }
}
function initTagSelect(el, data) {
    data.sort((a, b) => {
        if(a.Tag < b.Tag) {
            return -1;
        } else if (a.Tag > b.Tag) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach(tag => {
        el.insertAdjacentHTML('beforeend', `<option value="${tag.Tag}" data-sites="${JSON.parse(tag.Sites).join(', ')}">${capitalize(tag.Tag, [' ', '-'])} - ${capitalize(JSON.parse(tag.Sites).join(', '), [' ', '-'])}</option>`);
    });
}
function adjustTagSites(el) {
    let existing = el.options[el.selectedIndex].dataset.sites.split(', ');
    el.closest('form').querySelectorAll(`.sites .multiselect label`).forEach(label => label.classList.remove('hidden'));
    existing.forEach(site => {
        if(el.closest('form').querySelector(`input[value="${site}"]`)) {
            el.closest('form').querySelector(`input[value="${site}"]`).closest('label').classList.add('hidden');
        }
    });
}
function initEditCharacterSelect(el, data) {
    data.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach(character => {
        el.insertAdjacentHTML('beforeend', `<option value="${character.Character}">${capitalize(character.Character)}</option>`)
    });
}
function initChangeBasics(el, data) {
    let character = el.closest('form').querySelector('#character');
    let site = el.closest('form').querySelector('#characterSite');
    let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];

    if(existing.Basics && existing.Basics !== '') {
        let basics = JSON.parse(existing.Basics).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase());
        if(basics[0]) {
            el.closest('form').querySelector('#gender').setAttribute('placeholder', basics[0].basics.gender);
            el.closest('form').querySelector('#pronouns').setAttribute('placeholder', basics[0].basics.pronouns);
            el.closest('form').querySelector('#ageValue').setAttribute('placeholder', basics[0].basics.age);
            el.closest('form').querySelector('#face').setAttribute('placeholder', basics[0].basics.face);
            el.closest('form').querySelector('#image').setAttribute('placeholder', basics[0].basics.image);
            el.closest('form').querySelector('.imagePreview img').setAttribute('src', basics[0].basics.image);
        }
    }
}
function initAutoPopulate(el) {
    //remove links
    let form = el.closest('form');
    let characterExists = form.querySelector('#character').options[form.querySelector('#character').selectedIndex].value !== '';
    let siteExists = form.querySelector('#characterSite').options[form.querySelector('#characterSite').selectedIndex].value !== '';
    if(characterExists) {
        if((siteExists && el.value !== 'removeLinks') || (!siteExists && el.value === 'removeLinks')) {
            switch(el.value) {
                case 'removeLinks':
                    initRemoveLinks(el, storedCharacters);
                    if(!siteExists) {
                        form.querySelectorAll('.clip-multi-warning').forEach(item => item.innerHTML = `<p>Please select both a character and a site.</p>`);
                    }
                    break;
                case 'removeShip':
                    initRemoveShips(el, storedCharacters);
                    break;
                case 'changeShip':
                    initChangeShips(el, storedCharacters);
                    break;
                case 'removeTags':
                    initRemoveTags(el, storedCharacters);
                    break;
                case 'changeBasics':
                    initChangeBasics(el, storedCharacters);
                    break;
                default:
                    break;
            }
        } else {
            form.querySelectorAll('.clip-multi-warning').forEach(item => item.innerHTML = `<p>Please select both a character and a site.</p>`);
        }
    } else {
        form.querySelectorAll('.clip-character-warning').forEach(item => item.innerHTML = `<p>Please select a character.</p>`);
        form.querySelectorAll('.clip-multi-warning').forEach(item => item.innerHTML = `<p>Please select both a character and a site.</p>`);
    }
}
function initRemoveLinks(el, data) {
    let character = el.closest('form').querySelector('#character');
    let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
    let links = JSON.parse(existing.Links);
    let html = `<div class="multiselect">`;
    links.forEach(link => {
        html += `<label>
            <span><input type="checkbox" class="removeLink" value="${link.url}" /></span>
            <b>${link.title}</b>
        </label>`;
    });
    html += `</div>`;

    el.closest('form').querySelector('.clip-remove-links').innerHTML = html;
}
function initRemoveShips(el, data) {
    let character = el.closest('form').querySelector('#character');
    let site = el.closest('form').querySelector('#characterSite');
    let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
    let ships = JSON.parse(existing.Ships).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase())[0].characters;
    let html = `<div class="multiselect">`;
    ships.forEach(ship => {
        html += `<label>
            <span><input type="checkbox" class="removeShip" value="${ship.character}" data-writer="${ship.writer}" data-ship="${ship.relationship}" /></span>
            <b>${ship.character}, played by ${ship.writer} (${ship.relationship})</b>
        </label>`;
    });
    html += `</div>`;

    el.closest('form').querySelector('.clip-remove-ships').innerHTML = html;
}
function initChangeShips(el, data) {
    let character = el.closest('form').querySelector('#character');
    let site = el.closest('form').querySelector('#characterSite');
    let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
    let ships = JSON.parse(existing.Ships).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase())[0].characters;
    let html = ``;
    ships.forEach(ship => {
        html += formatShipChangesRow(ship);
    });

    el.closest('form').querySelector('.clip-change-ships').innerHTML = html;
}
function initRemoveTags(el, data) {
    let character = el.closest('form').querySelector('#character');
    let site = el.closest('form').querySelector('#characterSite');
    let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
    let tags = JSON.parse(existing.Tags).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase())[0].tags;

    let html = `<div class="remove-tags">`;
    for(set in tags) {
        html += `<div class="accordion--trigger">${tags[set].type}</div>
            <div class="accordion--content">
                <div class="multiselect">
                    ${tags[set].tags.map(item => {
                        return `<label>
                            <span><input type="checkbox" class="tag removeTag" name="removeTag" value="${item}" data-type="${tags[set].type}" /></span>
                            <b>${item}</b>
                        </label>`;
                    }).join('')}
                </div>
            </div>`;
    }
    html += `</div>`;

    el.closest('form').querySelector('.clip-remove-tags').innerHTML = html;
    initAccordion('.accordion .remove-tags');
}
function initCharacterSites(character) {
    let existing = storedCharacters.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
    let sites = JSON.parse(existing.Sites);
    let html = `<option value="">(select)</option>`;

    sites.sort((a, b) => {
        if(a.site < b.site) {
            return -1;
        } else if(a.site > b.site) {
            return 1;
        } else {
            return 0;
        }
    });

    sites.forEach(site => {
        html += `<option value="${site.id}">${capitalize(site.site, [' ', '-'])}`;
    });
    character.closest('form').querySelector('#characterSite').innerHTML = html;
}
function initThreadTags(addTo, existingTags = [], removeTags = false) {
    let html = ``;
    if(existingTags.length > 0) {
        existingTags.forEach(tag => {
            if(removeTags) {
                let displayTags = threadTags.filter(item => item !== tag);
                displayTags.forEach(tag => {
                    html += `<label>
                        <span><input type="checkbox" class="tagAddition" name="tagging" value="${tag}" /></span>
                        <b>${tag}</b>
                    </label>`;
                });
            } else {
                let displayTags = threadTags.filter(item => item === tag);
                displayTags.forEach(tag => {
                    html += `<label>
                        <span><input type="checkbox" class="tagRemoval" name="tagging" value="${tag}" /></span>
                        <b>${tag}</b>
                    </label>`;
                });
            }
        });
    } else {
        threadTags.forEach(tag => {
            html += `<label>
                <span><input type="checkbox" class="threadTag" name="tagging" value="${tag}" /></span>
                <b>${tag}</b>
            </label>`;
        });
    }
    addTo.innerHTML = html;
}

/***** UTILITY *****/
function openSubmenu(e) {
    let menu = e.dataset.menu;
    document.querySelector('.backdrop.vertical').classList.remove('is-active');
    if(e.classList.contains('is-open')) {
        document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
        document.querySelector('.backdrop.horizontal').classList.remove('is-active');
    } else {
        document.querySelector('.backdrop.horizontal').classList.add('is-active');
        document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
        document.querySelectorAll(`[data-menu="${menu}"]`).forEach(el => el.classList.add('is-open'));
    }
}
function sendAjax(form, data, successMessage, async = true) {
    $(form).trigger('reset');
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        async: async,
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            form.innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            form.querySelector('[type="submit"]').innerText = `Submit`;
            
            if(successMessage) {
                form.innerHTML = successMessage;
            }

            window.scrollTo(0, 0);
            
            console.log('complete');
        }
    });
}
function sendAjaxSync(data, form = null, count = null, num = null) {
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        async: false,
        success: function () {
            console.log('success');
            if(form && count > 1) {
                form.querySelector('[type="submit"]').innerText = 'Submitting...';
            } else if(form) { 
                if(successMessage) {
                    form.querySelector('[type="submit"]').innerText = 'Submitted';
                    form.innerHTML = successMessage;
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            console.log(`Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`);
            if(form) {
                form.querySelector('[type="submit"]').innerText = 'ERROR!!';
            }
        },
        complete: function () {
            console.log('call complete');
            if(count && num && (count - 1 === num || count === 1)) {
                console.log('all complete');
                setTimeout(() => {
                    if(form) {
                        form.querySelector('[type="submit"]').innerText = `Submit`;
                        form.querySelector('[type="submit"]').removeAttribute('disabled');
                    
                        if(successMessage) {
                            form.innerHTML = successMessage;
                        }
                    }
                }, 100);
            }
        }
    });
}
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    str = str.replaceAll(`\&\#39\;`, `'`);
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}
function getMonthName(monthNum) {
    switch(monthNum) {
        case 0:
            return 'january';
            break;
        case 1:
            return 'february';
            break;
        case 2:
            return 'march';
            break;
        case 3:
            return 'april';
            break;
        case 4:
            return 'may';
            break;
        case 5:
            return 'june';
            break;
        case 6:
            return 'july';
            break;
        case 7:
            return 'august';
            break;
        case 8:
            return 'september';
            break;
        case 9:
            return 'october';
            break;
        case 10:
            return 'november';
            break;
        case 11:
            return 'december';
            break;
        default:
            break;
    }
}
function getMonthNum(monthName) {
    let month;

    switch(monthName.toLowerCase().trim()) {
        case 'january':
            month = 1;
            break;
        case 'february':
            month = 2;
            break;
        case 'march':
            month = 3;
            break;
        case 'april':
            month = 4;
            break;
        case 'may':
            month = 5;
            break;
        case 'june':
            month = 6;
            break;
        case 'july':
            month = 7;
            break;
        case 'august':
            month = 8;
            break;
        case 'september':
            month = 9;
            break;
        case 'october':
            month = 10;
            break;
        case 'november':
            month = 11;
            break;
        case 'december':
            month = 12;
            break;
        default:
            month = -1;
            break;
    }

    return month;
}

/***** FORM UTILITIES *****/
function addRow(e) {
    if(e.closest('.multi-buttons').dataset.rowType === 'links') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatLinksRow());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'ships') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatShipsRow(e));
        initPartnerSelect(e, storedPartners, 'initial', '#site', true);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'tag-options') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatTagOptions());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'characters') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatCharacterRow());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'featuring') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatFeatureRow(e));
        initPartnerSelect(e, storedPartners);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'add-ships') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatShipsRow(e));
        initPartnerSelect(e, storedPartners, 'initial', '#characterSite', true);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'add-info') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatInfoRow(e));
    } else if(e.closest('.multi-buttons').dataset.rowType === 'add-appinfo') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatAppInfoRow(e));
    } else if(e.closest('.multi-buttons').dataset.rowType === 'records') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatRecordsRow(e));
    }
}
function removeRow(e) {
    let rows = e.closest('.adjustable').querySelectorAll('.row');
    rows[rows.length - 1].remove();
}
function formatInfoRow() {
    return `<div class="row extra-info">
        <label>
            <b>Variable Title</b>
            <span><input type="text" class="title" placeholder="Title" required /></span>
        </label>
        <label>
            <b>Variable Content</b>
            <span><input type="text" class="content" placeholder="Content" required /></span>
        </label>
    </div>`;
}
function formatAppInfoRow() {
    return `<div class="row app-info">
        <label class="fullWidth">
            <b>Variable Title</b>
            <span><input type="text" class="title" placeholder="Title" required /></span>
        </label>
        <label class="fullWidth">
            <b>Variable Content</b>
            <span><textarea type="text" class="content" placeholder="Content"></textarea></span>
        </label>
    </div>`;
}
function formatRecordsRow() {
    let formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getDate()}`;
    return `<div class="row records-row grid">
        <label>
            <b>Word Count</b>
            <span><input type="number" class="words" min="0" required /></span>
        </label>
        <label>
            <b>Post Date</b>
            <span><input type="date" class="date" value="${formattedDate}" /></span>
        </label>
    </div>`;
}
function formatLinksRow() {
    return `<div class="row links">
        <label>
            <b>Title</b>
            <span><input type="text" id="linkTitle" placeholder="Title" required /></span>
        </label>
        <label>
            <b>URL</b>
            <span><input type="text" id="linkURL" placeholder="URL" required /></span>
        </label>
    </div>`;
}
function formatShipsRow(e) {
    return `<div class="row ships">
        <label>
            <b>Played By</b>
            <span><select required id="partner" required>
                <option value="">(select)</option>
            </select></span>
        </label>
        <label>
            <b>Character</b>
            <i class="ifUnselected">Select a Partner</i>
            <span class="hidden ifPlayed"><select id="character">
                <option value="">(select)</option>
            </select></span>
            <span class="hidden ifNPC"><input type="text" class="npcname" placeholder="NPC Name" /></span>
        </label>
        <label>
            <b>Section</b>
            <span><select required id="section" required>
                ${relationshipSections}
            </select></span>
        </label>
        <label>
            <b>Type</b>
            <span><select required id="type" required>
                ${relationshipOptions}
            </select></span>
        </label>
    </div>`;
}
function formatShipChangesRow(ship) {
    return `<div class="row change-ship" data-writer="${ship.writer}" data-character="${ship.character}" data-section="${ship.section ? ship.section : 'unsorted'}" data-relationship="${ship.relationship}" data-section-id="${ship.sectionID ? ship.sectionID : '100'}">
        <div class="h2">
            ${ship.character}${ship.writer !== 'npc' ? `, Played by ${ship.writer}` : ` (NPC)`} -
            ${ship.section && ship.section !== '' ? `${ship.section} - ` : ''}${ship.relationship}
        </div>
        <div class="grid"><label>
            <b>Section</b>
            <span><select id="section">
                ${relationshipSections}
            </select></span>
        </label>
        <label>
            <b>Type</b>
            <span><select id="type">
                ${relationshipOptions}
            </select></span>
        </label></div>
    </div>`;
}
function formatTagOptions() {
    return `<div class="row tag-options">
        <label>
            <b>Tag</b>
            <span><input type="text" id="tagOptions" placeholder="Tag" required /></span>
        </label>
    </div>`;
}
function formatCharacterRow() {
    return `<div class="row characters">
        <label>
            <b>Name</b>
            <span><input type="text" id="charName" placeholder="Name" required /></span>
        </label>
        <label>
            <b>ID</b>
            <span><input type="text" id="charId" placeholder="00" required /></span>
        </label>
    </div>`;
}
function formatFeatureRow(e) {
    let site = e.closest('form').querySelector('#site').options[e.closest('form').querySelector('#site').selectedIndex].value;

    return `<div class="row features">
        <label>
            <b>Played By</b>
            <span><select required id="partner" required>
                <option value="">(select)</option>
            </select></span>
        </label>
        <label>
            <b>Character</b>
            <span><select required id="character" required>
                <option value="">(select)</option>
            </select></span>
        </label>
    </div>`;
}
function handleTitleChange(currentTitle, site, data) {
    let existing = data.filter(item => item.Title === currentTitle && item.Site === site)[0];
    if(existing) {
        initThreadTags(document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect'), JSON.parse(existing.Tags), true);
        initThreadTags(document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect'), JSON.parse(existing.Tags));
    } else {
        document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>This thread/site combination doesn't exist!</p>`;
        document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>This thread/site combination doesn't exist!</p>`;
    }
}

/***** FORM SUBMISSIONS *****/
function submitSite(form) {
    let site = form.querySelector('#title').value.trim().toLowerCase();
    let id = form.querySelector('#id').value.trim().toLowerCase();
    let url = form.querySelector('#url').value.trim();
    let directory = form.querySelector('#directory').options[form.querySelector('#directory').selectedIndex].value;
    let tagline = form.querySelector('#tagline').value.trim();
    let open = new Date(form.querySelector('#open').value.trim());
    let close = form.querySelector('#close').value ? new Date(form.querySelector('#close').value.trim()) : null;
    let status = form.querySelector('#active').checked ? 'active' : 'inactive';

    let data = {
        SubmissionType: 'add-site',
        Site: site,
        ID: id,
        URL: url,
        Directory: directory,
        Tagline: tagline,
        Open: `${getMonthName(open.getMonth())} ${open.getDate()}, ${open.getFullYear()}`,
        Close: close ? `${getMonthName(close.getMonth())} ${close.getDate()}, ${close.getFullYear()}` : '',
        Status: status,
    };

    sendAjax(form, data, successMessage);
}
function submitTags(form) {
    let title = form.querySelector('#title').value.trim().toLowerCase();
    let type = form.querySelector('#type').options[form.querySelector('#type').selectedIndex].value;
    let tags = Array.from(form.querySelectorAll('.tag-options input')).map(item => item.value.toLowerCase().trim());
    let sites = Array.from(form.querySelectorAll('[name="site"]:checked')).map(item => item.value.toLowerCase().trim());

    let data = {
        SubmissionType: 'add-tags',
        Tag: title,
        Sites: JSON.stringify(sites),
        Type: type,
        Set: JSON.stringify(tags),
    };

    sendAjax(form, data, successMessage);
}
function submitPartner(form) {
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let id = form.querySelector('#id').value.trim();
    let alias = form.querySelector('#title').value.trim().toLowerCase();
    let characters = form.querySelectorAll('#charName');
    let characterList = [];

    characters.forEach(character => {
        let name = character.value.trim().toLowerCase();
        let id = character.closest('.row').querySelector('#charId').value.trim();
        characterList.push({
            name: name.replaceAll(`'`, `&apos;`),
            id: id,
        });
    });

    let data = {
        SubmissionType: 'add-partner',
        Site: site,
        WriterID: id,
        Writer: alias,
        Characters: JSON.stringify(characterList),
        Status: 'active',
    };

    sendAjax(form, data, successMessage);
}
function submitCharacter(form) {
    //simple data
    let title = form.querySelector('#title').value.trim().toLowerCase();
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let id = form.querySelector('#id').value.trim();
    let vibes = form.querySelector('#vibes').value.trim().toLowerCase();
    let basicsValues = {
        gender: form.querySelector('#gender').value.trim().toLowerCase(),
        pronouns: form.querySelector('#pronouns').value.trim().toLowerCase(),
        age: form.querySelector('#ageValue').value.trim().toLowerCase(),
        face: form.querySelector('#face').value.trim().toLowerCase(),
        image: form.querySelector('#image').value.trim(),
    };

    //complex data - extras
    let extras = Array.from(form.querySelectorAll('.row.extra-info'));
    let formattedExtras = {};
    extras.forEach(extra => {
        let title = extra.querySelector('.title').value.toLowerCase().trim();
        let content = extra.querySelector('.content').value.trim();
        formattedExtras[title] = content;
    });

    //complex data - links
    let links = form.querySelectorAll('#linkTitle');
    let linkList = [];
    links.forEach(link => {
        let title = link.value.trim().toLowerCase();
        let url = link.closest('.row').querySelector('#linkURL').value.trim();
        linkList.push({
            title: title,
            url: url,
        });
    });

    //complex data - relationships
    let relationships = form.querySelectorAll('.ships #partner');
    let shipList = [];
    relationships.forEach(ship => {
        let writer = ship.options[ship.selectedIndex].innerText.trim().toLowerCase();
        let character = ship.closest('.row').querySelector('#character').options[ship.closest('.row').querySelector('#character').selectedIndex].innerText.trim().toLowerCase();
        let type = ship.closest('.row').querySelector('#type').options[ship.closest('.row').querySelector('#type').selectedIndex].innerText.trim().toLowerCase();
        let section = ship.closest('.row').querySelector('#section').options[ship.closest('.row').querySelector('#section').selectedIndex].innerText.trim().toLowerCase();
        let sectionID = ship.closest('.row').querySelector('#section').options[ship.closest('.row').querySelector('#section').selectedIndex].dataset.id;
        shipList.push({
            writer: writer,
            character: character,
            relationship: type,
            section: section,
            sectionID: sectionID,
        });
    });

    //complex data - tags
    let siteTags = form.querySelectorAll('input.tag:checked');
    let tagList = {};
    let tagArray = [];
    siteTags.forEach(tag => {
        if(tagList[tag.name]) {
            tagList[tag.name].push(tag.value);
        } else {
            tagList[tag.name] = [tag.value];
        }
    });
    let immortal = form.querySelector('#immortal').checked ? 'immortal' : 'mortal';
    if(tagList['age']) {
        tagList['age'].push(immortal);
    } else if(tagList['trueage']) {
        tagList['trueage'].push(immortal);
    }
    for(tagType in tagList) {
        tagArray.push({
            type: tagType,
            tags: tagList[tagType],
        })
    }
    let status = form.querySelector('#active').checked ? 'active' : 'inactive';
    tagArray.push({
        type: 'status',
        tags: [status],
    });

    //combine data where needed
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((characterData) => {
        let existing = characterData.filter(item => item.Character === title);
        if (existing.length === 0) {
            //finish complex set up
            let sites = {
                site: site,
                id: id,
            }
            let ships = {
                site: site,
                characters: shipList,
            }
            let tags = {
                site: site,
                tags: tagArray,
            }
            let basics = {
                site: site,
                basics: basicsValues,
                extras: formattedExtras,
            }

            let data = {
                SubmissionType: 'add-character',
                Character: title,
                Sites: JSON.stringify([sites]),
                Vibes: vibes,
                Links: JSON.stringify(linkList),
                Ships: JSON.stringify([ships]),
                Tags: JSON.stringify([tags]),
                Basics: JSON.stringify([basics]),
            };

            return data;
        } else {
            //finish complex set up
            let sites = [...JSON.parse(existing[0].Sites), {
                site: site,
                id: id,
            }];
            let ships = [...JSON.parse(existing[0].Ships), {
                site: site,
                characters: shipList,
            }];
            let tags = [...JSON.parse(existing[0].Tags), {
                site: site,
                tags: tagArray,
            }];
            let newLinks = [...JSON.parse(existing[0].Links), ...linkList]
            let basics = [...JSON.parse(existing[0].Basics), {
                site: site,
                basics: basicsValues,
                extras: formattedExtras,
            }];

            let data = {
                SubmissionType: 'edit-character',
                Character: existing[0].Character,
                Sites: JSON.stringify(sites),
                Vibes: (existing[0].Vibes && existing[0].Vibes !== '') 
                    ? `${existing[0].Vibes} ${vibes}`
                    : vibes,
                Links: JSON.stringify(newLinks),
                Ships: JSON.stringify(ships),
                Tags: JSON.stringify(tags),
                Basics: JSON.stringify(basics),
            };

            return data;
        }
    }).then((data) => {
        sendAjax(form, data, successMessage);
    });
}
function submitThread(form) {
    //simple fields
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let siteID = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].value.trim().toLowerCase();
    let status = form.querySelector('#status').options[form.querySelector('#status').selectedIndex].value.trim().toLowerCase();
    let title = form.querySelector('#title').value.trim().toLowerCase();
    let character = form.querySelector('#character').options[form.querySelector('#character').selectedIndex];
    let id = form.querySelector('#id').value.trim();
    let type = form.querySelector('#type').options[form.querySelector('#type').selectedIndex].innerText.trim().toLowerCase();
    let description = form.querySelector('#description').value.trim();
    let icDate = form.querySelector('#date').value;
    let year = new Date().getFullYear();
    let month = getMonthName(new Date().getMonth());
    let day = new Date().getDate();
    let update = `${month} ${day}, ${year}`;
    let ship = form.querySelector('#ship').value.trim().toLowerCase();
    let words = form.querySelector('#words').value.trim();

    //complex fields - tags and featuring
    let tags = Array.from(form.querySelectorAll('.threadTag:checked')).map(item => item.value);
    
    let featuredRows = document.querySelectorAll('.features');
    let featuring = [];
    featuredRows.forEach(row => {
        featuring.push({
            name: row.querySelector('#character').options[row.querySelector('#character').selectedIndex].innerText.trim().toLowerCase().replaceAll(`'`, `&apos;`),
            id: row.querySelector('#character').options[row.querySelector('#character').selectedIndex].value.trim(),
            writer: row.querySelector('#partner').options[row.querySelector('#partner').selectedIndex].innerText.trim().toLowerCase(),
            writerId: row.querySelector('#partner').options[row.querySelector('#partner').selectedIndex].value.trim(),
        });
    });

    let data = {
        SubmissionType: 'add-thread',
        Site: site,
        SiteID: siteID,
        Status: status,
        Title: title,
        Character: JSON.stringify({
            name: character.innerText.trim().toLowerCase().replaceAll(`'`, `&apos;`),
            id: character.value.trim().toLowerCase(),
        }),
        Featuring: JSON.stringify(featuring),
        ThreadID: id,
        Type: type,
        Description: description,
        Tags: JSON.stringify(tags),
        ICDate: icDate,
        LastUpdated: update,
    };

    if(words !== '' || ship !== '') {
        let record = {
            SubmissionType: 'add-record',
            Site: site,
            Character: JSON.stringify({
                name: character.innerText.trim().toLowerCase().replaceAll(`'`, `&apos;`),
                id: character.value.trim().toLowerCase(),
            }),
            Thread: id,
            Words: words,
            Ship: ship,
            Date: `${getMonthName(new Date().getMonth())} ${new Date().getDate()}, ${new Date().getFullYear()}`,
        };

        sendAjaxSync(record, form, 2, 0);
    }

    sendAjaxSync(data, form, 2, 1);

}
function submitApp(form) {
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.toLowerCase().trim();
    let characterName = form.querySelector('#character').options[form.querySelector('#character').selectedIndex].innerText.toLowerCase().trim();
    let characterId = form.querySelector('#character').options[form.querySelector('#character').selectedIndex].value.trim();
    let cheatsheet = form.querySelector('#cheatsheet').value.trim().replaceAll('\n', '');
    let freeform = form.querySelector('#freeform').value.trim().replaceAll('\n', '');
    let miscTitles = Array.from(form.querySelectorAll('.app-info .title')).map(item => item.value.toLowerCase().trim());
    let miscContents = Array.from(form.querySelectorAll('.app-info .content')).map(item => item.value.trim().replaceAll('\n', ''));
    let miscFormatted = {};

    miscTitles.forEach((title, i) => {
        miscFormatted[title] = miscContents[i];
    });

    let data = {
        SubmissionType: 'add-longform',
        Character: characterName,
        ID: characterId,
        Site: site,
        Cheatsheet: cheatsheet,
        Freeform: freeform,
        Misc: JSON.stringify(miscFormatted),
    };

    let existing = storedApps.filter(item => item.Character === characterName && item.Site === site);
    if(existing.length > 0) {
        data.SubmissionType = 'replace-longform';
    }

    sendAjax(form, data, successMessage);
}
function updateTags(form, data) {
    let title = form.querySelector('#title').options[form.querySelector('#title').selectedIndex].value.trim().toLowerCase();
    let newSites = Array.from(form.querySelectorAll('.sites .multiselect input:checked')).map(item => item.value);
    let newTags = Array.from(form.querySelectorAll('.tag-options input')).map(item => item.value.toLowerCase().trim());

    let existing = data.filter(item => item.Tag === title)[0];
    if(newSites.length > 0) {
        let combined = [...JSON.parse(existing.Sites), ...newSites];
        existing.Sites = JSON.stringify(combined);
    }
    if(newTags.length > 0) {
        let combined = [...JSON.parse(existing.Set), ...newTags];
        existing.Set = JSON.stringify(combined);
    }
    existing.SubmissionType = 'edit-tags';

    sendAjax(form, existing, successMessage);
}
function updatePartner(form, data) {
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let partner = form.querySelector('#partner').options[form.querySelector('#partner').selectedIndex].value.trim().toLowerCase();
    let characters = form.querySelectorAll('#charName');
    let characterList = [];

    characters.forEach(character => {
        let name = character.value.trim().toLowerCase();
        let id = character.closest('.row').querySelector('#charId').value.trim();
        characterList.push({
            name: name.replaceAll(`'`, `&apos;`),
            id: id,
        });
    });

    let existing = data.filter(item => item.Site === site && item.WriterID === partner)[0];
    if(characterList.length > 0) {
        let combined = [...JSON.parse(existing.Characters), ...characterList];
        existing.Characters = JSON.stringify(combined);
    }
    existing.SubmissionType = 'edit-partner';
    sendAjax(form, existing, successMessage);
}
function updateCharacter(form, data) {
    let siteField = form.querySelector('#characterSite');
    let site = siteField.options[siteField.selectedIndex].value !== '' ? siteField.options[siteField.selectedIndex].innerText.trim().toLowerCase() : null;
    let character = form.querySelector('#character').options[form.querySelector('#character').selectedIndex].value.trim().toLowerCase();
    let selected = Array.from(form.querySelectorAll('.updates input:checked')).map(item => item.value);
    let existing = data.filter(item => item.Character === character)[0];
    
    //change vibes
    if(selected.includes('vibes')) {
        existing.Vibes = form.querySelector('#vibes').value.trim();
    }

    //add links
    if(selected.includes('addLinks')) {
        let links = form.querySelectorAll('#linkTitle');
        let linkList = [];
        links.forEach(link => {
            let title = link.value.trim().toLowerCase();
            let url = link.closest('.row').querySelector('#linkURL').value.trim();
            linkList.push({
                title: title,
                url: url,
            });
        });
        existing.Links = JSON.stringify([...JSON.parse(existing.Links), ...linkList]);
    }
    
    //change basics
    if(selected.includes('changeBasics')) {
        if(existing.Basics && existing.Basics !== '') {
            let existingBasics = JSON.parse(existing.Basics);
            for(instance in existingBasics) {
                if(existingBasics[instance].site === site) {
                    let gender = form.querySelector('#gender').value.trim().toLowerCase();
                    let pronouns = form.querySelector('#pronouns').value.trim().toLowerCase();
                    let age = form.querySelector('#ageValue').value.trim().toLowerCase();
                    let face = form.querySelector('#face').value.trim().toLowerCase();
                    let image = form.querySelector('#image').value.trim();
                    let extras = Array.from(form.querySelectorAll('.row.extra-info'));
                    let formattedExtras = {};
                    extras.forEach(extra => {
                        let title = extra.querySelector('.title').value.toLowerCase().trim();
                        let content = extra.querySelector('.content').value.trim();
                        formattedExtras[title] = content;
                    });

                    existingBasics[instance].basics.gender = (gender && gender !== '') ? gender : existingBasics[instance].basics.gender;
                    existingBasics[instance].basics.pronouns = (pronouns && pronouns !== '') ? pronouns : existingBasics[instance].basics.pronouns;
                    existingBasics[instance].basics.age = (age && age !== '') ? age : existingBasics[instance].basics.age;
                    existingBasics[instance].basics.face = (face && face !== '') ? face : existingBasics[instance].basics.face;
                    existingBasics[instance].basics.image = (image && image !== '') ? image : existingBasics[instance].basics.image;
                    if(Object.keys(formattedExtras).length > 0) {
                        existingBasics[instance].extras = {...existingBasics[instance].extras, ...formattedExtras};
                    }
                }
            }
            existing.Basics = JSON.stringify(existingBasics);
        } else {
            let extras = Array.from(form.querySelectorAll('.row.extra-info'));
            let formattedExtras = {};
            extras.forEach(extra => {
                let title = extra.querySelector('.title').value.toLowerCase().trim();
                let content = extra.querySelector('.content').value.trim();
                formattedExtras[title] = content;
            });

            existing.Basics = JSON.stringify([{
                site: site,
                basics: {
                    gender: form.querySelector('#gender').value.trim().toLowerCase(),
                    pronouns: form.querySelector('#pronouns').value.trim().toLowerCase(),
                    age: form.querySelector('#ageValue').value.trim().toLowerCase(),
                    face: form.querySelector('#face').value.trim().toLowerCase(),
                    image: form.querySelector('#image').value.trim(),
                },
                extras: formattedExtras
            }]);
        }
    }

    //change ships
    if(selected.includes('changeShip')) {
        let relationships = form.querySelectorAll('.change-ship');
        let shipList = [];
        relationships.forEach(ship => {
            let writer = ship.dataset.writer;
            let character = ship.dataset.character;
            let existingSection = ship.dataset.section;
            let existingType = ship.dataset.relationship;
            let section = ship.querySelector('#section').options[ship.querySelector('#section').selectedIndex];
            let type = ship.querySelector('#type').options[ship.querySelector('#type').selectedIndex];
            shipList.push({
                writer: writer,
                character: character,
                relationship: type && type.value !== '' ? type.innerText.trim().toLowerCase() : existingType,
                section: section && section.value !== '' ? section.innerText.trim().toLowerCase() : existingSection,
                sectionID: section && section.value !== '' ? section.dataset.id : existingSectionId,
            });
        });
        let existingShips = JSON.parse(existing.Ships);
        for(instance in existingShips) {
            if(existingShips[instance].site === site) {
                existingShips[instance].characters = [...shipList];
            }
        }
        existing.Ships = JSON.stringify(existingShips);
    }

    //add ships
    if(selected.includes('addShip')) {
        let relationships = form.querySelectorAll('.ships #partner');
        let shipList = [];
        relationships.forEach(ship => {
            let writer = ship.options[ship.selectedIndex].innerText.trim().toLowerCase();
            let character = writer === 'npc'
                            ? ship.closest('.row').querySelector('.npcname').value.trim().toLowerCase()
                            : ship.closest('.row').querySelector('#character').options[ship.closest('.row').querySelector('#character').selectedIndex].innerText.trim().toLowerCase();
            let type = ship.closest('.row').querySelector('#type').options[ship.closest('.row').querySelector('#type').selectedIndex].innerText.trim().toLowerCase();
            let section = ship.closest('.row').querySelector('#section').options[ship.closest('.row').querySelector('#section').selectedIndex].innerText.trim().toLowerCase();
            let sectionID = ship.closest('.row').querySelector('#section').options[ship.closest('.row').querySelector('#section').selectedIndex].value;
            shipList.push({
                writer: writer,
                character: character,
                relationship: type,
                section: section,
                sectionID: sectionID,
            });
        });
        let existingShips = JSON.parse(existing.Ships);
        for(instance in existingShips) {
            if(existingShips[instance].site === site) {
                existingShips[instance].characters = [...existingShips[instance].characters, ...shipList];
            }
        }
        existing.Ships = JSON.stringify(existingShips);
    }

    //add tags
    if(selected.includes('addTags')) {
        let siteTags = form.querySelectorAll('input.tag:checked');
        let tagList = {};
        let tagArray = [];
        let replacingTags = [];
        siteTags.forEach(tag => {
            if(tag.type === 'radio') {
                replacingTags.push(tag.name);
            }
            if(tagList[tag.name]) {
                tagList[tag.name].push(tag.value);
            } else {
                tagList[tag.name] = [tag.value];
            }
        });
        for(tagType in tagList) {
            tagArray.push({
                type: tagType,
                tags: tagList[tagType],
            });
        }

        let existingTags = JSON.parse(existing.Tags);
        let notExistingTags = [];
        //add to existing
        for(instance in existingTags) {
            if(existingTags[instance].site === site) {
                for(set in existingTags[instance].tags) {
                    for(newSet in tagArray) {

                        if(existingTags[instance].tags[set].type === tagArray[newSet].type) {
                            if(replacingTags.includes(tagArray[newSet].type)) {
                                existingTags[instance].tags[set].tags = tagArray[newSet].tags;
                            } else {
                                existingTags[instance].tags[set].tags = [...existingTags[instance].tags[set].tags, ...tagArray[newSet].tags];
                            }
                        } else {
                            if(!notExistingTags.includes(tagArray[newSet].type)) {
                                notExistingTags.push(tagArray[newSet].type);
                            }
                        }
                    }
                }
            }
        }
        notExistingTags.forEach(newTagType => {
            for(instance in existingTags) {
                if(existingTags[instance].site === site) {
                    for(newSet in tagArray) {
                        if(newTagType === tagArray[newSet].type) {
                            existingTags[instance].tags.push(tagArray[newSet])
                        }
                    }
                }
            }
        });

        existing.Tags = JSON.stringify(existingTags);
    }

    //remove links
    if(selected.includes('removeLinks')) {
        let remove = Array.from(form.querySelectorAll('.removeLink:checked')).map(item => ({
            title: item.closest('label').querySelector('b').innerText.trim().toLowerCase(),
            url: item.value,
        }));
        let existingLinks = JSON.parse(existing.Links);
        existingLinks.forEach(link => {
            remove.forEach(removeLink => {
                if(link.title === removeLink.title && link.url === removeLink.url) {
                    link.title = 'remove';
                    link.url = 'remove';
                }
            })
        });
        existingLinks = existingLinks.filter(item => item.title !== 'remove' && item.url !== 'remove');
        
        existing.Links = JSON.stringify(existingLinks);
    }

    //remove ships
    if(selected.includes('removeShip')) {
        let remove = Array.from(form.querySelectorAll('.removeShip:checked')).map(item => ({
            writer: item.dataset.writer,
            character: item.value,
            relationship: item.dataset.ship,
        }));
        let existingShips = JSON.parse(existing.Ships);
        for(instance in existingShips) {
            if(existingShips[instance].site === site) {
                existingShips[instance].characters.forEach(ship => {
                    remove.forEach(removeShip => {
                        if(ship.character === removeShip.character && ship.writer === removeShip.writer && ship.relationship === removeShip.relationship) {
                            ship.character = 'remove';
                            ship.writer = 'remove';
                            ship.relationship = 'remove';
                        }
                    });
                });
                existingShips[instance].characters = existingShips[instance].characters.filter(item => item.character !== 'remove' && item.writer !== 'remove' && item.relationship !== 'remove');
            }
        }
        existing.Ships = JSON.stringify(existingShips);
    }

    //remove tags
    if(selected.includes('removeTags')) {
        let remove = Array.from(form.querySelectorAll('.removeTag:checked')).map(item => ({
            type: item.dataset.type,
            tag: item.value,
        }));
        let existingTags = JSON.parse(existing.Tags);
        for(instance in existingTags) {
            if(existingTags[instance].site === site) {
                for(set in existingTags[instance].tags) {
                    remove.forEach(tag => {
                        if(tag.type === existingTags[instance].tags[set].type) {
                            existingTags[instance].tags[set].tags = existingTags[instance].tags[set].tags.filter(item => item !== tag.tag);
                        }
                    })
                }
            }
        }
        existing.Tags = JSON.stringify(existingTags);
    }

    existing.SubmissionType = 'edit-character';

    sendAjax(form, existing, successMessage);
}
function updateThread(form, data) {
    let currentTitle = form.querySelector('#title').options[form.querySelector('#title').selectedIndex].innerText.trim().toLowerCase();
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    console.log(currentTitle);
    console.log(site);
    let existing = data.filter(item => item.Title === currentTitle && item.Site === site)[0];
    let selected = Array.from(form.querySelectorAll('.updates input:checked')).map(item => item.value);

    //title
    if(selected.includes('title')) {
        existing.NewTitle = form.querySelector('#newTitle').value.trim().toLowerCase();
    } else {
        existing.NewTitle = currentTitle;
    }

    //id
    if(selected.includes('id')) {
        existing.ThreadID = form.querySelector('#id').value.trim();
    }

    //date
    if(selected.includes('date')) {
        existing.ICDate = form.querySelector('#date').value;
    }

    //description
    if(selected.includes('description')) {
        existing.Description = form.querySelector('#description').value;
    }

    //add tags
    if(selected.includes('addThreadTags')) {
        let addedTags = Array.from(form.querySelectorAll('.tagAddition:checked')).map(item => item.value);
        let newTags = [...JSON.parse(existing.Tags), ...addedTags];
        existing.Tags = JSON.stringify(newTags);
    }

    //remove tags
    if(selected.includes('removeThreadTags')) {
        let removedTags = Array.from(form.querySelectorAll('.tagRemoval:checked')).map(item => item.value);
        let existingTags = JSON.parse(existing.Tags);
        removedTags.forEach(tag => {
            existingTags = existingTags.filter(item => item !== tag);
        })
        existing.Tags = JSON.stringify(existingTags);
    }

    existing.SubmissionType = 'edit-thread';
    sendAjax(form, existing, successMessage);
}
function addRecord(form) {
    //simple fields
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let character = form.querySelector('#character').options[form.querySelector('#character').selectedIndex];
    let id = form.querySelector('#thread-auto').options[form.querySelector('#thread-auto').selectedIndex].value;
    let records = form.querySelectorAll('.records-row');
    let ship = form.querySelector('#ship').value.toLowerCase().trim();
    let data = [];

    records.forEach(record => {
        data.push({
            SubmissionType: 'add-record',
            Site: site,
            Character: JSON.stringify({
                name: character.innerText.trim().toLowerCase().replaceAll(`'`, `&apos;`),
                id: character.value.trim().toLowerCase(),
            }),
            Thread: id,
            Words: record.querySelector('.words').value.trim(),
            Ship: ship,
            Date: record.querySelector('.date').value,
        })
    });

    form.querySelector('[type="submit"]').innerText = `Submitting...`;
    form.querySelector('[type="submit"]').setAttribute('disabled', true);
    data.forEach((item, i) => {
        sendAjaxSync(item, form, data.length, i);
    });
}
function countWords(e) {
    let form = e.closest('form');
    let content = form.querySelector('textarea');
    form.querySelector('.result').innerHTML = `${content.value.replace(/\n/g, ' ').split(' ').filter(word => word !== '').length} Words`;
}

/***** ISOTOPE FUNCTIONS *****/
function openFilters(e) {
    document.querySelector('.backdrop.horizontal').classList.remove('is-active');

    if(e.closest('.filter--parent').classList.contains('is-active')) {
        document.querySelectorAll('.filter--parent').forEach(filter => filter.classList.remove('is-active'));
    } else {
        document.querySelectorAll('.filter--parent').forEach(filter => filter.classList.remove('is-active'));
        e.closest('.filter--parent').classList.add('is-active');
    }
    
    if(document.querySelector('.filter--parent.is-active')) {
        document.querySelector('.backdrop.vertical').classList.add('is-active');
    } else {
        document.querySelector('.backdrop.vertical').classList.remove('is-active');
    }
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}
function setCustomFilter() {
    const hideUnless = document.querySelector('.completed-label');

    //get search value
    qsRegex = document.querySelector(typeSearch).value.toLowerCase().trim();
    
    //add show class to all items to reset
    elements = document.querySelectorAll(gridItem);
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(blockTitle).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    groups.forEach(group => {
        let tagString = group.selected.join('_');
        appendSearchQuery(group.group, tagString);
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    //if complete is selected
    if(filter.filter(item => item.includes('.status--complete')).length > 0) {
        filter = filter.join(', ');
    }
    //if not
    else {
        filter = filter.join(':not(.status--complete), ');
        filter += `:not(.status--complete)`;
    }
        
    //render isotope
    $container.isotope({
        filter: filter,
    });
    $container.isotope('layout');
}
function initIsotope() {
    //use value of input select to filter
    let checkboxes = document.querySelectorAll(filterOptions);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            if(e.currentTarget.classList.contains('all')) {
                e.currentTarget.checked = true;
                e.currentTarget.parentElement.parentElement.classList.add('is-checked');
                e.currentTarget.parentElement.parentElement.parentElement.querySelectorAll('input:not(.all)').forEach(input => {
                    input.checked = false;
                    input.parentElement.parentElement.classList.remove('is-checked');
                });
            } else {
                if(e.currentTarget.parentElement.parentElement.classList.contains('is-checked')) {
                    e.currentTarget.checked = false;
                    e.currentTarget.parentElement.parentElement.classList.remove('is-checked');
                } else {
                    e.currentTarget.checked = true;
                    e.currentTarget.parentElement.parentElement.classList.add('is-checked');
                    e.currentTarget.parentElement.parentElement.parentElement.querySelector('input.all').checked = false;
                    e.currentTarget.parentElement.parentElement.parentElement.querySelector('input.all').parentElement.parentElement.classList.remove('is-checked');
                }
            }
            let labels = e.currentTarget.parentElement.parentElement.parentElement.querySelectorAll('label');
            let checked = 0;
            labels.forEach(label => {
                if(label.classList.contains('is-checked')) {
                    checked++;
                }
            });
            if(checked === 0) {
                e.currentTarget.parentElement.parentElement.parentElement.querySelector('input.all').checked = true;
                e.currentTarget.parentElement.parentElement.parentElement.querySelector('input.all').parentElement.parentElement.classList.add('is-checked');
            }
            //set filters
            setCustomFilter();
        });
    });

    // use value of search field to filter
    const searchInput = document.querySelector(typeSearch);
    const handleKeyUp = debounce((e) => {
        console.log('Searching for:', e.target.value);
        appendSearchQuery('typesearch', e.target.value);
        setCustomFilter();
    }, 300);
    searchInput.addEventListener('keyup', handleKeyUp);

    // bind sort button click
    let sortButtons = document.querySelectorAll(sorts);
    sortButtons.forEach(button => {
        button.addEventListener('click', e => {
            let sortValue = e.currentTarget.dataset.sort;
            $container.isotope({ sortBy: sortValue });
            sortButtons.forEach(button => {
                button.classList.remove('is-checked');
            });
            e.currentTarget.classList.add('is-checked');
        });
    });
}
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout); // Cancel previous timer
        timeout = setTimeout(() => {
            func.apply(context, args); // Execute after 'wait' period
        }, wait);
    };
}
function toggleFilters(e) {
    e.closest('.filters--wrap').querySelector('.filters--collapsible').classList.toggle('is-open');
    if(!e.closest('.filters--wrap').querySelector('.filters--collapsible').classList.contains('is-open')) {
        document.querySelectorAll('.backdrop').forEach(item => item.classList.remove('is-active'));
    }
}

/***** THREAD TRACKING FUNCTIONS *****/
function prepThreads(data, site, sites) {
    let threads = site !== 'all' ? data.filter(item => item.Site.trim().toLowerCase() === site && item.Status.trim().toLowerCase() !== 'archived') : data.filter(item => item.Status.trim().toLowerCase() !== 'archived');

    if(site === 'all') {
        let activeSites = sites.filter(item => item.Close === '').map(item => item.Site);
        threads = threads.filter(item => activeSites.includes(item.Site));
    }

    threads.sort((a, b) => {
        let aStatus = a.Status.toLowerCase() === 'complete' ? 1 : 0;
        let bStatus = b.Status.toLowerCase() === 'complete' ? 1 : 0;
        if(JSON.parse(a.Character).name < JSON.parse(b.Character).name) {
            return -1;
        } else if (JSON.parse(a.Character).name > JSON.parse(b.Character).name) {
            return 1;
        } else if(aStatus < bStatus) {
            return -1;
        } else if (aStatus > bStatus) {
            return 1;
        } else if(new Date(a.ICDate) < new Date(b.ICDate)) {
            return -1;
        } else if (new Date(a.ICDate) > new Date(b.ICDate)) {
            return 1;
        } else if(new Date(a.LastUpdate) < new Date(b.LastUpdate)) {
            return -1;
        } else if (new Date(a.LastUpdate) > new Date(b.LastUpdate)) {
            return 1;
        } else {
            return 0;
        }
    });
    return threads;
}
function populateThreads(array, siteObject) {
    let html = ``;
    let characters = [], partners = [], featuring = [];

    for (let i = 0; i < array.length; i++) {
        //Make Character Array
        let character = JSON.parse(array[i].Character).name;
        if(jQuery.inArray(character, characters) == -1 && character != '' && array[i].Status.toLowerCase() !== 'complete') {
            characters.push(character);
        }

        let partnerObjects = JSON.parse(array[i].Featuring).map(item => item.writer);
        partnerObjects.forEach(partner => {
            if(jQuery.inArray(partner, partners) == -1 && partner != '' && array[i].Status.toLowerCase() !== 'complete') {
                partners.push(partner);
            }
        });

        let featureObjects = JSON.parse(array[i].Featuring).map(item => item.name);
        if(featureObjects) {
            featureObjects.forEach(featured => {
                if(jQuery.inArray(featured, featuring) == -1 && featured != '' && array[i].Status.toLowerCase() !== 'complete') {
                    featuring.push(featured);
                }
            });
        }
        
        let thread = {
            character: JSON.parse(array[i].Character),
            description: array[i].Description,
            featuring: JSON.parse(array[i].Featuring),
            date: array[i].ICDate,
            updated: array[i].LastUpdated,
            status: array[i].Status,
            tags: array[i].Tags,
            id: array[i].ThreadID,
            title: array[i].Title,
            type: array[i].Type,
            site: siteObject.length === 1 ? siteObject[0] : siteObject.filter(item => item.Site === array[i].Site)[0],
        }
        html += formatThread(thread);
    }
    document.querySelector('#threads--rows').insertAdjacentHTML('beforeend', html);

    //standardize
    characters = characters.map(item => item.toLowerCase());
    partners = partners.map(item => item.toLowerCase());
    featuring = featuring.map(item => item.toLowerCase());

    //sort appendable filters
    characters.sort();
    partners.sort();
    featuring.sort();

    //Append filters
    characters.forEach(character => {
        let characterNameArr = character.split(' ');
        let characterName = characterNameArr.length > 1 ? `${character.split(' ')[0].toLowerCase()} ${character.split(' ')[1][0].toLowerCase()}` : character.toLowerCase();
        document.querySelector('.filter--characters').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".${character.split(' ')[0].toLowerCase()}"/></span><b>${characterName}.</b></label>`);
    });
    partners.forEach(partner => {
        document.querySelector('.filter--partners').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".partner--${partner.replaceAll(' ', '').toLowerCase().trim()}"/></span><b>${partner}</b></label>`);
    });
    featuring.forEach(featured => {
        let featuredArray = featured.toLowerCase().trim().split(' ');
        let featuredClass = featuredArray.length > 1 ? `${featuredArray[0]}-${featuredArray[1][0]}` : featuredArray[0];
        let featuredName = featuredArray.length > 1 ? `${featuredArray[0]} ${featuredArray[1][0]}.` : featuredArray[0];
        document.querySelector('.filter--featuring').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".featured--${featuredClass}"/></span><b>${featuredName}</b></label>`);
    });
    threadTags.forEach(tag => {
        document.querySelector('.filter--tags').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".tag--${tag}"/></span><b>${tag}</b></label>`);
    });
    if(siteObject.length > 1) {
        siteObject = siteObject.filter(item => item.Close === '');
        siteObject.forEach(site => {
            document.querySelector('.filter--sites').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".site--${site.ID}"/></span><b>${site.Site}</b></label>`);
        });
    }
}
function appendSearchQuery(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}
function getDelay(date) {
    let elapsed = (new Date() - Date.parse(date)) / (1000*60*60*24);
    let delayClass;
    if(elapsed > 365) {
        delayClass = 'year';
    } else if (elapsed > 180) {
        delayClass = 'half';
    } else if (elapsed > 90) {
        delayClass = 'quarter';
    } else if (elapsed > 30) {
        delayClass = 'month';
    } else if (elapsed > 7) {
        delayClass = 'week';
    } else {
        delayClass = 'okay';
    }
    return delayClass;
}
function getDetailedDelay(date) {
    let elapsed = (new Date() - Date.parse(date)) / (1000*60*60*24);
    let delayClass;
    if(elapsed > 365) {
        delayClass = '> A Year';
    } else if (elapsed > 180) {
        delayClass = '> Six Months';
    } else if (elapsed > 90) {
        delayClass = '> Three Months';
    } else if (elapsed > 30) {
        delayClass = '> One Month';
    } else if (elapsed > 7) {
        delayClass = '> One Week';
    } else {
        delayClass = '< One Week';
    }
    return delayClass;
}
function updateStatusClass(thread, active) {
    thread.classList.remove('status--mine');
    thread.classList.remove('status--start');
    thread.classList.remove('status--theirs');
    thread.classList.remove('status--expecting');
    thread.classList.remove('status--complete');
    thread.closest('.thread').classList.remove('status--mine');
    thread.closest('.thread').classList.remove('status--start');
    thread.closest('.thread').classList.remove('status--theirs');
    thread.closest('.thread').classList.remove('status--expecting');
    thread.closest('.thread').classList.remove('status--complete');

    active.forEach(item => {
        thread.classList.add(item);
        thread.closest('.thread').classList.add(item);
    });
}
function sendThreadAjax(data, thread, form = null, complete = null) {
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        },
        complete: function () {
            console.log('complete');
            if(form) {
                form.originalTarget.querySelector('button[type="submit"]').innerText = 'Submit';
            } else if(complete) {
                updateStatusClass(thread, ['status--complete']);
                thread.querySelectorAll('button').forEach(button => {
                    button.classList.remove('is-updating');
                    button.removeAttribute('disabled');
                });
                setCustomFilter(['.status--complete']);
                $('#threads--rows').isotope('layout');
            } else if(data.Status === 'theirs') {
                updateStatusClass(thread, ['status--theirs'])
                thread.querySelector('[data-status]').classList.remove('is-updating');
                thread.querySelectorAll('button').forEach(button => {
                    button.removeAttribute('disabled');
                });
                setCustomFilter(['.status--complete']);
                $('#threads--rows').isotope('layout');
            } else if(data.Status === 'mine') {
                updateStatusClass(thread, ['status--mine'])
                thread.querySelector('[data-status]').classList.remove('is-updating');
                thread.querySelectorAll('button').forEach(button => {
                    button.removeAttribute('disabled');
                });
                setCustomFilter(['.status--complete']);
                $('#threads--rows').isotope('layout');
            }
        }
    });
}
function sendInlineRecordAjax(data, container) {
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        },
        complete: function () {
            console.log('complete');
            container.querySelectorAll('.record--inline button').forEach(button => {
                button.classList.remove('is-updating');
                button.removeAttribute('disabled');
            });
            container.querySelector('.record--inline').classList.remove('is-visible');
            container.querySelector('.inlineClick').click();
        }
    });
}
function countContentWords(content) {
    return content.replace(/\n/g, ' ').split(' ').filter(word => word !== '').length;
}
function changeStatus(e) {
    if(e.dataset.status === 'mine' || e.dataset.status === 'planned') {
        e.dataset.status = 'theirs';
        let thread = e.parentNode.parentNode.parentNode;
        e.classList.add('is-updating');
        e.setAttribute('disabled', true);
        sendThreadAjax({
            SubmissionType: 'thread-status',
            ThreadID: e.dataset.id,
            Site: e.dataset.site,
            Character: e.dataset.character.replaceAll(`'`, `&apos;`),
            Status: 'theirs'
        }, thread);
    } else if(e.dataset.status === 'theirs') {
        e.dataset.status = 'mine';
        let thread = e.parentNode.parentNode.parentNode;
        e.classList.add('is-updating');
        e.setAttribute('disabled', true);
        sendThreadAjax({
            SubmissionType: 'thread-status',
            ThreadID: e.dataset.id,
            Site: e.dataset.site,
            Character: e.dataset.character.replaceAll(`'`, `&apos;`),
            Status: 'mine'
        }, thread);
    }
    $('#threads--rows').isotope('layout');
}
function recordReply(e) {
    let container = e.closest('.thread--wrap');
    container.querySelector('.record--inline').classList.toggle('is-visible');
}
function recordReplySend(e) {
    e.preventDefault();

    let site = e.currentTarget.querySelector('button').dataset.site,
        character = e.currentTarget.querySelector('button').dataset.character.replaceAll(`'`, `&apos;`),
        characterID = e.currentTarget.querySelector('button').dataset.characterId,
        threadID = e.currentTarget.querySelector('button').dataset.id,
        container = e.currentTarget.closest('.thread'),
        words = e.currentTarget.closest('.record--inline').querySelector('.word-count').value,
        postWords = countContentWords(e.currentTarget.closest('.record--inline').querySelector('.post').value),
        ship = e.currentTarget.closest('.record--inline').querySelector('.ship').value.toLowerCase().trim();
        e.currentTarget.classList.add('is-updating');
        e.currentTarget.setAttribute('disabled', true);

    let data = {
        SubmissionType: 'add-record',
        Thread: threadID,
        Site: site,
        Character: JSON.stringify({
            name: character,
            id: characterID,
        }),
        Words: words ? words : postWords,
        Ship: ship,
        Date: new Intl.DateTimeFormat('en-CA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date()),
    };

    e.currentTarget.closest('.record--inline').querySelector('.word-count').value = '';
    e.currentTarget.closest('.record--inline').querySelector('.post').value = '';
    sendInlineRecordAjax(data, container);
}
function markComplete(e) {
    e.dataset.status = 'complete';
    let thread = e.parentNode.parentNode.parentNode;
    e.classList.add('is-updating');
    e.setAttribute('disabled', true);
    sendThreadAjax({
        SubmissionType: 'thread-status',
        ThreadID: e.dataset.id,
        Site: e.dataset.site,
        Character: e.dataset.character,
        Status: 'complete'
    }, thread, null, 'complete');
}
function reactivateThread(e) {
    e.dataset.status = 'mine';
    let thread = e.parentNode.parentNode.parentNode;
    e.classList.add('is-updating');
    e.setAttribute('disabled', true);
    sendThreadAjax({
        SubmissionType: 'thread-status',
        ThreadID: e.dataset.id,
        Site: e.dataset.site,
        Character: e.dataset.character.replaceAll(`'`, `&apos;`),
        Status: 'mine'
    }, thread);
}
function markArchived(e) {
    e.dataset.status = 'archived';
    let thread = e.parentNode.parentNode.parentNode;
    e.classList.add('is-updating');
    e.setAttribute('disabled', true);
    sendThreadAjax({
        SubmissionType: 'thread-status',
        ThreadID: e.dataset.id,
        Site: e.dataset.site,
        Character: e.dataset.character.replaceAll(`'`, `&apos;`),
        Status: 'archived'
    }, thread, null, 'archived');
}
function formatThread(thread) {
    let partnerClasses = ``, featuringClasses = ``, featuringText = ``, partnersText = ``;
    thread.featuring.forEach((featured, i) => {
        if(i > 0) {
            partnerClasses += ` `;
            featuringClasses += ` `;
            featuringText += `, `;
            partnersText += `, `;
        }
        partnerClasses += `partner--${featured.writer}`;
        featuringClasses += `featured--${featured.name.split(' ')[0]}-${featured.name.split(' ')[1] ? featured.name.split(' ')[1][0] : ''}`;
        featuringText += `<a href="${thread.site.URL}/${thread.site.Directory}${featured.id}">${featured.name}</a>`;
        partnersText += `<a href="${thread.site.URL}/${thread.site.Directory}${featured.writerId}">${featured.writer}</a>`;
    });
    let extraTags = thread.tags !== '' ? JSON.parse(thread.tags).map(item => `tag--${item}`).join(' ') : '';

    let buttons = `<form class="record--inline" onSubmit="return recordReplySend(event)">
            <input class="word-count" type="number" min="0" placeholder="words" />
            <input class="ship" type="text" placeholder="(optional)" />
            <textarea class="post" placeholder="post to count"></textarea>
            <button data-id="${thread.id}" data-site="${thread.site.Site}" data-character="${thread.character.name}" data-character-id="${thread.character.id}">
                <span class="not-loading">Send</span>
                <span class="loading">Sending...</span>
            </button>
        </form>
        <button class="activeOnly" onClick="recordReply(this)">
            <span class="not-loading">Record Reply</span>
            <span class="loading">Recording...</span>
        </button>
        <button class="activeOnly inlineClick" onClick="changeStatus(this)" data-status="${thread.status}" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}'>
            <span class="not-loading">Update Status</span>
            <span class="loading">Updating...</span>
        </button>
        <button class="activeOnly" onClick="markComplete(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}'>
            <span class="not-loading">Mark Complete</span>
            <span class="loading">Updating...</span>
        </button>
        <button class="inactiveOnly" onClick="reactivateThread(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}'>
            <span class="not-loading">Reactivate</span>
            <span class="loading">Updating...</span>
        </button>
        <button class="activeOnly" onClick="markArchived(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}'>
            <span class="not-loading">Archive</span>
            <span class="loading">Updating...</span>
        </button>`;

    return `<div class="thread lux-track grid-item grid-item ${thread.character.name.split(' ')[0]} ${partnerClasses} ${featuringClasses} status--${thread.status} type--${thread.type} delay--${getDelay(thread.updated)} ${extraTags} site--${thread.site.ID}">
        <div class="thread--wrap">
            <div class="thread--main">
                <div class="thread--dates">
                    <div class="thread--type">${thread.type}</div>
                    ${thread.date ? `<span class="thread--ic-date">Set <span>${thread.date}</span></span>` : ``}
                    <span class="thread--last-post">Last Active <span>${thread.updated}</span></span>
                    ${thread.date ? `` : `<span class="thread--ic-date"><span></span></span>`}
                </div>
                <div class="thread--title">
                    <a href="${thread.site.URL}/?showtopic=${thread.id}&view=getnewpost" target="_blank">${capitalize(thread.title, [' ', '-'])}</a>
                </div>
                <span class="bigger">Writing as <a class="thread--character" href="${thread.site.URL}/${thread.site.Directory}${thread.character.id}">${thread.character.name}</a></span>
                <span class="thread--feature">ft. ${featuringText}</span>
                <span class="thread--partners italic">Writing with ${partnersText}</span>
                <div class="thread--buttons">${buttons}</div>
            </div>
            ${thread.description && thread.description !== '' ? `<div class="thread--right"><div class="thread--right-inner"><div class="scroll"><p>${thread.description}</p></div></div></div>` : ''}
        </div>
    </div>`;
}

/***** CHARACTER TRACKING FUNCTIONS *****/
function cleanText(text) {
	return text.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '').replaceAll(`.`, '').replaceAll(`(`, '').replaceAll(`)`, '').replaceAll(`,`, '').replaceAll(`’`, '').replaceAll(`é`, `e`).replaceAll(`è`, `e`).replaceAll(`ê`, `e`).replaceAll(`ë`, `e`).replaceAll(`ě`, `e`).replaceAll(`ẽ`, `e`).replaceAll(`ē`, `e`).replaceAll(`ė`, `e`).replaceAll(`ę`, `e`).replaceAll(`à`, `a`).replaceAll(`á`, `a`).replaceAll(`â`, `a`).replaceAll(`ä`, `a`).replaceAll(`ǎ`, `a`).replaceAll(`æ`, `ae`).replaceAll(`ã`, `a`).replaceAll(`å`, `a`).replaceAll(`ā`, `a`).replaceAll(`í`, `i`).replaceAll(`ì`, `i`).replaceAll(`ı`, `i`).replaceAll(`î`, `i`).replaceAll(`ï`, `i`).replaceAll(`ǐ`, `i`).replaceAll(`ĭ`, `i`).replaceAll(`ī`, `i`).replaceAll(`ĩ`, `i`).replaceAll(`į`, `i`).replaceAll(`ḯ`, `i`).replaceAll(`ỉ`, `i`).replaceAll(`ó`, `o`).replaceAll(`ò`, `o`).replaceAll(`ȯ`, `o`).replaceAll(`ô`, `o`).replaceAll(`ö`, `o`).replaceAll(`ǒ`, `o`).replaceAll(`ŏ`, `o`).replaceAll(`ō`, `o`).replaceAll(`õ`, `o`).replaceAll(`ǫ`, `o`).replaceAll(`ő`, `o`).replaceAll(`ố`, `o`).replaceAll(`ồ`, `o`).replaceAll(`ø`, `o`).replaceAll(`ṓ`, `o`).replaceAll(`ṑ`, `o`).replaceAll(`ȱ`, `o`).replaceAll(`ṍ`, `o`).replaceAll(`ú`, `u`).replaceAll(`ù`, `u`).replaceAll(`û`, `u`).replaceAll(`ü`, `u`).replaceAll(`ǔ`, `u`).replaceAll(`ŭ`, `u`).replaceAll(`ū`, `u`).replaceAll(`ũ`, `u`).replaceAll(`ů`, `u`).replaceAll(`ų`, `u`).replaceAll(`ű`, `u`).replaceAll(`ʉ`, `u`).replaceAll(`ǘ`, `u`).replaceAll(`ǜ`, `u`).replaceAll(`ǚ`, `u`).replaceAll(`ṹ`, `u`).replaceAll(`ǖ`, `u`).replaceAll(`ṻ`, `u`).replaceAll(`ủ`, `u`).replaceAll(`ȕ`, `u`).replaceAll(`ȗ`, `u`).replaceAll(`ư`, `u`);
}
function prepTags(data, site) {
    data.forEach((item, i) => {
        data[i].Sites = JSON.parse(item.Sites);
        data[i].Set = JSON.parse(item.Set);
    });
    let activeTags = data.filter(item => item.Sites.includes(site) || item.Sites.includes('all'));
    let html = ``;

    activeTags.forEach(set => {
        html += `<div class="characters--filter filter--parent">
            <button onClick="openFilters(this)">${set.Tag}</button>
            <div class="characters--filter-dropdown">
                <div class="characters--filter-group filter--sites" data-filter-group="${cleanText(set.Tag)}">
                    <label class="all is-checked"><span><input type="checkbox" class="all" value="" checked=""></span><b>any</b></label>
                    ${set.Set.map(item => `<label><span><input type="checkbox" value=".${cleanText(set.Tag)}--${cleanText(item)}"></span><b>${item}</b></label>`).join('')}
                </div>
            </div>
        </div>`;
    });
    
    document.querySelector('.characters--filters-inner').insertAdjacentHTML('beforeend', html);
}
function prepCharacters(data, site, longform) {
    data.forEach((item, i) => {
        data[i].Sites = JSON.parse(item.Sites);
        data[i].Links = JSON.parse(item.Links);
        data[i].Tags = JSON.parse(item.Tags);
        data[i].Ships = JSON.parse(item.Ships);
        data[i].Basics = JSON.parse(item.Basics);
    });
    let characters = [];
    if(site !== 'all') {
        data.forEach((item) => {
            item.Sites.forEach(instance => {
                if(instance.site === site) {
                    characters.push(item);
                }
            });
        });
    } else {
        characters = [...data];
    }

    characters.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    characters.forEach(character => {
        let apps = [];
        if(site !== 'all') {
            let entry = longform.filter(item => item.Character === character.Character && item.Site === site)[0];
            if(entry) {
                apps.push({
                    site: entry.Site,
                    ...((entry.Cheatsheet && entry.Cheatsheet !== '') && {cheatsheet: entry.Cheatsheet}),
                    ...((entry.Freeform && entry.Freeform !== '') && {freeform: entry.Freeform}),
                    ...((entry.Misc && entry.Misc !== '') && {misc: JSON.parse(entry.Misc)}),
                });
            }
        } else {
            let entries = longform.filter(item => item.Character === character.Character);
            if(entries.length > 0) {
                entries.forEach(entry => {
                    apps.push({
                        site: entry.Site,
                        ...((entry.Cheatsheet && entry.Cheatsheet !== '') && {cheatsheet: entry.Cheatsheet}),
                        ...((entry.Freeform && entry.Freeform !== '') && {freeform: entry.Freeform}),
                        ...((entry.Misc && entry.Misc !== '') && {misc: JSON.parse(entry.Misc)}),
                    });
                });
            }
        }
        character.Apps = apps;
    });
    
    return characters;
}
function populateCharacters(array, siteObject) {
    let html = ``;

    for (let i = 0; i < array.length; i++) {
        let character = {
            character: array[i].Character,
            vibes: array[i].Vibes,
            links: array[i].Links,
        }
        if(siteObject.length === 1) {
            array[i].Ships.forEach(instance => {
                if(instance.site === siteObject[0].Site) {
                    character.ships = instance.characters;
                }
            });
            array[i].Tags.forEach(instance => {
                if(instance.site === siteObject[0].Site) {
                    character.tags = instance.tags;
                }
            });
            array[i].Sites.forEach(instance => {
                if(instance.site === siteObject[0].Site) {
                    character.id = instance.id;
                    character.sites = siteObject[0];
                }
            });
            array[i].Basics.forEach(instance => {
                if(instance.site === siteObject[0].Site) {
                    character.basics = instance.basics;
                    character.extras = instance.extras;
                }
            });
            character.apps = array[i].Apps[0];
        } else {
            character.ships = array[i].Ships;
            character.tags = array[i].Tags;
            character.sites = array[i].Sites;
            character.basics = array[i].Basics;
            character.id = null;
            character.apps = array[i].Apps;
        }
        html += formatCharacter(character, siteObject.length > 1, siteObject);
    }
    document.querySelector('#characters--rows').insertAdjacentHTML('beforeend', html);

    if(siteObject.length > 1) {
        siteObject.forEach(site => {
            document.querySelector('.filter--sites').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".site--${site.ID}"/></span><b>${site.Site}</b></label>`);
        });
    }
}
function formatCharacter(character, viewAll, sites) {
    if(viewAll) {
        return formatMultipleInstance(character, sites);
    }
    return formatSingleInstance(character);
}
function formatSingleInstance(character, sites) {
    let tagsString = ``;
    for(type in character.tags) {
        character.tags[type].tags.forEach((set, i) => {
            tagsString += ` `;
            if(set !== '') {
                tagsString += `${character.tags[type].type}--${set}`;
            }
        });
    }
    
    character.ships.sort((a, b) => {
        if(a.character < b.character) {
            return -1;
        } else if(a.character > b.character) {
            return 1;
        } else if(a.writer < b.writer) {
            return -1;
        } else if(a.writer > b.writer) {
            return 1;
        } else if(a.relationship < b.relationship) {
            return -1;
        } else if(a.relationship > b.relationship) {
            return 1;
        } else {
            return 0
        }
    });

    let shipNames = [], combinedShips = {}, shipHTML = ``, sectionableShips = [];
    character.ships.forEach(ship => {
        if(shipNames.includes(ship.character)) {
            combinedShips[ship.character].relationship += `, ${ship.relationship}`;
            if(parseInt(combinedShips[ship.character].sectionID) > parseInt(ship.sectionID)) {
                combinedShips[ship.character].sectionID = ship.sectionID;
                combinedShips[ship.character].section = ship.section;
            }
        } else {
            shipNames.push(ship.character);
            combinedShips[ship.character] = {
                relationship: ship.relationship,
                writer: ship.writer,
                section: ship.section,
                sectionID: ship.sectionID,
            }
        }
    });
    for(ship in combinedShips) {
        sectionableShips.push({
            character: ship,
            ...combinedShips[ship],
        });
    }
    sectionableShips.sort((a, b) => {
        if(parseInt(a.sectionID) < parseInt(b.sectionID)) {
            return -1;
        } else if(parseInt(a.sectionID) > parseInt(b.sectionID)) {
            return 1;
        } else {
            return 0;
        }
    });
    
    sectionableShips.forEach((ship, i) => {
        if(i === 0) {
            shipHTML += `<div class="character--modal-header">${ship.section ? ship.section : 'Unsorted'}</div><ul>`;
            shipHTML += `<li><b>${ship.character}</b><i>${ship.writer === 'npc' ? ship.writer : `played by ${ship.writer}`}</i><i>${ship.relationship}</i></li>`;
        } else if(sectionableShips[i - 1].section !== ship.section) {
            shipHTML += `</ul><div class="character--modal-header">${ship.section ? ship.section : 'Unsorted'}</div><ul>`;
            shipHTML += `<li><b>${ship.character}</b><i>${ship.writer === 'npc' ? ship.writer : `played by ${ship.writer}`}</i><i>${ship.relationship}</i></li>`;
        } else {
            shipHTML += `<li><b>${ship.character}</b><i>${ship.writer === 'npc' ? ship.writer : `played by ${ship.writer}`}</i><i>${ship.relationship}</i></li>`;
        }
    });
    shipHTML += `</ul>`;
    let extrasHTML = ``;
    for(item in character.extras) {
        extrasHTML += `<li><b>${item}</b><span>${character.extras[item]}</span></li>`;
    }

    let longformHTML = ``;
    if(character.apps) {
        if(character.apps.cheatsheet) {
            longformHTML += `<div class="app--block accordion">
                <strong class="accordion--trigger">Cheatsheet</strong>
                <span class="scroll accordion--content">${character.apps.cheatsheet}</span>
            </div>`;
        }
        if(character.apps.freeform) {
            longformHTML += `<div class="app--block freeform accordion">
                <strong class="accordion--trigger">Freeform</strong>
                <span class="scroll accordion--content">${character.apps.freeform}</span>
            </div>`;
        }
        for(item in character.apps.misc) {
            if(character.apps.misc[item] !== '') {
                if(item !== 'horses') {
                    longformHTML += `<div class="app--block accordion">
                        <strong class="accordion--trigger">${item}</strong>
                        <span class="scroll accordion--content">${character.apps.misc[item]}</span>
                    </div>`;
                } else {
                    longformHTML += `<div class="app--block accordion">
                        <strong class="accordion--trigger">${item}</strong>
                        <span class="scroll accordion--content"><textarea>${character.apps.misc[item]}</textarea></span>
                    </div>`;
                }
            }
        }
    }
    
    
    return `<div class="character lux-track grid-item has-modal ${tagsString} ${character.character.split(' ')[0]}">
        <div class="character--wrap">
            <div class="character--image"><img src="${character.basics.image}" loading="lazy" /></div>
            <div class="character--main">
                <div class="character--info">
                    ${character.basics.gender ? `<span>${character.basics.gender}</span>` : ''}
                    ${character.basics.pronouns ? `<span>${character.basics.pronouns}</span>` : ''}
                    ${character.basics.age ? `<span><span class="character--age">${character.basics.age}</span> years old</span>` : ''}
                    ${character.basics.face ? `<span>${character.basics.face}</span>` : ''}
                </div>
                <div class="character--title">
                    <a href="${character.sites.URL}/${character.sites.Directory}${character.id}" target="_blank">${capitalize(character.character)}</a>
                </div>
                <div class="character--info">
                    <button onclick="openModal(this)" data-type="info">info</button>
                    ${longformHTML !== '' ? `<button onclick="openModal(this)" data-type="longform">app</button>` : ``}
                    ${character.ships.length > 0 ? `<button onclick="openModal(this)" data-type="ships">relationships</button>` : ``}
                    ${character.links.map(item => `<a href="${item.url}" target="_blank">${item.title}</a>`).join('')}
                </div>
            </div>
            ${character.vibes && character.vibes !== '' ? `<div class="character--right"><div class="thread--right-inner"><div class="scroll"><p>${character.vibes}</p></div></div></div>` : ''}
        </div>
        <div class="character--modal" data-type="info">
            <div class="character--modal-inner">
                <div class="character--modal-inner-scroll">
                    <ul>
                        <li><b>Gender</b><span>${character.basics.gender}</span></li>
                        <li><b>Pronouns</b><span>${character.basics.pronouns}</span></li>
                        <li><b>Age</b><span>${character.basics.age} years old</span></li>
                        <li><b>Face</b><span>${character.basics.face}</span></li>
                        ${extrasHTML}
                    </ul>
                </div>
            </div>
        </div>
        <div class="character--modal" data-type="longform">
            <div class="character--modal-inner">
                <div class="character--modal-inner-scroll apps">
                    ${longformHTML}
                </div>
            </div>
        </div>
        <div class="character--modal" data-type="ships">
            <div class="character--modal-inner">
                <div class="character--modal-inner-scroll">
                    ${shipHTML}
                </div>
            </div>
        </div>
    </div>`;
}
function openModal(e) {
    let type = e.dataset.type;
    let site = e.dataset.site;
    let modal = site ? e.closest('.has-modal').querySelector(`.character--modal[data-type="${type}"][data-site="${site}"]`) : e.closest('.has-modal').querySelector(`.character--modal[data-type="${type}"]`);
    modal.classList.toggle('is-open');
    modal.addEventListener('click', e => {
        e.target.classList.remove('is-open');
    })
}
function switchSite(e) {
    e.closest('.character--info').querySelectorAll('button').forEach(button => button.classList.remove('is-active'));
    e.classList.add('is-active');
    let site = e.dataset.site;
    let wrap = e.closest('.character--wrap');
    wrap.dataset.site = site;
    let elements = wrap.querySelectorAll('.switchable[data-site]');
    elements.forEach(el => {
        if(el.dataset.site === site) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}
function formatMultipleInstance(character, sites) {
    let tagsString = ``;
    character.tags.forEach(siteInstance => {
        for(type in siteInstance.tags) {
            siteInstance.tags[type].tags.forEach((set, i) => {
                tagsString += ` `;
                if(set !== '') {
                    tagsString += `${cleanText(siteInstance.tags[type].type)}--${cleanText(set)}`;
                }
            });
        }
        let site = sites.filter(item => item.Site === siteInstance.site)[0];
        tagsString += ` site--${site.ID}`;
    });
    
    let siteLabels = ``, siteModalButtons = ``, siteModals = ``, siteImages = ``, siteProfiles = ``;

    character.sites.sort((a, b) => {
        if(a.Site < b.Site) return -1;
        else if(a.Site > b.Site) return 1;
        else return 0;
    });
    
    character.sites.forEach((siteInstance, i) => {
        let charSite = character.sites.filter(item => item.site === siteInstance.site)[0];
        let basics = character.basics.filter(item => item.site === siteInstance.site)[0].basics;
        let extras = character.basics.filter(item => item.site === siteInstance.site)[0].extras;
        let ships = character.ships.filter(item => item.site === siteInstance.site)[0].characters;
        let siteApp = character.apps.filter(app => app.site === siteInstance.site)[0];
        let site = sites.filter(item => item.Site === siteInstance.site)[0];

        siteImages += `<img src="${basics.image}" loading="lazy" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}" />`;
        siteLabels += `<button onclick="switchSite(this)" data-site="${site.Site}" class="${i === 0 ? 'is-active' : ''}">${site.Site}</button>`;
        siteModalButtons += `<button onclick="openModal(this)" data-type="info" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}">info</button>
            ${siteApp ? `<button onclick="openModal(this)" data-type="longform" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}">app</button>` : ``}
            <button onclick="openModal(this)" data-type="ships" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}">relationships</button>
            <button onclick="openModal(this)" data-type="links" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}">links</button>`;
        siteProfiles += `<a href="${site.URL}/${site.Directory}${charSite.id}" target="_blank" data-site="${site.Site}" class="switchable ${i === 0 ? '' : 'hidden'}">${capitalize(character.character)}</a>`;

        let extrasHTML = ``;
        for(item in extras) {
            extrasHTML += `<li><b>${item}</b><span>${extras[item]}</span></li>`;
        }

        let shipNames = [], combinedShips = {}, shipHTML = ``;
        ships.forEach(ship => {
            if(shipNames.includes(ship.character)) {
                combinedShips[ship.character].relationship += `, ${ship.relationship}`;
            } else {
                shipNames.push(ship.character);
                combinedShips[ship.character] = {
                    relationship: ship.relationship,
                    writer: ship.writer,
                }
            }
        });
        for(ship in combinedShips) {
            shipHTML += `<li><b>${ship}</b><i>${combinedShips[ship].writer === 'npc' ? combinedShips[ship].writer : `played by ${combinedShips[ship].writer}`}</i><i>${combinedShips[ship].relationship}</i></li>`
        }

        let longformHTML = ``;
        if(siteApp) {
            if(siteApp.cheatsheet) {
                longformHTML += `<div class="app--block accordion">
                    <strong class="accordion--trigger">Cheatsheet</strong>
                    <span class="scroll accordion--content">${siteApp.cheatsheet}</span>
                </div>`;
            }
            if(siteApp.freeform) {
                longformHTML += `<div class="app--block freeform accordion">
                    <strong class="accordion--trigger">Freeform</strong>
                    <span class="scroll accordion--content">${siteApp.freeform}</span>
                </div>`;
            }
            for(item in siteApp.misc) {
                if(siteApp.misc[item] !== '') {
                    if(item !== 'horses') {
                        longformHTML += `<div class="app--block accordion">
                            <strong class="accordion--trigger">${item}</strong>
                            <span class="scroll accordion--content">${siteApp.misc[item]}</span>
                        </div>`;
                    } else {
                        longformHTML += `<div class="app--block accordion">
                            <strong class="accordion--trigger">${item}</strong>
                            <span class="scroll accordion--content"><textarea>${siteApp.misc[item]}</textarea></span>
                        </div>`;
                    }
                }
            }
        }

        siteModals += `<div class="character--modal" data-type="info" data-site="${site.Site}">
                <div class="character--modal-inner">
                    <div class="character--modal-inner-scroll">
                        <ul>
                            <li><b>Gender</b><span>${basics.gender}</span></li>
                            <li><b>Pronouns</b><span>${basics.pronouns}</span></li>
                            <li><b>Age</b><span>${basics.age} years old</span></li>
                            <li><b>Face</b><span>${basics.face}</span></li>
                            ${extrasHTML}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="character--modal" data-type="longform" data-site="${site.Site}">
                <div class="character--modal-inner">
                    <div class="character--modal-inner-scroll apps">
                        ${longformHTML}
                    </div>
                </div>
            </div>
            <div class="character--modal" data-type="ships" data-site="${site.Site}">
                <div class="character--modal-inner">
                    <div class="character--modal-inner-scroll">
                        <ul>
                            ${ships.length === 0 ? `<li class="fullWidth">No relationships registered with the tracker.</li>` : ``}
                            ${shipHTML}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="character--modal" data-type="links" data-site="${site.Site}">
                <div class="character--modal-inner">
                    <div class="character--modal-inner-scroll">
                        <ul>
                            ${character.links.map(item => `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;
    });
    
    return `<div class="character lux-track grid-item ${tagsString} ${character.character.split(' ')[0]} has-modal">
        <div class="character--wrap" data-site="${character.sites[0].site}">
            <div class="character--image">
                ${siteImages}
            </div>
            <div class="character--main">
                <div class="character--info">
                    ${siteLabels}
                </div>
                <div class="character--title">
                    ${siteProfiles}
                </div>
                <div class="character--info">
                    ${siteModalButtons}
                </div>
            </div>
            ${character.vibes && character.vibes !== '' ? `<div class="character--right"><div class="thread--right-inner"><div class="scroll"><p>${character.vibes}</p></div></div></div>` : ''}
        </div>
        ${siteModals}
    </div>`;
}
const markdownSafe = ['.apps .freeform.app--block > .scroll'];
function initMarkdownLists() {
    let quickLists = document.querySelectorAll('tl');
    if(quickLists.length > 0) {
        quickLists.forEach(list => {
            list.innerHTML = formatQuickList(list);
        });
    }

    if(document.querySelectorAll(markdownSafe).length > 0) {
        document.querySelectorAll(markdownSafe).forEach(post => {
            let str = post.innerHTML;
            str = formatMarkdown(str, `**`, `<b>"`, `"</b>`);
            str = formatMarkdown(str, `__`, `<i>`, `</i>`);
            str = formatMarkdown(str, `~~`, `<s>`, `</s>`);
            str = formatMarkdown(str, `||`, `<tag-spoiler>`, `</tag-spoiler>`);
            post.innerHTML = str;
        });
    }
}
function formatQuickList(list) {
    let html = ``;

    if(list.innerHTML.split(`+ `).length > 0) {
        html = `<ul>
            ${list
            .innerHTML.split('+ ')
            .filter(item => item !== '' && item !== '\n' && item !== '<br>')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }

    return html;
}
function basicMarkdownSplit(string, identifier, opening, closing) {
    let str;
    string.split(identifier).map((newvalue, newindex) => {
        if(string.split(identifier).length - 1 !== newindex) {
            if(newindex % 2 == 0) {
                str += newvalue;
            } else {
                str += `${opening}${newvalue}${closing}`;
            }
        }
    });
  
    return str;
}
function handleSpecialMarkdownAvoidance(value, identifier, opening, closing) {
    let newString = ``, warningIndex = -1;
    let strings = value.split(`="`);
    if (strings.length > 1) {
        strings.forEach((string, i) => {
    
            if(string.includes(identifier)) {
    
            if(string.includes('href') || string.includes('target') || string.includes('src') || string.includes('class') || string.includes('alt')) {
                warningIndex = i;
                newString += basicMarkdownSplit(string, identifier, opening, closing);
                if(strings.length - 1 !== i) {
                    newString += `="`;
                }
            } else {
                if(warningIndex === i - 1) {
                    newString += `${string.split(`">`)[0]}">`;
                    newString += basicMarkdownSplit(string, identifier, opening, closing);
                } else {
                    newString += basicMarkdownSplit(string, identifier, opening, closing);
                }
            }
    
            } else {
                if(strings.length - 1 !== i) {
                    newString += `${string}="`;
                } else {
                    newString += string;
                }
            }
        });
        return newString;
    } else {
        return `${value}${identifier}`;
    }
}
function formatMarkdown(str, identifier, opening, closing) {
    let original = str;
  
    str = str.split(identifier).map((value, index) => {
  
        if(str.split(identifier).length !== index && value !== '') {
            if ((value.includes('href=') || value.includes('target=') || value.includes('src=') || value.includes('class=') || value.includes('alt=')) && str.split(identifier).length > 1) {
                return handleSpecialMarkdownAvoidance(value, identifier, opening, closing);
            } else if(index % 2 == 0) {
                return value;
            } else {
                return `${opening}${value}${closing}`;
            }
        } else if(str.split(identifier).length !== index && value === '') {
            return `${identifier}${identifier}`;
        }
      
    }).join('');
  
    return (str !== '') ? str : original;
}

/***** STATS AND CHARTS FUNCTIONS *****/
function createCharacterStats(data, site, sites) {
    let siteName, characters;
    let stats = {
        genders: {
            tags: [],
            totals: []
        },
        pronouns: {
            tags: [],
            totals: []
        },
        ages: {
            tags: [],
            totals: []
        },
        total: 0,
    }

    if(site.length === 1) {
        siteName = site[0].Site;
        characters = data.map(item => JSON.parse(item.Basics).filter(instance => instance.site === siteName)[0] ? JSON.parse(item.Basics).filter(instance => instance.site === siteName)[0].basics : 'remove').filter(item => item !== 'remove');

        stats.total = characters.length;

        characters.map(item => item.age = groupAges(item.age));
    
        characters.forEach(character => {
            countStats(stats.genders, character.gender);
            countStats(stats.pronouns, character.pronouns);
            countStats(stats.ages, character.age);
        });
    } else {
        let activeSites = sites.filter(item => item.Close === '').map(item => item.Site);
        characters = data.map(item => ({...item, Basics: JSON.parse(item.Basics)}));
        let activeCount = 0;
        characters.forEach(character => {
            let sites = character.Basics.map(item => item.site);
            sites.forEach(item => {
                if(activeSites.includes(item)) {
                    activeCount++;
                }
            })
        });

        stats.total = activeCount;
    }

    return stats;
}
function createThreadStats(data, site, siteID, sites) {
    let siteName, threads;
    if(site.length === 1) {
        siteName = site[0].Site;
        threads = data.filter(item => item.Site === siteName);
    } else {
        threads = data;
    }
    
    let activeThreads = threads.filter(item => item.Status !== 'complete' && item.Status !== 'archived');
    let completedThreads = threads.filter(item => item.Status === 'complete');
    let icThreads = activeThreads.filter(item => item.Type === 'thread');
    let commThreads = activeThreads.filter(item => item.Type === 'comm');
    
    if(siteID === 'all') {
        let activeSites = sites.filter(item => item.Close === '').map(item => item.Site);
        activeThreads = activeThreads.filter(item => activeSites.includes(item.Site));
        completedThreads = completedThreads.filter(item => activeSites.includes(item.Site));
        icThreads = icThreads.filter(item => activeSites.includes(item.Site));
        commThreads = commThreads.filter(item => activeSites.includes(item.Site));
    }

    icThreads.forEach(item => {
        item.Delay = getDetailedDelay(item.LastUpdated);
    });
    commThreads.forEach(item => {
        item.Delay = getDetailedDelay(item.LastUpdated);
    });

    let threadPartners = activeThreads.map(thread => JSON.parse(thread.Featuring));
    let partnerNames = [];
    threadPartners.forEach(thread => {
        thread.forEach(threadPartner => {
            partnerNames.push(threadPartner.writer.trim().toLowerCase());
        });
    });

    let stats = {
        type: {
            tags: [],
            totals: []
        },
        status: {
            tags: [],
            totals: []
        },
        partners: {
            tags: [],
            totals: [],
        },
        active: activeThreads.length,
        completed: completedThreads.length,
    };

    let icStats = {
        status: {
            tags: [],
            totals: []
        },
        replies: {
            tags: [],
            totals: []
        },
    }
    let commStats = {
        status: {
            tags: [],
            totals: []
        },
        replies: {
            tags: [],
            totals: []
        },
    }

    //keep all these separate for correct sorting... even if it's an absolute pain
    let statusThreads = [...activeThreads];
    statusThreads.sort((a, b) => {
        if(a.Status < b.Status) {
            return -1;
        } else if(a.Status > b.Status) {
            return 1;
        } else {
            return 0;
        }
    });
    statusThreads.forEach(thread => {
        countStats(stats.status, thread.Status);
    });

    let typeThreads = [...activeThreads];
    typeThreads.sort((a, b) => {
        if(a.Type < b.Type) {
            return -1;
        } else if(a.Type > b.Type) {
            return 1;
        } else {
            return 0;
        }
    });
    typeThreads.forEach(thread => {
        countStats(stats.type, thread.Type);
    });

    partnerNames.sort();
    partnerNames.forEach(partner => {
        countStats(stats.partners, partner);
    });

    let icStatusThreads = [...icThreads];
    icStatusThreads.sort((a, b) => {
        if(a.Status < b.Status) {
            return -1;
        } else if(a.Status > b.Status) {
            return 1;
        } else {
            return 0;
        }
    });
    icStatusThreads.forEach(thread => {
        countStats(icStats.status, thread.Status);
    });

    let icDelayThreads = [...icThreads];
    icDelayThreads.sort((a, b) => {
        if(new Date(a.ICDate) > new Date(b.ICDate)) {
            return -1;
        } else if(new Date(a.ICDate) < new Date(b.ICDate)) {
            return 1;
        } else {
            return 0;
        }
    });
    icDelayThreads.forEach(thread => {
        countStats(icStats.replies, thread.Delay);
    });

    let commStatusThreads = [...commThreads];
    commStatusThreads.sort((a, b) => {
        if(a.Status < b.Status) {
            return -1;
        } else if(a.Status > b.Status) {
            return 1;
        } else {
            return 0;
        }
    });
    commStatusThreads.forEach(thread => {
        countStats(commStats.status, thread.Status);
    });

    let commDelayThreads = [...commThreads];
    commDelayThreads.sort((a, b) => {
        if(new Date(a.ICDate) > new Date(b.ICDate)) {
            return -1;
        } else if(new Date(a.ICDate) < new Date(b.ICDate)) {
            return 1;
        } else {
            return 0;
        }
    });
    commDelayThreads.forEach(thread => {
        countStats(commStats.replies, thread.Delay);
    });

    return [stats, icStats, commStats];
}
function countStats(stats, type) {
    if(stats.tags.includes(type)) {
        let index = stats.tags.indexOf(type);
        stats.totals[index] += 1;
    } else {
        stats.tags.push(type);
        stats.totals.push(1);
    }
}
function groupAges(age) {
    if(age < 20) {
        return 'Under 20';
    } else if(age < 30) {
        return '20s';
    } else if(age < 40) {
        return '30s';
    } else if(age < 40) {
        return '30s';
    } else if(age < 50) {
        return '40s';
    } else if(age >= 50 && age <100) {
        return '50+';
    } else {
        return 'Non-Human Aging';
    }
}

/***** WRITING TRACKING FUNCTIONS *****/
function toggleRecordsView(e) {
    let view = e.dataset.view.toLowerCase().trim();
    if(view === 'heatmap') {
        e.dataset.view = 'list';
        e.closest('.records').querySelector('.records--content').dataset.view = 'list';
        let currentMonth = getMonthName(new Date().getMonth());
        document.querySelectorAll(`.filter--month button`).forEach(button => button.classList.remove('is-active'));
        document.querySelector(`.filter--month button[data-month="${currentMonth}"]`).classList.add('is-active');
        initRecords(siteObject, staticRecords);
    } else {
        e.dataset.view = 'heatmap';
        e.closest('.records').querySelector('.records--content').dataset.view = 'heatmap';
        document.querySelectorAll(`.filter--month button`).forEach(button => button.classList.remove('is-active'));
        document.querySelector(`.filter--month button[data-month="all"]`).classList.add('is-active');
        initRecords(siteObject, staticRecords);
    }
}
function listActiveFilters() {
    let html = ``;
    let filters = document.querySelectorAll('.is-active[data-list-filter]');
    filters.forEach(filter => {
        html += `<button data-type="${filter.dataset.filter}" onClick="clearSingleFilter(this)">${filter.innerText}</button>`;
    });
    document.querySelector('.threads--filters-clipped').innerHTML = html;
}
function changeRecordFilter(e) {
    e.closest(`.filter--${e.dataset.filter}`).querySelectorAll('button').forEach(item => item.classList.remove('is-active'));
    e.classList.add('is-active');
    initRecords(siteObject, staticRecords);
    listActiveFilters();
}
function clearSingleFilter(e) {
    document.querySelectorAll(`button[data-filter="${e.dataset.type}"][data-list-filter]`).forEach(button => button.classList.remove('is-active'));
    document.querySelector(`button[data-filter="${e.dataset.type}"][data-all]`).classList.add('is-active');
    document.querySelectorAll('.filter--parent').forEach(item => item.classList.remove('is-active'));
    initRecords(siteObject, staticRecords);
    listActiveFilters();
}
function clearAllFilters() {
    document.querySelectorAll('.threads--filter-group:has([data-list-filter]').forEach(container => {
        container.querySelectorAll('button[data-list-filter]').forEach(button => button.classList.remove('is-active'));
        container.querySelector('button[data-all]').classList.add('is-active');
    });
    document.querySelectorAll('.filter--parent').forEach(item => item.classList.remove('is-active'));
    initRecords(siteObject, staticRecords);
    listActiveFilters();
}
function initRecordsFilters(years, characters, ships, sites, partners) {
    years.sort((a, b) => {
        if(parseInt(a) > parseInt(b)) return -1;
        else if(parseInt(a) < parseInt(b)) return 1;
        else return 0;
    });
    let yearsHTML = `<button onClick="changeRecordFilter(this)" data-all data-filter="year" data-year="all" class="listOnly">All</button>`;
    years.forEach((year, i) => {
        yearsHTML += `<button onClick="changeRecordFilter(this)" data-list-filter data-filter="year" data-year="${year}" class="${i === 0 ? 'is-active' : ''}">
            ${year}
        </button>`;
    })
    document.querySelector('.records .filter--year').innerHTML = yearsHTML;

    characters.sort();
    let charHTML = `<button onClick="changeRecordFilter(this)" data-all data-filter="characters" data-character="all" class="is-active">All</button>`;
    characters.forEach(character => {
        charHTML += `<button onClick="changeRecordFilter(this)" data-list-filter data-filter="characters" data-character="${character}">
            ${character}
        </button>`;
    })
    document.querySelector('.records .filter--characters').innerHTML = charHTML;

    ships.sort();
    let shipsHTML = `<button onClick="changeRecordFilter(this)" data-all data-filter="ships" data-ship="all" class="is-active">All</button>`;
    ships.forEach(ship => {
        if(ship !== '') {
            shipsHTML += `<button onClick="changeRecordFilter(this)" data-list-filter data-filter="ships" data-ship="${ship}">
                ${ship}
            </button>`;
        }
    })
    document.querySelector('.records .filter--ships').innerHTML = shipsHTML;

    partners.sort();
    let partnersHTML = `<button onClick="changeRecordFilter(this)" data-all data-filter="partners" data-partner="all" class="is-active">All</button>`;
    partners.forEach(partner => {
        partnersHTML += `<button onClick="changeRecordFilter(this)" data-list-filter data-filter="partners" data-partner="${partner}">
            ${partner}
        </button>`;
    })
    document.querySelector('.records .filter--partners').innerHTML = partnersHTML;

    if(sites.length > 1) {
        let sitesHTML = `<button onClick="changeRecordFilter(this)" data-all data-filter="sites" data-site="all" class="is-active">All</button>`;
        sitesHTML += '<b>Active</b>';
        sites.forEach((site, i) => {
            if(sites[i - 1] && sites[i - 1].Close === '' && site.Close !== '') {
                sitesHTML += '<b>Inactive</b>';
            }
            sitesHTML += `<button onClick="changeRecordFilter(this)" data-list-filter data-filter="sites" data-site="${site.Site}">
                ${site.Site}
            </button>`;
        });
        document.querySelector('.records .filter--sites').innerHTML = sitesHTML;
    }
}
function filterFilters(years, characters, ships, sites, partners, multisite) {
    document.querySelectorAll('[data-filter="year"]').forEach(filter => {
        if(filter.dataset.year !== 'all' && !years.includes(parseInt(filter.dataset.year))) {
            filter.classList.add('hidden');
        } else {
            filter.classList.remove('hidden');
        }
    });

    document.querySelectorAll('[data-filter="characters"]').forEach(filter => {
        if(filter.dataset.character !== 'all' && !characters.includes(filter.dataset.character)) {
            filter.classList.add('hidden');
        } else {
            filter.classList.remove('hidden');
        }
    });

    document.querySelectorAll('[data-filter="ships"]').forEach(filter => {
        if(filter.dataset.ship !== 'all' && !ships.includes(filter.dataset.ship)) {
            filter.classList.add('hidden');
        } else {
            filter.classList.remove('hidden');
        }
    });

    document.querySelectorAll('[data-filter="partners"]').forEach(filter => {
        if(filter.dataset.partner !== 'all' && !partners.includes(filter.dataset.partner)) {
            filter.classList.add('hidden');
        } else {
            filter.classList.remove('hidden');
        }
    });

    if(multisite) {
        document.querySelectorAll('[data-filter="sites"]').forEach(filter => {
            let siteNames = sites.map(item => item.Site);
            if(filter.dataset.site !== 'all' && !siteNames.includes(filter.dataset.site)) {
                filter.classList.add('hidden');
            } else {
                filter.classList.remove('hidden');
            }
        });
    }
}
function initRecords(sites, records, init = false) {
    let allYears = Array.from(document.querySelectorAll('.records .filter--year button:not([data-all]')).map(item => parseInt(item.dataset.year)).sort((a, b) => {
        if(a > b) return -1;
        else if(b < a) return 1;
        else return 0;
    });

    //get active filters
    let selectedFilters = {
        year: document.querySelector('.records .filter--year .is-active').dataset.year === 'all' ? document.querySelector('.records .filter--year .is-active').dataset.year : parseInt(document.querySelector('.records .filter--year .is-active').dataset.year),
        month: document.querySelector('.records .filter--month .is-active').dataset.month,
        character: document.querySelector('.records .filter--characters .is-active').dataset.character,
        ship: document.querySelector('.records .filter--ships .is-active').dataset.ship,
        site: document.querySelector('.records .filter--sites') ? document.querySelector('.records .filter--sites .is-active').dataset.site : sites[0].Site,
        type: document.querySelector('.records .filter--type .is-active').dataset.type,
        partner: document.querySelector('.records .filter--partners .is-active').dataset.partner,
        metric: document.querySelector('.records .filter--metric .is-active').dataset.metric,
    }

    //filter records and threads by the relevant data
    let filteredRecords = records.filter(item => 
        (item.Site === selectedFilters.site || selectedFilters.site === 'all') &&
        (new Date(item.Date).getFullYear() === selectedFilters.year || selectedFilters.year === 'all') &&
        (getMonthName(new Date(item.Date).getMonth()) === selectedFilters.month || selectedFilters.month === 'all') &&
        (JSON.parse(item.Character).name === selectedFilters.character || selectedFilters.character === 'all') &&
        (item.Ship === selectedFilters.ship || selectedFilters.ship === 'all') &&
        ((item.threadData && item.threadData.Type === selectedFilters.type) || selectedFilters.type === 'all') &&
        (item.partnerNames.includes(selectedFilters.partner) || selectedFilters.partner === 'all')
    );

    if(!init) {
        //filter filters?
        let relevantYears = [...new Set(filteredRecords.map(item => new Date(item.Date).getFullYear()))];
        let relevantCharacters = [...new Set(filteredRecords.map(item => JSON.parse(item.Character).name))];
        let relevantShips = [...new Set(filteredRecords.map(item => item.Ship))];
        let combinedRelevantSites = [...new Set(filteredRecords.map(item => item.Site))];
        let relevantSites = [];
        siteObject.forEach(site => {
            if(combinedRelevantSites.includes(site.Site)) {
                relevantSites.push({
                    Site: site.Site,
                    Status: site.Status
                });
            }
        });
        let combinedRelevantPartners = [...new Set(filteredRecords.map(item => item.partnerNames))];
        let relevantPartners = [];
        combinedRelevantPartners.forEach(partnerArray => {
            partnerArray.forEach(partner => {
                if(!relevantPartners.includes(partner)) {
                    relevantPartners.push(partner);
                }
            });
        });

        filterFilters(relevantYears, relevantCharacters, relevantShips, relevantSites, relevantPartners, siteObject.length > 1);
    }

    //format and print
    let heatmapHTML = formatHeatmap(filteredRecords, selectedFilters.year === 'all' ? allYears[0] : selectedFilters.year, selectedFilters.metric, selectedFilters.year === 'all'),
        listHTML = formatList(filteredRecords, selectedFilters);
        
    document.querySelector('.records--heatmaps').innerHTML = heatmapHTML;
    document.querySelector('.records--list').innerHTML = listHTML;
    listActiveFilters();
}
function totalWords(records) {
    let words = 0;
    records.forEach(record => {
        words += parseInt(record.Words);
    });
    return words;
}
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function firstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
}
function formatHeatmap(records, year, metric, isAll = false) {
    let monthlyRecords = {
        january: records.filter(item => new Date(item.Date).getMonth() === 0),
        february: records.filter(item => new Date(item.Date).getMonth() === 1),
        march: records.filter(item => new Date(item.Date).getMonth() === 2),
        april: records.filter(item => new Date(item.Date).getMonth() === 3),
        may: records.filter(item => new Date(item.Date).getMonth() === 4),
        june: records.filter(item => new Date(item.Date).getMonth() === 5),
        july: records.filter(item => new Date(item.Date).getMonth() === 6),
        august: records.filter(item => new Date(item.Date).getMonth() === 7),
        september: records.filter(item => new Date(item.Date).getMonth() === 8),
        october: records.filter(item => new Date(item.Date).getMonth() === 9),
        november: records.filter(item => new Date(item.Date).getMonth() === 10),
        december: records.filter(item => new Date(item.Date).getMonth() === 11),
    }
    let html = `<div class="heatmap">
        <div class="heatmap--header">
            <h2>${isAll ? 'Cumulative' : year} Heatmap</h2>
            <div class="heatmap--stats">
                <span>${records.length.toLocaleString('en-US')} posts</span>
                <span>${totalWords(records).toLocaleString('en-US')} words</span>
                <span>${getAverage(totalWords(records), records.length)} avg</span>
            </div>
            ${isAll ? '<p>Stats are combined across all years. E.g., January is combined of all January instances that exist.</p>' : ''}
        </div>
        <div class="heatmap--calendars">
            ${formatHeatmapCalendar(monthlyRecords, year, metric)}
        </div>
    </div>`;

    return html;
}
function assessYearlyWords(records, year) {
    let yearlyWords = {};
    for(let month = 0; month < 12; month++) {
        for(let day = 0; day < daysInMonth(month, year); day++) {
            let wordsByDay = 0;
            let recordsByDay = records[getMonthName(month)].filter(item => (new Date(item.Date).getDate() === day + 1) && new Date(item.Date).getMonth() === month);
            recordsByDay.forEach(record => wordsByDay += parseInt(record.Words));
            yearlyWords[`${month + 1}/${day + 1}/${year}`] = wordsByDay;
        }
    }
    return yearlyWords;
}
function assessYearlyPosts(records, year) {
    let yearlyPosts = {};
    for(let month = 0; month < 12; month++) {
        for(let day = 0; day < daysInMonth(month, year); day++) {
            let recordsByDay = records[getMonthName(month)].filter(item => (new Date(item.Date).getDate() === day + 1) && new Date(item.Date).getMonth() === month);
            yearlyPosts[`${month + 1}/${day + 1}/${year}`] = recordsByDay.length;
        }
    }
    return yearlyPosts;
}
function getAverage(words, posts) {
    if(words > 0 && posts > 0) {
        return Math.round(words / posts).toLocaleString('en-US');
    }
    return 0;
}
function getColor(actual, max) {
    if(!max || actual <= 0) return 0;

    const percent = Math.round((actual / max) * 100) / 100;
    if(percent < 0.34) {
        return `${heatmapLow}, ${percent + 0.1}`;
    } else if(percent >= 0.66) {
        return `${heatmapHigh}, ${percent}`;
    }
    return `${heatmapMid}, ${percent}`;
}
function formatHeatmapCalendar(records, year, metric) {
    let html = ``;
    let yearly, max;
    if(metric === 'words') {
        yearly = assessYearlyWords(records, year);
    } else if(metric === 'posts') {
        yearly = assessYearlyPosts(records, year);
    }
    max = Math.max(0, ...Object.values(yearly));

    for(let i = 0; i < 12; i++) {
        html += formatMonthlyHeatmap(records[getMonthName(i)], getMonthName(i), year, max, metric);
    }

    return html;
}
function formatCalendarRow(row, firstDay, lastDay, rowCount, recordsPerDay, max, metric) {
    let html = ``;

    for(let i = 0; i < 7; i++) {
        let wordCount = 0;
        let calendarSquare = i + ((row - 1) * 7);
        let daysRecords = recordsPerDay[calendarSquare - firstDay];
        if(daysRecords && daysRecords.length > 0) {
            daysRecords.forEach(record => {
                wordCount += parseInt(record.Words);
            });
        }

        if((row === 1 && i < firstDay) || (i >= lastDay && row === rowCount)) {
            //placeholder days
            html += `<div class="placeholder"></div>`;
        } else {
            //inner row days
            html += `<div ${wordCount > 0 ? `style="background-color: rgba(${getColor(metric === 'words' ? wordCount : daysRecords.length, max)})"` : ''}>
                <span>${calendarSquare - firstDay + 1}</span>
                ${wordCount > 0 ? `<div class="heatmap--tooltip">${daysRecords.length} posts<br>${wordCount} words<br>${getAverage(wordCount, daysRecords.length)} avg</div>` : ''}
            </div>`;
        }
    }

    return html;
}
function formatMonthlyHeatmap(records, month, year, max, metric) {
    let numDays = daysInMonth(getMonthNum(month), year);
    let firstDay = firstDayOfMonth (getMonthNum(month) - 1, year);
    let numRows = Math.ceil((numDays + firstDay) / 7);
    let lastDay = (numRows * 7) - (numDays + firstDay);
    
    let recordsPerDay = [];
    for(let i = 0; i < numDays; i++) {
        let dayRecords = records.filter(item => new Date(item.Date).getDate() === i + 1);
        recordsPerDay.push(dayRecords);
    }

    let gridHTML = ``;
    for(let i = 0; i < numRows; i++) {
        if(i === 0) {
            //first week
            gridHTML += formatCalendarRow(i + 1, firstDay, 7 - lastDay, numRows, recordsPerDay, max, metric);
        } else if(i === numRows - 1) {
            //last week
            gridHTML += formatCalendarRow(i + 1, firstDay, 7 - lastDay, numRows, recordsPerDay, max, metric);
        } else {
            gridHTML += formatCalendarRow(i + 1, firstDay, 7 - lastDay, numRows, recordsPerDay, max, metric);
        }
    }

    let html = `<div class="heatmap--month">
        <b>${month}</b>
        <div class="heatmap--stats">
            <span>${records.length.toLocaleString('en-US')} posts</span>
            <span>${totalWords(records).toLocaleString('en-US')} words</span>
            <span>${getAverage(totalWords(records), records.length)} avg</span>
        </div>
        <div class="heatmap--calendar">
            <b>Sun</b>
            <b>Mon</b>
            <b>Tue</b>
            <b>Wed</b>
            <b>Thu</b>
            <b>Fri</b>
            <b>Sat</b>
            ${gridHTML}
        </div>
    </div>`;

    return html;
}
function formatList(records, filters) {
    records.sort((a, b) => {
        if(new Date(a.Date) > new Date(b.Date)) {
            return -1;
        } else if(new Date(a.Date) < new Date(b.Date)) {
            return 1;
        } else if(JSON.parse(a.Character).name < JSON.parse(b.Character).name) {
            return -1;
        } else if(JSON.parse(a.Character).name > JSON.parse(b.Character).name) {
            return 1;
        } else {
            return 0;
        }
    })

    let html = ``;
    if(records.length > 0) {
        records.forEach(record => {
            html += formatListRecord(record, filters);
        })
    } else {
        html += `<blockquote>No records to show.</blockquote>`;
    }
    return html;
}
function formatListRecord(record) {
    let site = siteObject[0];
    if(siteObject.length > 1) {
        site = siteObject.filter(item => item.Site === record.Site)[0];
    }
    let siteURL = site.URL;

    let formattedPartners = record.partnerNames.map(item => `<button onClick="updateFilterFromRecord(this)" data-value="${item}" data-type="partner">${item}</button>`);

    return `<div class="record">
        <div class="record--stats">
            ${siteObject.length > 1 ? `<span>${record.Site}</span>` : ''}
            ${record.threadData ? `<button onClick="updateFilterFromRecord(this)" data-value="${record.threadData.Type}" data-type="type">${record.threadData.Type}</button>` : ''}
            <span>${record.Date}</span>
        </div>
        <div class="record--details">
            <div><b>character</b><button onClick="updateFilterFromRecord(this)" data-value="${JSON.parse(record.Character).name}" data-type="character">${JSON.parse(record.Character).name}</button></div>
            <div><b>partner</b><span>${formattedPartners.join(', ')}</span></div>
            <div><b>ship</b><button onClick="updateFilterFromRecord(this)" data-value="${record.Ship}" data-type="ship">${record.Ship}</button></div>
        </div>
        <div class="record--title">
            <div><b>${record.Words}</b><span>Words</span></div>
            ${record.threadData ? `<span><a href="${siteURL}?showtopic=${record.Thread}">${record.threadData.Title}</a></span>` : ''}
        </div>
    </div>`;
}
function updateFilterFromRecord(e) {
    document.querySelector(`button[data-${e.dataset.type}="${e.dataset.value}"]`).click();
}