import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { Redirect } from 'react-router';
import LogoAvatar from './LogoAvatar';

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log("DesktopContainer - props = " + JSON.stringify(props));
    this.state = {
      redirect: false,
      bsrValue: 'buy'
    }
  }

  // Only update state if props change and if state is not yet correct.
  componentDidUpdate = (prevProps, prevState) => {
    console.log ("NavHdr - cdu, prevProps=", prevProps, ", prevState=",
      prevState);
    console.log("NavHdr - cdu, redirect =", this.state.redirect,
      ", bsrValue=", this.state.bsrValue);
    if (this.state.redirect)
      this.setState({ redirect: false }); // reset

    let name = (this.state.bsrValue === 'buy' ? 'Buy' :
      (this.state.bsrValue === 'sell' ? 'Sell' : 'Rent'));
  }

  // NOTE - this function is being deprecated. Use componentDidUpdate instead.
  componentWillReceiveProps = nextprops => {
    console.log("NavHdr - CWRP - props=", nextprops);
  }

  // NOTE - this function is being deprecated.
  componentWillMount = () => {
    console.log("NavHdr - cwm");
  }

  componentDidMount = () => {
    console.log("NavHdr - cdm");
  }

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })
  handleItemClick = (e, { name }) => {
    let bsr = (name === 'Buy' ? 'buy' : (name === 'Sell' ? 'sell' : 'rent'));
    let redirectMe = false;
    if (name === 'Buy' || name === 'Rent')// || name === 'Sell') // TODO - redirect to diff page
      redirectMe = true;
    console.log("NavHdr, handleItemClick, bsr=", bsr, ", name=", name);
    this.setState({ bsrValue: bsr, redirect: redirectMe });
  }

  render() {
    // Handle if search bar action caused redirect to map page
    if (this.state.redirect) {
      console.log("NavHdr, render, redirecting to map or sell");
      if (this.state.bsrValue === 'sell')
      {
        return <Redirect push to={{pathname: "/sell",
          state: { searchTerm: "",
            bsr: this.state.bsrValue } }} />;
      }
      else if (this.state.bsrValue === 'buy')
      {
        return <Redirect push to={{pathname: "/map1",
          state: { searchTerm: "",
            bsr: this.state.bsrValue } }} />;
      }
      let name = (this.state.bsrValue === 'buy' ? 'Buy' : 'Rent');
      return <Redirect push to={{pathname: "/map2",
        state: { searchTerm: "",
          bsr: this.state.bsrValue } }} />;
    }

    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment.Group horizontal
            style={{ borderStyle: 'none',
              backgroundColor: 'rgba(0,0,86,1.0)',
              marginTop: '0em',
              marginBottom: '0em',
              borderRadius: 0,
              border: 'none'}}
            >
            <Segment inverted vertical as={Link} to='/'
              style={{ padding: '0', border: 'none' }}
              name='Home'
              >
              <LogoAvatar />
            </Segment>
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 100, padding: '2em 0em', border: 'none' }}
              vertical
            >
              <Menu
                fixed={fixed ? 'top' : null}
                inverted={!fixed}
                secondary={!fixed}
                className='center'
                size='large'
                style={{ marginTop: '0em', border: 'none', zIndex: '1102' }}
              >
                <Container style={{ alignItems: 'center'}}>
                  { fixed &&
                    <Menu.Item
                      name='Home'
                      as={NavLink} to='/'
                      onClick={this.handleItemClick}
                    />
                  }
                  <Menu.Item
                    name='Buy'
                    as={NavLink} to='/map1'
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    name='Sell'
                    as={NavLink} to='/sell'
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    name='Rent'
                    as={NavLink} to='/map2'
                    onClick={this.handleItemClick}
                  />
                  <Dropdown item text='More'>
                    <Dropdown.Menu style={{zIndex: 1102}}>
                      <Dropdown.Item icon='calculator' text='Calculators' />
                      <Dropdown.Item icon='edit' text='Edit Profile' />
                      <Dropdown.Item icon='globe' text='Choose Language' />
                      <Dropdown.Item icon='settings' text='Account Settings' />
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button as={Link} to='/login' inverted={!fixed}
                    name='blah' onClick={this.handleItemClick}
                    style={{ marginLeft: '0.5em', position: 'absolute',
                      right: '130px'}}>
                    Log in
                  </Button>
                  <Button as={Link} to='/signup' inverted={!fixed}
                    primary={fixed} name='blah2' onClick={this.handleItemClick}
                    style={{ marginLeft: '0.5em', position: 'absolute',
                      right: '20px'}}>
                    Sign Up
                  </Button>
                </Container>
              </Menu>
            </Segment>
          </Segment.Group>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends React.Component {
  constructor(props) {
    super(props);
    //console.log("MobileContainer - props = " + JSON.stringify(props));
    this.state = {}
  }

  handlePusherClick = () => {
    const { sidebarOpened } = this.state
    if (sidebarOpened) this.setState({ sidebarOpened: false })
  }

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='uncover'  vertical visible={sidebarOpened}
            style={{width: '200px'}}
          >
            <Menu.Item as={Link} to='/' >Home</Menu.Item>
            <Menu.Item as={Link} itemname='buy' to='/map1'>Buy</Menu.Item>
            <Menu.Item as={Link} itemname='sell' to='/sell'>Sell</Menu.Item>
            <Menu.Item as={Link} itemname='rent' to='/map2'>Rent</Menu.Item>
            <Dropdown item text='More'>
              <Dropdown.Menu style={{position:'initial',
                marginTop: '10px', borderRadius: '4px'}} >
                <Dropdown.Item icon='edit' text='Edit Profile' />
                <Dropdown.Item icon='globe' text='Choose Language' />
                <Dropdown.Item icon='settings' text='Account Settings' />
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item as={Link} to='/login'>Log in</Menu.Item>
            <Menu.Item as={Link} to='/signup'>Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: '50vh' }}
          >
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 100, padding: '2em 0em',
                backgroundColor: 'rgba(0,0,86,1.0)'}}
              vertical
            >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
              </Menu>
            </Container>
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const NavHdrFtr = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
    <Footer></Footer>
  </div>
)

