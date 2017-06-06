/*
FileName    :   SearchComponent.js
Author      :   Cognizant Technology Solutions
Description :   This library contains the implementation logic for Search Component.
*/

/* jshint strict: true */
/* globals NP, ExecuteOrDelayUntilScriptLoaded, AjaxControlToolkit, $, 
   sp, _spPageContextInfo, Srch, console, nexGen, window, SP*, document/



/* Search component namespace. */
var SN = {};
$(document).ready(function() {
    $("#search-box").keyup(function() {
        if ($("#search-box").val().length > 0) {

            $('#divCross').addClass("search-close-bold");
        } else {
            $('#divCross').removeClass("search-close-bold");
        }
    });
    $(".searchfn").click(function() {


        $(".search-wrapper").addClass('is-opened');
        $("#search-box").focus();


    });

    /**
     * For Close of search box on click of X button.
     */
    $("#divCross").click(function() {
        $('#divCross').removeClass("search-close-bold");
        $(".search-wrapper").hide();
        $(".searchfn").show();

    });

});

SN.Constants = (function() {
    var GLOBAL = 'global';
    return {
        GLOBAL: GLOBAL
    };
})();
/**
 * Helper methods required in search component.
 */
SN.Services = (function() {
    /** 
     * Logs message to console.
     * @param  {string} message - message to be logged.
     */
    function clientLog(message) {
        if (typeof console === "undefined" || typeof message === "undefined") {
            return;
        }
        console.log(message);
    }

    SN.Constant = {
        GTM_SEARCH_EVENT_SUGGESTIONS: "SUGGESTIONS",
        GTM_SEARCH_EVENT_CLICK: "CLICK",
        GTM_SEARCH_EVENT__KEYPRESS: "KEYPRESS",
    }


    /**
     * Display Search Box on click of search icon
     */

    /**
     * Send ajax request.
     * @param  {objext} argObject - object containing request params.
     * @return {object} request object.
     */
    function ajaxRequest(argObject) {

        var request, url = argObject.url;

        if (argObject.isDataInUrl) {
            if (argObject.data) {
                url += "?" + argObject.data;
            } else {
                argObject.data = argObject.data || null;
            }
        } else {
            argObject.data = argObject.data || null;
        }

        request = $.ajax({
            headers: argObject.headers,
            type: argObject.type,
            url: argObject.url,

            data: argObject.isDataInUrl ? null : argObject.data
        });

        request.fail(function(jqXHR, textStatus, errorThrown) {

                //  SN.Services.ClientLog('Rest(AjaxRequest): ', textStatus, ' Error: ', errorThrown, 'message: ', 

                jqXHR.responseJSON);
        });

    return request;
}

/*
 * Simulates .NET framework's string.Format method to format a string with one or more replaceable tokens.
 * @param {object} arguments - A default array of arguments with the first argument being the tokenized string.
 * @returns {string} - Formatted value.
 */
function formatString() {
    var paramStr = arguments[0] || "",
        re = null,
        counter,
        argLength = arguments.length - 1;

    for (counter = 0; counter < argLength; counter++) {
        re = new RegExp("\\{" + counter + "\\}", "igm");
        paramStr = paramStr.replace(re, arguments[counter + 1]);
    }

    return paramStr;
}

var accent_map = {
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'a',
    'å': 'a', // a
    'ç': 'c', // c
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e', // e
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i', // i
    'ñ': 'n', // n
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'o',
    'ø': 'o', // o
    'ß': 's', // s
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'u', // u
    'ÿ': 'y' // y
};

function accentFold(s) {
    if (!s) {
        return '';
    }
    var ret = '';
    for (var i = 0; i < s.length; i++) {
        ret += accent_map[s.charAt(i)] || s.charAt(i);
    }
    return ret;
}

return {
    ClientLog: clientLog,
    AjaxRequest: ajaxRequest,
    FormatString: formatString,
    AccentFold: accentFold
};
})();


/**
 * Global variables can be declared in this object.
 */
SN.Global = {};

/**
 * Contains methods required for search component.
 */
