//import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Card,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Modal,
  Radio,
  Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import './HomePage.css';
import faker from 'faker';
import _ from 'lodash';

/* eslint-disable react/no-multi-comp */

export default class HomePage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      bsrValue: 'buy',    // default to set radio button
      openModal: false,   // default for modal for "Find Out How" btn
      redirect: false
    };
    this.searchTerm = "";
  }
  handleChange = (e, { value }) => this.setState({ bsrValue: value });
  avatar1 = faker.image.avatar();
  avatar2 = faker.image.avatar();
  showModal = () => this.setState({ openModal: true });
  closeModal = () => this.setState({ openModal: false });
  searchTermChanging = (e) => {
    //console.log("you searched for " + e.target.value);
    this.searchTerm = e.target.value;
  }
  handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log("Enter pressed, search for " + this.searchTerm);
      this.setState({ redirect: true });
    }
  }
  searchNow = (e) => {
    e.preventDefault();
    console.log("You clicked search icon, searching for " + this.searchTerm);
    this.setState({ redirect: true });
  }

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
    // Handle if search bar action caused redirect to map or sell pages
    if (this.state.redirect) {
      console.log("HomePage, render, redirecting to map or sell");
      //this.setState({ redirect: false }); // reset
      if (this.state.bsrValue === 'sell')
      {
        return <Redirect push to={{pathname: "/sell",
          state: { searchTerm: "",
            bsr: this.state.bsrValue } }} />;
      }
      else if (this.state.bsrValue === 'buy')
      {
        return <Redirect push to={{pathname: "/map1",
          state: { searchTerm: this.searchTerm,
            bsr: this.state.bsrValue } }} />;
      }
      return <Redirect push to={{pathname: "/map2",
        state: { searchTerm: this.searchTerm,
          bsr: this.state.bsrValue } }} />;
    }

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
                    <Input icon
                      placeholder="Address, City, Zip, or Neighborhood"
                      onChange={this.searchTermChanging}
                      onKeyPress={this.handleSearchKeyPress}
                      style={{ width: '100%' }}
                    >
                    <input style={{ backgroundColor: '#08befb11',
                      width: '100%', borderRadius: '20px'}}
                      />
                    <Icon name='search' link={true} circular={true}
                      onClick={this.searchNow}/>
                    </Input>
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
                    checked={this.state.bsrValue === 'buy'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Radio
                    style={{  }}
                    label='Sell'
                    name='radioGroup'
                    value='sell'
                    checked={this.state.bsrValue === 'sell'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Radio
                    style={{  }}
                    label='Rent'
                    name='radioGroup'
                    value='rent'
                    checked={this.state.bsrValue === 'rent'}
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
                <Button as={Link} to='/map1' primary>Search Listings</Button>
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
                <Button onClick={this.showModal} primary>Find Out How</Button>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>

        <Modal
          size={"mini"}
          open={this.state.openModal}
          onClose={this.closeModal}
          style={{ height: "auto" }}
        >
          <Modal.Header>Mortgage Information</Modal.Header>
          <Modal.Content>
            <p>We have no mortgage information yet.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Ok"
              onClick={this.closeModal}
            />
          </Modal.Actions>
        </Modal>

      </div>
    )
  }
}
