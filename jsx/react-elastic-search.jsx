var SearchResultsComponent = React.createClass({
  render: function() {
    var eachResult = function(resultItem) {
        return <div className="column">
            <div className="ui fluid card">
                <div className="image">
                    <img src={resultItem.image}/>
                </div>
                <div className="content">
                    <div className="header">{resultItem.name}</div>
                    <div className="meta">
                        <a>{resultItem.email}</a>
                    </div>

                    <div className="description">
                    </div>
                    <div className="technologies">
                        {resultItem.technologies.split(' ').map(eachTech)}
                    </div>
                </div>
                <div className="extra content">
                    <span className="right floated">
                        {resultItem.phone}
                    </span>
                    <span>
                        <i className="user icon"></i>
                            {resultItem.age} Years
                    </span>
                </div>
            </div>
        </div>;
      };

      var eachTech = function(tech){
          return <a className="ui red label"><i className="tag icon"></i>{tech}</a>;
      };

      return <div className="ui three column grid">{this.props.results.map(eachResult)}</div>;
  }
});

var ElasticSearchApp = React.createClass({
  getInitialState: function() {
      var esClient = new elasticsearch.Client({ host: 'localhost:9200' });
      esClient.ping({
      requestTimeout: 1000,
      hello: "elasticsearch!"
      }, function (error) {
          if (error) {
              console.error('elasticsearch cluster is down!');
          } else {
              console.log('All is well');
          }
      });
    return {
        searchResults: [],
        searchTxt: '',
        es: esClient,
        index: 'team'
        };
  },
  onChange: function(e) {
    this.setState({searchTxt: e.target.value});
  },
  onClick: function(e) {
    e.preventDefault();
    var esResults = [];
    var esClient = this.state.es;

    esClient.search({
            index: this.state.index,
            body: {
               "size": 12000,
               "query": {
                  "match": {
                     "_all": {
                        "query": this.state.searchTxt,
                        "operator": "and"
                     }
                  }
               }
            }
        }, function (error, res) {
                if (error) {
                    console.error("Fucked up!");
                }else if(res){
                    var hits = res.hits.hits;

                    for(var i=0; i < hits.length; i++){
                        esResults.push(hits[i]._source);
                    }
                    this.setState({searchResults: esResults});
                }
        }.bind(this));


  },
    render: function() {
        return (
            <div className="column">
                <form className="" onSubmit={this.onClick} >
                    <div className="ui left fluid icon input">
                        <i className="search icon"></i>
                        <input className="" onChange={this.onChange} value={this.state.searchTxt} type="text" placeholder="Search.."/>
                    </div>
                </form>
                <div className="column centered search-results">
                        <SearchResultsComponent results={this.state.searchResults} />
                </div>
            </div>
        );
    }
});

React.render(<ElasticSearchApp />, document.getElementById('react_elastic_search'));