NavHdrFtr.propTypes = {
  children: PropTypes.node,
}

const Footer = () => (
  <Segment inverted vertical
    style={{ padding: '2em 0em', bottom: '0px', right: '0px',
      position: 'absolute', width: '100%',
      backgroundColor: 'rgba(0,0,86,1.0)' }}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header inverted as='h4' content='About' />
            <List link inverted>
              <List.Item as='a'>Sitemap</List.Item>
              <List.Item as='a'>Privacy</List.Item>
              <List.Item as='a'>Terms & Conditions</List.Item>
              <List.Item as='a'>DMCA Notice</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as='h4' content='Services' />
            <List link inverted>
              <List.Item as='a'>Mortage Rates</List.Item>
              <List.Item as='a'>Mobile App</List.Item>
              <List.Item as='a'>Data Science</List.Item>
              <List.Item as='a'>Agent Search</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
          <Header inverted as='h4' content='Help' />
          <List link inverted>
            <List.Item as='a'>Feedback</List.Item>
            <List.Item as='a'>Contact Us</List.Item>
            <List.Item as='a'>About Us</List.Item>
            <List.Item as='a'>Careers</List.Item>
          </List>
          </Grid.Column>
          <Grid.Column width={7}>
          <Header inverted as='h4' content='Social' />
          <div link="true" inverted="true">
            <a className='item' rel="noreferrer noopener" href='https://facebook.com' target='_blank'>
              <Icon link circular inverted color='blue' name='facebook f'  />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://twitter.com' target='_blank'>
              <Icon link circular inverted color='blue' name='twitter' />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://googleplus.com' target='_blank'>
              <Icon link circular inverted color='blue' name='google plus g' />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://linkedin.com' target='_blank'>
              <Icon link circular inverted color='blue' name='linkedin' />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://instagram.com' target='_blank'>
              <Icon link circular inverted color='blue' name='instagram' />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://pinterest.com' target='_blank'>
              <Icon link circular inverted color='blue' name='pinterest p' />
            </a>
            <a className='item' rel="noreferrer noopener" href='https://youtube.com' target='_blank'>
              <Icon link circular inverted color='blue' name='youtube' />
            </a>
          </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
)


export default NavHdrFtr;

/* Note:
I'm using rel="noreferrer noopener" on 'a' links above (when using
target='_blank') in order to avoid security issues; see
https://html.spec.whatwg.org/multipage/links.html#link-type-noopener.
*/
