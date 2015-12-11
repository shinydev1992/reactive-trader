import React from 'react';
import traders from 'utils/traders';
import { Link } from 'react-router';

class Header extends React.Component {

  static propTypes = {
    status: React.PropTypes.bool,
    services: React.PropTypes.object
  }

  componentWillMount(){
    if (window.fin){
      window.fin.desktop.main(() => this.fin = window.fin.desktop.Window.getCurrent());
    }
  }

  getBrokerStatus(status:boolean){
    return status ? <span className='fa-stack text-success animated fadeIn' title='Online'><i className='fa fa-signal fa-stack-1x'/></span> : <span className='fa-stack' title='Connection offline'><i className='fa fa-signal fa-stack-1x' /><i className='fa fa-ban fa-stack-2x text-danger'/></span>;
  }

  getServices(services:object){
    const resp = [];
    for (let k in services){
      resp.push(services[k] ?
        <li key={k} className='service-status'><i className='fa fa-circle ' title={k + ' ' + services[k] + ' nodes online'} /><i className='node-badge'>{services[k]}</i></li> :
        <li key={k} className='service-status text-danger animated infinite fadeIn'><i className='fa fa-circle-o' title={k + ' offline'} /></li>);
    }

    return resp;
  }

  close(){
    this.fin && this.fin.close();
  }

  minimise(e){
    e && e.preventDefault();
    this.fin && this.fin.minimize();
  }

  maximise(e){
    e && e.preventDefault();
    if (this.fin){
      this.fin.getState(state => {
        switch(state){
          case 'maximized':
          case 'restored':
          case 'minimized':
                this.fin.restore(() => this.fin.bringToFront());
                break;
          default:
                this.fin.maximize();
        }
      });
    }
  }

  handleExternalClick(e){
    if (window.fin){
      e.preventDefault();
      window.fin.desktop.System.openUrlWithBrowser(e.currentTarget.href);
    }
  }

  render(){
    const { status, services } = this.props;

    return <nav className='navbar navbar-default'>
      <a className='navbar-brand navbar-adaptive' href='http://weareadaptive.com/' target='_blank' title='Adaptive Home Page' onClick={(e) => this.handleExternalClick(e)}>
        <img src="images/adaptive-logo-statusbar.png" alt="Adaptive Logo" /></a>
      <a className='navbar-brand navbar-adaptive navbar-openfin' href='http://openfin.co/' target='_blank' title='Open Fin' onClick={(e) => this.handleExternalClick(e)}>
        <img src="images/openfin-logo.png" alt="OpenFin Logo" /></a>
      <Link className='navbar-brand' to='/' title='Home'>
        Reactive Trader 2
      </Link>
      <ul className='nav navbar-nav hidden-xs navbar-left'>
        <li>
          <Link to='/user' className='nav-link' activeClassName='active'><i className='fa fa-user' /> {traders.code} ({traders.name} {traders.surname})</Link>
        </li>
      </ul>
      <nav className="nav navbar-nav chrome-controls pull-right">
        <a title='Minimise' onClick={(e) => this.minimise(e)} href='#'><i className='fa fa-minus-square' /></a>
        <a title='Maximise' onClick={(e) => this.maximise(e)} href='#'><i className='fa fa-plus-square' /></a>
        <a title='Close' onClick={() => this.close()} href='#'><i className="fa fa-times" /></a>
      </nav>
      <ul className='nav navbar-nav pull-right nav-status hidden-xs'>
        <li>{this.getBrokerStatus(status)}</li>
        {this.getServices(services)}
      </ul>
    </nav>;
  }
}

export default Header;