SN.SEARCHCOMPONENT = function() {
    var searchBox,
        timeoutId = 0;


    /**
     * Entry point for search component.
     */
    function init(settings) {

        SN.Global.Settings = settings;
        searchBox = $('#search-box');
        bindTemplate();
        bindSearchBoxEvents();
    }



    /**
     * Binds html template.
     */
    function bindTemplate() {
        var optionsHtml = '',
            pannelHtml = '',
            linkId;

        $.each(SN.Global.Settings.tabs, function(index, tab) {
            linkId = tab && 'search-' + tab.tabName.toLowerCase().trim();

            optionsHtml += tab.default ?
                '<li class="is-opened"><a href="#' + linkId + '"><span>' + tab.tabName + '</span></a></li>' :
                '<li class=""><a href="#' + linkId + '"><span>' + tab.tabName + '</span></a></li>';
            pannelHtml += '<ul id="' + linkId + '"></ul>';
        });
        $('.globalText').text(SN.Global.Settings.GlobalSearch);
        $('.search-options ul').html(optionsHtml);
        $('.search-results').html(pannelHtml);
        $('.search-field input').attr("placeholder", SN.Global.Settings.placeHolder);
        $('.search-open').text(SN.Global.Settings.searchButtonTitle);
    }

    /**
     * Binds search box events.
     */
    function bindSearchBoxEvents() {
        var trigger, searchType, searchBoxValueFromSuggestions;
        bindSearchWidgetEvents();

        $('.search-close').click(function() {

            resetSearchBox();
        });

        $('.search-options a').click(function() {

            var type = (type = $(this).attr('href')) ? type.trim().toLowerCase() : '',
                input = searchBox.val();
            input = input ? input.trim() : '';
            $('.search-results ul').html('');
            if (input !== '') {
                bindSearchSuggestions(type);
            } else {
                $('.search-results ul').html('');
            }
        });
        bindSearchBoxKeyupEvents();
        bindSearchSuggestionEvents();
        $(function() {
            $("form").submit(function() {
                return false;
            });
        });
    }

    function getSearchType() {
        var highlightedSection = $('.search-results .highlight').parents('ul').attr('id'),
            selectedSection = $(".search-options .is-opened a").attr('href');

        highlightedSection = highlightedSection ?
            highlightedSection.split('-')[1] :
            (selectedSection ? selectedSection.split('-')[1] :

                SN.Constants.GLOBAL);

        return highlightedSection;
    }

    function bindSearchWidgetEvents() {

        $(".search_parent").on("click", ".Search_icon", function(t) {
            t.preventDefault();
            $(this).next().addClass("is-opened");
            $('#search-box').focus();
        });

        $(".search-widget").on("click", ".js-close-search", function(t) {
            t.preventDefault();
            $(this).closest(".search-wrapper").removeClass("is-opened");
        });


        $('.search-options a').click(function() {
            $('#search-box').focus();
        });




        /*$(document).click(function(e) {
            if ($(e.target).is('.searchfn span,.searchfn a') || $(e.target).is('.search-wrapper,.search-wrapper *')) {
                return;
            } else {
                resetSearchBox();
                if($(e.target).attr("onclick")) {
                    eval($(e.target).attr("onclick"));
                }
            }
        });
*/
        $(".search-options").on("click", "a", function(t) {
            t.preventDefault();
            // e(this).closest("li").toggleClass("is-opened"), e(this).closest("li").siblings(".is-opened").removeClass

            ("is-opened");
            var pannelId = $(this).attr("href");
            $(this).closest("li").addClass("is-opened").siblings(".is-opened").removeClass("is-opened");
            $(pannelId).addClass("is-opened").siblings(".is-opened").removeClass("is-opened");
            if ($(pannelId).html() === '') {
                $(pannelId).removeClass("is-opened");
            }
        });
    }
    /**
     * Binds search box key up events.
     */


    function bindSearchBoxKeyupEvents() {
        searchBox.keyup(function(e) {
            var highlightedLink = $('.search-results .is-opened li span.highlight'),
                url, trigger, searchType, linkURL,
                searchWindow, searchBoxValueFromSuggestions,
                suggestionLinkSpanSelector = $('.search-results span'),
                suggestionOpenSpansSelector = $('.search-results .is-opened li span');

            if (e.keyCode == 13) {
                /*Search changes*/
                searchBoxValueFromSuggestions = highlightedLink.text();
                trigger = (searchBoxValueFromSuggestions === searchBox.val()) ? SN.Constant.GTM_SEARCH_EVENT_SUGGESTIONS :

                    SN.Constant.GTM_SEARCH_EVENT__KEYPRESS;
                searchType = $(".search-options .is-opened a").attr('href').split('-')[1];
                linkURL = $('.search-results .is-opened li span.highlight').closest('ul').attr('id');
                search(searchBox.val(), trigger, searchType, linkURL);

            }
            /*Search changes*/
            if (e.keyCode == '40') {
                if (highlightedLink.length === 1 && highlightedLink.parents('li').next().length > 0) {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    highlightedLink.parents('li').next().find('span').addClass('highlight');
                } else if (highlightedLink.length === 1 && highlightedLink.parents('ul').next('ul.is-opened').length ===

                    1) {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    highlightedLink.parents('ul').next('ul.is-opened').find('span').first().addClass('highlight');
                } else {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    suggestionOpenSpansSelector.first().addClass('highlight');
                }
            } else if (e.keyCode == '38') {
                if (highlightedLink.length === 1 && highlightedLink.parents('li').prev('li').length > 0) {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    highlightedLink.parents('li').prev().find('span').addClass('highlight');
                } else if (highlightedLink.length === 1 && highlightedLink.parents('ul').prev('ul.is-opened').length ===

                    1) {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    highlightedLink.parents('ul').prev('ul.is-opened').find('span').last().addClass('highlight');
                } else {
                    suggestionLinkSpanSelector.removeClass('highlight');
                    suggestionOpenSpansSelector.last().addClass('highlight');
                }
            } else {
                if (searchBox.val().length < SN.Global.Settings.suggestionsMinChar) {
                    $('.search-results ul').html('').removeClass('is-opened');
                } else {
                    clearTimeout(timeoutId); // doesn't matter if it's 0
                    timeoutId = setTimeout(bindSearchSuggestions, 200);
                }
            }
            if (e.keyCode == '40' || e.keyCode == '38') {
                highlightedLink = $('.search-results .is-opened li span.highlight');
                if (highlightedLink.length === 1) {
                    searchBox.val(highlightedLink.text());
                }
            }
        });
    }

    $("#searchImg").click(function() {

        if (searchBox.val().length > 0) {
            var searchBoxValueFromSuggestions, linkURL,
                trigger = (searchBoxValueFromSuggestions === searchBox.val()) ?

                SN.Constant.GTM_SEARCH_EVENT_SUGGESTIONS : SN.Constant.GTM_SEARCH_EVENT__KEYPRESS;
            searchType = $(".search-options .is-opened a").attr('href').split('-')[1];
            $(".search-wrapper").hide();
            $(".searchfn").show();
            linkURL = $('.search-results .is-opened li span.highlight').closest('ul').attr('id');
            search(searchBox.val(), trigger, searchType, linkURL);


        }

    });

    /**
     * Search function to search for keyword.
     */
    function search(input, trigger, searchType, parentUL) {

        if (input.length === 0 || input.toLowerCase() === SN.Global.Settings.placeHolder.toLowerCase()) {
            return false;
        }
        var url, searchWindow;
        if (SN.Global.Settings.searchHandler) {
            resetSearchBox();
            SN.Global.Settings.searchHandler(input, trigger, searchType);
        } else {
            $('#search-box').blur();
            url = getSearchUrl(parentUL) + encodeURI(input);
            searchWindow = window.open(url, '_blank');
            searchWindow.focus();
            resetSearchBox();
        }
    }
    /**
     * Bind search suggestions events.
     */
    function bindSearchSuggestionEvents() {
        var highlightedLink, trigger, searchType, parentUL;
        $('.search-results').on('mouseenter', 'li', function() {
            $('.search-results span').removeClass('highlight');
            $(this).find('span').addClass('highlight');
        });

        $('.search-results').on('mouseleave', 'li', function() {
            $(this).find('span').removeClass('highlight');
        });
        $(".search-results").on('click', '.is-opened li a', function(event) {
            trigger = SN.Constant.GTM_SEARCH_EVENT_SUGGESTIONS;
            searchType = getSearchType();
            highlightedLink = $('.search-results .is-opened li span.highlight');
            parentUL = $('.search-results .is-opened li span.highlight').closest('ul').attr('id');

            if (highlightedLink.length === 1) {
                searchBox.val(highlightedLink.text());
                $(".search-wrapper").hide();
                $(".searchfn").show();
                search(searchBox.val(), trigger, searchType, parentUL);

            }
        });
    }
    /**
     * Resets search box default state.
     * @return {[type]} [description]
     */
    function resetSearchBox() {

        $('.search-results ul').html('').removeClass('is-opened');
        searchBox.val('');
        // $("#flyoutDiv").show();
        $.each(SN.Global.Settings.tabs, function(index, tab) {
            if (tab.default) {
                $('.search-options a[href="#search-' + tab.tabName.toLowerCase().trim() + '"]')
                    .closest('li').addClass('is-opened').siblings(".is-opened").removeClass("is-opened");
                return false;
            }
        });
        $('.search-results ul').html('');
        $('#search-box').blur();
        $('.search-wrapper').removeClass('is-opened');
        $('#divCross').removeClass("search-close-bold");

    }
    /**
     * Gets search url.
     */
    function getSearchUrl(parentUL) {
        var searchType = $('.search-options .is-opened a').attr('href').trim().toLowerCase();
        searchType = searchType.split("#")[1];
        url = '';
        $.each(SN.Global.Settings.tabs, function(index, tab) {
            if (searchType.indexOf(tab.tabName.toLowerCase()) > -1) {
                if (typeof parentUL === "undefined") {
                    url = tab.resultSources[0].searchSiteUrl;
                } else {
                    if (searchType == parentUL) {
                        url = tab.resultSources[0].searchSiteUrl;
                    } else {

                        url = tab.resultSources[1].searchSiteUrl;
                    }
                }
                return false;
            }

        });
        return url;
    }

    function bindSearchSuggestions(type) {
        var inputBoxValue = $('#search-box').val(),
            openedLink = type || $('.search-options .is-opened a').attr('href').trim().toLowerCase();

        if (inputBoxValue === '') {
            $('.search-results ul').html('');
            return;
        }
        getSearchSuggestions(openedLink).then(function() {
            $.each(SN.Global.Settings.tabs, function(index, tab) {
                if (openedLink.indexOf(tab.tabName.toLowerCase()) > -1) {
                    $.each(tab.resultSources, function(index, resultSource) {
                        bindSearchOnSuccess(tab.tabName.toLowerCase(), inputBoxValue);
                    });
                }
            });
        });
    }
    /**
     * Gets search suggestions
     */
    function getSearchSuggestions(type) {
        var val,
            inputBoxValue = (val = $('#search-box').val()) ? val.toLowerCase() : '',
            deferred = $.Deferred(),
            query, queryResults = [],
            openedLink = type || $('.search-options .is-opened a').attr('href').trim().toLowerCase(); //#search-everything

        $.each(SN.Global.Settings.tabs, function(index, tab) {
            if (openedLink.indexOf(tab.tabName.toLowerCase()) > -1) {
                $.each(tab.resultSources, function(index, resultSource) {
                    /*Search changes for displaying both sections under everything tab*/
                    query = SN.Services.FormatString(resultSource.queryString, inputBoxValue, resultSource.resultCount);

                    requestSuggestions(query).then(function(data) {
                        resultSource.queryResults = safeGetValue(data, resultSource.resultVar);
                        if (index === tab.resultSources.length - 1) {
                            deferred.resolve();
                        }
                    }).fail(function(err) {
                        //Error fetching search suggestions.

                    });


                });
            }
        });

        return deferred.promise();
    }

    function safeGetValue(data, varString) {
        try {
            var prop;
            props = varString.split('.')
            $.each(props, function(index, prop) {
                data = data[prop]
            });
            return data;
        } catch (e) {
            return null;
        }
    }

    /**
     * Configure request for suggestion.
     * @param  {string} finalQuery - Query.
     */
    function requestSuggestions(finalQuery) {

        var options = {
            type: "GET",
            url: finalQuery,

            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            requestType: "AjaxRequest"
        };


        return SN.Services.AjaxRequest(options);
    }
    /**
     * Gest title suggestions.
     * @param  {array} resultCollection - array for suggestions.
     * @param  {string} resultKey - propery to be used for suggestions.
     * @param  {arrray} searchSuggestionList - searchSuggestionList.
     * @param  {string} prefixText - prefixText.
     * @param  {string} sortOrder - sortOrder.         
     */
    function getTitleSuggestions(resultCollection, resultKey, searchSuggestionList, prefixText, sortOrder) {
        var prefixHTML,
            counter = 0,
            title,
            prefixIndex,
            accentFoldedTitle;

        if (typeof resultCollection !== "string") {
            title = $.Enumerable.From(resultCollection).Where(function(record) {
                return (record.Key === resultKey);
            }).Select(function(record) {
                return record.Value;
            }).FirstOrDefault();
        } else {
            title = resultCollection;
        }
        prefixText = prefixText ? prefixText.toLowerCase() : '';
        accentFoldedTitle = SN.Services.AccentFold(title) || '';
        prefixIndex = accentFoldedTitle ? accentFoldedTitle.toLowerCase().indexOf(prefixText) : -1;

        if (prefixIndex !== -1) {
            prefixHTML = title.substr(0, prefixIndex) + "<b>" + title.substr(prefixIndex, prefixText.length) + "</b>" +

                title.substr(prefixIndex + prefixText.length);
            searchSuggestionList.push({
                Key: resultKey,
                Value: prefixHTML,
                SortOrder: sortOrder,
                LocationIndex: 0
            });
        }
    }
    /**
     * Bind search suggestions.
     */
    function bindSearchOnSuccess(openedTab, prefixText) {

        $($('.search-options .is-opened a').attr('href')).addClass('is-opened');
        $.each(SN.Global.Settings.tabs, function(index, tab) {
            if (tab.tabName.toLowerCase() === openedTab) {

                $.each(tab.resultSources, function(index, resultSource) {
                    var searchCounter, currentRecordList, searchSuggestionList = [],
                        data, linkId,
                        results = resultSource.queryResults || [],
                        searchSuggestionCount = resultSource.resultCount,
                        preText = prefixText,
                        suggestionLinksHtml;

                    $.each(results, function(index, result) {
                        currentRecordList = safeGetValue(result, resultSource.resultObj);
                        getTitleSuggestions(currentRecordList, 'Title', searchSuggestionList, preText, 1);
                    });

                    searchSuggestionList = $.Enumerable.From(searchSuggestionList).OrderBy(function(record) {
                        return (record.SortOrder);
                    }).OrderBy(function(record) {
                        return (record.LocationIndex);
                    }).Select(function(record) {
                        return record.Value.trim();
                    }).Distinct(function(record) {
                        return record;
                    }).Take(searchSuggestionCount).ToArray();

                    linkId = resultSource.linkName ? 'search-' + resultSource.linkName.toLowerCase() : '';
                    suggestionLinksHtml = getSuggestionHtml(searchSuggestionList, resultSource.suggestionsTitle);

                    $('#' + linkId).html(suggestionLinksHtml);

                    if ($('.search-options .is-opened').length === 0 && tab.default) {
                        $('.search-options[href="' + linkId + '"]').closest('li').addClass('is-opened');
                        $('#' + linkId).addClass('is-opened');
                    }

                    if (tab.default) {
                        $('#' + linkId).addClass('is-opened');
                    }

                    if (suggestionLinksHtml.length === 0) {
                        $('#' + linkId).removeClass('is-opened');
                    }
                    /*To display both Everything and People sections under Everything tab*/
                    if (tab.default && suggestionLinksHtml.length !== 0) {
                        $('#' + linkId).next('ul').addClass('is-opened');
                    }
                });
            }
        });

    }

    /**
     * Builds suggestions html.
     * @param  {array} suggestions - array of suggestions.
     * @param  {string} suggestionsTitle - title to be used for suggestions list.
     */
    function getSuggestionHtml(suggestions, suggestionsTitle) {

        var html = '';
        if (suggestions.length > 0) {
            html += '<div class="searchsuggestion">' + suggestionsTitle + '</div>';
            $.each(suggestions, function(index, suggestion) {
                html += '<li><a href="#"><span>' + suggestion + '</span></a></li>';
            });
        }
        return html;
    }
    /*
     * Returns the search suggestion count.
     * @returns {Integer} - searchSuggestionsCount - returns search suggestion count value.
     */
    function getSearchSuggestionCount() {
        var searchSuggestionsCount = 6;
        return searchSuggestionsCount;
    }

    return {
        Init: init
    };
};
//if we don't specify the setting this settings will be considered.
(function() {
    // Query string should contain only 2 place holders {0} input box value, {1} result count.
    function bindSearch(options) {
        var searchComp = new SN.SEARCHCOMPONENT();
        var settings = $.extend({
            placeHolder: 'Search...',
            searchHandler: null,
            searchButtonTitle: 'Search',
            suggestionsMinChar: 2,
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
            template: ''
        }, options);
    };
    bindSearch();
    ExecuteOrDelayUntilScriptLoaded(function() {
        var designMode = document.getElementById('MSOLayout_InDesignMode').value;
        designMode = designMode === "1" ? true : false;
        if (!designMode) {

            searchComp.Init(settings);
        }
    }, "sp.js");
});



// Script for Anonymous User Ribbon Issue Start. Once all the sites are LIVE, we will remove this code from here.

$(document).ready(function() {

    var logContainer = $("#ms-designer-ribbon>span>a.ms-signInLink").length;

    if (logContainer > 0) {
        $("#ms-designer-ribbon").css("background-color", "#0072c6");
    } else {
        $("#ms-designer-ribbon").css("background-color", "#ffffff");
    }
});

// Script for Anonymous User Ribbon Issue End
