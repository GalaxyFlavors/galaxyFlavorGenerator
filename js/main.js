'use strict';

var sheds = [{
  name: 'Main ToolShed',
  shortName: 'main',
  uri: 'https://toolshed.g2.bx.psu.edu/',
  url: 'https://toolshed.g2.bx.psu.edu/api/repositories?q='
}];

//        {
//            name: 'Test ToolShed',
//            shortName: 'test',
//            uri: 'https://testtoolshed.g2.bx.psu.edu/',
//            url: 'https://testtoolshed.g2.bx.psu.edu/api/repositories?q='
//        }
var RepositoriesFound = React.createClass({
  displayName: 'RepositoriesFound',

  render: function render() {
    var className = this.props.found.length > 0 ? 'border' : '';
    return React.createElement(
      'ul',
      { className: className },
      this.props.found.map(function (item, i) {
        var zebra = isEvenNumber(i) ? '' : 'zebra';
        var toolTipText = item.description;
        var repoButton = '';
        if (item.added) {
          return React.createElement(
            'li',
            { className: zebra, 'data-tooltip': toolTipText },
            React.createElement(
              'span',
              null,
              item.name
            ),
            React.createElement(
              'div',
              { className: 'button-block' },
              React.createElement(
                'span',
                { className: 'button thin right disabled' },
                'Added'
              )
            )
          );
        } else {
          if (item.remote_repository_url && item.remote_repository_url.length > 0) {
            repoButton = React.createElement(
              'a',
              { href: item.remote_repository_url, target: '_blank',
                className: 'button primary thin right' },
              'Source Code'
            );
          }
          return React.createElement(
            'li',
            { className: zebra, 'data-tooltip': toolTipText },
            React.createElement(
              'span',
              null,
              item.name
            ),
            React.createElement(
              'div',
              { className: 'button-block' },
              React.createElement(
                'button',
                { className: 'success thin right',
                  onClick: this.props.addToAdded.bind(this, item) },
                'Add'
              ),
              repoButton
            )
          );
        }
      }, this)
    );
  }
});

var SearchInput = React.createClass({
  displayName: 'SearchInput',

  render: function render() {
    var options = [];
    for (var i = 0; i < sheds.length; i++) {
      options.push(React.createElement(
        'option',
        { value: i },
        sheds[i].name
      ));
    }

    return React.createElement(
      'div',
      { className: 'row squish' },
      React.createElement(
        'div',
        { className: 'col8' },
        React.createElement('input', { type: 'text', key: 'searchBox', onChange: this.props.onSearchChange, min: '3' })
      ),
      React.createElement(
        'div',
        { className: 'col4' },
        React.createElement(
          'select',
          { onChange: this.props.changeShed },
          options
        )
      )
    );
  }
});

var Loading = React.createClass({
  displayName: 'Loading',

  render: function render() {
    var spinnerClass = this.props.loading ? 'sk-fading-circle' : '';
    return React.createElement(
      'div',
      { className: spinnerClass },
      React.createElement('div', { className: 'sk-circle1 sk-circle' }),
      React.createElement('div', { className: 'sk-circle2 sk-circle' }),
      React.createElement('div', { className: 'sk-circle3 sk-circle' }),
      React.createElement('div', { className: 'sk-circle4 sk-circle' }),
      React.createElement('div', { className: 'sk-circle5 sk-circle' }),
      React.createElement('div', { className: 'sk-circle6 sk-circle' }),
      React.createElement('div', { className: 'sk-circle7 sk-circle' }),
      React.createElement('div', { className: 'sk-circle8 sk-circle' }),
      React.createElement('div', { className: 'sk-circle9 sk-circle' }),
      React.createElement('div', { className: 'sk-circle10 sk-circle' }),
      React.createElement('div', { className: 'sk-circle11 sk-circle' }),
      React.createElement('div', { className: 'sk-circle12 sk-circle' })
    );
  }
});

