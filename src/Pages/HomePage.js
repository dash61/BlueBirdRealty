//import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Card,
  //Container,
  Divider,
  //Form,
  Grid,
  Header,
  Icon,
  Image,
  //List,
  //Menu,
  //Responsive,
  Radio,
  //Search,
  Segment,
  //Sidebar,
  //Visibility,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import faker from 'faker';
import _ from 'lodash';

/*
<style>
    @keyframes back-to-docs {
        0% { transform: translateY(0); }
        50% { transform: translateY(0.35em); }
        100% { transform: translateY(0); }
    }
</style>
<div style="position: fixed; margin: 2em; bottom: 0px; left: 0px; animation: back-to-docs 1.5s ease-in-out infinite; z-index: 6;">
  <a className="ui teal button active" aria-current="page" role="button" href="/layouts">
    <i aria-hidden="true" className="left arrow icon"></i>
    Layouts</a>
  <a target="_blank" className="ui secondary button" role="button" href="https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/HomepageLayout.js">
    <i aria-hidden="true" className="github icon"></i>
    Source</a>
</div>
*/

/* eslint-disable react/no-multi-comp */
/* Heads up! SearchBox uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
// const SearchBox = ({ mobile }) => (
//   <Segment>
//     <Search placeholder='Search countries...' />
//   </Segment>
//   <Container text>
//     <Header
//       as='h1'
//       content='Imagine-a-Company'
//       style={{
//         fontSize: mobile ? '2em' : '4em',
//         fontWeight: 'normal',
//         marginBottom: 0,
//         marginTop: mobile ? '1.5em' : '1em',
//       }}
//     />
//     <Header
//       as='h2'
//       content='Do whatever you want when you want to.'
//       style={{
//         fontSize: mobile ? '1.5em' : '1.7em',
//         fontWeight: 'normal',
//         marginTop: mobile ? '0.5em' : '1.5em',
//       }}
//     />
//     <Button primary size='huge'>
//       Get Started
//       <Icon name='right arrow' />
//     </Button>
//   </Container>
// )
//
// SearchBox.propTypes = {
//   mobile: PropTypes.bool,
// }



export default class HomePage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {value: 'buy'}; // default to set radio button
  }
  handleChange = (e, { value }) => this.setState({ value });
  avatar1 = faker.image.avatar();
  avatar2 = faker.image.avatar();

    // Generate some data - 3 data pieces for the 3 "new listings" area.
	addresses = _.times(3, () => {
      return ({
        streetNum: faker.address.streetAddress(),
        streetName: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zip: faker.address.zipCode()
      });
	});
  //console.log(addresses);


  render() {
    return (
      <div>
        <div className='search-image' style={{height: '500px',
          marginTop:'4em', display:'flex', alignItems:'center'}}>
          <Segment raised padded textAlign='center' style={{width: '70%',
            display: 'flex', background: 'rgba(255,255,255,0.95)',
            flexDirection: 'row',
            marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center'}}>
            <Grid rows={3} style={{}}>
              <Grid.Row style={{ justifyContent: 'center',
                paddingBottom: '0em'}}>
                <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
                  Find Your New Home
                </Header>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: '1.5em' }}>
                <div className="ui category search" style={{width: '100%'}}>
                  <div className="ui icon input search-bar" style={{width: '100%'}}>
                    <input className="prompt" type="text" placeholder="Address, City, Zip, or Neighborhood" />
                    <i className="search icon"></i>
                  </div>
                </div>
              </Grid.Row>
              <Grid.Row columns={3} style={{ paddingTop: '0' }}>
                <Grid.Column>
                  <Radio
                    style={{ }}
                    label='Buy'
                    name='radioGroup'
                    value='buy'
                    checked={this.state.value === 'buy'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Radio
                    style={{  }}
                    label='Sell'
                    name='radioGroup'
                    value='sell'
                    checked={this.state.value === 'sell'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Radio
                    style={{  }}
                    label='Rent'
                    name='radioGroup'
                    value='rent'
                    checked={this.state.value === 'rent'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </div>


        <Header as='h1' style={{ marginTop: '2em', textAlign: 'center'}}>
          New Listings
        </Header>

        <div style={{ margin: '1em'}}>
          <Card.Group style={{ justifyContent: 'center'}}>
            <Card
              image='/images/ac-630580-unsplash1128_752.jpg'
              header='$1000/month'
              meta={'For rent, ' + this.addresses[0].streetNum + ', ' +
                this.addresses[0].city + ', ' +
                this.addresses[0].state + ' ' +
                this.addresses[0].zip}
              description='1 bd, 1 ba, 1050 sq ft'
            />
            <Card
              image='/images/gr-128864-unsplash1224_816.jpg'
              header='$224,000'
              meta={'For sale, ' + this.addresses[1].streetNum + ', ' +
                this.addresses[1].city + ', ' +
                this.addresses[1].state + ' ' +
                this.addresses[1].zip}
              description='2 bd, 2 ba, 1950 sq ft'
            />
            <Card
              image='/images/sw-167099-unsplash1072_712.jpg'
              header='$250,000'
              meta={'For sale, ' + this.addresses[2].streetNum + ', ' +
                this.addresses[2].city + ', ' +
                this.addresses[2].state + ' ' +
                this.addresses[2].zip}
              description='2 bd, 2.5 ba, 2100 sq ft'
            />
          </Card.Group>
        </div>

        <Divider
          as='h2'
          className='header'
          horizontal
          style={{ margin: '3em 0em 0.5em 0em', textTransform: 'uppercase' }}
        >
          Testimonials
        </Divider>

        <Segment style={{ padding: '0em', marginTop: '0em',
          paddingBottom: '1em'}} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "Best Company Ever"
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  <Image avatar src={this.avatar1} />
                  <b>{faker.name.findName()}</b>&nbsp;&nbsp;{faker.name.jobTitle()}
                </p>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "I shouldn't have gone with their competitor."
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  <Image avatar src={this.avatar2} />
                  <b>{faker.name.findName()}</b>&nbsp;&nbsp;{faker.name.jobTitle()}
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment placeholder style={{margin: '6em 2em'}}>
          <Grid rows={2} stackable >

            <Grid.Column verticalAlign='middle'>
              <Grid.Row style={{textAlign: 'center', marginTop: '2em',
                marginBottom: '2.5em'}}>
                <Header icon>
                  <Icon name='home' />
                  Ready to Find Your New Home?
                </Header>
                <Button as={Link} to='/map' primary>Search Listings</Button>
              </Grid.Row>

              <Divider horizontal>&nbsp;</Divider>

              <Grid.Row style={{textAlign: 'center', marginTop: '2.5em',
                marginBottom: '2em'}}>
                <Header icon style={{marginBottom: '0'}}>
                  <Icon name='dollar sign' />
                  Need a Mortgage?
                </Header>
                <p as='h5' style={{marginTop: '0'}}>
                  You can get pre-approved for a loan.
                </p>
                <Button as={Link} to='/map' primary>Find Out How</Button>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>

      </div>
    )
  }
}

/*
//margin: '1em 0em',
// <Search placeholder='Address, City, Zip, or Neighborhood'
//   style={{ width: '100%'}} size='big'
//   noResultsMessage='' resultsRenderer='Null'/>
//style={{marginLeft: 'auto', marginRight: 'auto', width: '60%'}}
//<Image src='/images/bill-williams-17163-unsplash.jpg'/>

<Segment style={{ padding: '4em 0em' }} vertical>
  <Grid container stackable verticalAlign='middle'>
    <Grid.Row>
      <Grid.Column width={8}>
        <Header as='h3' style={{ fontSize: '2em' }}>
          New Listings
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          We can give your company superpowers to do things that they never thought possible.
          Let us delight your customers and empower your needs... through pure data analytics.
        </p>
        <Header as='h3' style={{ fontSize: '2em' }}>
          We Make Bananas That Can Dance
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Yes thats right, you thought it was the stuff of dreams, but even bananas can be
          bioengineered.
        </p>
      </Grid.Column>
      <Grid.Column floated='right' width={6}>
        <Image bordered rounded size='large' src='/images/bill-williams-17163-unsplash.jpg' />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column textAlign='center'>
        <Button size='huge'>Check Them Out</Button>
      </Grid.Column>
    </Grid.Row>
  </Grid>
</Segment>
*/
