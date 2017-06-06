$(function(argument) {
    $('#search-box-container').bindSearch({
        placeHolder: 'Search...', // Place holder for search box.
        searchHandler: null, // Pass method name to be called on search.
        searchButtonTitle: 'Search',
        GlobalSearch: 'Select search option', // Sets the search button text.
        tabs: [{
            tabName: 'Everything',
            resultSources: [{
                name: 'Local SharePoint Results',
                suggestionsTitle: 'Everything',
                linkName: 'Everything',
                type: 'SPSite',
                criteria: "Every",
                selectedProperties: 'Title',
                template: '',
                queryString: "https://share.novartis.net/search" +
                    "/_api/search/suggest?querytext='{0}'" +
                    "&fHitHighlighting=false&ShowPeopleNameSuggestions=false&EnableQueryRules=false" +
                    "&fprefixmatchallterms=true&inumberofquerysuggestions={1}&SourceId='c83750af-288d-4dc4-aa57-9b076c4e5d54'",
                searchSiteUrl: 'https://share.novartis.net/search/pages/results.aspx?' +
                    'src=' + _spPageContextInfo.siteAbsoluteUrl + '&k=',
                resultCount: 3,
                resultVar: 'd.suggest.Queries.results',
                resultObj: 'Query',

            }, {
                name: 'Local People Results',
                suggestionsTitle: 'People',
                linkName: 'People',
                type: 'SPSite',
                criteria: "people",
                selectedProperties: 'Title',
                template: '',
                queryString: "https://share.novartis.net/search" +
                    "/_api/search/query?properties='SourceName:Local People Results,SourceLevel:SPSite'" +
                    "&rowlimit={1}&selectproperties='Title'&querytemplate='Title:*{0}*'",
                searchSiteUrl: 'https://share.novartis.net/search/Pages/peopleresults.aspx?k=',
                resultVar: 'd.query.PrimaryQueryResult.RelevantResults.Table.Rows.results',
                resultObj: 'Cells.results',
                resultCount: 3
            }],
            default: true
        }, {
            tabName: 'People',
            resultSources: [{
                name: 'Local People Results',
                suggestionsTitle: 'People',
                linkName: 'People',
                type: 'SPSite',
                criteria: "Every",
                selectedProperties: 'Title',
                template: '',
                queryString: "https://share.novartis.net/search" +
                    "/_api/search/query?properties='SourceName:Local People Results,SourceLevel:SPSite'" +
                    "&rowlimit={1}&selectproperties='Title'&querytemplate='Title:*{0}*'",
                searchSiteUrl: 'https://share.novartis.net/search/Pages/peopleresults.aspx?k=',
                resultVar: 'd.query.PrimaryQueryResult.RelevantResults.Table.Rows.results',
                resultObj: 'Cells.results',
                resultCount: 6
            }]
        }],
    });
});