var RepositoriessList = React.createClass({
  displayName: 'RepositoriessList',

  render: function render() {
    var className = this.props.added.length > 0 ? 'border' : '';
    var self = this;
    return React.createElement(
      'ul',
      { className: className },
      this.props.added.map(function (item, i) {
        var zebra = isEvenNumber(i) ? '' : 'zebra';
        //                        console.log(item);
        return React.createElement(
          'li',
          { className: zebra },
          React.createElement(
            'span',
            null,
            item.name
          ),
          React.createElement(
            'div',
            { className: 'button-block' },
            React.createElement(
              'button',
              { className: 'error thin right',
                onClick: self.props.removeFromAdded.bind(this, item) },
              'Remove'
            ),
            React.createElement(
              'div',
              { className: 'shed-badge' },
              item.shed.shortName
            )
          )
        );
      })
    );
  }
});

var FlavorApp = React.createClass({
  displayName: 'FlavorApp',

  getInitialState: function getInitialState() {
    return {
      added: [],
      found: [],
      loading: false,
      searchText: '',
      shed: sheds[0],
      searchCount: 0,
      GALAXY_CONFIG_BRAND: 'Galaxy'
    };
  },
  onSearchChange: function onSearchChange(e) {
    this.setState({ searchText: e.target.value });
    doASearch(this);
  },
  addToAdded: function addToAdded(a) {
    var exists = this.state.added.filter(function (aa) {
      return aa.repo_owner_username === a.repo_owner_username && aa.name === a.name;
    }).length > 0;
    if (!exists) {
      var newAdded = this.state.added.concat([a]);
      var self = this;
      var newFound = [];
      this.state.found.map(function (f) {

        if (f.repo_owner_username === a.repo_owner_username && f.name === a.name) {
          //                    if (f.id == a.id) {
          f.added = true;
        }
        f.shed = self.state.shed;
        newFound.push(f);
      });
      this.setState({ added: newAdded, found: newFound });
    }
  },
  changeBrand: function changeBrand(e) {
    console.log(e.target.value);
    var newBrand = e.target.value;
    if (newBrand.length > 0) {
      this.setState({ GALAXY_CONFIG_BRAND: newBrand });
    }
  },
  changeShed: function changeShed(e) {

    var newShed = sheds[parseInt(e.target.value)];
    this.setState({ shed: newShed });
    doASearch(this);
  },
  removeFromAdded: function removeFromAdded(a) {

    var newState = this.state.added.filter(function (aa) {
      return a != aa;
    });

    var newFound = [];
    this.state.found.map(function (f) {
      //                if (f.id == a.id) {
      if (f.repo_owner_username === a.repo_owner_username && f.name === a.name) {
        f.added = false;
      }
      newFound.push(f);
    });

    this.setState({ added: newState, found: newFound });
  },
  render: function render() {
    var hiddenClass = 'hidden';
    if (this.state.added.length > 0) {
      hiddenClass = '';
    }
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'h2',
        null,
        'Please add repositories you would like to have in your Galaxy'
      ),
      React.createElement(
        'div',
        { id: 'search' },
        React.createElement(SearchInput, { onSearchChange: this.onSearchChange, changeShed: this.changeShed }),
        React.createElement(Loading, { loading: this.state.loading, key: 'loading' }),
        React.createElement(RepositoriesFound, { found: this.state.found, addToAdded: this.addToAdded,
          key: 'repositoriesFound' })
      ),
      React.createElement('hr', null),
      React.createElement(
        'h3',
        null,
        'Config'
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col12' },
          React.createElement(
            'label',
            null,
            'GALAXY_CONFIG_BRAND'
          ),
          React.createElement('input', { type: 'text', placeholder: 'Galaxy', onChange: this.changeBrand }),
          React.createElement(
            'label',
            null,
            'Galaxy release'
          ),
          React.createElement(
            'select',
            null,
            React.createElement(
              'option',
              null,
              '15.05'
            )
          )
        )
      ),
      React.createElement('hr', null),
      React.createElement(
        'div',
        { className: hiddenClass },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col12' },
            React.createElement(
              'h3',
              { className: 'no-margin-top' },
              'Your Galaxy will have the following:'
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col8' },
          React.createElement(
            'div',
            { id: 'repositories-added' },
            React.createElement(RepositoriessList, { added: this.state.added,
              removeFromAdded: this.removeFromAdded })
          )
        ),
        React.createElement(
          'div',
          { className: 'col4' },
          React.createElement(
            'button',
            { className: 'button full-width',
              onClick: generateDockerFile.bind(this, this.state) },
            'Give me a Docker'
          ),
          React.createElement(
            'button',
            { className: 'button full-width', disabled: true },
            'Give me a VM'
          ),
          React.createElement(
            'button',
            { className: 'button full-width', disabled: true },
            'Give me a Cloud'
          )
        )
      )
    );
  }
});
//RISE!!
React.render(React.createElement(FlavorApp, null), document.getElementById("app"));
'use strict';

