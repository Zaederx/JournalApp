/** Form for submitting entries and entry updates */
const form:HTMLFormElement|null = document.querySelector('#entry-form');
/** #entry-view */
const eView:HTMLDivElement|null = document.querySelector(entryViewId);
/** #new-entry-view */
const neView:HTMLDivElement|null = document.querySelector(newEntryViewId);
/** #new-tag-view */
const ntView:HTMLDivElement|null = document.querySelector(newTagViewId);

/* Entry and NewEntry Views 
Note for display functions - //attribute hidden does not take a boolean argument, but is itself either present or not present. Thats why : View.setAttribute('hidden',''); sets the view as 
*/

/**
 * Displays the entry view.
 * Also hides other views at the smae time.
 */
function displayEView() {
    console.log('*** displayEView ***')
    //display #entry-view
    if (eView != null) eView.removeAttribute('hidden');
    else console.error('view.ts: var eView = null');

    //hide #new-entry-view
    if (neView != null) neView.setAttribute('hidden','');//from create.js
    else console.error('view.ts: var neView = null');
    neView ? neView.style.display = '' : console.log('neView error')
    
    //hide #new-tag-view
    if (ntView != null) ntView.setAttribute('hidden','');
    else console.error('view.ts: const ntView = null');
    ntView ? ntView.style.display = '' : console.log('neView error')

    //reset form
    if (form != null) form.reset();
    else console.error('view.ts: var form = null');
}

/**
 * Displayed hidden New Entry View html.
 * Hides other visible views at the same time.
 */
function displayNEView() {
    //display #new-entry-view
    if (neView != null) neView.removeAttribute('hidden');
    else console.error('view.ts: const neView = null');
    neView ? neView.style.display = 'grid' : console.log('neView error')
    //hide #entry-view
    if (eView != null) eView.setAttribute('hidden','');
    else console.error('view.ts: const eView = null');

    //hide #new-tag-view
    if (ntView != null) ntView.setAttribute('hidden','');
    else console.error('view.ts: const ntView = null');
    ntView ? ntView.style.display = '' : console.log('ntView error')
    //reset form
    if (form != null) form.reset();
    else console.error('view.ts: const form = null');
    loadTagTable(tagDropTableBody)
}

/** Displays tag view - hide other views */
function displayTagView() {
    //display #new-tag-view
    if (ntView != null) ntView.removeAttribute('hidden');
    else console.error('view.ts: const ntView = null');
    ntView ? ntView.style.display = 'block' : console.log('ntView error')

    //hide #new-entry-view
    if (neView != null) neView.setAttribute('hidden','');
    else console.error('view.ts: const neView = null');
    neView ? neView.style.display = '' : console.log('neView error')
    
    //hide #entry-view
    if (eView != null) eView.setAttribute('hidden','');
    else console.error('view.ts: const eView = null');

    loadTagTable();//fetches tag table tagsnames
}

/** 
 * Used to highlight element as the Active Entry
 * @param entryBtn  entry to be highlighted
 */
function highlightActiveEntry(entryBtn:HTMLDivElement) {
    console.log('highlightActiveEntry')
     //handle css div-button styling
     var lastActive = document.querySelector('.active.entry');
     if(lastActive != null)
        lastActive.className = lastActive.className.replace('active entry', '');
     else console.error('view.ts: var lastActive = null');
     entryBtn.className += 'active entry';
}


/** 
 * Used to highlight element as the Active Tag
 * @param tagBtn  tag to be highlighted
 */
function highlightActiveTag(tagBtn:HTMLDivElement) {
    //handle css div-button styling
    var lastActive = document.querySelector('.active.tag');
    if (lastActive != null)
        lastActive.className = lastActive.className.replace('active tag', '');
    else console.error('view.ts: var lastActive = null');
    tagBtn.className += 'active tag';
}
