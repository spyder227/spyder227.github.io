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
        console.log('no theme');
        document.querySelector('body').classList.add('theme--dark');
        document.querySelector('body').classList.remove('theme--light');
        localStorage.setItem('theme', 'dark');
    }
}
function initMenus() {
    fetch(`https://opensheet.elk.sh/${sheetID}/Sites`)
    .then((response) => response.json())
    .then((data) => {
        data.sort((a, b) => {
            if(a.Site < b.Site) {
                return -1;
            } else if (a.Site > b.Site) {
                return 1;
            } else {
                return 0;
            }
        });

        data.forEach(site => {
            document.querySelector('.subnav[data-menu="sites"] .subnav--inner')
                .insertAdjacentHTML('beforeend', `<a href="${site.URL}" target="_blank">${site.Site}</a>`);
            document.querySelector('.subnav[data-menu="characters"] .subnav--inner')
                .insertAdjacentHTML('beforeend', `<a href="../characters/${site.ID}.html">${site.Site}</a>`);
            document.querySelector('.subnav[data-menu="threads"] .subnav--inner')
                .insertAdjacentHTML('beforeend', `<a href="../threads/${site.ID}.html">${site.Site}</a>`);
        });
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

/***** FORM INITS *****/
function initSiteSelect(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Sites`)
    .then((response) => response.json())
    .then((data) => {
        data.sort((a, b) => {
            if(a.Site < b.Site) {
                return -1;
            } else if (a.Site > b.Site) {
                return 1;
            } else {
                return 0;
            }
        });

        data.forEach(site => {
            el.insertAdjacentHTML('beforeend', `<option value="${site.ID}">${capitalize(site.Site, [' ', '-'])}</option>`)
        });
    });
}
function initPartnerSelect(el, type = 'initial', siteField = '#site') {
    fetch(`https://opensheet.elk.sh/${sheetID}/Partners`)
    .then((response) => response.json())
    .then((data) => {
        let site = el.closest('form').querySelector(siteField).options[el.closest('form').querySelector(siteField).selectedIndex].innerText.trim().toLowerCase();
        let partners = data.filter(item => item.Site === site);
        
        el.closest('form').querySelectorAll('select#partner').forEach(select => {
            if(el.closest('form').dataset.form !== 'edit-partner') {
                select.addEventListener('change', e => {
                    initShipSelect(e.currentTarget, siteField);
                });
            }
            if(select.options.length < 2 || type === 'refresh') {
                if(el.closest('form').dataset.form !== 'edit-partner') {
                    select.closest('.row').querySelector('#character').innerHTML = `<option value="">(select)</option>`;
                }
                let html = `<option value="">(select)</option>`;
                partners.forEach(partner => {
                    html += `<option value="${partner.WriterID}">${capitalize(partner.Writer)}</option>`;
                });
                select.innerHTML = html;
            }
        });
    });
}
function initShipSelect(e, siteField) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Partners`)
    .then((response) => response.json())
    .then((data) => {
        let html = `<option value="">(select)</option>`;
        let site = e.closest('form').querySelector(siteField).options[e.closest('form').querySelector(siteField).selectedIndex].innerText.trim().toLowerCase();
        let partnerId = e.options[e.selectedIndex].value;
        let characterList = JSON.parse(data.filter(el => el.Site === site && el.WriterID === partnerId)[0].Characters);
        let characterSelects = e.closest('.row').querySelectorAll('#character');
        characterList.forEach(character => {
            html += `<option value="${character.id}">${capitalize(character.name)}</option>`;
        });
        characterSelects.forEach(select => {
            select.innerHTML = html;
        });
    });
}
function initTags(el, site) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Tagging`)
    .then((response) => response.json())
    .then((data) => {
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
    }).then(() => {
        initAccordion('.accordion .clip-tags');
    });
}
function initTagSites(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Sites`)
    .then((response) => response.json())
    .then((data) => {
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
    });
}
function initCharacterSelect(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
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
    });
}
function initTagSelect(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Tagging`)
    .then((response) => response.json())
    .then((data) => {
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
function initCharacterSelect(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
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
    });
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
                    initRemoveLinks(el);
                    if(!siteExists) {
                        form.querySelectorAll('.clip-multi-warning').forEach(item => item.innerHTML = `<p>Please select both a character and a site.</p>`);
                    }
                    break;
                case 'changeShip':
                    initChangeShips(el);
                    break;
                case 'removeShip':
                    initRemoveShips(el);
                    break;
                case 'removeTags':
                    initRemoveTags(el);
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
function initRemoveLinks(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
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
    });
}
function initChangeShips(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
        let character = el.closest('form').querySelector('#character');
        let site = el.closest('form').querySelector('#characterSite');
        let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
        let ships = JSON.parse(existing.Ships).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase())[0].characters;
        let html = `<div class="change-ships row">`;
        ships.forEach(ship => {
            html += `<label class="ship">
                <b>${ship.character}, played by ${ship.writer} (${ship.relationship})</b>
                <span><select required id="type" data-character="${ship.character}" data-writer="${ship.writer}">
                    <option value="">(select)</option>
                    <option value="antagonistic">Antagonistic</option>
                    <option value="familial">Familial</option>
                    <option value="found family">Found Family</option>
                    <option value="platonic">Platonic</option>
                    <option value="professional">Professional</option>
                    <option value="romantic">Romantic</option>
                    <option value="other">Other</option>
                </select></span>
            </label>`;
        });
        html += `</div>`;

        el.closest('form').querySelector('.clip-change-ships').innerHTML = html;
    });
}
function initRemoveShips(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
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
    });
}
function initRemoveTags(el) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
        let character = el.closest('form').querySelector('#character');
        let site = el.closest('form').querySelector('#characterSite');
        let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
        let tags = JSON.parse(existing.Tags).filter(item => item.site === site.options[site.selectedIndex].innerText.trim().toLowerCase())[0].tags;
        console.log(tags);
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
    }).then(() => {
        initAccordion('.accordion .remove-tags');
    });
}
function initCharacterSites(character) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
        let existing = data.filter(item => item.Character === character.options[character.selectedIndex].value.trim().toLowerCase())[0];
        let sites = JSON.parse(existing.Sites);
        let html = `<option value="">(select)</option>`;
        sites.forEach(site => {
            html += `<option value="${site.id}">${capitalize(site.site, [' ', '-'])}`;
        });
        character.closest('form').querySelector('#characterSite').innerHTML = html;
    });
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
    if(e.classList.contains('is-open')) {
        document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
        document.querySelector('.backdrop').classList.remove('is-active');
    } else {
        document.querySelector('.backdrop').classList.add('is-active');
        document.querySelectorAll('[data-menu]').forEach(el => el.classList.remove('is-open'));
        document.querySelectorAll(`[data-menu="${menu}"]`).forEach(el => el.classList.add('is-open'));
    }
}
function sendAjax(form, data, successMessage) {
    $(form).trigger('reset');
    
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
function sendAjaxSync(data) {
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        async: false,
        success: function () {
            console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            console.log(`Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`);
        },
        complete: function () {
            console.log('thread complete');
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
        initPartnerSelect(e);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'tag-options') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatTagOptions());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'characters') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatCharacterRow());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'featuring') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatFeatureRow(e));
        initPartnerSelect(e);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'add-ships') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatShipsRow(e));
        initPartnerSelect(e, 'initial', '#characterSite');
    }
}
function removeRow(e) {
    let rows = e.closest('.adjustable').querySelectorAll('.row');
    rows[rows.length - 1].remove();
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
            <span><select required id="character" required>
                <option value="">(select)</option>
            </select></span>
        </label>
        <label class="fullWidth">
            <b>Type</b>
            <span><select required id="type" required>
                <option value="">(select)</option>
                <option value="antagonistic">Antagonistic</option>
                <option value="familial">Familial</option>
                <option value="found family">Found Family</option>
                <option value="platonic">Platonic</option>
                <option value="professional">Professional</option>
                <option value="romantic">Romantic</option>
                <option value="other">Other</option>
            </select></span>
        </label>
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
    if(site === '') {
        //return `<blockquote>Please select a site first.</blockquote>`;
    }
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
function handleTitleChange(currentTitle, site) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Threads`)
    .then((response) => response.json())
    .then((data) => {
        let existing = data.filter(item => item.Title === currentTitle && item.Site === site)[0];
        if(existing) {
            initThreadTags(document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect'), JSON.parse(existing.Tags), true);
            initThreadTags(document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect'), JSON.parse(existing.Tags));
        } else {
            document.querySelector('[data-form="edit-thread"] .tags.addition .multiselect').innerHTML = `<p>This thread/site combination doesn't exist!</p>`;
            document.querySelector('[data-form="edit-thread"] .tags.removal .multiselect').innerHTML = `<p>This thread/site combination doesn't exist!</p>`;
        }
    });
}