var searchResultsDiv = $('#search-results');

var currentSearch;

function inArray(array, repository) {
  return array.filter(function (a) {
      return a.repo_owner_username === repository.repo_owner_username && a.name === repository.name;
    }).length > 0

}

function doASearch(self) {
  if (self.state.searchText.length >= 3) {
    var currentSearch = self.state.searchCount + 1;
    self.setState({searchCount: currentSearch});
    self.setState({loading: true});
    search(self.state.searchText, self.state.shed.url, function (res) {
      if (self.state.searchCount == currentSearch) {
        var filteredRes = [];
        res.map(function (f) {
          self.state.added.filter(function (a) {
            if (f.id == a.id) {
              f.added = true;
            }
          });
          filteredRes.push(f);
        });
        self.setState({found: filteredRes});
        self.setState({loading: false});
      } else {
        console.log('not returning the results of this search');
      }
    });
  }
}

function search(query, shed, cb) {
  var fullURL = shed + query + '&jsonp=true';
  if (currentSearch) {
    currentSearch.abort();
    //console.log('aborted');
  }
  currentSearch = $.ajax({
    type: 'GET',
    url: fullURL,
    crossDomain: true,
    dataType: 'jsonp',
    success: function (json) {
      var results = [];
      json.hits.map(function (hit) {
        if (!inArray(results, hit.repository)) {
          results.push(hit.repository);
        }
      });
      //console.log(JSON.stringify(results));
      cb(results);
    }
  })
}


function uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for (var i = 0; i < len; i++) {
    var item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

function fillSearchResults(results) {
  searchResultsDiv.empty();
  results.map(function (result) {
    searchResultsDiv.append('<p>' + result.name + '</p>');
    searchResultsDiv.append(result.name);
  });
}


$('#search-input').on('input', function () {
  var text = $(this).val();
  search(text);
});

function isEvenNumber(n) {
  return isNumber(n) && (n % 2 == 0);
}
function isNumber(n) {
  return n == parseFloat(n);
}

function generateDockerFile(state) {

  var DockerFile = '';

  //TODO bug! space at start

  DockerFile += 'FROM bgruening/galaxy-stable:15.05\n\n';
  DockerFile += 'MAINTAINER Björn A. Grüning, bjoern.gruening@gmail.com\n\n';
  DockerFile += 'ENV GALAXY_CONFIG_BRAND "' + state.GALAXY_CONFIG_BRAND + '"\n\n';
  DockerFile += 'WORKDIR /galaxy-central\n\n';

  var repositories = '';
  var installURL = state.shed.uri;

  if (state.added.length >= 1) {
    repositories += 'RUN install-repository \\ \n';
    var i = 0;
    state.added.forEach(function (a) {
      i++;
      var slash = '\\';
      if (i == state.added.length) {
        slash = '';
      }
      repositories += '    "--url ' + installURL + ' -o ' + a.repo_owner_username + ' --name ' + a.name + '" ' + slash + '\n';
    });
  }


  DockerFile += repositories + '\n';

  DockerFile += 'VOLUME ["/export/", "/data/", "/var/lib/docker"]\n\n';

  DockerFile += 'EXPOSE :80\n';
  DockerFile += 'EXPOSE :21\n';
  DockerFile += 'EXPOSE :8080\n\n';

  DockerFile += 'CMD ["/usr/bin/startup"]\n';

//console.log(DockerFile);
  downloadString(DockerFile, 'Dockerfile');
}

function downloadString(string, fileName) {
  var blob = new Blob([string]);
  saveAs(blob, fileName);
}

//
//callback({
//  "total_results": "7",
//  "hits": [{
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 4.096626108395544,
//    "repository": {
//      "times_downloaded": 48,
//      "last_updated": "less than a month",
//      "name": "kraken",
//      "approved": "no",
//      "id": "770346036bf7f7de",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-07-14 01:28 PM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/tool_collections/kraken/kraken/",
//      "description": "Installs the kraken tool wrapper for taxonomic designation."
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 4.011279731137303,
//    "repository": {
//      "times_downloaded": 47,
//      "last_updated": "today",
//      "name": "kraken_translate",
//      "approved": "no",
//      "id": "80475298f0e95da4",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-08-04 09:45 AM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/tool_collections/kraken/kraken_translate/",
//      "description": "Contains a galaxy tool wrapper for the kraken-translate command."
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 3.755240599362582,
//    "repository": {
//      "times_downloaded": 44,
//      "last_updated": "",
//      "name": "kraken_filter",
//      "approved": "no",
//      "id": "8a8cf0a88b964e8b",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-08-04 02:29 PM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/tool_collections/kraken/kraken_filter/",
//      "description": "Contains a tool wrapper for kraken's confidence filter."
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 3.6698942221043414,
//    "repository": {
//      "times_downloaded": 43,
//      "last_updated": "less than a month",
//      "name": "kraken_report",
//      "approved": "no",
//      "id": "055e91fa778827e4",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-07-27 06:16 PM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/tool_collections/kraken/kraken_report/",
//      "description": "Contains galaxy tool wrapper for kraken-report."
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 2.9871232040384172,
//    "repository": {
//      "times_downloaded": 35,
//      "last_updated": "less than a year",
//      "name": "data_manager_build_kraken_database",
//      "approved": "no",
//      "id": "fc8726d8858f9e68",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-06-23 11:07 PM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/data_managers/data_manager_build_kraken_database/",
//      "description": "Contains a data manager that defines and populates the kraken_databases tool data table."
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 2.383615528208085,
//    "repository": {
//      "times_downloaded": 22,
//      "last_updated": "less than a month",
//      "name": "kraken_tools",
//      "approved": "no",
//      "id": "69837458703aa5ff",
//      "homepage_url": "",
//      "full_last_updated": "2015-07-12 07:34 AM",
//      "repo_owner_username": "cschu",
//      "long_description": "Naive Kraken wrapper and additional Kraken tools for Galaxy (under development and in use since about December '14, unfortunately I am a lazy person, when it comes down to publishing things >:( )",
//      "remote_repository_url": "https://github.com/cschu/kraken",
//      "description": "Tools and wrapper for kraken taxonomic classifier"
//    }
//  }, {
//    "matched_terms": [["long_description", "kraken"]],
//    "score": 1.2801956588736074,
//    "repository": {
//      "times_downloaded": 15,
//      "last_updated": "less than a year",
//      "name": "suite_kraken_0_10_5",
//      "approved": "no",
//      "id": "faf8fb4df521f3f2",
//      "homepage_url": "https://github.com/galaxyproject/tools-devteam/",
//      "full_last_updated": "2015-06-30 08:39 PM",
//      "repo_owner_username": "devteam",
//      "long_description": "Kraken is a system for assigning taxonomic labels to short DNA sequences, usually obtained through metagenomic studies. Previous attempts by other bioinformatics software to accomplish this task have often used sequence alignment or machine learning techniques that were quite slow, leading to the development of less sensitive but much faster abundance estimation programs. Kraken aims to achieve high sensitivity and high speed by utilizing exact alignments of k-mers and a novel classification algorithm.",
//      "remote_repository_url": "https://github.com/galaxyproject/tools-devteam/blob/master/suites/suite_kraken_0_10_5/",
//      "description": "A suite of Galaxy utilities associated with version 0.10.5 of the Kraken tool."
//    }
//  }],
//  "hostname": "https://testtoolshed.g2.bx.psu.edu/",
//  "page": "1",
//  "page_size": "10"
//});
