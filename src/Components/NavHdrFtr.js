import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  //Divider,
  Grid,
  Header,
  Icon,
  //Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LogoAvatar from './LogoAvatar';


// class NavHdrFtr extends React.Component {
//   render() {
//     return (<h1>NavHdrFtr Page</h1>);
//   }
// }

// <Image src='/images/logo4.png'
//   className='rounded'
//
//   floated='left'
//   style={{ marginLeft: '1em', marginBottom: '0em', width: '96px' }}
// />

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  state = { activeItem: 'Home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
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
                pointing={!fixed}
                secondary={!fixed}
                className='center'
                size='large'
                style={{ marginTop: '0em', border: 'none' }}
              >
                <Container style={{ alignItems: 'center'}}>
                  { fixed &&
                    <Menu.Item
                      name='Home'
                      as={Link} to='/'
                      active={activeItem === 'Home'}
                      onClick={this.handleItemClick}
                    />
                  }
                  <Menu.Item
                    name='Buy'
                    as={Link} to='/map'
                    active={activeItem === 'Buy'}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    name='Sell'
                    as={Link} to='/map'
                    active={activeItem === 'Sell'}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    name='Rent'
                    as={Link} to='/map'
                    active={activeItem === 'Rent'}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    name='More'
                    as={Link} to='/map'
                    active={activeItem === 'More'}
                    onClick={this.handleItemClick}
                  />
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
/* orig:
<Menu.Item position='right' name='blah' onClick={this.handleItemClick}>
  <Button as={Link} to='/login' inverted={!fixed}>
    Log in
  </Button>
  <Button as={Link} to='/signup' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
    Sign Up
  </Button>
</Menu.Item>
*/
//            <HomepageHeading />

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

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
          <Sidebar as={Menu} animation='uncover' inverted vertical visible={sidebarOpened}>
            <Menu.Item as={Link} to='/' active>Home</Menu.Item>
            <Menu.Item as={Link} to='/map'>Buy</Menu.Item>
            <Menu.Item as={Link} to='/map'>Sell</Menu.Item>
            <Menu.Item as={Link} to='/map'>Rent</Menu.Item>
            <Menu.Item as={Link} to='/map'>More</Menu.Item>
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
/* orig, after menu.item close
<Menu.Item position='right'>
  <Button as='a' inverted>
    Log in
  </Button>
  <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
    Sign Up
  </Button>
</Menu.Item>
*/
//              <HomepageHeading mobile />

MobileContainer.propTypes = {
  children: PropTypes.node,
}
//
const NavHdrFtr = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
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
  </div>
)

NavHdrFtr.propTypes = {
  children: PropTypes.node,
}

export default NavHdrFtr;

/* Notes:
Using rel="noreferrer noopener" on 'a' links above (when using
target='_blank') in order to avoid security issues; see
https://html.spec.whatwg.org/multipage/links.html#link-type-noopener.


*/
