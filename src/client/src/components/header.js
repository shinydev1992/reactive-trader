import React from 'react';
import traders from '../classes/traders';
import { Link } from 'react-router';

class Header extends React.Component {

  static propTypes = {
    status: React.PropTypes.bool,
    services: React.PropTypes.object
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

  render(){
    const { status, services } = this.props;

    return <nav className='navbar navbar-default navbar-fixed-top'>
      <Link className='navbar-brand' to='/'>Reactive Trader 2</Link>
      <ul className='nav navbar-nav hidden-xs navbar-left'>
        <li>
          <Link to='/' className='nav-link' activeClassName='active'>Sales</Link>
        </li>
        <li>
          <Link to='/admin' className='nav-link' activeClassName='active'>Admin tool</Link>
        </li>
        <li>
          <Link to='/user' className='nav-link' activeClassName='active'><i className='fa fa-user' /> {traders.code} ({traders.name} {traders.surname})</Link>
        </li>
      </ul>
      <ul className='nav navbar-nav pull-right nav-status'>
        <li>{this.getBrokerStatus(status)}</li>
        {this.getServices(services)}
      </ul>
    </nav>;
  }
}

export default Header;
