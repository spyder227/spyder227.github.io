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
                .insertAdjacentHTML('beforeend', `<a href="@@prefix/characters/${site.ID}.html">${site.Site}</a>`);
            document.querySelector('.subnav[data-menu="threads"] .subnav--inner')
                .insertAdjacentHTML('beforeend', `<a href="@@prefix/characters/${site.ID}.html">${site.Site}</a>`);
        });
    });
}
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
function initPartnerSelect(el, type = 'initial') {
    fetch(`https://opensheet.elk.sh/${sheetID}/Partners`)
    .then((response) => response.json())
    .then((data) => {
        let site = el.closest('form').querySelector('#site').options[el.closest('form').querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
        let partners = data.filter(item => item.Site === site);
        
        el.closest('form').querySelectorAll('select#partner').forEach(select => {
            select.addEventListener('change', e => {
                initShipSelect(e.currentTarget);
            });
            if(select.options.length < 2 || type === 'refresh') {
                select.closest('.row').querySelector('#character').innerHTML = `<option value="">(select)</option>`;
                let html = `<option value="">(select)</option>`;
                partners.forEach(partner => {
                    html += `<option value="${partner.WriterID}">${capitalize(partner.Writer)}</option>`;
                });
                select.innerHTML = html;
            }
        });
    });
}
function initShipSelect(e) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Partners`)
    .then((response) => response.json())
    .then((data) => {
        let html = `<option value="">(select)</option>`;
        let site = e.closest('form').querySelector('#site').options[e.closest('form').querySelector('#site').selectedIndex].innerText.trim().toLowerCase();
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
    let site = e.closest('form').querySelector('#site').options[e.closest('form').querySelector('#site').selectedIndex].value;
    if(site === '') {
        //return `<blockquote>Please select a site first.</blockquote>`;
    }
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
    console.log(sites);

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