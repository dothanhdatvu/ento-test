var App = React.createClass({
  /*
   ** Get the latest number of installs.
  */
  loadInstallsNumber: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.length}); // assign data.
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  /*
   ** Update the number of installs.
  */
  updateInstallsNumber: function() {
    var id = localStorage.getItem('time').toString();
    var state = localStorage.getItem('add-ons');
    var data = {
      id: id,
      state: state
    }

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        var newState = (state == 'enabled') ? 'disabled' : 'enabled';

        // update the state of installation of add-ons.
        localStorage.setItem('add-ons', newState);
        this.setState({addonState: localStorage.getItem('add-ons')});

        // enable checkbox.
        $('.switch input').removeAttr('disabled');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  /*
   ** Check local storage and assign new value if they are empty.
  */
  checkLocalStorage: function() {
    // this indicates whether add-ons are installed.
    if (!localStorage.getItem('add-ons')) {
      localStorage.setItem('add-ons', 'disabled');
    }

    // this serves as a unique id for each browser.
    if (!localStorage.getItem('time')) {
      localStorage.setItem('time', Date.now());
    }

    this.setState({addonState: localStorage.getItem('add-ons')});
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadInstallsNumber();
    this.checkLocalStorage();

    // load number of installs every second.
    setInterval(this.loadInstallsNumber, this.props.pollInterval);
  },
  render: function() {
    return (
      <div>
        <div id="add-ons" className={this.state.addonState}>
          <h1>Add-ons</h1>
          <CheckMark />
          <Paragraph data='A collection of add-ons to superchange your account such as Dropbox, Google Drive + more.' />
          <ToggleSwitch handleUpdate={this.updateInstallsNumber} />
        </div>
        <Divider />
        <div id="installs-number">
          <h2>Number of installs</h2>
          <InstallCounter data={this.state.data} />
          <Paragraph data='Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.' />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App url="/api/installs" pollInterval={1000} />,
  document.getElementById('main')
);