/***** FORM SUBMISSIONS *****/
function submitSite(form) {
    let site = form.querySelector('#title').value.trim().toLowerCase();
    let id = form.querySelector('#id').value.trim().toLowerCase();
    let url = form.querySelector('#url').value.trim();
    let directory = form.querySelector('#directory').options[form.querySelector('#directory').selectedIndex].value;
    let status = form.querySelector('#active').checked ? 'active' : 'inactive';

    let data = {
        SubmissionType: 'add-site',
        Site: site,
        ID: id,
        URL: url,
        Directory: directory,
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
            name: name,
            id: id,
        });
    });

    let data = {
        SubmissionType: 'add-partner',
        Site: site,
        WriterID: id,
        Writer: alias,
        Characters: JSON.stringify(characterList),
    };

    sendAjax(form, data, successMessage);
}
function submitCharacter(form) {
    //simple data
    let title = form.querySelector('#title').value.trim().toLowerCase();
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let id = form.querySelector('#id').value.trim();
    let vibes = form.querySelector('#vibes').value.trim().toLowerCase();

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
        shipList.push({
            writer: writer,
            character: character,
            relationship: type,
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

            let data = {
                SubmissionType: 'add-character',
                Character: title,
                Sites: JSON.stringify([sites]),
                Vibes: vibes,
                Links: JSON.stringify(linkList),
                Ships: JSON.stringify([ships]),
                Tags: JSON.stringify([tags]),
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

    //complex fields - tags and featuring
    let tags = Array.from(form.querySelectorAll('.threadTag:checked')).map(item => item.value);
    
    let featuredRows = document.querySelectorAll('.features');
    let featuring = [];
    featuredRows.forEach(row => {
        featuring.push({
            name: row.querySelector('#character').options[row.querySelector('#character').selectedIndex].innerText.trim().toLowerCase(),
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
            name: character.innerText.trim().toLowerCase(),
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

    sendAjax(form, data, successMessage);
}
function updateTags(form) {
    let title = form.querySelector('#title').options[form.querySelector('#title').selectedIndex].value.trim().toLowerCase();
    let newSites = Array.from(form.querySelectorAll('.sites .multiselect input:checked')).map(item => item.value);
    let newTags = Array.from(form.querySelectorAll('.tag-options input')).map(item => item.value.toLowerCase().trim());

    fetch(`https://opensheet.elk.sh/${sheetID}/Tagging`)
    .then((response) => response.json())
    .then((data) => {
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
    });
}
function updatePartner(form) {
    let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
    let partner = form.querySelector('#partner').options[form.querySelector('#partner').selectedIndex].value.trim().toLowerCase();
    let characters = form.querySelectorAll('#charName');
    let characterList = [];

    characters.forEach(character => {
        let name = character.value.trim().toLowerCase();
        let id = character.closest('.row').querySelector('#charId').value.trim();
        characterList.push({
            name: name,
            id: id,
        });
    });

    fetch(`https://opensheet.elk.sh/${sheetID}/Partners`)
    .then((response) => response.json())
    .then((data) => {
        let existing = data.filter(item => item.Site === site && item.WriterID === partner)[0];
        if(characterList.length > 0) {
            let combined = [...JSON.parse(existing.Characters), ...characterList];
            existing.Characters = JSON.stringify(combined);
        }
        existing.SubmissionType = 'edit-partner';
        sendAjax(form, existing, successMessage);
    });
}
function updateCharacter(form) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Characters`)
    .then((response) => response.json())
    .then((data) => {
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

        //add ships
        if(selected.includes('addShip')) {
            let relationships = form.querySelectorAll('.ships #partner');
            let shipList = [];
            relationships.forEach(ship => {
                let writer = ship.options[ship.selectedIndex].innerText.trim().toLowerCase();
                let character = ship.closest('.row').querySelector('#character').options[ship.closest('.row').querySelector('#character').selectedIndex].innerText.trim().toLowerCase();
                let type = ship.closest('.row').querySelector('#type').options[ship.closest('.row').querySelector('#type').selectedIndex].innerText.trim().toLowerCase();
                shipList.push({
                    writer: writer,
                    character: character,
                    relationship: type,
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
            for(instance in existingTags) {
                if(existingTags[instance].site === site) {
                    console.log(existingTags[instance].tags);
                    for(set in existingTags[instance].tags) {
                        for(newSet in tagArray) {
                            if(existingTags[instance].tags[set].type === tagArray[newSet].type) {
                                if(replacingTags.includes(tagArray[newSet].type)) {
                                    existingTags[instance].tags[set].tags = tagArray[newSet].tags;
                                } else {
                                    existingTags[instance].tags[set].tags = [...existingTags[instance].tags[set].tags, ...tagArray[newSet].tags];
                                }
                            }
                        }
                    }
                }
            }

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
    });
}
function updateThread(form) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Threads`)
    .then((response) => response.json())
    .then((data) => {
        let currentTitle = form.querySelector('#title').value.trim().toLowerCase();
        let site = form.querySelector('#site').options[form.querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
        let existing = data.filter(item => item.Title === currentTitle && item.Site === site)[0];
        let selected = Array.from(form.querySelectorAll('.updates input:checked')).map(item => item.value);
        console.log('existing:');
        console.log(existing);
        console.log('working:');

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
    });
}

/***** TRANSFER ONLY *****/
function portThreads() {
    fetch(`https://opensheet.elk.sh/${oldSheetID}/Threads`)
    .then((response) => response.json())
    .then((data) => {
        let newData = data.map(item => {
            let siteID;
            switch(item.Site.toLowerCase().trim()) {
                case `godly behaviour`:
                    siteID = `gb`;
                    break;
                case `turn on the light`:
                    siteID = `totl`;
                    break;
                case `where the hell is`:
                    siteID = `wthi`;
                    break;
                default:
                    siteID = item.Site.trim().toLowerCase();
                    break;
            }
            let newFeatured = [];
            let oldFeatured = item.Featuring.split('+').map(item => JSON.parse(item)).map(item => ({name: item.character, id: item.id}));
            let oldPartners = item.Partner.split('+').map(item => JSON.parse(item)).map(item => ({writer: item.partner, writerId: item.id}));
            oldFeatured.forEach((item, i) => {
                newFeatured.push({...item, ...oldPartners[i]});
            });
            
            return ({
                SubmissionType: 'add-thread',
                Site: item.Site.trim().toLowerCase(),
                SiteID: siteID,
                Status: item.Status.trim().toLowerCase() === 'start' ? 'planned' : item.Status.trim().toLowerCase(),
                Title: item.Title.trim().toLowerCase(),
                Character: JSON.stringify({
                    name: item.Character.split('#')[0].trim().toLowerCase(),
                    id: item.Character.split('#')[1].trim(),
                }),
                Featuring: JSON.stringify(newFeatured),
                ThreadID: item.ThreadID.trim(),
                Type: item.Type.trim().toLowerCase(),
                Description: item.Snippet ? item.Snippet.trim() : '',
                Tags: item.Tags ? JSON.stringify(item.Tags.split(' ')) : '',
                ICDate: item.ICDate,
                LastUpdated: item.LastUpdated,
            });
        });

        newData.forEach(item => {
            sendAjaxSync(item);
        });

    }).then(() => {
	    console.log('All threads completed!');
    });
}

/***** THREAD TRACKING FUNCTIONS *****/
function openFilters(e) {
    e.closest('.threads--filter').classList.toggle('is-active');
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
    qsRegex = document.querySelector(typeSearch).value;
    elements = document.querySelectorAll(gridItem);
    
    //add show class to all items to reset
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
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
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
    if(hideUnless && hideUnless.classList.contains('is-checked')) {
        filter = filter.join(', ');
    } else {
        filter = filter.map(item => `${item}${defaultShow}`);
        if(filter.length === 0) {
            filter = [defaultShow];
        }
        filter = filter.join(', ');
    }
    
    //render isotope
    $container.isotope({
        filter: filter
    });
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
    document.querySelector(typeSearch).addEventListener('keyup', e => {
        setCustomFilter();
    });

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
function prepThreads(data, site = null) {
    let threads = site ? data.filter(item => item.Site.trim().toLowerCase() === site && item.Status.trim().toLowerCase() !== 'archived') : data.filter(item => item.Status.trim().toLowerCase() !== 'archived');
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
            description: array[i].description,
            featuring: JSON.parse(array[i].Featuring),
            date: array[i].ICDate,
            updated: array[i].LastUpdated,
            status: array[i].Status,
            tags: array[i].Tags,
            id: array[i].ThreadID,
            title: array[i].Title,
            type: array[i].Type,
            site: siteObject[0],
        }
        html += formatThread(thread);
    }
    document.querySelector('#threads--rows').insertAdjacentHTML('beforeend', html);

    //sort appendable filters
    characters.sort();
    partners.sort();
    featuring.sort();

    //Append filters
    characters.forEach(character => {
        document.querySelector('.filter--characters').insertAdjacentHTML('beforeend', `<label><span><input type="checkbox" value=".${character.split(' ')[0].toLowerCase()}"/></span><b>${character.split(' ')[0].toLowerCase()} ${character.split(' ')[1][0].toLowerCase()}.</b></label>`);
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
function sendThreadAjax(data, thread, form = null, complete = null) {
    console.log('send ajax');
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
                thread.classList.remove('status--mine');
                thread.classList.remove('status--start');
                thread.classList.remove('status--theirs');
                thread.classList.remove('status--expecting');
                thread.classList.add('status--complete');
                thread.querySelectorAll('button').forEach(button => button.classList.remove('is-updating'));
            } else if(data.Status === 'theirs') {
                thread.classList.remove('status--mine');
                thread.classList.remove('status--start');
                thread.classList.add('status--theirs');
                thread.querySelector('[data-status]').classList.remove('is-updating');
            } else if(data.Status === 'mine') {
                thread.classList.remove('status--theirs');
                thread.classList.remove('status--expecting');
                thread.classList.add('status--mine');
                thread.querySelector('[data-status]').classList.remove('is-updating');
            }
        }
    });
}
function changeStatus(e) {
    if(e.dataset.status === 'mine' || e.dataset.status === 'planned') {
        e.dataset.status = 'theirs';
        let thread = e.parentNode.parentNode.parentNode;
        e.classList.add('is-updating');
        sendThreadAjax({
            SubmissionType: 'thread-status',
            ThreadID: e.dataset.id,
            Site: e.dataset.site,
            Character: e.dataset.character,
            Status: 'theirs'
        }, thread, threadDeploy);
    } else if(e.dataset.status === 'theirs') {
        e.dataset.status = 'mine';
        let thread = e.parentNode.parentNode.parentNode;
        e.classList.add('is-updating');
        sendThreadAjax({
            SubmissionType: 'thread-status',
            ThreadID: e.dataset.id,
            Site: e.dataset.site,
            Character: e.dataset.character,
            Status: 'mine'
        }, thread);
    }
}
function markComplete(e) {
    e.dataset.status = 'complete';
    let thread = e.parentNode.parentNode.parentNode;
    e.classList.add('is-updating');
    sendThreadAjax({
        SubmissionType: 'thread-status',
        ThreadID: e.dataset.id,
        Site: e.dataset.site,
        Character: e.dataset.character,
        Status: 'complete'
    }, thread, null, 'complete');
}
function markArchived(e) {
    e.dataset.status = 'archived';
    let thread = e.parentNode.parentNode.parentNode;
    e.classList.add('is-updating');
    sendThreadAjax({
        SubmissionType: 'edit-thread',
        ThreadID: e.dataset.id,
        Site: e.dataset.site,
        Character: e.dataset.character,
        Status: 'archived'
    }, thread, null, 'archived');
}
function formatThread(thread) {
    console.log(thread);
    let partnerClasses = ``, featuringClasses = ``;
    thread.featuring.forEach((featured, i) => {
        if(i > 0) {
            partnerClasses += ` `;
            featuringClasses += ` `;
        }
        partnerClasses += `partner--${featured.writer}`;
        featuringClasses += `featured--${featured.name.split(' ')[0]}-${featured.name.split(' ')[1][0]}`;
    });
    let extraTags = thread.tags !== '' ? JSON.parse(thread.tags).join(' ') : '';

    let buttons = ``;
    if (thread.status !== 'complete' && thread.status !== 'archived') {
        buttons = `<div class="icon" title="${thread.type}"></div><button onClick="changeStatus(this)" data-status="${thread.status}" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}' title="Change Turn"><i class="fa-regular fa-arrow-right-arrow-left"></i><i class="fa-solid fa-spinner fa-spin"></i></button>
        <button onClick="markComplete(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}' title="Mark Complete"><i class="fa-regular fa-badge-check"></i><i class="fa-solid fa-spinner fa-spin"></i></button>
        <button onClick="markArchived(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}' title="Archive"><i class="fa-regular fa-trash"></i><i class="fa-solid fa-spinner fa-spin"></i></button>`;
    } else if (thread.status !== 'archived') {
        buttons = `<div class="icon" title="${thread.type}"></div><button onClick="markArchived(this)" data-id="${thread.id}" data-site="${thread.site.Site}" data-character='${JSON.stringify(thread.character)}' title="Archive"><i class="fa-regular fa-trash"></i><i class="fa-solid fa-spinner fa-spin"></i></button>`;
    } else {
        buttons = `<div class="icon" title="${thread.type}"></div>`;
    }

    return `<div class="thread lux-track grid-item grid-item ${thread.character.name.split(' ')[0]} ${partnerClasses} ${featuringClasses} status--${thread.status} type--${thread.type} delay--${getDelay(thread.update)} ${extraTags}">
        <div class="thread--wrap">
            <div class="thread--main">
                <a href="${thread.site.URL}/?showtopic=${thread.id}&view=getnewpost" target="_blank" class="thread--title">${thread.title}</a>
                <div class="thread--info">
                    <span>Writing as <a class="thread--character" href="${thread.site.URL}/?showuser=${thread.character.id}">${thread.character.name}</a></span>
                    <span class="thread--feature">ft. </span>
                    <span class="thread--partners">Writing with </span>
                </div>
                <div class="thread--info">
                    <span class="thread--ic-date">Set <span>${thread.icDate}</span></span>
                    <span class="thread--last-post">Last Active <span>${thread.updated}</span></span>
                </div>
                ${thread.description && thread.description !== '' ? `<div class="thread--info"><p>${thread.description}</p></div>` : ''}
            </div>
            <div class="thread--buttons">${buttons}</div>
        </div>
    </div>`;
}