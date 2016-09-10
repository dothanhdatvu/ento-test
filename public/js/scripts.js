var Heading = React.createClass({
  render: function() {
    return (
      <h3>
        Add-ons
      </h3>
    );
  }
});

var Description = React.createClass({
  render: function() {
    return (
      <p>
        A collection of add-ons to superchange your account such as Dropbox,
        Google Drive + more.
      </p>
    );
  }
});

var ToggleSwitch = React.createClass({
  handleToggle: function() {
    this.props.handleUpdate();
  },
  getInitialState: function() {
    var enabled = false;

    if (localStorage.getItem('add-ons') == 'enabled') {
      enabled = true;
    }

    return {checked: enabled};
  },
  render: function() {
    return (
      <div>
        <label className="switch">
          <input type="checkbox" onChange={this.handleToggle} defaultChecked={this.state.checked} />
          <div className="slider round"></div>
        </label>
      </div>
    );
  }
});

var InstallCounter = React.createClass({
  render: function() {
    return (
      <div>
        <h4>Number of installs</h4>
        <div id="counter">
          <span>{this.props.data}</span>
        </div>
      </div>
    );
  }
});

var AdText = React.createClass({
  render: function() {
    return (
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    );
  }
});

var ActivationPage = React.createClass({
  loadInstallsNumber: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.length});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
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

        localStorage.setItem('add-ons', newState);
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  checkLocalStorage: function() {
    if (!localStorage.getItem('add-ons')) {
      localStorage.setItem('add-ons', 'disabled');
    }

    if (!localStorage.getItem('time')) {
      localStorage.setItem('time', Date.now());
    }
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadInstallsNumber();
    this.checkLocalStorage();

    setInterval(this.loadInstallsNumber, this.props.pollInterval);
  },
  render: function() {
    return (
      <div>
        <Heading />
        <Description />
        <ToggleSwitch handleUpdate={this.updateInstallsNumber} />
        <InstallCounter data={this.state.data} />
        <AdText />
      </div>
    );
  }
});

ReactDOM.render(
  <ActivationPage url="/api/installs" pollInterval={2000} />,
  document.getElementById('main')
);
